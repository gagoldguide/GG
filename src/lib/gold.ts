/**
 * Gold weight, purity and valuation.
 *
 * These constants are exact. Getting one wrong does not produce an obviously broken page —
 * it produces a plausible number that is quietly wrong on every quote, every bid and every
 * percent-of-sale commission on the site.
 *
 * STORAGE CONTRACT (mirrors prisma/schema.prisma)
 *   * Weight is an integer count of MILLIGRAMS. Grams are presentation.
 *   * Spot price is an integer count of CENTS PER TROY OUNCE.
 *   * Purity is never stored. It is derived from the karat as an exact fraction, because a
 *     purity rounded to 4 decimals shifts the value of a kilo lot by real dollars.
 */
import { assertCents, roundHalfAwayFromZero, applyBps, assertBps } from './money'

/** Exact, by definition of the international troy ounce. */
export const TROY_OUNCE_GRAMS = 31.1034768

/** Exact: 1/20 of a troy ounce. The unit US jewellers actually quote scrap in. */
export const PENNYWEIGHT_GRAMS = 1.55517384

export const TROY_OUNCE_MG = TROY_OUNCE_GRAMS * 1000
export const PENNYWEIGHT_MG = PENNYWEIGHT_GRAMS * 1000

export type Karat = 'K10' | 'K14' | 'K18' | 'K22' | 'K24'

/**
 * Purity as an EXACT fraction, not a decimal.
 *
 * 10K/14K/18K/22K are defined as karat/24. 24K is the exception: commercially refined "fine"
 * gold is .999, not a mathematical 1.0, and scrap buyers price it that way — treating 24K as
 * 100% pure overstates every 24K valuation by 0.1%.
 */
export const KARAT_PURITY: Record<Karat, { num: number; den: number }> = {
  K10: { num: 10, den: 24 },
  K14: { num: 14, den: 24 },
  K18: { num: 18, den: 24 },
  K22: { num: 22, den: 24 },
  K24: { num: 999, den: 1000 },
}

/** Human label for UI. */
export const KARAT_LABEL: Record<Karat, string> = {
  K10: '10K',
  K14: '14K',
  K18: '18K',
  K22: '22K',
  K24: '24K',
}

export class GoldError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GoldError'
  }
}

function assertMilligrams(weightMg: number): number {
  if (!Number.isInteger(weightMg)) {
    throw new GoldError(`Weight must be whole milligrams, got ${weightMg}`)
  }
  if (weightMg < 0) throw new GoldError(`Weight must not be negative, got ${weightMg}`)
  if (!Number.isSafeInteger(weightMg)) throw new GoldError('Weight exceeds safe integer range')
  return weightMg
}

/* ------------------------------------------------------------------ weight units */

export const gramsToMg = (grams: number): number => roundHalfAwayFromZero(grams * 1000)
export const mgToGrams = (mg: number): number => assertMilligrams(mg) / 1000
export const dwtToMg = (dwt: number): number => roundHalfAwayFromZero(dwt * PENNYWEIGHT_MG)
export const mgToDwt = (mg: number): number => assertMilligrams(mg) / PENNYWEIGHT_MG
export const oztToMg = (ozt: number): number => roundHalfAwayFromZero(ozt * TROY_OUNCE_MG)
export const mgToOzt = (mg: number): number => assertMilligrams(mg) / TROY_OUNCE_MG

/* ------------------------------------------------------------------ valuation */

/**
 * Melt value: what the gold content alone is worth at the given spot price.
 *
 *   value = weight × purity × spotPerGram
 *
 * Computed as ONE fraction with a single rounding at the end, rather than converting spot to
 * a per-gram float first. Chaining rounded intermediates is where cent-level drift creeps in,
 * and on a kilo lot that drift is dollars.
 *
 *   meltCents = spotPerOztCents × weightMg × purityNum
 *               ────────────────────────────────────────
 *               purityDen × 1000 × TROY_OUNCE_GRAMS
 *
 * This is the GOLD CONTENT value. It is NOT what a consumer will be paid — buyers pay a
 * percentage of melt (see offerFromMelt), and the realised figure depends on assay.
 */
