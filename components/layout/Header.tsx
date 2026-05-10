import {
  getMenuProducts,
  getMenuServices,
  getMenuShopItems,
  getMenuProjects,
} from '@/sanity/lib/queries'
import HeaderClient from './HeaderClient'

export default async function Header() {
  const [shopItems, products, services, projects] = await Promise.all([
    getMenuShopItems().catch(() => [] as { _id: string; title: string; slug: string; category?: string }[]),
    getMenuProducts().catch(() => [] as { _id: string; title: string; slug: string; category?: string }[]),
    getMenuServices().catch(() => [] as { _id: string; title: string; slug: string; shortDescription?: string }[]),
    getMenuProjects().catch(() => [] as { _id: string; category?: string }[]),
  ])

  const serviceItems = services.flatMap((service: { _id: string; title: string; slug: string; shortDescription?: string }) =>
    service.slug
      ? [{ title: service.title, slug: service.slug, shortDescription: service.shortDescription }]
      : []
  )

  const projectCategories = projects.flatMap((project: { _id: string; category?: string }) =>
    project.category ? [project.category] : []
  )

  // getMenu* queries already return slug as a flat string (slug.current projected),
  // so we wrap them to match the { slug: { current: string } } shape HeaderClient expects.
  const toSluggedItems = (items: { _id: string; title: string; slug: string; category?: string }[]) =>
    items.flatMap((item) =>
      item.slug ? [{ title: item.title, slug: item.slug, category: item.category }] : []
    )

  return (
    <HeaderClient
      shopItems={toSluggedItems(shopItems)}
      products={toSluggedItems(products)}
      services={serviceItems}
      projectCategories={projectCategories}
    />
  )
}
