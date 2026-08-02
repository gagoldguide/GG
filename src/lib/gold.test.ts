import { describe, it, expect } from 'vitest'
import {
  TROY_OUNCE_GRAMS,
  PENNYWEIGHT_GRAMS,
  KARAT_PURITY,
  meltValueCents,
  offerFromMelt,
  lotMeltValueCents,
  indicativeRangeCents,
  spotPerGramCents,
  isDeclaredSaleSuspicious,
  gramsToMg,
  dwtToMg,
  oztToMg,
  mgToGrams,
  formatGrams,
  formatDwt,
  GoldError,
} from './gold'

describe('constants', () => {
  it('uses the exact international troy ounce', () => {
    expect(TROY_OUNCE_GRAMS).toBe(31.1034768)
  })

  it('uses the exact pennyweight (1/20 troy ounce)', () => {
    expect(PENNYWEIGHT_GRAMS).toBe(1.55517384)
    expect(PENNYWEIGHT_GRAMS * 20).toBeCloseTo(TROY_OUNCE_GRAMS, 10)
  })

  it('treats 24K as .999 fine, not a mathematical 1.0', () => {
    // Treating 24K as 24/24 overstates every 24K valuation by 0.1%. On a kilo lot at
    // $4,000/ozt that is roughly $128 of imaginary gold.
    expect(KARAT_PURITY.K24).toEqual({ num: 999, den: 1000 })
    expect(KARAT_PURITY.K24.num / KARAT_PURITY.K24.den).toBe(0.999)
  })

  it('defines 10/14/18/22K as exact karat/24 fractions', () => {
    expect(KARAT_PURITY.K10.num / KARAT_PURITY.K10.den).toBeCloseTo(0.4166666667, 10)
    expect(KARAT_PURITY.K14.num / KARAT_PURITY.K14.den).toBeCloseTo(0.5833333333, 10)
    expect(KARAT_PURITY.K18.num / KARAT_PURITY.K18.den).toBe(0.75)
    expect(KARAT_PURITY.K22.num / KARAT_PURITY.K22.den).toBeCloseTo(0.9166666667, 10)
  })
})

describe('weight conversion', () => {
  it('converts grams to whole milligrams', () => {
    expect(gramsToMg(10)).toBe(10_000)
    expect(gramsToMg(1.5)).toBe(1_500)
    expect(mgToGrams(10_000)).toBe(10)
  })

  it('converts a pennyweight to milligrams', () => {
    expect(dwtToMg(1)).toBe(1_555) // 1.55517384 g, rounded to whole mg
    expect(dwtToMg(20)).toBe(oztToMg(1)) // 20 dwt = 1 troy ounce
  })

  it('converts a troy ounce to milligrams', () => {
    expect(oztToMg(1)).toBe(31_103) // 31.1034768 g
  })

  it('refuses a fractional milligram weight', () => {
    expect(() => mgToGrams(10.5)).toThrow(GoldError)
  })
})

