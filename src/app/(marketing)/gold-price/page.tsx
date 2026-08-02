import Link from 'next/link'

import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import SpotPricePanel from '@/components/ui/SpotPricePanel'
import { ButtonLink } from '@/components/ui/Button'
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { getSpotPrice, hasPrice } from '@/lib/spot'
import { KARAT_LABEL, KARAT_PURITY, meltValueCents, type Karat } from '@/lib/gold'
import { formatUsd } from '@/lib/money'

const TITLE = 'Gold Price Today — Live Spot Price Per Gram and Ounce'
const DESCRIPTION =
  'Today’s live gold spot price in USD, with the value of one gram of 10k, 14k, 18k, 22k and ' +
  '24k gold worked out from it. Updated continuously.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/gold-price',
})

/** The feed is cached for 15 minutes upstream; match it here so the page reflects that. */
export const revalidate = 900

const KARATS: Karat[] = ['K10', 'K14', 'K18', 'K22', 'K24']

const FAQ = [
  {
    question: 'What is the gold spot price?',
    answer:
      'The spot price is the market price for one troy ounce of pure gold for immediate delivery, ' +
      'quoted as XAU/USD. It is the benchmark every scrap gold valuation starts from, and it ' +
      'moves continuously while markets are open.',
  },
  {
    question: 'How many grams are in a troy ounce of gold?',
    answer:
      'A troy ounce is exactly 31.1034768 grams. It is heavier than the ordinary avoirdupois ' +
      'ounce of 28.35 grams, which is why converting with the wrong ounce understates gold value ' +
      'by roughly ten percent.',
  },
  {
    question: 'Why is the price I am offered lower than the spot price?',
    answer:
      'Spot is the price of pure gold in bulk. Your item is not pure — 14k is 58.3% gold — and a ' +
      'buyer has to assay, refine and resell it, so they pay a percentage of the melt value. The ' +
      'spot price tells you the ceiling, not the offer.',
  },
]

export default async function GoldPricePage() {
  const spot = await getSpotPrice()

  // One gram of each karat, valued at the live price. Computed by the same tested library that
  // powers the calculator, so this table can never drift from it.
  const perGram = hasPrice(spot)
    ? KARATS.map((karat) => ({
        karat,
        purity: KARAT_PURITY[karat],
        valueCents: meltValueCents(1_000, karat, spot.pricePerOztCents),
      }))
    : null

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Gold price today', path: '/gold-price' },
        ]}
      />
      <FaqJsonLd items={FAQ} />

      <section className="border-b border-line bg-surface py-14 dark:border-line-dark dark:bg-surface-dark">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <div>
              <SectionHeading
                as="h1"
                eyebrow="Live market data"
                title="Gold price today"
                lead="The spot price is what one troy ounce of pure gold trades for. Everything a scrap gold buyer offers you is derived from it — so it is the number to check before you sell."
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/gold-calculator" size="lg">
                  Value my gold
                </ButtonLink>
                <ButtonLink href="/gold-buyers" variant="outline" size="lg">
                  Find a verified buyer
                </ButtonLink>
              </div>
            </div>
            <SpotPricePanel spot={spot} />
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- per-karat table */}
      <section className="py-16">
        <Container>
          <h2 className="font-display text-3xl tracking-tight text-ink dark:text-ink-dark">
            What one gram of gold is worth, by karat
          </h2>
          <p className="mt-3 max-w-2xl text-ink-muted dark:text-ink-muted-dark">
            Gold content only. This is the melt value — what the gold in one gram of each alloy is
            worth at the current spot price, before any buyer&rsquo;s margin.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-lg border-collapse text-left">
              <thead>
                <tr className="border-b border-line dark:border-line-dark">
                  <th scope="col" className="py-3 pr-4 text-sm font-semibold text-ink dark:text-ink-dark">
                    Karat
                  </th>
                  <th scope="col" className="py-3 pr-4 text-sm font-semibold text-ink dark:text-ink-dark">
                    Gold content
                  </th>
                  <th scope="col" className="py-3 text-sm font-semibold text-ink dark:text-ink-dark">
                    Melt value per gram
                  </th>
                </tr>
              </thead>
              <tbody>
                {KARATS.map((karat) => {
                  const row = perGram?.find((r) => r.karat === karat)
                  const purity = KARAT_PURITY[karat]
                  return (
                    <tr key={karat} className="border-b border-line dark:border-line-dark">
                      <th
                        scope="row"
                        className="py-3 pr-4 font-display text-base font-semibold text-ink dark:text-ink-dark"
                      >
                        {KARAT_LABEL[karat]}
                      </th>
                      <td className="tnum py-3 pr-4 text-sm text-ink-muted dark:text-ink-muted-dark">
                        {((purity.num / purity.den) * 100).toFixed(1)}%
                      </td>
                      <td className="tnum py-3 text-sm text-ink dark:text-ink-dark">
                        {row ? (
                          formatUsd(row.valueCents)
                        ) : (
                          <span className="text-ink-subtle dark:text-ink-muted-dark">
                            price unavailable
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-ink-subtle dark:text-ink-muted-dark">
            24k is calculated at 99.9% fine rather than a mathematical 100%, which is how refined
            gold is actually traded. Figures are estimates based on the stamped karat; real purity
            is confirmed by assay.
          </p>
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
          <p className="mt-10 text-sm text-ink-muted dark:text-ink-muted-dark">
            Next:{' '}
            <Link href="/gold-calculator" className="font-semibold text-vault-700 underline">
              work out what your specific pieces are worth
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  )
}
