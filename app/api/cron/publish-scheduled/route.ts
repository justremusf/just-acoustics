import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { serverClient } from '@/sanity/lib/serverClient'

// Daily Vercel cron (vercel.json). Publishes any draft project whose "Release date" (publishAt) has
// passed. Sanity's own Scheduled Publishing needs a paid plan, so release dates live on the draft and
// can be changed or cleared in the Studio. A draft with no release date is never published here.
export async function GET(req: NextRequest) {
  const expected = `Bearer ${process.env.CRON_SECRET || ''}`
  const actual = req.headers.get('authorization') || ''
  if (!process.env.CRON_SECRET || actual.length !== expected.length || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const due: Array<Record<string, unknown> & { _id: string; title?: string }> = await serverClient.fetch(
      `*[_type == "project" && _id in path("drafts.**") && defined(publishAt) && publishAt <= now()]`,
    )

    const published: string[] = []
    for (const draft of due) {
      const publishedId = draft._id.replace(/^drafts\./, '')
      // Copy the draft over the live document without the system fields or the release date,
      // then remove the draft, in one transaction.
      const doc: Record<string, unknown> = { ...draft, _id: publishedId }
      for (const field of ['_rev', '_createdAt', '_updatedAt', 'publishAt']) delete doc[field]
      await serverClient.transaction().createOrReplace(doc as { _id: string; _type: string }).delete(draft._id).commit()
      published.push(draft.title || publishedId)
    }

    if (published.length) revalidatePath('/', 'layout')
    return NextResponse.json({ published }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Scheduled publish failed', error)
    return NextResponse.json({ error: 'Scheduled publish failed; it will retry tomorrow.' }, { status: 503 })
  }
}
