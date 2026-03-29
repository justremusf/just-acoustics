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

const projects = [
  {
    title: 'The Brasserie Singapore',
    slug: 'the-brasserie-singapore',
    clientName: 'The Brasserie',
    location: 'Robertson Quay, Singapore',
    category: 'restaurants',
    description: 'A bustling riverside brasserie struggling with high noise levels that made conversation difficult during peak service hours. We installed fabric-wrapped acoustic panels along the feature walls and suspended ceiling baffles above the dining floor, cutting reverberation time by over 40% and restoring a comfortable ambient sound level guests could talk over.',
    completionDate: '2024-08-15',
  },
  {
    title: 'FinTech Hub Office',
    slug: 'fintech-hub-office',
    clientName: 'FinTech Hub',
    location: 'Marina Bay Financial Centre, Singapore',
    category: 'office-spaces',
    description: 'A 200-seat open-plan fintech office where speech noise was impacting focus and confidential calls. We fitted perforated ceiling panels across the main workspace and acoustic partition screens between desk clusters, significantly improving speech privacy scores and reducing reported noise complaints among staff.',
    completionDate: '2024-10-03',
  },
  {
    title: 'Grace Community Church',
    slug: 'grace-community-church',
    clientName: 'Grace Community Church',
    location: 'Bishan, Singapore',
    category: 'churches',
    description: "The sanctuary's hard concrete walls and high vaulted ceiling created a long reverb tail that made spoken word and contemporary worship music muddy. We designed a custom array of deep-fill fabric panels on the side walls and rear, reducing RT60 from 3.2 seconds to under 1.1 seconds — dramatically improving speech intelligibility and the clarity of the praise team.",
    completionDate: '2024-06-20',
  },
  {
    title: 'Nexus Academy',
    slug: 'nexus-academy',
    clientName: 'Nexus Academy',
    location: 'Jurong East, Singapore',
    category: 'schools',
    description: "Classrooms in this private school suffered from excessive echo off tiled floors and bare concrete ceilings, straining teachers' voices and reducing student comprehension. We installed ceiling cloud panels in six classrooms and acoustic boards on the back walls, meeting Singapore school acoustic guidelines and reducing teacher vocal fatigue noticeably within weeks.",
    completionDate: '2025-01-12',
  },
  {
    title: 'Home Recording Studio — Tanglin',
    slug: 'home-recording-studio-tanglin',
    clientName: 'Private Client',
    location: 'Tanglin, Singapore',
    category: 'studios-homes',
    description: 'A home studio conversion in a landed property where parallel walls caused flutter echo and bass build-up in the corners. We combined broadband absorption panels, corner bass traps, and diffuser panels on the rear wall to create a flat, controlled recording environment suitable for professional vocal and guitar tracking.',
    completionDate: '2025-02-28',
  },
  {
    title: 'F45 Training Orchard',
    slug: 'f45-training-orchard',
    clientName: 'F45 Training',
    location: 'Orchard Road, Singapore',
    category: 'gym-leisure',
    description: 'High-energy group fitness classes in this Orchard Road studio were generating noise complaints from neighbouring tenants. We lined the ceiling with Class A fire-rated acoustic tiles and applied resilient wall panels behind the equipment zone, reducing the overall noise floor by 12 dB and resolving the tenant disputes.',
    completionDate: '2024-12-05',
  },
]

async function seed() {
  console.log('Seeding projects into Sanity...\n')

  for (const project of projects) {
    const doc = {
      _type: 'project',
      title: project.title,
      slug: { _type: 'slug', current: project.slug },
      clientName: project.clientName,
      location: project.location,
      category: project.category,
      description: project.description,
      completionDate: project.completionDate,
    }

    try {
      const result = await client.create(doc)
      console.log(`✓ Created: ${project.title} (${result._id})`)
    } catch (err) {
      console.error(`✗ Failed: ${project.title} —`, err.message)
    }
  }

  console.log('\nDone! All projects seeded.')
  console.log('Go to /studio to add photos and publish them.')
}

seed()
