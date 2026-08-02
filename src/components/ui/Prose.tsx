import { cn } from '@/lib/utils'

/**
 * Long-form text wrapper.
 *
 * Hand-rolled rather than @tailwindcss/typography: the plugin's defaults fight the design
 * tokens (it hardcodes its own greys, which would bypass the contrast gate entirely), and this
 * site only needs a handful of elements styled.
 */
export default function Prose({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'max-w-3xl text-ink-muted dark:text-ink-muted-dark',
        '[&_p]:mt-4 [&_p]:leading-relaxed',
        '[&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink dark:[&_h2]:text-ink-dark',
        '[&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink dark:[&_h3]:text-ink-dark',
        '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5',
        '[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5',
        '[&_li]:leading-relaxed',
        '[&_a]:font-semibold [&_a]:text-vault-700 [&_a]:underline',
        '[&_strong]:font-semibold [&_strong]:text-ink dark:[&_strong]:text-ink-dark',
        '[&_table]:mt-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left',
        '[&_th]:border-b [&_th]:border-line [&_th]:py-3 [&_th]:pr-4 [&_th]:text-sm [&_th]:font-semibold [&_th]:text-ink dark:[&_th]:border-line-dark dark:[&_th]:text-ink-dark',
        '[&_td]:border-b [&_td]:border-line [&_td]:py-3 [&_td]:pr-4 [&_td]:text-sm dark:[&_td]:border-line-dark',
        className
      )}
    >
      {children}
    </div>
  )
}
