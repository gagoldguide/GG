'use client'

import { useActionState } from 'react'
import { CheckCircle2, AlertTriangle } from 'lucide-react'

import { submitSellEnquiry, type SellFormState } from '@/app/(marketing)/sell/actions'
import { CONSENT_TEXT } from '@/content/consent'
import { KARAT_LABEL } from '@/lib/gold'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const KARATS = ['K10', 'K14', 'K18', 'K22', 'K24'] as const

const field =
  'min-h-11 w-full rounded-control border border-line-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle dark:border-line-strong-dark dark:bg-surface-muted-dark dark:text-ink-dark'
const label = 'block text-sm font-semibold text-ink dark:text-ink-dark'

export default function SellForm() {
  const [state, formAction, pending] = useActionState<SellFormState, FormData>(
    submitSellEnquiry,
    { status: 'idle' }
  )

  if (state.status === 'success') {
    return (
      <div className="rounded-card border border-success-600/30 bg-success-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-success-700" aria-hidden />
        <h2 className="mt-4 font-display text-2xl font-semibold text-success-700">
          Enquiry received
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
          We will match your enquiry with licence-verified buyers covering your area and be in
          touch. You are under no obligation to accept any offer.
        </p>
      </div>
    )
  }

  const errors = state.status === 'error' ? (state.fieldErrors ?? {}) : {}
  const err = (name: string) => errors[name]

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.status === 'unavailable' ? (
        <div className="flex gap-3 rounded-control border border-warning-700/30 bg-warning-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning-800" aria-hidden />
          <div className="text-sm text-warning-800">
            <p className="font-semibold">We are not accepting enquiries yet.</p>
            <p className="mt-1 leading-relaxed">
              The buyer network is still being verified, so there is nobody to pass your details
              to. Rather than collect your contact information and sit on it, we would rather say
              so. The{' '}
              <a href="/gold-calculator" className="font-semibold underline">
                calculator
              </a>{' '}
              works now and will tell you what your gold is worth wherever you sell it.
            </p>
          </div>
        </div>
      ) : null}

      {state.status === 'error' && !state.fieldErrors ? (
        <div className="rounded-control border border-danger-600/30 bg-danger-50 p-4 text-sm text-danger-700">
          {state.message}
        </div>
      ) : null}

      {/* ---------------------------------------------------------- what you have */}
      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
          What are you selling?
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="karat" className={label}>
              Karat <span className="font-normal text-ink-subtle">(if you know it)</span>
            </label>
            <select id="karat" name="karat" className={cn(field, 'mt-1.5')} defaultValue="">
              <option value="">Not sure</option>
              {KARATS.map((k) => (
                <option key={k} value={k}>
                  {KARAT_LABEL[k]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="weight" className={label}>
              Approximate weight <span className="font-normal text-ink-subtle">(optional)</span>
            </label>
            <input
              id="weight"
              name="weight"
              placeholder="e.g. 25 g, or 3 rings"
              className={cn(field, 'mt-1.5')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className={label}>
            Describe your items
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            aria-invalid={Boolean(err('description'))}
            aria-describedby={err('description') ? 'description-error' : undefined}
            placeholder="e.g. Two 14k chains, a broken bracelet and a class ring. Some pieces are stamped 585."
            className={cn(field, 'mt-1.5 min-h-28 py-2')}
          />
          {err('description') ? (
            <p id="description-error" className="mt-1.5 text-sm text-danger-700">
              {err('description')}
            </p>
          ) : null}
        </div>

        <div>
          <span className={label}>How would you prefer to sell?</span>
          <div className="mt-2 flex flex-wrap gap-4">
            {[
              { value: 'IN_PERSON', text: 'In person' },
              { value: 'MAIL_IN', text: 'Mail-in' },
            ].map((option, i) => (
              <label key={option.value} className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="method"
                  value={option.value}
                  defaultChecked={i === 0}
                  className="h-4 w-4 accent-vault-500"
                />
                {option.text}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* ---------------------------------------------------------- contact */}
      <fieldset className="space-y-4 border-t border-line pt-6 dark:border-line-dark">
        <legend className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
          How should buyers reach you?
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { id: 'name', text: 'Your name', type: 'text', placeholder: 'Jane Doe' },
            { id: 'zip', text: 'ZIP code', type: 'text', placeholder: '30303' },
            { id: 'email', text: 'Email', type: 'email', placeholder: 'you@example.com' },
            { id: 'phone', text: 'Phone', type: 'tel', placeholder: '(404) 555-0123' },
          ].map((input) => (
            <div key={input.id}>
              <label htmlFor={input.id} className={label}>
                {input.text}
              </label>
              <input
                id={input.id}
                name={input.id}
                type={input.type}
                required
                aria-invalid={Boolean(err(input.id))}
                aria-describedby={err(input.id) ? `${input.id}-error` : undefined}
                placeholder={input.placeholder}
                className={cn(field, 'mt-1.5')}
              />
              {err(input.id) ? (
                <p id={`${input.id}-error`} className="mt-1.5 text-sm text-danger-700">
                  {err(input.id)}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </fieldset>

      {/* ----------------------------------------------------------- consent
          The disclosure is rendered from the SAME constant the server writes to the consent
          record, so the stored text is provably what was on screen. */}
      <div className="border-t border-line pt-6 dark:border-line-dark">
        <label className="flex gap-3">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={Boolean(err('consent'))}
            className="mt-1 h-4 w-4 shrink-0 accent-vault-500"
          />
          <span className="text-xs leading-relaxed text-ink-subtle dark:text-ink-muted-dark">
            {CONSENT_TEXT}
          </span>
        </label>
        {err('consent') ? (
          <p className="mt-2 text-sm text-danger-700">{err('consent')}</p>
        ) : null}
      </div>

      <Button type="submit" size="lg" block disabled={pending}>
        {pending ? 'Sending…' : 'Get competing offers'}
      </Button>

      <p className="text-center text-xs text-ink-subtle dark:text-ink-muted-dark">
        Free, with no obligation to accept any offer.
      </p>
    </form>
  )
}
