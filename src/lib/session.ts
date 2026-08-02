/**
 * Session handling — a signed, stateless JWT in an HttpOnly cookie.
 *
 * DELIBERATE SPLIT, and the reason this file has no Prisma import:
 *
 *   * proxy.ts (Next 16's rename of middleware) runs on the EDGE runtime, where Prisma cannot
 *     run. It therefore only verifies the JWT signature and reads the role claim — it is a
 *     cheap routing gate.
 *   * Every server action and route handler that touches money re-checks authorisation against
 *     the DATABASE. Middleware alone is not authorisation: a role claim is a snapshot from
 *     login time, and an account suspended five minutes ago still carries a valid token.
 *
 * `jose` is used rather than `jsonwebtoken` because it is Web Crypto based and therefore works
 * unchanged in both runtimes.
 */
import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'ggn_session'

/** Eight hours. Long enough for a working day in a buyer portal, short enough to limit theft. */
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8

export type SessionRole = 'ADMIN' | 'STAFF' | 'BUYER' | 'PUBLISHER' | 'CONSUMER'

export interface SessionPayload {
  userId: string
  role: SessionRole
}

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET must be set and at least 32 characters. A short or missing signing key ' +
        'means anyone can mint a session cookie claiming ADMIN.'
    )
  }
  return new TextEncoder().encode(secret)
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey())
}

/** Verify and decode. Returns null for anything expired, tampered with, or malformed. */
export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] })
    const userId = payload.sub
    const role = payload.role
    if (typeof userId !== 'string' || typeof role !== 'string') return null
    return { userId, role: role as SessionRole }
  } catch {
    // Expired, wrong signature, wrong algorithm, garbage — all read the same: no session.
    return null
  }
}

/** Cookie options. `secure` is off in dev only, because localhost is not HTTPS. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  }
}

/** Which portal a role belongs in. Used by middleware to route and to deny. */
export const ROLE_HOME: Record<SessionRole, string> = {
  ADMIN: '/admin',
  STAFF: '/admin',
  BUYER: '/buyer',
  PUBLISHER: '/publisher',
  CONSUMER: '/account',
}
