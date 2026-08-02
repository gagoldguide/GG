import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Button + link primitive.
 *
 * Every size clears a 44px touch target. On a previous project the Button primitive was fine
 * but almost every SECONDARY control bypassed it and shipped at 32px or less — so use this,
 * including for the small ones.
 */
const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vault-500',
  {
    variants: {
      variant: {
        // White on vault-500 measured 6.13:1 — see scripts/check-contrast.mjs.
        primary: 'bg-vault-500 text-ink-inverse hover:bg-vault-600 active:bg-vault-700',
        // Dark ink on gold-500 measured 7.51:1. Gold NEVER carries white text.
        gold: 'bg-gold-500 text-ink hover:bg-gold-400 active:bg-gold-600',
        outline:
          'border border-line-strong text-ink hover:bg-surface-muted dark:border-line-strong-dark dark:text-ink-dark dark:hover:bg-surface-muted-dark',
        ghost:
          'text-ink-muted hover:bg-surface-muted hover:text-ink dark:text-ink-muted-dark dark:hover:bg-surface-muted-dark dark:hover:text-ink-dark',
      },
      size: {
        sm: 'min-h-11 px-4 py-2 text-sm',
        md: 'min-h-11 px-5 py-3 text-sm',
        lg: 'min-h-12 px-6 py-3.5 text-base',
      },
      block: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', block: false },
  }
)

type ButtonVariants = VariantProps<typeof button>

export function Button({
  className,
  variant,
  size,
  block,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants) {
  return <button className={cn(button({ variant, size, block }), className)} {...props} />
}

export function ButtonLink({
  className,
  variant,
  size,
  block,
  href,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & ButtonVariants) {
  return (
    <Link href={href} className={cn(button({ variant, size, block }), className)} {...props} />
  )
}
