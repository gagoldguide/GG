import GoldCalculator from '@/components/calculator/GoldCalculator'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { BreadcrumbJsonLd, FaqJsonLd, WebApplicationJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { getSpotPrice } from '@/lib/spot'

const TITLE = 'Gold Calculator — What Is My Gold Worth?'
const DESCRIPTION =
  'Calculate what your gold is worth at today’s spot price. Enter karat and weight in grams, ' +
  'pennyweight or troy ounces to see the melt value before you sell anywhere in Georgia.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/gold-calculator',
})

/**
 * Answer-first FAQ.
 *
 * These strings are rendered visibly on the page AND passed to FaqJsonLd — marked-up answers
 * that do not appear in the page body are a structured-data violation, so they share one
 * constant rather than being written twice.
 */
const FAQ = [
  {
    question: 'What is my 14k gold worth per gram?',
    answer:
      '14k gold is 58.3% pure gold (14 parts in 24). To find the value of one gram, multiply the ' +
      'current gold spot price per gram by 0.583. At a spot price of $4,500 per troy ounce, one ' +
      'gram of pure gold is $144.68, so one gram of 14k gold contains $84.40 of gold. ' +
      'Buyers pay a percentage of that melt value, not the full amount.',
  },
  {
    question: 'How do I work out the melt value of gold?',
    answer:
      'Melt value is weight multiplied by purity multiplied by the spot price per gram. Purity is ' +
      'the karat divided by 24 — 10k is 0.4167, 14k is 0.5833, 18k is 0.75, and 24k is treated as ' +
      '0.999 fine. Spot price per gram is the price per troy ounce divided by 31.1034768.',
  },
  {
    question: 'Will a gold buyer pay me the melt value?',
    answer:
      'No. Melt value is the value of the gold content itself. Buyers pay a percentage of it to ' +
      'cover refining, assay and their margin, and each buyer sets its own rate. Melt value is the ' +
      'benchmark you should use to judge whether an offer is fair, not the amount you should ' +
      'expect to receive.',
  },
  {
    question: 'Is the karat stamped on my jewellery accurate?',
    answer:
      'Not always. A hallmark is a manufacturer’s claim, not an assay, and it carries legal ' +
      'tolerance. Gold-plated and gold-filled items are frequently stamped in ways that suggest ' +
      'far more gold than they contain. Any buyer will test the item physically before making a ' +
      'final offer.',
  },
  {
    question: 'What is a pennyweight?',
    answer:
      'A pennyweight (dwt) is a troy weight unit equal to 1.55517384 grams, or one twentieth of a ' +
      'troy ounce. Many US jewellers and scrap gold buyers quote prices per pennyweight rather ' +
      'than per gram, so it is worth checking which unit an offer uses before comparing.',
  },
]

export default async function GoldCalculatorPage() {
  const spot = await getSpotPrice()

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Gold calculator', path: '/gold-calculator' },
        ]}
      />
      <WebApplicationJsonLd
        name="Gold Calculator"
        description={DESCRIPTION}
        path="/gold-calculator"
      />
      <FaqJsonLd items={FAQ} />

      <section className="border-b border-line bg-surface py-14 dark:border-line-dark dark:bg-surface-dark">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Free tool"
            title="What is my gold worth?"
            lead="Enter the karat and weight of each piece. We calculate the melt value — the worth of the gold content itself — at the current spot price, so you know the benchmark before anyone quotes you a number."
          />
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <GoldCalculator spot={spot} />
        </Container>
      </section>

      {/* ---------------------------------------------------------------- FAQ */}
      <section className="border-t border-line bg-surface-muted py-16 dark:border-line-dark dark:bg-surface-sunken-dark">
        <Container>
          <h2 className="font-display text-3xl tracking-tight text-ink dark:text-ink-dark">
            Common questions
          </h2>
          <dl className="mt-10 max-w-3xl space-y-8">
            {FAQ.map((item) => (
              <div key={item.question}>
                <dt className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                  {item.question}
                </dt>
                <dd className="mt-2 leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  )
}
