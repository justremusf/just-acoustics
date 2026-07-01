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

async function check() {
  try {
    const items = await client.fetch('*[_type == "shopItem"]{_id, title, slug, price, category}')
    console.log('SHOP ITEMS:')
    console.log(JSON.stringify(items, null, 2))
  } catch (err) {
    console.error('ERROR:', err)
  }
}

check()
