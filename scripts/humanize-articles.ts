/**
 * Humanize all published blog posts using the humanizer skill.
 * Usage: npx tsx scripts/humanize-articles.ts
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: true })

const __dirname = dirname(fileURLToPath(import.meta.url))

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

const HUMANIZER_SYSTEM = `You are a writing editor. Your job is to humanize blog article text — remove AI writing patterns and make it sound like a real person wrote it.

Rules (based on Wikipedia's Signs of AI Writing guide):
1. Remove significance inflation: no "pivotal", "testament", "underscores", "highlights its importance", "evolving landscape", "stands as"
2. Remove promotional language: no "vibrant", "groundbreaking", "nestled", "breathtaking", "renowned", "boasts"
3. Remove -ing phrase padding: cut "highlighting...", "showcasing...", "contributing to...", "ensuring..." tacked onto sentences for fake depth
4. Replace "serves as / stands as / functions as / represents" with plain "is / are"
5. Remove vague attributions: no "experts argue", "industry observers", "studies show" without specifics
6. Remove AI vocabulary: no "crucial", "delve", "intricate", "tapestry", "foster", "garner", "underscore", "key role", "pivotal", "showcase", "valuable insights"
7. Cut filler phrases: "In order to" → "To", "It is important to note that" → delete, "At this point in time" → "Now"
8. Remove excessive hedging and persuasive framing: no "at its core", "the real question is", "fundamentally", "what really matters"
9. Remove signposting: no "Let's dive in", "let's explore", "here's what you need to know"
10. Fix negative parallelisms: no "It's not just X; it's Y"
11. Reduce em dash overuse — replace most with commas or full stops
12. Remove generic positive conclusions: no "the future looks bright", "exciting times ahead"
13. Remove rule-of-three padding unless genuinely needed
14. Vary sentence length — mix short punchy ones with longer ones
15. Keep British English and Singapore context

You will receive JSON blocks representing a blog post body. Each block has a "text" field. Rewrite ONLY the text fields. Keep all other fields (_type, _key, style, listItem, marks, etc.) exactly as-is. Return valid JSON — the same array structure with only text values changed.

Do not add commentary. Return only the JSON array.`

type SanityBlock = {
  _type: string
  _key: string
  style?: string
  listItem?: string
  level?: number
  children?: { _type: string; _key: string; text?: string; marks?: string[] }[]
  markDefs?: unknown[]
  placement?: string
}

function extractTextBlocks(body: SanityBlock[]) {
  return body.map((block) => {
    if (block._type === 'block' && block.children) {
      return {
        _key: block._key,
        style: block.style,
        listItem: block.listItem,
        text: block.children.map((c) => c.text || '').join(''),
        marks: block.children.flatMap((c) => c.marks || []),
      }
    }
    return { _key: block._key, _type: block._type, placement: (block as { placement?: string }).placement }
  })
}

function applyHumanizedText(
  originalBody: SanityBlock[],
  humanizedBlocks: { _key: string; text?: string }[]
): SanityBlock[] {
  const humanizedMap = new Map(humanizedBlocks.map((b) => [b._key, b.text]))
  return originalBody.map((block) => {
    if (block._type !== 'block' || !block.children) return block
    const newText = humanizedMap.get(block._key)
    if (newText === undefined) return block
    return {
      ...block,
      children: block.children.map((child, i) =>
        i === 0 ? { ...child, text: newText } : { ...child, text: '' }
      ),
    }
  })
}

async function humanizePost(post: { _id: string; title: string; body: SanityBlock[]; faqs?: { _key: string; question: string; answer: string }[]; excerpt?: string }) {
  // Build a simplified payload for Claude
  const textBlocks = extractTextBlocks(post.body)
  const payload = JSON.stringify(textBlocks, null, 2)

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: HUMANIZER_SYSTEM,
    messages: [
      {
        role: 'user',
        content: `Humanize this article's text blocks. Title: "${post.title}"\n\nBlocks:\n${payload}`,
      },
    ],
  })

  const raw = response.content.find((c) => c.type === 'text')?.text || ''
  // Extract JSON from response
  const jsonMatch = raw.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No JSON array in response')
  const humanizedBlocks: { _key: string; text?: string }[] = JSON.parse(jsonMatch[0])

  const newBody = applyHumanizedText(post.body, humanizedBlocks)

  // Also humanize FAQs
  let newFaqs = post.faqs
  if (post.faqs?.length) {
    const faqResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: HUMANIZER_SYSTEM,
      messages: [
        {
          role: 'user',
          content: `Humanize these FAQ answers. Return JSON array with same structure.\n\n${JSON.stringify(post.faqs, null, 2)}`,
        },
      ],
    })
    const faqRaw = faqResponse.content.find((c) => c.type === 'text')?.text || ''
    const faqJson = faqRaw.match(/\[[\s\S]*\]/)
    if (faqJson) newFaqs = JSON.parse(faqJson[0])
  }

  const patch: Record<string, unknown> = { body: newBody }
  if (newFaqs) patch.faqs = newFaqs
  if (post.excerpt) {
    // Quick excerpt humanize inline
    const excerptRes = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: 'Remove AI writing patterns. Return only the rewritten text, no commentary.',
      messages: [{ role: 'user', content: `Humanize: "${post.excerpt}"` }],
    })
    const newExcerpt = excerptRes.content.find((c) => c.type === 'text')?.text?.replace(/^"|"$/g, '').trim()
    if (newExcerpt) patch.excerpt = newExcerpt
  }

  await sanity.patch(post._id).set(patch).commit()
}

async function main() {
  const posts = await sanity.fetch<{ _id: string; title: string; body: SanityBlock[]; faqs?: { _key: string; question: string; answer: string }[]; excerpt?: string }[]>(
    `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) { _id, title, body, faqs, excerpt }`
  )

  console.log(`\nHumanizing ${posts.length} articles…\n`)

  const DELAY = 3000
  let done = 0
  let failed = 0

  for (const post of posts) {
    try {
      await humanizePost(post)
      done++
      console.log(`✅ [${done}/${posts.length}] ${post.title}`)
    } catch (err) {
      failed++
      console.error(`❌ ${post.title}:`, (err as Error).message)
    }
    if (done + failed < posts.length) await new Promise((r) => setTimeout(r, DELAY))
  }

  console.log(`\nDone. ${done} humanized, ${failed} failed.`)
}

main().catch((err) => { console.error(err); process.exit(1) })