export function meltValueCents(
  weightMg: number,
  karat: Karat,
  spotPerOztCents: number
): number {
  assertMilligrams(weightMg)
  assertCents(spotPerOztCents, 'spotPerOztCents')
  const purity = KARAT_PURITY[karat]
  if (!purity) throw new GoldError(`Unknown karat: ${karat}`)

  const numerator = spotPerOztCents * weightMg * purity.num
  const denominator = purity.den * 1000 * TROY_OUNCE_GRAMS

  return roundHalfAwayFromZero(numerator / denominator)
}

/**
 * What a buyer offers: a percentage of melt, expressed in bps.
 * Scrap offers typically land between 6000 and 9000 bps (60–90% of melt), but the rate is the
 * buyer's to set — the site must never publish a payout-rate promise of its own.
 */
export function offerFromMelt(meltCents: number, payoutRateBps: number): number {
  return applyBps(meltCents, payoutRateBps)
}

/**
 * Melt value of a whole lot. Each item is valued at ITS OWN purity, then summed.
 *
 * This rounds once per item, which for same-karat items can land a cent away from valuing the
 * combined weight in one go — rounding is not distributive. Per-item is nonetheless correct,
 * because a lot legitimately mixes karats and there is no single purity to apply. Do not
 * "simplify" this into a combined-weight calculation; see the test that pins the behaviour.
 */
export function lotMeltValueCents(
  items: ReadonlyArray<{ weightMg: number; karatClaimed: Karat }>,
  spotPerOztCents: number
): number {
  return items.reduce(
    (total, item) => total + meltValueCents(item.weightMg, item.karatClaimed, spotPerOztCents),
    0
  )
}

/** Indicative payout RANGE for a lot, from a buyer's advertised min/max rate. */
export function indicativeRangeCents(
  meltCents: number,
  minBps: number,
  maxBps: number
): { lowCents: number; highCents: number } {
  assertBps(minBps, 'minBps')
  assertBps(maxBps, 'maxBps')
  if (minBps > maxBps) throw new GoldError('minBps must not exceed maxBps')
  return { lowCents: applyBps(meltCents, minBps), highCents: applyBps(meltCents, maxBps) }
}

/** Spot price per gram, in cents. Display only — valuation uses the exact fraction above. */
export function spotPerGramCents(spotPerOztCents: number): number {
  assertCents(spotPerOztCents, 'spotPerOztCents')
  return roundHalfAwayFromZero(spotPerOztCents / TROY_OUNCE_GRAMS)
}

/**
 * A declared sale materially below the accepted bid is the signal that a buyer is
 * under-reporting to shrink a percent-of-sale commission. Such conversions are held DISPUTED
 * rather than auto-approved.
 *
 * Default tolerance is 500 bps (5%) — enough slack for a genuine assay difference on a
 * hallmark-based bid, tight enough to catch deliberate shaving.
 */
export function isDeclaredSaleSuspicious(
  acceptedBidCents: number,
  declaredSaleCents: number,
  toleranceBps = 500
): boolean {
  assertCents(acceptedBidCents, 'acceptedBidCents')
  assertCents(declaredSaleCents, 'declaredSaleCents')
  const floor = acceptedBidCents - applyBps(acceptedBidCents, toleranceBps)
  return declaredSaleCents < floor
}

/* ------------------------------------------------------------------ presentation */

export function formatGrams(mg: number, digits = 2): string {
  return `${mgToGrams(mg).toFixed(digits)} g`
}

export function formatDwt(mg: number, digits = 2): string {
  return `${mgToDwt(mg).toFixed(digits)} dwt`
}

export function formatOzt(mg: number, digits = 3): string {
  return `${mgToOzt(mg).toFixed(digits)} ozt`
}
