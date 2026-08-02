import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import Prose from '@/components/ui/Prose'
import FaqSection from '@/components/ui/FaqSection'
import CtaBand from '@/components/ui/CtaBand'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'

const TITLE = 'Commission Structure for Partners'
const DESCRIPTION =
  'How partner commission is calculated and attributed: event types, last-click attribution, ' +
  'approval states, and why a rate change is never applied retroactively.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/for-partners/commissions',
})

const FAQ = [
  {
    question: 'What is the attribution window?',
    answer:
      'Thirty days by default, set per programme. If someone follows your link and converts ' +
      'within that window, the event is yours. Beyond it, the click has expired and the event is ' +
      'recorded as unattributed.',
  },
  {
    question: 'What happens if two partners refer the same person?',
    answer:
      'Last click within the window wins. It is the standard the whole industry runs on, it is ' +
      'unambiguous, and it is the only rule that can be applied consistently without a judgement ' +
      'call on every disputed event.',
  },
  {
    question: 'Why are some conversions pending?',
    answer:
      'Percentage-of-purchase conversions start pending because the buyer has to confirm the sale ' +
      'first. Calls and enquiries are validated much faster. Pending and approved are always shown ' +
      'separately so a pending balance is never mistaken for money you can count on.',
  },
  {
    question: 'Can a conversion be reversed after approval?',
    answer:
      'Only where the underlying transaction was reversed or the event is shown to be invalid — a ' +
      'cancelled purchase, a duplicate, or fraud. Reversals are itemised with a reason, never ' +
      'applied silently.',
  },
]

export default function CommissionsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'For partners', path: '/for-partners' },
          { name: 'Commissions', path: '/for-partners/commissions' },
        ]}
      />

      <PageHero
        eyebrow="Publisher programme"
        title="Commission structure"
        lead="What earns, how it is attributed, and the rules that decide when it becomes payable."
      />

      <section className="py-14">
        <Container>
          <Prose>
            <h2>What earns commission</h2>
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Earns when</th>
                  <th>Typically approved</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Qualified call</td>
                  <td>A tracked call passes the programme&rsquo;s duration minimum</td>
                  <td>Quickly — duration is measured on our side</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Validated enquiry</td>
                  <td>A form enquiry passes validation and deduplication</td>
                  <td>Quickly</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Confirmed purchase</td>
                  <td>The buyer confirms a completed purchase and the amount</td>
                  <td>After the buyer reports and any review clears</td>
                </tr>
              </tbody>
            </table>
            <p>
              Rates are set per programme. Call and enquiry commissions are flat amounts;
              purchase commissions are a percentage of the confirmed amount.
            </p>

            <h2>Attribution</h2>
            <p>
              When someone follows your tracked link we issue a server-side click identifier and
              record it before redirecting. Conversions are matched back to that identifier —{' '}
              <strong>last click within the attribution window</strong>, 30 days by default.
            </p>
            <p>
              Attribution is deliberately conservative. An event that cannot be tied to a click is
              recorded as unattributed rather than assigned to the most recent plausible partner.
              That means occasionally nobody earns on an event that arguably should have paid —
              which is the right way for the error to fall, because the alternative is paying
              partner A for partner B&rsquo;s work.
            </p>

            <h2>The rate is fixed when the event happens</h2>
            <p>
              The commission is calculated at the moment the event is recorded, using the rate then
              in force, and that amount is stored on the event. Changing a programme&rsquo;s rate
              affects future events only.
            </p>
            <p>
              This matters more than it sounds. Recalculating historic commissions when a rate
              changes means a partner&rsquo;s reported earnings can drop after they have already
              been reported — and a network that does that does not keep its partners.
            </p>

            <h2>Approval states</h2>
            <ul>
              <li>
                <strong>Pending</strong> — recorded, not yet payable.
              </li>
              <li>
                <strong>Approved</strong> — validated and eligible for the next payout run.
              </li>
              <li>
                <strong>Disputed</strong> — held for review, usually because a reported purchase
                amount is materially below the offer the seller accepted.
              </li>
              <li>
                <strong>Reversed</strong> — the underlying transaction was cancelled or the event
                was invalid. Always itemised with a reason.
              </li>
              <li>
                <strong>Paid</strong> — included in a completed payout. An approved conversion can
                belong to exactly one payout, so nothing is ever paid twice or dropped.
              </li>
            </ul>

            <h2>Money handling</h2>
            <p>
              All amounts are held as whole cents. Nothing in the commission path uses a
              floating-point number, and rates are applied as integer basis points with a single
              rounding step — so the figure you see is the figure that is stored and the figure
              that is paid.
            </p>
          </Prose>
        </Container>
      </section>

      <FaqSection items={FAQ} />

      <CtaBand
        title="See when and how you get paid"
        primary={{ label: 'Payout terms', href: '/for-partners/payouts' }}
        secondary={{ label: 'Back to partner overview', href: '/for-partners' }}
      />
    </>
  )
}
