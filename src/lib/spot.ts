import 'server-only'

import { prisma } from '@/lib/db'

/**
 * Live gold spot price.
 *
 * THE RULE THIS MODULE EXISTS TO ENFORCE: never display a number we are not sure of. A wrong
 * gold price on a gold site is worse than no price at all — it produces confidently wrong
 * valuations, and every downstream bid is anchored to it. So every failure mode here resolves
 * to an explicit non-price state that the UI renders honestly, never to a guess or a stale
 * number presented as live.
 *
 * Free tiers are small (UniRateAPI is 200 req/day), so responses are cached for 15 minutes via
 * Next's fetch cache — about 96 upstream calls a day — and persisted to SpotPriceSnapshot,
 * which doubles as the audit trail for what price a given valuation or bid was made against.
 */

/** 15 minutes. Gold moves intraday but not fast enough to justify burning a free-tier quota. */
const REVALIDATE_SECONDS = 900

/**
 * Sanity band, in cents per troy ounce: $500 – $20,000.
 *
 * This is the most important line in the file. Metal APIs differ on whether they return USD per
 * ounce or ounces per USD, and a misparse yields either ~0.0002 or ~450000 rather than a
 * plausible-but-wrong number. Anything outside this band is treated as a parse failure, not a
 * price. Widen it if gold genuinely moves outside it — do not remove it.
 */
const MIN_SANE_CENTS = 50_000
const MAX_SANE_CENTS = 2_000_000

export type SpotPrice =
  /** No API key configured. The UI must say so plainly rather than render a placeholder number. */
  | { status: 'unconfigured' }
  /** Fresh from the provider. */
  | { status: 'live'; pricePerOztCents: number; fetchedAt: Date; source: string }
  /** Provider unreachable; showing the last good snapshot, with its real age. */
  | { status: 'stale'; pricePerOztCents: number; fetchedAt: Date; source: string }
  /** No key-less path to a trustworthy number. Render nothing numeric. */
  | { status: 'unavailable' }

function toCentsPerOzt(usdPerOzt: number): number | null {
  if (!Number.isFinite(usdPerOzt) || usdPerOzt <= 0) return null
  const cents = Math.round(usdPerOzt * 100)
  if (cents < MIN_SANE_CENTS || cents > MAX_SANE_CENTS) return null
  return cents
}

/**
 * Pull a USD-per-troy-ounce figure out of a provider response.
 *
 * Written defensively across the shapes these APIs actually use, because they disagree:
 * GoldAPI.io returns `{ price: 4537.77 }` (USD per ounce), while MetalpriceAPI returns
 * `{ rates: { XAU: 0.00022 } }` (ounces per USD) alongside a `USDXAU` convenience key.
 * Anything that does not land inside the sanity band is rejected rather than displayed.
 *
 * VERIFY THIS against the live API once a key exists — these shapes are from documentation,
 * not from a response this code has actually seen.
 */
function extractUsdPerOzt(payload: unknown): number | null {
  if (typeof payload !== 'object' || payload === null) return null
  const data = payload as Record<string, unknown>

  // GoldAPI.io: { price: 4537.77 }
  if (typeof data.price === 'number' && toCentsPerOzt(data.price)) return data.price

  const rates = data.rates
  if (typeof rates === 'object' && rates !== null) {
    const r = rates as Record<string, unknown>

    // MetalpriceAPI convenience key: USD per XAU, already the right way up.
    if (typeof r.USDXAU === 'number' && toCentsPerOzt(r.USDXAU)) return r.USDXAU

    // Inverted form: XAU per USD. Invert it, then let the sanity band judge the result.
    if (typeof r.XAU === 'number' && r.XAU > 0) {
      const inverted = 1 / r.XAU
      if (toCentsPerOzt(inverted)) return inverted
    }
  }
  return null
}

function providerRequest(): { url: string; headers: HeadersInit; source: string } | null {
  const key = process.env.GOLD_API_KEY
  if (!key) return null
  const provider = (process.env.GOLD_API_PROVIDER ?? 'metalpriceapi').toLowerCase()

  if (provider === 'goldapi' || provider === 'goldapi.io') {
    return {
      url: 'https://www.goldapi.io/api/XAU/USD',
      headers: { 'x-access-token': key, 'Content-Type': 'application/json' },
      source: 'goldapi.io',
    }
  }

  return {
    url: `https://api.metalpriceapi.com/v1/latest?api_key=${encodeURIComponent(key)}&base=USD&currencies=XAU`,
    headers: { Accept: 'application/json' },
    source: 'metalpriceapi',
  }
}

/** Last good snapshot from the database, if there is one. */
async function lastSnapshot(): Promise<{ cents: number; fetchedAt: Date; source: string } | null> {
  try {
    const row = await prisma.spotPriceSnapshot.findFirst({
      where: { metal: 'XAU' },
      orderBy: { fetchedAt: 'desc' },
    })
    if (!row) return null
    return { cents: row.pricePerOztCents, fetchedAt: row.fetchedAt, source: row.source }
  } catch {
    // No database configured yet, or it is unreachable. Not a reason to crash a public page.
    return null
  }
}

/**
 * Current spot price. Safe to call from any server component — it never throws and never
 * returns a number it is not confident in.
 */
export async function getSpotPrice(): Promise<SpotPrice> {
  const request = providerRequest()
  if (!request) return { status: 'unconfigured' }

  try {
    const response = await fetch(request.url, {
      headers: request.headers,
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!response.ok) throw new Error(`Provider returned ${response.status}`)

    const usdPerOzt = extractUsdPerOzt(await response.json())
    const cents = usdPerOzt === null ? null : toCentsPerOzt(usdPerOzt)
    if (cents === null) throw new Error('Could not parse a sane price from the provider response')

    const fetchedAt = new Date()

    // Persist for the audit trail. Best-effort: a logging failure must not take down the page.
    try {
      await prisma.spotPriceSnapshot.create({
        data: { metal: 'XAU', pricePerOztCents: cents, source: request.source, fetchedAt },
      })
    } catch {
      /* no database yet — the live price is still good */
    }

    return { status: 'live', pricePerOztCents: cents, fetchedAt, source: request.source }
  } catch {
    const previous = await lastSnapshot()
    if (previous) {
      return {
        status: 'stale',
        pricePerOztCents: previous.cents,
        fetchedAt: previous.fetchedAt,
        source: previous.source,
      }
    }
    return { status: 'unavailable' }
  }
}

/** Narrowing helper — true when there is a number we are willing to put on screen. */
export function hasPrice(
  spot: SpotPrice
): spot is Extract<SpotPrice, { pricePerOztCents: number }> {
  return spot.status === 'live' || spot.status === 'stale'
}
