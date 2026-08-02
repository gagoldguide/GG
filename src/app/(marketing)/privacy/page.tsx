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
 * This is a substantive working draft written to describe what the system genuinely does, so
 * that a lawyer is reviewing an accurate description rather than boilerplate. It has NOT been
 * reviewed. Georgia counsel must review this, /terms, /cookies and the consent wording in
 * src/content/consent.ts before the site is publicly launched.
 *
 * Two facts this draft is built on, both checked 2026-08-02:
 *  * Georgia has NO comprehensive consumer privacy statute. SB 111 was introduced as the
 *    "Georgia Consumer Privacy Protection Act" but the House replaced its entire text with rural
 *    hospital tax credit amendments before it was signed on 11 May 2026. Bill trackers still show
 *    the original title. Do not "correct" this page to cite a Georgia privacy act.
 *  * We nonetheless describe rights in the terms other states' statutes use, because consumers
 *    from Florida, Tennessee and elsewhere will use this site.
 */

const EFFECTIVE = 'August 2, 2026'

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description: `How ${site.name} collects, uses, shares and retains personal information.`,
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Privacy policy', path: '/privacy' },
        ]}
      />

      <PageHero eyebrow={`Effective ${EFFECTIVE}`} title="Privacy policy" />

      <section className="py-14">
        <Container>
          <Prose>
            <p>
              This policy explains what {site.name} collects, why, who it goes to, and what you can
              ask us to do about it. It covers this website and the services offered through it.
            </p>

            <h2>What we collect</h2>
            <h3>Information you give us</h3>
            <ul>
              <li>
                <strong>Enquiry details</strong> — your name, email address, phone number, ZIP code
                and a description of the items you want to sell.
              </li>
              <li>
                <strong>Consent records</strong> — where you tick a consent box, we store the exact
                wording shown to you, the date and time, your IP address and your browser&rsquo;s
                user agent. This record exists so that both you and we can establish precisely what
                was agreed.
              </li>
              <li>
                <strong>Account information</strong>, if you create an account, and business and
                licensing information if you register as a gold buyer.
              </li>
            </ul>

            <h3>Information collected automatically</h3>
            <ul>
              <li>
                <strong>Referral identifiers.</strong> If you arrive through a partner link we
                record an identifier for that click so the referral can be attributed correctly.
              </li>
              <li>
                <strong>Call records.</strong> Calls made to tracked numbers on this site are
                logged with the number dialled, the time and the duration.
              </li>
              <li>
                <strong>Technical data</strong> such as IP address and user agent.
              </li>
            </ul>

            <h3>How we minimise what we hold</h3>
            <p>
              IP addresses recorded for click tracking and audit purposes are stored as a salted
              hash with a daily-rotating salt, not as raw addresses. Phone numbers and email
              addresses used for duplicate detection are stored as hashes.
            </p>
            <p>
              There is one deliberate exception: the IP address attached to a{' '}
              <strong>consent record</strong> is stored in full, because the purpose of that record
              is to evidence who consented and from where, and a hash evidences neither.
            </p>

            <h2>Why we use it</h2>
            <ul>
              <li>To match your enquiry with licence-verified gold buyers.</li>
              <li>To let those buyers contact you about your enquiry, where you have consented.</li>
              <li>To attribute referrals correctly and pay partners accurately.</li>
              <li>To detect duplicate and fraudulent activity.</li>
              <li>To operate, secure and improve the service, and to meet legal obligations.</li>
            </ul>

            <h2>Who we share it with</h2>
            <ul>
              <li>
                <strong>Gold buyers matched to your enquiry.</strong> This is the point of the
                service. Your details go to buyers relevant to your enquiry and area, not to a
                general list.
              </li>
              <li>
                <strong>Service providers</strong> who operate parts of the platform on our behalf
                — hosting, database, email delivery and telephone call tracking — under contract
                and only for those purposes.
              </li>
              <li>
                <strong>Law enforcement or regulators</strong>, where we are legally required to.
              </li>
            </ul>
            <p>
              We do not sell your personal information to unrelated advertisers or data brokers.
              See <Link href="/privacy/do-not-sell">Do not sell my information</Link> for how we
              treat that in the terms US state privacy laws use.
            </p>

            <h2>Calls and text messages</h2>
            <p>
              Where you have given consent, you may be contacted by phone, prerecorded or automated
              message, and SMS about your enquiry. Consent is never a condition of any purchase,
              and you may withdraw it at any time — reply STOP to a text message, or contact us
              directly. Message and data rates may apply. Withdrawing consent does not affect
              contact you have already received.
            </p>

            <h2>How long we keep it</h2>
            <ul>
              <li>
                <strong>Enquiries and consent records</strong> — retained while your enquiry is
                active and afterwards for as long as needed to evidence consent and resolve
                disputes.
              </li>
              <li>
                <strong>Click and call records</strong> — retained for attribution, billing and
                fraud investigation.
              </li>
              <li>
                <strong>Financial records</strong> — retained as long as tax and accounting rules
                require.
              </li>
            </ul>

            <h2>Your choices</h2>
            <p>You can ask us to:</p>
            <ul>
              <li>tell you what personal information we hold about you;</li>
              <li>correct information that is wrong;</li>
              <li>delete your information, subject to records we must keep by law;</li>
              <li>provide a copy in a portable format;</li>
              <li>stop contacting you.</li>
            </ul>
            <p>
              Georgia does not currently have a comprehensive consumer privacy statute. We offer
              these choices to everyone regardless of the state you live in, rather than only where
              a law compels it.
            </p>

            <h2>Security</h2>
            <p>
              Passwords are stored using a memory-hard hashing algorithm and are never recoverable
              in plain text. Personal identifiers are hashed where the system does not need the
              original value. Access to production data is restricted, and actions affecting
              accounts and payments are recorded in an audit log.
            </p>
            <p>
              No system is perfectly secure, and we will not claim otherwise.
            </p>

            <h2>Children</h2>
            <p>
              This service is not directed at children under 13, and we do not knowingly collect
              their personal information. If you believe a child has provided us with information,
              contact us and we will delete it.
            </p>

            <h2>Changes</h2>
            <p>
              If we change this policy we will update the effective date above. Material changes
              affecting how we use information you have already given us will be notified directly
              where we can reach you.
            </p>

            <h2>Contact</h2>
            <p>
              To exercise any of the choices above, or to ask a question about this policy, use the{' '}
              <Link href="/contact">contact page</Link>.
            </p>
          </Prose>
        </Container>
      </section>
    </>
  )
}
