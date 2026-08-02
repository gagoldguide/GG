import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import { OrganizationJsonLd } from '@/components/seo/JsonLd'

/**
 * Public marketing shell. The portals — /admin, /buyer, /publisher, /account — deliberately do
 * NOT share this layout: a logged-in buyer reviewing conversions should not be looking at a
 * consumer-facing "What's my gold worth?" call to action.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Site-wide identity graph. Page-level schema (FAQ, Breadcrumb, …) is emitted per page. */}
      <OrganizationJsonLd />
      <Nav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
