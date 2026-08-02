import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import Prose from '@/components/ui/Prose'
import FaqSection from '@/components/ui/FaqSection'
import CtaBand from '@/components/ui/CtaBand'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { formatBps } from '@/lib/money'
import { DEFAULT_NETWORK_FEE_BPS } from '@/lib/money'

const TITLE = 'Pricing & Fees for Gold Buyers'
const DESCRIPTION =
  'How gold buyers are billed: per qualified call, per validated enquiry, a percentage of ' +
  'confirmed purchases, or a monthly listing fee — plus how the network fee works.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/for-buyers/pricing',
})

const FAQ = [
  {
    question: 'How is the network fee calculated?',
    answer:
      `When a referral partner sends you activity, you pay that partner a commission and you pay ` +
      `us a network fee on top of it. The fee is ${formatBps(DEFAULT_NETWORK_FEE_BPS)} of the ` +
      `commission by default. Both lines appear separately on every invoice, so you can always ` +
      `see what went to the partner and what went to us.`,
  },
  {
    question: 'Why do I need to fund a balance in advance?',
    answer:
      'Because we pay referral partners on your behalf. Funding in advance means we never pay out ' +
      'money that has not been provided, and it means you can never accrue a debt you did not ' +
      'plan for — your programme pauses at your chosen floor instead.',
  },
  {
    question: 'What happens if my balance runs out?',
    answer:
      'Your programme pauses. Tracked numbers route to a fallback, enquiries stop being delivered ' +
      'to you, and no further commission accrues. Nothing is billed retroactively when you top ' +
      'up — activity that happened while paused was never charged.',
  },
  {
    question: 'Are there setup fees or contracts?',
    answer:
      'Rates, minimums and any deposit are agreed per programme before you go live, and confirmed ' +
      'in writing. We will not publish a headline rate here that turns out not to apply to you.',
  },
]

export default function BuyerPricingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'For gold buyers', path: '/for-buyers' },
          { name: 'Pricing', path: '/for-buyers/pricing' },
        ]}
      />

      <PageHero
        eyebrow="For dealers"
        title="Pricing and fees"
        lead="Four ways to be billed, all of them tied to something that actually happened. Rates are agreed per programme, not set by a table on a marketing page."
      />

      <section className="py-14">
        <Container>
          <Prose>
            <h2>The four billable events</h2>
            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Billable when</th>
                  <th>Who measures it</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Per qualified call</td>
                  <td>A tracked call exceeds the agreed duration (90 seconds by default)</td>
                  <td>We do — no reporting needed from you</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Per validated enquiry</td>
                  <td>A form enquiry passes validation and same-day deduplication</td>
                  <td>We do</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Percentage of purchase</td>
                  <td>You confirm a completed purchase and the amount paid</td>
                  <td>You report it; we reconcile against the accepted offer</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Monthly listing</td>
                  <td>Flat fee for directory presence</td>
                  <td>Fixed — no attribution involved</td>
                </tr>
              </tbody>
            </table>

            <h2>How the two money lines work</h2>
            <p>
              This site runs as a network, so there are two separate amounts on an attributed
              event:
            </p>
            <ul>
              <li>
                <strong>Partner commission</strong> — what the referring partner earns. Set per
                programme.
              </li>
              <li>
                <strong>Network fee</strong> — our cut, {formatBps(DEFAULT_NETWORK_FEE_BPS)} of
                that commission by default.
              </li>
            </ul>
            <p>
              You are charged the sum of the two, and both are itemised. Monthly listing
              subscriptions carry no partner commission and therefore no network fee — they are a
              flat charge.
            </p>

            <h2>Commission is fixed at the moment it happens</h2>
            <p>
              The rate applied to an event is the rate in force when the event occurred, and it is
              stored with that event. Changing a rate never rewrites history — a repriced past is
              how networks lose the partners sending them business, and it is not something we do.
            </p>

            <h2>Prepaid balance</h2>
            <p>
              Activity draws down a prepaid balance. When it reaches the floor you set, the
              programme pauses: tracked numbers reroute, enquiries stop being delivered, and no
              further commission accrues. You are never billed for activity you did not fund, and
              nothing is charged retroactively when you top up.
            </p>

            <h2>Disputes</h2>
            <p>
              Every billable event is itemised with its timestamp, its source and either its call
              duration or its reference. Any of them can be disputed from your portal, and disputed
              items are held for review rather than approved automatically. Where a reported
              purchase comes in materially below the offer the seller accepted, the system flags it
              for review on its own.
            </p>

            <p className="text-xs text-ink-subtle dark:text-ink-muted-dark">
              Specific rates, minimums and any deposit are confirmed in writing before a programme
              goes live.
            </p>
          </Prose>
        </Container>
      </section>

      <FaqSection items={FAQ} />

      <CtaBand
        title="Wire up tracking"
        lead="See how calls, enquiries and confirmed purchases are attributed."
        primary={{ label: 'Integration & tracking', href: '/for-buyers/integration' }}
        secondary={{ label: 'Back to buyer overview', href: '/for-buyers' }}
      />
    </>
  )
}
