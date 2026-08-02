import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import CtaBand from '@/components/ui/CtaBand'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'

const TITLE = 'Learn — Gold Selling Guides for Georgia'
const DESCRIPTION =
  'Guides on what gold is worth, how karat and purity work, Georgia’s dealer registration and ' +
  'reporting rules, and how to sell safely.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/learn',
})

const GUIDES = [
  {
    href: '/gold-price',
    title: 'Gold price today',
    body: 'The live spot price, and what one gram of each karat is worth at it.',
  },
  {
    href: '/gold-calculator',
    title: 'Gold calculator',
    body: 'Melt value for your own pieces, in grams, pennyweight or troy ounces.',
  },
  {
    href: '/learn/karat-guide',
    title: 'Karat & purity guide',
    body: 'What 10K, 14K, 18K and 24K actually contain, how to read a 585 or 750 hallmark, and why plated gold is worth almost nothing.',
  },
  {
    href: '/learn/georgia-rules',
    title: 'Georgia dealer rules',
    body: 'Who may legally buy gold in Georgia, the records they must keep, and what they must report to police within 24 hours.',
  },
  {
    href: '/mail-in-vs-in-person',
    title: 'Mail-in vs in person',
    body: 'Who holds the risk at each stage, what carrier insurance actually covers, and how to protect yourself either way.',
  },
  {
    href: '/how-it-works',
    title: 'How selling here works',
    body: 'From valuation to competing offers to completing the sale.',
  },
]

export default function LearnIndexPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
        ]}
      />

      <PageHero
        eyebrow="Resources"
        title="Learn before you sell"
        lead="Most people sell gold once or twice in their lives, against a buyer who does it every day. These guides close some of that gap."
      />

      <section className="py-14">
        <Container>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((guide) => (
              <li key={guide.href}>
                <Link
                  href={guide.href}
                  className="group flex h-full flex-col rounded-card border border-line bg-surface p-6 transition-colors hover:border-vault-300 hover:bg-surface-muted dark:border-line-dark dark:bg-surface-muted-dark dark:hover:bg-surface-dark"
                >
                  <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                    {guide.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                    {guide.body}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-vault-700">
                    Read
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand
        title="Or skip straight to the number"
        primary={{ label: 'Value my gold', href: '/gold-calculator' }}
        secondary={{ label: 'Find a verified buyer', href: '/gold-buyers' }}
      />
    </>
  )
}
