'use client'

import { useEffect } from 'react'
import { triggerHaptic } from '@/lib/haptics'

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

      // Determine intensity based on element type and semantics
      let intensity: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'soft' | 'rigid' | 'nudge' = 'light'
      
      // 1. Accordions, FAQs, and Disclosures -> Two-stage 'success' haptic (matches opening animation)
      const isAccordion = tagName === 'summary' || 
                          className.includes('accordion') || 
                          className.includes('faq') || 
                          className.includes('disclosure') ||
                          ariaExpanded !== null

      // 2. Navigation / Menu Toggles -> 'rigid' for a solid, mechanical feel
      const isMenuToggle = className.includes('menu') || 
                           className.includes('hamburger') || 
                           className.includes('nav-toggle') || 
                           id.includes('menu') ||
                           role === 'menuitem'

      // 3. Inputs (Checkboxes, Switches, Tabs) -> 'nudge' or 'soft'
      const isToggleInput = type === 'checkbox' || type === 'radio' || role === 'switch' || role === 'tab'

      // 4. Standard Links (non-buttons) -> 'soft'
      const isTextLink = tagName === 'a' && !className.includes('btn') && !className.includes('button')

      // 5. Primary Buttons -> 'medium'
      const isPrimaryBtn = className.includes('primary') || 
                           className.includes('cta') ||
                           className.includes('orange')

      if (clickableElement.hasAttribute('data-haptic-heavy')) {
        intensity = 'heavy'
      } else if (clickableElement.hasAttribute('data-haptic-medium')) {
        intensity = 'medium'
      } else if (isAccordion) {
        // Apple Pay style two-stage response for expanding content
        intensity = 'success' 
      } else if (isMenuToggle) {
        // Solid thud for opening/closing heavy UI panels like drawers
        intensity = 'rigid'
      } else if (isToggleInput) {
        intensity = 'nudge'
      } else if (isPrimaryBtn) {
        intensity = 'medium'
      } else if (isTextLink) {
        // Very subtle click for text links so it's not overwhelming
        intensity = 'soft'
      } else {
        // Standard button click
        intensity = 'light'
      }

      triggerHaptic(intensity)
    }

    // Use capturing phase or bubbling phase? Bubbling phase is standard for interaction events
    document.addEventListener('click', handleClick, { passive: true })

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return <>{children}</>
}
