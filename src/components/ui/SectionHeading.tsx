import { cn } from '@/lib/utils'

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = 'h2',
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: string
  lead?: string
  as?: 'h1' | 'h2'
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cn(align === 'center' && 'mx-auto max-w-2xl text-center', className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-800">{eyebrow}</p>
      ) : null}
      <Tag
        className={cn(
          'font-display tracking-tight text-ink dark:text-ink-dark',
          Tag === 'h1' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl',
          eyebrow && 'mt-2'
        )}
      >
        {title}
      </Tag>
      {lead ? (
        <p className="mt-4 text-lg leading-relaxed text-ink-muted dark:text-ink-muted-dark">
          {lead}
        </p>
      ) : null}
    </div>
  )
}
