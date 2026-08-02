import Link from 'next/link'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import Prose from '@/components/ui/Prose'
import FaqSection from '@/components/ui/FaqSection'
import CtaBand from '@/components/ui/CtaBand'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/content/site'

const TITLE = 'Georgia Gold Buying Laws — What Dealers Must Do'
const DESCRIPTION =
  'What Georgia law requires of gold buyers: registration with the county sheriff, permanent ' +
  'purchase records, daily reporting to law enforcement, and the local permits cities add on top.'

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/learn/georgia-rules',
})

/*
 * SOURCING NOTE (for maintainers, not the reader).
 *
 * The statutory content below was taken from the published text of O.C.G.A. Title 43, Chapter 37
 * (§§ 43-37-1 through 43-37-7) and checked on 2026-08-02. Statutes are amended; before relying on
 * any of this commercially, re-check the current text and have Georgia counsel review the page.
 *
 * The municipal examples (McDonough's fee, Thomasville's hold period) come from those cities'
 * own published ordinances and are illustrative — they are NOT statewide rules, and fees change.
 * That is precisely the point the page is making, so do not "tidy" them into general claims.
 */

const FAQ = [
  {
    question: 'Do you need a licence to buy gold in Georgia?',
    answer:
      'Yes. Under Georgia law a dealer in precious metals or gems must register before doing ' +
      'business, and must register separately for each place of business. Registration is made ' +
      'with the sheriff of the county — or, in counties that have a county police department, ' +
      'with the chief of that department. Many cities and counties also require their own local ' +
      'permit on top of that state registration.',
  },
  {
    question: 'Is there a single statewide gold dealer licence in Georgia?',
    answer:
      'No. Georgia has a statewide registration requirement under O.C.G.A. Title 43, Chapter 37, ' +
      'but the permits themselves are issued locally, and individual cities and counties set ' +
      'their own additional requirements and fees. A dealer legally operating in one Georgia city ' +
      'is not automatically permitted in the next one.',
  },
  {
    question: 'What records must a Georgia gold buyer keep?',
    answer:
      'Dealers must keep a permanent record of every purchase of precious metals or gems for at ' +
      'least two years. Entries must be in chronological order with no blank lines between them, ' +
      'and no erasures or alterations are allowed — a correction is made by drawing a line of ink ' +
      'through the entry so the original remains legible.',
  },
  {
    question: 'Do gold buyers report purchases to the police?',
    answer:
      'Yes. Georgia dealers must file a written report of the previous day’s purchases with the ' +
      'appropriate law enforcement officer of the county or municipality where they are ' +
      'registered, within 24 hours of the day the transactions took place, on forms that officer ' +
      'approves. This is why a legitimate buyer will always ask for your photo ID.',
  },
  {
    question: 'Why can’t a buyer melt my gold immediately?',
    answer:
      'Holding periods exist so that law enforcement can identify stolen property before it is ' +
      'destroyed. Georgia law allows items to be held when law enforcement has probable cause to ' +
      'believe they are stolen, and many local ordinances impose a fixed waiting period on every ' +
      'purchase regardless — Thomasville, for example, requires 14 days before an item may be ' +
      'sold, melted or altered. The exact period depends on the municipality.',
  },
  {
    question: 'What should I bring when I sell gold in Georgia?',
    answer:
      'A government-issued photo ID. Because dealers are legally required to record and report ' +
      'who they bought from, a buyer who does not ask for identification is not following the ' +
      'law — which tells you something about how they run the rest of their business.',
  },
]

