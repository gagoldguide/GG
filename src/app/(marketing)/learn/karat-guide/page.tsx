import Link from 'next/link'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import Prose from '@/components/ui/Prose'
import FaqSection from '@/components/ui/FaqSection'
import CtaBand from '@/components/ui/CtaBand'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { KARAT_LABEL, KARAT_PURITY, TROY_OUNCE_GRAMS, PENNYWEIGHT_GRAMS, type Karat } from '@/lib/gold'

const TITLE = 'Gold Karat & Purity Guide — 10K, 14K, 18K, 22K, 24K'
const DESCRIPTION =
  'What each gold karat actually contains, how to read hallmarks like 585 and 750, the ' +
  'difference between grams, pennyweight and troy ounces, and why plated gold is worth nothing.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/learn/karat-guide',
})

const KARATS: Karat[] = ['K10', 'K14', 'K18', 'K22', 'K24']

/** European millesimal hallmarks, which are what is actually stamped on most modern pieces. */
const HALLMARK: Record<Karat, string> = {
  K10: '417',
  K14: '585',
  K18: '750',
  K22: '916',
  K24: '999',
}

const FAQ = [
  {
    question: 'What does 14K gold mean?',
    answer:
      'Karat measures how much of an alloy is gold, out of 24 parts. 14K means 14 parts in 24 are ' +
      'gold, so the piece is 58.3% gold by weight. The remaining 41.7% is other metals such as ' +
      'copper, silver, zinc or nickel, added for hardness and colour.',
  },
  {
    question: 'What does 585 stamped on jewellery mean?',
    answer:
      'It is the millesimal fineness — the gold content expressed in parts per thousand. 585 ' +
      'means 585 parts per thousand, or 58.5% gold, which is the European way of marking 14K. ' +
      'Likewise 417 is 10K, 750 is 18K, 916 is 22K and 999 is 24K fine gold.',
  },
  {
    question: 'Is 24K gold 100% pure?',
    answer:
      'Not in practice. Refined investment-grade gold is sold as 99.9% fine, marked 999, and ' +
      'higher grades like 999.9 exist but are uncommon in jewellery. Treating 24K as a ' +
      'mathematical 100% overstates its value by about 0.1%, which is why our calculations use ' +
      '99.9%.',
  },
  {
    question: 'How much is gold-plated jewellery worth?',
    answer:
      'Almost nothing as scrap. Plating is a microscopically thin layer of gold over a base ' +
      'metal, and recovering it usually costs more than the gold is worth. Gold-filled items ' +
      'contain more — a bonded layer that is typically 1/20th of the total weight — but a scrap ' +
      'buyer will still pay far less than the stamp on the surface suggests.',
  },
  {
    question: 'What is the difference between a gram, a pennyweight and a troy ounce?',
    answer:
      'A troy ounce is exactly 31.1034768 grams and is how gold is priced on world markets. A ' +
      'pennyweight (dwt) is one twentieth of a troy ounce, exactly 1.55517384 grams, and is what ' +
      'many US jewellers quote in. A troy ounce is heavier than the everyday ounce of 28.35 ' +
      'grams, so mixing the two understates gold value by roughly ten percent.',
  },
  {
    question: 'Can I trust the karat stamped on my jewellery?',
    answer:
      'Treat it as a starting point, not a fact. A hallmark is the manufacturer’s claim, it ' +
      'carries legal tolerance, and plated or filled items are frequently marked in ways that ' +
      'imply far more gold than they contain. Any real buyer will test the piece — usually by ' +
      'acid test, electronic tester or X-ray fluorescence — before making a final offer.',
  },
]

