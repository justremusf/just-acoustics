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

const standardColours = [
  { id: 'ivory', name: 'Ivory', hex: '#ede8dc', priceAdjustment: 0, available: true },
  { id: 'warm-grey', name: 'Warm Grey', hex: '#9c9a92', priceAdjustment: 0, available: true },
  { id: 'charcoal', name: 'Charcoal', hex: '#242424', priceAdjustment: 0, available: true },
  { id: 'forest', name: 'Forest', hex: '#2e4a3d', priceAdjustment: 0, available: true },
  { id: 'terracotta', name: 'Terracotta', hex: '#a75d45', priceAdjustment: 0, available: true },
  { id: 'navy', name: 'Navy', hex: '#25384f', priceAdjustment: 0, available: true },
  { id: 'sand', name: 'Sand', hex: '#d7c6aa', priceAdjustment: 0, available: true },
  { id: 'stone', name: 'Stone', hex: '#bfbab2', priceAdjustment: 0, available: true },
  { id: 'slate', name: 'Slate', hex: '#6c7075', priceAdjustment: 0, available: true },
  { id: 'black', name: 'Black', hex: '#111111', priceAdjustment: 0, available: true },
  { id: 'olive', name: 'Olive', hex: '#7d8451', priceAdjustment: 0, available: true },
  { id: 'ocean', name: 'Ocean', hex: '#4d7f9c', priceAdjustment: 0, available: true },
]

const installOptions = [
  {
    id: 'self-install',
    label: 'Self-install',
    description: 'Panels are supplied for your own installation.',
    priceType: 'none',
    price: 0,
    available: true,
  },
  {
    id: 'professional-install',
    label: 'Professional installation',
    description: 'Just Acoustics installs the panels. Final access requirements are reviewed before payment.',
    priceType: 'perUnit',
    price: 45,
    available: true,
  },
]

const thickness25And50 = [
  { id: '25mm', label: '2.5 cm', millimeters: 25, nrc: 'NRC 0.80', priceAdjustment: 0, available: true },
  { id: '50mm', label: '5 cm', millimeters: 50, nrc: 'NRC 1.00', priceAdjustment: 35, available: true },
]

const packageOptions = [
  {
    id: 'starter',
    name: 'Starter',
    panelCount: 6,
    description: 'A focused first-reflection package for small studio rooms.',
    bestFor: 'Small HDB or bedroom studios',
    discountPercent: 5,
    available: true,
  },
  {
    id: 'impact',
    name: 'Impact',
    panelCount: 8,
    description: 'A stronger setup for mixing rooms needing more coverage.',
    bestFor: 'Condo and dedicated mix rooms',
    discountPercent: 8,
    available: true,
  },
  {
    id: 'complete',
    name: 'Complete',
    panelCount: 10,
    description: 'A wider treatment package for rooms that need front, side, rear, and ceiling coverage.',
    bestFor: 'Serious production and recording rooms',
    discountPercent: 12,
    available: true,
  },
]

const baseFields = {
  checkoutMode: 'configurable-quote',
  configuratorEnabled: true,
  madeToOrder: true,
  minQuantity: 1,
  defaultQuantity: 1,
  allowCustomPrint: true,
  customPrintLabel: 'Custom printed fabric',
  customPrintPrice: 40,
  customPrintRequiresReview: true,
  paymentReadinessNote: 'Quote first. PayNow checkout/payment link can be sent after confirmation.',
  colourOptions: standardColours,
  installationOptions: installOptions,
}

