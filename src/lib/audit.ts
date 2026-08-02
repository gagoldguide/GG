import 'server-only'
import { headers } from 'next/headers'

import { prisma } from '@/lib/db'
import { hashIp } from '@/lib/hash'

/**
 * Audit trail.
 *
 * On this platform the audit log is not paperwork — it is the record of who changed money.
 * Approving a conversion, reversing one, adjusting a buyer's balance, verifying a licence and
 * marking a payout paid must all be attributable to a person, because every one of them is a
 * plausible thing to later dispute.
 *
 * `logAudit` is called from a server action right AFTER the mutation succeeds, and it NEVER
 * throws — a failed audit write must not roll back or break the operation it records.
 */

export interface AuditEntry {
  /** Dotted verb: "conversion.approve", "payout.mark_paid", "buyer.license_verify", … */
  action: string
  /** "conversion" | "payout" | "buyer" | "publisher" | "program" | … */
  entityType: string
  entityId?: string | null
  /** Human-readable one-liner for the timeline. Include the amounts — future you will want them. */
  detail?: string | null
  /** The acting user. Callers have already authenticated, so they know this. */
  userId?: string | null
}

async function clientIp(): Promise<string | null> {
  try {
    const h = await headers()
    // Vercel sets x-forwarded-for; take the first hop (the real client).
    return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || null
  } catch {
    return null
  }
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    const ip = await clientIp()
    await prisma.auditLog.create({
      data: {
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? null,
        detail: entry.detail ?? null,
        userId: entry.userId ?? null,
        // Hashed for the same reason click IPs are — see src/lib/hash.ts.
        ipHash: hashIp(ip),
      },
    })
  } catch {
    // Best-effort by design. The audit trail is never allowed to break the operation it records.
  }
}
