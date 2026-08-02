import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { BadgeCheck, Globe, MapPin, Phone, Truck } from 'lucide-react'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import CtaBand from '@/components/ui/CtaBand'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata, absoluteUrl } from '@/lib/seo'
import { findCity } from '@/content/cities'
import { getCityWithBuyers } from '@/lib/queries'
import { site } from '@/content/site'

export const revalidate = 3600

/**
 * City directory page.
 *
 * THE PUBLISH GATE. This route 404s unless the city exists in the coverage list AND is marked
 * published in the database AND actually has at least one verified, active buyer. All three must
 * hold. ~50 near-identical "gold buyers in {city}" pages with nothing real on them is the
 * textbook doorway-page pattern, and it can suppress the entire domain — so a city with no
 * verified buyer gets no page at all rather than a thin one.
 *
 * There is deliberately no loading.tsx in this route. A Suspense boundary makes Next flush the
 * shell and commit HTTP 200 before the page can call notFound(), which turns every miss into a
 * soft 404 that Google will happily index.
 */

type Params = { params: Promise<{ city: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city: slug } = await params
  const seed = findCity(slug)
  if (!seed) return { title: 'Not found', robots: { index: false, follow: false } }

  const data = await getCityWithBuyers(slug)
  if (!data) return { title: 'Not found', robots: { index: false, follow: false } }

  return buildMetadata({
    title: data.metaTitle ?? `Gold Buyers in ${data.name}, GA — Licence Verified`,
    description:
      data.metaDescription ??
      `Licence-verified gold buyers in ${data.name}, ${seed.county} County, Georgia. ` +
        `Compare offers against live melt value before you sell.`,
    path: `/gold-buyers/${slug}`,
  })
}

export default async function CityPage({ params }: Params) {
  const { city: slug } = await params

  const seed = findCity(slug)
  if (!seed) notFound()

  const data = await getCityWithBuyers(slug)
  if (!data) notFound()

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Gold buyers', path: '/gold-buyers' },
          { name: data.name, path: `/gold-buyers/${slug}` },
        ]}
      />

      {/*
        One LocalBusiness node per listed buyer. Emitted only for verified, active buyers — the
        query already filters them — because marking up a business we have not checked would be
        asserting something we do not know.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            data.buyers.map((buyer) => ({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': absoluteUrl(`/gold-buyers/${slug}#${buyer.slug}`),
              name: buyer.businessName,
              telephone: buyer.phone,
              ...(buyer.websiteUrl ? { url: buyer.websiteUrl } : {}),
              address: {
                '@type': 'PostalAddress',
                addressLocality: buyer.cityName,
                addressRegion: site.stateAbbr,
                postalCode: buyer.zip,
                addressCountry: site.country,
              },
              areaServed: { '@type': 'City', name: data.name },
            }))
          ),
        }}
      />

      <PageHero
        eyebrow={`${seed.county} County, ${site.stateAbbr}`}
        title={`Gold buyers in ${data.name}`}
        lead={`Licence-verified dealers buying gold in ${data.name}. Every listing below has had its precious-metals permit checked, including the issuing municipality and expiry date.`}
      />

      <section className="py-14">
        <Container>
          {data.introHtml ? (
            <div
              className="mb-10 max-w-3xl leading-relaxed text-ink-muted dark:text-ink-muted-dark"
              dangerouslySetInnerHTML={{ __html: data.introHtml }}
            />
          ) : null}

          <ul className="grid gap-5 lg:grid-cols-2">
            {data.buyers.map((buyer) => (
              <li
                key={buyer.id}
                className="rounded-card border border-line bg-surface p-6 dark:border-line-dark dark:bg-surface-muted-dark"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                    {buyer.businessName}
                  </h2>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-700">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                    Verified
                  </span>
                </div>

                <dl className="mt-4 space-y-2 text-sm text-ink-muted dark:text-ink-muted-dark">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                    <dd>
                      {buyer.cityName}, {site.stateAbbr} {buyer.zip}
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0" aria-hidden />
                    <dd className="tnum">
                      <a href={`tel:${buyer.phone.replace(/\D/g, '')}`} className="underline">
                        {buyer.phone}
                      </a>
                    </dd>
                  </div>
                  {buyer.websiteUrl ? (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 shrink-0" aria-hidden />
                      <dd>
                        <a
                          href={buyer.websiteUrl}
                          rel="nofollow noopener"
                          target="_blank"
                          className="underline"
                        >
                          Website
                        </a>
                      </dd>
                    </div>
                  ) : null}
                  {buyer.acceptsMailIn ? (
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 shrink-0" aria-hidden />
                      <dd>Accepts mail-in</dd>
                    </div>
                  ) : null}
                  {buyer.licenseMunicipality ? (
                    <div className="pt-1 text-xs text-ink-subtle dark:text-ink-muted-dark">
                      Permit issued by {buyer.licenseMunicipality}
                    </div>
                  ) : null}
                </dl>
              </li>
            ))}
          </ul>

          {/* Municipality-specific facts are what make this page genuinely local rather than a
              template with a city name swapped in. */}
          {data.permitNote || data.holdPeriodDays ? (
            <div className="mt-12 max-w-3xl rounded-card border border-line bg-surface-muted p-6 dark:border-line-dark dark:bg-surface-muted-dark">
              <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                Local rules in {data.name}
              </h2>
              {data.permitNote ? (
                <p className="mt-3 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                  {data.permitNote}
                </p>
              ) : null}
              {data.holdPeriodDays ? (
                <p className="mt-3 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                  Purchased items must be held for {data.holdPeriodDays} days before they may be
                  sold, melted or altered.
                </p>
              ) : null}
              <p className="mt-3 text-xs text-ink-subtle dark:text-ink-muted-dark">
                Local ordinances change. Confirm current requirements with the municipality. See
                the{' '}
                <Link href="/learn/georgia-rules" className="underline">
                  Georgia dealer rules guide
                </Link>{' '}
                for the statewide picture.
              </p>
            </div>
          ) : null}
        </Container>
      </section>

      <CtaBand
        title={`Know the melt value before you visit a ${data.name} buyer`}
        lead="Regulation governs how a dealer operates. It does not govern what they offer you."
        primary={{ label: 'Value my gold', href: '/gold-calculator' }}
        secondary={{ label: 'Get competing offers', href: '/sell' }}
      />
    </>
  )
}
