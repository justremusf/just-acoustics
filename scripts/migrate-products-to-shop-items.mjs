import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const execute = process.argv.includes('--execute')
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN are required.')
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const categoryMap = {
  'wall-panels': 'standard-panels',
  'ceiling-panels': 'ceiling-panels',
  'custom-solutions': 'custom-solutions',
  soundproofing: 'soundproofing',
}

const categoryOverrides = {
  'acoustic-fabric-wall': 'custom-solutions',
}

const products = await client.fetch(`
  *[_type == "product" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
    _id, title, slug, category, mainImage, gallery, description, features, body,
    specifications, acousticalSpecs, installation, seo
  }
`)

if (products.length === 0) {
  const existingMigration = await client.fetch(`{
    "migrated": count(*[_type == "shopItem" && _id match "shopItem.migrated.*"]),
    "quoteOnly": count(*[_type == "shopItem" && _id match "shopItem.migrated.*" && checkoutMode == "quote-only" && configuratorEnabled == false]),
    "shopItems": count(*[_type == "shopItem" && !(_id in path("drafts.**"))])
  }`)
  if (existingMigration.migrated === 7 && existingMigration.quoteOnly === 7) {
    console.log(JSON.stringify({ mode: execute ? 'execute' : 'dry-run', status: 'already-migrated', ...existingMigration }, null, 2))
    process.exit(0)
  }
}

if (products.length !== 7) {
  throw new Error(`Expected 7 published Product documents, found ${products.length}.`)
}

const slugs = products.map((product) => product.slug?.current).filter(Boolean)
const collisions = await client.fetch(
  `*[_type == "shopItem" && slug.current in $slugs] { _id, title, "slug": slug.current }`,
  { slugs }
)

const expectedIds = new Set(slugs.map((slug) => `shopItem.migrated.${slug}`))
const unsafeCollisions = collisions.filter((item) => !expectedIds.has(item._id))
const preservedShopItemCount = await client.fetch(
  `count(*[_type == "shopItem" && !(_id in path("drafts.**")) && !(_id in $ids)])`,
  { ids: [...expectedIds] }
)
const expectedFinalShopItemCount = preservedShopItemCount + products.length

if (unsafeCollisions.length > 0) {
  throw new Error(`Shop Item slug collisions found:\n${JSON.stringify(unsafeCollisions, null, 2)}`)
}

const migratedDocuments = products.map((product) => {
  const slug = product.slug.current
  const category = categoryOverrides[slug] || categoryMap[product.category]
  if (!category) throw new Error(`No Shop Item category mapping for ${product.title}: ${product.category}`)

  return {
    _id: `shopItem.migrated.${slug}`,
    _type: 'shopItem',
    title: product.title,
    slug: product.slug,
    category,
    mainImage: product.mainImage,
    gallery: product.gallery,
    shortDescription: product.description,
    features: product.features,
    body: product.body,
    specifications: product.specifications,
    acousticalSpecs: product.acousticalSpecs,
    installation: product.installation,
    seo: product.seo,
    checkoutMode: 'quote-only',
    configuratorEnabled: false,
    madeToOrder: true,
    leadTime: 'Made to order. Final pricing and production timeline are confirmed after consultation.',
    inStock: true,
  }
})

console.log(JSON.stringify({
  mode: execute ? 'execute' : 'dry-run',
  sourceProducts: products.map(({ _id, title, slug, category }) => ({
    _id,
    title,
    slug: slug.current,
    category,
  })),
  targetShopItems: migratedDocuments.map(({ _id, title, slug, category, checkoutMode }) => ({
    _id,
    title,
    slug: slug.current,
    category,
    checkoutMode,
  })),
  existingSafeCollisions: collisions,
}, null, 2))

if (!execute) {
  console.log('\nDry run complete. Re-run with --execute to migrate, verify, and delete legacy Products.')
  process.exit(0)
}

