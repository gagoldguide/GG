import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import Prose from '@/components/ui/Prose'
import FaqSection from '@/components/ui/FaqSection'
import CtaBand from '@/components/ui/CtaBand'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'

const TITLE = 'Integration & Tracking for Gold Buyers'
const DESCRIPTION =
  'How activity is attributed: tracked phone numbers, validated enquiries, and signed ' +
  'server-to-server postbacks for confirmed purchases.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/for-buyers/integration',
})

const FAQ = [
  {
    question: 'Do I need a developer to get started?',
    answer:
      'No. Tracked phone numbers and enquiry delivery need nothing technical from you at all — we ' +
      'provision a number and forward it to your existing line. Only percentage-of-purchase ' +
      'billing needs an integration, and you can report those purchases through the portal by ' +
      'hand instead if you prefer.',
  },
  {
    question: 'Will a tracked number change how customers reach me?',
    answer:
      'No. Calls to the tracked number forward straight to your existing line, so they ring the ' +
      'same phone in the same shop. The number exists so we can attribute the call and measure ' +
      'its duration, not to sit between you and the caller.',
  },
  {
    question: 'What stops a duplicate purchase being billed twice?',
    answer:
      'Your own reference for the purchase is half of a uniqueness key. If the same reference ' +
      'arrives twice for the same programme, the second one is accepted and ignored rather than ' +
      'creating a second charge — so a retried or replayed postback is harmless.',
  },
  {
    question: 'Why are postbacks signed?',
    answer:
      'Because an unsigned endpoint that creates money records can be called by anyone who ' +
      'guesses the URL. Each programme has its own secret, and every postback carries an HMAC of ' +
      'the payload plus a timestamp, so requests cannot be forged, altered in transit, or replayed ' +
      'from an old capture.',
  },
]

export default function IntegrationPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'For gold buyers', path: '/for-buyers' },
          { name: 'Integration', path: '/for-buyers/integration' },
        ]}
      />

      <PageHero
        eyebrow="For dealers"
        title="Integration and tracking"
        lead="Most of this needs nothing from you. Only percentage-of-purchase billing involves an integration, and even that can be done by hand in the portal."
      />

      <section className="py-14">
        <Container>
          <Prose>
            <h2>Phone calls</h2>
            <p>
              We provision a tracked number that forwards to your existing line. Customers dial it,
              it rings your shop as normal, and we record the call duration. A call becomes
              billable only once it passes the agreed minimum — 90 seconds by default — so
              wrong numbers and instant hang-ups never bill.
            </p>
            <p>
              Because duration is measured on our side, this line of billing needs no cooperation
              or reporting from you, which also makes it the hardest to dispute in either
              direction.
            </p>

            <h2>Enquiries</h2>
            <p>
              Form enquiries are validated, deduplicated against the same phone and ZIP for the
              day, and delivered to you by email and in your portal. The same person submitting
              twice in a day is one billable enquiry, not two.
            </p>

            <h2>Confirmed purchases</h2>
            <p>
              Two ways to report a completed purchase:
            </p>
            <ul>
              <li>
                <strong>In the portal</strong> — mark the deal complete and enter what you paid. No
                development work.
              </li>
              <li>
                <strong>By postback</strong> — your system calls our endpoint when a purchase
                settles.
              </li>
            </ul>

            <h3>The postback</h3>
            <p>
              A signed server-to-server call. Server-to-server rather than a browser pixel because
              it is immune to ad blockers, browser cookie policy and the customer switching device
              between the click and the visit — all of which silently lose conversions.
            </p>
            <Prose className="max-w-none">
              <pre className="mt-4 overflow-x-auto rounded-control border border-line bg-surface-sunken p-4 text-xs leading-relaxed text-ink dark:border-line-dark dark:bg-surface-sunken-dark dark:text-ink-dark">
                <code>{`POST /api/postback
Content-Type: application/json

{
  "clickid":       "01J8Z3K9QW...",   // from the ggclid parameter
  "external_ref":  "INV-10482",       // YOUR reference for the purchase
  "amount_cents":  45011,             // what you paid, in cents
  "currency":      "USD",
  "ts":            1785312000,        // unix seconds
  "sig":           "<hmac-sha256>"    // see below
}

sig = HMAC_SHA256(
  "clickid|external_ref|amount_cents|currency|ts",
  <your programme secret>
)`}</code>
              </pre>
            </Prose>

            <h3>What gets rejected</h3>
            <ul>
              <li>a bad or missing signature;</li>
              <li>a timestamp more than five minutes from ours, which blocks replay;</li>
              <li>an unknown click id;</li>
              <li>a click older than the programme&rsquo;s attribution window;</li>
              <li>
                a repeat of an <code>external_ref</code> already seen for the programme — accepted
                and ignored, so retries are safe.
              </li>
            </ul>

            <h2>Reconciliation</h2>
            <p>
              Where a reported amount comes in materially below the offer the seller accepted, the
              conversion is held for review rather than approved automatically. This is not an
              accusation — assays genuinely differ from hallmarks — but self-reported revenue needs
              a check, and having one protects honest dealers from being lumped in with the rest.
            </p>

            <h2>Amounts and rounding</h2>
            <p>
              Every amount is exchanged in whole cents as an integer. No decimal dollar values are
              accepted anywhere in the API, because floating-point money is where rounding
              disputes come from.
            </p>
          </Prose>
        </Container>
      </section>

      <FaqSection items={FAQ} />

      <CtaBand
        title="Questions about wiring it up?"
        primary={{ label: 'Contact us', href: '/contact' }}
        secondary={{ label: 'See pricing', href: '/for-buyers/pricing' }}
      />
    </>
  )
}
