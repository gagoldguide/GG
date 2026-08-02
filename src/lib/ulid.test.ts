import { describe, it, expect } from 'vitest'
import { ulid, isUlid, decodeTime, UlidError } from './ulid'

describe('ulid', () => {
  it('is 26 Crockford Base32 characters', () => {
    const id = ulid()
    expect(id).toHaveLength(26)
    expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/)
  })

  it('excludes the ambiguous letters I, L, O and U', () => {
    const ids = Array.from({ length: 200 }, () => ulid())
    expect(ids.join('')).not.toMatch(/[ILOU]/)
  })

  it('round-trips the timestamp', () => {
    const t = 1_754_000_000_000
    expect(decodeTime(ulid(t))).toBe(t)
  })

  it('sorts lexicographically in time order', () => {
    const early = ulid(1_700_000_000_000)
    const mid = ulid(1_750_000_000_000)
    const late = ulid(1_800_000_000_000)
    expect([late, early, mid].sort()).toEqual([early, mid, late])
  })

  it('stays monotonic within a single millisecond', () => {
    // Two clicks in the same tick must still sort in issue order, or a "most recent click
    // wins" attribution query can pick the wrong one.
    const t = 1_754_000_000_000
    const ids = Array.from({ length: 50 }, () => ulid(t))
    const sorted = [...ids].sort()
    expect(ids).toEqual(sorted)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('generates distinct ids across many calls', () => {
    const ids = new Set(Array.from({ length: 5_000 }, () => ulid()))
    expect(ids.size).toBe(5_000)
  })

  it('shares the timestamp prefix for ids in the same millisecond', () => {
    const t = 1_754_000_000_000
    expect(ulid(t).slice(0, 10)).toBe(ulid(t).slice(0, 10))
  })
})

describe('isUlid', () => {
  it('accepts a generated ulid', () => {
    expect(isUlid(ulid())).toBe(true)
  })

  it('rejects junk that might arrive as a clickid query param', () => {
    expect(isUlid('')).toBe(false)
    expect(isUlid('not-a-ulid')).toBe(false)
    expect(isUlid(ulid().slice(0, 25))).toBe(false) // too short
    expect(isUlid(ulid() + 'A')).toBe(false) // too long
    expect(isUlid('IIIIIIIIIIIIIIIIIIIIIIIIII')).toBe(false) // excluded letter
    expect(isUlid(null)).toBe(false)
    expect(isUlid(12_345)).toBe(false)
  })

  it('rejects a lowercase ulid rather than silently accepting it', () => {
    expect(isUlid(ulid().toLowerCase())).toBe(false)
  })
})

describe('decodeTime', () => {
  it('throws on a non-ulid', () => {
    expect(() => decodeTime('nope')).toThrow(UlidError)
  })

  it('supports rejecting clicks older than an attribution window', () => {
    const now = 1_754_000_000_000
    const thirtyOneDaysAgo = now - 31 * 24 * 60 * 60 * 1_000
    const old = ulid(thirtyOneDaysAgo)
    const windowMs = 30 * 24 * 60 * 60 * 1_000
    expect(now - decodeTime(old)).toBeGreaterThan(windowMs)
  })
})
