import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/components/cart/CartProvider'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { SitePageReveal } from '@/components/SitePageReveal'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen overflow-x-clip pt-2 md:pt-0">
        <Header />
        <main>
          <SitePageReveal>{children}</SitePageReveal>
        </main>
        <Footer />
      </div>
      <WhatsAppButton />
    </CartProvider>
  )
}
