import { site } from '@/content/site'

/**
 * TCPA consent disclosure.
 *
 * SINGLE SOURCE. This exact string is rendered next to the checkbox AND written to
 * Lead.consentText when the form is submitted. It is one constant rather than two so the stored
 * record can never diverge from what the person actually saw — a consent record that does not
 * match the on-screen wording is worth nothing in a dispute, and reconstructing what the form
 * said on a given date months later is not possible if you did not store it.
 *
 * LEGAL CONTEXT (checked 2026-08-02):
 *  * The FCC's one-to-one consent rule was VACATED by the Eleventh Circuit on 24 January 2025
 *    (Insurance Marketing Coalition v. FCC), three days before it took effect. Federally,
 *    consent covering "and its marketing partners" is lawful again.
 *  * Carriers did not follow. T-Mobile still bans shared-consent traffic for SMS, so leads
 *    captured under a broad consent will not reliably text. That is a deliverability problem,
 *    not a legal one, and it is the reason the partner list must stay specific and inspectable.
 *  * TCPA litigation volume is unchanged. The full record — exact text, IP, user agent,
 *    timestamp — is the defence.
 *
 * REVIEW REQUIRED: this wording has not been reviewed by counsel. Do not launch without it.
 */
export const CONSENT_VERSION = '2026-08-02'

export const CONSENT_TEXT =
  `By checking this box and submitting this form, I agree that ${site.name} and the gold buyers ` +
  `it matches me with may contact me at the phone number and email address I have provided — ` +
  `including by automated telephone dialing system, prerecorded or artificial voice, and SMS ` +
  `text message — about selling my gold, even if that number appears on a Do Not Call list. ` +
  `Consent is not a condition of any purchase. Message and data rates may apply. I may revoke ` +
  `consent at any time by replying STOP to a text message, or by contacting ` +
  `${site.name} directly.`
