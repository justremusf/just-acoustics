import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Sanity calls this on publish so edits go live straight away. Pages otherwise rebuild hourly
// (revalidate = 3600), which keeps ISR writes and CPU inside Vercel's included usage.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'SANITY_REVALIDATE_SECRET is not set' }, { status: 500 })
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret)

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Invalid Sanity signature' }, { status: 401 })
    }

    // Documents feed several pages each (testimonials and site settings appear site-wide),
    // so refresh the whole site rather than mapping types to routes. Publishes are rare.
    revalidatePath('/', 'layout')

    return NextResponse.json({ revalidated: true, type: body?._type ?? null })
  } catch (error) {
    console.error('Sanity revalidate webhook failed', error)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
