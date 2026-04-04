'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ShimmerButton from '@/components/ui/shimmer-button'

type MenuKey = 'shop' | 'solutions' | 'applications' | 'projects' | 'about'

type SluggedItem = {
  title: string
  slug: string
  category?: string
}

type ServiceMenuItem = {
  title: string
  slug: string
  shortDescription?: string
}

type MenuLink = {
  label: string
  href: string
  meta?: string
}

type MenuSection = {
  title?: string
  links: MenuLink[]
}

type MenuDefinition = {
  key: MenuKey
  label: string
  href: string
  sections: MenuSection[]
  panel: {
    eyebrow: string
    title: string
    body: string
    ctaLabel: string
    ctaHref: string
    pills?: string[]
  }
}

interface HeaderClientProps {
  shopItems: SluggedItem[]
  products: SluggedItem[]
  services: ServiceMenuItem[]
  projectCategories: string[]
}

const LOGO_SRC =
  'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69635d202eb00a587d5f2386_Just%20Acoustics%201600x900%20(1).svg'

const SHOP_CATEGORY_LABELS: Record<string, string> = {
  'package-deals': 'Package Deals',
  'standard-panels': 'Standard Panels',
  'custom-panels': 'Custom Panels',
  'ceiling-panels': 'Ceiling Panels',
  accessories: 'Accessories',
}

const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  'wall-panels': 'Wall Panels',
  'ceiling-panels': 'Ceiling Panels',
  'custom-solutions': 'Custom Solutions',
  soundproofing: 'Soundproofing',
}

const PROJECT_CATEGORY_LABELS: Record<string, string> = {
  restaurants: 'Restaurants',
  'office-spaces': 'Office Spaces',
  schools: 'Schools',
  'studios-homes': 'Studios & Homes',
  churches: 'Churches',
  'gym-leisure': 'Gym & Leisure',
  cinema: 'Cinema',
}

const desktopNav = [
  { key: 'applications' as const, label: 'Applications', href: '/services' },
  { key: 'solutions' as const, label: 'Solutions', href: '/products' },
  { key: 'projects' as const, label: 'Projects', href: '/projects' },
  { key: 'shop' as const, label: 'Shop', href: '/shop' },
  { key: 'about' as const, label: 'About', href: '/about' },
]

