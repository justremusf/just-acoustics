'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity/sanity.config'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function StudioPage() {
  return <NextStudio config={config} />
}
