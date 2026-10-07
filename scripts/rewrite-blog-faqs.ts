/**
 * Rewrite every blog post FAQ answer as a plain, one-line answer clients can absorb at a glance.
 * Fixes answers that are too blunt ("Yes.") or too long.
 *
 * Usage:
 *   npx tsx scripts/rewrite-blog-faqs.ts            # dry run, writes a before/after preview
 *   npx tsx scripts/rewrite-blog-faqs.ts --apply    # writes the new answers to Sanity
 *   npx tsx scripts/rewrite-blog-faqs.ts --slug=my-post   # one post only (works with --apply)
 *
 * Needs ANTHROPIC_API_KEY, NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN in .env.local.
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: true })

const APPLY = process.argv.includes('--apply')
const SLUG = process.argv.find((arg) => arg.startsWith('--slug='))?.split('=')[1]

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

type Faq = { _key: string; _type?: string; question: string; answer: string }
type Post = { _id: string; title: string; slug?: string; excerpt?: string; faqs: Faq[] }

const MIN_WORDS = 6
const MAX_WORDS = 25

const SYSTEM = `You write FAQ answers for Just Acoustics, a Singapore acoustic panel company. Readers are busy clients (office managers, restaurant owners, homeowners), not acousticians.

Rewrite each answer as ONE plain sentence a 10-year-old could follow:
- Lead with the direct answer (Yes / No / Usually / It depends on...), then give the one reason or next step that matters.
- ${MIN_WORDS}–${MAX_WORDS} words. Never a bare "Yes." or "No."
- Everyday words. No jargon unless the question uses it; if you must, explain it in the same breath.
- British English. No em dashes, no hype, no exclamation marks.
- Keep the original meaning and any real caveat. Do not invent numbers, prices or promises.
- Acoustic panels reduce echo inside a room; never imply they soundproof or block noise between rooms.

Examples:
Q: Is it cheaper to plan early?
A: Yes, planning acoustics before fit-out avoids paying to rework ceilings, walls and finishes later.
Q: Do partitions matter?
A: Yes, thin or gappy partitions let sound leak between rooms, and panels alone will not fix that.
Q: Can panels match branding?
A: Yes, panels come in many fabric colours and can be printed with your logo or artwork.`

const tool = {
  name: 'save_answers',
  description: 'Save the rewritten FAQ answers, in the same order as the questions given.',
  input_schema: {
    type: 'object' as const,
    required: ['answers'],
    properties: {
      answers: { type: 'array', items: { type: 'string' } },
    },
  },
}

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

function isOneLiner(answer: string) {
  const words = wordCount(answer)
  const sentences = answer.split(/[.!?](\s|$)/).filter((s) => s && s.trim()).length
  return words >= MIN_WORDS && words <= MAX_WORDS && sentences === 1 && !answer.includes('—')
}

async function rewrite(post: Post, feedback = ''): Promise<string[]> {
  const questions = post.faqs.map((faq, i) => `${i + 1}. Q: ${faq.question}\n   Current A: ${faq.answer}`).join('\n')
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5-5',
    max_tokens: 2000,
    system: SYSTEM,
    tools: [tool],
    tool_choice: { type: 'tool', name: tool.name },
    messages: [
      {
        role: 'user',
        content: `Article: ${post.title}\n${post.excerpt ? `Summary: ${post.excerpt}\n` : ''}\nRewrite these ${post.faqs.length} answers:\n${questions}${feedback}`,
      },
    ],
  })
  const call = response.content.find((c) => c.type === 'tool_use')
  const answers = (call?.input as { answers?: unknown })?.answers
  if (!Array.isArray(answers) || answers.length !== post.faqs.length) {
    throw new Error(`expected ${post.faqs.length} answers, got ${Array.isArray(answers) ? answers.length : 'none'}`)
  }
  return answers.map((a) => String(a).trim())
}

async function main() {
  const posts = await sanity.fetch<Post[]>(
    `*[_type == "post" && count(faqs) > 0 ${SLUG ? '&& slug.current == $slug' : ''}] | order(publishedAt desc) {
      _id, title, "slug": slug.current, excerpt, faqs
    }`,
    SLUG ? { slug: SLUG } : {}
  )
  console.log(`\n${APPLY ? 'Rewriting' : 'Previewing'} FAQs on ${posts.length} posts (incl. drafts)…\n`)

  const preview: string[] = ['# Blog FAQ rewrite preview', '']
  let changed = 0
  let flagged = 0

  for (const post of posts) {
    try {
      let answers = await rewrite(post)
      const bad = answers.map((a, i) => (isOneLiner(a) ? null : i + 1)).filter(Boolean)
      if (bad.length) {
        answers = await rewrite(post, `\n\nYour last attempt broke the rules on answers ${bad.join(', ')}. Each must be one sentence of ${MIN_WORDS}–${MAX_WORDS} words.`)
      }

      // Keep the old answer for anything that still fails the rules, so nothing worse goes live.
      const faqs = post.faqs.map((faq, i) => {
        if (isOneLiner(answers[i])) return { ...faq, answer: answers[i] }
        flagged++
        console.warn(`  ⚠ kept original: ${post.slug} / "${faq.question}"`)
        return faq
      })

      preview.push(`## ${post.title}`, `\`${post._id}\``, '')
      for (const [i, faq] of faqs.entries()) {
        preview.push(`**Q: ${faq.question}**`, `- Before: ${post.faqs[i].answer}`, `- After: ${faq.answer}`, '')
      }

      if (APPLY) {
        await sanity.patch(post._id).set({ faqs }).commit()
      }
      changed++
      console.log(`  ✓ ${post.slug || post._id}`)
    } catch (err) {
      console.error(`  ✗ ${post.slug || post._id}: ${(err as Error).message}`)
    }
  }

  await mkdir(resolve(process.cwd(), 'generated'), { recursive: true })
  const out = resolve(process.cwd(), 'generated', 'faq-rewrite-preview.md')
  await writeFile(out, preview.join('\n'))

  console.log(`\nDone. ${changed}/${posts.length} posts ${APPLY ? 'updated in Sanity' : 'previewed'}, ${flagged} answers kept as-is.`)
  console.log(`Preview: ${out}`)
  if (!APPLY) console.log('Happy with it? Re-run with --apply.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
