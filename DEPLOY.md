# Deploying Georgia Gold Guide

Repo: `https://github.com/gagoldguide/GG` · branch `main`

The build is verified and deploys cleanly with **no environment variables at all** — every
integration degrades to an honest "not connected" state rather than erroring. So you can get a
live URL first and wire services up afterwards.

---

## Fastest route — connect the repo in the Vercel dashboard (recommended)

No token, no CLI, and every future `git push` redeploys automatically.

1. Go to <https://vercel.com/new>
2. **Import Git Repository** → `gagoldguide/GG`
3. Framework preset: **Next.js** (auto-detected). Leave build and output settings alone.
4. Add the environment variables below (you can add just the first three now).
5. **Deploy.**

You get `https://<project>.vercel.app` in about two minutes.

---

## Alternative — deploy from this machine

Needs a **fresh** Vercel token. The one currently in `VERCEL_TOKEN` is rejected with
`Error: User not found`, i.e. it has been revoked — which is correct, it was the leaked token from
the Gulu Mulu handover.

Create one at <https://vercel.com/account/tokens>, then:

```bash
vercel link --token <NEW_TOKEN>
vercel --prod --token <NEW_TOKEN>
```

Or run `vercel login` once in an interactive terminal and drop the `--token` flag.

**Do not paste a token into a chat window.** Set it as an environment variable.

---

## Environment variables

### Set these before the first deploy

| Variable | Value | Why |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | your live URL, e.g. `https://gagoldguide.com` | **Do not skip.** If unset, `sitemap.xml` advertises `localhost:3000` URLs to Google. This exact bug shipped on a previous project. |
| `SESSION_SECRET` | 32+ random chars | Signs the session JWT. A weak or missing key means anyone can mint a cookie claiming ADMIN. |
| `HASH_SALT` | 32+ random chars | Salts every hash of personal data. An unsalted hash of a 10-digit phone number is brute-forceable in seconds. Changing it later orphans existing dedupe keys — set it once. |

Generate both secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Add when the service exists

| Variable | Unlocks | Until then |
|---|---|---|
| `DATABASE_URL` (Neon **pooled**, host contains `-pooler`) | Directory, city pages, seller enquiries, blog | Directory shows an honest empty state; city pages 404; `/sell` declines submissions rather than pretending to store them |
| `DIRECT_URL` (Neon **unpooled**) | `prisma db push` / migrations | CLI cannot run DDL through a transaction pooler |
| `GOLD_API_KEY` + `GOLD_API_PROVIDER` | Live spot price | Site shows no price; calculator asks the visitor to enter today's spot price manually |
| `TWILIO_*` | Call tracking | Phase 2 |
| `RESEND_API_KEY`, `EMAIL_FROM` | Transactional email | Phase 2 |

---

## After the first deploy

```bash
# The soft-404 check — must be 404, not 200
curl -o /dev/null -s -w "%{http_code}\n" https://<your-url>/does-not-exist

# Must return 0 — if it returns anything, NEXT_PUBLIC_SITE_URL is unset
curl -s https://<your-url>/sitemap.xml | grep -c localhost
```

Then submit `https://<your-url>/sitemap.xml` in Google Search Console.

---

## ⚠ Before pointing a real domain at this

**The legal pages are unreviewed drafts.** `/privacy`, `/terms`, `/cookies`,
`/privacy/do-not-sell` and the consent wording in `src/content/consent.ts` describe what the
system genuinely does — deliberately, so counsel reviews reality rather than boilerplate — but no
lawyer has read them. Georgia counsel must review before you promote the site or run traffic to
it.

A `*.vercel.app` preview URL for review purposes is a different matter, and is fine now.

**Also confirm before launch:** the registered entity name in `src/content/site.ts`
(`site.legalName`), which appears in the footer copyright line and in Organization schema.
