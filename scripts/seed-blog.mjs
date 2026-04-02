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

const h2 = (key, text) => ({
  _type: 'block',
  _key: key,
  style: 'h2',
  children: [{ _type: 'span', _key: `${key}-span`, text }],
})

const p = (key, text) => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  children: [{ _type: 'span', _key: `${key}-span`, text }],
})

const publishedPosts = [
  {
    title: 'Why Singapore Restaurants Need Acoustic Treatment',
    slug: 'why-singapore-restaurants-need-acoustic-treatment',
    category: 'restaurant-noise',
    excerpt:
      "Singapore's dining scene is strong, but noise still quietly damages the guest experience. This guide covers why restaurant acoustics matter and what treatment usually works best.",
    publishedAt: '2025-02-10T08:00:00.000Z',
    body: [
      h2('r-1', 'Why restaurant noise becomes exhausting'),
      p('r-2', 'Hard finishes, exposed ceilings, and tightly packed seating cause speech reflections to build up quickly. Guests then raise their voices, which pushes the room even louder.'),
      p('r-3', 'That is why many restaurants feel energetic at first but tiring after twenty minutes. The issue is not only volume. It is the lack of speech clarity and the constant need to work harder to listen.'),
      h2('r-4', 'What treatment usually changes the experience'),
      p('r-5', 'The most effective restaurant treatment normally combines absorptive ceiling coverage with targeted wall treatment at the strongest reflection points.'),
      p('r-6', 'The goal is not to kill ambience. It is to make conversation easier at a normal speaking level while keeping the room lively.'),
      p('r-7', 'When acoustic treatment is planned early, it becomes part of the finish rather than an afterthought.'),
    ],
    seo: {
      metaTitle: 'Why Singapore Restaurants Need Acoustic Treatment | Just Acoustics',
      metaDescription:
        'Learn why restaurant acoustics matter in Singapore and how the right treatment improves conversation without flattening the atmosphere.',
    },
  },
  {
    title: 'How Acoustic Panels Improve Office Productivity in Singapore',
    slug: 'how-acoustic-panels-improve-office-productivity',
    category: 'office-acoustics',
    excerpt:
      'Open-plan offices increase distraction, fatigue, and speech spill. This article explains where acoustic panels help most and how to think about office treatment properly.',
    publishedAt: '2025-02-24T08:00:00.000Z',
    body: [
      h2('o-1', 'The office problem is usually speech, not just volume'),
      p('o-2', 'In most offices, the main issue is not that the room is loud in a dramatic way. It is that nearby speech stays intelligible across too much distance, so focus keeps breaking.'),
      p('o-3', 'Meeting rooms create a second problem: hard surfaces smear speech and make calls, presentations, and discussions harder to follow.'),
      h2('o-4', 'Where treatment makes the biggest difference'),
      p('o-5', 'Ceiling treatment above work zones often produces the largest gain because the ceiling is the biggest reflective surface in the room.'),
      p('o-6', 'Wall panels, partitions, and targeted treatment inside meeting rooms then help reduce spill, sharpen clarity, and lower fatigue through the day.'),
      p('o-7', 'The best office treatment plan matches the way teams work instead of applying one panel type everywhere.'),
    ],
    seo: {
      metaTitle: 'Acoustic Panels for Office Productivity Singapore | Just Acoustics',
      metaDescription:
        'See how acoustic panels improve focus, privacy, and meeting-room clarity in Singapore offices.',
    },
  },
  {
    title: 'Acoustic Treatment for Houses of Worship: A Complete Guide',
    slug: 'acoustic-treatment-houses-of-worship-singapore',
    category: 'worship-spaces',
    excerpt:
      'Worship spaces often have high ceilings and long reverberation tails. This guide explains what usually causes poor speech clarity and how treatment should be approached.',
    publishedAt: '2025-03-10T08:00:00.000Z',
    body: [
      h2('w-1', 'Why worship spaces are acoustically difficult'),
      p('w-2', 'Large volumes, reflective finishes, and long throw distances make worship spaces some of the hardest rooms to control.'),
      p('w-3', 'That becomes a speech problem first. Sermons, announcements, and teaching lose clarity when reverberation stays too long in the room.'),
      h2('w-4', 'How treatment should be planned'),
      p('w-5', 'The treatment strategy usually needs a combination of wall and ceiling coverage placed where the strongest reflections occur.'),
      p('w-6', 'The target is not the same for every worship style. Some rooms need more control for spoken-word clarity, while others balance that against music and congregational response.'),
      p('w-7', 'A proper site review helps define the right reverberation goal before panel quantities and locations are decided.'),
    ],
    seo: {
      metaTitle: 'Church & Worship Space Acoustics Singapore | Just Acoustics',
      metaDescription:
        'A practical guide to treating worship spaces in Singapore for better speech intelligibility and controlled reverberation.',
    },
  },
]

