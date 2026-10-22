import mediaCdn from './mediaCdn.json'

// Videos and PDFs live on Sanity's file CDN, not in /public, so they aren't copied into every
// Vercel deployment. Keys are the old /public paths; next.config.ts redirects those paths here.
const urls: Record<string, string> = mediaCdn

export function mediaUrl(path: string) {
  const url = urls[path]
  if (!url) throw new Error(`No CDN copy for ${path}; upload it and add it to lib/mediaCdn.json`)
  return url
}

// Cross-origin links ignore the download attribute, so ask the CDN to send the file as an attachment.
export function mediaDownloadUrl(path: string) {
  return `${mediaUrl(path)}?dl=${encodeURIComponent(path.split('/').pop() ?? '')}`
}
