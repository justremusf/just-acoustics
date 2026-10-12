// Generates resized WebP copies of every raster image in /public, for lib/imageLoader.ts.
//
// Vercel's image optimiser is off (Hobby quota), so without this every <Image> of a local file
// downloads the full original whatever its display size. Run after adding or changing images:
//   npm run images
// Output: public/_v/<width>/<path>.webp plus lib/imageVariants.json (which widths exist per file).
// The loader only points at widths listed in the manifest, so an image added without running this
// still works; it just serves the original.
import { readdir, stat, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const OUT = path.join(PUBLIC, '_v')
const MANIFEST = path.join(ROOT, 'lib', 'imageVariants.json')
// Keep in step with images.deviceSizes in next.config.ts so each srcset width maps cleanly.
const WIDTHS = [480, 768, 1280, 1920]
const RASTER = /\.(jpe?g|png|webp|avif)$/i

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (full !== OUT) yield* walk(full)
    } else if (RASTER.test(entry.name)) {
      yield full
    }
  }
}

async function isFresh(target, sourceMtime) {
  try {
    return (await stat(target)).mtimeMs >= sourceMtime
  } catch {
    return false
  }
}

const manifest = {}
let written = 0
for await (const file of walk(PUBLIC)) {
  const rel = '/' + path.relative(PUBLIC, file).split(path.sep).join('/')
  const { mtimeMs } = await stat(file)
  const { width } = await sharp(file).metadata()
  if (!width) continue
  // Only widths meaningfully smaller than the original; larger requests get the original.
  const widths = WIDTHS.filter((w) => w < width * 0.9)
  if (!widths.length) continue
  for (const w of widths) {
    const target = path.join(OUT, String(w), rel.slice(1) + '.webp')
    if (await isFresh(target, mtimeMs)) continue
    await mkdir(path.dirname(target), { recursive: true })
    await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(target)
    written++
  }
  manifest[rel] = widths
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)))
await writeFile(MANIFEST, JSON.stringify(sorted, null, 1) + '\n')
console.log(`image variants: ${Object.keys(sorted).length} images, ${written} files written`)