const draftPosts = [
  {
    title: 'How to Reduce Echo in Glass-Walled Meeting Rooms',
    slug: 'how-to-reduce-echo-in-glass-walled-meeting-rooms',
    category: 'echo-control',
    excerpt:
      'Glass-heavy rooms look clean but often sound sharp and smeared. This draft breaks down the fastest ways to improve clarity without redesigning the whole room.',
    publishedAt: '2025-04-08T08:00:00.000Z',
    body: [
      h2('d1-1', 'Why glass meeting rooms sound worse than they look'),
      p('d1-2', 'Glass reflects speech aggressively, which raises reverberation and reduces clarity during calls, presentations, and group discussion.'),
      h2('d1-3', 'What to treat first'),
      p('d1-4', 'Ceiling treatment, back-wall treatment, and selected absorptive surfaces usually create the biggest immediate change.'),
    ],
    seo: {
      metaTitle: 'How to Reduce Echo in Glass-Walled Meeting Rooms | Just Acoustics',
      metaDescription:
        'A draft guide to improving speech clarity in glass-heavy meeting rooms.',
    },
  },
  {
    title: 'What Acoustic Panels Actually Do Before You Buy Them',
    slug: 'what-acoustic-panels-actually-do-before-you-buy-them',
    category: 'buying-guides',
    excerpt:
      'A plain-language draft explaining what acoustic panels solve, what they do not solve, and how to choose the right treatment with fewer wrong assumptions.',
    publishedAt: '2025-04-15T08:00:00.000Z',
    body: [
      h2('d2-1', 'Absorption is not the same as soundproofing'),
      p('d2-2', 'Panels improve the way the room sounds inside the space. They do not automatically stop sound transfer between rooms.'),
      h2('d2-3', 'What a good buying decision looks like'),
      p('d2-4', 'The best choice depends on the room problem, the layout, the target finish, and how much coverage is actually needed.'),
    ],
    seo: {
      metaTitle: 'What Acoustic Panels Actually Do Before You Buy Them | Just Acoustics',
      metaDescription:
        'A draft buying guide on what acoustic panels solve and how to choose them more intelligently.',
    },
  },
  {
    title: 'How Much Acoustic Treatment Does a Restaurant Usually Need?',
    slug: 'how-much-acoustic-treatment-does-a-restaurant-usually-need',
    category: 'restaurant-noise',
    excerpt:
      'A draft framework for estimating coverage in dining spaces without guessing too high or too low.',
    publishedAt: '2025-04-22T08:00:00.000Z',
    body: [
      h2('d3-1', 'There is no single percentage that fits every dining room'),
      p('d3-2', 'Coverage depends on volume, finishes, ceiling height, seating density, and how lively the venue should feel when full.'),
      h2('d3-3', 'Why over-treating can be the wrong move'),
      p('d3-4', 'The goal is comfortable conversation, not a dead room. Good treatment reduces fatigue without stripping away energy.'),
    ],
    seo: {
      metaTitle: 'How Much Acoustic Treatment Does a Restaurant Usually Need? | Just Acoustics',
      metaDescription:
        'A draft article on how to think about restaurant acoustic coverage more realistically.',
    },
  },
  {
    title: 'What to Prepare Before an Acoustic Site Visit',
    slug: 'what-to-prepare-before-an-acoustic-site-visit',
    category: 'project-lessons',
    excerpt:
      'A draft checklist covering the photos, layouts, goals, and pain points that make a site visit faster and more useful.',
    publishedAt: '2025-04-29T08:00:00.000Z',
    body: [
      h2('d4-1', 'What helps a consultation move faster'),
      p('d4-2', 'Good room photos, approximate dimensions, and a short explanation of what sounds wrong usually create the clearest starting point.'),
      h2('d4-3', 'What outcome matters most'),
      p('d4-4', 'The more specific the goal is, the easier it is to recommend the right treatment with confidence.'),
    ],
    seo: {
      metaTitle: 'What to Prepare Before an Acoustic Site Visit | Just Acoustics',
      metaDescription:
        'A draft checklist for preparing photos, goals, and layout details before an acoustic consultation.',
    },
  },
]

async function upsertPublishedPost(post) {
  const existing = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{_id}`,
    { slug: post.slug }
  )

  const doc = {
    _type: 'post',
    title: post.title,
    slug: { _type: 'slug', current: post.slug },
    category: post.category,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    body: post.body,
    seo: post.seo,
  }

  if (existing?._id) {
    await client.patch(existing._id).set(doc).commit()
    return { action: 'updated', title: post.title }
  }

  await client.create(doc)
  return { action: 'created', title: post.title }
}

async function upsertDraftPost(post) {
  const draftId = `drafts.post-${post.slug}`

  await client.createOrReplace({
    _id: draftId,
    _type: 'post',
    title: post.title,
    slug: { _type: 'slug', current: post.slug },
    category: post.category,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    body: post.body,
    seo: post.seo,
  })

  return { action: 'drafted', title: post.title }
}

async function seed() {
  console.log('Syncing published resource-center posts...\n')

  for (const post of publishedPosts) {
    const result = await upsertPublishedPost(post)
    console.log(`✓ ${result.action}: ${result.title}`)
  }

  console.log('\nCreating draft resource-center posts...\n')

  for (const post of draftPosts) {
    const result = await upsertDraftPost(post)
    console.log(`✓ ${result.action}: ${result.title}`)
  }

  console.log('\nDone.')
  console.log('Published posts were updated in place.')
  console.log('Additional resource-center articles were added as Sanity drafts for later editing and publishing.')
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
