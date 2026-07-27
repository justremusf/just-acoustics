import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const apply = process.argv.includes('--apply')
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const slugs = [
  'flexi-acoustic-panels',
  'soothe-tm-bass-trap-panel',
  'soothe-gobos',
  'flexi-custom-print-panels',
  'forma-pet-panels',
  'flexi-ceiling-mount-kit',
  'flexi-wall-mounting-accessories',
  'soothe-wall-mount-kit',
]

const key = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const typed = (type, values) => values.map((value, index) => ({ _key: `${key(value.id || value.label || String(index))}-${index}`, _type: type, ...value }))

function galleryWithAlt(gallery, title) {
  return (gallery || []).map((image, index) => ({ ...image, alt: image.alt || `${title} gallery image ${index + 1}` }))
}

function specifications(values) {
  return typed('specification', values.map(([label, value]) => ({ id: label, label, value }))).map(({ id, ...spec }) => spec)
}

function acousticRows(values) {
  return typed('acousticalSpecRow', values.map((row) => ({ id: row.thickness, ...row }))).map(({ id, ...row }) => row)
}

const docs = await client.fetch(
  `*[_type == 'shopItem' && !(_id in path('drafts.**')) && slug.current in $slugs]`,
  { slugs },
)
const drafts = await client.fetch(
  `*[_type == 'shopItem' && _id in path('drafts.**') && slug.current in $slugs]`,
  { slugs },
)
const bySlug = new Map(docs.map((doc) => [doc.slug.current, doc]))
const flexi = bySlug.get('flexi-acoustic-panels')

if (!flexi) throw new Error('Flexi Acoustic Panels document is required as the standard configuration source.')

const updates = {
  'flexi-acoustic-panels': {
    productLine: 'flexi-panel',
    category: 'standard-panels',
    'mainImage.alt': flexi.mainImage?.alt || 'Flexi acoustic panel',
    gallery: galleryWithAlt(flexi.gallery, flexi.title),
  },
  'soothe-tm-bass-trap-panel': {
    productLine: 'bass-trap',
    category: 'standard-panels',
    configuratorEnabled: true,
    defaultSizeId: '1200x600',
    defaultThicknessId: '150mm',
    shortDescription: 'Deep porous bass treatment designed to reduce low-frequency buildup, modal ringing, and long decay times in studios and critical listening rooms.',
    leadTime: 'Made to order. Typical production is 3-4 weeks after size, finish, placement, and installation requirements are confirmed.',
    sizeOptions: typed('sizeOption', [
      { id: '1200x600', label: 'Standard', widthMm: 1200, heightMm: 600, description: '120 x 60 cm', priceAdjustment: 0, available: true },
    ]),
    thicknessOptions: typed('thicknessOption', [
      { id: '150mm', label: 'Soothe™ Studio Bass Trap', millimeters: 150, nrc: 'Two-layer rockwool build for practical upper-bass control', description: '15 cm depth', priceAdjustment: 0, available: true },
      { id: '300mm', label: 'Soothe™ Maxx Bass Trap', millimeters: 300, nrc: 'Four-layer rockwool build with an internal air gap for deeper low-frequency control', description: '30 cm depth · Quote required', available: true },
    ]),
    specifications: specifications([
      ['Standard Size', '120 x 60 cm'],
      ['Thickness', '15 cm Studio / 30 cm Maxx'],
      ['Core Material', 'Rockwool acoustic absorption core'],
      ['Studio Construction', 'Two rockwool layers'],
      ['Maxx Construction', 'Four rockwool layers with built-in air gap'],
      ['Primary Use', 'Low-frequency control below 200 Hz, modal decay, corners and critical studio positions'],
      ['Finish', 'Acoustically transparent fabric'],
    ]),
    acousticalSpecs: {
      _type: 'object',
      title: 'Indicative Reference Performance',
      subtitle: 'Comparable construction reference only - not a Just Acoustics laboratory test',
      rows: acousticRows([
        { thickness: 'Studio 150 mm', hz125: '0.42', hz250: '0.79', hz500: '0.92', hz1000: '1.00', hz2000: '1.02', hz4000: '1.00', nrc: 'Indicative' },
        { thickness: 'Maxx 300 mm', hz125: '0.72', hz250: '1.03', hz500: '1.05', hz1000: '1.04', hz2000: '1.02', hz4000: '1.00', nrc: 'Indicative' },
      ]),
    },
  },
  'soothe-gobos': {
    productLine: 'gobo',
    category: 'custom-panels',
    configuratorEnabled: false,
    shortDescription: 'A movable, freestanding acoustic panel for shaping room tone, reducing reflections, and improving separation without permanent wall or ceiling mounting.',
    leadTime: 'Made to order. Typical production is 3-4 weeks after size, depth, finish, stand configuration, and quantity are confirmed.',
    specifications: specifications([
      ['Configuration', 'Custom freestanding acoustic panel with floor support'],
      ['Size', 'Custom to application'],
      ['Thickness', 'Custom to acoustic and portability requirements'],
      ['Primary Use', 'Vocals, drums, amplifiers, temporary reflection control, windows and doors'],
      ['Acoustic Function', 'Reduces reflections, reverberation, and microphone bleed'],
      ['Important', 'Acoustic treatment; not a replacement for construction soundproofing'],
    ]),
  },
  'flexi-custom-print-panels': {
    productLine: 'custom-print-panels',
    category: 'custom-panels',
    configuratorEnabled: true,
    defaultSizeId: '1200x600',
    defaultThicknessId: '25mm',
    shortDescription: 'Custom-printed acoustic panels that combine branded artwork and decorative imagery with practical room absorption.',
    leadTime: 'Made to order. Typical production is 3-4 weeks after artwork proof, size, finish, quantity, and installation details are approved.',
    sizeOptions: flexi.sizeOptions,
    thicknessOptions: flexi.thicknessOptions,
    colourOptions: flexi.colourOptions,
    installationOptions: flexi.installationOptions,
    specifications: specifications([
      ['Standard Sizes', '60 x 60 cm, 120 x 60 cm, and 180 x 60 cm'],
      ['Custom Sizes', 'Available after artwork and production review'],
      ['Thickness', '25 mm or 50 mm'],
      ['Artwork', 'High-resolution PDF or vector artwork preferred'],
      ['Finish', 'Custom-printed synthetic face over acoustic core'],
      ['Care', 'Wipeable and more moisture-resistant than fabric; not waterproof'],
      ['Acoustic Performance', 'Indicatively up to approximately 30% lower than equivalent fabric-wrapped Flexi panels depending on print and finish'],
    ]),
    acousticalSpecs: {
      _type: 'object',
      title: 'Indicative Reference Performance',
      subtitle: 'Approximate comparison to Flexi fabric-wrapped panels',
      rows: acousticRows([
        { thickness: 'Custom Print 25 mm', hz125: '0.06', hz250: '0.06', hz500: '0.13', hz1000: '0.11', hz2000: '0.13', hz4000: '0.67', nrc: 'Indicative' },
        { thickness: 'Custom Print 50 mm', hz125: '0.07', hz250: '0.02', hz500: '0.15', hz1000: '0.22', hz2000: '0.30', hz4000: '0.80', nrc: 'Indicative' },
      ]),
    },
  },
  'forma-pet-panels': {
    productLine: 'pet-panel',
    category: 'custom-panels',
    configuratorEnabled: false,
    defaultThicknessId: '9mm',
    shortDescription: 'Lightweight recycled PET acoustic panels for direct-fix walls, decorative features, pinboard surfaces, and tailored commercial interiors.',
    leadTime: 'Made to order. Typical production is 3-4 weeks after colour, cutting pattern, dimensions, quantity, and installation are confirmed.',
    thicknessOptions: typed('thicknessOption', [
      { id: '9mm', label: '9 mm', millimeters: 9, nrc: 'Comparable direct-mounted PET reference: approximately NRC 0.30', description: 'Slim decorative and direct-fix applications', available: true },
      { id: '12mm', label: '12 mm', millimeters: 12, nrc: 'Comparable direct-mounted PET reference: approximately NRC 0.45', description: 'Stronger absorption and a more substantial profile', available: true },
    ]),
    specifications: specifications([
      ['Material', 'Compressed recycled PET acoustic felt'],
      ['Thickness', '9 mm or 12 mm'],
      ['Sizes', 'Custom cut to practical project requirements'],
      ['Installation', 'Direct fix with suitable adhesive or mechanical fixing'],
      ['Applications', 'Offices, education, hospitality, meeting rooms, feature walls and pinboard surfaces'],
      ['Acoustic Performance', 'Indicative reference: approximately NRC 0.30 at 9 mm and NRC 0.45 for comparable 12 mm material'],
    ]),
    acousticalSpecs: {
      _type: 'object',
      title: 'Indicative Reference Performance',
      subtitle: 'Comparable direct-mounted PET products - not a Forma laboratory test',
      rows: acousticRows([
        { thickness: '9 mm PET', hz125: '0.03', hz250: '0.08', hz500: '0.22', hz1000: '0.40', hz2000: '0.56', hz4000: '0.74', nrc: '≈ 0.30' },
        { thickness: '12 mm PET', hz125: '0.06', hz250: '0.10', hz500: '0.28', hz1000: '0.61', hz2000: '0.89', hz4000: '0.95', nrc: '≈ 0.45' },
      ]),
    },
  },
  'flexi-ceiling-mount-kit': { productLine: 'accessory', category: 'accessories' },
  'flexi-wall-mounting-accessories': { productLine: 'accessory', category: 'accessories' },
  'soothe-wall-mount-kit': { productLine: 'accessory', category: 'accessories' },
}

