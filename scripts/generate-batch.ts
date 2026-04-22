import { readFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const keywordsPath = resolve(__dirname, 'keywords.txt')
const generateScript = resolve(__dirname, 'generate-article.ts')

const keywords = readFileSync(keywordsPath, 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))

const DELAY_MS = 10_000

function runOne(keyword: string): Promise<{ keyword: string; ok: boolean }> {
  return new Promise((resolvePromise) => {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`▶ ${keyword}`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    const child = spawn('npx', ['tsx', generateScript, keyword], {
      stdio: 'inherit',
      cwd: resolve(__dirname, '..'),
    })
    child.on('exit', (code) => resolvePromise({ keyword, ok: code === 0 }))
  })
}

;(async () => {
  console.log(`Batch: ${keywords.length} keywords, ~${DELAY_MS / 1000}s delay between runs.\n`)
  const results: { keyword: string; ok: boolean }[] = []
  for (let i = 0; i < keywords.length; i++) {
    const kw = keywords[i]
    const res = await runOne(kw)
    results.push(res)
    if (i < keywords.length - 1) {
      await new Promise((r) => setTimeout(r, DELAY_MS))
    }
  }

  console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Batch complete.`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  const ok = results.filter((r) => r.ok)
  const fail = results.filter((r) => !r.ok)
  console.log(`✅ ${ok.length} succeeded`)
  if (fail.length) {
    console.log(`❌ ${fail.length} failed:`)
    fail.forEach((r) => console.log(`   - ${r.keyword}`))
  }
})()
