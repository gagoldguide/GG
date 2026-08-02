import Link from 'next/link'

import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import Prose from '@/components/ui/Prose'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/content/site'

/*
 * ⚠ Counsel review required before launch — see the note in /privacy.
 *
 * KEEP THIS PAGE HONEST AND CURRENT. It lists the cookies actually set by the code. If you add
 * analytics, a chat widget, or any third-party pixel, this page changes in the same commit. A
 * cookie notice that under-reports is worse than none, because it is a documented false statement.
 */

const EFFECTIVE = 'August 2, 2026'

export const metadata = buildMetadata({
  title: 'Cookie Notice',
  description: `The cookies ${site.name} sets, what each is for, and how to control them.`,
  path: '/cookies',
})

export default function CookiesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Cookie notice', path: '/cookies' },
        ]}
      />

      <PageHero eyebrow={`Effective ${EFFECTIVE}`} title="Cookie notice" />

      <section className="py-14">
        <Container>
          <Prose>
            <p>
              This site uses a small number of cookies, all of them first-party. There is no
              advertising network, no third-party tracking pixel and no cross-site profiling on
              this site.
            </p>

            <h2>Cookies we set</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Purpose</th>
                  <th>Lifetime</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono text-xs">ggn_session</td>
                  <td>
                    Keeps you signed in to an account. Set only after you sign in. HttpOnly, so it
                    cannot be read by scripts.
                  </td>
                  <td>8 hours</td>
                </tr>
                <tr>
                  <td className="font-mono text-xs">ggclid</td>
                  <td>
                    Records that you arrived through a referral partner&rsquo;s link, so that the
                    partner is credited if you go on to make an enquiry. Contains a random
                    identifier, not information about you.
                  </td>
                  <td>Up to 30 days</td>
                </tr>
              </tbody>
            </table>

            <p>
              Both are strictly necessary for the parts of the service they support: without the
              session cookie you cannot stay signed in, and without the referral cookie we cannot
              pay the partner who referred you — which is how the site is funded.
            </p>

            <h2>Call tracking</h2>
            <p>
              Phone numbers shown on this site may be tracked numbers that forward to the
              buyer&rsquo;s real line. When you call one, the number dialled, the time and the
              duration are recorded. This is not a cookie and is not affected by browser settings.
              Calls ring the same business either way.
            </p>

            <h2>What we do not use</h2>
            <ul>
              <li>No advertising or retargeting cookies.</li>
              <li>No third-party analytics on this site.</li>
              <li>No social media tracking pixels.</li>
              <li>No cross-site profiling or data-broker sharing.</li>
            </ul>
            <p>
              If that changes, this page changes with it — and it will change before the cookie
              does, not after.
            </p>

            <h2>Controlling cookies</h2>
            <p>
              Every major browser lets you view, block and delete cookies in its settings. Blocking
              the session cookie will prevent you from signing in. Blocking the referral cookie
              will not stop you using the site — it only means a referring partner may not be
              credited.
            </p>

            <h2>More information</h2>
            <p>
              See our <Link href="/privacy">privacy policy</Link> for what we collect more
              generally, or <Link href="/contact">contact us</Link> with questions.
            </p>
          </Prose>
        </Container>
      </section>
    </>
  )
}