describe('meltValueCents', () => {
  it('values 10 g of 14K at $2,400/ozt as $450.11', () => {
    //   spotPerGram = 2400 / 31.1034768        = 77.161791 $/g
    //   melt        = 10 g × (14/24) × 77.161791 = $450.110447
    // Computed as one fraction with a single rounding, so this is exact to the cent.
    expect(meltValueCents(10_000, 'K14', 240_000)).toBe(45_011)
  })

  it('values one troy ounce of 24K at approximately spot × 0.999', () => {
    const spot = 400_000 // $4,000/ozt
    const melt = meltValueCents(oztToMg(1), 'K24', spot)
    // oztToMg rounds 31103.4768 mg down to 31103, which costs about 6 cents at this price.
    expect(melt).toBeGreaterThan(399_580)
    expect(melt).toBeLessThan(399_600)
  })

  it('is linear in weight to within one cent of rounding', () => {
    const single = meltValueCents(5_000, 'K18', 300_000)
    const double = meltValueCents(10_000, 'K18', 300_000)
    expect(Math.abs(double - single * 2)).toBeLessThanOrEqual(1)
  })

  it('does NOT distribute over rounding — value the real weight, never scale a rounded one', () => {
    // 5 g of 18K at $3,000/ozt is 36169.59 cents, which rounds UP to 36170.
    // 10 g is 72339.18 cents, which rounds DOWN to 72339.
    // So doubling the rounded single-item value overstates by a cent. Anyone tempted to
    // "optimise" lotMeltValueCents by multiplying instead of summing per item will introduce
    // exactly this drift — at scale it becomes a reconciliation mismatch nobody can explain.
    const single = meltValueCents(5_000, 'K18', 300_000)
    const double = meltValueCents(10_000, 'K18', 300_000)
    expect(single).toBe(36_170)
    expect(double).toBe(72_339)
    expect(single * 2).not.toBe(double)
  })

  it('sums a same-karat lot per item, accepting sub-cent divergence from a combined weight', () => {
    // lotMeltValueCents rounds ONCE PER ITEM, because items carry different purities and each
    // has to be valued at its own. For same-karat items that can land a cent off a single
    // combined-weight valuation. Per-item is the correct choice; this test pins the tolerance.
    const spot = 300_000
    const perItem = lotMeltValueCents(
      [
        { weightMg: 5_000, karatClaimed: 'K18' },
        { weightMg: 5_000, karatClaimed: 'K18' },
      ],
      spot
    )
    const combined = meltValueCents(10_000, 'K18', spot)
    expect(Math.abs(perItem - combined)).toBeLessThanOrEqual(1)
  })

  it('scales correctly across karats at the same weight', () => {
    const w = 10_000
    const spot = 300_000
    const k18 = meltValueCents(w, 'K18', spot)
    const k10 = meltValueCents(w, 'K10', spot)
    // 10K is 10/18 of 18K's gold content.
    expect(k10 / k18).toBeCloseTo(10 / 18, 4)
  })

  it('returns whole cents, always', () => {
    for (const weight of [1, 7, 999, 12_345, 1_000_000]) {
      expect(Number.isInteger(meltValueCents(weight, 'K14', 412_377))).toBe(true)
    }
  })

  it('handles a kilo lot without precision loss', () => {
    const melt = meltValueCents(1_000_000, 'K24', 400_000)
    // 1 kg = 32.1507 ozt; × 0.999 × $4,000 = $128,475.xx
    expect(melt).toBeGreaterThan(12_840_000)
    expect(melt).toBeLessThan(12_860_000)
    expect(Number.isInteger(melt)).toBe(true)
  })

  it('rejects fractional weights and non-integer spot prices', () => {
    expect(() => meltValueCents(10.5, 'K14', 240_000)).toThrow(GoldError)
    expect(() => meltValueCents(10_000, 'K14', 240_000.5)).toThrow()
  })

  it('rejects an unknown karat', () => {
    // @ts-expect-error deliberately invalid karat
    expect(() => meltValueCents(10_000, 'K13', 240_000)).toThrow(GoldError)
  })
})

describe('offers and ranges', () => {
  it('applies a buyer payout rate to melt', () => {
    // 80% of $450.11 = $360.088 -> $360.09
    expect(offerFromMelt(45_011, 8_000)).toBe(36_009)
  })

  it('sums a mixed-karat lot item by item at each item’s own purity', () => {
    const spot = 300_000
    const items = [
      { weightMg: 10_000, karatClaimed: 'K14' as const },
      { weightMg: 5_000, karatClaimed: 'K18' as const },
    ]
    const expected =
      meltValueCents(10_000, 'K14', spot) + meltValueCents(5_000, 'K18', spot)
    expect(lotMeltValueCents(items, spot)).toBe(expected)
  })

  it('produces an indicative low/high range', () => {
    const { lowCents, highCents } = indicativeRangeCents(100_000, 6_000, 9_000)
    expect(lowCents).toBe(60_000)
    expect(highCents).toBe(90_000)
  })

  it('refuses an inverted range', () => {
    expect(() => indicativeRangeCents(100_000, 9_000, 6_000)).toThrow(GoldError)
  })

  it('computes a display-only per-gram spot price', () => {
    // $2,400/ozt -> $77.16/g
    expect(spotPerGramCents(240_000)).toBe(7_716)
  })
})

describe('isDeclaredSaleSuspicious', () => {
  it('flags a declared sale more than 5% below the accepted bid', () => {
    expect(isDeclaredSaleSuspicious(100_000, 94_000)).toBe(true)
  })

  it('allows a small assay-driven shortfall', () => {
    expect(isDeclaredSaleSuspicious(100_000, 96_000)).toBe(false)
  })

  it('allows a declared sale above the bid', () => {
    expect(isDeclaredSaleSuspicious(100_000, 105_000)).toBe(false)
  })

  it('sits exactly on the boundary without flagging', () => {
    expect(isDeclaredSaleSuspicious(100_000, 95_000)).toBe(false)
  })
})

describe('published marketing figures', () => {
  // The FAQ on /gold-calculator states these numbers in prose, and that prose is ALSO emitted as
  // FAQPage structured data — so a wrong figure is both bad advice and a false machine-readable
  // claim. These assertions exist so the copy cannot silently drift from the library.
  // (The first draft of that FAQ said $84.35. It is $84.40.)
  it('matches the worked example quoted in the /gold-calculator FAQ', () => {
    const spot = 450_000 // $4,500 per troy ounce
    expect(spotPerGramCents(spot)).toBe(14_468) // $144.68 per gram of pure gold
    expect(meltValueCents(1_000, 'K14', spot)).toBe(8_440) // $84.40 per gram of 14k
  })
})

describe('formatting', () => {
  it('renders grams and pennyweight', () => {
    expect(formatGrams(10_000)).toBe('10.00 g')
    expect(formatDwt(1_555)).toBe('1.00 dwt')
  })
})
