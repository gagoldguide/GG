import { describe, it, expect } from 'vitest'
import {
  applyBps,
  networkFeeCents,
  splitConversion,
  buyerChargeCents,
  assertCents,
  roundHalfAwayFromZero,
  parseDollarsToCents,
  formatUsd,
  formatBps,
  MoneyError,
  DEFAULT_NETWORK_FEE_BPS,
} from './money'

describe('integer guards', () => {
  it('rejects a float amount', () => {
    expect(() => assertCents(19.99)).toThrow(MoneyError)
  })

  it('rejects NaN and Infinity', () => {
    expect(() => assertCents(NaN)).toThrow(MoneyError)
    expect(() => assertCents(Infinity)).toThrow(MoneyError)
  })

  it('accepts whole cents including zero and negatives', () => {
    expect(assertCents(0)).toBe(0)
    expect(assertCents(-2_500)).toBe(-2_500)
  })
})

describe('roundHalfAwayFromZero', () => {
  it('rounds .5 away from zero in both directions', () => {
    expect(roundHalfAwayFromZero(0.5)).toBe(1)
    expect(roundHalfAwayFromZero(-0.5)).toBe(-1)
    expect(roundHalfAwayFromZero(2.5)).toBe(3)
    expect(roundHalfAwayFromZero(-2.5)).toBe(-3)
  })

  it('differs from Math.round on negative halves', () => {
    // Math.round(-0.5) is -0, which makes a reversal fail to mirror its charge exactly.
    expect(Math.round(-2.5)).toBe(-2)
    expect(roundHalfAwayFromZero(-2.5)).toBe(-3)
  })
})

describe('applyBps', () => {
  it('applies a percentage rate', () => {
    expect(applyBps(100_000, 500)).toBe(5_000) // 5% of $1,000 = $50
    expect(applyBps(45_011, 500)).toBe(2_251) // 5% of $450.11 = $22.5055 -> $22.51
  })

  it('handles 0% and 100%', () => {
    expect(applyBps(45_011, 0)).toBe(0)
    expect(applyBps(45_011, 10_000)).toBe(45_011)
  })

  it('always returns whole cents', () => {
    for (const bps of [1, 37, 333, 2_999, 7_777]) {
      expect(Number.isInteger(applyBps(123_457, bps))).toBe(true)
    }
  })

  it('rejects a negative or fractional rate', () => {
    expect(() => applyBps(100_000, -500)).toThrow(MoneyError)
    expect(() => applyBps(100_000, 5.5)).toThrow(MoneyError)
  })
})

describe('network fee — how the house earns', () => {
  it('defaults to CJ’s ~30% of the publisher commission', () => {
    expect(DEFAULT_NETWORK_FEE_BPS).toBe(3_000)
    expect(networkFeeCents(2_251)).toBe(675) // 30% of $22.51 = $6.753 -> $6.75
  })

  it('splits a conversion into commission + fee + total buyer charge', () => {
    const split = splitConversion(10_000) // $100 commission
    expect(split.publisherCommissionCents).toBe(10_000)
    expect(split.networkFeeCents).toBe(3_000)
    expect(split.buyerChargeCents).toBe(13_000)
  })

  it('charges the buyer commission plus fee, never commission alone', () => {
    // The buyer pays MORE than the publisher receives — that difference is the business.
    const split = splitConversion(7_777, 2_500)
    expect(split.networkFeeCents).toBe(1_944) // 25% of 7777 = 1944.25 -> 1944
    expect(split.buyerChargeCents).toBe(9_721)
    expect(split.buyerChargeCents).toBeGreaterThan(split.publisherCommissionCents)
  })

  it('keeps the fee consistent with the commission it was derived from', () => {
    const commission = 12_345
    const split = splitConversion(commission, DEFAULT_NETWORK_FEE_BPS)
    expect(split.networkFeeCents).toBe(networkFeeCents(commission))
    expect(buyerChargeCents(split.publisherCommissionCents, split.networkFeeCents)).toBe(
      split.buyerChargeCents
    )
  })
})

describe('parseDollarsToCents', () => {
  it('parses plain and formatted dollar strings', () => {
    expect(parseDollarsToCents('19.99')).toBe(1_999)
    expect(parseDollarsToCents('$1,234.56')).toBe(123_456)
    expect(parseDollarsToCents('100')).toBe(10_000)
    expect(parseDollarsToCents('0.05')).toBe(5)
    expect(parseDollarsToCents('-25.50')).toBe(-2_550)
  })

  it('parses a single decimal place as tenths, not hundredths', () => {
    expect(parseDollarsToCents('19.9')).toBe(1_990)
  })

  it('avoids the float trap that 19.99 * 100 falls into', () => {
    expect(19.99 * 100).not.toBe(1_999) // 1998.9999999999998
    expect(parseDollarsToCents('19.99')).toBe(1_999)
  })

  it('rejects nonsense', () => {
    expect(() => parseDollarsToCents('abc')).toThrow(MoneyError)
    expect(() => parseDollarsToCents('1.234')).toThrow(MoneyError)
    expect(() => parseDollarsToCents('')).toThrow(MoneyError)
  })
})

describe('formatting', () => {
  it('formats cents as USD', () => {
    expect(formatUsd(45_011)).toBe('$450.11')
    expect(formatUsd(0)).toBe('$0.00')
  })

  it('formats bps as a percentage', () => {
    expect(formatBps(3_000)).toBe('30%')
    expect(formatBps(575)).toBe('5.75%')
    expect(formatBps(10_000)).toBe('100%')
  })
})
