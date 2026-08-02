'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'

import { nav } from '@/content/site'
import Logo from './Logo'
import { cn } from '@/lib/utils'

/**
 * Primary navigation.
 *
 * Desktop uses hover/focus-revealed submenus built from CSS group state rather than JS, so the
 * menu works before hydration and for keyboard users without a focus-trap implementation.
 * Mobile gets a single expanded panel — nested accordions on a phone hide exactly the links
 * people came for.
 */
export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md dark:border-line-dark dark:bg-surface-dark/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label={`${'Home'}`}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-control px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink dark:text-ink-muted-dark dark:hover:bg-surface-muted-dark dark:hover:text-ink-dark"
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden />
                </Link>

                <div className="invisible absolute left-0 top-full w-64 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="rounded-card border border-line bg-surface p-2 shadow-lg dark:border-line-dark dark:bg-surface-muted-dark">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-control px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink dark:text-ink-muted-dark dark:hover:bg-surface-dark dark:hover:text-ink-dark"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="rounded-control px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark"
          >
            Sign in
          </Link>
          <Link
            href="/gold-calculator"
            className="rounded-control bg-vault-500 px-4 py-2.5 text-sm font-semibold text-ink-inverse transition-colors hover:bg-vault-600"
          >
            What&rsquo;s my gold worth?
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-control text-ink dark:text-ink-dark lg:hidden"
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          'border-t border-line bg-surface lg:hidden dark:border-line-dark dark:bg-surface-dark',
          open ? 'block' : 'hidden'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink-muted dark:text-ink-muted-dark">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-control"
            >
              <span className="sr-only">Close menu</span>
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <ul className="space-y-5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-1 text-sm font-semibold text-ink dark:text-ink-dark"
                >
                  {item.label}
                </Link>
                <ul className="mt-1 space-y-1 border-l border-line pl-3 dark:border-line-dark">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center py-2 text-sm text-ink-muted dark:text-ink-muted-dark"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/gold-calculator"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-control bg-vault-500 px-4 py-3 text-sm font-semibold text-ink-inverse"
            >
              What&rsquo;s my gold worth?
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-control border border-line-strong px-4 py-3 text-sm font-medium text-ink dark:border-line-strong-dark dark:text-ink-dark"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
