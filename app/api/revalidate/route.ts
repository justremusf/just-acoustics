import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Sanity calls this on publish so edits go live straight away. Pages otherwise rebuild daily
// (revalidate = 86400), which keeps ISR writes and CPU inside Vercel's included usage.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'SANITY_REVALIDATE_SECRET is not set' }, { status: 500 })
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: { current?: string } | string }>(req, secret)

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Invalid Sanity signature' }, { status: 401 })
    }

    // Articles publish several times a day, so refresh only the pages that list them. Other
    // posts' related-reading lists catch up on their daily rebuild.
    const slug = typeof body?.slug === 'string' ? body.slug : body?.slug?.current
    if (body?._type === 'post' && slug) {
      for (const path of [`/blog/${slug}`, '/blog', '/', '/sitemap.xml']) revalidatePath(path)
      return NextResponse.json({ revalidated: true, type: 'post', slug })
    }

    // Other documents feed several pages each (testimonials and site settings appear site-wide),
    // so refresh the whole site rather than mapping types to routes. These publishes are rare.
    revalidatePath('/', 'layout')

    return NextResponse.json({ revalidated: true, type: body?._type ?? null })
  } catch (error) {
    console.error('Sanity revalidate webhook failed', error)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
