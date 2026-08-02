/**
 * Password hashing for every account type on the network — gold buyers, publishers, consumers
 * and staff. All four can move or claim money, so all four get the same treatment.
 *
 * scrypt, from Node's built-in `crypto` — no third-party dependency, no native build step, and
 * memory-hard by design so a leaked hash resists GPU cracking. Chosen over argon2 precisely
 * because it ships with the runtime: fewer dependencies is fewer supply-chain risks on a
 * platform that custodies publisher earnings.
 *
 * Stored format is self-describing so the work factor can be raised later without invalidating
 * existing hashes:  scrypt$N$r$p$<saltB64>$<hashB64>
 */
import { randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from 'node:crypto'

// Hand-wrapped rather than promisify()'d: promisify's typing only sees the 3-arg overload and
// drops the ScryptOptions we need in order to pass N/r/p/maxmem.
function scrypt(
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, salt, keylen, options, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey as Buffer)
    })
  })
}

// OWASP-recommended scrypt parameters (N=2^15). r=8, p=1, 64-byte output.
const N = 32_768
const R = 8
const P = 1
const KEYLEN = 64
const SALT_BYTES = 16
// scrypt needs maxmem raised above the default 32 MB for N this large: 128 * N * r ≈ 32 MB,
// so give it headroom or the call throws.
const MAXMEM = 128 * N * R * 2

/** The minimum a human must type. Length beats complexity rules; this is the one hard floor. */
export const MIN_PASSWORD_LENGTH = 10

async function derive(password: string, salt: Buffer, keylen: number): Promise<Buffer> {
  return (await scrypt(password, salt, keylen, { N, r: R, p: P, maxmem: MAXMEM })) as Buffer
}

/** Produce a self-describing scrypt hash string safe to store in the DB. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES)
  const hash = await derive(password, salt, KEYLEN)
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${hash.toString('base64')}`
}

/**
 * Constant-time verify. Returns false for any malformed/legacy/empty stored value rather than
 * throwing — a corrupt hash must read as "wrong password", never as a 500 that leaks internals.
 */
export async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
  if (!stored) return false

  const parts = stored.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false

  const n = Number(parts[1])
  const r = Number(parts[2])
  const p = Number(parts[3])
  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p)) return false

  let salt: Buffer
  let expected: Buffer
  try {
    salt = Buffer.from(parts[4], 'base64')
    expected = Buffer.from(parts[5], 'base64')
  } catch {
    return false
  }
  if (salt.length === 0 || expected.length === 0) return false

  let actual: Buffer
  try {
    // Verify against the PARAMETERS THE HASH WAS MADE WITH, not today's constants, so raising
    // the work factor later doesn't lock people out of accounts hashed under the old ones.
    actual = (await scrypt(password, salt, expected.length, {
      N: n,
      r,
      p,
      maxmem: 128 * n * r * 2,
    })) as Buffer
  } catch {
    return false
  }

  // Both buffers are the same length by construction, so timingSafeEqual is safe to call and
  // does the constant-time compare that a plain === would not.
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