const mobileLinks = [
  { label: 'Home', href: '/' },
  { label: 'Applications', href: '/services' },
  { label: 'Solutions', href: '/products' },
  { label: 'Projects', href: '/projects' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Acoustic Education', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const aboutLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Acoustic Education', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

function titleize(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function chunkArray<T>(items: T[], size: number) {
  if (items.length === 0) return []
  const chunks: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }
  return chunks
}

function sortCategoryKeys(a: string, b: string, labels: Record<string, string>) {
  const labelOrder = Object.keys(labels)
  const aIndex = labelOrder.indexOf(a)
  const bIndex = labelOrder.indexOf(b)

  if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
  if (aIndex === -1) return 1
  if (bIndex === -1) return -1
  return aIndex - bIndex
}

function buildCategorizedSections(
  items: SluggedItem[],
  labels: Record<string, string>,
  itemBasePath: string,
  filterBasePath: string
) {
  const grouped = new Map<string, MenuLink[]>()

  items.forEach((item) => {
    const categoryKey = item.category ?? 'other'
    const existing = grouped.get(categoryKey) ?? []

    existing.push({
      label: item.title,
      href: `${itemBasePath}/${item.slug}`,
    })

    grouped.set(categoryKey, existing)
  })

  if (grouped.size === 0) {
    return [
      {
        title: 'Browse Categories',
        links: Object.entries(labels).map(([value, label]) => ({
          label,
          href: `${filterBasePath}?category=${encodeURIComponent(value)}`,
        })),
      },
    ]
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => sortCategoryKeys(a, b, labels))
    .map(([category, links]) => ({
      title: labels[category] || titleize(category),
      links,
    }))
}

function buildApplicationSections(services: ServiceMenuItem[]) {
  const links = services.map((service) => ({
    label: service.title,
    href: `/services/${service.slug}`,
    meta: service.shortDescription ? 'Application' : undefined,
  }))

  if (links.length === 0) {
    return [
      {
        title: 'Popular Spaces',
        links: [
          { label: 'Offices & Meeting Rooms', href: '/services/offices-meeting-rooms' },
          { label: 'Restaurants, Cafes, Bars', href: '/services/restaurants-cafes-bars' },
          { label: 'Churches & Event Spaces', href: '/services/churches-event-spaces' },
          { label: 'Education Spaces', href: '/services/education-spaces' },
        ],
      },
    ]
  }

  if (links.length <= 6) {
    return [
      {
        title: 'Popular Spaces',
        links,
      },
    ]
  }

  const chunkSize = Math.ceil(links.length / 2)
  const [left, right] = chunkArray(links, chunkSize)

  return [
    { title: 'Popular Spaces', links: left ?? [] },
    { title: 'More Spaces', links: right ?? [] },
  ].filter((section) => section.links.length > 0)
}

function buildProjectSections(projectCategories: string[]) {
  const counts = projectCategories.reduce<Record<string, number>>((accumulator, category) => {
    accumulator[category] = (accumulator[category] ?? 0) + 1
    return accumulator
  }, {})

  const links = Object.entries(PROJECT_CATEGORY_LABELS)
    .filter(([value]) => counts[value])
    .map(([value, label]) => ({
      label,
      href: `/projects?category=${encodeURIComponent(value)}`,
      meta: `${counts[value]} ${counts[value] === 1 ? 'project' : 'projects'}`,
    }))

  const projectLinks =
    links.length > 0
      ? links
      : Object.entries(PROJECT_CATEGORY_LABELS).map(([value, label]) => ({
          label,
          href: `/projects?category=${encodeURIComponent(value)}`,
        }))

  if (projectLinks.length <= 4) {
    return [
      {
        title: 'Browse by Space',
        links: projectLinks,
      },
    ]
  }

  const chunkSize = Math.ceil(projectLinks.length / 2)
  const [left, right] = chunkArray(projectLinks, chunkSize)

  return [
    { title: 'Browse by Space', links: left ?? [] },
    { title: 'More Categories', links: right ?? [] },
  ].filter((section) => section.links.length > 0)
}

function getSectionsGridClass(menuKey: MenuKey, sectionCount: number) {
  if (menuKey === 'about') return 'grid-cols-1'
  if (sectionCount <= 1) return 'grid-cols-1'
  if (sectionCount === 2) return 'grid-cols-1 md:grid-cols-2'
  return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
}

export default function HeaderClient({
  shopItems,
  products,
  services,
  projectCategories,
}: HeaderClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileVisible, setMobileVisible] = useState(false)
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null)
  const [renderedMenu, setRenderedMenu] = useState<MenuKey | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const closeTimerRef = useRef<number | null>(null)

  const openMobile = () => setMobileOpen(true)
  const closeMobile = () => {
    setMobileVisible(false)
    window.setTimeout(() => setMobileOpen(false), 420)
  }

  function clearDesktopCloseTimer() {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  function openDesktopMenu(menu: MenuKey) {
    clearDesktopCloseTimer()
    setRenderedMenu(menu)
    setOpenMenu(menu)
  }

  function scheduleCloseDesktopMenu() {
    clearDesktopCloseTimer()
    setOpenMenu(null)
    closeTimerRef.current = window.setTimeout(() => {
      setRenderedMenu(null)
      closeTimerRef.current = null
    }, 520)
  }

  function closeDesktopMenuImmediate() {
    clearDesktopCloseTimer()
    setOpenMenu(null)
    setRenderedMenu(null)
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      if (window.scrollY > 24) closeDesktopMenuImmediate()
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    requestAnimationFrame(() => setMobileVisible(true))
  }, [mobileOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    return () => {
      clearDesktopCloseTimer()
    }
  }, [])

  useEffect(() => {
    if (!openMenu) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDesktopMenuImmediate()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openMenu])

  const megaMenus = useMemo<Record<MenuKey, MenuDefinition>>(
    () => ({
      shop: {
        key: 'shop',
        label: 'Shop',
        href: '/shop',
        sections: buildCategorizedSections(shopItems, SHOP_CATEGORY_LABELS, '/shop', '/shop'),
        panel: {
          eyebrow: 'Shop Online',
          title: 'Browse Acoustic Panels and Package Deals.',
          body:
            'Explore in-stock and made-to-order panels, plus package deals that make getting started simple.',
          ctaLabel: 'Show All',
          ctaHref: '/shop',
        },
      },
      solutions: {
        key: 'solutions',
        label: 'Solutions',
        href: '/products',
        sections: buildCategorizedSections(products, PRODUCT_CATEGORY_LABELS, '/products', '/products'),
        panel: {
          eyebrow: 'Acoustic Solutions',
          title: 'See All of Our Acoustic Product Lines.',
          body:
            'Wall panels, ceiling systems, custom finishes, and soundproofing options are all accessible directly from the menu.',
          ctaLabel: 'See All',
          ctaHref: '/products',
        },
      },
      applications: {
        key: 'applications',
        label: 'Applications',
        href: '/services',
        sections: buildApplicationSections(services),
        panel: {
          eyebrow: 'Space Applications',
          title: 'Learn More About Your Space Type.',
          body:
            'Go straight to the room type that best matches the space you want to improve.',
          ctaLabel: 'See All',
          ctaHref: '/services',
        },
      },
      projects: {
        key: 'projects',
        label: 'Projects',
        href: '/projects',
        sections: buildProjectSections(projectCategories),
        panel: {
          eyebrow: 'Our Projects',
          title: 'Check Out Our Success Stories.',
          body:
            'See how different spaces were treated successfully, and jump straight into the category most relevant to yours.',
          ctaLabel: 'See All',
          ctaHref: '/projects',
        },
      },
      about: {
        key: 'about',
        label: 'About',
        href: '/about',
        sections: [
          {
            title: 'About Just Acoustics',
            links: aboutLinks,
          },
        ],
        panel: {
          eyebrow: 'Company',
          title: 'Learn how we approach acoustic treatment in Singapore.',
          body:
            'Learn who we are, how we work, and where to go next if you want help with your space.',
          ctaLabel: 'Learn More',
          ctaHref: '/about',
        },
      },
    }),
    [products, projectCategories, services, shopItems]
  )

  const activeMenuData = renderedMenu ? megaMenus[renderedMenu] : null

  return (
    <header className="sticky top-0 z-50 px-5 pt-[24px] sm:px-5 sm:pt-[24px] lg:px-4">
      <style>{`
        .burger-btn line {
          transition-property: transform, opacity;
        }
        .burger-btn:hover line {
          stroke: #1a1a1a;
        }
        .burger-btn {
          transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);
        }
        .burger-btn:hover {
          transform: scale(1.08);
        }
        .burger-btn:active {
          transform: scale(0.94);
        }
        .header-nav-link,
        .header-nav-trigger {
          transition:
            color 480ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 560ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 560ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .header-nav-link:hover,
        .header-nav-trigger:hover {
          color: var(--color-dark-100);
          background-color: rgba(255,255,255,0.74);
          box-shadow: 0 10px 24px rgba(0,0,0,0.04), 0 1px 0 rgba(255,255,255,0.84) inset;
          transform: translateY(-1px);
        }
        .header-nav-trigger.is-active {
          color: var(--color-dark-100);
          background-color: rgba(255,255,255,0.8);
          box-shadow: 0 10px 26px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.88) inset;
        }
        .header-nav-icon {
          transition: transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .header-nav-icon.is-active {
          transform: rotate(45deg);
        }
        .header-mobile-link {
          transition:
            color 420ms cubic-bezier(0.22, 1, 0.36, 1),
            letter-spacing 500ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .header-mobile-link:hover {
          color: white;
          letter-spacing: 0.018em;
          transform: translateY(-1px);
        }
        .header-logo-link {
          transition:
            opacity 420ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .header-logo-link:hover {
          opacity: 0.88;
          transform: translateY(-1px) scale(1.01);
        }
        .header-mega-panel {
          will-change: opacity, transform;
          transform-origin: top center;
          transition:
            opacity 520ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .header-menu-backdrop {
          will-change: opacity;
          transition: opacity 560ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .header-mega-link {
          transition:
            background-color 420ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 420ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 520ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
            color 380ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .header-mega-link:hover {
          transform: translate3d(3px, -2px, 0);
          box-shadow: 0 20px 40px rgba(0,0,0,0.11), 0 1px 0 rgba(255,255,255,0.88) inset;
        }
      `}</style>

      {renderedMenu && (
        <div
          className={`header-menu-backdrop pointer-events-none fixed inset-0 z-0 bg-[rgba(255,255,255,0.08)] backdrop-blur-[10px] ${
            openMenu ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      <div
        className="relative z-10 mx-auto hidden w-full max-w-[1280px] px-4 lg:block"
        onMouseEnter={clearDesktopCloseTimer}
        onMouseLeave={scheduleCloseDesktopMenu}
      >
        <div
          className={`flex w-full items-center justify-between rounded-[28px] border py-2 pl-4 pr-2 transition-all duration-300 sm:rounded-[40px] sm:pl-7 ${
            scrolled
              ? 'border-black/6 bg-white/96 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl'
              : 'border-white/60 bg-white/88 shadow-[0_8px_32px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.8)_inset] backdrop-blur-md'
          }`}
        >
          <Link href="/" className="header-logo-link block" onMouseEnter={scheduleCloseDesktopMenu}>
            <Image
              src={LOGO_SRC}
              alt="Just Acoustics"
              width={180}
              height={40}
              className="w-[138px] xl:w-[176px]"
              style={{ height: 'auto' }}
              priority
            />
          </Link>

          <nav>
            <ul className="m-0 flex list-none items-center gap-6 p-0 xl:gap-7">
              {desktopNav.map((link) => {
                const isActive = openMenu === link.key

                return (
                  <li key={link.key} className="relative" onMouseEnter={() => openDesktopMenu(link.key)}>
                    <Link
                      href={link.href}
                      className={`header-nav-trigger flex items-center gap-1 rounded-[100px] px-2.5 py-2 -mx-2.5 -my-2 text-[14px] no-underline ${
                        isActive ? 'is-active' : ''
                      } ${
                        isActive ? 'text-[var(--color-dark-100)]' : 'text-[var(--color-gray-100)]'
                      }`}
                      aria-expanded={isActive}
                      aria-haspopup="true"
                      onFocus={() => openDesktopMenu(link.key)}
                      onClick={closeDesktopMenuImmediate}
                    >
                      {link.label}
                      <span className={`header-nav-icon ${isActive ? 'is-active' : ''}`}>
                        <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className="mt-0.5"
                      >
                        <path
                          d="M6 2.25V9.75"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M2.25 6H9.75"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        </svg>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2" onMouseEnter={scheduleCloseDesktopMenu}>
            <Link href="/contact" className="no-underline">
              <ShimmerButton className="h-auto px-6 py-3 text-[14px] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.018] hover:shadow-[0_0_28px_5px_rgba(255,185,55,0.42)] active:scale-[0.99]">
                Free Consultation
              </ShimmerButton>
            </Link>
          </div>
        </div>

        <div
          className={`header-mega-panel absolute left-4 right-4 top-full pt-3 ${
            renderedMenu
              ? openMenu
                ? 'pointer-events-auto opacity-100 translate-y-0'
                : 'pointer-events-none opacity-0 translate-y-0'
              : 'pointer-events-none opacity-0 translate-y-0'
          }`}
        >
          {activeMenuData && (
            <div className="w-full overflow-hidden rounded-[30px] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(246,243,237,0.94))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.14),0_1px_0_rgba(255,255,255,0.84)_inset] backdrop-blur-[40px] backdrop-saturate-150 xl:p-7">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.38fr)_300px]">
                <div
                  className={`grid gap-6 ${getSectionsGridClass(
                    activeMenuData.key,
                    activeMenuData.sections.length
                  )}`}
                >
                  {activeMenuData.sections.map((section, index) => (
                    <div key={`${activeMenuData.key}-${section.title ?? index}`} className="min-w-0">
                      {section.title && (
                        <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-gray-200)]">
                          {section.title}
                        </p>
                      )}
                      <div className={`${section.title ? 'mt-4' : ''} flex flex-col gap-2.5`}>
                        {section.links.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="header-mega-link group flex items-center justify-between gap-4 rounded-[18px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,246,241,0.9))] px-4 py-3 text-[14px] font-medium text-[var(--color-dark-100)] no-underline shadow-[0_10px_24px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.82)_inset] hover:border-black/8 hover:bg-white"
                            onClick={closeDesktopMenuImmediate}
                          >
                            <span className="min-w-0 truncate">{item.label}</span>
                            {item.meta ? (
                              <span className="shrink-0 text-[12px] font-medium text-[var(--color-gray-200)]">
                                {item.meta}
                              </span>
                            ) : (
                              <span className="shrink-0 text-[var(--color-gray-300)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--color-brand-orange)]">
                                →
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[24px] border border-[rgba(255,165,0,0.18)] bg-[linear-gradient(180deg,rgba(255,184,66,0.18),rgba(255,255,255,0.94))] p-5 shadow-[0_18px_46px_rgba(255,165,0,0.12)]">
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(180,106,0,0.88)]">
                    {activeMenuData.panel.eyebrow}
                  </p>
                  <h3
                    className="mt-4 mb-0 text-[var(--color-dark-100)]"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(24px, 2.4vw, 32px)',
                      lineHeight: '1.02',
                      fontWeight: 500,
                      letterSpacing: '-0.8px',
                    }}
                  >
                    {activeMenuData.panel.title}
                  </h3>
                  <p className="mt-4 mb-0 text-[14px] leading-6 text-[var(--color-gray-100)]">
                    {activeMenuData.panel.body}
                  </p>

                  {activeMenuData.panel.pills && activeMenuData.panel.pills.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {activeMenuData.panel.pills.map((pill) => (
                        <span
                          key={pill}
                          className="inline-flex rounded-full border border-black/8 bg-white/72 px-3 py-2 text-[12px] font-semibold text-[var(--color-dark-100)]/72"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={activeMenuData.panel.ctaHref}
                    className="mt-6 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[100px] bg-[var(--color-dark-100)] px-5 py-3 text-sm font-semibold text-white no-underline shadow-[0_16px_30px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/88"
                    onClick={closeDesktopMenuImmediate}
                  >
                    {activeMenuData.panel.ctaLabel}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1280px] px-0 lg:hidden">
        <div
          className={`flex w-full items-center justify-between rounded-[28px] border py-2 pl-4 pr-2 transition-all duration-300 sm:rounded-[40px] sm:pl-7 ${
            scrolled
              ? 'border-black/6 bg-white/96 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl'
              : 'border-white/60 bg-white/88 shadow-[0_8px_32px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.8)_inset] backdrop-blur-md'
          }`}
        >
          <Link href="/" className="header-logo-link block">
            <Image
              src={LOGO_SRC}
              alt="Just Acoustics"
              width={180}
              height={40}
              className="w-[124px] sm:w-[138px]"
              style={{ height: 'auto' }}
              priority
            />
          </Link>

          <button
            className={`burger-btn rounded-full p-2 ${mobileOpen ? 'is-open' : ''}`}
            onClick={mobileOpen ? closeMobile : openMobile}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
              <line
                x1="3"
                y1="5"
                x2="21"
                y2="5"
                stroke="#4a4a4a"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  transformOrigin: '12px 12px',
                  transition: 'transform 0.48s cubic-bezier(0.22,1,0.36,1), opacity 0.32s ease',
                  transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'translateY(0)',
                }}
              />
              <line
                x1="3"
                y1="12"
                x2="21"
                y2="12"
                stroke="#4a4a4a"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  transformOrigin: '12px 12px',
                  transition: 'opacity 0.28s ease, transform 0.32s cubic-bezier(0.22,1,0.36,1)',
                  opacity: mobileOpen ? 0 : 1,
                  transform: mobileOpen ? 'scaleX(0.65)' : 'scaleX(1)',
                }}
              />
              <line
                x1="3"
                y1="19"
                x2="21"
                y2="19"
                stroke="#4a4a4a"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  transformOrigin: '12px 12px',
                  transition: 'transform 0.48s cubic-bezier(0.22,1,0.36,1), opacity 0.32s ease',
                  transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'translateY(0)',
                }}
              />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-[var(--color-dark-100)] px-5 pt-6 pb-6 sm:px-6 sm:pt-8"
          style={{
            opacity: mobileVisible ? 1 : 0,
            transition: 'opacity 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{
              opacity: mobileVisible ? 1 : 0,
              transform: mobileVisible ? 'translateY(0)' : 'translateY(-4px)',
              transition:
                'opacity 0.46s cubic-bezier(0.22,1,0.36,1) 0.03s, transform 0.46s cubic-bezier(0.22,1,0.36,1) 0.03s',
            }}
          >
            <Link href="/" onClick={closeMobile} className="block">
              <Image
                src="https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696374f75670859d95904082_Just%20Acoustics%201600x900.svg"
                alt="Just Acoustics"
                width={146}
                height={32}
                className="w-[128px] sm:w-[146px]"
                style={{ filter: 'invert(1)' }}
              />
            </Link>
            <button
              onClick={closeMobile}
              aria-label="Close menu"
              className="cursor-pointer border-0 bg-transparent p-1 text-white transition-all duration-200 hover:opacity-60 active:scale-90"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M26 6L6 26M6 6l20 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <ul className="list-none px-0 pt-12 pb-8 text-center sm:pt-14 sm:pb-9">
            {mobileLinks.map((link, index) => (
              <li
                key={link.href}
                className="mb-3"
                style={{
                  opacity: mobileVisible ? 1 : 0,
                  transform: mobileVisible ? 'translateY(0)' : 'translateY(10px)',
                  transition: `opacity 0.46s cubic-bezier(0.22,1,0.36,1) ${
                    0.09 + index * 0.035
                  }s, transform 0.46s cubic-bezier(0.22,1,0.36,1) ${0.09 + index * 0.035}s`,
                }}
              >
                <Link
                  href={link.href}
                  onClick={closeMobile}
                  className="header-mobile-link block py-2 text-[24px] leading-[1.04] text-[var(--color-gray-300)] no-underline sm:text-[30px] md:text-[38px]"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div
            className="pb-8 sm:pb-9"
            style={{
              opacity: mobileVisible ? 1 : 0,
              transform: mobileVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: `opacity 0.46s cubic-bezier(0.22,1,0.36,1) ${
                0.1 + mobileLinks.length * 0.035
              }s, transform 0.46s cubic-bezier(0.22,1,0.36,1) ${0.1 + mobileLinks.length * 0.035}s`,
            }}
          >
            <Link href="/contact" onClick={closeMobile} className="block no-underline">
              <ShimmerButton className="h-auto w-full px-8 py-4 text-base">
                Free Consultation
              </ShimmerButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
