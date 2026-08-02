import Link from 'next/link'
import { MapPin } from 'lucide-react'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import CtaBand from '@/components/ui/CtaBand'
import FaqSection from '@/components/ui/FaqSection'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { GEORGIA_CITIES, REGIONS } from '@/content/cities'
import { getPublishedCitySlugs, countVerifiedBuyers } from '@/lib/queries'
import { site } from '@/content/site'

const TITLE = 'Gold Buyers in Georgia — Verified by City'
const DESCRIPTION =
  'Find licence-verified gold buyers across Georgia, listed by city. We check each dealer’s ' +
  'precious-metals permit, issuing municipality and expiry date before listing them.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/gold-buyers',
})

export const revalidate = 3600

const FAQ = [
  {
    question: 'How do I find a reputable gold buyer in Georgia?',
    answer:
      'Check that they are permitted before anything else. Georgia dealers must register with the ' +
      'county sheriff, and most cities require a local permit as well. Then know your melt value ' +
      'before you go, ask what percentage of melt they are offering, and get more than one quote.',
  },
  {
    question: 'Why are some Georgia cities not linked here?',
    answer:
      'Because we only publish a city page once at least one buyer there has been licence ' +
      'verified. Publishing a page for every city regardless would mean putting up pages with no ' +
      'real information on them, which helps nobody looking for an actual buyer.',
  },
  {
    question: 'Do you charge me to use the directory?',
    answer:
      'No. The directory is free to use. We are compensated by the buyers listed on it, which is ' +
      'disclosed on every page, and that compensation does not affect whether a business passes ' +
      'verification.',
  },
]

export default async function GoldBuyersIndexPage() {
  const [published, verifiedCount] = await Promise.all([
    getPublishedCitySlugs(),
    countVerifiedBuyers(),
  ])

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Gold buyers', path: '/gold-buyers' },
        ]}
      />

      <PageHero
        eyebrow="Directory"
        title="Verified gold buyers in Georgia"
        lead="Every business listed here has had its precious-metals permit checked — the number, the issuing municipality and the expiry date. Listings suspend automatically when a permit lapses."
      >
        {/*
          Counts render ONLY when there is something true to say. An empty directory says so
          plainly rather than showing "0 verified buyers" dressed up as a statistic, and there is
          no invented number anywhere on this page.
        */}
        {verifiedCount > 0 ? (
          <p className="tnum text-sm font-semibold text-vault-700">
            {verifiedCount} verified {verifiedCount === 1 ? 'buyer' : 'buyers'} listed across{' '}
            {published.size} {published.size === 1 ? 'city' : 'cities'}
          </p>
        ) : (
          <div className="max-w-2xl rounded-card border border-gold-300 bg-gold-50 p-5">
            <p className="text-sm font-semibold text-gold-800">
              The directory is still being built.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              We are verifying permits with dealers across Georgia now. Rather than fill this page
              with unchecked listings scraped from elsewhere, we are leaving it empty until there
              are buyers we can actually stand behind. In the meantime the{' '}
              <Link href="/gold-calculator" className="font-semibold text-vault-700 underline">
                calculator
              </Link>{' '}
              will tell you what your gold is worth wherever you sell it.
            </p>
          </div>
        )}
      </PageHero>

      <section className="py-14">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
            Areas we cover
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted dark:text-ink-muted-dark">
            {site.state} cities inside our service area. A city becomes a link once a verified
            buyer covers it.
          </p>

          <div className="mt-10 space-y-10">
            {REGIONS.map((region) => {
              const cities = GEORGIA_CITIES.filter((c) => c.region === region)
              if (cities.length === 0) return null

              return (
                <div key={region}>
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-800">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {region}
                  </h3>
                  <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
                    {cities.map((city) => {
                      const live = published.has(city.slug)
                      return (
                        <li key={city.slug} className="text-sm">
                          {live ? (
                            <Link
                              href={`/gold-buyers/${city.slug}`}
                              className="font-medium text-vault-700 underline underline-offset-2"
                            >
                              {city.name}
                            </Link>
                          ) : (
                            <span className="text-ink-subtle dark:text-ink-muted-dark">
                              {city.name}
                            </span>
                          )}
                          <span className="ml-1.5 text-xs text-ink-subtle dark:text-ink-muted-dark">
                            {city.county} Co.
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      <FaqSection items={FAQ} />

      <CtaBand
        title="Are you a licensed Georgia gold buyer?"
        lead="Listing requires a current precious-metals permit. You are billed for qualified activity, never for the listing itself unless you choose a subscription."
        primary={{ label: 'List your business', href: '/for-buyers' }}
        secondary={{ label: 'How verification works', href: '/verification' }}
      />
    </>
  )
}
