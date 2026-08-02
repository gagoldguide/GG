import Link from 'next/link'
import { Calculator, Gavel, ShieldCheck, BadgeCheck } from 'lucide-react'

import { site } from '@/content/site'
import Container from '@/components/ui/Container'
import SpotPricePanel from '@/components/ui/SpotPricePanel'
import { ButtonLink } from '@/components/ui/Button'
import { getSpotPrice } from '@/lib/spot'

/** Matches the 15-minute upstream cache on the price feed. */
export const revalidate = 900

/**
 * Homepage.
 *
 * Structure follows the shape a mature network uses — hero, proof, how it works, two-sided
 * split — but every claim here has to be true. There are deliberately NO invented statistics:
 * the stat band that would normally sit under the hero is absent until the client supplies real
 * numbers, because "1,200 sellers served" on day one is a false-advertising exposure, not a
 * placeholder.
 */
export default async function HomePage() {
  const spot = await getSpotPrice()

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden border-b border-line bg-surface dark:border-line-dark dark:bg-surface-dark">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent"
        />
        <Container className="grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-800">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Every buyer licence-verified
            </p>

            <h1 className="mt-5 font-display text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl dark:text-ink-dark">
              Let Georgia&rsquo;s gold buyers compete for your gold.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted dark:text-ink-muted-dark">
              See what your gold is worth at today&rsquo;s spot price, then receive competing
              offers from licence-verified buyers near you — instead of taking the first price
              you are quoted.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/gold-calculator" size="lg">
                <Calculator className="h-4 w-4" aria-hidden />
                What&rsquo;s my gold worth?
              </ButtonLink>
              <ButtonLink href="/gold-buyers" variant="outline" size="lg">
                Browse verified buyers
              </ButtonLink>
            </div>

            <p className="mt-4 text-xs text-ink-subtle dark:text-ink-muted-dark">
              Free to sellers. No obligation to accept any offer.
            </p>
          </div>

          <SpotPricePanel spot={spot} />
        </Container>
      </section>

      {/* ---------------------------------------------------------------- how it works */}
      <section className="border-b border-line bg-surface-muted py-20 dark:border-line-dark dark:bg-surface-dark">
        <Container>
          <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl dark:text-ink-dark">
            How it works
          </h2>
          <p className="mt-3 max-w-2xl text-ink-muted dark:text-ink-muted-dark">
            Four steps, no cost to you, and nothing changes hands until you accept an offer.
          </p>

          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Calculator,
                title: 'Value it',
                body: 'Enter karat and weight. We calculate the melt value from today’s spot price, so you know the benchmark before anyone quotes you.',
              },
              {
                icon: Gavel,
                title: 'Get offers',
                body: 'List what you have. Licence-verified buyers near you place competing offers, each subject to physical inspection.',
              },
              {
                icon: BadgeCheck,
                title: 'Compare',
                body: 'See offers side by side against melt value. No pressure, and no offer is binding until you accept it.',
              },
              {
                icon: ShieldCheck,
                title: 'Sell safely',
                body: 'Meet at a licensed premises or arrange insured mail-in. Purity is confirmed by testing before payment.',
              },
            ].map((step, i) => (
              <li key={step.title}>
                <span className="tnum text-xs font-semibold text-gold-800">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <step.icon className="mt-3 h-6 w-6 text-vault-700" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-semibold text-ink dark:text-ink-dark">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- two-sided split */}
      <section className="py-20">
        <Container className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-card border border-line bg-surface p-8 dark:border-line-dark dark:bg-surface-muted-dark">
            <h2 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
              You buy gold
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
              Get in front of sellers actively looking to sell in your city. You are billed only
              for qualified activity — calls that connect, validated enquiries, and confirmed
              purchases. Licence verification is required to list.
            </p>
            <ButtonLink href="/for-buyers" className="mt-6">
              List your business
            </ButtonLink>
          </div>

          <div className="rounded-card border border-line bg-surface p-8 dark:border-line-dark dark:bg-surface-muted-dark">
            <h2 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
              You send traffic
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
              Publishers and content partners earn commission on every qualified call, enquiry and
              completed sale they refer. Transparent tracking, per-event reporting, and payouts 20
              days after month-end.
            </p>
            <ButtonLink href="/for-partners" variant="outline" className="mt-6">
              Become a partner
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- trust */}
      <section className="border-t border-line bg-surface-muted py-20 dark:border-line-dark dark:bg-surface-sunken-dark">
        <Container className="max-w-3xl text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-vault-700" aria-hidden />
          <h2 className="mt-5 font-display text-3xl tracking-tight text-ink dark:text-ink-dark">
            Why licence verification matters
          </h2>
          <p className="mt-4 text-ink-muted dark:text-ink-muted-dark">
            In {site.state}, permits to deal in precious metals are issued by individual cities and
            counties — not by a single statewide licence. We check the permit, the issuing
            municipality and the expiry date before a business can appear here, and we suspend
            listings automatically when a permit lapses.
          </p>
          <p className="mt-6 text-sm text-ink-muted dark:text-ink-muted-dark">
            Start with{' '}
            <Link href="/gold-price" className="font-semibold text-vault-700 underline">
              today&rsquo;s gold price
            </Link>{' '}
            or{' '}
            <Link href="/gold-calculator" className="font-semibold text-vault-700 underline">
              value your own pieces
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  )
}
