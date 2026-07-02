'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowRight,
  ArrowLeft,
  CircleHelp,
  FolderKanban,
  GraduationCap,
  Info,
  MessageCircle,
} from 'lucide-react'
import { CartButton } from '@/components/cart/CartProvider'
import ShimmerButton from '@/components/ui/shimmer-button'
import { IMAGE_BLUR_DATA_URL } from '@/lib/imagePlaceholder'
import {
  type MenuKey,
  LOGO_SRC,
  SHOP_CATEGORY_LABELS,
  PROJECT_CATEGORY_LABELS,
  desktopNav,
  aboutLinks,
} from '@/data/navigationConfig'

type ShopMenuItem = {
  title: string
  slug: string
  category?: string
  price?: number
  checkoutMode?: 'quote-only' | 'configurable-quote' | 'payment-ready'
  configuratorEnabled?: boolean
  image?: string
  imageAlt?: string
}

type SpaceMenuItem = {
  title: string
  slug: string
  shortDescription?: string
  image?: string
  imageAlt?: string
}

type ProjectMenuCard = {
  category: string
  label: string
  image: string
  alt: string
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
  shopItems: ShopMenuItem[]
  spaces: SpaceMenuItem[]
  projectCategories: string[]
  projectCards: ProjectMenuCard[]
}

// Static nav config is now in data/navigationConfig.ts

const FEATURED_SPACE_SLUGS = ['studios', 'offices', 'churches', 'restaurants']
const SECONDARY_SPACE_SLUGS = ['education']

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

