import {
  getMenuSpaces,
  getMenuShopItems,
  getMenuProjects,
} from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { PROJECT_CATEGORY_LABELS } from '@/data/navigationConfig'
import HeaderClient from './HeaderClient'

type MenuProject = {
  _id: string
  category?: string
  mainImage?: {
    alt?: string
    [key: string]: unknown
  }
}

type MenuSpace = {
  _id: string
  title: string
  slug: string
  shortDescription?: string
  mainImage?: {
    alt?: string
    [key: string]: unknown
  }
}

type MenuShopItem = {
  _id: string
  title: string
  slug: string
  category?: string
  productLine?: string
  price?: number
  checkoutMode?: 'quote-only' | 'configurable-quote' | 'payment-ready'
  configuratorEnabled?: boolean
  mainImage?: {
    alt?: string
    [key: string]: unknown
  }
}

export default async function Header() {
  const [shopItems, spaces, projects] = await Promise.all([
    getMenuShopItems().catch(() => [] as MenuShopItem[]),
    getMenuSpaces().catch(() => [] as MenuSpace[]),
    getMenuProjects().catch(() => [] as MenuProject[]),
  ])

  const spaceItems = spaces.flatMap((space: MenuSpace) =>
    space.slug
      ? [{
          title: space.title,
          slug: space.slug,
          shortDescription: space.shortDescription,
          image: space.mainImage
            ? urlFor(space.mainImage).width(720).height(540).fit('crop').url()
            : undefined,
          imageAlt: space.mainImage?.alt || `${space.title} acoustic treatment`,
        }]
      : []
  )

  const projectCategories = projects.flatMap((project: MenuProject) =>
    project.category ? [project.category] : []
  )

  const projectCards = Object.entries(PROJECT_CATEGORY_LABELS).flatMap(([category, label]) => {
    const project = projects.find((item: MenuProject) => item.category === category && item.mainImage)
    if (!project?.mainImage) return []

    return [
      {
        category,
        label,
        image: urlFor(project.mainImage).width(720).height(540).fit('crop').url(),
        alt: project.mainImage.alt || `${label} acoustic project`,
      },
    ]
  })

  // getMenu* queries already return slug as a flat string (slug.current projected),
  // so we wrap them to match the { slug: { current: string } } shape HeaderClient expects.
  const menuShopItems = shopItems.flatMap((item: MenuShopItem) =>
    item.slug
      ? [{
          title: item.title,
          slug: item.slug,
          category: item.category,
          productLine: item.productLine,
          price: item.price,
          checkoutMode: item.checkoutMode,
          configuratorEnabled: item.configuratorEnabled,
          image: item.mainImage
            ? urlFor(item.mainImage).width(600).height(720).fit('crop').url()
            : undefined,
          imageAlt: item.mainImage?.alt || item.title,
        }]
      : []
  )

  return (
    <HeaderClient
      shopItems={menuShopItems}
      spaces={spaceItems}
      projectCategories={projectCategories}
      projectCards={projectCards}
    />
  )
}
