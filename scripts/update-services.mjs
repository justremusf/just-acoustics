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

const services = [
  {
    title: 'Churches & Event Spaces',
    slug: 'churches-event-spaces',
    shortDescription: 'Crystal-clear speech in every corner. Improve sound clarity in places of worship and event venues.',
    benefits: ['Speech Intelligibility', 'Reduced Echo', 'Immersive Worship'],
    imageUrl: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a459f805f921445e4427e_9.avif',
    filename: 'churches-event-spaces.avif',
    body: [
      {
        _type: 'block', _key: 'w-p1', style: 'normal',
        children: [{ _type: 'span', _key: 'w-p1-s1', text: "Houses of worship and event spaces present some of the most acoustically challenging environments to treat. Large volumes, high ceilings, and hard reflective surfaces create long reverberation tails that make speech hard to follow and music muddy. Whether your congregation numbers 50 or 5,000, clear sound is essential to the worship experience." }],
      },
      {
        _type: 'block', _key: 'w-p2', style: 'normal',
        children: [{ _type: 'span', _key: 'w-p2-s1', text: "Just Acoustics designs tailored acoustic solutions for churches, mosques, temples, and multi-purpose event halls across Singapore. We measure existing reverberation times, model the acoustic targets for your space, and install Class A fire-rated panels that meet Singapore's public assembly building requirements — without compromising the visual character of your venue." }],
      },
    ],
    seo: {
      metaTitle: 'Church & Event Space Acoustics Singapore | Just Acoustics',
      metaDescription: 'Acoustic treatment for churches, mosques, and event spaces in Singapore. Improve speech clarity and sound quality for your congregation.',
    },
  },
  {
    title: 'Offices & Meeting Rooms',
    slug: 'offices-meeting-rooms',
    shortDescription: 'Improve speech privacy, reduce distractions, and create a productive work environment with tailored acoustic solutions.',
    benefits: ['Speech Privacy', 'Focus & Productivity', 'Professional Environment'],
    imageUrl: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6964fb659de42387a7d78754_Image%20from%20TinyPNG%20(4).avif',
    filename: 'offices-meeting-rooms.avif',
    body: [
      {
        _type: 'block', _key: 'o-p1', style: 'normal',
        children: [{ _type: 'span', _key: 'o-p1-s1', text: "Open-plan offices and glass-walled meeting rooms look great but perform poorly acoustically. Conversations carry across the floor, confidential calls are overheard, and the cumulative noise floor drains cognitive energy throughout the day. Poorly treated meeting rooms also make video calls and client presentations harder to follow." }],
      },
      {
        _type: 'block', _key: 'o-p2', style: 'normal',
        children: [{ _type: 'span', _key: 'o-p2-s1', text: "Just Acoustics installs ceiling cloud panels, wall absorbers, acoustic screens, and meeting room treatment tailored to your layout and lease restrictions. All products comply with Singapore workplace standards. We provide a full acoustic report so you have the data to justify the investment and measure the improvement." }],
      },
    ],
    seo: {
      metaTitle: 'Office Acoustic Panels Singapore | Speech Privacy & Noise Reduction',
      metaDescription: 'Acoustic solutions for open-plan offices and meeting rooms in Singapore. Improve speech privacy, reduce noise, and boost team productivity.',
    },
  },
  {
    title: 'Restaurants, Cafes, Bars',
    slug: 'restaurants-cafes-bars',
    shortDescription: 'Create the perfect dining ambience. Reduce noise levels and improve conversation clarity for a comfortable guest experience.',
    benefits: ['Voice Clarity', 'Ambient Noise Control', 'Better Dining Experience'],
    imageUrl: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp',
    filename: 'restaurants-cafes-bars.webp',
    body: [
      {
        _type: 'block', _key: 'r-p1', style: 'normal',
        children: [{ _type: 'span', _key: 'r-p1-s1', text: "Hard floors, glass partitions, and exposed ceilings create a recipe for noise build-up in Singapore's dining venues. Guests raise their voices to be heard, which raises the overall volume further — a cycle that makes even great food feel stressful to enjoy. Online reviews increasingly cite noise as a reason diners do not return." }],
      },
      {
        _type: 'block', _key: 'r-p2', style: 'normal',
        children: [{ _type: 'span', _key: 'r-p2-s1', text: "Just Acoustics designs F&B acoustic solutions that balance lively energy with comfortable conversation levels. Fabric wall panels, suspended ceiling baffles, and banquette-integrated absorbers can be custom printed or colour-matched to your interior design, so the treatment becomes a feature rather than an afterthought." }],
      },
    ],
    seo: {
      metaTitle: 'Restaurant Acoustic Treatment Singapore | Just Acoustics',
      metaDescription: 'Reduce noise in restaurants, cafes, and bars across Singapore. Expert acoustic panel installation to improve the dining experience.',
    },
  },
  {
    title: 'Education Spaces',
    slug: 'education-spaces',
    shortDescription: 'Create quieter, more focused classrooms. Acoustic solutions for schools, tuition centres, and learning environments.',
    benefits: ['Classroom Clarity', 'Reduced Distraction', 'Teacher Comfort'],
    imageUrl: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efb30cf5a46b9a7edd3_4.png',
    filename: 'education-spaces.png',
    body: [
      {
        _type: 'block', _key: 'e-p1', style: 'normal',
        children: [{ _type: 'span', _key: 'e-p1-s1', text: "Classroom acoustics directly affect how well students hear, concentrate, and learn. Excessive reverberation from hard surfaces makes it harder for children to distinguish speech sounds. High noise levels also cause vocal strain for teachers, leading to increased sick days and reduced teaching quality throughout the school year." }],
      },
      {
        _type: 'block', _key: 'e-p2', style: 'normal',
        children: [{ _type: 'span', _key: 'e-p2-s1', text: "Just Acoustics works with international schools, tuition centres, and early childhood education providers across Singapore. All products are non-toxic, low-VOC, and certified for use in educational environments. Our installations meet the recommended reverberation times set out in Singapore school building guidelines." }],
      },
    ],
    seo: {
      metaTitle: 'School Acoustic Treatment Singapore | Classroom Noise Reduction',
      metaDescription: 'Acoustic panels for classrooms and schools in Singapore. Reduce noise, improve speech clarity, and meet educational acoustic standards.',
    },
  },
  {
    title: 'Gym & Leisure Spaces',
    slug: 'gym-leisure-spaces',
    shortDescription: 'Control noise from equipment and group classes. Impact-resistant acoustic treatment for gyms and fitness studios.',
    benefits: ['Noise Reduction', 'Equipment Sound Control', 'Neighbour Compliance'],
    imageUrl: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efbd62acdbb9d45cd3d_5.png',
    filename: 'gym-leisure-spaces.png',
    body: [
      {
        _type: 'block', _key: 'g-p1', style: 'normal',
        children: [{ _type: 'span', _key: 'g-p1-s1', text: "High-energy fitness studios generate substantial noise — thumping music, group class instruction, dropping weights, and cardio equipment all contribute to sound levels that can breach acceptable limits for neighbouring tenants. In Singapore, noise complaints to building management or the NEA can result in fines or restricted operating hours." }],
      },
      {
        _type: 'block', _key: 'g-p2', style: 'normal',
        children: [{ _type: 'span', _key: 'g-p2-s1', text: "Just Acoustics installs impact-resistant, fire-rated acoustic panels suited to the high-humidity environment of gyms and fitness spaces. We treat ceilings, feature walls, and partition areas to reduce the overall noise floor and prevent sound breakout — without killing the energy that motivates your members." }],
      },
    ],
    seo: {
      metaTitle: 'Gym & Fitness Studio Acoustic Treatment Singapore | Just Acoustics',
      metaDescription: 'Reduce noise in gyms and fitness studios in Singapore. Impact-resistant acoustic panels to control sound and prevent neighbour complaints.',
    },
  },
  {
    title: 'Cinema & Music Studios',
    slug: 'cinema-music-studios',
    shortDescription: 'Experience high-quality sound. Eliminate echo for recording studios, home theatres, and cinemas.',
    benefits: ['Professional Sound Quality', 'Full Frequency Control', 'Immersive Experience'],
    imageUrl: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efb255645d4686056e2_7.png',
    filename: 'cinema-music-studios.png',
    body: [
      {
        _type: 'block', _key: 's-p1', style: 'normal',
        children: [{ _type: 'span', _key: 's-p1-s1', text: "A home theatre or recording studio is only as good as the room it sits in. Parallel walls cause flutter echo, room modes create uneven bass response, and early reflections smear the stereo image. Without treatment, even the best equipment cannot perform to its potential — and recordings made in an untreated room will translate poorly on other systems." }],
      },
      {
        _type: 'block', _key: 's-p2', style: 'normal',
        children: [{ _type: 'span', _key: 's-p2-s1', text: "We design bespoke studio and home theatre acoustic packages combining broadband absorption, corner bass traps, and rear-wall diffusion tailored to your room dimensions and use case. Whether you are tracking vocals, mixing music, or building a cinematic listening room, we give you a flat, neutral environment you can trust." }],
      },
    ],
    seo: {
      metaTitle: 'Home Theatre & Recording Studio Acoustics Singapore | Just Acoustics',
      metaDescription: 'Professional acoustic treatment for home theatres and recording studios in Singapore. Custom designed bass traps, diffusers, and absorption panels.',
    },
  },
]

