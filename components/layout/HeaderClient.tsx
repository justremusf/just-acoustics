'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  '/assets/webflow/69635d202eb00a587d5f2386_Just%20Acoustics%201600x900%20(1).svg'

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
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState<MenuKey | null>(null)
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null)
  const [renderedMenu, setRenderedMenu] = useState<MenuKey | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileHeaderProgress, setMobileHeaderProgress] = useState(0)
  const closeTimerRef = useRef<number | null>(null)
  const mobileCloseTimerRef = useRef<number | null>(null)

  const openMobile = () => {
    if (mobileCloseTimerRef.current !== null) {
      window.clearTimeout(mobileCloseTimerRef.current)
      mobileCloseTimerRef.current = null
    }
    setMobileMenuMounted(true)
    requestAnimationFrame(() => setMobileMenuOpen(true))
  }

  const closeMobile = () => {
    setMobileMenuOpen(false)
    setMobileMenu(null)
    if (mobileCloseTimerRef.current !== null) {
      window.clearTimeout(mobileCloseTimerRef.current)
    }
    mobileCloseTimerRef.current = window.setTimeout(() => {
      setMobileMenuMounted(false)
      mobileCloseTimerRef.current = null
    }, 320)
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
      const scrollY = window.scrollY
      setScrolled(scrollY > 20)
      setMobileHeaderProgress(Math.min(Math.max(scrollY / 96, 0), 1))
      if (window.scrollY > 24) closeDesktopMenuImmediate()
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuMounted ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuMounted])

  useEffect(() => {
    if (!mobileMenuMounted) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMobile()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileMenuMounted])

  useEffect(() => {
    return () => {
      clearDesktopCloseTimer()
      if (mobileCloseTimerRef.current !== null) {
        window.clearTimeout(mobileCloseTimerRef.current)
      }
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
  const isHeroOverlay = isHomePage && mobileHeaderProgress < 0.55 && !mobileMenuMounted
  const mobileHeaderWrapperClass = isHeroOverlay
    ? 'absolute inset-x-0 top-0 z-10'
    : 'relative z-10'
  const mobileHeaderIsSolid = !isHeroOverlay
  const mobileHeaderDisplayIntensity = isHeroOverlay ? mobileHeaderProgress : 1
  const mobileHeaderInnerWidth = `${100 - (1 - mobileHeaderDisplayIntensity) * 12}%`
  const mobileHeaderShift = `${(1 - mobileHeaderDisplayIntensity) * 8}px`
  const mobileLogoFilter = mobileHeaderIsSolid ? 'brightness(0) saturate(1) opacity(1)' : 'brightness(0) invert(1)'
  const mobileBurgerStroke = 'rgba(74,74,74,1)'
  const mobileBurgerBg = 'rgba(255,255,255,0.92)'
  const mobileHeaderBorderColor = mobileHeaderIsSolid ? 'rgba(255,255,255,0.28)' : 'transparent'
  const mobileHeaderBackground = mobileHeaderIsSolid
    ? 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(248,246,241,0.78))'
    : 'transparent'
  const mobileHeaderShadow = mobileHeaderIsSolid
    ? '0 14px 36px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)'
    : 'none'
  const mobileHeaderBackdrop = mobileHeaderIsSolid ? 'blur(22px)' : 'blur(0px)'

  function renderMobileToggle(
    open: boolean,
    onClick: () => void,
    ariaLabel: string,
    options?: {
      forceSolid?: boolean
      shiftOverride?: string
    }
  ) {
    const useSolidStyle = options?.forceSolid ?? mobileHeaderIsSolid
    const buttonShift = options?.shiftOverride ?? mobileHeaderShift
    const buttonStroke = useSolidStyle ? 'rgba(74,74,74,1)' : 'rgba(255,255,255,0.95)'
    const buttonBg = useSolidStyle ? 'rgba(255,255,255,0.92)' : 'rgba(20,20,20,0.84)'
    const buttonBorder = useSolidStyle ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)'

    return (
      <button
        className={`burger-btn flex h-11 w-11 items-center justify-center rounded-[14px] border p-0 shadow-[0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-md ${open ? 'is-open' : ''}`}
        onClick={onClick}
        aria-label={ariaLabel}
        style={{
          borderColor: buttonBorder,
          background: buttonBg,
          transform: `translateX(${buttonShift})`,
          transition: 'background 280ms ease, border-color 280ms ease, transform 320ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <span
          aria-hidden="true"
          className="relative block h-[18px] w-[20px]"
          style={{ pointerEvents: 'none' }}
        >
          <span
            className="absolute left-1/2 top-0 block h-[2px] w-[20px] rounded-full"
            style={{
              background: buttonStroke,
              transformOrigin: 'center',
              transform: open
                ? 'translateX(-50%) translateY(8px) rotate(45deg)'
                : 'translateX(-50%) translateY(0) rotate(0deg)',
              transition: 'transform 0.42s cubic-bezier(0.22,1,0.36,1), background 280ms ease',
            }}
          />
          <span
            className="absolute left-1/2 top-1/2 block h-[2px] w-[20px] rounded-full"
            style={{
              background: buttonStroke,
              transformOrigin: 'center',
              transform: open ? 'translateX(-50%) translateY(-50%) scaleX(0.7)' : 'translateX(-50%) translateY(-50%)',
              opacity: open ? 0 : 1,
              transition:
                'opacity 0.2s ease, transform 0.28s cubic-bezier(0.22,1,0.36,1), background 280ms ease',
            }}
          />
          <span
            className="absolute bottom-0 left-1/2 block h-[2px] w-[20px] rounded-full"
            style={{
              background: buttonStroke,
              transformOrigin: 'center',
              transform: open
                ? 'translateX(-50%) translateY(-8px) rotate(-45deg)'
                : 'translateX(-50%) translateY(0) rotate(0deg)',
              transition: 'transform 0.42s cubic-bezier(0.22,1,0.36,1), background 280ms ease',
            }}
          />
        </span>
      </button>
    )
  }

  return (
    <header className="sticky top-0 z-50 px-0 pt-0 lg:px-4 lg:pt-[24px]">
      <style>{`
        .burger-btn {
          transition:
            box-shadow 220ms cubic-bezier(0.22,1,0.36,1),
            background-color 220ms cubic-bezier(0.22,1,0.36,1),
            border-color 220ms cubic-bezier(0.22,1,0.36,1);
        }
        .burger-btn:hover {
          box-shadow: 0 14px 28px rgba(0,0,0,0.12);
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
        .header-mobile-pill {
          transition:
            border-color 300ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 300ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .header-mobile-pill:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 36px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.84) inset;
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

      <div className={`${mobileHeaderWrapperClass} mx-auto w-full max-w-[1280px] px-0 lg:hidden`}>
        <div
          className="mx-auto flex w-full items-center justify-center border-b px-4 pt-5 pb-3 transition-all duration-300 sm:px-5"
          style={{
            opacity: mobileMenuMounted ? 0 : 1,
            pointerEvents: mobileMenuMounted ? 'none' : 'auto',
            borderBottomColor: mobileHeaderBorderColor,
            background: mobileHeaderBackground,
            boxShadow: mobileHeaderShadow,
            backdropFilter: mobileHeaderBackdrop,
            WebkitBackdropFilter: mobileHeaderBackdrop,
          }}
        >
          <div
            className="flex w-full items-center justify-between transition-all duration-300"
            style={{
              width: mobileHeaderInnerWidth,
              transform: `translateY(${isHeroOverlay ? 2 : 0}px)`,
            }}
          >
          <Link href="/" className="header-logo-link block">
            <Image
              src={LOGO_SRC}
              alt="Just Acoustics"
              width={180}
              height={40}
              className="w-[124px] sm:w-[138px]"
              style={{
                height: 'auto',
                filter: mobileLogoFilter,
                transform: `translateX(-${mobileHeaderShift})`,
                transition: 'filter 280ms ease, transform 320ms cubic-bezier(0.22,1,0.36,1)',
              }}
              priority
            />
          </Link>

          {renderMobileToggle(
            mobileMenuOpen,
            mobileMenuMounted ? closeMobile : openMobile,
            mobileMenuMounted ? 'Close menu' : 'Open menu'
          )}
          </div>
        </div>
      </div>

      {mobileMenuMounted && (
        <div
          className="fixed inset-0 z-40 overflow-y-auto bg-[rgba(244,241,235,0.72)] px-0 pt-0 pb-6 backdrop-blur-[22px]"
          style={{
            opacity: mobileMenuOpen ? 1 : 0,
            transition: 'opacity 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          onClick={closeMobile}
        >
          <div
            className="mx-auto flex w-full max-w-[1280px] flex-col"
            style={{
              opacity: mobileMenuOpen ? 1 : 0,
              transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-6px)',
              transition:
                'opacity 0.32s cubic-bezier(0.22,1,0.36,1) 0.03s, transform 0.36s cubic-bezier(0.22,1,0.36,1)',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative mx-auto w-full max-w-[1280px] px-0 lg:hidden">
              <div
                className="mx-auto flex w-full items-center justify-center border-b px-4 pt-5 pb-3 transition-all duration-300 sm:px-5"
                style={{
                  borderBottomColor: 'rgba(255,255,255,0.28)',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(248,246,241,0.78))',
                  boxShadow: '0 14px 36px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                }}
              >
                <div className="flex w-full items-center justify-between transition-all duration-300">
                  <Link href="/" className="header-logo-link block" onClick={closeMobile}>
                    <Image
                      src={LOGO_SRC}
                      alt="Just Acoustics"
                      width={180}
                      height={40}
                      className="w-[124px] sm:w-[138px]"
                      style={{ height: 'auto', filter: 'brightness(0) saturate(1) opacity(1)' }}
                      priority
                    />
                  </Link>

                  {renderMobileToggle(true, closeMobile, 'Close menu', {
                    forceSolid: true,
                    shiftOverride: '0px',
                  })}
                </div>
              </div>
            </div>

            <div className="mx-4 mt-8 rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(246,243,237,0.94))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.84)_inset] sm:mx-5 sm:mt-10 sm:p-5">
              <div className="flex flex-col gap-3">
                {desktopNav.map((link) => {
                  const isOpen = mobileMenu === link.key
                  const menuData = megaMenus[link.key]

                  return (
                    <div key={link.key}>
                      <button
                        type="button"
                        onClick={() => setMobileMenu(isOpen ? null : link.key)}
                        aria-expanded={isOpen}
                        className={`header-mobile-pill flex w-full items-center justify-between gap-4 rounded-[22px] border px-5 py-4 text-left ${
                          isOpen
                            ? 'border-[rgba(255,165,0,0.6)] bg-white shadow-[0_18px_36px_rgba(255,165,0,0.08)]'
                            : 'border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,247,243,0.94))] shadow-[0_12px_28px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.82)_inset]'
                        }`}
                      >
                        <span
                          className="text-[18px] text-[var(--color-dark-100)]"
                          style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
                        >
                          {link.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-[28px] leading-none text-[var(--color-gray-200)]"
                          style={{
                            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                            transition: 'transform 280ms cubic-bezier(0.22,1,0.36,1)',
                          }}
                        >
                          +
                        </span>
                      </button>

                      <div
                        className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 mt-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="rounded-[24px] border border-white/70 bg-white/92 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.08)] sm:p-5">
                            <div className="flex flex-col gap-5">
                              {menuData.sections.map((section, index) => (
                                <div key={`${menuData.key}-${section.title ?? index}`} className="min-w-0">
                                  {section.title && (
                                    <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-gray-200)]">
                                      {section.title}
                                    </p>
                                  )}
                                  <div className={`${section.title ? 'mt-3' : ''} flex flex-col gap-2`}>
                                    {section.links.map((item) => (
                                      <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeMobile}
                                        className="group flex items-center justify-between gap-4 rounded-[18px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,246,241,0.92))] px-4 py-3 text-[14px] font-medium text-[var(--color-dark-100)] no-underline shadow-[0_10px_24px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.8)_inset]"
                                      >
                                        <span className="min-w-0">{item.label}</span>
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

                              <div className="rounded-[22px] border border-[rgba(255,165,0,0.18)] bg-[linear-gradient(180deg,rgba(255,184,66,0.16),rgba(255,255,255,0.96))] p-4 shadow-[0_16px_36px_rgba(255,165,0,0.1)]">
                                <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(180,106,0,0.88)]">
                                  {menuData.panel.eyebrow}
                                </p>
                                <h3
                                  className="mt-3 mb-0 text-[var(--color-dark-100)]"
                                  style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '24px',
                                    lineHeight: '1.04',
                                    fontWeight: 500,
                                    letterSpacing: '-0.04em',
                                  }}
                                >
                                  {menuData.panel.title}
                                </h3>
                                <p className="mt-3 mb-0 text-[14px] leading-6 text-[var(--color-gray-100)]">
                                  {menuData.panel.body}
                                </p>
                                <Link
                                  href={menuData.panel.ctaHref}
                                  onClick={closeMobile}
                                  className="mt-5 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[100px] bg-[var(--color-dark-100)] px-5 py-3 text-sm font-semibold text-white no-underline shadow-[0_16px_30px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/88"
                                >
                                  {menuData.panel.ctaLabel}
                                  <span aria-hidden="true">→</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-5">
                <Link href="/contact" onClick={closeMobile} className="block no-underline">
                  <ShimmerButton className="h-auto w-full px-8 py-4 text-base">
                    Free Consultation
                  </ShimmerButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
