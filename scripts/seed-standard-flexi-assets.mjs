import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const assetRoot = 'public/assets/shop/standard-flexi'

const colours = [
  'White',
  'Egg White 01',
  'Stone Grey 02',
  'Sand 03',
  'Ash 04',
  'Pearl 05',
  'Silver Mist 06',
  'Frost 07',
  'Dove Grey 08',
  'Cement 09',
  'Steel 10',
  'Moss 11',
  'Olive 12',
  'Blush 13',
  'Amber 14',
  'Walnut 15',
  'Terracotta 16',
  'Crimson 17',
  'Magenta 18',
  'Rose 19',
  'Plum 20',
  'Fog 21',
  'Seafoam 22',
  'Sky Blue 23',
  'Charcoal 24',
  'Slate 25',
  'Linen 26',
  'Concrete 27',
  'Ocean Blue 28',
  'Powder Blue 29',
  'Graphite 30',
  'Navy 31',
  'Oat 32',
  'Mocha 33',
  'Bone 34',
  'Anchor Grey 35',
  'Espresso 36',
  'Black',
]

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function contentType(filename) {
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg'
  if (filename.endsWith('.webp')) return 'image/webp'
  if (filename.endsWith('.avif')) return 'image/avif'
  return 'image/png'
}

async function uploadImage(relativePath, filename, alt) {
  const buffer = await readFile(resolve(process.cwd(), relativePath))
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: contentType(filename),
  })

  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt,
  }
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local')
  }

  const product = await client.fetch(
    `*[_type == "shopItem" && slug.current == "standard-flexi-acoustic-panel"][0]{_id,title}`,
  )

  if (!product?._id) throw new Error('standard-flexi-acoustic-panel shop item not found')

  console.log('Uploading Standard Flexi size images...')
  const sizeImages = {
    '600x600': await uploadImage(`${assetRoot}/standard-flexi-600x600.webp`, 'standard-flexi-600x600.webp', 'Standard Flexi 60 x 60cm panel'),
    '1200x600': await uploadImage(`${assetRoot}/standard-flexi-1200x600.webp`, 'standard-flexi-1200x600.webp', 'Standard Flexi 60 x 120cm panel'),
    '1800x600': await uploadImage(`${assetRoot}/standard-flexi-1800x600.webp`, 'standard-flexi-1800x600.webp', 'Standard Flexi 60 x 180cm panel'),
  }

  console.log('Uploading colour chart...')
  const colourChart = await uploadImage(`${assetRoot}/source/colour-swatches.webp`, 'standard-flexi-colour-swatches.webp', 'Standard Flexi colour swatches')

  console.log('Uploading in-use gallery images...')
  const inUseGallery = await Promise.all([
    uploadImage(`${assetRoot}/gallery/flexi-gallery-1.webp`, 'standard-flexi-gallery-1.webp', 'Standard Flexi installed in living room'),
    uploadImage(`${assetRoot}/gallery/flexi-gallery-2.webp`, 'standard-flexi-gallery-2.webp', 'Standard Flexi installed in studio room'),
    uploadImage(`${assetRoot}/gallery/flexi-gallery-3.webp`, 'standard-flexi-gallery-3.webp', 'Standard Flexi installed on walls and ceiling'),
    uploadImage(`${assetRoot}/gallery/flexi-gallery-4.webp`, 'standard-flexi-gallery-4.webp', 'Standard Flexi installed in workspace'),
  ])

  console.log('Uploading 38 extracted swatches...')
  const colourOptions = []
  for (let index = 0; index < colours.length; index += 1) {
    const name = colours[index]
    const id = slugify(name)
    const filename = `${String(index + 1).padStart(2, '0')}-${id}.png`
    const code = name.match(/\d+/)?.[0] || name
    const swatchImage = await uploadImage(`${assetRoot}/swatches/${filename}`, filename, `${name} Flexi panel texture swatch`)
    colourOptions.push({
      _key: id,
      id,
      name,
      description: `Colour code: ${code}`,
      swatchImage,
      priceAdjustment: 0,
      available: true,
    })
  }

  await client.patch(product._id).set({
    mainImage: sizeImages['1200x600'],
    gallery: [
      { ...sizeImages['1200x600'], _key: 'standard-flexi-1200x600' },
      { ...sizeImages['600x600'], _key: 'standard-flexi-600x600' },
      { ...sizeImages['1800x600'], _key: 'standard-flexi-1800x600' },
      { ...colourChart, _key: 'standard-flexi-colour-chart' },
      ...inUseGallery.map((image, index) => ({ ...image, _key: `standard-flexi-in-use-${index + 1}` })),
    ],
    defaultSizeId: '1200x600',
    defaultThicknessId: '25mm',
    price: 120,
    sizeOptions: [
      { _key: '600x600', id: '600x600', label: 'Square', widthMm: 600, heightMm: 600, description: '60 x 60cm', previewImage: sizeImages['600x600'], priceAdjustment: -45, available: true },
      { _key: '1200x600', id: '1200x600', label: 'Standard', widthMm: 1200, heightMm: 600, description: '60 x 120cm', previewImage: sizeImages['1200x600'], priceAdjustment: 0, available: true },
      { _key: '1800x600', id: '1800x600', label: 'Tall', widthMm: 1800, heightMm: 600, description: '60 x 180cm', previewImage: sizeImages['1800x600'], priceAdjustment: 60, available: true },
    ],
    colourOptions,
  }).commit()

  console.log(`Patched ${product.title} with size previews, gallery, and ${colourOptions.length} colour swatches.`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