async function run() {
  // Step 1: Delete all existing services
  console.log('Deleting existing services...')
  const existing = await client.fetch(`*[_type == "service"]{ _id, title }`)
  for (const doc of existing) {
    await client.delete(doc._id)
    console.log(`  Deleted: ${doc.title}`)
  }
  console.log(`  Removed ${existing.length} existing service(s)\n`)

  // Step 2: Create new services and upload images
  for (const service of services) {
    console.log(`Creating: ${service.title}`)

    // Upload image
    let mainImage = null
    try {
      console.log(`  Downloading image: ${service.filename}...`)
      const response = await fetch(service.imageUrl)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const buffer = await response.arrayBuffer()
      const asset = await client.assets.upload('image', Buffer.from(buffer), {
        filename: service.filename,
        contentType: response.headers.get('content-type') || 'image/png',
      })
      mainImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: service.title,
      }
      console.log(`  Image uploaded: ${asset._id}`)
    } catch (err) {
      console.warn(`  Image failed (will skip): ${err.message}`)
    }

    // Create document
    const doc = {
      _type: 'service',
      title: service.title,
      slug: { _type: 'slug', current: service.slug },
      shortDescription: service.shortDescription,
      benefits: service.benefits,
      body: service.body,
      seo: service.seo,
      ...(mainImage ? { mainImage } : {}),
    }

    try {
      const result = await client.create(doc)
      console.log(`✓ Created: ${service.title} (${result._id})\n`)
    } catch (err) {
      console.error(`✗ Failed: ${service.title} — ${err.message}\n`)
    }
  }

  console.log('Done! All services updated with images.')
  console.log('Go to /studio → Services to publish them.')
}

run()
