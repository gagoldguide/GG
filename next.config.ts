import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

// Pin Turbopack's workspace root to THIS directory. Without it, Turbopack walks up and
// finds an unrelated lockfile in the parent folder ("H:\VS Code File" holds dozens of
// projects), infers that as the root, and traces the wrong file tree. Derived from
// import.meta.url so it stays correct on Linux (Vercel) as well as Windows.
const projectRoot = dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },

  // Native/driver packages must not be bundled — they load bindings at runtime.
  serverExternalPackages: ['@prisma/adapter-pg', 'pg'],

  // Baseline security headers on every response. Deliberately NOT a strict
  // Content-Security-Policy: a wrong CSP silently breaks a live site, and doing it right
  // needs per-request nonces for Next's inline runtime — a separate, tested change.
  // These headers are safe, standard, and cost nothing.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Force HTTPS for two years. No `preload` yet — that is a hard-to-reverse
          // commitment to make deliberately once the real domain has settled.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          // Stop MIME-sniffing (a text response can't be reinterpreted as script).
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Clickjacking: never meant to be framed by another origin.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Don't leak full URLs (which carry click ids) to other origins.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
          // A DELIBERATELY PARTIAL CSP. It omits default-src/script-src/style-src, so it can
          // never block a script, style, image or font — i.e. it cannot break rendering on a
          // live site. What it DOES enforce is real: no plugins/embeds, no <base> injection,
          // no cross-origin framing, forms post same-origin only, http subresources upgraded.
          // The strict nonce-based script-src lockdown is the staged follow-up.
          {
            key: 'Content-Security-Policy',
            value:
              "object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'; upgrade-insecure-requests",
          },
        ],
      },
    ]
  },
}

export default nextConfig