export default function KaratGuidePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
          { name: 'Karat & purity guide', path: '/learn/karat-guide' },
        ]}
      />
      <ArticleJsonLd
        headline={TITLE}
        description={DESCRIPTION}
        path="/learn/karat-guide"
        datePublished="2026-08-02"
        dateModified="2026-08-02"
      />

      <PageHero
        eyebrow="Before you sell"
        title="Karat, purity and weight — what the numbers mean"
        lead="Two things decide what your gold is worth: how much of it is actually gold, and how much it weighs. Everything else is negotiation."
      />

      <section className="py-14">
        <Container>
          <Prose>
            <h2>Karat is a fraction of 24</h2>
            <p>
              Karat measures gold content in parts out of 24. Pure gold is too soft for most
              jewellery, so it is alloyed with other metals — copper, silver, zinc, nickel — which
              add hardness and change the colour. The karat tells you the proportion that is gold;
              the rest has essentially no scrap value.
            </p>

            <table>
              <thead>
                <tr>
                  <th>Karat</th>
                  <th>Hallmark</th>
                  <th>Gold content</th>
                  <th>Fraction</th>
                </tr>
              </thead>
              <tbody>
                {KARATS.map((k) => {
                  const p = KARAT_PURITY[k]
                  return (
                    <tr key={k}>
                      <td className="font-semibold text-ink dark:text-ink-dark">
                        {KARAT_LABEL[k]}
                      </td>
                      <td className="tnum">{HALLMARK[k]}</td>
                      <td className="tnum">{((p.num / p.den) * 100).toFixed(1)}%</td>
                      <td className="tnum">
                        {k === 'K24' ? '999/1000 fine' : `${p.num}/24`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <p>
              Note the last row. We treat 24K as <strong>99.9% fine</strong> rather than a
              mathematical 100%, because that is how refined gold is actually traded. It is a small
              difference that becomes real money on a large lot.
            </p>

            <h2>Reading a hallmark</h2>
            <p>
              Most modern pieces carry a three-digit millesimal mark rather than a karat number —
              the gold content in parts per thousand. <strong>585</strong> is 14K,{' '}
              <strong>750</strong> is 18K, <strong>417</strong> is 10K. If you see{' '}
              <strong>GP</strong>, <strong>GF</strong>, <strong>HGE</strong> or{' '}
              <strong>1/20 12K</strong>, the piece is plated, filled or rolled — not solid gold.
            </p>
            <p>
              A hallmark is a claim, not an assay. It carries legal tolerance, and plated goods are
              routinely stamped in misleading ways. Every serious buyer tests before paying.
            </p>

            <h2>Weight: get the unit right</h2>
            <p>
              Gold is priced per <strong>troy</strong> ounce, which is not the ounce on a kitchen
              scale.
            </p>
            <ul>
              <li>
                1 troy ounce = <strong>{TROY_OUNCE_GRAMS} grams</strong> exactly
              </li>
              <li>
                1 pennyweight (dwt) = <strong>{PENNYWEIGHT_GRAMS} grams</strong> exactly, or 1/20
                troy ounce
              </li>
              <li>1 avoirdupois (everyday) ounce = 28.35 grams</li>
            </ul>
            <p>
              Confusing the two ounces understates your gold by about 9.6%. If a buyer quotes
              &ldquo;per pennyweight&rdquo; and another quotes &ldquo;per gram&rdquo;, convert
              before comparing — a price per dwt looks bigger simply because a dwt is bigger.
            </p>

            <h2>Working out the melt value</h2>
            <p>
              Melt value is the worth of the gold content itself, and it is the benchmark every
              offer should be judged against:
            </p>
            <ul>
              <li>Divide the spot price per troy ounce by 31.1034768 to get the price per gram.</li>
              <li>Multiply by the weight in grams.</li>
              <li>Multiply by the purity — 0.583 for 14K, 0.75 for 18K, and so on.</li>
            </ul>
            <p>
              The <Link href="/gold-calculator">gold calculator</Link> does this for you at the
              current spot price, in grams, pennyweight or troy ounces.
            </p>

            <h2>Why nobody pays full melt</h2>
            <p>
              Melt value is what the gold in your item is worth in bulk, refined. A buyer has to
              test it, take on the risk that the hallmark is wrong, refine it and resell it — so
              they pay a percentage of melt and keep the difference. That is a legitimate business,
              and the percentage is the thing worth shopping around for. It is also exactly why
              getting more than one offer matters.
            </p>
          </Prose>
        </Container>
      </section>

      <FaqSection items={FAQ} />

      <CtaBand
        title="Now put real numbers on it"
        lead="Enter your karat and weight and see the melt value at today’s spot price."
        primary={{ label: 'Open the calculator', href: '/gold-calculator' }}
        secondary={{ label: "Today's gold price", href: '/gold-price' }}
      />
    </>
  )
}
