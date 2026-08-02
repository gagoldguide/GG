import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import Prose from '@/components/ui/Prose'
import FaqSection from '@/components/ui/FaqSection'
import CtaBand from '@/components/ui/CtaBand'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'

const TITLE = 'Partner Payout Terms'
const DESCRIPTION =
  'When partner earnings are paid: the 20-day post-month-end schedule, the $50 minimum ' +
  'threshold, tax documentation, and how a payout is reconciled.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/for-partners/payouts',
})

const FAQ = [
  {
    question: 'When am I paid?',
    answer:
      'Earnings approved during a calendar month are paid 20 days after that month ends, provided ' +
      'your approved balance is at least $50.',
  },
  {
    question: 'What if I earn less than $50 in a month?',
    answer:
      'The balance rolls forward and is paid in the first run where the total clears the ' +
      'threshold. Nothing expires and nothing is forfeited.',
  },
  {
    question: 'Why are you holding my pending earnings?',
    answer:
      'Pending means the event is recorded but not yet validated — usually a purchase the buyer ' +
      'has not confirmed. Only approved earnings enter a payout run, and pending is always shown ' +
      'separately so it is never mistaken for money on its way.',
  },
  {
    question: 'Do I need to provide tax documentation?',
    answer:
      'Yes, before your first payout. US partners provide a W-9; non-US partners provide the ' +
      'appropriate W-8 form. Payouts are held rather than cancelled until the documentation is on ' +
      'file.',
  },
  {
    question: 'Can a payout be reversed after it is paid?',
    answer:
      'No. Once a conversion is included in a completed payout it is marked paid and locked to ' +
      'that payout. If a later reversal is warranted it is recorded as a separate negative ' +
      'adjustment against future earnings, never by rewriting a payout that already went out.',
  },
]

export default function PayoutsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'For partners', path: '/for-partners' },
          { name: 'Payouts', path: '/for-partners/payouts' },
        ]}
      />

      <PageHero
        eyebrow="Publisher programme"
        title="Payout terms"
        lead="Predictable schedule, a low threshold, and a reconciliation you can check line by line."
      />

      <section className="py-14">
        <Container>
          <Prose>
            <h2>Schedule and threshold</h2>
            <table>
              <thead>
                <tr>
                  <th>Term</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Payment schedule</td>
                  <td>20 days after the end of the month in which earnings were approved</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Minimum threshold</td>
                  <td className="tnum">$50.00 in approved earnings</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Below threshold</td>
                  <td>Rolls forward to the next run. Nothing expires.</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Currency</td>
                  <td>USD</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Tax documents</td>
                  <td>W-9 (US) or the appropriate W-8 (non-US), required before the first payout</td>
                </tr>
              </tbody>
            </table>

            <h2>How a payout is assembled</h2>
            <ol>
              <li>The run selects every approved conversion not already attached to a payout.</li>
              <li>Those are summed per partner, in whole cents.</li>
              <li>Partners below the threshold are held over to the next run.</li>
              <li>
                The payout is created and each included conversion is stamped with its identifier
                and marked paid.
              </li>
            </ol>
            <p>
              That last step is what makes double payment structurally impossible: a conversion can
              belong to exactly one payout. It also means nothing can be silently dropped — an
              approved conversion is either attached to a payout or still waiting for one, and both
              states are visible to you.
            </p>

            <h2>Reconciliation</h2>
            <p>
              Every payout itemises the conversions it contains — date, type, programme and amount.
              The sum of those line items equals the payout total to the cent, by construction
              rather than by rounding at the end. You can export the detail.
            </p>

            <h2>What happens on a reversal</h2>
            <p>
              A reversal after a payout has completed is recorded as a separate negative adjustment
              against future earnings. Payouts that have already gone out are never rewritten,
              because a historical record that changes after the fact is not a record.
            </p>

            <h2>Payment methods</h2>
            <p>
              Payments are made to the method registered on your account. Payment details and any
              transfer fees are confirmed at onboarding, and we will tell you what they are rather
              than netting an unexplained amount off a payout.
            </p>
          </Prose>
        </Container>
      </section>

      <FaqSection items={FAQ} />

      <CtaBand
        title="Ready to apply?"
        lead="Applications open as the buyer network launches."
        primary={{ label: 'Contact us', href: '/contact' }}
        secondary={{ label: 'Commission structure', href: '/for-partners/commissions' }}
      />
    </>
  )
}
