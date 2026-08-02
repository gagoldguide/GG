import type { Metadata } from 'next'

import { site } from '@/content/site'

/**
 * Metadata helpers.
 *
 * Every page gets an explicit canonical. Without one, the city pages — which are the whole
 * organic strategy — end up competing with their own query-string variants.
 */

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString()
}

export function buildMetadata(input: {
  title: string
  description: string
  path: string
  noIndex?: boolean
  ogType?: 'website' | 'article'
  publishedTime?: string
}): Metadata {
  const url = absoluteUrl(input.path)

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: input.ogType ?? 'website',
      title: input.title,
      description: input.description,
      url,
      siteName: site.name,
      locale: site.locale,
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
    },
  }
}
