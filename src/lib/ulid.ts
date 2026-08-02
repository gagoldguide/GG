/**
 * ULID — the click identifier.
 *
 * Why not a UUID: a click id is written on every redirect and read back on every postback,
 * and the click table is the largest table on the platform. A ULID is lexicographically
 * sortable by creation time, so the primary key index stays append-ordered instead of writing
 * into random pages, and a time range scan needs no secondary index.
 *
 * Why not a database sequence: the redirect must issue the id BEFORE the row is written, so
 * that the 302 can carry it. Sequential integers would also let anyone enumerate the network's
 * click volume from a single link.
 *
 * Implemented here rather than pulled from npm: it is 60 lines, it sits on the money path, and
 * this way the monotonic behaviour within a millisecond is ours to test.
 *
 * Format (26 chars, Crockford Base32): 10 chars of 48-bit millisecond timestamp, then 16 chars
 * of 80-bit randomness.
 */

const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ' // Crockford: no I, L, O, U
const ENCODING_LEN = 32
const TIME_LEN = 10
const RANDOM_LEN = 16
const MAX_TIME = 281_474_976_710_655 // 2^48 - 1

export class UlidError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UlidError'
  }
}

function encodeTime(time: number, len: number): string {
  if (!Number.isInteger(time) || time < 0) throw new UlidError(`Invalid time: ${time}`)
  if (time > MAX_TIME) throw new UlidError(`Time exceeds ULID range: ${time}`)

  let out = ''
  let remaining = time
  for (let i = len - 1; i >= 0; i--) {
    const mod = remaining % ENCODING_LEN
    out = ENCODING[mod] + out
    remaining = (remaining - mod) / ENCODING_LEN
  }
  return out
}

/**
 * 16 values in [0, 31]. Bytes are taken modulo 32, which stays uniform because 256 is an exact
 * multiple of 32 — no modulo bias.
 */
function randomValues(len: number): number[] {
  const bytes = new Uint8Array(len)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b % ENCODING_LEN)
}

let lastTime = -1
let lastRandom: number[] = []

/**
 * Generate a ULID. Monotonic: two calls inside the same millisecond increment the random
 * component rather than rolling fresh randomness, so ids issued in the same tick still sort in
 * issue order. Without this, two clicks in one millisecond could sort backwards and a
 * "most recent click wins" attribution query would pick the wrong one.
 */
export function ulid(seedTime: number = Date.now()): string {
  if (seedTime === lastTime) {
    let i = RANDOM_LEN - 1
    for (; i >= 0; i--) {
      if (lastRandom[i] < ENCODING_LEN - 1) {
        lastRandom[i]++
        break
      }
      lastRandom[i] = 0
    }
    // Overflowing all 80 bits inside one millisecond is not reachable in practice; if it ever
    // happens, failing loudly beats silently issuing a duplicate id on the money path.
    if (i < 0) throw new UlidError('ULID randomness overflowed within a single millisecond')
  } else {
    lastTime = seedTime
    lastRandom = randomValues(RANDOM_LEN)
  }

  return encodeTime(seedTime, TIME_LEN) + lastRandom.map((v) => ENCODING[v]).join('')
}

/** True if the string is a structurally valid ULID. Used to reject junk `clickid` params early. */
export function isUlid(value: unknown): value is string {
  if (typeof value !== 'string' || value.length !== TIME_LEN + RANDOM_LEN) return false
  for (const ch of value) {
    if (!ENCODING.includes(ch)) return false
  }
  return true
}

/** Recover the creation timestamp. Used to reject clicks older than the attribution window. */
export function decodeTime(id: string): number {
  if (!isUlid(id)) throw new UlidError(`Not a ULID: ${id}`)
  let time = 0
  for (const ch of id.slice(0, TIME_LEN)) {
    time = time * ENCODING_LEN + ENCODING.indexOf(ch)
  }
  if (time > MAX_TIME) throw new UlidError('Decoded time exceeds ULID range')
  return time
}
