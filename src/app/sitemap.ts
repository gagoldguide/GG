import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/seo'
import { prisma } from '@/lib/db'

/**
 * Sitemap.
 *
 * DISCIPLINE: this lists only routes that actually resolve. It is tempting to enumerate the
 * planned information architecture here, but a sitemap advertising URLs that 404 burns crawl
 * budget and teaches Google the domain is unreliable — the opposite of what a local SEO play
 * needs. Add entries as the pages ship, not before.
 *
 * City pages are pulled from the database and gated on `published`, which is itself gated on the
 * city having at least one licence-verified buyer. That gate is the defence against ~50
 * near-identical city pages reading as a doorway-page network.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    {
      url: absoluteUrl('/gold-calculator'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/gold-price'),
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ]

  // Best-effort. No database configured yet must not break the sitemap for the static pages.
  let dynamicRoutes: MetadataRoute.Sitemap = []
  try {
    const [cities, posts] = await Promise.all([
      prisma.city.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ])

    dynamicRoutes = [
      ...cities.map((city) => ({
        url: absoluteUrl(`/gold-buyers/${city.slug}`),
        lastModified: city.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...posts.map((post) => ({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: post.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ]
  } catch {
    /* database not reachable — ship the static sitemap rather than a 500 */
  }

  return [...staticRoutes, ...dynamicRoutes]
}
