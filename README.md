# Georgia Gold Network

A CJ-style affiliate network scoped to gold buying in the state of Georgia, USA, plus a
reverse-auction marketplace where consumers list gold and licence-verified buyers bid on it.

Three parties, as in a real affiliate network:

| Party | Role | Money |
|---|---|---|
| **Gold buyer** | Licensed business that buys gold. The "advertiser". | Pays the publisher commission **and** a network fee on top |
| **Publisher** | Traffic source. Our own city pages are publisher #1 (`isHouse`). | Receives the commission |
| **Consumer** | Person selling gold. | Pays nothing |

Revenue is the network fee — the house's cut of every publisher commission, defaulting to
3000 bps (30%) — plus flat monthly listing subscriptions. While the house publisher is the only
publisher, both lines land with us.

---

## Status — foundations + public marketing site complete

Built and verified:

- Next.js 16 + React 19 + TypeScript + Tailwind v4, matching the house stack
- Full Prisma 7 schema (28 models) targeting Neon Postgres
- **Money + gold valuation core, with 60 passing unit tests**
- Contrast-verified design tokens — 30 pairings measured against WCAG, 0 failing
- Auth primitives: scrypt passwords, `jose` sessions, salted hashing, ULID click ids
- **30 routes**: homepage, gold calculator, live gold price, seller flow with TCPA consent
  capture, buyer directory, guides, business pages, and legal pages
- SEO/AEO layer: 90 schema nodes, sitemap, robots, `/llms.txt`

Verified on every build: 29 internal links crawled with **0 broken**, every sitemap URL resolves
200, all JSON-LD parses, and every marked-up FAQ answer appears in visible page copy.

**Not built yet:** the three portals (`/admin`, `/buyer`, `/publisher`), the tracking engine
(`/c/[shortCode]`, `/api/postback`, call tracking), the bidding marketplace, and payout runs.

### ⚠ Launch blockers

1. **Legal pages are unreviewed drafts.** `/privacy`, `/terms`, `/cookies`,
   `/privacy/do-not-sell` and the consent wording in `src/content/consent.ts` are substantive
   drafts written to describe what the system actually does — so counsel reviews reality rather
   than boilerplate — but **no lawyer has seen them**. Georgia counsel must review before launch.
2. **No database.** `DATABASE_URL` is unset, so the buyer directory is empty, every city page
   404s (correctly — see the publish gate below), and the seller form declines submissions
   rather than pretending to store them.
3. **No gold price feed.** Without `GOLD_API_KEY` the site shows no price and the calculator
   asks the visitor to enter today's spot price manually.

---

## Getting started

```bash
pnpm install
cp .env.example .env      # then fill in SESSION_SECRET and HASH_SALT at minimum
pnpm db:push              # requires DIRECT_URL
pnpm dev
```

Generate the two required secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm test` | Unit tests (money + gold + ulid) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm check:contrast` | **Measures every design token pairing against WCAG. Fails on any miss.** |
| `pnpm db:push` | Push schema to Neon |
| `pnpm db:studio` | Prisma Studio |

---

## Rules that are not style preferences

These encode failures that cost real money. Do not relax them without reading why.

**Money is `Int` cents. Rates are `Int` basis points. Weight is `Int` milligrams.**
No floats anywhere on the money path. `src/lib/money.ts` throws on a non-integer rather than
rounding it away, because a float commission is a bug that stays invisible until a publisher
disputes a payout.

**Rounding is not distributive.** Valuing 5 g and doubling it gives 72340; valuing 10 g gives
72339. `lotMeltValueCents` sums per item and must keep doing so — there is a test pinning this.

**Commission is computed once, at conversion time, and stored.** Rate changes never rewrite
history.

**`Conversion.payoutId` is the ledger lock.** An approved conversion attaches to exactly one
payout, so nothing pays twice and nothing is silently dropped.

**`GoldBuyer.balanceCents` is the solvency lock.** We pay publishers, so commission may never
accrue against a buyer who has not funded their balance. At the floor, the program pauses.

**24K is .999 fine, not 1.0.** Treating it as a mathematical 24/24 overstates every 24K
valuation by 0.1%.

**A hallmark is not an assay.** Every figure the site displays is an estimate subject to
physical verification. Presenting an estimate as a binding offer is a consumer-protection
problem.

**Never publish a payout-rate promise.** Rates are buyer-set and move with spot price. The
calculator's payout range is an *adjustable input the visitor controls*, not our claim.

**The city publish gate.** `/gold-buyers/[city]` 404s unless the city is in the coverage list AND
`City.published` is true AND it has at least one verified, active buyer. All three. ~50
near-identical "gold buyers in {city}" pages with no real local data is the textbook doorway-page
pattern and can suppress the whole domain. Do not add a `loading.tsx` to that route or to
`/blog/[slug]` — a Suspense boundary makes Next commit HTTP 200 before `notFound()` runs, turning
every miss into a soft 404.

**No invented data, anywhere.** No fake stat bands, no placeholder buyer listings, no support
email that bounces, no gold price when the feed is down. Empty states say they are empty.

**Personal data is hashed, never stored raw** — IPs with a daily-rotating salt, phone numbers
and emails with a stable one so they can still dedupe.

---

## Compliance notes (verified 2026-08-01)

**Georgia has no comprehensive consumer privacy law.** SB 111 was introduced as the "Georgia
Consumer Privacy Protection Act", but the House replaced its entire text with rural hospital tax
credit amendments before it was signed on 11 May 2026. Bill trackers still display the original
privacy title, so a casual check reports the opposite of the truth. We build to the stricter
standard regardless — consumers from other states use the site, and Florida, Tennessee and
Alabama all have omnibus statutes.

**The FCC one-to-one consent rule was vacated** by the Eleventh Circuit on 24 January 2025
(*Insurance Marketing Coalition v. FCC*), three days before it took effect. Consent covering
"affiliates and marketing partners" is lawful again federally — **but carriers did not follow**:
T-Mobile still bans shared-consent traffic for SMS. We capture per-partner consent and store the
full record (exact disclosure text, IP, user agent, timestamp) regardless, because that record
is what wins a TCPA claim and it keeps SMS deliverable.

**Georgia precious-metals permits are municipal, not statewide.** O.C.G.A. Title 43 Ch. 37
governs dealers in precious metals and gems, but permits issue per city or county — McDonough
charges $250; Thomasville imposes a 14-day hold before a purchased item may be sold, melted or
altered. `GoldBuyer.licenseVerified` is a hard gate on bidding and on directory listing.

None of this is legal advice. Georgia counsel must review the Buyer Agreement, Publisher
Agreement, consumer Terms, bid disclaimer and privacy policy before launch.

---

## Layout

```
prisma/schema.prisma          28 models — read the header comment before editing
scripts/check-contrast.mjs    WCAG gate over the design tokens
src/app/globals.css           Tailwind v4 @theme — the token source of truth
src/app/(marketing)/          Public site
src/lib/money.ts              Cents + basis-point arithmetic. Integer-only.
src/lib/gold.ts               Troy weights, karat purity, melt valuation.
src/lib/hash.ts               Personal-data hashing + postback HMAC
src/lib/ulid.ts               Click ids — time-sortable, monotonic within a millisecond
src/lib/session.ts            jose JWT. Edge-safe: no Prisma import, by design.
src/proxy.ts                  Portal routing gate (Next 16 renamed `middleware` to `proxy`)
src/content/site.ts           SINGLE POINT OF REBRAND
```

The brand name is a placeholder. Changing `site.name`, `site.legalName` and the mark in
`src/components/layout/Logo.tsx` rebrands the whole site; no component hardcodes a brand string.
