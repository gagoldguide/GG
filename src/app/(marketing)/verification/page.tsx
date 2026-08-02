import Link from 'next/link'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import Prose from '@/components/ui/Prose'
import FaqSection from '@/components/ui/FaqSection'
import CtaBand from '@/components/ui/CtaBand'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/content/site'

const TITLE = 'How We Verify Gold Buyers'
const DESCRIPTION =
  'Every gold buyer listed on this site has a checked precious-metals permit — issuing ' +
  'municipality, permit number and expiry date — and listings suspend automatically when a ' +
  'permit lapses.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/verification',
})

const FAQ = [
  {
    question: 'What exactly do you check?',
    answer:
      'We check that the business holds a current precious-metals permit, and we record the ' +
      'permit number, the municipality that issued it and its expiry date. We also confirm the ' +
      'business name and trading address match the permit. A listing is suspended automatically ' +
      'once the recorded expiry date passes.',
  },
  {
    question: 'Does verification mean you guarantee the buyer?',
    answer:
      'No, and we will not claim otherwise. Verification confirms that a business is permitted to ' +
      'do what it does. It is not a guarantee of the price they offer, the service they provide, ' +
      'or the outcome of any transaction. It removes one specific risk — dealing with an ' +
      'unlicensed operator — and no more.',
  },
  {
    question: 'Can a buyer pay to skip verification?',
    answer:
      'No. Buyers pay us for the activity we send them, and that is disclosed on every page. ' +
      'Payment does not affect whether a business is verified, and an unverified business is not ' +
      'listed at any price.',
  },
  {
    question: 'Why does verification matter in Georgia specifically?',
    answer:
      'Because Georgia has no single statewide gold-buying licence. Dealers register with the ' +
      'county sheriff under O.C.G.A. Title 43, Chapter 37, and individual cities and counties add ' +
      'their own permits on top. That patchwork makes it genuinely hard for a member of the ' +
      'public to tell whether a shop is operating legally, which is the gap this check fills.',
  },
  {
    question: 'What if I find a listed buyer is not properly permitted?',
    answer:
      'Tell us and we will suspend the listing while we re-check. We would rather remove a paying ' +
      'listing than leave a wrong one up, because the verification is the only reason this ' +
      'directory is worth anything.',
  },
]

export default function VerificationPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'How we verify', path: '/verification' },
        ]}
      />

      <PageHero
        eyebrow="Trust"
        title="How we verify gold buyers"
        lead="Georgia has no single statewide gold-buying licence, which makes it unusually hard to tell a permitted dealer from an unpermitted one. Checking that is the main thing this directory does."
      />

      <section className="py-14">
        <Container>
          <Prose>
            <h2>What we record for every listed buyer</h2>
            <ul>
              <li>
                <strong>Permit number</strong> and the <strong>municipality that issued it</strong>{' '}
                — because in Georgia the permit is local, not statewide.
              </li>
              <li>
                <strong>Expiry date</strong>, stored as a date rather than a note. When it passes,
                the listing suspends automatically rather than waiting for someone to notice.
              </li>
              <li>
                <strong>Business name and trading address</strong>, checked against the permit.
              </li>
              <li>
                <strong>A copy of the permit document</strong>, retained on file.
              </li>
            </ul>

            <h2>What verification does not mean</h2>
            <p>
              It confirms a business is permitted to buy precious metals. It is{' '}
              <strong>not</strong> a guarantee of price, service quality, or the outcome of any
              particular transaction, and we will not imply otherwise. Comparing offers is still
              your job — which is why every offer on this site is shown next to the melt value.
            </p>

            <h2>Verification is not for sale</h2>
            <p>
              {site.name} is paid by the buyers listed here, and we say so on every page. That
              compensation does not affect verification. A business without a current permit is not
              listed at any price, and paying more does not move a listing ahead of a verified one
              on any basis other than the ranking rules we publish.
            </p>
            <p>
              Stating this plainly matters more than it might seem: a directory whose badge can be
              bought is worth nothing to the person relying on it, and that person is the entire
              reason the directory exists.
            </p>

            <h2>What you can check yourself</h2>
            <p>
              You do not have to take our word for it. Under Georgia law, dealers register with the
              sheriff of the county — or the chief of the county police department where the county
              has one — and must register separately for each place of business. Ask a buyer where
              they are registered; a legitimate one will tell you without hesitating. There is more
              detail in the <Link href="/learn/georgia-rules">Georgia dealer rules guide</Link>.
            </p>

            <h2>Reporting a problem</h2>
            <p>
              If a listed business appears not to hold a current permit, tell us. We will suspend
              the listing while we re-check rather than leave it up. Removing a paying listing costs
              us money; leaving a wrong one up costs us the only thing that makes this site useful.
            </p>
          </Prose>
        </Container>
      </section>

      <FaqSection items={FAQ} />

      <CtaBand
        title="Browse verified Georgia gold buyers"
        primary={{ label: 'See the directory', href: '/gold-buyers' }}
        secondary={{ label: 'List your business', href: '/for-buyers' }}
      />
    </>
  )
}
