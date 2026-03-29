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

const products = [
  {
    title: 'Acoustic Wall Panels',
    slug: 'acoustic-wall-panels',
    category: 'wall-panels',
    description: 'High-performance acoustic wall panels designed to reduce echo and improve sound clarity in any space. Suitable for offices, restaurants, churches, and homes.',
    features: ['Echo Reduction', 'Voice Clarity', 'Easy Installation', 'Custom Sizes Available'],
  },
  {
    title: 'Acoustic Ceiling Panels',
    slug: 'acoustic-ceiling-panels',
    category: 'ceiling-panels',
    description: 'Suspended ceiling panels that absorb sound from above, perfect for open-plan offices, restaurants, and large commercial spaces.',
    features: ['Ceiling Mounting', 'Noise Reduction', 'Lightweight Design', 'Multiple Finishes'],
  },
  {
    title: 'Acoustic Fabric Wall',
    slug: 'acoustic-fabric-wall',
    category: 'wall-panels',
    description: 'Fabric-wrapped acoustic panels that combine sound absorption with elegant aesthetics. Available in a wide range of colours and fabrics to match your interior.',
    features: ['Fabric Wrapped', 'Aesthetic Design', 'High Absorption', 'Colour Customisable'],
  },
  {
    title: 'Custom Print Panels',
    slug: 'custom-print-acoustic-panels',
    category: 'custom-solutions',
    description: 'Acoustic panels printed with your own artwork, logo, or photography. Combine full acoustic performance with branded or decorative visuals.',
    features: ['Custom Artwork', 'Brand Integration', 'Full Colour Print', 'Acoustic Performance'],
  },
  {
    title: 'Office Soundproofing',
    slug: 'office-soundproofing',
    category: 'soundproofing',
    description: 'Comprehensive soundproofing solutions for offices. Reduce noise transmission between rooms, improve speech privacy, and create a more focused work environment.',
    features: ['Speech Privacy', 'Noise Isolation', 'Partition Solutions', 'Meeting Room Ready'],
  },
  {
    title: 'Polyester Felt Panels',
    slug: 'polyester-felt-panels',
    category: 'wall-panels',
    description: 'Eco-friendly polyester felt acoustic panels made from recycled materials. Lightweight, durable, and available in a wide range of colours for creative installations.',
    features: ['Eco-Friendly', 'Recycled Materials', 'Lightweight', 'Colour Variety'],
  },
  {
    title: 'Custom Acoustic Panel',
    slug: 'custom-acoustic-panels',
    category: 'custom-solutions',
    description: 'Fully bespoke acoustic panels designed and manufactured to your exact specifications. Shape, size, material, and finish — all tailored to your project requirements.',
    features: ['Bespoke Design', 'Any Shape or Size', 'Material Choice', 'Project Consultation'],
  },
]

async function seed() {
  console.log('Seeding products into Sanity...\n')

  for (const product of products) {
    const doc = {
      _type: 'product',
      title: product.title,
      slug: { _type: 'slug', current: product.slug },
      category: product.category,
      description: product.description,
      features: product.features,
    }

    try {
      const result = await client.create(doc)
      console.log(`✓ Created: ${product.title} (${result._id})`)
    } catch (err) {
      console.error(`✗ Failed: ${product.title} —`, err.message)
    }
  }

  console.log('\nDone! All products seeded.')
  console.log('Go to localhost:3001/studio to view and publish them.')
}

seed()
