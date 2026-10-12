// Site-wide next/image loader (next.config.ts → images.loaderFile).
//
// Vercel's image optimiser is capped at 5,000 transformations a month on Hobby. Once the cap
// is hit it answers 402 and every optimised image on the site breaks, so nothing goes through it:
// - Sanity images are resized by Sanity's own CDN.
// - Local /public files are served from resized WebP copies made by `npm run images`
//   (scripts/image-variants.mjs): the smallest copy at least as wide as the requested width.
//   Files with no copy (new images, static imports, SVGs) are served as-is, with a `w` query so
//   each width still gets its own URL, which Next expects.
import type { ImageLoaderProps } from 'next/image'
import variants from './imageVariants.json'

const VARIANTS: Record<string, number[]> = variants

function localVariant(src: string, width: number) {
  const pathname = src.split('?')[0]
  let decoded: string
  try {
    decoded = decodeURI(pathname)
  } catch {
    return null
  }
  const widths = VARIANTS[decoded]
  const fit = widths?.find((w) => w >= width)
  return fit ? encodeURI(`/_v/${fit}${decoded}.webp`) : null
}

const SANITY_CDN = 'https://cdn.sanity.io/'

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  if (src.startsWith(SANITY_CDN)) {
    const url = new URL(src)
    const params = url.searchParams
    const w = Number(params.get('w'))
    const h = Number(params.get('h'))
    // urlFor often fixes both w and h for a crop; scale h with the requested width so the crop
    // keeps its aspect ratio.
    if (w > 0 && h > 0) params.set('h', String(Math.round((h * width) / w)))
    params.set('w', String(width))
    params.set('q', String(quality || Number(params.get('q')) || 72))
    params.set('auto', 'format')
    return url.toString()
  }

  return localVariant(src, width) ?? `${src}${src.includes('?') ? '&' : '?'}w=${width}`
}
