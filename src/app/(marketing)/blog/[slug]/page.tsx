import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import Prose from '@/components/ui/Prose'
import CtaBand from '@/components/ui/CtaBand'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { prisma } from '@/lib/db'

export const revalidate = 3600

/**
 * There is deliberately no loading.tsx in this route. A Suspense boundary makes Next flush the
 * shell and commit HTTP 200 before notFound() can run, turning every miss into a soft 404 that
 * Google will index — unlimited dead URLs on the domain, burning crawl budget.
 */
type Params = { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  try {
    return await prisma.post.findFirst({
      where: { slug, published: true },
      select: {
        title: true,
        excerpt: true,
        bodyHtml: true,
        publishedAt: true,
        updatedAt: true,
        metaTitle: true,
        metaDescription: true,
      },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Not found', robots: { index: false, follow: false } }

  return buildMetadata({
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? '',
    path: `/blog/${slug}`,
    ogType: 'article',
    publishedTime: post.publishedAt?.toISOString(),
  })
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${slug}` },
        ]}
      />
      <ArticleJsonLd
        headline={post.title}
        description={post.excerpt ?? ''}
        path={`/blog/${slug}`}
        datePublished={post.publishedAt?.toISOString()}
        dateModified={post.updatedAt.toISOString()}
      />

      <PageHero
        eyebrow={
          post.publishedAt
            ? post.publishedAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : undefined
        }
        title={post.title}
        lead={post.excerpt ?? undefined}
      />

      <section className="py-14">
        <Container>
          {/* Body comes from our own CMS, authored by staff — not from user input. */}
          <Prose>
            <div dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
          </Prose>
        </Container>
      </section>

      <CtaBand
        title="What is your gold worth today?"
        primary={{ label: 'Open the calculator', href: '/gold-calculator' }}
        secondary={{ label: 'Find a verified buyer', href: '/gold-buyers' }}
      />
    </>
  )
}
