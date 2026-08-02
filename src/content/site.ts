/**
 * Brand + site configuration.
 *
 * SINGLE POINT OF REBRAND. The client's trading name is not settled yet, so every user-facing
 * mention of the brand resolves through here. Changing `name`, `legalName` and `domain` below
 * (plus the logo mark in src/components/layout/Logo.tsx) rebrands the entire site — there are
 * no hardcoded brand strings in components, and there must never be.
 */

export const site = {
  name: 'Georgia Gold Guide',
  shortName: 'GG',
  // TODO(client): confirm the registered entity name. This string appears in the footer
  // copyright line and in Organization schema, both of which should match the real filing.
  legalName: 'Georgia Gold Guide',
  tagline: 'Sell your gold to verified Georgia buyers.',
  description:
    'Compare offers from licence-verified gold buyers across Georgia. See live spot-price ' +
    'valuations before you sell, and let buyers compete for your gold.',

  // Set NEXT_PUBLIC_SITE_URL on Vercel. If it is unset, sitemap.xml advertises localhost URLs
  // to Google — a real bug that shipped on a previous project.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  state: 'Georgia',
  stateAbbr: 'GA',
  country: 'US',
  locale: 'en_US',
  currency: 'USD',

  contact: {
    email: '',
    phone: '',
  },
} as const

/**
 * Public navigation. Mirrors the information architecture of an established affiliate network
 * (platform / solutions / partnerships / resources), scoped to this vertical.
 */
export const nav = [
  {
    label: 'Sell Your Gold',
    href: '/sell',
    children: [
      { label: 'What is my gold worth?', href: '/gold-calculator' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Get competing offers', href: '/sell' },
      { label: 'Mail-in vs in-person', href: '/mail-in-vs-in-person' },
    ],
  },
  {
    label: 'Find a Buyer',
    href: '/gold-buyers',
    children: [
      { label: 'Browse all Georgia cities', href: '/gold-buyers' },
      { label: 'Atlanta', href: '/gold-buyers/atlanta' },
      { label: 'How we verify licences', href: '/verification' },
    ],
  },
  {
    label: 'For Buyers',
    href: '/for-buyers',
    children: [
      { label: 'List your business', href: '/for-buyers' },
      { label: 'Pricing & fees', href: '/for-buyers/pricing' },
      { label: 'Integration & tracking', href: '/for-buyers/integration' },
    ],
  },
  {
    label: 'For Partners',
    href: '/for-partners',
    children: [
      { label: 'Publisher programme', href: '/for-partners' },
      { label: 'Commission structure', href: '/for-partners/commissions' },
      { label: 'Payout terms', href: '/for-partners/payouts' },
    ],
  },
  {
    label: 'Resources',
    href: '/learn',
    children: [
      { label: 'Gold price today', href: '/gold-price' },
      { label: 'Karat & purity guide', href: '/learn/karat-guide' },
      { label: 'Georgia dealer rules', href: '/learn/georgia-rules' },
      { label: 'Blog', href: '/blog' },
    ],
  },
] as const

export const footerGroups = [
  {
    title: 'Sell',
    links: [
      { label: 'Gold calculator', href: '/gold-calculator' },
      { label: 'Get offers', href: '/sell' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Gold price today', href: '/gold-price' },
    ],
  },
  {
    title: 'Find a buyer',
    links: [
      { label: 'All Georgia cities', href: '/gold-buyers' },
      { label: 'Licence verification', href: '/verification' },
      { label: 'Georgia dealer rules', href: '/learn/georgia-rules' },
    ],
  },
  {
    title: 'Business',
    links: [
      { label: 'List your business', href: '/for-buyers' },
      { label: 'Publisher programme', href: '/for-partners' },
      { label: 'Pricing & fees', href: '/for-buyers/pricing' },
      { label: 'Sign in', href: '/login' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of use', href: '/terms' },
      { label: 'Cookie notice', href: '/cookies' },
      { label: 'Do not sell my info', href: '/privacy/do-not-sell' },
    ],
  },
] as const
