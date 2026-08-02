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

  // Every entry here must resolve. /login is deliberately absent — it is noindex.
  const staticRoutes: MetadataRoute.Sitemap = [
    ...(
      [
        ['/', 1.0, 'weekly'],
        ['/gold-calculator', 0.9, 'weekly'],
        ['/gold-price', 0.9, 'hourly'],
        ['/sell', 0.9, 'weekly'],
        ['/gold-buyers', 0.8, 'daily'],
        ['/how-it-works', 0.7, 'monthly'],
        ['/verification', 0.7, 'monthly'],
        ['/mail-in-vs-in-person', 0.7, 'monthly'],
        ['/learn', 0.7, 'weekly'],
        ['/learn/karat-guide', 0.8, 'monthly'],
        ['/learn/georgia-rules', 0.8, 'monthly'],
        ['/for-buyers', 0.6, 'monthly'],
        ['/for-buyers/pricing', 0.5, 'monthly'],
        ['/for-buyers/integration', 0.5, 'monthly'],
        ['/for-partners', 0.6, 'monthly'],
        ['/for-partners/commissions', 0.5, 'monthly'],
        ['/for-partners/payouts', 0.5, 'monthly'],
        ['/blog', 0.5, 'weekly'],
        ['/about', 0.4, 'monthly'],
        ['/contact', 0.4, 'monthly'],
        ['/privacy', 0.2, 'yearly'],
        ['/privacy/do-not-sell', 0.2, 'yearly'],
        ['/terms', 0.2, 'yearly'],
        ['/cookies', 0.2, 'yearly'],
      ] as const
    ).map(([path, priority, changeFrequency]) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency,
      priority,
    })),
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
