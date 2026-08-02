import Link from 'next/link'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import Prose from '@/components/ui/Prose'
import FaqSection from '@/components/ui/FaqSection'
import CtaBand from '@/components/ui/CtaBand'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'

const TITLE = 'Mail-In vs In-Person — Which Is Safer for Selling Gold?'
const DESCRIPTION =
  'The real trade-offs between mailing gold to a buyer and selling it face to face: who holds ' +
  'the risk, what insurance actually covers, and what to do before you hand anything over.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/mail-in-vs-in-person',
})

const FAQ = [
  {
    question: 'Is it safe to mail gold to a buyer?',
    answer:
      'It can be, but you are carrying the risk while the parcel is in transit and again while it ' +
      'sits with the buyer before payment. Use insured, tracked, signature-required shipping, ' +
      'declare the full value, photograph and weigh everything before it is sealed, and confirm ' +
      'in writing what happens if you reject the offer.',
  },
  {
    question: 'What happens if I do not accept a mail-in offer?',
    answer:
      'A reputable buyer returns your items, insured, at their cost. Get that in writing before ' +
      'you post anything. If a buyer is vague about return shipping, or wants you to pay for it, ' +
      'treat that as the answer to a different question.',
  },
  {
    question: 'Is selling gold in person better?',
    answer:
      'For most people, yes. You keep possession until you are paid, you see the test performed, ' +
      'and you can walk away at any point. The trade-off is that you are limited to buyers you ' +
      'can physically reach, and it is easier to feel pressured when you are standing at a ' +
      'counter.',
  },
  {
    question: 'Does homeowners insurance cover gold I have mailed?',
    answer:
      'Usually not once it leaves your possession, and standard carrier insurance often caps ' +
      'precious metals well below their value or excludes them outright. Check the specific ' +
      'policy limits before assuming you are covered — this is the single most common mistake ' +
      'people make with mail-in.',
  },
  {
    question: 'How do I avoid being pressured in person?',
    answer:
      'Know the melt value before you arrive, decide your walk-away number in advance, and be ' +
      'willing to leave. A buyer who will not let you take your item away, or who introduces new ' +
      'deductions once it is on their scale, is telling you what the rest of the transaction ' +
      'would be like.',
  },
]

export default function MailInVsInPersonPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Mail-in vs in-person', path: '/mail-in-vs-in-person' },
        ]}
      />
      <ArticleJsonLd
        headline={TITLE}
        description={DESCRIPTION}
        path="/mail-in-vs-in-person"
        datePublished="2026-08-02"
        dateModified="2026-08-02"
      />

      <PageHero
        eyebrow="Before you sell"
        title="Mail-in or in person?"
        lead="Both work. They fail differently, and the difference is mostly about who is holding the risk at each stage."
      />

      <section className="py-14">
        <Container>
          <Prose>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>In person</th>
                  <th>Mail-in</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Who holds the item</td>
                  <td>You, until you agree a price</td>
                  <td>The carrier, then the buyer, before you are paid</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">You watch the test</td>
                  <td>Yes</td>
                  <td>No — you rely on their report</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Walking away</td>
                  <td>Immediate, at no cost</td>
                  <td>Requires a return shipment</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Buyer choice</td>
                  <td>Limited to those you can reach</td>
                  <td>Wider</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Main risk</td>
                  <td>Being pressured at the counter</td>
                  <td>Loss in transit, and disputes you cannot see</td>
                </tr>
                <tr>
                  <td className="font-semibold text-ink dark:text-ink-dark">Speed</td>
                  <td>Often same day</td>
                  <td>Several days each way</td>
                </tr>
              </tbody>
            </table>

            <h2>If you sell in person</h2>
            <ul>
              <li>
                Know the melt value before you arrive and decide your walk-away number.{' '}
                <Link href="/gold-calculator">The calculator</Link> takes two minutes.
              </li>
              <li>Bring photo ID — Georgia dealers are legally required to record who they buy from.</li>
              <li>Ask to see the item weighed and tested in front of you. This is normal.</li>
              <li>Ask what percentage of melt the offer represents. A real buyer will answer.</li>
              <li>
                Be prepared to leave. Nothing about a scrap gold sale needs to be decided in the
                next five minutes.
              </li>
            </ul>

            <h2>If you mail it in</h2>
            <ul>
              <li>
                <strong>Photograph and weigh everything</strong> before it is sealed, with the
                scale reading visible in the picture.
              </li>
              <li>
                <strong>Use insured, tracked, signature-required shipping</strong> and declare the
                full value. Under-declaring to save on postage voids the cover you are relying on.
              </li>
              <li>
                <strong>Check the insurance limit for precious metals specifically.</strong>{' '}
                Standard carrier cover frequently caps or excludes them, and household policies
                generally stop at your front door.
              </li>
              <li>
                <strong>Get the return terms in writing first</strong> — who pays for return
                shipping, insured to what value, and within how many days if you decline the offer.
              </li>
              <li>
                <strong>Agree how the offer will be presented.</strong> You want weight, karat and
                the resulting percentage of melt, not a single lump sum.
              </li>
            </ul>

            <h2>The honest recommendation</h2>
            <p>
              If a licence-verified buyer is within reasonable distance, sell in person. You keep
              possession until you are paid, you see the test, and you can end the conversation at
              any point — those three things eliminate most of what goes wrong.
            </p>
            <p>
              Mail-in is a sound option when distance or mobility makes that impractical, or when a
              distant buyer&rsquo;s offer is enough better to justify the extra risk. Just price
              that risk honestly rather than assuming it away, and never post anything you have not
              photographed and insured.
            </p>
          </Prose>
        </Container>
      </section>

      <FaqSection items={FAQ} />

      <CtaBand
        title="Find a verified buyer near you"
        lead="If there is one within driving distance, selling in person removes most of the risk."
        primary={{ label: 'Browse the directory', href: '/gold-buyers' }}
        secondary={{ label: 'Value my gold first', href: '/gold-calculator' }}
      />
    </>
  )
}
