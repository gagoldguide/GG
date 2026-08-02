import { NextResponse, type NextRequest } from 'next/server'

import { SESSION_COOKIE, verifySession, ROLE_HOME, type SessionRole } from '@/lib/session'

/**
 * Portal routing gate.
 *
 * Next 16 renamed the `middleware` file convention to `proxy` — the name reflects that this
 * runs at a network boundary in front of the app, on the Edge runtime, rather than being
 * Express-style middleware.
 *
 * THIS IS NOT AUTHORISATION. It runs on the Edge where Prisma cannot, so all it can do is
 * verify the JWT signature and read the role claim — a claim frozen at login that knows
 * nothing about an account suspended five minutes ago.
 *
 * Every server action and route handler that touches money MUST re-check against the database.
 * What this gate buys is a clean redirect for signed-out users instead of a portal shell
 * flashing before the real check runs.
 */

const PORTALS: Array<{ prefix: string; allow: SessionRole[] }> = [
  { prefix: '/admin', allow: ['ADMIN', 'STAFF'] },
  { prefix: '/buyer', allow: ['BUYER'] },
  { prefix: '/publisher', allow: ['PUBLISHER'] },
  { prefix: '/account', allow: ['CONSUMER'] },
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const portal = PORTALS.find((p) => pathname === p.prefix || pathname.startsWith(`${p.prefix}/`))
  if (!portal) return NextResponse.next()

  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value)

  if (!session) {
    const login = new URL('/login', request.url)
    login.searchParams.set('next', pathname)
    return NextResponse.redirect(login)
  }

  // Signed in, wrong portal — send them to their own rather than showing a 403 they can do
  // nothing about.
  if (!portal.allow.includes(session.role)) {
    return NextResponse.redirect(new URL(ROLE_HOME[session.role] ?? '/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/buyer/:path*', '/publisher/:path*', '/account/:path*'],
}
