import Link from 'next/link'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import Prose from '@/components/ui/Prose'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/content/site'

/*
 * ⚠ LAUNCH BLOCKER — NOT REVIEWED BY COUNSEL.
 *
 * A working draft that accurately describes the service so a lawyer reviews reality rather than
 * boilerplate. Georgia counsel must review this, /privacy, /cookies and the consent wording in
 * src/content/consent.ts before public launch. The limitation-of-liability and dispute sections
 * in particular are placeholders in substance and must not be relied on as drafted.
 */

const EFFECTIVE = 'August 2, 2026'

export const metadata = buildMetadata({
  title: 'Terms of Use',
  description: `The terms governing use of ${site.name}.`,
  path: '/terms',
})

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Terms of use', path: '/terms' },
        ]}
      />

      <PageHero eyebrow={`Effective ${EFFECTIVE}`} title="Terms of use" />

      <section className="py-14">
        <Container>
          <Prose>
            <p>
              These terms govern your use of {site.name}. By using the site you accept them. If you
              do not, please do not use the site.
            </p>

            <h2>What this service is</h2>
            <p>
              {site.name} is an information resource and an introduction service. We publish
              valuation tools based on the gold spot price, we maintain a directory of gold buyers
              whose precious-metals permits we have checked, and we pass enquiries to those buyers.
            </p>

            <h2>What this service is not</h2>
            <ul>
              <li>
                <strong>We are not a gold dealer.</strong> We do not buy, sell, appraise, assay,
                hold or transport gold.
              </li>
              <li>
                <strong>We are not a party to your transaction.</strong> Any sale is a contract
                between you and the buyer. We do not hold your items or your money, and there is no
                escrow.
              </li>
              <li>
                <strong>We do not set prices.</strong> Buyers set their own rates.
              </li>
              <li>
                <strong>We do not provide legal, tax or financial advice.</strong>
              </li>
            </ul>

            <h2>Valuations are estimates</h2>
            <p>
              Every figure this site produces is an estimate calculated from the gold spot price
              and the karat and weight you supply. Karat is taken from the hallmark, and a hallmark
              is a manufacturer&rsquo;s claim rather than an assay — it carries tolerance, and
              plated or filled items contain far less gold than their markings imply.
            </p>
            <p>
              Actual purity is determined by physical testing. No figure on this site is an offer,
              a valuation for insurance or probate, or a guarantee of what you will be paid. Spot
              prices are obtained from third-party data providers and may be delayed or
              unavailable; where we cannot obtain a price we display none.
            </p>

            <h2>Offers and introductions</h2>
            <p>
              Offers displayed or communicated through the service are estimates subject to
              physical inspection and are not binding until accepted and completed with the buyer
              directly. We do not guarantee that you will receive any offer, that offers will reach
              any particular level, or that a buyer will be available in your area.
            </p>

            <h2>Verification, and its limits</h2>
            <p>
              Before listing a business we check its precious-metals permit, the issuing
              municipality and the expiry date, and listings suspend automatically once a recorded
              expiry passes. That check confirms a business is permitted. It is{' '}
              <strong>not</strong> a warranty of the price they offer, the quality of their
              service, or the outcome of any transaction, and we do not endorse any listed
              business. See <Link href="/verification">how we verify</Link>.
            </p>

            <h2>Your responsibilities</h2>
            <ul>
              <li>Provide accurate information, and only about yourself.</li>
              <li>
                Only offer for sale items you own and are legally entitled to sell. Georgia dealers
                are required to record and report their purchases to law enforcement.
              </li>
              <li>Do not use the service unlawfully, or to harass or defraud anyone.</li>
              <li>
                Do not scrape, resell or republish the directory, or attempt to interfere with
                tracking, attribution or billing.
              </li>
              <li>You must be at least 18 years old to use this service.</li>
            </ul>

            <h2>How we are paid</h2>
            <p>
              We are compensated by the gold buyers listed on this site — for qualified calls,
              validated enquiries, confirmed purchases and listing subscriptions. We are not paid
              by people selling gold and take no commission from what you receive. Compensation
              does not affect whether a business passes verification.
            </p>

            <h2>Buyers and partners</h2>
            <p>
              Businesses listing on the site and partners in the referral programme are subject to
              separate agreements covering verification, billing, attribution and payouts. Where
              those agreements conflict with these terms, the separate agreement governs that
              relationship.
            </p>

            <h2>Intellectual property</h2>
            <p>
              The content, design and software of this site belong to {site.legalName} or its
              licensors. You may use the site for its intended purpose. You may not copy or
              republish substantial parts of it, including the directory, without permission.
            </p>

            <h2>Disclaimers and liability</h2>
            <p>
              The service is provided &ldquo;as is&rdquo;. To the fullest extent permitted by law
              we disclaim implied warranties of merchantability, fitness for a particular purpose
              and non-infringement. We are not liable for the acts or omissions of any buyer, for
              the outcome of any transaction, or for indirect or consequential losses.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of the State of Georgia, without regard to its
              conflict of laws rules.
            </p>

            <h2>Changes</h2>
            <p>
              We may update these terms. The effective date above will change when we do, and
              continued use after that constitutes acceptance.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms: <Link href="/contact">contact us</Link>.
            </p>
          </Prose>
        </Container>
      </section>
    </>
  )
}
