import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/seo'

/**
 * robots.txt.
 *
 * AI crawlers are deliberately ALLOWED. The whole answer-engine strategy is to be the source
 * that gets cited for "what is 14k gold worth in Georgia" — blocking GPTBot or ClaudeBot would
 * forfeit exactly the visibility this site is built to win.
 *
 * The portals are disallowed: they are behind auth anyway, so crawling them only produces login
 * redirects, and /c/ is the click-tracking redirector, which must never be crawled — a bot
 * following tracking links would manufacture fake clicks that publishers get paid for.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/buyer', '/publisher', '/account', '/api/', '/c/', '/login'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
