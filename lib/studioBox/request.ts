// Booking-request contract shared by the configurator and /api/studio-box/request.
import { z } from 'zod'
import { getColour } from './colours'
import { getPack, MAX_EXTRA_PANELS, packFits, pricePack, ROOM_SIZES } from './packages'
import { isValidSlot, type PropertyType, type SlotTime } from './schedule'

export const bookingSchema = z.object({
  requestId: z.string().regex(/^[a-zA-Z0-9-]{12,64}$/),
  packId: z.string().max(40),
  roomType: z.string().max(40),
  room: z.object({
    sizeId: z.string().max(10).optional(),
    lengthM: z.number().min(1.5).max(12),
    widthM: z.number().min(1.5).max(12),
    heightM: z.number().min(2).max(6),
    sendPhotos: z.boolean(),
  }),
  colourId: z.string().max(40),
  accentId: z.string().max(40).optional(),
  extraPanels: z.number().int().min(0).max(MAX_EXTRA_PANELS),
  property: z.enum(['hdb', 'condo', 'landed', 'office']),
  slot: z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), time: z.enum(['morning', 'afternoon', 'evening']) }),
  backupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  contact: z.object({
    name: z.string().trim().min(2).max(80),
    phone: z.string().trim().regex(/^\+?[0-9 ]{8,16}$/),
    email: z.string().trim().email().max(120),
    postalCode: z.string().trim().regex(/^\d{6}$/),
    notes: z.string().trim().max(600).optional(),
  }),
  attribution: z.record(z.string(), z.string().max(300)).optional(),
  /** Honeypot: real visitors never fill it. */
  website: z.string().max(0).optional(),
})

export type BookingInput = z.infer<typeof bookingSchema>

/** Server-side checks beyond the schema. Returns the authoritative price or an error for the visitor. */
export function validateBooking(input: BookingInput, todayIso?: string) {
  const pack = getPack(input.packId)
  if (!pack) return { error: 'That pack is no longer available. Please reload the page.' } as const
  if (!getColour(input.colourId) || (input.accentId && !getColour(input.accentId))) return { error: 'Please pick a colour from the chart.' } as const
  if (input.room.sizeId && !ROOM_SIZES.some((size) => size.id === input.room.sizeId)) return { error: 'Please pick a room size.' } as const
  if (input.room.heightM > 3) return { error: 'Ceilings above 3 m need a site check, so we quote those separately.' } as const
  if (!packFits(pack, input.room, input.extraPanels).ok) return { error: `This room is larger than the ${pack.name} pack covers. Please pick a bigger pack or ask us for a quote.` } as const
  if (input.slot.time === 'evening' && input.property !== 'office') return { error: 'After-hours installs are for offices only.' } as const
  if (!isValidSlot(input.slot.date, input.slot.time as SlotTime, input.property as PropertyType, todayIso)) {
    return { error: 'That install slot is no longer available. Please pick another day.' } as const
  }
  const price = pricePack({ packId: pack.id, extraPanels: input.extraPanels, afterHours: input.slot.time === 'evening' })
  return { pack, price } as const
}

export function bookingReference(now = new Date()) {
  const day = new Date(now.getTime() + 8 * 3_600_000).toISOString().slice(2, 10).replaceAll('-', '')
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(3)), (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()
  return `SIB-${day}-${rand}`
}
