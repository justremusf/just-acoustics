import type { Product, Project, Service, ShopItem } from '@/lib/types'
import {
  getAllProducts,
  getAllProjects,
  getAllServices,
  getAllShopItems,
} from '@/sanity/lib/queries'
import HeaderClient from './HeaderClient'

function mapSluggedItems<T extends { title: string; slug: { current: string }; category?: string }>(
  items: T[]
) {
  return items.flatMap((item) =>
    item.slug?.current
      ? [{ title: item.title, slug: item.slug.current, category: item.category }]
      : []
  )
}

export default async function Header() {
  const [shopItems, products, services, projects]: [ShopItem[], Product[], Service[], Project[]] = await Promise.all([
    getAllShopItems().catch(() => [] as ShopItem[]),
    getAllProducts().catch(() => [] as Product[]),
    getAllServices().catch(() => [] as Service[]),
    getAllProjects().catch(() => [] as Project[]),
  ])

  const serviceItems = services.flatMap((service) =>
    service.slug?.current
      ? [
          {
            title: service.title,
            slug: service.slug.current,
            shortDescription: service.shortDescription,
          },
        ]
      : []
  )

  const projectCategories = projects.flatMap((project) =>
    project.category ? [project.category] : []
  )

  return (
    <HeaderClient
      shopItems={mapSluggedItems(shopItems)}
      products={mapSluggedItems(products)}
      services={serviceItems}
      projectCategories={projectCategories}
    />
  )
}
