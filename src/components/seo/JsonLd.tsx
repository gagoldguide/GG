import { site } from '@/content/site'
import { absoluteUrl } from '@/lib/seo'

/**
 * Schema.org emitter.
 *
 * This is the AEO/GEO backbone, not decoration. Answer engines and AI search read structured
 * data to decide what a page asserts; a page that answers "what is 14k gold worth per gram"
 * in prose but does not mark it up gets paraphrased without attribution.
 *
 * Rules:
 *  * Only emit what is TRUE. No AggregateRating until there are verified post-deal reviews —
 *    fabricated ratings are both a Google manual-action risk and an FTC problem.
 *  * FAQPage entries must match visible on-page text. Marked-up answers that do not appear on
 *    the page are a structured-data violation.
 */

type JsonLdValue = Record<string, unknown>

function Script({ data }: { data: JsonLdValue | JsonLdValue[] }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own typed objects, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** Root-level identity. Rendered once, in the marketing layout. */
export function OrganizationJsonLd() {
  return (
    <Script
      data={[
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': absoluteUrl('/#organization'),
          name: site.name,
          legalName: site.legalName,
          url: site.url,
          description: site.description,
          areaServed: {
            '@type': 'State',
            name: site.state,
            address: {
              '@type': 'PostalAddress',
              addressRegion: site.stateAbbr,
              addressCountry: site.country,
            },
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': absoluteUrl('/#website'),
          url: site.url,
          name: site.name,
          publisher: { '@id': absoluteUrl('/#organization') },
          inLanguage: 'en-US',
        },
      ]}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        })),
      }}
    />
  )
}

/**
 * FAQ markup. `answer` must be the SAME text a human reads on the page — pass the identical
 * string to both the component and the rendered FAQ block.
 */
export function FaqJsonLd({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }}
    />
  )
}

/** A tool/utility page, e.g. the gold calculator. */
export function WebApplicationJsonLd({
  name,
  description,
  path,
}: {
  name: string
  description: string
  path: string
}) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name,
        description,
        url: absoluteUrl(path),
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        // It is genuinely free to consumers, so this is a true statement.
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@id': absoluteUrl('/#organization') },
      }}
    />
  )
}

export function ArticleJsonLd({
  headline,
  description,
  path,
  datePublished,
  dateModified,
}: {
  headline: string
  description: string
  path: string
  datePublished?: string
  dateModified?: string
}) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        description,
        url: absoluteUrl(path),
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        publisher: { '@id': absoluteUrl('/#organization') },
        inLanguage: 'en-US',
      }}
    />
  )
}
