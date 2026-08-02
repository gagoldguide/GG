/**
 * Money and rate arithmetic. Integers only.
 *
 * RULES THIS MODULE ENFORCES
 *   * Money is `number` holding whole US cents. Never dollars, never a float.
 *   * Rates are basis points (bps). 10000 bps = 100%. 3000 bps = 30%.
 *   * Every function that returns money returns an integer, rounded exactly once, at the end.
 *
 * Why: a float commission is a rounding bug that stays invisible until a publisher disputes
 * a payout — at which point the money has already been sent and the trust is already gone.
 */

/** 100% expressed in basis points. */
export const BPS_SCALE = 10_000

/** CJ's network fee is ~30% of the publisher commission; that is our default. */
export const DEFAULT_NETWORK_FEE_BPS = 3_000

export class MoneyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MoneyError'
  }
}

/**
 * Guard at every boundary. A non-integer reaching the money path means a float crept in
 * upstream, and the correct response is to fail loudly rather than round it away silently.
 */
export function assertCents(value: number, label = 'amount'): number {
  if (!Number.isFinite(value)) throw new MoneyError(`${label} must be finite, got ${value}`)
  if (!Number.isInteger(value)) throw new MoneyError(`${label} must be whole cents, got ${value}`)
  if (!Number.isSafeInteger(value)) throw new MoneyError(`${label} exceeds safe integer range`)
  return value
}

export function assertBps(value: number, label = 'rate'): number {
  if (!Number.isInteger(value)) throw new MoneyError(`${label} must be integer bps, got ${value}`)
  if (value < 0) throw new MoneyError(`${label} must not be negative, got ${value}`)
  return value
}

/**
 * Round half away from zero, so 0.5 -> 1 and -0.5 -> -1.
 * JS's Math.round rounds half UP (-0.5 -> -0), which is asymmetric; reversals and refunds are
 * negative amounts, and we want a reversal to be the exact mirror of the charge it undoes.
 */
export function roundHalfAwayFromZero(value: number): number {
  return value < 0 ? -Math.round(-value) : Math.round(value)
}

/** Apply a bps rate to a cent amount. The single rounding point in any commission chain. */
export function applyBps(amountCents: number, bps: number): number {
  assertCents(amountCents, 'amountCents')
  assertBps(bps, 'bps')
  return roundHalfAwayFromZero((amountCents * bps) / BPS_SCALE)
}

/**
 * The house's cut. Charged to the gold buyer ON TOP of the publisher commission — this is how
 * CJ earns, and copying it exactly is the point of the whole model.
 */
export function networkFeeCents(
  publisherCommissionCents: number,
  networkFeeBps: number = DEFAULT_NETWORK_FEE_BPS
): number {
  return applyBps(publisherCommissionCents, networkFeeBps)
}

/** What the gold buyer is billed in total for one attributed conversion. */
export function buyerChargeCents(publisherCommissionCents: number, feeCents: number): number {
  assertCents(publisherCommissionCents, 'publisherCommissionCents')
  assertCents(feeCents, 'networkFeeCents')
  return publisherCommissionCents + feeCents
}

/**
 * Split one conversion into its two money lines in a single call, so the fee can never be
 * computed against a different commission than the one that gets stored.
 */
export function splitConversion(
  publisherCommissionCents: number,
  networkFeeBps: number = DEFAULT_NETWORK_FEE_BPS
): { publisherCommissionCents: number; networkFeeCents: number; buyerChargeCents: number } {
  const commission = assertCents(publisherCommissionCents, 'publisherCommissionCents')
  const fee = networkFeeCents(commission, networkFeeBps)
  return {
    publisherCommissionCents: commission,
    networkFeeCents: fee,
    buyerChargeCents: commission + fee,
  }
}

/* ------------------------------------------------------------------ presentation */

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Display only. Never feed the output of this back into a calculation. */
export function formatUsd(cents: number): string {
  assertCents(cents, 'cents')
  return USD.format(cents / 100)
}

/** Whole-dollar display for large headline figures (spot price tiles, stat bands). */
export function formatUsdCompact(cents: number): string {
  assertCents(cents, 'cents')
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

/** Render a bps rate as a percentage string: 3000 -> "30%", 575 -> "5.75%". */
export function formatBps(bps: number): string {
  assertBps(bps, 'bps')
  const pct = bps / 100
  return `${Number.isInteger(pct) ? pct : pct.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}%`
}

/** Parse user-entered dollars ("1,234.56", "$1234.56") into cents. Throws on nonsense. */
export function parseDollarsToCents(input: string): number {
  const cleaned = input.replace(/[$,\s]/g, '')
  if (!/^-?\d+(\.\d{1,2})?$/.test(cleaned)) {
    throw new MoneyError(`Not a valid dollar amount: "${input}"`)
  }
  // Build from the string rather than multiplying a float by 100: (19.99 * 100) is 1998.9999…
  const negative = cleaned.startsWith('-')
  const [whole, frac = ''] = cleaned.replace('-', '').split('.')
  const cents = Number(whole) * 100 + Number(frac.padEnd(2, '0'))
  return negative ? -cents : cents
}
