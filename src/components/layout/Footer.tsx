import Link from 'next/link'

import { site, footerGroups } from '@/content/site'
import Logo from './Logo'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-surface-muted dark:border-line-dark dark:bg-surface-sunken-dark">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2.5fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
              {site.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-ink dark:text-ink-dark">
                  {group.title}
                </h2>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-muted transition-colors hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/*
          Required disclosures, not decoration.
          - The valuation disclaimer: a hallmark is not an assay, so every figure this site
            shows is an estimate. Presenting estimates as offers is a consumer-protection
            problem, and burying the caveat in /terms does not fix it.
          - The compensation disclosure: we are paid by the buyers we list. The FTC expects
            that stated clearly and conspicuously, not inferred.
        */}
        <div className="mt-12 space-y-3 border-t border-line pt-8 text-xs leading-relaxed text-ink-subtle dark:border-line-dark dark:text-ink-muted-dark">
          <p>
            <strong className="font-semibold">Valuations are estimates.</strong> Figures shown on
            this site are calculated from the live gold spot price and the karat and weight you
            enter. A hallmark is not an assay — actual purity is confirmed by physical testing,
            and every offer is subject to that inspection.
          </p>
          <p>
            <strong className="font-semibold">How we are paid.</strong> {site.name} is compensated
            by the gold buyers listed on this site. Compensation does not determine licence
            verification, and unverified businesses are not listed.
          </p>
          <p className="pt-2">
            &copy; {year} {site.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
