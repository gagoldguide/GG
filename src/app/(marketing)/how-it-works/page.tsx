import { Calculator, Gavel, BadgeCheck, ShieldCheck, Banknote, ClipboardList } from 'lucide-react'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import FaqSection from '@/components/ui/FaqSection'
import CtaBand from '@/components/ui/CtaBand'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/content/site'

const TITLE = 'How It Works — Selling Gold Through Georgia Gold Guide'
const DESCRIPTION =
  'How to sell gold in Georgia: value it at spot price, list it, receive competing offers from ' +
  'licence-verified buyers, compare them against melt value, and complete the sale safely.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/how-it-works',
})

const STEPS = [
  {
    icon: Calculator,
    title: 'Work out the melt value',
    body: 'Enter the karat and weight of each piece. We calculate the gold content at the current spot price. This is the benchmark — the number every offer should be judged against — and it costs you nothing to know it before you talk to anyone.',
  },
  {
    icon: ClipboardList,
    title: 'List what you have',
    body: 'Describe your items, add photos, and say whether you would rather meet in person or mail in. You do not commit to anything by listing, and your contact details are not published.',
  },
  {
    icon: Gavel,
    title: 'Buyers place competing offers',
    body: 'Licence-verified buyers in your area see the listing and bid. Because they can see they are competing, you get a better picture of the real market than you would from walking into one shop.',
  },
  {
    icon: BadgeCheck,
    title: 'Compare against melt',
    body: 'Every offer is shown next to the melt value, so you can see exactly what percentage each buyer is paying. Accept one, or none — no offer is binding until you accept it, and there is no fee if you walk away.',
  },
  {
    icon: ShieldCheck,
    title: 'Complete the sale',
    body: 'Meet at the buyer’s licensed premises or arrange insured mail-in. The buyer tests the item to confirm purity — this is standard and expected, because a hallmark is not an assay.',
  },
  {
    icon: Banknote,
    title: 'Get paid',
    body: 'Payment is made directly by the buyer once the item is verified. Bring photo ID: Georgia law requires dealers to record and report who they buy from, so any legitimate buyer will ask.',
  },
]

const FAQ = [
  {
    question: `Does it cost anything to sell gold through ${site.name}?`,
    answer:
      'No. The service is free to people selling gold. We are paid by the buyers who list on the ' +
      'platform, not by you, and you are never charged a commission on what you receive.',
  },
  {
    question: 'Am I obliged to accept an offer?',
    answer:
      'No. Offers are estimates subject to physical inspection, and none of them is binding until ' +
      'you accept one. You can decline every offer, take your gold elsewhere, or simply do ' +
      'nothing, at no cost.',
  },
  {
    question: 'Will my personal details be shown to buyers?',
    answer:
      'Your listing shows what you are selling and the general area, not your name, address or ' +
      'phone number. Contact details are shared only with the buyer whose offer you accept, and ' +
      'only at that point.',
  },
  {
    question: 'Why does the buyer test my gold if it is already stamped?',
    answer:
      'Because a hallmark is a manufacturer’s claim rather than an assay. Stamps carry legal ' +
      'tolerance, and plated or filled items are frequently marked in misleading ways. Testing ' +
      'protects both sides, and a buyer who does not test is taking a risk they will price into ' +
      'their offer.',
  },
  {
    question: 'How long does it take?',
    answer:
      'Listing takes a few minutes. How quickly offers arrive depends on how many verified buyers ' +
      'cover your area. Completing the sale is then as fast as arranging a visit — most in-person ' +
      'sales are settled the same day the item is inspected.',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'How it works', path: '/how-it-works' },
        ]}
      />

      <PageHero
        eyebrow="For sellers"
        title="How it works"
        lead="Six steps, no cost to you, and nothing changes hands until you accept an offer you are happy with."
      />

      <section className="py-14">
        <Container>
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="tnum text-xs font-semibold text-gold-800">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <step.icon className="mt-3 h-6 w-6 text-vault-700" aria-hidden />
                <h2 className="mt-4 font-display text-lg font-semibold text-ink dark:text-ink-dark">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-t border-line bg-surface-muted py-14 dark:border-line-dark dark:bg-surface-dark">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
            What we do not do
          </h2>
          <ul className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
            <li>
              <strong className="text-ink dark:text-ink-dark">We do not buy your gold.</strong> We
              are not a dealer. Every purchase is made directly between you and a licensed buyer.
            </li>
            <li>
              <strong className="text-ink dark:text-ink-dark">We do not hold your item or your
              money.</strong> Nothing passes through us — no escrow, no custody, no handling fee.
            </li>
            <li>
              <strong className="text-ink dark:text-ink-dark">We do not set the price.</strong>{' '}
              Buyers set their own rates. We show you the melt value so you can judge them.
            </li>
            <li>
              <strong className="text-ink dark:text-ink-dark">We do not list unverified
              businesses.</strong> A buyer without a current, verified permit does not appear here.
            </li>
          </ul>
        </Container>
      </section>

      <FaqSection items={FAQ} />

      <CtaBand
        title="Start with the number that matters"
        lead="Find out what your gold is actually worth before anyone makes you an offer."
        primary={{ label: 'Value my gold', href: '/gold-calculator' }}
        secondary={{ label: 'Get competing offers', href: '/sell' }}
      />
    </>
  )
}
