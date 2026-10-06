// Writes the case-study drafts in content/case-study-drafts.json into Sanity as DRAFTS.
//
//   node scripts/import-case-study-drafts.mjs --dry-run   # show what would change, write nothing
//   node scripts/import-case-study-drafts.mjs             # write drafts (never publishes)
//
// For each project slug it copies the published document to drafts.<id> (or reuses an
// existing draft) and fills only fields that are EMPTY there. Existing content is never
// overwritten. Review and publish in /studio.

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { randomUUID } from 'crypto'
import { readFileSync } from 'fs'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const dryRun = process.argv.includes('--dry-run')
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
const draftsPath = resolve(process.cwd(), 'content/case-study-drafts.json')

function fail(message) {
  console.error(`\n✗ ${message}\n`)
  process.exit(1)
}

if (!projectId) fail('NEXT_PUBLIC_SANITY_PROJECT_ID is missing. Add it to .env.local (see the other scripts in scripts/).')
if (!token && !dryRun) fail('SANITY_API_TOKEN (a write token) is missing from .env.local. Run with --dry-run to preview without it.')

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false, perspective: 'raw' })

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

/** Plain text → Portable Text. Blank lines start a new paragraph. */
function toBlocks(text) {
  return String(text)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => ({
      _type: 'block',
      _key: key(),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: key(), text: p, marks: [] }],
    }))
}

function isEmpty(value) {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) {
    return !value.some((item) => {
      if (item?._type === 'block') return (item.children ?? []).some((c) => String(c?.text ?? '').trim())
      return item && typeof item === 'object' ? Object.keys(item).some((k) => !k.startsWith('_')) : Boolean(item)
    })
  }
  return false
}

// Schema field → how to turn the draft value into a Sanity value (sanity/schemaTypes/project.ts).
const FIELDS = {
  description: (v) => String(v).trim(),
  spaceType: (v) => String(v).trim(),
  problem: toBlocks,
  solution: toBlocks,
  result: toBlocks,
  metrics: (v) =>
    (Array.isArray(v) ? v : [])
      .filter((m) => m?.label && m?.value)
      .map((m) => ({ _type: 'object', _key: key(), label: String(m.label), value: String(m.value) })),
}

function preview(value) {
  if (Array.isArray(value)) {
    if (value[0]?._type === 'block') return value.map((b) => b.children.map((c) => c.text).join('')).join(' / ')
    return value.map((m) => `${m.label}: ${m.value}`).join('; ')
  }
  return value
}

async function main() {
  let drafts
  try {
    drafts = JSON.parse(readFileSync(draftsPath, 'utf8'))
  } catch (error) {
    fail(`Could not read ${draftsPath}: ${error.message}`)
  }

  try {
    await client.fetch('count(*[_type == "project"])')
  } catch (error) {
    fail(
      `Could not reach Sanity (project ${projectId}, dataset ${dataset}): ${error.message}\n` +
        '  Check your internet connection, the project ID and that SANITY_API_TOKEN is valid.',
    )
  }

  console.log(`${dryRun ? 'DRY RUN: nothing will be written.' : 'Writing drafts (nothing is published).'}`)
  console.log(`Project ${projectId} / ${dataset}, ${drafts.length} case studies in ${draftsPath}\n`)

  const summary = { updated: [], unchanged: [], missing: [], failed: [] }

  for (const entry of drafts) {
    const { slug, fields = {} } = entry
    try {
      const published = await client.fetch(
        '*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0]',
        { slug },
      )
      if (!published) {
        summary.missing.push(slug)
        console.log(`- ${slug}: no published project with this slug, skipped`)
        continue
      }
      const draftId = `drafts.${published._id}`
      const existingDraft = await client.fetch('*[_id == $id][0]', { id: draftId })
      const base = existingDraft ?? published

      const set = {}
      const kept = []
      for (const [field, convert] of Object.entries(FIELDS)) {
        if (isEmpty(fields[field])) continue
        if (!isEmpty(base[field])) {
          kept.push(field)
          continue
        }
        const value = convert(fields[field])
        if (!isEmpty(value)) set[field] = value
      }

      const changed = Object.keys(set)
      if (changed.length === 0) {
        summary.unchanged.push(slug)
        console.log(`= ${slug}: nothing to fill${kept.length ? ` (already has ${kept.join(', ')})` : ''}`)
        continue
      }

      console.log(`+ ${slug} → ${draftId}${existingDraft ? ' (existing draft)' : ' (new draft from published)'}`)
      for (const field of changed) console.log(`    ${field}: ${preview(set[field])}`)
      if (kept.length) console.log(`    kept existing: ${kept.join(', ')}`)
      if (entry.needsOwnerInput?.length) console.log(`    needs owner input: ${entry.needsOwnerInput.join('; ')}`)

      if (!dryRun) {
        const tx = client.transaction()
        if (!existingDraft) {
          const { _rev, _updatedAt, _createdAt, ...copy } = published
          tx.createIfNotExists({ ...copy, _id: draftId })
        }
        // Only empty fields are in `set`. On an existing draft, ifRevisionId makes the write fail
        // (instead of overwriting) if someone edited it in Studio since we read it.
        tx.patch(draftId, (p) => (existingDraft ? p.ifRevisionId(existingDraft._rev) : p).set(set))
        await tx.commit({ visibility: 'sync' })
      }
      summary.updated.push(slug)
    } catch (error) {
      summary.failed.push(slug)
      console.log(`✗ ${slug}: ${error.message}`)
    }
  }

  console.log('\nSummary')
  console.log(`  ${dryRun ? 'would update' : 'updated'}: ${summary.updated.length}`)
  console.log(`  nothing to fill: ${summary.unchanged.length}`)
  console.log(`  slug not found: ${summary.missing.length}${summary.missing.length ? ` (${summary.missing.join(', ')})` : ''}`)
  console.log(`  failed: ${summary.failed.length}${summary.failed.length ? ` (${summary.failed.join(', ')})` : ''}`)
  if (!dryRun && summary.updated.length) console.log('\nDrafts are NOT published. Review them in /studio and press Publish on each one you are happy with.')
  if (summary.failed.length) process.exitCode = 1
}

main().catch((error) => fail(error.message))
