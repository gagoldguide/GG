import Link from 'next/link'
import { Lock } from 'lucide-react'

import Container from '@/components/ui/Container'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/content/site'

export const metadata = buildMetadata({
  title: 'Sign In',
  description: `Sign in to your ${site.name} account.`,
  path: '/login',
  // Login pages have no business in search results, and indexing one invites credential-phishing
  // lookalikes to rank alongside it.
  noIndex: true,
})

/**
 * Sign-in page.
 *
 * This route must exist even before accounts do: proxy.ts redirects unauthenticated portal
 * traffic here, and a redirect into a 404 is a dead end. Right now it states plainly that
 * accounts are not open rather than rendering a form that cannot succeed — a login box that
 * always fails is indistinguishable from a broken site, or a phishing page.
 */
export default function LoginPage() {
  return (
    <section className="py-20">
      <Container className="max-w-md">
        <div className="rounded-card border border-line bg-surface p-8 text-center dark:border-line-dark dark:bg-surface-muted-dark">
          <Lock className="mx-auto h-7 w-7 text-vault-700" aria-hidden />
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink dark:text-ink-dark">
            Accounts are not open yet
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
            Buyer, partner and seller portals open as the network launches. Until then there is
            nothing to sign in to, and we would rather say so than show you a form that cannot
            work.
          </p>

          <div className="mt-8 space-y-3 text-sm">
            <Link
              href="/for-buyers"
              className="block rounded-control border border-line-strong px-4 py-3 font-semibold text-ink transition-colors hover:bg-surface-muted dark:border-line-strong-dark dark:text-ink-dark dark:hover:bg-surface-dark"
            >
              I buy gold — list my business
            </Link>
            <Link
              href="/for-partners"
              className="block rounded-control border border-line-strong px-4 py-3 font-semibold text-ink transition-colors hover:bg-surface-muted dark:border-line-strong-dark dark:text-ink-dark dark:hover:bg-surface-dark"
            >
              I send traffic — partner programme
            </Link>
            <Link
              href="/sell"
              className="block rounded-control bg-vault-500 px-4 py-3 font-semibold text-ink-inverse transition-colors hover:bg-vault-600"
            >
              I want to sell gold
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
