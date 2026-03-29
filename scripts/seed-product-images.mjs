import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const productImages = [
  {
    slug: 'acoustic-wall-panels',
    imageUrl: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efbb798931f99abbc38_1.avif',
    filename: 'acoustic-wall-panels.avif',
  },
  {
    slug: 'acoustic-ceiling-panels',
    imageUrl: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efb0907dcf8dacbcd54_2.png',
    filename: 'acoustic-ceiling-panels.png',
  },
  {
    slug: 'acoustic-fabric-wall',
    imageUrl: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efbd1be500fee866d95_3.png',
    filename: 'acoustic-fabric-wall.png',
  },
  {
    slug: 'custom-print-acoustic-panels',
    imageUrl: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efb30cf5a46b9a7edd3_4.png',
    filename: 'custom-print-panels.png',
  },
  {
    slug: 'office-soundproofing',
    imageUrl: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efbd62acdbb9d45cd3d_5.png',
    filename: 'office-soundproofing.png',
  },
  {
    slug: 'polyester-felt-panels',
    imageUrl: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efb6d770477375c64bd_6.png',
    filename: 'polyester-felt-panels.png',
  },
  {
    slug: 'custom-acoustic-panels',
    imageUrl: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efb255645d4686056e2_7.png',
    filename: 'custom-acoustic-panel.png',
  },
]

async function seedImages() {
  console.log('Uploading product images to Sanity...\n')

  for (const item of productImages) {
    try {
      // Find the product by slug
      const product = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]{ _id, title }`,
        { slug: item.slug }
      )

      if (!product) {
        console.warn(`⚠ Product not found for slug: ${item.slug}`)
        continue
      }

      // Fetch image from CDN
      console.log(`  Downloading: ${item.filename}...`)
      const response = await fetch(item.imageUrl)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const buffer = await response.arrayBuffer()

      // Upload to Sanity asset store
      const asset = await client.assets.upload('image', Buffer.from(buffer), {
        filename: item.filename,
        contentType: response.headers.get('content-type') || 'image/png',
      })

      // Patch the product document with the image
      await client
        .patch(product._id)
        .set({
          mainImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
            alt: product.title,
          },
        })
        .commit()

      console.log(`✓ Image set for: ${product.title}`)
    } catch (err) {
      console.error(`✗ Failed for ${item.slug}:`, err.message)
    }
  }

  console.log('\nDone! All product images uploaded and linked.')
  console.log('Go to localhost:3001/studio → Products to publish them.')
}

seedImages()
