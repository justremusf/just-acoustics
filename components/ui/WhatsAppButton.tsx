'use client'

import { usePathname } from 'next/navigation'
import WhatsAppLink from '@/components/analytics/WhatsAppLink'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'

export default function WhatsAppButton() {
  const pathname = usePathname()
  // Checkout has inline help so the floating button cannot cover form fields.
  if (pathname?.startsWith("/checkout") || pathname?.startsWith("/orders/")) return null
  return (
    <WhatsAppLink
      source="floating_button"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="wa-float fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105 sm:bottom-6 sm:right-6 sm:h-[72px] sm:w-[72px]"
      style={{ backgroundColor: '#25D366' }}
    >
      <WhatsAppIcon />
    </WhatsAppLink>
  )
}
