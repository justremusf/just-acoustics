// ─── Navigation Configuration ─────────────────────────────────────────────────
// Static data for header navigation menus.
// Keep all label maps and link arrays here — import into HeaderClient.tsx.

export type MenuKey = 'shop' | 'solutions' | 'applications' | 'projects' | 'about'

export const LOGO_SRC =
  '/assets/webflow/69635d202eb00a587d5f2386_Just%20Acoustics%201600x900%20(1).svg'

export const SHOP_CATEGORY_LABELS: Record<string, string> = {
  'package-deals': 'Package Deals',
  'standard-panels': 'Standard Panels',
  'custom-panels': 'Custom Panels',
  'ceiling-panels': 'Ceiling Panels',
  accessories: 'Accessories',
}

export const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  'wall-panels': 'Wall Panels',
  'ceiling-panels': 'Ceiling Panels',
  'custom-solutions': 'Custom Solutions',
  soundproofing: 'Soundproofing',
}

export const PROJECT_CATEGORY_LABELS: Record<string, string> = {
  restaurants: 'Restaurants',
  'office-spaces': 'Office Spaces',
  schools: 'Schools',
  'studios-homes': 'Studios & Homes',
  churches: 'Churches',
  'gym-leisure': 'Gym & Leisure',
  cinema: 'Cinema',
}

export const desktopNav = [
  { key: 'applications' as const, label: 'Applications', href: '/services' },
  { key: 'solutions' as const, label: 'Solutions', href: '/products' },
  { key: 'projects' as const, label: 'Projects', href: '/projects' },
  { key: 'shop' as const, label: 'Shop', href: '/shop' },
  { key: 'about' as const, label: 'About', href: '/about' },
]

export const aboutLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Acoustic Education', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]
