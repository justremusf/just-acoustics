import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { getColour } from '@/lib/studioBox/colours'
import { paymentMode, studioBoxEnabled } from '@/lib/studioBox/flags'
import { layoutFor, placementNotes } from '@/lib/studioBox/layout'
import { bookingReference, bookingSchema, validateBooking } from '@/lib/studioBox/request'
import { earliestInstall, sgToday, toIso } from '@/lib/studioBox/schedule'

export const runtime = 'nodejs'

const NO_STORE = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }
const fail = (error: string, status: number) => NextResponse.json({ error }, { status, headers: NO_STORE })
const mask = (value: string) => (value.length <= 4 ? '••••' : `${value.slice(0, 2)}••••${value.slice(-2)}`)

// Studio in a Box booking REQUEST. Draft endpoint: it takes no payment and sends nothing.
// It re-prices on the server, checks the slot rules, logs one structured line (contact details masked) and,
// only when STUDIO_BOX_STORE=1, saves the full request to Neon for the JA Assistant to pick up
// (JA Assistant/studio_box/booking.py). The buyer gets a reference to quote on WhatsApp.
export async function POST(request: Request) {
  if (!studioBoxEnabled()) return fail('Not found', 404)
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) return fail('Invalid origin', 403)

  const parsed = bookingSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return fail('Please check the highlighted details and try again.', 400)
  const input = parsed.data
  if (input.website) return NextResponse.json({ reference: bookingReference(), status: 'received' }, { headers: NO_STORE })

  const checked = validateBooking(input, sgToday())
  if ('error' in checked) return fail(checked.error ?? 'Please check your details.', 400)
  const { pack, price } = checked

  const reference = bookingReference()
  const room = { widthMm: Math.round(input.room.widthM * 1000), lengthMm: Math.round(input.room.lengthM * 1000), heightMm: Math.round(input.room.heightM * 1000) }
  const record = {
    reference,
    requestId: input.requestId,
    receivedAt: new Date().toISOString(),
    status: 'requested',
    packId: pack.id,
    packName: pack.name,
    roomType: input.roomType,
    room: input.room,
    colour: getColour(input.colourId)?.name,
    accent: input.accentId ? getColour(input.accentId)?.name : undefined,
    extraPanels: price.extras,
    panels: price.panels,
    placement: placementNotes(layoutFor(pack, room, price.extras)),
    property: input.property,
    slot: input.slot,
    backupDate: input.backupDate,
    earliestAtRequest: toIso(earliestInstall(sgToday())),
    total: price.total,
    deposit: price.deposit,
    afterHoursCost: price.afterHoursCost,
    paymentMode: paymentMode(),
    contact: input.contact,
    attribution: input.attribution ?? {},
  }

  console.log('[studio-box-request]', JSON.stringify({ ...record, contact: { name: mask(input.contact.name), phone: mask(input.contact.phone), email: mask(input.contact.email), postalCode: input.contact.postalCode.slice(0, 2) + '••••' } }))

  if (process.env.STUDIO_BOX_STORE === '1' && process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL)
      await sql`CREATE TABLE IF NOT EXISTS ja_studio_box_requests (reference text PRIMARY KEY, request_id text UNIQUE, created_at timestamptz DEFAULT now(), status text NOT NULL, data jsonb NOT NULL)`
      const rows = await sql`INSERT INTO ja_studio_box_requests (reference, request_id, status, data) VALUES (${reference}, ${input.requestId}, 'requested', ${JSON.stringify(record)}::jsonb)
        ON CONFLICT (request_id) DO UPDATE SET request_id = EXCLUDED.request_id RETURNING reference`
      record.reference = rows[0]?.reference ?? reference
    } catch {
      console.error('[studio-box-request] could not save to Neon; the log line above holds the request.')
    }
  }

  return NextResponse.json(
    { reference: record.reference, status: 'requested', total: price.total, deposit: price.deposit, paymentMode: record.paymentMode },
    { headers: NO_STORE },
  )
}
