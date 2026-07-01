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

async function getDetails() {
  try {
    const square = await client.fetch('*[_type == "shopItem" && slug.current == "square-studio-acoustic-panel"][0]')
    const large = await client.fetch('*[_type == "shopItem" && slug.current == "1200x600-studio-acoustic-panel"][0]')
    const flexi = await client.fetch('*[_type == "shopItem" && slug.current == "standard-flexi-acoustic-panel"][0]')
    const bassTrap = await client.fetch('*[_type == "shopItem" && slug.current == "150mm-studio-bass-trap"][0]')
    
    console.log('SQUARE PANEL:', square ? 'Exists' : 'No')
    console.log('LARGE PANEL PACKAGE OPTIONS:', large?.packageOptions)
    console.log('FLEXI PANEL:', flexi ? 'Exists' : 'No')
    console.log('BASS TRAP:', bassTrap ? 'Exists' : 'No')
    if (large) {
      console.log('LARGE PANEL COLOURS:', large.colourOptions?.length)
      console.log('LARGE PANEL THICKNESSES:', large.thicknessOptions)
    }
  } catch (err) {
    console.error('ERROR:', err)
  }
}

getDetails()
