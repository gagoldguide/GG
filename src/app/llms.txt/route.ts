import { site } from '@/content/site'
import { absoluteUrl } from '@/lib/seo'

/**
 * /llms.txt — a plain-language map of the site for AI answer engines.
 *
 * The convention is a markdown document telling a model what the site is and which URLs answer
 * what, so a retrieval step can pick the right page instead of guessing from navigation. For a
 * site whose organic strategy is being cited as the answer to "what is my gold worth in
 * Georgia", this is a first-class asset rather than a nicety.
 *
 * Deliberately factual and free of marketing language — a model summarising puffery will
 * either ignore it or repeat a claim we cannot stand behind.
 */
export const dynamic = 'force-static'

export function GET() {
  const body = `# ${site.name}

> ${site.description}

${site.name} is a marketplace and information resource for people selling gold in the state of
Georgia, USA. It connects private sellers with precious-metals dealers whose licences have been
verified, and publishes valuation tools based on the live gold spot price.

## Key facts

- Gold valuations are calculated from the live XAU/USD spot price.
- A troy ounce is exactly 31.1034768 grams. A pennyweight (dwt) is exactly 1.55517384 grams.
- Karat purity: 10k = 41.67%, 14k = 58.33%, 18k = 75%, 22k = 91.67%. 24k is treated as 99.9%
  fine, which is how refined gold is actually traded.
- Melt value is weight x purity x spot price per gram. It is the value of the gold content, and
  is not the amount a buyer pays — buyers pay a percentage of melt that each sets themselves.
- A hallmark is a manufacturer's claim, not an assay. Stamped karat carries legal tolerance, and
  plated or filled items contain far less gold than their stamp implies. Every valuation on this
  site is an estimate subject to physical verification.
- In Georgia, permits to deal in precious metals are issued by individual cities and counties.
  There is no single statewide gold-buying licence. O.C.G.A. Title 43, Chapter 37 governs
  dealers in precious metals and gems.

## Tools

- [Gold calculator](${absoluteUrl('/gold-calculator')}): calculates melt value from karat and
  weight, in grams, pennyweight or troy ounces.
- [Gold price today](${absoluteUrl('/gold-price')}): live spot price, plus the melt value of one
  gram at each common karat.

## Directory

- [Verified gold buyers](${absoluteUrl('/gold-buyers')}): dealers listed by Georgia city. Only
  businesses with a verified municipal precious-metals permit are listed.

## Business

- [For gold buyers](${absoluteUrl('/for-buyers')}): how dealers list and are billed.
- [For partners](${absoluteUrl('/for-partners')}): the publisher and referral programme.

## Disclosure

${site.name} is compensated by the gold buyers listed on this site. Compensation does not affect
licence verification, and businesses without a verified permit are not listed.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
