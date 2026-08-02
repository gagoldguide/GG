import Link from 'next/link'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import Prose from '@/components/ui/Prose'
import CtaBand from '@/components/ui/CtaBand'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/content/site'

const TITLE = 'About Us'
const DESCRIPTION = `What ${site.name} is, how it makes money, and what it deliberately does not do.`

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />

      <PageHero
        eyebrow="About"
        title={`What ${site.name} is`}
        lead="A marketplace and information resource for people selling gold in Georgia — and a directory of dealers whose licences we have actually checked."
      />

      <section className="py-14">
        <Container>
          <Prose>
            <h2>The problem we are solving</h2>
            <p>
              Most people sell gold once or twice in their lives. The person buying it does so
              every day, knows the spot price to the minute, and knows exactly what a hallmark is
              worth. That asymmetry is the entire reason scrap gold is a profitable trade, and it
              is not going away.
            </p>
            <p>
              What can change is how much the seller knows before the conversation starts. Two
              things close most of the gap: knowing the melt value of what you are holding, and
              getting more than one offer. This site does both, and gives them away free.
            </p>

            <h2>How we make money</h2>
            <p>
              We are paid by the gold buyers listed here — for qualified calls, validated
              enquiries, confirmed purchases, and monthly listings. We are never paid by the person
              selling gold, and we take no commission from what you receive.
            </p>
            <p>
              That is disclosed in the footer of every page, and it is worth being blunt about the
              incentive it creates: we are paid when you contact a buyer. What we are not paid for
              is which buyer, or on what terms — so publishing melt value openly, and showing every
              offer as a percentage of it, costs us nothing and is the only version of this
              business worth running.
            </p>

            <h2>What we deliberately do not do</h2>
            <ul>
              <li>
                <strong>We do not buy gold.</strong> We are not a dealer. Every purchase is between
                you and a licensed buyer.
              </li>
              <li>
                <strong>We do not hold your item or your money.</strong> Nothing passes through us.
              </li>
              <li>
                <strong>We do not sell verification.</strong> A business without a current permit
                is not listed at any price.
              </li>
              <li>
                <strong>We do not publish numbers we cannot stand behind.</strong> When the price
                feed is down, this site shows no price rather than a stale one. When the directory
                is empty, it says so instead of padding itself with unchecked listings.
              </li>
            </ul>

            <h2>Why Georgia specifically</h2>
            <p>
              Because the licensing here is unusually hard for a member of the public to navigate.
              Georgia has no single statewide gold-buying licence — dealers register with the
              county sheriff under O.C.G.A. Title 43, Chapter 37, and individual cities and
              counties layer their own permits, fees and holding periods on top. Working out
              whether a given shop is operating legally is genuinely difficult, which makes it a
              problem worth solving properly. There is more detail in the{' '}
              <Link href="/learn/georgia-rules">Georgia dealer rules guide</Link>.
            </p>

            <h2>Get in touch</h2>
            <p>
              Questions, corrections, or a listing that looks wrong —{' '}
              <Link href="/contact">contact us</Link>. If you believe a listed business is not
              properly permitted, tell us and we will suspend the listing while we re-check.
            </p>
          </Prose>
        </Container>
      </section>

      <CtaBand
        title="Start with what your gold is worth"
        primary={{ label: 'Open the calculator', href: '/gold-calculator' }}
        secondary={{ label: 'How we verify buyers', href: '/verification' }}
      />
    </>
  )
}