const shopItems = [
  {
    _id: 'shopItem.square-studio-panel',
    title: 'Square Studio Acoustic Panel',
    slug: 'square-studio-acoustic-panel',
    category: 'standard-panels',
    productLine: 'square-panel',
    price: 95,
    leadTime: 'Made to order. Typical production lead time is 5-10 business days after quote confirmation.',
    shortDescription: 'A compact square acoustic panel for reflection points, vocal corners, and small studio rooms.',
    features: ['Colour selectable', '25mm or 50mm thickness', 'Custom print available', 'Installation optional'],
    sizeOptions: [
      { id: '600x600', label: '600mm x 600mm', widthMm: 600, heightMm: 600, description: 'Compact square panel', priceAdjustment: 0, available: true },
    ],
    thicknessOptions: thickness25And50,
    packageOptions,
    ...baseFields,
  },
  {
    _id: 'shopItem.large-studio-panel',
    title: '1200mm x 600mm Studio Acoustic Panel',
    slug: '1200x600-studio-acoustic-panel',
    category: 'standard-panels',
    productLine: 'large-panel',
    price: 165,
    leadTime: 'Made to order. Typical production lead time is 5-10 business days after quote confirmation.',
    shortDescription: 'A larger broadband panel for studio side walls, rear walls, and ceiling-cloud layouts.',
    features: ['Studio-friendly size', '25mm or 50mm thickness', 'Custom print available', 'Installation optional'],
    sizeOptions: [
      { id: '1200x600', label: '1200mm x 600mm', widthMm: 1200, heightMm: 600, description: 'Best for larger treatment coverage', priceAdjustment: 0, available: true },
    ],
    thicknessOptions: thickness25And50,
    packageOptions,
    ...baseFields,
  },
  {
    _id: 'shopItem.bass-trap-150mm',
    title: '150mm Studio Bass Trap',
    slug: '150mm-studio-bass-trap',
    category: 'standard-panels',
    productLine: 'bass-trap',
    price: 240,
    leadTime: 'Made to order. Final corner placement and installation method are reviewed before payment.',
    shortDescription: 'A deeper bass trap for low-frequency buildup in corners and critical studio positions.',
    features: ['150mm deep', 'Low-frequency control', 'Colour selectable', 'Installation optional'],
    sizeOptions: [
      { id: '1200x600', label: '1200mm x 600mm', widthMm: 1200, heightMm: 600, description: 'Studio bass trap format', priceAdjustment: 0, available: true },
    ],
    thicknessOptions: [
      { id: '150mm', label: '150mm', millimeters: 150, nrc: 'Deep bass-control profile', priceAdjustment: 0, available: true },
    ],
    packageOptions,
    ...baseFields,
    allowCustomPrint: false,
  },
  {
    _id: 'shopItem.custom-printed-panels',
    title: 'Custom Printed Acoustic Panels',
    slug: 'custom-printed-acoustic-panels',
    category: 'custom-solutions',
    productLine: 'custom-print-panels',
    price: 145,
    leadTime: 'Custom prints are reviewed for artwork quality before production. Final proof is confirmed before payment.',
    shortDescription: 'Printed acoustic panels for artwork, logos, brand walls, and studio feature panels.',
    features: ['Artwork review', 'Colour and print proofing', '25mm or 50mm thickness', 'Installation optional'],
    sizeOptions: [
      { id: '600x600', label: '600mm x 600mm', widthMm: 600, heightMm: 600, description: 'Compact printed panel', priceAdjustment: 0, available: true },
      { id: '1200x600', label: '1200mm x 600mm', widthMm: 1200, heightMm: 600, description: 'Larger printed panel', priceAdjustment: 85, available: true },
    ],
    thicknessOptions: thickness25And50,
    packageOptions,
    ...baseFields,
    customPrintPrice: 0,
    customPrintRequiresReview: true,
  },
  {
    _id: 'shopItem.custom-pet-shapes',
    title: 'Custom PET Shapes and Sizes',
    slug: 'custom-pet-shapes-and-sizes',
    category: 'custom-solutions',
    productLine: 'custom-pet',
    price: 180,
    leadTime: 'Custom PET work is reviewed before production. Final pricing depends on shape, size, and quantity.',
    shortDescription: 'Custom PET acoustic panels for shaped wall layouts, brand colours, and design-led rooms.',
    features: ['Custom shapes', 'Custom sizes', 'Colour selectable', 'Quote reviewed before payment'],
    sizeOptions: [
      { id: 'custom-size', label: 'Custom size', description: 'Enter dimensions in the notes field', priceAdjustment: 0, available: true },
    ],
    thicknessOptions: [
      { id: '12mm-pet', label: '12mm PET', millimeters: 12, nrc: 'Decorative PET acoustic finish', priceAdjustment: 0, available: true },
      { id: '24mm-pet', label: '24mm PET', millimeters: 24, nrc: 'Thicker PET build-up', priceAdjustment: 60, available: true },
    ],
    ...baseFields,
    allowCustomPrint: false,
  },
  {
    _id: 'shopItem.fabric-wall',
    title: 'Acoustic Fabric Wall',
    slug: 'acoustic-fabric-wall-shop',
    category: 'custom-solutions',
    productLine: 'fabric-wall',
    price: 320,
    leadTime: 'Fabric wall work requires measurement review before payment and installation.',
    shortDescription: 'A built-in acoustic fabric wall solution for studios, media rooms, offices, and feature walls.',
    features: ['Built-in finish', 'Large coverage', 'Colour selectable', 'Installation required'],
    sizeOptions: [
      { id: 'per-wall-estimate', label: 'Per wall estimate', description: 'Use quantity for estimated wall sections', priceAdjustment: 0, available: true },
    ],
    thicknessOptions: [
      { id: 'fabric-wall-system', label: 'Fabric wall system', nrc: 'System depth confirmed after recce', priceAdjustment: 0, available: true },
    ],
    ...baseFields,
    allowCustomPrint: false,
    installationOptions: [
      {
        id: 'professional-install',
        label: 'Professional installation',
        description: 'Fabric wall systems require Just Acoustics installation.',
        priceType: 'fixed',
        price: 280,
        available: true,
      },
    ],
  },
]

