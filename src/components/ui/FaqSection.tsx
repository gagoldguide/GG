import Container from '@/components/ui/Container'
import { FaqJsonLd } from '@/components/seo/JsonLd'

export type FaqItem = { question: string; answer: string }

/**
 * FAQ block that renders the visible copy AND emits the FAQPage schema from the SAME array.
 *
 * This is deliberately one component rather than two. Google requires that marked-up answers
 * appear in the visible page content, and the easy way to violate that is to write the prose
 * once and the schema separately, then edit only one of them. Making it structurally impossible
 * is better than remembering.
 */
export default function FaqSection({
  items,
  title = 'Common questions',
  className,
}: {
  items: FaqItem[]
  title?: string
  className?: string
}) {
  return (
    <section
      className={
        className ??
        'border-t border-line bg-surface-muted py-16 dark:border-line-dark dark:bg-surface-sunken-dark'
      }
    >
      <FaqJsonLd items={items} />
      <Container>
        <h2 className="font-display text-3xl tracking-tight text-ink dark:text-ink-dark">
          {title}
        </h2>
        <dl className="mt-10 max-w-3xl space-y-8">
          {items.map((item) => (
            <div key={item.question}>
              <dt className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                {item.question}
              </dt>
              <dd className="mt-2 leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
