import Link from 'next/link'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import CtaBand from '@/components/ui/CtaBand'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { prisma } from '@/lib/db'

const TITLE = 'Blog'
const DESCRIPTION =
  'Notes on gold prices, selling safely in Georgia, and how the scrap gold trade actually works.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/blog',
})

export const revalidate = 3600

async function getPosts() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, title: true, excerpt: true, publishedAt: true },
      take: 30,
    })
  } catch {
    // No database yet. An empty blog is honest; a 500 on a public page is not.
    return []
  }
}

export default async function BlogIndexPage() {
  const posts = await getPosts()

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ]}
      />

      <PageHero
        eyebrow="Writing"
        title="Blog"
        lead="Notes on gold prices, selling safely in Georgia, and how the scrap trade actually works."
      />

      <section className="py-14">
        <Container>
          {posts.length === 0 ? (
            <div className="max-w-2xl rounded-card border border-line bg-surface-muted p-8 dark:border-line-dark dark:bg-surface-muted-dark">
              <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                Nothing published yet
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                The guides are the useful part right now — they cover what your gold is worth, how
                karat and purity work, and what Georgia law requires of the people buying it.
              </p>
              <Link
                href="/learn"
                className="mt-4 inline-flex text-sm font-semibold text-vault-700 underline"
              >
                Read the guides
              </Link>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex h-full flex-col rounded-card border border-line bg-surface p-6 transition-colors hover:bg-surface-muted dark:border-line-dark dark:bg-surface-muted-dark dark:hover:bg-surface-dark"
                  >
                    {post.publishedAt ? (
                      <time
                        dateTime={post.publishedAt.toISOString()}
                        className="text-xs font-semibold text-gold-800"
                      >
                        {post.publishedAt.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    ) : null}
                    <h2 className="mt-2 font-display text-lg font-semibold text-ink dark:text-ink-dark">
                      {post.title}
                    </h2>
                    {post.excerpt ? (
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                        {post.excerpt}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <CtaBand
        title="What is your gold worth today?"
        primary={{ label: 'Open the calculator', href: '/gold-calculator' }}
        secondary={{ label: 'Read the guides', href: '/learn' }}
      />
    </>
  )
}
