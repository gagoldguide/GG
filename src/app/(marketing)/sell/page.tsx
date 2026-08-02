import Link from 'next/link'
import { ShieldCheck, Scale, Lock } from 'lucide-react'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import SellForm from '@/components/forms/SellForm'
import FaqSection from '@/components/ui/FaqSection'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/content/site'

const TITLE = 'Sell Your Gold in Georgia — Get Competing Offers'
const DESCRIPTION =
  'Tell us what you have and receive competing offers from licence-verified Georgia gold buyers. ' +
  'Free, no obligation, and every offer is shown against live melt value.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/sell',
})

const FAQ = [
  {
    question: 'What does it cost to get offers?',
    answer:
      'Nothing. The service is free to people selling gold. We are paid by the buyers listed on ' +
      'the platform, never by you, and no commission is taken from what you receive.',
  },
  {
    question: 'Do I have to accept an offer?',
    answer:
      'No. Every offer is an estimate subject to physical inspection, and none is binding until ' +
      'you accept it. You can decline all of them and owe nothing.',
  },
  {
    question: 'Who sees my contact details?',
    answer:
      'Your enquiry is matched with licence-verified buyers covering your area. We do not publish ' +
      'your details, and we do not sell your information to unrelated advertisers.',
  },
  {
    question: 'Why do you ask for my phone number?',
    answer:
      'Because gold valuations almost always need a short conversation — buyers ask about ' +
      'hallmarks, condition and weight before quoting. You choose whether to consent to being ' +
      'contacted, and you can revoke that consent at any time.',
  },
]

export default function SellPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Sell your gold', path: '/sell' },
        ]}
      />

      <PageHero
        eyebrow="Free · no obligation"
        title="Get competing offers for your gold"
        lead="Tell us what you have. We match your enquiry with licence-verified buyers covering your area, so you can compare offers instead of accepting the first one."
      />

      <section className="py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <div className="rounded-card border border-line bg-surface p-6 sm:p-8 dark:border-line-dark dark:bg-surface-muted-dark">
              <SellForm />
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-card border border-line bg-surface-muted p-6 dark:border-line-dark dark:bg-surface-muted-dark">
                <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                  Know the number first
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                  Work out the melt value before you speak to anyone. It takes two minutes, and it
                  turns every offer into a percentage you can compare rather than a number you have
                  to trust.
                </p>
                <Link
                  href="/gold-calculator"
                  className="mt-4 inline-flex text-sm font-semibold text-vault-700 underline"
                >
                  Open the calculator
                </Link>
              </div>

              <ul className="space-y-5">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Verified buyers only',
                    body: 'Permit number, issuing municipality and expiry date checked before a business is listed.',
                  },
                  {
                    icon: Scale,
                    title: 'Offers shown against melt',
                    body: 'Every offer is displayed next to the gold content value, so you can see the percentage being paid.',
                  },
                  {
                    icon: Lock,
                    title: 'Your details stay private',
                    body: 'Nothing is published. Contact details go only to buyers matched to your enquiry.',
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-vault-700" aria-hidden />
                    <div>
                      <h3 className="text-sm font-semibold text-ink dark:text-ink-dark">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="text-xs leading-relaxed text-ink-subtle dark:text-ink-muted-dark">
                {site.name} is not a gold dealer and does not buy gold. We connect you with
                licensed buyers, who make and settle any purchase directly with you.
              </p>
            </aside>
          </div>
        </Container>
      </section>

      <FaqSection items={FAQ} />
    </>
  )
}
