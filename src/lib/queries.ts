import 'server-only'

import { prisma } from '@/lib/db'

/**
 * Read queries for the public directory.
 *
 * Every one of these swallows a database failure and returns an empty result. That is deliberate:
 * the marketing site must stay up and crawlable when the database is unreachable or, right now,
 * simply not provisioned yet. An empty directory is a true statement; a 500 is not.
 */

export type DirectoryBuyer = {
  id: string
  slug: string
  businessName: string
  cityName: string
  county: string | null
  zip: string
  phone: string
  websiteUrl: string | null
  licenseMunicipality: string | null
  acceptsMailIn: boolean
}

/** Slugs of cities that have at least one verified buyer and are cleared to render a page. */
export async function getPublishedCitySlugs(): Promise<Set<string>> {
  try {
    const rows = await prisma.city.findMany({
      where: { published: true },
      select: { slug: true },
    })
    return new Set(rows.map((r) => r.slug))
  } catch {
    return new Set()
  }
}

/**
 * A city page's data, or null if the city is not cleared to publish.
 *
 * Returning null (which the route turns into a 404) is the whole doorway-page defence: a city
 * with no verified buyers has nothing unique to say, so it must not render a thin templated page.
 */
export async function getCityWithBuyers(slug: string): Promise<{
  name: string
  county: string | null
  permitNote: string | null
  holdPeriodDays: number | null
  introHtml: string | null
  metaTitle: string | null
  metaDescription: string | null
  buyers: DirectoryBuyer[]
} | null> {
  try {
    const city = await prisma.city.findUnique({
      where: { slug },
      select: {
        name: true,
        county: true,
        published: true,
        permitNote: true,
        holdPeriodDays: true,
        introHtml: true,
        metaTitle: true,
        metaDescription: true,
        buyers: {
          orderBy: [{ featured: 'desc' }, { rank: 'asc' }],
          select: {
            goldBuyer: {
              select: {
                id: true,
                slug: true,
                businessName: true,
                cityName: true,
                county: true,
                zip: true,
                phone: true,
                websiteUrl: true,
                licenseMunicipality: true,
                licenseVerified: true,
                acceptsMailIn: true,
                status: true,
              },
            },
          },
        },
      },
    })

    if (!city || !city.published) return null

    // Belt and braces: the join is filtered again here so an unverified or suspended buyer can
    // never render, even if a CityBuyer row was left behind.
    const buyers: DirectoryBuyer[] = city.buyers
      .map((b) => b.goldBuyer)
      .filter((b) => b.licenseVerified && b.status === 'ACTIVE')
      // Fields are picked explicitly rather than spread, so adding a sensitive column to the
      // GoldBuyer select later cannot silently leak it into a public page.
      .map((b) => ({
        id: b.id,
        slug: b.slug,
        businessName: b.businessName,
        cityName: b.cityName,
        county: b.county,
        zip: b.zip,
        phone: b.phone,
        websiteUrl: b.websiteUrl,
        licenseMunicipality: b.licenseMunicipality,
        acceptsMailIn: b.acceptsMailIn,
      }))

    if (buyers.length === 0) return null

    return { ...city, buyers }
  } catch {
    return null
  }
}

/** Total verified, active buyers. Used for honest copy — rendered only when greater than zero. */
export async function countVerifiedBuyers(): Promise<number> {
  try {
    return await prisma.goldBuyer.count({
      where: { licenseVerified: true, status: 'ACTIVE' },
    })
  } catch {
    return 0
  }
}