const missing = slugs.filter((slug) => !bySlug.has(slug))
if (missing.length) throw new Error(`Missing shop items: ${missing.join(', ')}`)

const preview = docs.map((doc) => ({
  id: doc._id,
  title: doc.title,
  slug: doc.slug.current,
  price: doc.price,
  productLine: updates[doc.slug.current]?.productLine,
  category: updates[doc.slug.current]?.category,
  galleryCount: doc.gallery?.length || 0,
}))

console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', updates: preview, draftRecords: drafts.length }, null, 2))

if (!apply) {
  console.log('Dry run complete. Re-run with --apply to back up and patch Sanity.')
  process.exit(0)
}

const backupDir = resolve(process.cwd(), 'outputs', 'sanity-backups')
mkdirSync(backupDir, { recursive: true })
const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
const backupPath = resolve(backupDir, `${stamp}-product-pages.json`)
writeFileSync(backupPath, `${JSON.stringify([...docs, ...drafts], null, 2)}\n`)

let transaction = client.transaction()
for (const doc of docs) {
  const update = updates[doc.slug.current]
  const set = { ...update }
  if (doc.mainImage && !doc.mainImage.alt) set['mainImage.alt'] = `${doc.title} product image`
  if (doc.gallery?.length && !set.gallery) set.gallery = galleryWithAlt(doc.gallery, doc.title)
  transaction = transaction.patch(doc._id, { set })
}
for (const draft of drafts) {
  const update = updates[draft.slug.current]
  transaction = transaction.patch(draft._id, { set: { productLine: update.productLine } })
}

const result = await transaction.commit()
console.log(JSON.stringify({ applied: result.results.length, backupPath }, null, 2))
