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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function uploadImageFromUrl(imageUrl, filename) {
  const response = await fetch(imageUrl)
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status} ${imageUrl}`)
  const buffer = await response.arrayBuffer()
  const asset = await client.assets.upload('image', Buffer.from(buffer), { filename })
  return asset
}

const projects = [
  // ── Restaurants ──────────────────────────────────────────────
  {
    title: 'PPP Coffee (New Bahru)',
    clientName: 'PPP Coffee',
    location: 'New Bahru, Singapore',
    category: 'restaurants',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=185.45454545454544;130.9090909090909;185.45454545454544;130.9090909090909/A0xwEBEK9BFvE0ZK/jpeg-to-webp-image-1545-1SiUpk5wAjZKT4XO.webp',
    imageFilename: 'ppp-coffee.webp',
  },
  {
    title: 'Acqua E Farina',
    clientName: 'Acqua E Farina',
    location: 'Keong Saik Rd, Singapore',
    category: 'restaurants',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=164.43989769820973;415.63572679509633;118.76214833759592;0/A0xwEBEK9BFvE0ZK/cleanshot-2025-11-23-at-22.15.55-2x-0gKFoku2uEwSkTDs.png',
    imageFilename: 'acqua-e-farina.png',
  },
  {
    title: 'Dough Cafe',
    clientName: 'Dough Cafe',
    location: 'Chijmes, Singapore',
    category: 'restaurants',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/img_0093-A0x167NZ0lsrgyln.jpeg',
    imageFilename: 'dough-cafe.jpeg',
  },

  // ── Office Spaces ─────────────────────────────────────────────
  {
    title: 'Capital Asia Investments',
    clientName: 'Capital Asia Investments',
    location: 'Singapore',
    category: 'office-spaces',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=44.38356164383561;209.5531587057011;44.38356164383561;209.5531587057011/A0xwEBEK9BFvE0ZK/5-F7daRTqGXN3XuB8u.png',
    imageFilename: 'capital-asia-investments.png',
  },
  {
    title: 'Mortgage Hub',
    clientName: 'Mortgage Hub',
    location: 'Singapore',
    category: 'office-spaces',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/mortgage-hub-AQEDaXaD99Izpnbr.png',
    imageFilename: 'mortgage-hub.png',
  },
  {
    title: 'YMCA Metropolitan',
    clientName: 'YMCA Metropolitan',
    location: 'Singapore',
    category: 'office-spaces',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/img_1315-ALp7NapWezFeRrl0.jpeg',
    imageFilename: 'ymca-metropolitan.jpeg',
  },
  {
    title: "Rubik's Material Lab",
    clientName: "Rubik's Material Lab",
    location: 'Singapore',
    category: 'office-spaces',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=919.2750000000001;0;1865.3249999999998;0/A0xwEBEK9BFvE0ZK/img_1529-A0x16Ex9r3haQb5P.jpeg',
    imageFilename: 'rubiks-material-lab.jpeg',
  },
  {
    title: 'Proteus Design/Tech',
    clientName: 'Proteus Design/Tech',
    location: 'Singapore',
    category: 'office-spaces',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=0;287.1794871794872;0;0/A0xwEBEK9BFvE0ZK/4-c1KKXLIM3WSpeAsx.png',
    imageFilename: 'proteus-design-tech.png',
  },
  {
    title: 'Workforce Singapore',
    clientName: 'Workforce Singapore',
    location: 'PLQ, Singapore',
    category: 'office-spaces',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/img_0631-YZ9xoJ9QJXhGq40D.jpeg',
    imageFilename: 'workforce-singapore.jpeg',
  },
  {
    title: 'Hoogwegt',
    clientName: 'Hoogwegt',
    location: 'Singapore',
    category: 'office-spaces',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=664.875;0;388.125;0/A0xwEBEK9BFvE0ZK/img_9511-m2WaJvWr2DhMMJE1.jpeg',
    imageFilename: 'hoogwegt.jpeg',
  },
  {
    title: 'Shimano Singapore',
    clientName: 'Shimano Singapore',
    location: 'Singapore',
    category: 'office-spaces',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=217.5921375921376;329.44649446494464;196.36363636363637;0/A0xwEBEK9BFvE0ZK/img_2489-YNqPW4R7M7s2zgN4.jpeg',
    imageFilename: 'shimano-singapore.jpeg',
  },
  {
    title: 'Franklin Offshore',
    clientName: 'Franklin Offshore',
    location: 'Singapore',
    category: 'office-spaces',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/img_0625-ALp7NaGqDocVRLwp.jpeg',
    imageFilename: 'franklin-offshore.jpeg',
  },

  // ── Schools ───────────────────────────────────────────────────
  {
    title: 'The Nuggets Academy',
    clientName: 'The Nuggets Academy',
    location: 'Singapore',
    category: 'schools',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=664.1495327102804;353.6842105263158;35.32710280373831;282.9473684210526/A0xwEBEK9BFvE0ZK/img_3454-AE0ajD0rk2up2GXN.jpeg',
    imageFilename: 'the-nuggets-academy.jpeg',
  },
  {
    title: 'Concentricheal',
    clientName: 'Concentricheal',
    location: 'Singapore',
    category: 'schools',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/img_0644-YbNqlDkPW1FXl5Xk.jpeg',
    imageFilename: 'concentricheal.jpeg',
  },
  {
    title: 'Pei School of Dance',
    clientName: 'Pei School of Dance',
    location: 'Singapore',
    category: 'schools',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=459.37500000000006;0;15.625;0/A0xwEBEK9BFvE0ZK/58d17bef-9c67-4b7b-8e03-51b377b9e346-mP42bj4NK1czJN4M.jpg',
    imageFilename: 'pei-school-of-dance.jpg',
  },
  {
    title: 'Vibratone Academy',
    clientName: 'Vibratone Academy',
    location: 'Singapore',
    category: 'schools',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/img_7696-mk3qoe3vLKTkogz8.jpeg',
    imageFilename: 'vibratone-academy.jpeg',
  },
  {
    title: "Bhaskar's Arts Academy",
    clientName: "Bhaskar's Arts Academy",
    location: 'Singapore',
    category: 'schools',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/img_0596-mePbo8PnBGtq2635.jpeg',
    imageFilename: 'bhaskars-arts-academy.jpeg',
  },

  // ── Studios & Homes ───────────────────────────────────────────
  {
    title: 'Mixing Studio',
    clientName: 'Private Client',
    location: 'Singapore',
    category: 'studios-homes',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/8fbe9d32-4957-46d1-9a34-c6b75cfedc5e-YrDq8rxOyetG8o4N.jpg',
    imageFilename: 'mixing-studio.jpg',
  },
  {
    title: 'Mixing & Recording Studio',
    clientName: 'Private Client',
    location: 'Singapore',
    category: 'studios-homes',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/photo-2024-09-30-22-19-57-2-AQEDw5Ey71UznL2E.jpg',
    imageFilename: 'mixing-recording-studio.jpg',
  },
  {
    title: 'Jam Studio',
    clientName: 'Private Client',
    location: 'Singapore',
    category: 'studios-homes',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=129.16666666666666;0;0;0/A0xwEBEK9BFvE0ZK/photo-2024-04-25-14-50-32-Y4LxwZ7RRwcz9Rnj.jpg',
    imageFilename: 'jam-studio.jpg',
  },
  {
    title: 'Home Office & Studio',
    clientName: 'Private Client',
    location: 'Singapore',
    category: 'studios-homes',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/google-search-acoustics-business-singapore-Y4LxwqLpo1ijeagR.jpg',
    imageFilename: 'home-office-studio.jpg',
  },
  {
    title: 'Home Theatre',
    clientName: 'Private Client',
    location: 'Singapore',
    category: 'studios-homes',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/img_0836.jpg-mjEqo3E5GKuGrj7X.webp',
    imageFilename: 'home-theatre.webp',
  },
  {
    title: 'Drum Practice Room',
    clientName: 'Private Client',
    location: 'Singapore',
    category: 'studios-homes',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/img_0231-AR0MXkJva4U44Z89.jpeg',
    imageFilename: 'drum-practice-room.jpeg',
  },
  {
    title: 'Music Studio',
    clientName: 'Private Client',
    location: 'Singapore',
    category: 'studios-homes',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=337.69911504424783;0;774.1592920353983;92.29862475442043/A0xwEBEK9BFvE0ZK/img_8081-AwvD3WknxPhZO7p6.jpeg',
    imageFilename: 'music-studio.jpeg',
  },
  {
    title: 'Podcast Studio',
    clientName: 'Private Client',
    location: 'Singapore',
    category: 'studios-homes',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=278.75555555555553;0;836.2666666666667;0/A0xwEBEK9BFvE0ZK/7d5e1769-01d3-4b9c-a4e4-734aa1558046_ba69b3df-4414-4a31-a015-8d068b21d080.jpg-mePbo8PGgMcq4jej.webp',
    imageFilename: 'podcast-studio.webp',
  },
  {
    title: 'Home Office',
    clientName: 'Private Client',
    location: 'Singapore',
    category: 'studios-homes',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/photo-2023-11-27-19-25-37-mP42bj4n1wfbzVRr.jpg',
    imageFilename: 'home-office.jpg',
  },
  {
    title: 'Podcast Office',
    clientName: 'Private Client',
    location: 'Singapore',
    category: 'studios-homes',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/photo-2024-06-09-12-16-30-YBgeOPgr43cV3zK5.jpg',
    imageFilename: 'podcast-office.jpg',
  },
  {
    title: 'Home Double Office',
    clientName: 'Private Client',
    location: 'Singapore',
    category: 'studios-homes',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=96.875;0;0;0/A0xwEBEK9BFvE0ZK/img_0504.jpg-m6Ljl6LDn8FEwjM0.webp',
    imageFilename: 'home-double-office.webp',
  },
  {
    title: 'Home Theatre 2',
    clientName: 'Private Client',
    location: 'Singapore',
    category: 'studios-homes',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/img_2354-AVL1oqLQZGcq367e.jpeg',
    imageFilename: 'home-theatre-2.jpeg',
  },
  {
    title: 'Guitar Practice Studio',
    clientName: 'Private Client',
    location: 'Singapore',
    category: 'studios-homes',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/img_2274-YrDq8jDJbLHJ50GP.jpeg',
    imageFilename: 'guitar-practice-studio.jpeg',
  },

  // ── Churches ──────────────────────────────────────────────────
  {
    title: 'Pasir Pajang Church of Christ',
    clientName: 'Pasir Pajang Church of Christ',
    location: 'Pasir Pajang, Singapore',
    category: 'churches',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop/A0xwEBEK9BFvE0ZK/5f8e3c7d-4c5d-4f2e-80e9-943f3a732db6-m7V5xEXM7lcx8rv3.jpg',
    imageFilename: 'pasir-pajang-church-of-christ.jpg',
  },
  {
    title: 'Leng Kwang Baptist Church',
    clientName: 'Leng Kwang Baptist Church',
    location: 'Singapore',
    category: 'churches',
    imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=527,fit=crop,trim=426.7317073170732;200.07312614259598;0;157.9524680073126/A0xwEBEK9BFvE0ZK/img_4224-Aq2qVbQv1PFnp3Ma.jpeg',
    imageFilename: 'leng-kwang-baptist-church.jpeg',
  },
]

async function seed() {
  console.log(`Seeding ${projects.length} real projects into Sanity...\n`)

  for (const project of projects) {
    try {
      // 1. Upload image
      process.stdout.write(`  Uploading image for "${project.title}"... `)
      const asset = await uploadImageFromUrl(project.imageUrl, project.imageFilename)
      console.log(`✓ (${asset._id})`)

      // 2. Create project document
      const doc = {
        _type: 'project',
        title: project.title,
        slug: { _type: 'slug', current: slugify(project.title) },
        clientName: project.clientName,
        location: project.location,
        category: project.category,
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
          alt: project.title,
        },
      }

      const result = await client.create(doc)
      console.log(`✓ Created: ${project.title} (${result._id})\n`)
    } catch (err) {
      console.error(`✗ Failed: ${project.title} — ${err.message}\n`)
    }
  }

  console.log('Done! All projects seeded.')
  console.log('Open /studio to review and publish them.')
}

seed()
