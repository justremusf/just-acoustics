import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: true })

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

type Created = { results: { id: string; slug: string; title: string }[] }
type SanityDoc = Record<string, unknown> & {
  _id: string
  _type: string
  _rev?: string
  _createdAt?: string
  _updatedAt?: string
  body?: { _type?: string }[]
}

function liveIdFromDraftId(id: string) {
  return id.replace(/^drafts\./, '')
}

function cleanForPublish(draft: SanityDoc, liveId: string, publishedAt: string) {
  const { _rev, _createdAt, _updatedAt, ...rest } = draft
  void _rev
  void _createdAt
  void _updatedAt

  return {
    ...rest,
    _id: liveId,
    _type: draft._type,
    mainImage: undefined,
    imagePrompts: [],
    publishedAt,
    body: (draft.body || []).filter((block) => block._type !== 'image'),
  }
}

async function main() {
  const created = JSON.parse(
    readFileSync(resolve(process.cwd(), 'generated/client-query-drafts-created.json'), 'utf8')
  ) as Created

  const publishedAt = new Date().toISOString()
  let published = 0

  for (const item of created.results) {
    const draft = await sanity.getDocument<SanityDoc>(item.id)
    if (!draft) throw new Error(`Missing draft: ${item.id}`)

    const liveId = liveIdFromDraftId(item.id)
    const liveDoc = cleanForPublish(draft, liveId, publishedAt)

    await sanity.transaction()
      .createOrReplace(liveDoc)
      .delete(item.id)
      .commit()

    published++
    console.log(`[${published}/${created.results.length}] Published ${item.title}`)
  }

  console.log(`Done. Published ${published} articles with all diagrams removed.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
