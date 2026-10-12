// Drop-in replacement for next/image. Sanity images used to need their own loader here; the
// site-wide loader in lib/imageLoader.ts (set in next.config.ts) now handles them and every
// other image, so this simply re-exports next/image for existing imports.
export { default } from 'next/image'
