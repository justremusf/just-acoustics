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

const created = JSON.parse(
  readFileSync(resolve(process.cwd(), 'generated/client-query-drafts-created.json'), 'utf8')
) as { results: { id: string; slug: string; title: string }[] }

type Span = { _type: 'span'; _key: string; text?: string; marks?: string[] }
type Block = {
  _type: string
  _key: string
  style?: string
  listItem?: string
  children?: Span[]
}
type Post = {
  _id: string
  title: string
  excerpt?: string
  body?: Block[]
  faqs?: { _key: string; question: string; answer: string }[]
  seo?: { metaTitle?: string; metaDescription?: string }
}

const replacements: [RegExp, string][] = [
  [/—/g, ','],
  [/\bcrucial\b/gi, 'important'],
  [/\bpivotal\b/gi, 'important'],
  [/\bdelve into\b/gi, 'look at'],
  [/\bunderscore(s|d)?\b/gi, 'show'],
  [/\bin today'?s (fast-paced )?world\b/gi, ''],
  [/\bit is important to note that\b/gi, ''],
  [/\bnot just ([^.;]+),? but also\b/gi, '$1 and'],
  [/\blet'?s (dive in|explore|get started)\b/gi, ''],
  [/\s+/g, ' '],
]

function humanize(text = '') {
  let output = text
  for (const [pattern, replacement] of replacements) output = output.replace(pattern, replacement)
  return output
    .replace(/\s+,/g, ',')
    .replace(/\s+\./g, '.')
    .replace(/,\s*,/g, ',')
    .trim()
}

function humanizeBody(body: Block[] = []) {
  return body.map((block) => {
    if (block._type !== 'block' || !block.children) return block
    return {
      ...block,
      children: block.children.map((child) =>
        child.text ? { ...child, text: humanize(child.text) } : child
      ),
    }
  })
}

async function main() {
  const ids = created.results.map((result) => result.id)
  const posts = await sanity.fetch<Post[]>(
    `*[_type == "post" && _id in $ids] { _id, title, excerpt, body, faqs, seo }`,
    { ids }
  )

  let updated = 0
  for (const post of posts) {
    await sanity.patch(post._id).set({
      title: humanize(post.title),
      excerpt: humanize(post.excerpt),
      body: humanizeBody(post.body),
      faqs: post.faqs?.map((faq) => ({
        ...faq,
        question: humanize(faq.question),
        answer: humanize(faq.answer),
      })),
      seo: {
        metaTitle: humanize(post.seo?.metaTitle),
        metaDescription: humanize(post.seo?.metaDescription),
      },
    }).commit()
    updated++
    console.log(`[${updated}/${posts.length}] ${post.title}`)
  }

  console.log(`Done. Local-humanized ${updated} drafts.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
