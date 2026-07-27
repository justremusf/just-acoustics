import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/components/cart/CartProvider'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen overflow-x-clip pt-2 md:pt-0">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
      <WhatsAppButton />
    </CartProvider>
  )
}
