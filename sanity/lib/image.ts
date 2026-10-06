import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Built from the project config rather than the Sanity client so that client
// components using urlFor don't ship @sanity/client. Same projectId/dataset as
// sanity/lib/client.ts; base URL is the default https://cdn.sanity.io, exactly
// what the builder derives from the client's default apiHost.
const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
})

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').quality(72)
}
