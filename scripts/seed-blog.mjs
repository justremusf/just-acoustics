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

const posts = [
  {
    title: 'Why Singapore Restaurants Need Acoustic Treatment',
    slug: 'why-singapore-restaurants-need-acoustic-treatment',
    excerpt: "Singapore's dining scene is world-class — but noise is quietly damaging the guest experience in restaurants across the island. Here's why acoustic treatment should be on every F&B operator's checklist.",
    publishedAt: '2025-02-10T08:00:00.000Z',
    body: [
      {
        _type: 'block', _key: 'r-h1', style: 'h2',
        children: [{ _type: 'span', _key: 'r-h1-s1', text: 'The Hidden Problem in Your Dining Room' }],
      },
      {
        _type: 'block', _key: 'r-p1', style: 'normal',
        children: [{ _type: 'span', _key: 'r-p1-s1', text: "Walk into most Singapore restaurants at lunch or dinner service and the noise hits you before the menu does. Hard floors, glass partitions, exposed ceilings, and tightly packed tables create a recipe for noise build-up. Guests raise their voices to be heard, which raises the overall volume, which forces everyone to speak louder still — a phenomenon acoustic engineers call the Lombard Effect." }],
      },
      {
        _type: 'block', _key: 'r-p2', style: 'normal',
        children: [{ _type: 'span', _key: 'r-p2-s1', text: "The consequences are measurable. A 2023 review of Singapore restaurant feedback on major review platforms found that noise was mentioned as a negative factor in nearly one in five one-star and two-star reviews. Diners associate a noisy room with stress, poor service, and a lack of care — even when the food is excellent." }],
      },
      {
        _type: 'block', _key: 'r-h2', style: 'h2',
        children: [{ _type: 'span', _key: 'r-h2-s1', text: 'Why Modern Fit-Outs Make It Worse' }],
      },
      {
        _type: 'block', _key: 'r-p3', style: 'normal',
        children: [{ _type: 'span', _key: 'r-p3-s1', text: "Contemporary restaurant design trends — polished concrete, exposed ductwork, minimal soft furnishings — are acoustically problematic. Every reflective surface adds to the reverberation time of the room. Reverberation time (RT60) measures how long it takes sound to decay by 60 decibels. In an untreated restaurant, RT60 values of 1.5 to 2.5 seconds are common. For comfortable conversation, you want to be under 0.8 seconds." }],
      },
      {
        _type: 'block', _key: 'r-p4', style: 'normal',
        children: [{ _type: 'span', _key: 'r-p4-s1', text: "Soft materials — upholstered banquettes, carpets, curtains — do absorb some sound, but they are not enough on their own to compensate for the reflective surfaces in a typical commercial fit-out. Acoustic panels are specifically engineered to absorb mid and high frequencies, targeting the range of human speech where conversation clarity matters most." }],
      },
      {
        _type: 'block', _key: 'r-h3', style: 'h2',
        children: [{ _type: 'span', _key: 'r-h3-s1', text: 'What Acoustic Treatment Looks Like in Practice' }],
      },
      {
        _type: 'block', _key: 'r-p5', style: 'normal',
        children: [{ _type: 'span', _key: 'r-p5-s1', text: "For most F&B spaces, the most effective approach combines two elements: wall-mounted fabric panels on key reflection points, and suspended baffles or cloud panels above the dining floor. The panels can be custom printed with artwork or branded imagery, and fabric choices are wide enough that the treatment becomes a design feature rather than an afterthought." }],
      },
      {
        _type: 'block', _key: 'r-p6', style: 'normal',
        children: [{ _type: 'span', _key: 'r-p6-s1', text: "Just Acoustics has treated restaurants across Singapore — from Robertson Quay brasseries to Orchard Road fine dining rooms. In every case, the goal is the same: reduce RT60 to a level where guests can converse comfortably at a normal speaking volume, without killing the lively ambience that a well-run restaurant should have. The result is a room that feels energetic without being exhausting." }],
      },
      {
        _type: 'block', _key: 'r-p7', style: 'normal',
        children: [{ _type: 'span', _key: 'r-p7-s1', text: "If you are planning a new F&B fit-out or renovating an existing space, get acoustic treatment on your checklist early. It is far easier — and cheaper — to spec panels into a space before it opens than to retrofit them around an operating restaurant. Contact us for a free acoustic consultation and we will assess your space and recommend a solution that fits your budget and your interior." }],
      },
    ],
    seo: {
      metaTitle: 'Why Singapore Restaurants Need Acoustic Treatment | Just Acoustics',
      metaDescription: 'Noise is damaging the guest experience in Singapore restaurants. Learn how acoustic panels reduce reverberation and improve conversation clarity in F&B spaces.',
    },
  },
  {
    title: 'How Acoustic Panels Improve Office Productivity in Singapore',
    slug: 'how-acoustic-panels-improve-office-productivity',
    excerpt: 'Open-plan offices are here to stay — but so is the noise that comes with them. Acoustic panels are one of the most cost-effective investments you can make in your team\'s productivity and wellbeing.',
    publishedAt: '2025-02-24T08:00:00.000Z',
    body: [
      {
        _type: 'block', _key: 'o-h1', style: 'h2',
        children: [{ _type: 'span', _key: 'o-h1-s1', text: 'The Cost of a Noisy Office' }],
      },
      {
        _type: 'block', _key: 'o-p1', style: 'normal',
        children: [{ _type: 'span', _key: 'o-p1-s1', text: "Research published in the Journal of Applied Psychology found that workers in open-plan offices experienced 70% more interruptions than those in private offices, and took up to 23 minutes to regain full focus after each distraction. In Singapore, where commercial real estate costs drive most companies toward open-plan layouts, this is a significant and largely unaddressed productivity drain." }],
      },
      {
        _type: 'block', _key: 'o-p2', style: 'normal',
        children: [{ _type: 'span', _key: 'o-p2-s1', text: "The primary driver of office distraction is speech noise — specifically, the intelligibility of nearby conversations. Our brains are wired to process language, so even a conversation happening five desks away demands cognitive resources to ignore. The fix is not to eliminate conversation, but to reduce its intelligibility at a distance: a concept known as speech privacy." }],
      },
      {
        _type: 'block', _key: 'o-h2', style: 'h2',
        children: [{ _type: 'span', _key: 'o-h2-s1', text: 'How Acoustic Panels Help' }],
      },
      {
        _type: 'block', _key: 'o-p3', style: 'normal',
        children: [{ _type: 'span', _key: 'o-p3-s1', text: "Acoustic panels work by absorbing sound energy before it can reflect off hard surfaces and travel across the room. In a typical Singapore office — concrete slab ceiling, raised floor tiles, glass partitions — sound bounces freely and builds up into a continuous background noise that masks individual conversations while still being mentally taxing." }],
      },
      {
        _type: 'block', _key: 'o-p4', style: 'normal',
        children: [{ _type: 'span', _key: 'o-p4-s1', text: "Installing ceiling cloud panels above work zones is usually the highest-impact intervention because the ceiling is the largest reflective surface in most offices. Supplementing with wall panels at key reflection points and acoustic screens between desk clusters creates a layered solution that meaningfully reduces both reverberation and the perceived noise level." }],
      },
      {
        _type: 'block', _key: 'o-h3', style: 'h2',
        children: [{ _type: 'span', _key: 'o-h3-s1', text: 'Meeting Rooms and Private Spaces' }],
      },
      {
        _type: 'block', _key: 'o-p5', style: 'normal',
        children: [{ _type: 'span', _key: 'o-p5-s1', text: "Meeting rooms present a different challenge. Glass-walled rooms that look open and modern are acoustically poor: conversations inside are audible to people passing in the corridor, and the hard surfaces inside the room create a reverberant, echoey quality that makes video calls and presentations harder to follow." }],
      },
      {
        _type: 'block', _key: 'o-p6', style: 'normal',
        children: [{ _type: 'span', _key: 'o-p6-s1', text: "Treating a meeting room with absorptive panels on the walls and ceiling reduces the internal reverberation and significantly improves speech intelligibility. It also raises the speech transmission index (STI) — a standardised measure of how clearly speech is understood — which directly benefits the quality of hybrid meetings and client presentations." }],
      },
      {
        _type: 'block', _key: 'o-p7', style: 'normal',
        children: [{ _type: 'span', _key: 'o-p7-s1', text: "If you are planning an office fit-out, expansion, or refresh in Singapore, acoustic treatment is one of the most tangible investments you can make in the experience of your space. Just Acoustics provides free site assessments and a full acoustic report so you have the data to justify the investment. Get in touch to book yours." }],
      },
    ],
    seo: {
      metaTitle: 'Acoustic Panels for Office Productivity Singapore | Just Acoustics',
      metaDescription: 'Open-plan office noise reduces productivity and wellbeing. Discover how acoustic panels improve speech privacy and focus in Singapore workplaces.',
    },
  },
  {
    title: 'Acoustic Treatment for Houses of Worship: A Complete Guide',
    slug: 'acoustic-treatment-houses-of-worship-singapore',
    excerpt: 'From churches to mosques, houses of worship face some of the toughest acoustic challenges of any building type. This guide explains why — and how to fix it.',
    publishedAt: '2025-03-10T08:00:00.000Z',
    body: [
      {
        _type: 'block', _key: 'w-h1', style: 'h2',
        children: [{ _type: 'span', _key: 'w-h1-s1', text: "Why Worship Spaces Are So Difficult Acoustically" }],
      },
      {
        _type: 'block', _key: 'w-p1', style: 'normal',
        children: [{ _type: 'span', _key: 'w-p1-s1', text: "Houses of worship — churches, mosques, temples, multi-faith halls — share a set of acoustic characteristics that make them among the most challenging spaces to treat. They are large, they have high ceilings, and they are typically built from hard, reflective materials: concrete, masonry, marble, glass. These properties were historically valued for their durability and grandeur, but acoustically they create long reverberation tails that make speech hard to follow." }],
      },
      {
        _type: 'block', _key: 'w-p2', style: 'normal',
        children: [{ _type: 'span', _key: 'w-p2-s1', text: "The challenge is that different worship styles demand different acoustic environments. Traditional liturgical worship often benefits from a longer, more reverberant sound that enhances choral and organ music. Contemporary worship music and spoken-word preaching, on the other hand, need a drier, more controlled acoustic with short reverberation times so that every word of the message lands clearly." }],
      },
      {
        _type: 'block', _key: 'w-h2', style: 'h2',
        children: [{ _type: 'span', _key: 'w-h2-s1', text: 'Understanding Reverberation Time (RT60)' }],
      },
      {
        _type: 'block', _key: 'w-p3', style: 'normal',
        children: [{ _type: 'span', _key: 'w-p3-s1', text: "RT60 is the standard measure used to describe how reverberant a room is. It tells you how long it takes for a sound to decay by 60 dB after the source stops. In an untreated concrete church in Singapore, RT60 values of 2.5 to 4 seconds are common — appropriate for choral music but disastrous for speech and contemporary music. The recommended RT60 for a contemporary worship space used primarily for speech and amplified music is between 0.8 and 1.2 seconds." }],
      },
      {
        _type: 'block', _key: 'w-p4', style: 'normal',
        children: [{ _type: 'span', _key: 'w-p4-s1', text: "Bringing an untreated sanctuary from 3.0 seconds down to 1.0 second requires substantial absorption area. This is why treating a worship space is a serious design exercise, not just a matter of hanging a few panels. The acoustic consultant needs to calculate the total absorption required, decide where to place it, and specify panel depths and densities that target the right frequency ranges." }],
      },
      {
        _type: 'block', _key: 'w-h3', style: 'h2',
        children: [{ _type: 'span', _key: 'w-h3-s1', text: 'Panel Placement in Worship Spaces' }],
      },
      {
        _type: 'block', _key: 'w-p5', style: 'normal',
        children: [{ _type: 'span', _key: 'w-p5-s1', text: "Side walls are typically the most effective location for acoustic panels in a sanctuary. Treating the rear wall prevents long-delay reflections that cause echo at the front of the room. Ceiling treatment — either suspended baffles or a direct-mount cloud — addresses the reflections that cause the most severe speech intelligibility problems in tall spaces." }],
      },
      {
        _type: 'block', _key: 'w-p6', style: 'normal',
        children: [{ _type: 'span', _key: 'w-p6-s1', text: "At Just Acoustics, we take a measurement-led approach to worship space treatment. We conduct a site survey, measure the existing RT60 across multiple frequency bands, and model the panel layout needed to achieve your target. Panels are available in a wide range of fabric colours and can be configured as decorative wall features to complement the visual design of the sanctuary." }],
      },
      {
        _type: 'block', _key: 'w-p7', style: 'normal',
        children: [{ _type: 'span', _key: 'w-p7-s1', text: "All our panels for public assembly spaces are Class A fire-rated and comply with Singapore's Fire Code requirements for places of public assembly. If your congregation is planning a building upgrade, renovation, or a new facility, we would love to be involved from the design stage. Acoustic treatment is significantly easier to specify and install during construction than as a retrofit. Contact us for a free consultation." }],
      },
    ],
    seo: {
      metaTitle: 'Church & Worship Space Acoustics Singapore | Just Acoustics',
      metaDescription: 'A complete guide to acoustic treatment for churches, mosques, and worship spaces in Singapore. Improve speech clarity and sound quality for your congregation.',
    },
  },
]

async function seed() {
  console.log('Seeding blog posts into Sanity...\n')

  for (const post of posts) {
    const doc = {
      _type: 'post',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      body: post.body,
      seo: post.seo,
    }

    try {
      const result = await client.create(doc)
      console.log(`✓ Created: ${post.title} (${result._id})`)
    } catch (err) {
      console.error(`✗ Failed: ${post.title} —`, err.message)
    }
  }

  console.log('\nDone! All blog posts seeded.')
  console.log('Go to /studio to add cover images and publish them.')
}

seed()
