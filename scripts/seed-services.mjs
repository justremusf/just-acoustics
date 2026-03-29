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
    title: 'Restaurant & F&B',
    slug: 'restaurants',
    shortDescription: 'Reduce noise levels and improve conversation clarity in restaurants, cafes, and bars. Create an ambience your guests will come back for.',
    benefits: ['Voice Clarity', 'Ambient Noise Control', 'Better Dining Experience'],
    body: [
      {
        _type: 'block',
        _key: 'restaurants-p1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'restaurants-p1-s1',
            text: 'In Singapore\'s competitive dining scene, acoustics are one of the most overlooked factors affecting guest satisfaction. Hard surfaces — tiled floors, glass partitions, concrete ceilings — cause sound to bounce and build up, forcing guests to raise their voices and creating a stressful dining experience. Online reviews increasingly mention noise as a reason diners do not return.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'restaurants-p2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'restaurants-p2-s1',
            text: 'Just Acoustics designs tailored solutions for F&B spaces — from fabric wall panels that blend with your interior design, to suspended ceiling baffles and banquette-integrated absorbers. We work around your fit-out schedule and existing decor to achieve measurable reductions in reverberation time, helping you hit the sweet spot between lively and comfortable.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'Restaurant Acoustic Treatment Singapore | Just Acoustics',
      metaDescription: 'Reduce noise in restaurants and cafes across Singapore. Expert acoustic panel installation to improve conversation clarity and guest experience.',
    },
  },
  {
    title: 'Office & Corporate',
    slug: 'offices',
    shortDescription: 'Improve speech privacy, reduce distractions, and create a productive work environment with acoustic solutions designed for modern offices.',
    benefits: ['Speech Privacy', 'Focus & Productivity', 'Professional Environment'],
    body: [
      {
        _type: 'block',
        _key: 'offices-p1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'offices-p1-s1',
            text: 'Open-plan offices boost collaboration but create significant acoustic challenges. Conversations from nearby desks become distractions, confidential calls are overheard, and the cumulative noise floor drains cognitive energy throughout the day. Studies consistently show that office noise is one of the top drivers of employee dissatisfaction and reduced output.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'offices-p2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'offices-p2-s1',
            text: 'We offer a range of corporate acoustic solutions — ceiling cloud panels, wall-mounted absorbers, meeting room treatment, and acoustic screens — all compliant with Singapore\'s workplace standards. Whether you are fitting out a new office or treating an existing space, we provide a site assessment and acoustic report so you know exactly what to expect before installation begins.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'Office Acoustic Panels Singapore | Speech Privacy & Noise Reduction',
      metaDescription: 'Acoustic solutions for open-plan offices and corporate spaces in Singapore. Improve speech privacy, reduce noise, and boost team productivity.',
    },
  },
  {
    title: 'Houses of Worship',
    slug: 'worship',
    shortDescription: 'Enhance speech intelligibility and music clarity in churches, mosques, temples, and multi-purpose worship spaces.',
    benefits: ['Speech Intelligibility', 'Reduced Echo', 'Immersive Worship'],
    body: [
      {
        _type: 'block',
        _key: 'worship-p1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'worship-p1-s1',
            text: 'Houses of worship are among the most acoustically challenging spaces to treat. Large volumes, hard reflective surfaces, and congregations that range from intimate gatherings to hundreds of people create wide swings in acoustic behaviour. Poor treatment leads to muddy sound, unclear preaching, and a worship experience that feels disconnected.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'worship-p2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'worship-p2-s1',
            text: 'Just Acoustics has worked with churches, mosques, and multi-faith centres across Singapore. We measure existing reverberation times, model the acoustic targets for your style of worship, and design panel layouts that meet those targets without compromising the visual character of the space. Our fire-rated, Class A panels are fully compliant for public assembly buildings.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'Church Acoustics Singapore | Worship Space Acoustic Treatment',
      metaDescription: 'Acoustic treatment for churches, mosques, and worship spaces in Singapore. Improve speech clarity and sound quality for your congregation.',
    },
  },
  {
    title: 'Schools & Education',
    slug: 'schools',
    shortDescription: 'Create quieter, more focused classrooms and learning environments that meet Singapore school acoustic standards.',
    benefits: ['Classroom Clarity', 'Reduced Distraction', 'Better Learning Outcomes'],
    body: [
      {
        _type: 'block',
        _key: 'schools-p1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'schools-p1-s1',
            text: 'Classroom acoustics directly affect how well students hear, concentrate, and learn. Excessive reverberation from hard surfaces makes it harder for children — especially those with hearing difficulties or learning differences — to distinguish speech sounds. High noise levels also cause vocal strain for teachers, leading to increased sick days and reduced teaching quality.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'schools-p2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'schools-p2-s1',
            text: 'We work with international schools, tuition centres, and early childhood education providers across Singapore to install acoustic ceiling panels, wall absorbers, and corridor treatment. All products are non-toxic, low-VOC, and hold the relevant certifications for use in educational environments. Our installations meet or exceed the recommended reverberation times set out in Singapore school building guidelines.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'School Acoustic Treatment Singapore | Classroom Noise Reduction',
      metaDescription: 'Acoustic panels for classrooms and schools in Singapore. Reduce noise, improve speech clarity, and meet educational acoustic standards.',
    },
  },
  {
    title: 'Home Theatres & Studios',
    slug: 'studios',
    shortDescription: 'Build a professional-grade listening room, home theatre, or recording studio with precision acoustic treatment.',
    benefits: ['Professional Sound Quality', 'Full Frequency Control', 'Immersive Experience'],
    body: [
      {
        _type: 'block',
        _key: 'studios-p1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'studios-p1-s1',
            text: 'A home theatre or recording studio is only as good as the room it sits in. Parallel walls cause flutter echo, room modes create uneven bass response, and early reflections smear the stereo image. Without treatment, even the best speakers and equipment cannot perform to their potential — and recordings made in an untreated room will translate poorly on other systems.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'studios-p2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'studios-p2-s1',
            text: 'We design bespoke studio and home theatre acoustic packages that combine broadband absorption, corner bass traps, and rear-wall diffusion tailored to your room dimensions and use case. Whether you are tracking vocals, mixing music, or building a cinematic listening room, we will give you a flat, neutral environment you can trust.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'Home Theatre & Recording Studio Acoustics Singapore | Just Acoustics',
      metaDescription: 'Professional acoustic treatment for home theatres and recording studios in Singapore. Bass traps, diffusers, and absorption panels custom designed for your room.',
    },
  },
  {
    title: 'Gyms & Fitness',
    slug: 'gyms',
    shortDescription: 'Control noise from equipment, music, and group classes in gyms and fitness studios without dampening the energy of the space.',
    benefits: ['Noise Reduction', 'Equipment Sound Control', 'Neighbour Compliance'],
    body: [
      {
        _type: 'block',
        _key: 'gyms-p1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'gyms-p1-s1',
            text: 'High-energy fitness studios generate substantial noise — thumping music, group class instruction, dropping weights, and cardio equipment all contribute to a sound level that can breach acceptable limits for neighbouring tenants or residents. In Singapore, noise complaints to building management or the NEA can result in fines or restricted operating hours.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'gyms-p2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'gyms-p2-s1',
            text: 'Just Acoustics installs impact-resistant, fire-rated acoustic panels suited to the high-humidity and high-impact environment of gyms and fitness spaces. We treat ceilings, feature walls, and partition areas to reduce the overall noise floor and prevent sound breakout without killing the energy that motivates your members. Solutions are available for boutique studios, commercial gyms, and hotel fitness centres.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'Gym & Fitness Studio Acoustic Treatment Singapore | Just Acoustics',
      metaDescription: 'Reduce noise in gyms and fitness studios in Singapore. Impact-resistant acoustic panels to control sound and prevent neighbour complaints.',
    },
  },
]

async function seed() {
  console.log('Seeding services into Sanity...\n')

  for (const service of services) {
    const doc = {
      _type: 'service',
      title: service.title,
      slug: { _type: 'slug', current: service.slug },
      shortDescription: service.shortDescription,
      benefits: service.benefits,
      body: service.body,
      seo: service.seo,
    }

    try {
      const result = await client.create(doc)
      console.log(`✓ Created: ${service.title} (${result._id})`)
    } catch (err) {
      console.error(`✗ Failed: ${service.title} —`, err.message)
    }
  }

  console.log('\nDone! All services seeded.')
  console.log('Go to /studio to add images and publish them.')
}

seed()
