/**
 * Seed: Georgia coverage list and operational feature flags.
 *
 * IDEMPOTENT. Every write is an upsert keyed on a natural unique column, so running this twice
 * changes nothing and running it against a live database does not clobber edits made in the
 * admin panel — only the reference columns are touched.
 *
 * WHAT THIS DOES NOT DO, DELIBERATELY:
 *
 *  * It does not publish any city. Every city is seeded with `published: false`, because a city
 *    page may only go live once at least one licence-verified buyer covers it. Seeding 59
 *    published city pages with no buyers on them would be exactly the doorway-page pattern the
 *    gate exists to prevent.
 *
 *  * It does not create fake buyers, fake reviews or demo listings. This is a directory whose
 *    only value is that the listings are real and checked. A seeded "Atlanta Gold & Silver" that
 *    someone later forgets to delete is a fabricated business on a live site.
 *
 *  * It does not create an admin with a known password. Passwords are set from a local machine
 *    against the live database, never planted by a seed script that lives in a public repo.
 *
 * Run: pnpm db:seed   (requires DIRECT_URL — the CLI runs DDL, which a pooler cannot)
 */
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import { GEORGIA_CITIES } from '../src/content/cities'

const connectionString =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    'No database URL found. Set DIRECT_URL (unpooled) in .env before seeding — the CLI runs DDL, ' +
      'and a transaction pooler cannot.'
  )
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

/**
 * Municipality-specific facts, checked 2026-08-02 against those cities' published ordinances.
 *
 * These are what make a city page genuinely local rather than a template with the name swapped
 * in — and they are the reason the publish gate is survivable at all. Only add an entry here
 * when you have actually read that municipality's ordinance; an invented permit fee on a page
 * telling people how to avoid unlicensed dealers is worse than no page.
 */
const MUNICIPAL_FACTS: Record<string, { permitNote?: string; holdPeriodDays?: number }> = {
  mcdonough: {
    permitNote:
      'McDonough requires a precious metals permit for buying precious metals or gems from ' +
      'anyone other than a manufacturer or another dealer. The published application fee is $250. ' +
      'Fees change — confirm with the city before relying on this.',
  },
  thomasville: {
    permitNote:
      'Thomasville licenses buyers of precious metals, gems and numismatic coins, including ' +
      'buyers of secondhand jewellery.',
    holdPeriodDays: 14,
  },
}

/** Flags that gate half-built areas so an unfinished portal cannot appear in production. */
const FEATURE_FLAGS = [
  { key: 'portal.buyer', enabled: false, description: 'Gold buyer portal (/buyer)' },
  { key: 'portal.publisher', enabled: false, description: 'Publisher portal (/publisher)' },
  { key: 'portal.consumer', enabled: false, description: 'Consumer account area (/account)' },
  { key: 'marketplace.bidding', enabled: false, description: 'Lot listing and buyer bidding' },
  { key: 'tracking.calls', enabled: false, description: 'Twilio call tracking and DNI' },
  { key: 'leads.routing', enabled: false, description: 'Routing enquiries to buyer programmes' },
]

async function main() {
  console.log('Seeding Georgia Gold Guide…\n')

  let created = 0
  let updated = 0

  for (const city of GEORGIA_CITIES) {
    const facts = MUNICIPAL_FACTS[city.slug] ?? {}

    const existing = await prisma.city.findUnique({
      where: { slug: city.slug },
      select: { id: true },
    })

    await prisma.city.upsert({
      where: { slug: city.slug },
      // Reference columns only. `published`, `buyerCount`, `introHtml` and the meta fields are
      // owned by the admin panel once a city is live, and are never overwritten from here.
      update: {
        name: city.name,
        county: city.county,
        ...(facts.permitNote ? { permitNote: facts.permitNote } : {}),
        ...(facts.holdPeriodDays ? { holdPeriodDays: facts.holdPeriodDays } : {}),
      },
      create: {
        slug: city.slug,
        name: city.name,
        county: city.county,
        permitNote: facts.permitNote ?? null,
        holdPeriodDays: facts.holdPeriodDays ?? null,
        // Never published by seed. A city page needs a verified buyer first.
        published: false,
      },
    })

    if (existing) updated++
    else created++
  }

  console.log(`Cities: ${created} created, ${updated} updated (${GEORGIA_CITIES.length} total)`)
  console.log(`  ${Object.keys(MUNICIPAL_FACTS).length} carry sourced municipal detail`)
  console.log('  0 published — each needs a licence-verified buyer first\n')

  for (const flag of FEATURE_FLAGS) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      // Enabled state is operational, not seed data — never reset a flag someone turned on.
      update: { description: flag.description },
      create: flag,
    })
  }
  console.log(`Feature flags: ${FEATURE_FLAGS.length} ensured (all default off)\n`)

  const buyers = await prisma.goldBuyer.count()
  console.log(`Gold buyers in database: ${buyers}`)
  if (buyers === 0) {
    console.log('  The directory will show its empty state until real, verified buyers exist.')
    console.log('  This is correct. Do not seed placeholder businesses.\n')
  }

  console.log('Done.')
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
