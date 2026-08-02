/**
 * Hashing for personal data and for postback signatures.
 *
 * PRIVACY STANCE. Georgia has no comprehensive consumer privacy statute — SB 111 was
 * introduced as the "Georgia Consumer Privacy Protection Act" but the House replaced its whole
 * text with rural hospital tax credit amendments before it was signed on 11 May 2026, so the
 * law on the books has nothing to do with privacy. Bill trackers still show the original title,
 * which is exactly why this is written down here.
 *
 * We build to the stricter standard regardless: consumers from other states use this site,
 * Florida/Tennessee/Alabama already have omnibus statutes, and a raw IP or phone number adds
 * nothing to attribution that a salted hash does not. Store the hash, not the person.
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

function requireSecret(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `${name} is not set. Refusing to hash personal data with an empty salt — an unsalted ` +
        `hash of a 10-digit phone number is trivially reversible by brute force.`
    )
  }
  return value
}

/**
 * Daily-rotating salt for IP hashes. Rotation means yesterday's hashes cannot be correlated
 * with today's, which limits how long a single visitor stays linkable.
 */
function dailySalt(date = new Date()): string {
  const day = date.toISOString().slice(0, 10) // YYYY-MM-DD, UTC
  return `${requireSecret('HASH_SALT')}:${day}`
}

/** Hash a client IP for logging. Never store the raw value. */
export function hashIp(ip: string | null | undefined, date = new Date()): string | null {
  if (!ip) return null
  return createHash('sha256').update(`${dailySalt(date)}:${ip}`).digest('hex')
}

/**
 * Stable (non-rotating) hash for identifiers we must match across days — a phone number has to
 * dedupe against last week's lead, so a daily salt would defeat the purpose.
 */
export function hashIdentifier(value: string): string {
  const normalised = value.trim().toLowerCase()
  return createHash('sha256').update(`${requireSecret('HASH_SALT')}:${normalised}`).digest('hex')
}

/** US phone numbers, normalised to 10 digits before hashing so formatting never splits a match. */
export function hashPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '')
  return hashIdentifier(`tel:${digits}`)
}

export function hashEmail(email: string): string {
  return hashIdentifier(`mailto:${email}`)
}

/**
 * Same-day duplicate suppression for leads: one person filling the quote form twice must not
 * bill the gold buyer twice. Scoped to the program so the same consumer can legitimately be a
 * fresh lead for a different buyer.
 */
export function leadDedupeHash(
  programId: string,
  phone: string,
  zip: string,
  date = new Date()
): string {
  const day = date.toISOString().slice(0, 10)
  const digits = phone.replace(/\D/g, '')
  return createHash('sha256')
    .update(`${requireSecret('HASH_SALT')}:${programId}:${digits}:${zip.trim()}:${day}`)
    .digest('hex')
}

/* ------------------------------------------------------------------ postback signatures */

/**
 * Canonical payload for a conversion postback. Field ORDER is fixed and the separator cannot
 * appear in any field — otherwise an advertiser could shuffle values between fields and keep a
 * valid signature.
 */
export function canonicalPostbackPayload(fields: {
  clickid: string
  external_ref: string
  amount_cents: number
  currency: string
  ts: number
}): string {
  return [
    fields.clickid,
    fields.external_ref,
    String(fields.amount_cents),
    fields.currency.toUpperCase(),
    String(fields.ts),
  ].join('|')
}

export function signPostback(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

/**
 * Constant-time signature check. A plain string compare leaks, byte by byte, how much of a
 * guessed signature was correct — which is enough to forge one given enough attempts.
 */
export function verifyPostbackSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = signPostback(payload, secret)
  if (signature.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

/** Generate a program's postback secret. 32 bytes of entropy, hex-encoded. */
export function generatePostbackSecret(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}
