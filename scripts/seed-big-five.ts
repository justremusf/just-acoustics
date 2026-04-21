import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '8h1saua8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const posts = [
  {
    _type: 'post',
    title: 'How Much Do Acoustic Panels Cost in Singapore?',
    slug: { _type: 'slug', current: 'acoustic-panels-cost-singapore' },
    category: 'buying-guides',
    contentType: 'guide',
    excerpt:
      'A practical breakdown of acoustic panel pricing in Singapore — from budget DIY foam to commercial-grade fabric panels — so you know what to expect before getting a quote.',
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: 'block',
        _key: 'intro',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'Acoustic panel pricing in Singapore varies widely depending on material, size, finish, and whether installation is included. This guide covers the main product types and typical price ranges so you can budget accurately before reaching out for a quote.',
          },
        ],
      },
    ],
  },
  {
    _type: 'post',
    title: 'Common Acoustic Treatment Mistakes and How to Avoid Them',
    slug: { _type: 'slug', current: 'acoustic-treatment-mistakes' },
    category: 'echo-control',
    contentType: 'guide',
    excerpt:
      'Most DIY acoustic treatments fail not because of bad products but because of placement errors and coverage gaps. Here are the mistakes we see most often — and how to fix them.',
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: 'block',
        _key: 'intro',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'After treating hundreds of rooms across Singapore, we have seen the same patterns come up again and again. This article covers the most common acoustic treatment mistakes — from placing all panels on one wall to using thin foam on a bass-heavy room — and explains how to avoid them.',
          },
        ],
      },
    ],
  },
  {
    _type: 'post',
    title: 'Foam vs Fabric vs Wood Slat Acoustic Panels: A Real Comparison',
    slug: { _type: 'slug', current: 'foam-vs-fabric-vs-wood-slat-acoustic-panels' },
    category: 'buying-guides',
    contentType: 'comparison',
    excerpt:
      'Foam, fabric-wrapped, and wood slat panels all absorb sound differently. This comparison breaks down performance, aesthetics, cost, and the spaces each type suits best.',
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: 'block',
        _key: 'intro',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'Not all acoustic panels work the same way. Foam panels are lightweight and inexpensive but absorb mainly mid to high frequencies. Fabric-wrapped panels offer better low-mid absorption and visual flexibility. Wood slat panels provide partial absorption with a premium aesthetic. This comparison helps you choose based on your actual acoustic problem, not just appearance.',
          },
        ],
      },
    ],
  },
  {
    _type: 'post',
    title: 'What to Look for When Hiring an Acoustic Treatment Company',
    slug: { _type: 'slug', current: 'hiring-acoustic-treatment-company' },
    category: 'buying-guides',
    contentType: 'guide',
    excerpt:
      'Not every acoustic contractor measures results or understands the link between room use and treatment type. Here is what to ask before you sign anything.',
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: 'block',
        _key: 'intro',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'Hiring an acoustic treatment company is not like hiring a painter. The work requires an understanding of how sound behaves in your specific space, what product types address your problem, and how to verify the result. This guide lists the questions you should ask — and the red flags to watch out for — before committing to any contractor.',
          },
        ],
      },
    ],
  },
  {
    _type: 'post',
    title: 'Best Acoustic Treatment by Space Type: Offices, Restaurants, Churches, Studios',
    slug: { _type: 'slug', current: 'acoustic-treatment-by-space-type' },
    category: 'buying-guides',
    contentType: 'guide',
    excerpt:
      'The right acoustic treatment depends on how a space is used. This guide covers the most common space types in Singapore and the treatment approach that works best for each.',
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: 'block',
        _key: 'intro',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'Each space type has different acoustic priorities. Offices need speech intelligibility and privacy. Restaurants need controlled liveliness without fatigue. Churches need clarity for speech alongside warmth for music. Studios need low reverberation and minimal colouration. This guide breaks down the treatment approach for each, so you start with the right solution rather than the most common one.',
          },
        ],
      },
    ],
  },
]

async function main() {
  console.log('Seeding Big Five articles as drafts…')
  for (const post of posts) {
    const draftId = `drafts.${Math.random().toString(36).slice(2)}`
    const result = await client.create({ ...post, _id: draftId })
    console.log(`Created draft: ${result._id} — "${post.title}"`)
  }
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
