'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { prisma } from '@/lib/db'
import { hashEmail, hashPhone, leadDedupeHash } from '@/lib/hash'
import { CONSENT_TEXT, CONSENT_VERSION } from '@/content/consent'
import { KARAT_LABEL, type Karat } from '@/lib/gold'

export type SellFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> }
  /** The platform is not provisioned to accept enquiries. Distinct from a user-fixable error. */
  | { status: 'unavailable' }

const KARATS = ['K10', 'K14', 'K18', 'K22', 'K24'] as const

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  email: z.string().trim().email('Please enter a valid email address.').max(200),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => v.length === 10 || (v.length === 11 && v.startsWith('1')), {
      message: 'Please enter a 10-digit US phone number.',
    }),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, 'Please enter a 5-digit ZIP code.'),
  karat: z.enum(KARATS).optional().or(z.literal('').transform(() => undefined)),
  weight: z.string().trim().max(40).optional(),
  method: z.enum(['IN_PERSON', 'MAIL_IN']),
  description: z
    .string()
    .trim()
    .min(10, 'Please tell us a little about what you have.')
    .max(2000),
  // The checkbox. Unchecked means no lead — we do not store a contactable record without it.
  consent: z.literal('on', {
    message: 'We cannot pass your details to a buyer without your consent.',
  }),
})

export async function submitSellEnquiry(
  _prev: SellFormState,
  formData: FormData
): Promise<SellFormState> {
  // Without a database there is nowhere to put a consent record, and capturing contact details
  // we cannot store — or worse, appearing to — is worse than declining the submission.
  if (!process.env.DATABASE_URL) return { status: 'unavailable' }

  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      fieldErrors[key] ??= issue.message
    }
    return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors }
  }

  const data = parsed.data
  const phone = data.phone.length === 11 ? data.phone.slice(1) : data.phone

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? h.get('x-real-ip') ?? null
  const userAgent = h.get('user-agent')

  const summaryParts = [
    data.karat ? KARAT_LABEL[data.karat as Karat] : null,
    data.weight || null,
    data.method === 'MAIL_IN' ? 'mail-in' : 'in person',
  ].filter(Boolean)

  try {
    // Same-day duplicate suppression. Scoped without a program because this lead is unrouted —
    // it belongs to nobody until a buyer is assigned, so nobody can be billed for it twice.
    const dedupeHash = leadDedupeHash('unrouted', phone, data.zip)

    const existing = await prisma.lead.findFirst({
      where: { dedupeHash },
      select: { id: true },
    })
    if (existing) {
      // Tell the person it worked. It did — we already have their enquiry, and revealing that a
      // record exists for this number would leak whether someone else used it.
      return { status: 'success' }
    }

    await prisma.lead.create({
      data: {
        name: data.name,
        emailHash: hashEmail(data.email),
        phoneHash: hashPhone(phone),
        zip: data.zip,
        itemSummary: [summaryParts.join(' · '), data.description].filter(Boolean).join(' — '),
        dedupeHash,
        // The full consent record. Version tag included so a future wording change stays
        // distinguishable from consent captured under the old text.
        consentText: `[${CONSENT_VERSION}] ${CONSENT_TEXT}`,
        consentIp: ip,
        consentUserAgent: userAgent,
        consentAt: new Date(),
      },
    })

    return { status: 'success' }
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong saving your enquiry. Please try again shortly.',
    }
  }
}
