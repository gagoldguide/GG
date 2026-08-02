import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'

export default function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string
  title: string
  lead?: string
  children?: React.ReactNode
}) {
  return (
    <section className="border-b border-line bg-surface py-14 dark:border-line-dark dark:bg-surface-dark">
      <Container>
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} lead={lead} className="max-w-3xl" />
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </section>
  )
}
