import { LineChart, Link2, ShieldCheck, Wallet } from 'lucide-react'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import FaqSection from '@/components/ui/FaqSection'
import CtaBand from '@/components/ui/CtaBand'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/content/site'

const TITLE = 'Publisher Programme — Earn on Georgia Gold Referrals'
const DESCRIPTION =
  'Earn commission on qualified calls, validated enquiries and confirmed gold purchases you ' +
  'refer. Per-event reporting, tracked links, and payouts 20 days after month-end.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/for-partners',
})

const FAQ = [
  {
    question: 'Who is this suitable for?',
    answer:
      'Publishers with an audience that overlaps with people selling gold in Georgia — local news ' +
      'and community sites, personal finance and estate content, pawn and jewellery comparison ' +
      'sites, and local service directories. It is not suitable for incentivised traffic, ' +
      'trademark bidding on buyer brand names, or anything relying on misleading claims about ' +
      'what gold is worth.',
  },
  {
    question: 'How am I paid?',
    answer:
      'Per event: a commission on each qualified call, validated enquiry or confirmed purchase ' +
      'attributed to you. Rates are set per programme and fixed at the moment the event happens, ' +
      'so a later rate change never rewrites what you already earned.',
  },
  {
    question: 'When do I get paid?',
    answer:
      'Approved earnings are paid 20 days after the end of the month in which they were approved, ' +
      'once your balance reaches the $50 minimum. Anything below the threshold rolls forward ' +
      'rather than being lost.',
  },
  {
    question: 'How is a referral attributed to me?',
    answer:
      'Last click within the programme’s attribution window, keyed on a server-side click ' +
      'identifier issued when someone follows your link. Calls are attributed by tracked number. ' +
      'Nothing is attributed by guesswork — an event we cannot tie to a click is recorded as ' +
      'unattributed rather than assigned to somebody.',
  },
  {
    question: 'Can I see what happened, or just a total?',
    answer:
      'Every event is itemised with its timestamp, type and the amount it earned, alongside its ' +
      'approval state. You can see pending and approved separately, and export it.',
  },
]

export default function ForPartnersPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'For partners', path: '/for-partners' },
        ]}
      />

      <PageHero
        eyebrow="Publisher programme"
        title="Earn on referrals you actually send"
        lead="Commission on qualified calls, validated enquiries and confirmed purchases — measured per event, itemised, and fixed at the rate in force when it happened."
      />

      <section className="py-14">
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Link2,
                title: 'Tracked links',
                body: 'A short link per placement, with your own sub-ID so you can tell which page or campaign produced what.',
              },
              {
                icon: LineChart,
                title: 'Per-event reporting',
                body: 'Clicks, calls, enquiries and purchases itemised with timestamps. Pending and approved shown separately.',
              },
              {
                icon: ShieldCheck,
                title: 'Rates fixed at the event',
                body: 'The rate that applied when the event happened is stored with it. Rate changes are never retroactive.',
              },
              {
                icon: Wallet,
                title: 'Predictable payouts',
                body: '20 days after month-end, $50 minimum. Balances below the threshold roll forward.',
              },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-card border border-line bg-surface p-6 dark:border-line-dark dark:bg-surface-muted-dark"
              >
                <item.icon className="h-6 w-6 text-vault-700" aria-hidden />
                <h2 className="mt-4 font-display text-base font-semibold text-ink dark:text-ink-dark">
                  {item.title}
                </h2>
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
              What we will not accept
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
              Worth stating plainly, because it saves everyone time:
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
              <li>
                <strong className="text-ink dark:text-ink-dark">Misleading valuations.</strong>{' '}
                Promising a specific payout rate, or implying sellers receive full melt value, is
                grounds for immediate removal. We publish melt value openly precisely so nobody has
                to guess.
              </li>
              <li>
                <strong className="text-ink dark:text-ink-dark">Incentivised traffic.</strong> Paid
                enquiries, rewards for calling, or anything that manufactures events rather than
                finding people who genuinely want to sell.
              </li>
              <li>
                <strong className="text-ink dark:text-ink-dark">Brand bidding.</strong> Paid search
                on listed buyers&rsquo; business names.
              </li>
              <li>
                <strong className="text-ink dark:text-ink-dark">Consent you did not collect.</strong>{' '}
                Contact details passed to us must come with a consent record you can produce. This
                one is not negotiable — the liability lands on everyone involved.
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <FaqSection items={FAQ} />

      <CtaBand
        title={`Partner with ${site.name}`}
        lead="Applications open as the buyer network launches."
        primary={{ label: 'Commission structure', href: '/for-partners/commissions' }}
        secondary={{ label: 'Payout terms', href: '/for-partners/payouts' }}
      />
    </>
  )
}
