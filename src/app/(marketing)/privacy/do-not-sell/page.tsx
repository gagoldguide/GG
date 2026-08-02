import Link from 'next/link'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import Prose from '@/components/ui/Prose'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/content/site'

/*
 * ⚠ Counsel review required before launch — see the note in /privacy.
 *
 * This page deliberately does NOT claim "we never share your data". We do share enquiries with
 * matched buyers — that is the entire service — and several state statutes define that kind of
 * disclosure broadly enough that a flat denial would be false. Saying plainly what happens is
 * both more accurate and more defensible than a reassuring absolute.
 */

const EFFECTIVE = 'August 2, 2026'

export const metadata = buildMetadata({
  title: 'Do Not Sell or Share My Personal Information',
  description: `How ${site.name} handles requests to opt out of the sale or sharing of personal information.`,
  path: '/privacy/do-not-sell',
})

export default function DoNotSellPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Privacy policy', path: '/privacy' },
          { name: 'Do not sell my information', path: '/privacy/do-not-sell' },
        ]}
      />

      <PageHero
        eyebrow={`Effective ${EFFECTIVE}`}
        title="Do not sell or share my personal information"
      />

      <section className="py-14">
        <Container>
          <Prose>
            <h2>The short version</h2>
            <p>
              We <strong>do not sell your personal information for money</strong> to advertisers,
              data brokers, or anyone else, and we do not use it for cross-context behavioural
              advertising.
            </p>
            <p>
              We <strong>do</strong> pass your enquiry to gold buyers, because that is the service
              you asked us to perform. Some state privacy statutes define &ldquo;sharing&rdquo;
              broadly enough to reach that kind of disclosure, so rather than give you a
              reassuring absolute, here is exactly what happens.
            </p>

            <h2>What we actually do with an enquiry</h2>
            <ul>
              <li>
                When you submit an enquiry, we match it with licence-verified gold buyers covering
                your area and pass them your details so they can respond.
              </li>
              <li>
                Those buyers pay us for that activity. That is disclosed in the footer of every
                page and on the <Link href="/about">about page</Link>.
              </li>
              <li>
                We do not add you to a general marketing list, sell your details on to unrelated
                third parties, or pass them to anyone who is not a verified buyer relevant to your
                enquiry.
              </li>
            </ul>

            <h2>Making a request</h2>
            <p>You can ask us to:</p>
            <ul>
              <li>stop sharing your personal information with buyers;</li>
              <li>tell you what we hold about you;</li>
              <li>correct it;</li>
              <li>delete it, other than records we are required to keep;</li>
              <li>stop contacting you altogether.</li>
            </ul>
            <p>
              Use the <Link href="/contact">contact page</Link>. We will confirm receipt and
              respond within the time your state&rsquo;s law requires, or promptly where no
              statutory deadline applies.
            </p>
            <p>
              We may need to verify your identity before acting on a request — usually by
              confirming details you already gave us. That check exists to stop someone else
              obtaining or deleting your information.
            </p>

            <h2>An honest note about what opting out means</h2>
            <p>
              If you ask us to stop sharing your details with buyers, we will. But the service is
              the introduction — so opting out generally means we can no longer get you offers. The
              valuation tools stay free and require no personal information at all: the{' '}
              <Link href="/gold-calculator">calculator</Link> asks for karat and weight and nothing
              else.
            </p>

            <h2>Authorised agents</h2>
            <p>
              You may use an authorised agent to make a request on your behalf. We will ask for
              proof of that authorisation.
            </p>

            <h2>No discrimination</h2>
            <p>
              We will not deny you service, charge you a different price, or give you a lower
              quality of service because you exercised a privacy right.
            </p>

            <h2>State law</h2>
            <p>
              Georgia does not currently have a comprehensive consumer privacy statute. We extend
              the choices above to everyone who uses this site regardless of where they live,
              rather than only to residents of states whose laws compel it.
            </p>
          </Prose>
        </Container>
      </section>
    </>
  )
}