let transaction = client.transaction()
migratedDocuments.forEach((document) => {
  transaction = transaction.createOrReplace(document)
})
transaction = transaction
  .patch('shopItem.custom-pet-shapes', { set: { category: 'custom-solutions' } })
  .patch('shopItem.custom-printed-panels', { set: { category: 'custom-solutions' } })
  .patch('shopItem.fabric-wall', { set: { category: 'custom-solutions' } })
await transaction.commit()

const migrated = await client.fetch(
  `*[_type == "shopItem" && _id in $ids] {
    _id, title, slug, category, mainImage, gallery, shortDescription, features, body,
    specifications, acousticalSpecs, installation, seo, checkoutMode, configuratorEnabled, price
  }`,
  { ids: migratedDocuments.map((document) => document._id) }
)

const migratedById = new Map(migrated.map((document) => [document._id, document]))
const verificationErrors = []

for (const source of products) {
  const targetId = `shopItem.migrated.${source.slug.current}`
  const target = migratedById.get(targetId)
  if (!target) {
    verificationErrors.push(`${source.title}: migrated Shop Item missing`)
    continue
  }

  const checks = {
    title: target.title === source.title,
    slug: target.slug?.current === source.slug.current,
    category: target.category === (categoryOverrides[source.slug.current] || categoryMap[source.category]),
    mainImage: JSON.stringify(target.mainImage ?? null) === JSON.stringify(source.mainImage ?? null),
    gallery: JSON.stringify(target.gallery ?? null) === JSON.stringify(source.gallery ?? null),
    description: target.shortDescription === source.description,
    features: JSON.stringify(target.features ?? null) === JSON.stringify(source.features ?? null),
    body: JSON.stringify(target.body ?? null) === JSON.stringify(source.body ?? null),
    specifications: JSON.stringify(target.specifications ?? null) === JSON.stringify(source.specifications ?? null),
    acousticalSpecs: JSON.stringify(target.acousticalSpecs ?? null) === JSON.stringify(source.acousticalSpecs ?? null),
    installation: JSON.stringify(target.installation ?? null) === JSON.stringify(source.installation ?? null),
    seo: JSON.stringify(target.seo ?? null) === JSON.stringify(source.seo ?? null),
    quoteOnly: target.checkoutMode === 'quote-only' && target.configuratorEnabled === false && target.price == null,
  }

  Object.entries(checks).forEach(([field, passed]) => {
    if (!passed) verificationErrors.push(`${source.title}: ${field} verification failed`)
  })
}

const publishedShopItemCount = await client.fetch(
  `count(*[_type == "shopItem" && !(_id in path("drafts.**"))])`
)

if (verificationErrors.length > 0 || publishedShopItemCount !== expectedFinalShopItemCount) {
  throw new Error(
    `Migration verification failed.\nPublished Shop Items: ${publishedShopItemCount}\n${verificationErrors.join('\n')}`
  )
}

let deleteTransaction = client.transaction()
products.forEach((product) => {
  deleteTransaction = deleteTransaction.delete(product._id)
  deleteTransaction = deleteTransaction.delete(`drafts.${product._id}`)
})
await deleteTransaction.commit()

const finalCounts = await client.fetch(`{
  "products": count(*[_type == "product"]),
  "shopItems": count(*[_type == "shopItem" && !(_id in path("drafts.**"))]),
  "quoteOnly": count(*[_type == "shopItem" && checkoutMode == "quote-only" && configuratorEnabled == false])
}`)

if (
  finalCounts.products !== 0 ||
  finalCounts.shopItems !== expectedFinalShopItemCount ||
  finalCounts.quoteOnly !== 7
) {
  throw new Error(`Final count validation failed: ${JSON.stringify(finalCounts)}`)
}

console.log(`\nMigration complete: ${finalCounts.shopItems} Shop Items, ${finalCounts.quoteOnly} quote-only, ${finalCounts.products} Products.`)
