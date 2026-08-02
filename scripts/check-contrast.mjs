#!/usr/bin/env node
/**
 * Design-token contrast gate.
 *
 * Parses the `@theme` block in src/app/globals.css, converts every oklch() token to sRGB, and
 * measures WCAG contrast for a declared list of pairings. Exits non-zero if any pair fails.
 *
 * Why this exists: on a previous build the brand colour itself measured 3.99:1 — below the
 * 4.5:1 floor — which meant every conversion-critical button shipped illegible. Eyeballing
 * colour does not work; gold is especially deceptive because it looks vivid while carrying
 * very high luminance, so gold-on-white text fails long before it looks wrong.
 *
 * Run: pnpm check:contrast
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const cssPath = resolve(here, '../src/app/globals.css')

/* ---------------------------------------------------------------- colour math */

/** oklch -> linear sRGB (Björn Ottosson's OKLab matrices). */
function oklchToLinearSrgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

const encode = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055)
const decode = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
const clamp01 = (x) => Math.min(1, Math.max(0, x))

/**
 * Gamut-clamp in ENCODED space, then re-linearise. Clamping the linear values directly would
 * misreport luminance for out-of-gamut colours — the browser renders the clamped colour, so
 * that is the colour we must measure.
 */
function oklchToRgb(L, C, h) {
  const [lr, lg, lb] = oklchToLinearSrgb(L, C, h)
  return [clamp01(encode(lr)), clamp01(encode(lg)), clamp01(encode(lb))]
}

function relativeLuminance([r, g, b]) {
  return 0.2126 * decode(r) + 0.7152 * decode(g) + 0.0722 * decode(b)
}

function contrast(rgbA, rgbB) {
  const a = relativeLuminance(rgbA)
  const b = relativeLuminance(rgbB)
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

const toHex = ([r, g, b]) =>
  '#' +
  [r, g, b]
    .map((c) => Math.round(c * 255).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()

/* ---------------------------------------------------------------- token parsing */

const css = readFileSync(cssPath, 'utf8')
const tokens = new Map()

// --color-name: oklch(L C H);   (H optional -> 0)
const re = /--color-([a-z0-9-]+):\s*oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.-]+)?\s*\)/gi
let m
while ((m = re.exec(css)) !== null) {
  const [, name, L, C, H] = m
  tokens.set(name, oklchToRgb(parseFloat(L), parseFloat(C), parseFloat(H ?? '0')))
}

if (tokens.size === 0) {
  console.error('No oklch --color-* tokens found in globals.css. Did the @theme block move?')
  process.exit(1)
}

/* ---------------------------------------------------------------- the contract */

// [foreground, background, minimum ratio, what it is]
// 4.5 = WCAG AA normal text · 3.0 = AA large/bold text and non-text UI boundaries
const PAIRS = [
  // Text on light surfaces
  ['ink', 'surface', 4.5, 'body text'],
  ['ink', 'surface-muted', 4.5, 'body text on muted band'],
  ['ink', 'surface-sunken', 4.5, 'body text on sunken band'],
  ['ink-muted', 'surface', 4.5, 'secondary text'],
  ['ink-muted', 'surface-muted', 4.5, 'secondary text on band'],
  ['ink-subtle', 'surface', 4.5, 'meta text (legally material: consent lines)'],

  // Primary CTA — the money buttons
  ['ink-inverse', 'vault-500', 4.5, 'WHITE LABEL ON PRIMARY BUTTON'],
  ['ink-inverse', 'vault-600', 4.5, 'primary button hover'],
  ['ink-inverse', 'vault-700', 4.5, 'primary button active'],
  ['vault-700', 'surface', 4.5, 'primary-coloured text/link'],
  ['vault-700', 'vault-50', 4.5, 'primary text on primary tint'],

  // Gold — the brand accent. Gold is a FILL, not normally a text colour.
  ['ink', 'gold-500', 4.5, 'DARK LABEL ON GOLD BUTTON'],
  ['ink', 'gold-400', 4.5, 'dark label on gold hover'],
  ['gold-800', 'surface', 4.5, 'gold-toned text on white'],
  ['gold-800', 'gold-50', 4.5, 'gold text on gold tint'],

  // Status colours — used for conversion/payout state, which is what people log in to check
  ['ink-inverse', 'success-600', 4.5, 'approved badge'],
  ['ink-inverse', 'warning-700', 4.5, 'pending/disputed badge'],
  ['ink-inverse', 'danger-600', 4.5, 'reversed/failed badge'],
  ['success-700', 'success-50', 4.5, 'approved badge (soft variant)'],
  ['warning-800', 'warning-50', 4.5, 'pending badge (soft variant)'],
  ['danger-700', 'danger-50', 4.5, 'danger badge (soft variant)'],

  // Dark CTA band (CtaBand.tsx) — light text and a gold button on a deep vault background
  ['ink-inverse', 'vault-900', 4.5, 'CTA band heading'],
  ['vault-100', 'vault-900', 4.5, 'CTA band body text'],
  ['ink', 'gold-500', 4.5, 'gold CTA button on the band'],

  // Non-text UI boundaries
  ['line-strong', 'surface', 3.0, 'input border / focus ring'],

  // Dark mode
  ['ink-dark', 'surface-dark', 4.5, 'dark-mode body text'],
  ['ink-muted-dark', 'surface-dark', 4.5, 'dark-mode secondary text'],
  ['gold-400', 'surface-dark', 4.5, 'gold text in dark mode'],
  ['ink-inverse', 'vault-500', 4.5, 'dark-mode primary button'],
  ['line-strong-dark', 'surface-dark', 3.0, 'dark-mode border'],
]

/* ---------------------------------------------------------------- report */

let failures = 0
let missing = 0
const rows = []

for (const [fg, bg, min, label] of PAIRS) {
  const a = tokens.get(fg)
  const b = tokens.get(bg)
  if (!a || !b) {
    rows.push({ pair: `${fg} on ${bg}`, ratio: '—', min, label, verdict: 'MISSING TOKEN' })
    missing++
    continue
  }
  const ratio = contrast(a, b)
  const pass = ratio >= min
  if (!pass) failures++
  rows.push({
    pair: `${fg} on ${bg}`,
    ratio: ratio.toFixed(2),
    min: min.toFixed(1),
    label,
    verdict: pass ? 'pass' : 'FAIL',
    hex: `${toHex(a)} / ${toHex(b)}`,
  })
}

const w = Math.max(...rows.map((r) => r.pair.length))
console.log('\n  WCAG contrast — measured from oklch, not eyeballed\n')
for (const r of rows) {
  const mark = r.verdict === 'pass' ? '  ok  ' : r.verdict === 'FAIL' ? ' FAIL ' : ' MISS '
  console.log(
    `${mark} ${r.pair.padEnd(w)}  ${String(r.ratio).padStart(6)} : 1   (min ${r.min})  ${r.hex ?? ''}  — ${r.label}`
  )
}

console.log(`\n  ${rows.length} pairs · ${failures} failing · ${missing} missing\n`)

if (failures > 0 || missing > 0) {
  console.error('  Contrast gate FAILED. Fix the tokens — do not ship illegible controls.\n')
  process.exit(1)
}
console.log('  All pairs clear their WCAG floor.\n')