const existingProductPatches = [
  {
    slug: 'standard-flexi-acoustic-panel',
    fields: {
      productLine: 'large-panel',
      checkoutMode: 'payment-ready',
      configuratorEnabled: true,
      leadTime: 'Made to order. Typical production lead time is 5-10 business days after order confirmation.',
      minQuantity: 1,
      defaultQuantity: 1,
      defaultSizeId: '1200x600',
      defaultThicknessId: '25mm',
      allowCustomPrint: true,
      customPrintLabel: 'Custom printed fabric',
      customPrintPrice: 40,
      customPrintRequiresReview: true,
      paymentReadinessNote: 'PayNow is preferred. Card or wallet payment links can be arranged after order confirmation.',
      shortDescription: 'Best-selling broadband acoustic panels built to reduce echo and improve clarity in any type of space.',
      sizeOptions: [
        { id: '600x600', label: '60 x 60 cm', widthMm: 600, heightMm: 600, description: 'Compact panel size', priceAdjustment: -45, available: true },
        { id: '1200x600', label: '120 x 60 cm', widthMm: 1200, heightMm: 600, description: 'Bestseller', priceAdjustment: 0, available: true },
        { id: '1800x600', label: '180 x 60 cm', widthMm: 1800, heightMm: 600, description: 'Long format panel', priceAdjustment: 60, available: true },
      ],
      thicknessOptions: thickness25And50,
      colourOptions: standardColours,
      installationOptions: [
        installOptions[0],
        installOptions[1],
      ],
      packageOptions,
    },
  },
]

async function seed() {
  console.log('Seeding configurable shop items into Sanity...\n')

  for (const item of shopItems) {
    const doc = {
      ...item,
      _type: 'shopItem',
      slug: { _type: 'slug', current: item.slug },
    }

    try {
      const result = await client.createOrReplace(doc)
      console.log(`✓ Upserted: ${item.title} (${result._id})`)
    } catch (err) {
      console.error(`✗ Failed: ${item.title} —`, err.message)
    }
  }

  console.log('\nPatching existing shop items...\n')

  for (const patch of existingProductPatches) {
    try {
      const existing = await client.fetch('*[_type == "shopItem" && slug.current == $slug][0]{_id,title}', { slug: patch.slug })
      if (!existing?._id) {
        console.log(`- Skipped missing product slug: ${patch.slug}`)
        continue
      }

      await client.patch(existing._id).set(patch.fields).commit()
      console.log(`✓ Patched: ${existing.title} (${patch.slug})`)
    } catch (err) {
      console.error(`✗ Failed patch ${patch.slug} —`, err.message)
    }
  }

  console.log('\nDone. Review and publish these shop items in Sanity Studio.')
}

seed()
