import Container from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'

export default function CtaBand({
  title,
  lead,
  primary,
  secondary,
}: {
  title: string
  lead?: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
}) {
  return (
    <section className="border-t border-line bg-vault-900 py-16 dark:border-line-dark">
      <Container className="max-w-3xl text-center">
        <h2 className="font-display text-3xl tracking-tight text-ink-inverse">{title}</h2>
        {lead ? <p className="mt-4 text-vault-100">{lead}</p> : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={primary.href} variant="gold" size="lg">
            {primary.label}
          </ButtonLink>
          {secondary ? (
            <ButtonLink
              href={secondary.href}
              size="lg"
              className="border border-vault-300/40 bg-transparent text-ink-inverse hover:bg-vault-800"
            >
              {secondary.label}
            </ButtonLink>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
