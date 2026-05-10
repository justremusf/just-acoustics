'use client'

import { useEffect } from 'react'
import { triggerHaptic, type HapticIntensity } from '@/lib/haptics'

export default function HapticProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // BROADENED DETECTION: Everything clickable
      const clickableElement = target.closest('button, a, summary, label, input[type="submit"], input[type="checkbox"], input[type="radio"], [role="button"], [role="switch"], [role="tab"], [role="menuitem"]')
      
      if (!clickableElement) return

      // Ensure it's not a disabled element
      if ((clickableElement as HTMLButtonElement).disabled) return
      if (clickableElement.getAttribute('aria-disabled') === 'true') return
      if (clickableElement.hasAttribute('data-no-haptic')) return

      const tagName = clickableElement.tagName.toLowerCase()
      const className = (clickableElement.getAttribute('class') || '').toLowerCase()
      const id = (clickableElement.getAttribute('id') || '').toLowerCase()
      const role = clickableElement.getAttribute('role') || ''
      const type = clickableElement.getAttribute('type') || ''
      const ariaExpanded = clickableElement.getAttribute('aria-expanded')
      const text = (clickableElement.textContent || '').toLowerCase()

      // Determine intensity based on element type and semantics
      let intensity: HapticIntensity = 'tick'
      
      // 1. Explicit data attribute (highest priority)
      const dataHaptic = clickableElement.getAttribute('data-haptic') as HapticIntensity
      if (dataHaptic) {
        intensity = dataHaptic
        triggerHaptic(intensity)
        return
      }

      // 2. Add to Cart / Purchase Buttons -> 'cart' (Heavy Thump)
      const isCart = className.includes('cart') || 
                     className.includes('add-to-cart') || 
                     text.includes('add to cart') ||
                     text.includes('buy now') ||
                     text.includes('purchase')

      // 3. Accordions, FAQs, and Disclosures -> 'success' (Two-stage Apple Pay style)
      const isAccordion = tagName === 'summary' || 
                          className.includes('accordion') || 
                          className.includes('faq') || 
                          className.includes('disclosure') ||
                          ariaExpanded !== null

      // 4. Navigation / Menu Toggles -> 'menu' (Rigid mechanical click)
      const isMenuToggle = className.includes('menu') || 
                           className.includes('hamburger') || 
                           className.includes('nav-toggle') || 
                           className.includes('drawer') ||
                           id.includes('menu') ||
                           role === 'menuitem'

      // 5. Inputs (Checkboxes, Switches, Tabs) -> 'tick' (Soft mechanical tick)
      const isToggleInput = type === 'checkbox' || type === 'radio' || role === 'switch' || role === 'tab'

      // 6. Primary Buttons (CTA) -> 'medium' (Solid feedback)
      const isPrimaryBtn = className.includes('primary') || 
                           className.includes('cta') ||
                           className.includes('orange') ||
                           className.includes('btn-large')

      if (isCart) {
        intensity = 'cart'
      } else if (isAccordion) {
        intensity = 'success' 
      } else if (isMenuToggle) {
        intensity = 'menu'
      } else if (isToggleInput) {
        intensity = 'tick'
      } else if (isPrimaryBtn) {
        intensity = 'heavy'
      } else if (tagName === 'a' || tagName === 'button' || role === 'button') {
        // Standard buttons and links get a high-end "tick"
        intensity = 'tick'
      } else {
        intensity = 'light'
      }

      triggerHaptic(intensity)
    }

    document.addEventListener('click', handleClick, { capture: true, passive: true })

    return () => {
      document.removeEventListener('click', handleClick, { capture: true })
    }
  }, [])

  return <>{children}</>
}

