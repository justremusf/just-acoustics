#!/usr/bin/env tsx
/**
 * SEO Content Engine — Opus 4.7
 *
 * Usage:
 *   npx tsx scripts/generate-article.ts "how to reduce echo in office singapore"
 *
 * What it does:
 *   1. Loads the Memory OS context files (article rules, keyword clusters, playbook, etc.)
 *   2. Pulls live Sanity slugs for natural internal linking
 *   3. Calls Claude Opus 4.7 with extended thinking, prompt caching, and a tool-forced structured output
 *   4. Creates a Sanity draft post with title, meta, body (Portable Text), FAQs, image prompts
 *   5. Writes a companion assets markdown file with copy-paste-ready Gemini Nano Banana prompts
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'
import { z } from 'zod'

// ─── Env & paths ──────────────────────────────────────────────────────────────

dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: true })

const __dirname = dirname(fileURLToPath(import.meta.url))
const MEMORY_OS_CONTEXT = '/Users/remusfung/Desktop/AI Work/Just Acoustic Agents/context'
const GENERATED_DIR = resolve(__dirname, '../generated')

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY missing in .env.local')
if (!SANITY_API_TOKEN) throw new Error('SANITY_API_TOKEN missing in .env.local')
if (!SANITY_PROJECT_ID) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID missing in .env.local')

// ─── Clients ──────────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: SANITY_API_TOKEN,
  useCdn: false,
})

// ─── Zod schema for the publish_article tool output ──────────────────────────

const BlockSchema = z.object({
  type: z.literal('block'),
  style: z.enum(['normal', 'h2', 'h3', 'blockquote']),
  listItem: z.enum(['bullet', 'number']).optional(),
  text: z.string(),
  marks: z.array(z.enum(['strong', 'em'])).optional(),
})

const ImageRefSchema = z.object({
  type: z.literal('imageRef'),
  placement: z.string(),
})

const BodyItemSchema = z.union([BlockSchema, ImageRefSchema])

const FaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
})

const ImagePromptSchema = z.object({
  role: z.enum(['hero', 'inline']),
  placement: z.string(),
  prompt: z.string(),
  alt: z.string(),
  aspectRatio: z.enum(['16:9', '4:3', '1:1', '3:2']),
})

const ArticleSchema = z.object({
  title: z.string(),
  slug: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  excerpt: z.string(),
  category: z.string().optional(),
  body: z.array(BodyItemSchema),
  faqs: z.array(FaqSchema).min(5).max(7),
  imagePrompts: z.array(ImagePromptSchema).min(4).max(6),
  repurpose: z.object({
    instagramCaption: z.string(),
    reelScript: z.string(),
  }),
  internalLinks: z
    .array(
      z.object({
        anchor: z.string(),
        targetSlug: z.string(),
        section: z.string().optional(),
      })
    )
    .optional(),
})

type Article = z.infer<typeof ArticleSchema>

// ─── Context loading ──────────────────────────────────────────────────────────

async function loadContextFiles() {
  const files = [
    'business-overview.md',
    'acoustics-playbook.md',
    'seo-strategy.md',
    'article-rules.md',
    'keyword-clusters.md',
    'repurposing-rules.md',
    'preferences.md',
    'internal-linking-rules.md',
  ]
  const parts = await Promise.all(
    files.map(async (f) => {
      const content = await readFile(resolve(MEMORY_OS_CONTEXT, f), 'utf-8')
      return `### ${f}\n\n${content.trim()}`
    })
  )
  return parts.join('\n\n---\n\n')
}

async function loadLiveSlugs() {
  const [posts, services, products] = await Promise.all([
    sanity.fetch<{ title: string; slug: string }[]>(
      `*[_type == "post" && !(_id in path("drafts.**"))] { title, "slug": slug.current }`
    ),
    sanity.fetch<{ title: string; slug: string }[]>(
      `*[_type == "service" && !(_id in path("drafts.**"))] { title, "slug": slug.current }`
    ),
    sanity.fetch<{ title: string; slug: string }[]>(
      `*[_type == "product" && !(_id in path("drafts.**"))] { title, "slug": slug.current }`
    ),
  ])
  return {
    posts: posts.map((p) => `  /blog/${p.slug} — ${p.title}`).join('\n'),
    services: services.map((s) => `  /services/${s.slug} — ${s.title}`).join('\n'),
    products: products.map((p) => `  /products/${p.slug} — ${p.title}`).join('\n'),
  }
}

// ─── Tool schema (what Claude must return) ────────────────────────────────────

const PUBLISH_ARTICLE_TOOL = {
  name: 'publish_article',
  description:
    'Submit the finished SEO article for publication. Always call this tool. Never reply with plain text.',
  input_schema: {
    type: 'object',
    required: [
      'title',
      'slug',
      'metaTitle',
      'metaDescription',
      'excerpt',
      'body',
      'faqs',
      'imagePrompts',
      'repurpose',
    ],
    properties: {
      title: { type: 'string', description: 'H1 / display title. Human-friendly, not keyword-stuffed.' },
      slug: { type: 'string', description: 'kebab-case URL slug, no trailing slash.' },
      metaTitle: {
        type: 'string',
        description: '50–60 chars. Primary keyword in first 30 chars. No brand suffix (added automatically).',
      },
      metaDescription: {
        type: 'string',
        description: '150–160 chars. Must include a verb-led value prop. Natural, not stuffed.',
      },
      excerpt: {
        type: 'string',
        description:
          '1–2 sentence summary shown on listing pages. Answer-first if possible.',
      },
      category: {
        type: 'string',
        description:
          'Optional resource-topic slug (e.g. "office-acoustics", "restaurant-noise", "home-video-calls").',
      },
      body: {
        type: 'array',
        description:
          'Portable Text blocks. AEO rule: the FIRST normal block must be a direct 2–3 sentence answer to the keyword question.\n\nFor LIST ITEMS: set style="normal" AND listItem="bullet" (or "number"). Do NOT set style="bullet" — "bullet" is not a valid style value.\n\nFor HEADINGS: style="h2" or "h3".\nFor BODY COPY: style="normal".\nFor QUOTES: style="blockquote".\n\nInsert { "type": "imageRef", "placement": "<matches-an-imagePrompt-placement>" } blocks where each diagram should appear in the reading flow.',
        items: {
          type: 'object',
          oneOf: [
            {
              type: 'object',
              required: ['type', 'style', 'text'],
              properties: {
                type: { const: 'block' },
                style: { type: 'string', enum: ['normal', 'h2', 'h3', 'blockquote'] },
                listItem: { type: 'string', enum: ['bullet', 'number'] },
                text: { type: 'string' },
                marks: { type: 'array', items: { type: 'string', enum: ['strong', 'em'] } },
              },
            },
            {
              type: 'object',
              required: ['type', 'placement'],
              properties: {
                type: { const: 'imageRef' },
                placement: {
                  type: 'string',
                  description: 'Matches the placement value on an imagePrompt, e.g. "after-h2-1".',
                },
              },
            },
          ],
        },
      },
      faqs: {
        type: 'array',
        minItems: 5,
        maxItems: 7,
        items: {
          type: 'object',
          required: ['question', 'answer'],
          properties: {
            question: { type: 'string' },
            answer: { type: 'string' },
          },
        },
      },
      imagePrompts: {
        type: 'array',
        minItems: 4,
        maxItems: 6,
        description:
          'One hero (TLDR visual abstract) plus 3–5 inline diagrams. Each prompt describes a diagram/infographic, never a photo.',
        items: {
          type: 'object',
          required: ['role', 'placement', 'prompt', 'alt', 'aspectRatio'],
          properties: {
            role: { type: 'string', enum: ['hero', 'inline'] },
            placement: { type: 'string' },
            prompt: { type: 'string' },
            alt: { type: 'string' },
            aspectRatio: { type: 'string', enum: ['16:9', '4:3', '1:1', '3:2'] },
          },
        },
      },
      repurpose: {
        type: 'object',
        required: ['instagramCaption', 'reelScript'],
        properties: {
          instagramCaption: { type: 'string' },
          reelScript: {
            type: 'string',
            description: '60-second vertical video script. Punchy hook in the first line.',
          },
        },
      },
      internalLinks: {
        type: 'array',
        items: {
          type: 'object',
          required: ['anchor', 'targetSlug'],
          properties: {
            anchor: { type: 'string', description: 'The text inside the <a>.' },
            targetSlug: {
              type: 'string',
              description: 'Path like /services/offices-meeting-rooms or /blog/some-post.',
            },
            section: { type: 'string', description: 'Which body section it appears in.' },
          },
        },
      },
    },
  },
} as const

// ─── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(contextBlock: string, liveSlugs: Awaited<ReturnType<typeof loadLiveSlugs>>) {
  return [
    {
      type: 'text' as const,
      text: `You are the Just Acoustics SEO Engine, powered by Claude Opus 4.7.

Your single job: given a target keyword, produce a complete, ranking-ready article by calling the \`publish_article\` tool. Never reply with plain text.

# Quality bar
- 1000–1500 words, British English, Singapore-contextual
- **Answer-first intro:** the first normal-style body block must be a direct 2–3 sentence answer to the keyword's implied question (AEO / featured-snippet ready)
- Clear H2/H3 structure, bullets/numbered lists where natural, strong/em marks for emphasis
- Weave 2–4 internal links from the live slug list below, when genuinely relevant — use the \`internalLinks\` field to declare them
- Never confuse acoustic treatment with soundproofing
- No fake stats, no generic SEO filler, no hype
- FAQs (5–7) must be SPECIFIC to the keyword, not generic — answer real searcher sub-questions

# Image prompts — diagrams, not photos
Images exist so visual learners can scroll the article and still grasp the value. Every image is a **diagram, infographic, or concept illustration** — NEVER a photo of a treated space.

**Hero image (role: hero) = the TLDR visual abstract.**
A single illustration that summarises the whole article's argument. A reader who sees nothing else still gets the main insight. Think "visual abstract" from a scientific paper — clean, labeled, one glance = one idea.

**Inline images (role: inline) = one diagram per major concept (3–5 of them).**
Each inline image illustrates one H2's core idea. Pick the right diagram type:
- Flat infographic diagram → TLDR summaries, lists of signs, step processes
- Isometric cutaway → "how it works" cross-sections (sound waves hitting a panel)
- Side-by-side comparison chart → vs. articles (PET vs Fabric, treatment vs soundproofing)
- Flowchart / decision tree → diagnostic articles ("is your space too loud?" → branches)
- Before/after schematic → treatment outcomes
- Cause-and-effect chain → problem articles
- Annotated cross-section → product explainers
- Bar / curve chart illustration → RT60, frequency absorption

**Every image prompt must follow this structure:**
\`[Image type], showing [what is illustrated and which concepts are labeled]. Style: clean vector illustration, flat design, generous whitespace, 3–5 colour palette (warm neutral + one accent), minimal text (short labels only, 1–3 words each), clear visual hierarchy. No photorealism, no photos of rooms, no stock imagery. Suitable for an editorial blog post.\`

**Text rule:** keep labels 1–3 words (Gemini Nano Banana struggles with long text). Prefer icons / symbols over text.

**Placement:** one hero, then inline prompts placed at \`after-h2-1\`, \`after-h2-2\`, etc. Insert matching \`imageRef\` blocks in the body array where each inline image should appear.

**Forbidden:** photorealistic rooms, stock photography, foam-wedge imagery, people faces, brand logos, non-diagrammatic imagery.

---

# Business & writing context (cached)

${contextBlock}

---

# Live Sanity slugs for internal linking (updated each run)

Services:
${liveSlugs.services || '  (none)'}

Products:
${liveSlugs.products || '  (none)'}

Existing blog posts:
${liveSlugs.posts || '  (none)'}

Use these paths verbatim in \`internalLinks.targetSlug\` when you reference them.

---

Always call the \`publish_article\` tool exactly once. Never reply with plain text.`,
      cache_control: { type: 'ephemeral' as const },
    },
  ]
}

// ─── Portable Text conversion ─────────────────────────────────────────────────

type SanityBlock =
  | {
      _type: 'block'
      _key: string
      style: string
      listItem?: string
      level?: number
      children: { _type: 'span'; _key: string; text: string; marks?: string[] }[]
      markDefs: unknown[]
    }
  | { _type: 'imagePlaceholder'; _key: string; placement: string }

function toPortableText(body: Article['body']): SanityBlock[] {
  return body.map((item) => {
    if (item.type === 'imageRef') {
      return {
        _type: 'imagePlaceholder',
        _key: randomUUID().slice(0, 12),
        placement: item.placement,
      }
    }
    const key = randomUUID().slice(0, 12)
    const block: SanityBlock = {
      _type: 'block',
      _key: key,
      style: item.style,
      children: [
        {
          _type: 'span',
          _key: `${key}-s`,
          text: item.text,
          ...(item.marks && item.marks.length ? { marks: item.marks } : {}),
        },
      ],
      markDefs: [],
    }
    if (item.listItem) {
      block.listItem = item.listItem
      block.level = 1
    }
    return block
  })
}

// ─── Slug collision handling ──────────────────────────────────────────────────

async function ensureUniqueSlug(slug: string): Promise<string> {
  const existing = await sanity.fetch<string[]>(
    `*[_type == "post" && slug.current match $pattern] { "slug": slug.current }.slug`,
    { pattern: `${slug}*` }
  )
  if (!existing.includes(slug)) return slug
  for (let i = 2; i < 50; i++) {
    const candidate = `${slug}-${i}`
    if (!existing.includes(candidate)) return candidate
  }
  return `${slug}-${Date.now()}`
}

// ─── Assets markdown writer ───────────────────────────────────────────────────

async function writeAssetsFile(slug: string, article: Article) {
  await mkdir(GENERATED_DIR, { recursive: true })
  const path = resolve(GENERATED_DIR, `${slug}-assets.md`)

  const lines: string[] = []
  lines.push(`# ${article.title}`)
  lines.push('')
  lines.push(`**Slug:** \`${slug}\``)
  lines.push(`**Meta Title:** ${article.metaTitle}`)
  lines.push(`**Meta Description:** ${article.metaDescription}`)
  lines.push('')
  lines.push('---')
  lines.push('')
  lines.push('## Gemini Nano Banana — Image Prompts')
  lines.push('')
  lines.push('Paste each prompt into Gemini Nano Banana (Google AI Studio → Gemini 2.5 Flash Image). After generation, upload the hero to Sanity `mainImage` and inline images into the matching `imageRef` placeholder slots in the body.')
  lines.push('')
  article.imagePrompts.forEach((img, i) => {
    lines.push(`### ${i + 1}. ${img.role.toUpperCase()} — \`${img.placement}\` (${img.aspectRatio})`)
    lines.push('')
    lines.push('**Prompt:**')
    lines.push('```')
    lines.push(img.prompt)
    lines.push('```')
    lines.push('')
    lines.push(`**Alt text:** ${img.alt}`)
    lines.push('')
  })
  lines.push('---')
  lines.push('')
  lines.push('## Instagram Caption')
  lines.push('')
  lines.push(article.repurpose.instagramCaption)
  lines.push('')
  lines.push('## Reel Script (60s)')
  lines.push('')
  lines.push(article.repurpose.reelScript)
  lines.push('')
  if (article.internalLinks?.length) {
    lines.push('## Internal Links Suggested')
    lines.push('')
    article.internalLinks.forEach((l) => {
      lines.push(`- **${l.anchor}** → \`${l.targetSlug}\`${l.section ? ` _(in ${l.section})_` : ''}`)
    })
    lines.push('')
  }

  await writeFile(path, lines.join('\n'), 'utf-8')
  return path
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const shouldPublish = args.includes('--publish')
  const keyword = args.filter((arg) => arg !== '--publish').join(' ').trim()
  if (!keyword) {
    console.error('Usage: npx tsx scripts/generate-article.ts [--publish] "<keyword>"')
    process.exit(1)
  }

  console.log(`\n🎯 Generating article for: "${keyword}"\n`)

  console.log('  ↳ Loading Memory OS context…')
  const contextBlock = await loadContextFiles()

  console.log('  ↳ Fetching live Sanity slugs…')
  const liveSlugs = await loadLiveSlugs()

  console.log('  ↳ Calling Claude Opus 4.7 (extended thinking + tool use)…')
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 16000,
    thinking: { type: 'adaptive' } as unknown as Anthropic.ThinkingConfigParam,
    output_config: { effort: 'high' },
    system: buildSystemPrompt(contextBlock, liveSlugs),
    tools: [PUBLISH_ARTICLE_TOOL as unknown as Anthropic.Tool],
    messages: [
      {
        role: 'user',
        content: `Generate a complete SEO article for this target keyword:\n\n"${keyword}"\n\nCall the publish_article tool with the full payload.`,
      },
    ],
  } as unknown as Anthropic.MessageCreateParamsNonStreaming)

  // Log cache usage
  const cacheRead = response.usage?.cache_read_input_tokens ?? 0
  const cacheCreate = response.usage?.cache_creation_input_tokens ?? 0
  console.log(`  ↳ Tokens: in=${response.usage?.input_tokens} out=${response.usage?.output_tokens} cache_read=${cacheRead} cache_create=${cacheCreate}`)

  const toolUse = response.content.find(
    (c): c is Anthropic.ToolUseBlock => c.type === 'tool_use' && c.name === 'publish_article'
  )
  if (!toolUse) {
    console.error('❌ Claude did not call publish_article. Full response:')
    console.error(JSON.stringify(response.content, null, 2))
    process.exit(1)
  }

  console.log('  ↳ Validating output…')

  // Normalise common Portable Text mistakes before validation.
  const rawInput = toolUse.input as { body?: Record<string, unknown>[] } & Record<string, unknown>
  if (Array.isArray(rawInput.body)) {
    rawInput.body = rawInput.body
      .map((item) => {
        if (!item || typeof item !== 'object') return item

        // Fix type: 'h2'/'h3'/'normal'/'bullet'/'number'/'blockquote' → 'block'
        if (typeof item.type === 'string' && ['h2', 'h3', 'normal', 'bullet', 'number', 'blockquote'].includes(item.type)) {
          if (!item.style) item.style = item.type
          item.type = 'block'
        }

        // Fix style: 'bullet'/'number' → style 'normal' + listItem
        if (item.style === 'bullet' || item.style === 'number') {
          item.listItem = item.style
          item.style = 'normal'
        }

        // Default missing style on block items
        if (item.type === 'block' && !item.style) item.style = 'normal'

        // Coerce non-string text: handle array of strings or {text} objects
        if (item.type === 'block' && item.text !== undefined && typeof item.text !== 'string') {
          if (Array.isArray(item.text)) {
            item.text = item.text
              .map((t: unknown) => {
                if (typeof t === 'string') return t
                if (t && typeof t === 'object' && 'text' in (t as Record<string, unknown>)) {
                  return String((t as { text: unknown }).text ?? '')
                }
                return ''
              })
              .join('')
          } else if (item.text && typeof item.text === 'object' && 'text' in (item.text as Record<string, unknown>)) {
            item.text = String((item.text as { text: unknown }).text ?? '')
          } else {
            item.text = String(item.text)
          }
        }

        // imageRef without placement → drop (can't reference anything)
        if (item.type === 'imageRef' && !item.placement) {
          return null
        }

        return item
      })
      .filter((x): x is Record<string, unknown> => x !== null)
  }

  const parsed = ArticleSchema.safeParse(rawInput)
  if (!parsed.success) {
    console.error('❌ Tool output failed validation:')
    console.error(JSON.stringify(parsed.error.issues, null, 2))
    const input = rawInput as { body?: unknown[] }
    if (input?.body?.length) {
      console.error('\nFirst few body items:')
      console.error(JSON.stringify(input.body.slice(0, 10), null, 2))
    }
    process.exit(1)
  }
  const article = parsed.data

  console.log('  ↳ Checking slug collision…')
  const finalSlug = await ensureUniqueSlug(article.slug)
  if (finalSlug !== article.slug) {
    console.log(`     collision: using "${finalSlug}" instead of "${article.slug}"`)
  }

  console.log('  ↳ Converting body to Portable Text…')
  const portableBody = toPortableText(article.body)

  const contentType = /\bvs\b|versus|compare|comparison/i.test(keyword) ? 'comparison' : 'article'
  const documentId = `${shouldPublish ? '' : 'drafts.'}${randomUUID()}`

  console.log(`  ↳ Creating Sanity ${shouldPublish ? 'published post' : 'draft'}…`)
  const doc = await sanity.create({
    _id: documentId,
    _type: 'post',
    title: article.title,
    slug: { _type: 'slug', current: finalSlug },
    category: article.category,
    contentType,
    excerpt: article.excerpt,
    publishedAt: new Date().toISOString(),
    body: portableBody,
    faqs: article.faqs.map((f) => ({
      _key: randomUUID().slice(0, 12),
      _type: 'faqItem',
      question: f.question,
      answer: f.answer,
    })),
    imagePrompts: article.imagePrompts.map((p) => ({
      _key: randomUUID().slice(0, 12),
      _type: 'imagePrompt',
      role: p.role,
      placement: p.placement,
      prompt: p.prompt,
      alt: p.alt,
      aspectRatio: p.aspectRatio,
    })),
    seo: {
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
    },
  })

  console.log('  ↳ Writing assets file…')
  const assetsPath = await writeAssetsFile(finalSlug, article)

  const studioDraftUrl = `https://${SANITY_PROJECT_ID}.sanity.studio/structure/post;${doc._id}`

  console.log('\n✅ Done')
  console.log(`   Slug:        /blog/${finalSlug}`)
  console.log(`   Status:      ${shouldPublish ? 'published' : 'draft'}`)
  console.log(`   Document ID: ${doc._id}`)
  console.log(`   Studio:      ${studioDraftUrl}`)
  console.log(`   Assets file: ${assetsPath}`)
  console.log(`   Word count:  ~${article.body.filter((b) => b.type === 'block').reduce((n, b) => n + ('text' in b ? b.text.split(/\s+/).length : 0), 0)} words`)
  console.log(`   FAQs:        ${article.faqs.length}`)
  console.log(`   Images:      ${article.imagePrompts.length} (${article.imagePrompts.filter((p) => p.role === 'hero').length} hero, ${article.imagePrompts.filter((p) => p.role === 'inline').length} inline)`)
  console.log('')
}

main().catch((err) => {
  console.error('\n❌ Error:', err)
  process.exit(1)
})
