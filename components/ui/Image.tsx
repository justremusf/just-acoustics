'use client'

// Drop-in replacement for next/image.
//
// Sanity images are resized by Sanity's own CDN (via the loader below) instead
// of Vercel's image optimiser, so they don't eat Vercel's monthly
// transformation quota (5,000 on Hobby). Local /public images and static
// imports still go through Vercel as before.
//
// Client component because the loader is a function, which can't be passed
// from a server component straight into next/image.
import NextImage, { type ImageLoader, type ImageProps } from 'next/image'

const SANITY_CDN = 'https://cdn.sanity.io/'

const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src)
  const params = url.searchParams
  const w = Number(params.get('w'))
  const h = Number(params.get('h'))
  // urlFor often fixes both w and h for a crop; scale h with the requested
  // width so the crop keeps its aspect ratio.
  if (w > 0 && h > 0) params.set('h', String(Math.round((h * width) / w)))
  params.set('w', String(width))
  params.set('q', String(quality || Number(params.get('q')) || 72))
  params.set('auto', 'format')
  return url.toString()
}

export default function Image(props: ImageProps) {
  const isSanity = typeof props.src === 'string' && props.src.startsWith(SANITY_CDN)
  return <NextImage {...props} loader={isSanity && !props.unoptimized ? sanityLoader : props.loader} />
}