function buildSpaceSections(spaces: SpaceMenuItem[]) {
  const links = spaces.map((space) => ({
    label: space.title,
    href: `/spaces/${space.slug}`,
    meta: space.shortDescription ? 'Space' : undefined,
  }))

  if (links.length === 0) {
    return [
      {
        title: 'Popular Spaces',
        links: [
          { label: 'Offices', href: '/spaces/offices' },
          { label: 'Restaurants', href: '/spaces/restaurants' },
          { label: 'Churches', href: '/spaces/churches' },
          { label: 'Education', href: '/spaces/education' },
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

function buildSpaceMenuItems(spaces: SpaceMenuItem[]) {
  const uniqueSpaces = Array.from(
    new Map(spaces.map((space) => [space.slug, space])).values()
  )

  const bySlug = new Map(uniqueSpaces.map((space) => [space.slug, space]))
  const featured = FEATURED_SPACE_SLUGS.flatMap((slug) => {
    const space = bySlug.get(slug)
    return space?.image ? [space] : []
  })
  const secondary = SECONDARY_SPACE_SLUGS.flatMap((slug) => {
    const space = bySlug.get(slug)
    return space ? [space] : []
  })

  return { featured, secondary }
}

export default function HeaderClient({
  shopItems,
  spaces,
  projectCategories,
  projectCards,
}: HeaderClientProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState<MenuKey | null>(null)
  const [mobileRenderedMenu, setMobileRenderedMenu] = useState<MenuKey>('shop')
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null)
  const [renderedMenu, setRenderedMenu] = useState<MenuKey | null>(null)
  const [shopMenuCategory, setShopMenuCategory] = useState<string>('all')
  const [scrolled, setScrolled] = useState(false)
  const [mobileHeaderProgress, setMobileHeaderProgress] = useState(0)
  const openTimerRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const mobileCloseTimerRef = useRef<number | null>(null)
  const mobileSubmenuHeadingRef = useRef<HTMLHeadingElement | null>(null)

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

  function openMobileSubmenu(menu: MenuKey) {
    setMobileRenderedMenu(menu)
    requestAnimationFrame(() => setMobileMenu(menu))
  }

  function backToMobileMain() {
    setMobileMenu(null)
  }

  function clearDesktopCloseTimer() {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  function clearDesktopOpenTimer() {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
  }

  function openDesktopMenu(menu: MenuKey) {
    clearDesktopOpenTimer()
    clearDesktopCloseTimer()
    setRenderedMenu(menu)
    setOpenMenu(menu)
  }

  function scheduleOpenDesktopMenu(menu: MenuKey) {
    clearDesktopOpenTimer()
    clearDesktopCloseTimer()

    const delay = openMenu ? 70 : 50
    openTimerRef.current = window.setTimeout(() => {
      setRenderedMenu(menu)
      setOpenMenu(menu)
      openTimerRef.current = null
    }, delay)
  }

  function scheduleCloseDesktopMenu() {
    clearDesktopOpenTimer()
    clearDesktopCloseTimer()
    setOpenMenu(null)
    closeTimerRef.current = window.setTimeout(() => {
      setRenderedMenu(null)
      closeTimerRef.current = null
    }, 220)
  }

  function closeDesktopMenuImmediate() {
    clearDesktopOpenTimer()
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
    if (mobileMenu) {
      requestAnimationFrame(() => mobileSubmenuHeadingRef.current?.focus())
    }
  }, [mobileMenu])

  useEffect(() => {
    const imageUrls = [
      ...shopItems.flatMap((item) => item.image ? [item.image] : []),
      ...spaces.flatMap((space) => space.image ? [space.image] : []),
      ...projectCards.map((project) => project.image),
    ]
    const uniqueUrls = Array.from(new Set(imageUrls))
    let cancelled = false

    const warmMenuImages = () => {
      if (cancelled) return
      uniqueUrls.forEach((src) => {
        const image = new window.Image()
        image.decoding = 'async'
        image.src = src
      })
    }

    const idleWindow = window as typeof window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
      cancelIdleCallback?: (handle: number) => void
    }
    const idleHandle = idleWindow.requestIdleCallback?.(warmMenuImages, { timeout: 300 })
    const timeoutHandle = idleHandle == null ? window.setTimeout(warmMenuImages, 80) : null

    return () => {
      cancelled = true
      if (idleHandle != null) idleWindow.cancelIdleCallback?.(idleHandle)
      if (timeoutHandle != null) window.clearTimeout(timeoutHandle)
    }
  }, [projectCards, shopItems, spaces])

  useEffect(() => {
    return () => {
      clearDesktopOpenTimer()
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
        sections: [],
        panel: {
          eyebrow: 'Shop Acoustic Products',
          title: 'Find the right treatment for your room.',
          body: 'Browse purchasable panels and quote-led custom acoustic solutions in one place.',
          ctaLabel: 'Browse All Products',
          ctaHref: '/shop',
        },
      },
      spaces: {
        key: 'spaces',
        label: 'Spaces',
        href: '/spaces',
        sections: buildSpaceSections(spaces),
        panel: {
          eyebrow: 'Spaces',
          title: 'Learn More About Your Space Type.',
          body:
            'Go straight to the room type that best matches the space you want to improve.',
          ctaLabel: 'See All',
          ctaHref: '/spaces',
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
    [projectCategories, spaces]
  )

  const spaceMenuItems = useMemo(
    () => buildSpaceMenuItems(spaces),
    [spaces]
  )
  const orderedShopItems = useMemo(() => {
    const priority = [
      'flexi-acoustic-panels',
      'flexi-custom-print-panels',
      'soothe-gobos',
      'soothe-tm-bass-trap-panel',
      'forma-pet-panels',
    ]
    return [...shopItems].sort((a, b) => {
      const aIndex = priority.indexOf(a.slug)
      const bIndex = priority.indexOf(b.slug)
      if (aIndex === -1 && bIndex === -1) return a.title.localeCompare(b.title)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
  }, [shopItems])
  const buyableShopItems = useMemo(
    () =>
      orderedShopItems.filter(
        (item) =>
          Boolean(item.image) &&
          (item.checkoutMode === 'payment-ready' ||
            item.checkoutMode === 'configurable-quote' ||
            item.configuratorEnabled === true ||
            item.price != null)
      ),
    [orderedShopItems]
  )
  const shopCategoryCards = useMemo(
    () =>
      Object.entries(SHOP_CATEGORY_LABELS).flatMap(([value, label]) => {
        const matchingItems = orderedShopItems.filter((item) => item.category === value)
        if (matchingItems.length === 0) return []
        const imageItem = matchingItems.find((item) => item.image)
        return [{
          value,
          label,
          image: imageItem?.image,
          imageAlt: imageItem?.imageAlt || label,
        }]
      }),
    [orderedShopItems]
  )
  const shopFilterCategories = useMemo(
    () =>
      shopCategoryCards.filter((category) =>
        buyableShopItems.some((item) => item.category === category.value)
      ),
    [buyableShopItems, shopCategoryCards]
  )
  const visibleShopMenuItems = useMemo(
    () =>
      shopMenuCategory === 'all'
        ? buyableShopItems
        : buyableShopItems.filter((item) => item.category === shopMenuCategory),
    [buyableShopItems, shopMenuCategory]
  )
  const shopMenuDestination =
    shopMenuCategory === 'all'
      ? '/shop'
      : `/shop?category=${encodeURIComponent(shopMenuCategory)}`
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

  function renderShopProductCard(item: ShopMenuItem, compact = false) {
    return (
      <Link
        key={item.slug}
        href={`/shop/${item.slug}`}
        className={`header-shop-card group relative isolate flex h-full min-w-0 flex-col overflow-hidden border border-white/65 bg-white/76 no-underline shadow-[0_18px_44px_rgba(0,0,0,0.10),0_1px_0_rgba(255,255,255,0.9)_inset] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white hover:shadow-[0_26px_58px_rgba(0,0,0,0.14)] ${
          compact ? 'rounded-[18px]' : 'rounded-[22px]'
        }`}
        onClick={compact ? closeMobile : closeDesktopMenuImmediate}
      >
        <div className={`relative min-h-0 flex-1 overflow-hidden bg-[linear-gradient(145deg,rgba(248,246,242,0.96),rgba(226,224,220,0.9))] ${
          compact ? 'rounded-t-[17px]' : 'rounded-t-[21px]'
        }`}>
          {item.image ? (
            <Image
              src={item.image}
              alt={item.imageAlt || item.title}
              fill
              sizes={compact ? '(max-width: 639px) 46vw, 30vw' : '(min-width: 1280px) 17vw, 30vw'}
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              quality={62}
              loading="eager"
              className="object-cover transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
            />
          ) : null}
        </div>
        <div className={`shrink-0 overflow-hidden border-t border-white/78 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(239,237,232,0.9))] text-[#171717] backdrop-blur-2xl ${
          compact ? 'rounded-b-[17px] p-3.5' : 'rounded-b-[21px] p-4'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`m-0 font-semibold leading-[1.12] tracking-[-0.02em] ${compact ? 'text-[15px]' : 'text-[17px]'}`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {item.title}
            </h3>
            <ArrowRight className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} mt-0.5 shrink-0 transition-transform duration-500 group-hover:translate-x-1`} />
          </div>
          <p className={`m-0 font-semibold text-black/62 ${compact ? 'mt-2 text-[12px]' : 'mt-2.5 text-xs'}`}>
            {item.price != null ? `From $${item.price}` : 'Configure & quote'}
          </p>
        </div>
      </Link>
    )
  }

  function renderMobileToggle(
    open: boolean,
    onClick: () => void,
    ariaLabel: string,
    options?: {
      forceSolid?: boolean
      shiftOverride?: string
    }
  ) {
    const useSolidStyle = options?.forceSolid ?? (isHeroOverlay || mobileHeaderIsSolid)
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

  function renderSpacesMegaMenu() {
    const items = [...spaceMenuItems.featured, ...spaceMenuItems.secondary]

    return (
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 xl:gap-5">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/spaces/${item.slug}`}
              className="header-space-card group relative isolate min-h-[190px] overflow-hidden rounded-[24px] border border-white/55 bg-[var(--color-dark-100)] no-underline shadow-[0_26px_62px_rgba(0,0,0,0.18),0_1px_0_rgba(255,255,255,0.72)_inset] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_30px_70px_rgba(0,0,0,0.20),0_1px_0_rgba(255,255,255,0.9)_inset] xl:min-h-[220px]"
              onClick={closeDesktopMenuImmediate}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.imageAlt || `${item.title} acoustic treatment`}
                  fill
                  sizes="(min-width: 1280px) 28vw, 44vw"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  quality={62}
                  loading="eager"
                  className="object-cover transition duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,13,15,0.12),rgba(9,13,15,0.76))]"
              />
              <span
                className="absolute inset-x-0 bottom-0 z-10 p-4 text-[22px] font-semibold leading-[0.98] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.38)] xl:p-5 xl:text-[26px]"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0' }}
              >
                {item.title}
              </span>
              <ArrowRight className="absolute bottom-5 right-5 z-10 h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          ))}
          <Link
            href="/spaces"
            className="header-space-card group relative isolate flex min-h-[190px] flex-col justify-end overflow-hidden rounded-[24px] border border-[#e89400] bg-[var(--color-brand-orange)] p-5 text-white no-underline shadow-[0_28px_64px_rgba(255,165,0,0.24),0_1px_0_rgba(255,255,255,0.62)_inset] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_32px_72px_rgba(255,165,0,0.26),0_1px_0_rgba(255,255,255,0.82)_inset] xl:min-h-[220px]"
            onClick={closeDesktopMenuImmediate}
          >
            {spaceMenuItems.featured[0]?.image ? (
              <Image src={spaceMenuItems.featured[0].image} alt="" fill sizes="(min-width: 1280px) 28vw, 44vw" placeholder="blur" blurDataURL={IMAGE_BLUR_DATA_URL} quality={62} loading="eager" className="object-cover" />
            ) : null}
            <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,165,0,0.28),rgba(106,54,0,0.9))]" />
            <span className="relative z-10">
              <span className="block text-[22px] font-semibold leading-[0.98] xl:text-[26px]" style={{ fontFamily: 'var(--font-heading)' }}>
                See All Spaces
              </span>
              <ArrowRight className="mt-4 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
      </div>
    )
  }

  function renderShopMegaMenu() {
    return (
      <div className="grid gap-7 xl:grid-cols-[245px_minmax(0,1fr)]">
        <div className="flex flex-col">
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => setShopMenuCategory('all')}
              aria-pressed={shopMenuCategory === 'all'}
              className={`rounded-[12px] border-0 px-3 py-2 text-left text-[16px] font-semibold transition-all duration-300 ${
                shopMenuCategory === 'all'
                  ? 'bg-white text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(0,0,0,0.06)]'
                  : 'bg-transparent text-[var(--color-dark-100)] hover:bg-white/72'
              }`}
            >
              Shop All
            </button>
            {shopFilterCategories.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setShopMenuCategory(value)}
                aria-pressed={shopMenuCategory === value}
                className={`rounded-[12px] border-0 px-3 py-2 text-left text-[16px] font-medium transition-all duration-300 ${
                  shopMenuCategory === value
                    ? 'bg-white text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(0,0,0,0.06)]'
                    : 'bg-transparent text-[var(--color-gray-100)] hover:bg-white/72 hover:text-[var(--color-dark-100)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 items-stretch gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {visibleShopMenuItems.slice(0, 4).map((item) => renderShopProductCard(item))}
          <Link
            href={shopMenuDestination}
            className="header-shop-card group relative flex h-full min-h-[340px] flex-col items-center justify-center gap-5 overflow-hidden rounded-[22px] border border-white/60 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.78),transparent_28%),linear-gradient(145deg,rgba(255,182,55,0.70),rgba(255,143,0,0.48))] p-6 text-center text-[#171717] no-underline shadow-[0_24px_56px_rgba(255,165,0,0.18),0_1px_0_rgba(255,255,255,0.76)_inset] backdrop-blur-2xl transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_30px_64px_rgba(255,165,0,0.22),0_1px_0_rgba(255,255,255,0.88)_inset]"
            onClick={closeDesktopMenuImmediate}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-black/15 bg-white/30">
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="text-[28px] font-medium leading-[0.95]" style={{ fontFamily: 'var(--font-heading)' }}>
              See all<br /><em className="font-normal">products</em>
            </span>
          </Link>
        </div>
      </div>
    )
  }

  function renderProjectsMegaMenu(menuData: MenuDefinition) {
    if (projectCards.length === 0) {
      return (
        <div
          className={`grid gap-6 ${getSectionsGridClass(
            menuData.key,
            menuData.sections.length
          )}`}
        >
          {menuData.sections.map((section, index) => (
            <div key={`${menuData.key}-${section.title ?? index}`} className="min-w-0">
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
                    <span className="shrink-0 text-[var(--color-gray-300)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--color-brand-orange)]">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 xl:gap-5">
          {projectCards.map((item) => (
            <Link
              key={item.category}
              href={`/projects?category=${encodeURIComponent(item.category)}`}
              className="header-space-card group relative isolate min-h-[190px] overflow-hidden rounded-[24px] border border-white/55 bg-[var(--color-dark-100)] no-underline shadow-[0_26px_62px_rgba(0,0,0,0.18),0_1px_0_rgba(255,255,255,0.72)_inset] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_30px_70px_rgba(0,0,0,0.20),0_1px_0_rgba(255,255,255,0.9)_inset] xl:min-h-[220px]"
              onClick={closeDesktopMenuImmediate}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1280px) 20vw, 42vw"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                quality={62}
                loading="eager"
                className="object-cover transition duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,13,15,0.16),rgba(9,13,15,0.74))]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[rgba(11,20,22,0.2)] mix-blend-color"
              />
              <span
                className="absolute inset-x-0 bottom-0 z-10 p-4 text-[22px] font-semibold leading-[0.98] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.38)] xl:p-5 xl:text-[26px]"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0' }}
              >
                {item.label}
              </span>
              <ArrowRight className="absolute bottom-5 right-5 z-10 h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          ))}
          <Link
            href="/projects"
            className="header-space-card group relative isolate flex min-h-[190px] flex-col justify-end overflow-hidden rounded-[24px] border border-[#e89400] bg-[var(--color-brand-orange)] p-5 text-white no-underline shadow-[0_28px_64px_rgba(255,165,0,0.24),0_1px_0_rgba(255,255,255,0.62)_inset] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_32px_72px_rgba(255,165,0,0.26),0_1px_0_rgba(255,255,255,0.82)_inset] xl:min-h-[220px]"
            onClick={closeDesktopMenuImmediate}
          >
            {projectCards[0]?.image && (
              <Image src={projectCards[0].image} alt="" fill sizes="(min-width: 1280px) 28vw, 44vw" placeholder="blur" blurDataURL={IMAGE_BLUR_DATA_URL} quality={62} loading="eager" className="object-cover" />
            )}
            <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,165,0,0.30),rgba(130,66,0,0.88))]" />
            <span className="relative z-10">
              <span
                className="block text-[22px] font-semibold leading-[0.98] xl:text-[26px]"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0' }}
              >
                See All Projects
              </span>
              <ArrowRight className="mt-4 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    )
  }

  function renderAboutMegaMenu() {
    const cards = [
      { label: 'About Us', href: '/about', icon: Info, tone: 'border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,245,245,0.94))] text-[#171717]' },
      { label: 'Our Projects', href: '/projects', icon: FolderKanban, tone: 'border border-[#d97706]/20 bg-[linear-gradient(180deg,rgba(255,184,64,0.94),rgba(255,151,20,0.94))] text-[#171717]' },
      { label: 'FAQ', href: '/#faq', icon: CircleHelp, tone: 'border border-white/8 bg-[linear-gradient(180deg,rgba(22,18,15,0.92),rgba(14,11,9,0.96))] text-white' },
      { label: 'Acoustic Education', href: '/blog', icon: GraduationCap, tone: 'border border-black/7 bg-[linear-gradient(180deg,#f5f5f5,#e9e9e9)] text-[#171717]' },
      { label: 'Contact Us', href: '/contact', icon: MessageCircle, tone: 'border border-[#e89400] bg-[var(--color-brand-orange)] text-[#171717]' },
    ]

    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 xl:gap-5">
        {cards.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`header-about-card group flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-[24px] p-5 text-center no-underline shadow-[0_18px_44px_rgba(0,0,0,0.10)] backdrop-blur-xl transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(0,0,0,0.12)] xl:min-h-[250px] ${item.tone}`}
              onClick={closeDesktopMenuImmediate}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-current/25 bg-white/8">
                <Icon className="h-7 w-7" strokeWidth={1.6} />
              </span>
              <span
                className="max-w-[11ch] text-[24px] font-medium leading-[1.02] xl:text-[28px]"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
              >
                {item.label}
              </span>
              <ArrowRight className="h-5 w-5 opacity-60 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )
        })}
      </div>
    )
  }

  function renderMobileImageCard({
    label,
    href,
    image,
    tint = 'bg-[linear-gradient(180deg,rgba(5,8,10,0.08),rgba(5,8,10,0.72))]',
  }: {
    label: string
    href: string
    image?: string
    tint?: string
  }) {
    return (
      <Link
        key={href}
        href={href}
        onClick={closeMobile}
        className="group relative isolate h-[118px] overflow-hidden rounded-[18px] bg-[var(--color-dark-100)] no-underline shadow-[0_12px_28px_rgba(0,0,0,0.10)] sm:aspect-[4/3] sm:h-auto"
      >
        {image && <Image src={image} alt="" fill sizes="50vw" placeholder="blur" blurDataURL={IMAGE_BLUR_DATA_URL} quality={62} loading="eager" className="object-cover" />}
        <span aria-hidden="true" className={`absolute inset-0 ${tint}`} />
        <span className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-3 sm:p-4">
          <span className="min-w-0 text-[15px] font-semibold leading-[1.02] text-white sm:text-[20px]" style={{ fontFamily: 'var(--font-heading)' }}>{label}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
        </span>
      </Link>
    )
  }

  function renderMobileSubmenu(menuKey: MenuKey) {
    if (menuKey === 'spaces') {
      const items = [...spaceMenuItems.featured, ...spaceMenuItems.secondary]
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => renderMobileImageCard({
            label: item.title,
            href: `/spaces/${item.slug}`,
            image: item.image,
          }))}
          {renderMobileImageCard({
            label: 'See All Spaces',
            href: '/spaces',
            image: spaceMenuItems.featured[3]?.image,
            tint: 'bg-[linear-gradient(180deg,rgba(255,165,0,0.26),rgba(106,54,0,0.88))]',
          })}
        </div>
      )
    }

    if (menuKey === 'projects') {
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {projectCards.map((item) => renderMobileImageCard({
            label: item.label,
            href: `/projects?category=${encodeURIComponent(item.category)}`,
            image: item.image,
          }))}
          {renderMobileImageCard({
            label: 'See All Projects',
            href: '/projects',
            image: projectCards[0]?.image,
            tint: 'bg-[linear-gradient(180deg,rgba(255,165,0,0.28),rgba(106,54,0,0.9))]',
          })}
        </div>
      )
    }

    if (menuKey === 'shop') {
      return (
        <div className="grid gap-4">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setShopMenuCategory('all')}
              aria-pressed={shopMenuCategory === 'all'}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                shopMenuCategory === 'all'
                  ? 'border-black/12 bg-[#171717] text-white'
                  : 'border-black/8 bg-white text-[var(--color-gray-100)]'
              }`}
            >
              Shop All
            </button>
            {shopFilterCategories.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setShopMenuCategory(value)}
                aria-pressed={shopMenuCategory === value}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  shopMenuCategory === value
                    ? 'border-black/12 bg-[#171717] text-white'
                    : 'border-black/8 bg-white text-[var(--color-gray-100)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3">
            {visibleShopMenuItems.slice(0, 5).map((item) => renderShopProductCard(item, true))}
            <Link
              href={shopMenuDestination}
              onClick={closeMobile}
              className="group flex h-full min-h-[250px] flex-col items-center justify-center gap-3 rounded-[18px] border border-[#e89400] bg-[var(--color-brand-orange)] p-4 text-center text-[#171717] no-underline shadow-[0_16px_34px_rgba(255,165,0,0.22)]"
            >
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              <span className="text-[20px] font-medium leading-none" style={{ fontFamily: 'var(--font-heading)' }}>See All Products</span>
            </Link>
          </div>
        </div>
      )
    }

    const companyCards = [
      { label: 'About Us', href: '/about', icon: Info, tone: 'border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,245,245,0.94))] text-[#171717]' },
      { label: 'Our Projects', href: '/projects', icon: FolderKanban, tone: 'border border-[#d97706]/20 bg-[linear-gradient(180deg,rgba(255,184,64,0.94),rgba(255,151,20,0.94))] text-[#171717]' },
      { label: 'FAQ', href: '/#faq', icon: CircleHelp, tone: 'border border-white/8 bg-[linear-gradient(180deg,rgba(22,18,15,0.92),rgba(14,11,9,0.96))] text-white' },
      { label: 'Acoustic Education', href: '/blog', icon: GraduationCap, tone: 'border border-black/7 bg-[linear-gradient(180deg,#f5f5f5,#e9e9e9)] text-[#171717]' },
      { label: 'Contact Us', href: '/contact', icon: MessageCircle, tone: 'border border-[#e89400] bg-[var(--color-brand-orange)] text-[#171717]' },
    ]
    return (
      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3">
          {companyCards.map(({ label, href, icon: Icon, tone }) => (
            <Link key={href} href={href} onClick={closeMobile} className={`flex min-h-[138px] flex-col items-center justify-center gap-3 rounded-[18px] p-4 text-center no-underline shadow-[0_12px_28px_rgba(0,0,0,0.08)] sm:min-h-[168px] ${tone}`}>
              <Icon className="h-7 w-7" strokeWidth={1.6} />
              <span className="text-[18px] font-semibold leading-tight sm:text-[21px]" style={{ fontFamily: 'var(--font-heading)' }}>{label}</span>
              <ArrowRight className="h-4 w-4 opacity-65" />
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-[1000] isolate px-0 pt-0 lg:px-4 lg:pt-[32px]">
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
        .header-mobile-screen {
          position: absolute;
          inset: 0;
          overflow-y: auto;
          overscroll-behavior: contain;
          transition:
            opacity 320ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }
        .header-mobile-screen-main {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          pointer-events: auto;
        }
        .header-mobile-screen-main.is-behind {
          opacity: 0;
          transform: translate3d(-28px, 0, 0);
          pointer-events: none;
        }
        .header-mobile-screen-detail {
          opacity: 0;
          transform: translate3d(28px, 0, 0);
          pointer-events: none;
        }
        .header-mobile-screen-detail.is-active {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          pointer-events: auto;
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
            opacity 240ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .header-mega-content {
          animation: headerMegaContentIn 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes headerMegaContentIn {
          from {
            opacity: 0;
            transform: translate3d(0, 8px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        .header-menu-backdrop {
          will-change: opacity;
          transition: opacity 220ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .header-mega-link {
          transition:
            background-color 640ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 640ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 720ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 720ms cubic-bezier(0.22, 1, 0.36, 1),
            color 520ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .header-mega-link:hover {
          transform: translate3d(1px, -1px, 0);
          box-shadow: 0 16px 30px rgba(0,0,0,0.09), 0 1px 0 rgba(255,255,255,0.88) inset;
        }
        .header-space-card {
          transition:
            box-shadow 720ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 720ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .header-space-card:hover {
          transform: translate3d(0, -2px, 0);
          box-shadow: 0 24px 52px rgba(0,0,0,0.15);
        }
        .header-about-card {
          transition:
            box-shadow 720ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 720ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .header-about-card:hover {
          transform: translate3d(0, -2px, 0);
          box-shadow: 0 24px 52px rgba(0,0,0,0.14);
        }
        @media (prefers-reduced-motion: reduce) {
          .header-mega-content {
            animation: none;
          }
          .header-mobile-screen {
            transition: none;
          }
        }
      `}</style>

      {renderedMenu && (
        <div
          className={`header-menu-backdrop pointer-events-none fixed inset-0 z-0 bg-[rgba(255,255,255,0.16)] ${
            openMenu ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      <div
        className="relative z-10 mx-auto hidden w-full max-w-[1580px] px-4 lg:block"
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
                  <li key={link.key} className="relative" onMouseEnter={() => scheduleOpenDesktopMenu(link.key)}>
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
            <CartButton className="site-header-cart inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-black/8 bg-white/72 px-4 py-2 text-[14px] font-semibold text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white" />
            <Link href="/contact" className="no-underline">
              <ShimmerButton className="min-h-[46px] px-4 py-2 text-[14px] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.018] hover:shadow-[0_0_28px_5px_rgba(255,185,55,0.42)] active:scale-[0.99]">
                Free Consultation
              </ShimmerButton>
            </Link>
          </div>
        </div>

        <div
          className={`header-mega-panel absolute left-4 right-4 top-full pt-5 ${
            renderedMenu
              ? openMenu
                ? 'pointer-events-auto opacity-100 translate-y-0'
                : 'pointer-events-none opacity-0 translate-y-0'
              : 'pointer-events-none opacity-0 translate-y-0'
          }`}
        >
          {activeMenuData && (
            <div
              key={activeMenuData.key}
              className="header-mega-content w-full overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(246,243,237,0.95))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.16),0_10px_28px_rgba(0,0,0,0.07),0_1px_0_rgba(255,255,255,1)_inset] backdrop-blur-[18px] xl:p-7"
            >
              {activeMenuData.key === 'spaces' ? (
                renderSpacesMegaMenu()
              ) : activeMenuData.key === 'shop' ? (
                renderShopMegaMenu()
              ) : activeMenuData.key === 'projects' ? (
                renderProjectsMegaMenu(activeMenuData)
              ) : activeMenuData.key === 'about' ? (
                renderAboutMegaMenu()
              ) : (
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
                              key={`${item.href}-${item.label}`}
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
                      className="page-cta mt-6 text-sm"
                      onClick={closeDesktopMenuImmediate}
                    >
                      {activeMenuData.panel.ctaLabel}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`${mobileHeaderWrapperClass} mx-auto w-full max-w-[1580px] px-0 lg:hidden`}>
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

          <div className="flex items-center gap-2">
            <CartButton className="site-header-cart inline-flex h-11 items-center justify-center gap-1.5 rounded-[14px] border border-white/25 bg-white/92 px-3 text-[13px] font-semibold text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-md" />
            {renderMobileToggle(
              mobileMenuOpen,
              mobileMenuMounted ? closeMobile : openMobile,
              mobileMenuMounted ? 'Close menu' : 'Open menu'
            )}
          </div>
          </div>
        </div>
      </div>

      {mobileMenuMounted && (
        <div
          className="fixed inset-0 z-40 overflow-hidden bg-[rgba(244,241,235,0.72)] px-0 pt-0 backdrop-blur-[22px]"
          style={{
            opacity: mobileMenuOpen ? 1 : 0,
            transition: 'opacity 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          onClick={closeMobile}
        >
          <div
            className="mx-auto flex w-full max-w-[1580px] flex-col"
            style={{
              opacity: mobileMenuOpen ? 1 : 0,
              transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-6px)',
              transition:
                'opacity 0.32s cubic-bezier(0.22,1,0.36,1) 0.03s, transform 0.36s cubic-bezier(0.22,1,0.36,1)',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative mx-auto w-full max-w-[1580px] px-0 lg:hidden">
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

                  <div className="flex items-center gap-2">
                    <CartButton className="site-header-cart inline-flex h-11 items-center justify-center gap-1.5 rounded-[14px] border border-white/25 bg-white/92 px-3 text-[13px] font-semibold text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-md" />
                    {renderMobileToggle(true, closeMobile, 'Close menu', {
                      forceSolid: true,
                      shiftOverride: '0px',
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-4 mt-5 h-[calc(100dvh-116px)] overflow-hidden rounded-[30px] border border-white/60 bg-[rgba(248,246,241,0.97)] shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:mx-5">
              <div className={`header-mobile-screen header-mobile-screen-main p-4 sm:p-5 ${mobileMenu ? 'is-behind' : ''}`} aria-hidden={Boolean(mobileMenu)}>
                <div className="flex flex-col gap-2.5">
                  {desktopNav.map((link) => (
                    <button
                      key={link.key}
                      type="button"
                      onClick={() => openMobileSubmenu(link.key)}
                      className="header-mobile-pill flex w-full items-center justify-between gap-4 rounded-[18px] border border-black/6 bg-white/92 px-4 py-4 text-left shadow-[0_10px_24px_rgba(0,0,0,0.05)] sm:px-5 sm:py-[18px]"
                    >
                      <span className="text-[18px] font-semibold text-[var(--color-dark-100)] sm:text-[20px]" style={{ fontFamily: 'var(--font-heading)' }}>{link.label}</span>
                      <ArrowRight className="h-4 w-4 text-[var(--color-gray-200)] sm:h-5 sm:w-5" />
                    </button>
                  ))}
                  <Link href="/contact" onClick={closeMobile} className="mt-2 block no-underline">
                    <ShimmerButton className="h-auto w-full px-7 py-3.5 text-sm sm:text-base">Free Consultation</ShimmerButton>
                  </Link>
                </div>
              </div>

              <div className={`header-mobile-screen header-mobile-screen-detail ${mobileMenu ? 'is-active' : ''}`} aria-hidden={!mobileMenu}>
                <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-black/7 bg-[rgba(248,246,241,0.97)] px-4 py-4 backdrop-blur-xl sm:px-5">
                  <button type="button" onClick={backToMobileMain} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/12 bg-white text-[var(--color-dark-100)] shadow-[0_8px_22px_rgba(0,0,0,0.10),0_1px_0_rgba(255,255,255,0.9)_inset] transition-transform active:scale-95 sm:h-[52px] sm:w-[52px]" aria-label="Back to main menu">
                    <ArrowLeft className="h-[22px] w-[22px] sm:h-6 sm:w-6" strokeWidth={2.2} />
                  </button>
                  <h2 ref={mobileSubmenuHeadingRef} tabIndex={-1} className="m-0 text-[22px] font-semibold text-[var(--color-dark-100)] outline-none sm:text-[24px]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {megaMenus[mobileRenderedMenu].label}
                  </h2>
                </div>
                <div className="p-4 sm:p-5">
                  {renderMobileSubmenu(mobileRenderedMenu)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
