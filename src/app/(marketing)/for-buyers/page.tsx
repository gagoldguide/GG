import { BadgeCheck, PhoneCall, FileText, Wallet } from 'lucide-react'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import FaqSection from '@/components/ui/FaqSection'
import CtaBand from '@/components/ui/CtaBand'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/content/site'

const TITLE = 'For Gold Buyers — List Your Georgia Business'
const DESCRIPTION =
  'Reach people actively selling gold in your city. Pay for qualified calls, validated enquiries ' +
  'and confirmed purchases — not for impressions. Licence verification required.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/for-buyers',
})

const FAQ = [
  {
    question: 'What does it cost to list?',
    answer:
      'You choose how you pay: per qualified phone call, per validated enquiry, a percentage of ' +
      'confirmed purchases, or a flat monthly listing subscription. Most dealers run a ' +
      'combination. Full detail is on the pricing page.',
  },
  {
    question: 'What counts as a qualified call?',
    answer:
      'A call through your tracked number that lasts longer than the agreed minimum — 90 seconds ' +
      'by default. Duration is measured on our side, so it does not depend on either party ' +
      'self-reporting, and short misdials are never billed.',
  },
  {
    question: 'Do I have to be licensed to list?',
    answer:
      'Yes, without exception. We record your permit number, the issuing municipality and the ' +
      'expiry date, and hold a copy of the permit on file. Listings suspend automatically when a ' +
      'permit lapses. This is not negotiable at any price — the verification is the only reason ' +
      'consumers trust the directory.',
  },
  {
    question: 'Why is there a prepaid balance?',
    answer:
      'Because we pay referral partners for the activity they send you, and we will not pay out ' +
      'money that has not been funded. Your balance is drawn down as qualified activity occurs, ' +
      'and your programme pauses automatically if it runs low rather than accruing a debt.',
  },
  {
    question: 'Can I dispute a charge?',
    answer:
      'Yes. Every billable event is itemised with its timestamp, source and duration or reference, ' +
      'and you can dispute any of them from your portal. Disputed conversions are held rather ' +
      'than auto-approved while they are reviewed.',
  },
]

export default function ForBuyersPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'For gold buyers', path: '/for-buyers' },
        ]}
      />

      <PageHero
        eyebrow="For dealers"
        title="Reach people who are ready to sell"
        lead="Not impressions, not clicks from people browsing gold prices — enquiries and calls from people in your city who want to sell today."
      />

      <section className="py-14">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
            You pay for outcomes, not exposure
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: PhoneCall,
                title: 'Qualified calls',
                body: 'Billable only once a tracked call passes the agreed duration. We measure it, so it needs no reporting from you and short misdials never bill.',
              },
              {
                icon: FileText,
                title: 'Validated enquiries',
                body: 'Deduplicated, consent-captured form leads. The same person filling the form twice in a day bills once.',
              },
              {
                icon: Wallet,
                title: 'Confirmed purchases',
                body: 'A percentage of what you actually paid, reported by you. Itemised and disputable.',
              },
              {
                icon: BadgeCheck,
                title: 'Monthly listing',
                body: 'A flat fee for directory presence, if you prefer predictable cost to per-event billing.',
              },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-card border border-line bg-surface p-6 dark:border-line-dark dark:bg-surface-muted-dark"
              >
                <item.icon className="h-6 w-6 text-vault-700" aria-hidden />
                <h3 className="mt-4 font-display text-base font-semibold text-ink dark:text-ink-dark">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-line bg-surface-muted py-14 dark:border-line-dark dark:bg-surface-dark">
        <Container>
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
              What we ask of you
            </h2>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
              <li>
                <strong className="text-ink dark:text-ink-dark">A current permit.</strong> We
                record the number, the issuing municipality and the expiry, and keep a copy on
                file. No permit, no listing.
              </li>
              <li>
                <strong className="text-ink dark:text-ink-dark">Honest reporting.</strong> If you
                use percentage-of-sale billing, you report what you paid. Figures materially below
                an accepted offer are flagged for review rather than approved automatically.
              </li>
              <li>
                <strong className="text-ink dark:text-ink-dark">A funded balance.</strong> Activity
                draws down a prepaid balance. Your programme pauses if it runs low — you are never
                billed for activity you did not fund.
              </li>
              <li>
                <strong className="text-ink dark:text-ink-dark">Treating sellers properly.</strong>{' '}
                We publish melt value openly, so the people contacting you already know roughly
                what their gold is worth. Dealers who compete on rate do well here; dealers who
                rely on sellers not knowing do not.
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <FaqSection items={FAQ} />

      <CtaBand
        title={`List your business on ${site.name}`}
        lead="Buyer accounts open as the directory launches. Register your interest and we will verify your permit first."
        primary={{ label: 'See pricing', href: '/for-buyers/pricing' }}
        secondary={{ label: 'Integration & tracking', href: '/for-buyers/integration' }}
      />
    </>
  )
}