export default function GeorgiaRulesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
          { name: 'Georgia dealer rules', path: '/learn/georgia-rules' },
        ]}
      />
      <ArticleJsonLd
        headline={TITLE}
        description={DESCRIPTION}
        path="/learn/georgia-rules"
        datePublished="2026-08-02"
        dateModified="2026-08-02"
      />

      <PageHero
        eyebrow="Know your rights"
        title="Georgia gold buying laws, in plain English"
        lead="Georgia regulates who may buy gold from the public, what they must write down, and what they must report to police. Knowing the rules is the fastest way to tell a legitimate buyer from a risky one."
      />

      <section className="py-14">
        <Container>
          <Prose>
            <p>
              Buying precious metals from the public is a regulated activity in Georgia. The
              governing law is <strong>O.C.G.A. Title 43, Chapter 37</strong> — &ldquo;Dealers in
              Precious Metals and Gems&rdquo; — which runs from &sect;&nbsp;43-37-1 to
              &sect;&nbsp;43-37-7. On top of it, individual cities and counties add their own
              permits, fees and waiting periods.
            </p>

            <h2>Registration is with the sheriff, and it is per location</h2>
            <p>
              A dealer must register before doing business, and must register{' '}
              <strong>separately for each place of business</strong>. The registration is made in
              writing and sworn or affirmed. The officer who administers it is the{' '}
              <strong>county sheriff</strong> — except in counties that have a county police
              department, where it is the chief of that department instead.
            </p>
            <p>
              A felony conviction can bar registration. This is not a formality that a dealer can
              quietly skip: operating without registering is an offence under &sect;&nbsp;43-37-6.
            </p>

            <h2>There is no single statewide gold licence</h2>
            <p>
              This is the part most people get wrong. &sect;&nbsp;43-37-5 preserves local
              requirements, so a municipality can impose its own permit, its own fee and its own
              conditions in addition to state registration. Two examples of how much this varies:
            </p>
            <ul>
              <li>
                <strong>McDonough</strong> publishes a precious metals permit with a{' '}
                <strong>$250 application fee</strong>, covering the purchase of precious metals or
                gems from anyone other than a manufacturer or another dealer.
              </li>
              <li>
                <strong>Thomasville</strong> requires that purchased items are{' '}
                <strong>held for 14 days</strong> after documentation reaches the police before
                they may be sold, melted or altered.
              </li>
            </ul>
            <p>
              Neither of those is a statewide rule. Fees and waiting periods are set locally and
              change, so the only reliable answer for a given shop is the one from that city or
              county.
            </p>

            <h2>Permanent records, kept a specific way</h2>
            <p>
              Dealers must keep a permanent record of each purchase for at least{' '}
              <strong>two years</strong>. The statute is unusually prescriptive about the form:
            </p>
            <ul>
              <li>entries in chronological order;</li>
              <li>no blank lines left between entries;</li>
              <li>no obliterations, alterations or erasures;</li>
              <li>
                corrections made by drawing a line of ink through the entry{' '}
                <strong>without destroying its legibility</strong>.
              </li>
            </ul>
            <p>
              The reason for that specificity is obvious once you see it: the record has to be
              usable as evidence, so it must be impossible to quietly rewrite after the fact.
            </p>

            <h2>Daily reporting to law enforcement</h2>
            <p>
              Every dealer must file a written report of the <strong>previous day&rsquo;s</strong>{' '}
              purchases with the appropriate law enforcement officer for the county or
              municipality where they are registered. It must be filed{' '}
              <strong>within 24 hours</strong> of the day the transactions occurred, on forms that
              officer approves, in legible English.
            </p>
            <p>
              This is why any legitimate Georgia gold buyer asks for photo identification. They
              are not being difficult — they are legally required to record and report who they
              bought from. A shop that offers to skip the paperwork is telling you it does not
              follow the law.
            </p>

            <h2>Melted metal and holding periods</h2>
            <p>
              It is unlawful for a dealer to buy precious metals in a melted or smelted state
              unless the purchase is from a registered dealer. Holding periods, whether from a
              local ordinance or from a law enforcement hold where there is probable cause that
              goods are stolen, exist for the same reason: once metal is melted, a stolen item
              cannot be identified or returned.
            </p>

            <h2>What this means for you as a seller</h2>
            <ul>
              <li>
                <strong>Bring photo ID.</strong> Expect to show it and to have the transaction
                recorded. That is the law working correctly.
              </li>
              <li>
                <strong>Ask where they are registered.</strong> A registered dealer will tell you
                the county and, where applicable, the municipal permit.
              </li>
              <li>
                <strong>Be wary of anyone who avoids records.</strong> No paperwork means no
                registration, and no recourse for you if something goes wrong.
              </li>
              <li>
                <strong>Know the melt value first.</strong> Regulation governs how a dealer
                operates, not what they pay. Use the{' '}
                <Link href="/gold-calculator">gold calculator</Link> before you walk in.
              </li>
            </ul>

            <h2>How {site.name} uses these rules</h2>
            <p>
              We check a business&rsquo;s permit, the issuing municipality and its expiry date
              before it appears in our directory, and listings are suspended automatically when a
              permit lapses. Read more about{' '}
              <Link href="/verification">how verification works</Link>.
            </p>

            <p className="text-xs text-ink-subtle dark:text-ink-muted-dark">
              Statutory content checked against the published text of O.C.G.A. Title 43, Chapter 37
              on 2 August 2026. This page is general information, not legal advice. Statutes and
              local ordinances are amended — confirm current requirements with the relevant county
              or municipality, or with a Georgia attorney, before relying on them.
            </p>
          </Prose>
        </Container>
      </section>

      <FaqSection items={FAQ} />

      <CtaBand
        title="Know what your gold is worth before you walk in"
        lead="The law governs how a dealer operates. It does not govern what they offer you — that part is on you to check."
        primary={{ label: 'Value my gold', href: '/gold-calculator' }}
        secondary={{ label: 'Find a verified buyer', href: '/gold-buyers' }}
      />
    </>
  )
}
