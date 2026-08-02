import Link from 'next/link'
import { Mail, Phone, ShieldAlert } from 'lucide-react'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/content/site'

const TITLE = 'Contact Us'
const DESCRIPTION = `How to reach ${site.name} — general enquiries, buyer listings, partner applications, and reporting a problem with a listing.`

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/contact',
})

export default function ContactPage() {
  const hasEmail = site.contact.email.length > 0
  const hasPhone = site.contact.phone.length > 0

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />

      <PageHero eyebrow="Contact" title="Get in touch" />

      <section className="py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
                Contact details
              </h2>

              {/*
                Rendered from config, and only when the value exists. An invented support email or
                phone number on a money-related site is worse than none: people would try it, and
                a bounced message from a site handling gold sales reads as a scam.
              */}
              {hasEmail || hasPhone ? (
                <ul className="mt-6 space-y-4">
                  {hasEmail ? (
                    <li className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-vault-700" aria-hidden />
                      <a
                        href={`mailto:${site.contact.email}`}
                        className="text-sm font-medium text-vault-700 underline"
                      >
                        {site.contact.email}
                      </a>
                    </li>
                  ) : null}
                  {hasPhone ? (
                    <li className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-vault-700" aria-hidden />
                      <a
                        href={`tel:${site.contact.phone.replace(/\D/g, '')}`}
                        className="tnum text-sm font-medium text-vault-700 underline"
                      >
                        {site.contact.phone}
                      </a>
                    </li>
                  ) : null}
                </ul>
              ) : (
                <div className="mt-6 rounded-card border border-gold-300 bg-gold-50 p-5">
                  <p className="text-sm font-semibold text-gold-800">
                    Contact details are not published yet.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    We would rather show nothing here than an address that bounces. Details go up
                    when the buyer network launches.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-card border border-danger-600/30 bg-danger-50 p-6">
              <ShieldAlert className="h-6 w-6 text-danger-700" aria-hidden />
              <h2 className="mt-3 font-display text-lg font-semibold text-danger-700">
                Reporting a problem with a listing
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                If a listed business appears not to hold a current precious-metals permit, or is
                behaving in a way that does not match what we have published about them, tell us.
                We suspend the listing while we re-check rather than leaving it up.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Removing a paying listing costs us money. Leaving a wrong one up costs us the only
                thing that makes this directory worth using. Read{' '}
                <Link href="/verification" className="font-semibold underline">
                  how verification works
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Gold buyers',
                body: 'Listing your business, permits, pricing and billing.',
                href: '/for-buyers',
                cta: 'For gold buyers',
              },
              {
                title: 'Partners',
                body: 'The publisher programme, commissions and payouts.',
                href: '/for-partners',
                cta: 'For partners',
              },
              {
                title: 'Selling gold',
                body: 'Valuations, offers and how the process works.',
                href: '/how-it-works',
                cta: 'How it works',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-card border border-line bg-surface p-6 dark:border-line-dark dark:bg-surface-muted-dark"
              >
                <h3 className="font-display text-base font-semibold text-ink dark:text-ink-dark">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                  {card.body}
                </p>
                <Link
                  href={card.href}
                  className="mt-4 inline-flex text-sm font-semibold text-vault-700 underline"
                >
                  {card.cta}
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
