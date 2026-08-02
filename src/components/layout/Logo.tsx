import { site } from '@/content/site'
import { cn } from '@/lib/utils'

/**
 * Placeholder mark. The client has not supplied a logo yet, so this is a typographic lockup
 * with a gold ingot glyph — deliberately simple, and deliberately not a fake "designed" logo
 * that would have to be unpicked later.
 *
 * Replace the <svg> below when the real mark arrives; nothing else references it.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-7 w-7 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ingot: a trapezoid, the universally read shape for a gold bar. */}
        <path
          d="M6 21.5 9.5 12h13L26 21.5a1.5 1.5 0 0 1-1.4 2H7.4A1.5 1.5 0 0 1 6 21.5Z"
          className="fill-gold-500"
        />
        <path d="M9.5 12h13l1.2 3.2H8.3L9.5 12Z" className="fill-gold-300" />
        <path
          d="M13 8.5h6"
          className="stroke-vault-500"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight">{site.name}</span>
    </span>
  )
}
