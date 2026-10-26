// Studio in a Box: fixed-price, installed acoustic packs for small rooms.
// DRAFT prices for Remus to approve. The maths behind every number is in
// JA Assistant/out/studio-in-a-box/packages.md (supplier PIs, price book, HRD rate card, won deals).
// Plain module: shared by the pages, the configurator and the booking API (server re-prices from here).

export type PanelKind = 'wall-1200' | 'wall-1800' | 'bass-100' | 'cloud-1200'
export type SurfaceId = 'back' | 'left' | 'right' | 'ceiling'
export type RoomUse = 'home' | 'office'

export type PanelSpec = {
  kind: PanelKind
  qty: number
  /** Customer-facing line, sentence case. */
  label: string
  /** Where they go, in plain words. */
  where: string
}

export type StudioPack = {
  id: string
  name: string
  /** One line under the name. */
  tagline: string
  price: number
  /** What the same scope costs at today's per-panel rates plus S$75 delivery (for the internal table, not shown as a "was" price). */
  rateCardTotal: number
  panels: PanelSpec[]
  /** Largest floor area (m²) the pack is designed for, with a ceiling up to 3 m. */
  maxFloorM2: number
  /** Echo-time goal for this kind of room (seconds, mid frequencies). */
  targetRt60: number
  use: RoomUse
  roomTypes: string[]
  intro: string
  goodFor: string[]
  /** Case-study slugs in Sanity (no locations shown). Ordered by best fit. */
  projectSlugs: string[]
  /** Typical room used for the headline RT60 figure. */
  typicalRoom: { label: string; lengthM: number; widthM: number; heightM: number }
}

export const PANEL_INFO: Record<PanelKind, { name: string; size: string; rate: number; areaM2: number; ceiling: boolean; wMm: number; hMm: number; tMm: number }> = {
  'wall-1200': { name: 'Fabric wrapped wall panel', size: '1200 × 600 × 50 mm', rate: 185, areaM2: 0.72, ceiling: false, wMm: 600, hMm: 1200, tMm: 50 },
  'wall-1800': { name: 'Fabric wrapped tall wall panel', size: '1800 × 600 × 50 mm', rate: 245, areaM2: 1.08, ceiling: false, wMm: 600, hMm: 1800, tMm: 50 },
  'bass-100': { name: 'Fabric wrapped bass trap', size: '1200 × 600 × 100 mm', rate: 245, areaM2: 0.72, ceiling: false, wMm: 1200, hMm: 600, tMm: 100 },
  'cloud-1200': { name: 'Fabric wrapped ceiling cloud', size: '1200 × 600 × 50 mm', rate: 245, areaM2: 0.72, ceiling: true, wMm: 1200, hMm: 600, tMm: 50 },
}

export const DELIVERY_SGD = 75
/** Office after-hours install (HRD charges +S$10–25 per panel after 3pm Sat / 10pm). Draft. */
export const AFTER_HOURS_PER_PANEL = 25
/** Extra wall panels a buyer can add to a pack, at the pack's own wall-panel rate. */
export const MAX_EXTRA_PANELS = 4

export const STUDIO_PACKS: StudioPack[] = [
  {
    id: 'home-office',
    name: 'Home Office',
    tagline: 'Clearer calls from a small study or bedroom office.',
    price: 990,
    rateCardTotal: 4 * 245 + DELIVERY_SGD,
    panels: [
      { kind: 'wall-1800', qty: 4, label: '4 tall fabric wrapped wall panels', where: '2 on the wall in front of your desk, 1 on each side wall beside you' },
    ],
    maxFloorM2: 10,
    targetRt60: 0.7,
    use: 'home',
    roomTypes: ['home-office'],
    intro: 'Four tall panels take the hollow, echoey sound out of a small room, so you sound closer and clearer on Zoom and Teams, and the room feels calmer to work in.',
    goodFor: ['Video calls and online teaching', 'HDB or condo study rooms', 'Rooms up to about 10 m²'],
    projectSlugs: ['home-double-office', 'home-office-studio', 'home-office'],
    typicalRoom: { label: '3.0 × 3.3 m bedroom office', lengthM: 3.3, widthM: 3.0, heightM: 2.6 },
  },
  {
    id: 'home-studio',
    name: 'Home Studio',
    tagline: 'A bedroom music room that sounds tight, not boxy.',
    price: 1490,
    rateCardTotal: 8 * 185 + DELIVERY_SGD,
    panels: [
      { kind: 'wall-1200', qty: 8, label: '8 fabric wrapped wall panels', where: '2 on each side of your desk or instrument at ear height, 4 on the back wall' },
    ],
    maxFloorM2: 12,
    targetRt60: 0.6,
    use: 'home',
    roomTypes: ['home-studio', 'music-room'],
    intro: 'Our most common small job: eight panels placed where the first reflections hit, so practice, recording and mixing in a bedroom stop sounding like a bathroom.',
    goodFor: ['Bedroom studios and music practice rooms', 'Guitar, keys, vocals and streaming', 'Rooms up to about 12 m²'],
    projectSlugs: ['drum-practice-room', 'guitar-practice-studio', 'mixing-studio'],
    typicalRoom: { label: '3.2 × 3.6 m bedroom', lengthM: 3.6, widthM: 3.2, heightM: 2.6 },
  },
  {
    id: 'podcast-room',
    name: 'Podcast Room',
    tagline: 'Dry, close voice for podcasts, voice-over and video.',
    price: 1590,
    rateCardTotal: 6 * 185 + 2 * 245 + DELIVERY_SGD,
    panels: [
      { kind: 'wall-1200', qty: 6, label: '6 fabric wrapped wall panels', where: 'around the table at seated head height, 2 on each of three walls' },
      { kind: 'cloud-1200', qty: 2, label: '2 fabric wrapped ceiling clouds', where: 'above the table, hung on cables' },
    ],
    maxFloorM2: 10,
    targetRt60: 0.5,
    use: 'home',
    roomTypes: ['podcast'],
    intro: 'Voices bounce off the table, the walls and the ceiling. Wall panels at head height plus two clouds over the table give you the dry, close sound listeners expect.',
    goodFor: ['Podcasts with one to three hosts', 'Voice-over, YouTube and streaming', 'Rooms up to about 10 m²'],
    projectSlugs: ['podcast-office', 'podcast-studio'],
    typicalRoom: { label: '3.0 × 3.2 m room', lengthM: 3.2, widthM: 3.0, heightM: 2.6 },
  },
  {
    id: 'studio-pro',
    name: 'Studio Pro',
    tagline: 'Mixing rooms, drum practice and home theatres, with bass control.',
    price: 2890,
    rateCardTotal: 12 * 245 + DELIVERY_SGD,
    panels: [
      { kind: 'wall-1800', qty: 6, label: '6 tall fabric wrapped wall panels', where: 'side walls at the first reflection points and the back wall' },
      { kind: 'bass-100', qty: 4, label: '4 fabric wrapped bass traps (100 mm)', where: 'along the top corners, flush to the ceiling, front and back' },
      { kind: 'cloud-1200', qty: 2, label: '2 fabric wrapped ceiling clouds', where: 'above your listening or mixing position' },
    ],
    maxFloorM2: 16,
    targetRt60: 0.5,
    use: 'home',
    roomTypes: ['mixing', 'home-theatre', 'drums'],
    intro: 'Thick bass traps in the corners, tall panels at the reflection points and clouds overhead. For rooms where low end matters: mixing, drums and films.',
    goodFor: ['Mixing and recording rooms', 'Home theatres and listening rooms', 'Rooms up to about 16 m²'],
    projectSlugs: ['music-studio', 'mixing-recording-studio', 'home-theatre'],
    typicalRoom: { label: '3.6 × 4.2 m room', lengthM: 4.2, widthM: 3.6, heightM: 2.8 },
  },
  {
    id: 'meeting-room',
    name: 'Meeting Room',
    tagline: 'A small office meeting room where everyone hears clearly.',
    price: 1990,
    rateCardTotal: 8 * 245 + DELIVERY_SGD,
    panels: [
      { kind: 'wall-1800', qty: 8, label: '8 tall fabric wrapped wall panels', where: '4 on each long wall, staggered so no bare wall faces another' },
    ],
    maxFloorM2: 20,
    targetRt60: 0.8,
    use: 'office',
    roomTypes: ['meeting-room'],
    intro: 'For six- to eight-seat rooms that ring when people talk. Eight tall panels on the long walls make calls and meetings easier to follow.',
    goodFor: ['Meeting rooms for 6 to 8 people', 'Hybrid calls with a room speaker', 'Rooms up to about 20 m²'],
    projectSlugs: ['proteus-design-tech', 'hoogwegt', 'amazon-office-meeting-room'],
    typicalRoom: { label: '4 × 5 m meeting room', lengthM: 5, widthM: 4, heightM: 2.7 },
  },
]

export const ROOM_TYPES: { id: string; label: string; packId: string }[] = [
  { id: 'home-studio', label: 'Home studio', packId: 'home-studio' },
  { id: 'music-room', label: 'Bedroom music room', packId: 'home-studio' },
  { id: 'podcast', label: 'Podcast room', packId: 'podcast-room' },
  { id: 'home-office', label: 'Home office', packId: 'home-office' },
  { id: 'home-theatre', label: 'Home theatre', packId: 'studio-pro' },
  { id: 'mixing', label: 'Mixing or recording room', packId: 'studio-pro' },
  { id: 'drums', label: 'Drum practice room', packId: 'studio-pro' },
  { id: 'meeting-room', label: 'Office meeting room', packId: 'meeting-room' },
]

export const ROOM_SIZES: { id: string; label: string; detail: string; lengthM: number; widthM: number }[] = [
  { id: 's', label: 'Small', detail: 'about 3.0 × 3.0 m, like an HDB common bedroom', lengthM: 3.0, widthM: 3.0 },
  { id: 'm', label: 'Medium', detail: 'about 3.2 × 3.6 m, like a master bedroom', lengthM: 3.6, widthM: 3.2 },
  { id: 'l', label: 'Large', detail: 'about 3.6 × 4.2 m, a big bedroom or study', lengthM: 4.2, widthM: 3.6 },
  { id: 'xl', label: 'Extra large', detail: 'about 4 × 5 m, a meeting room or den', lengthM: 5, widthM: 4 },
]

export const INCLUDED = [
  'All panels, made to order in your colour',
  'Delivery and installation by our own install team',
  'Layout planned from your room size or photos',
  'Wall fixings, ceiling cables and clean-up',
]

export const EXCLUDED = [
  'Soundproofing (stopping sound getting in or out)',
  'Ceilings above 3 m, glass walls and partitions',
  'Removing old panels, electrical or aircon work',
  'Sundays and public holidays',
]

export function getPack(id: string) {
  return STUDIO_PACKS.find((pack) => pack.id === id)
}

export function panelCount(pack: StudioPack) {
  return pack.panels.reduce((sum, line) => sum + line.qty, 0)
}

/** The wall-panel type used for add-on panels (the pack's first wall line). */
export function extraPanelKind(pack: StudioPack): PanelKind {
  const wall = pack.panels.find((line) => !PANEL_INFO[line.kind].ceiling && line.kind !== 'bass-100')
  return wall?.kind ?? 'wall-1200'
}

// ─── Echo time (RT60) ─────────────────────────────────────────────────────────
// Same basis as the JA proposal calculator (ja-proposal/scripts/calculate_tiers.py): Sabine, mid-point of
// surface coefficient ranges (tile floor, painted concrete walls and ceiling), a furnishings allowance per m²
// of floor ("soft" for furnished homes, "normal" for meeting rooms), panels at an effective alpha of 0.90.
// 100 mm bass traps are counted as 50 mm (the thickest with lab data), so their effect is understated.
const ALPHA = { floor: 0.03, walls: 0.03, ceilingConcrete: 0.03, ceilingBoard: 0.06 }
const FURNISHING = { home: 0.15, office: 0.075 }
const PANEL_ALPHA = 0.9

export function estimateRt60(pack: StudioPack, room: { lengthM: number; widthM: number; heightM: number }, extraPanels = 0) {
  const floor = room.lengthM * room.widthM
  const walls = 2 * (room.lengthM + room.widthM) * room.heightM
  const volume = floor * room.heightM
  const ceilingAlpha = pack.use === 'office' ? ALPHA.ceilingBoard : ALPHA.ceilingConcrete
  const existing = floor * ALPHA.floor + walls * ALPHA.walls + floor * ceilingAlpha + floor * FURNISHING[pack.use]
  const panelArea = pack.panels.reduce((sum, line) => sum + PANEL_INFO[line.kind].areaM2 * line.qty, 0) + PANEL_INFO[extraPanelKind(pack)].areaM2 * extraPanels
  const before = (0.161 * volume) / existing
  const after = (0.161 * volume) / (existing + panelArea * PANEL_ALPHA)
  return { before: Math.round(before * 100) / 100, after: Math.round(after * 100) / 100, floorM2: Math.round(floor * 10) / 10 }
}

export function packFits(pack: StudioPack, room: { lengthM: number; widthM: number; heightM: number }, extraPanels = 0) {
  if (room.heightM > 3) return { ok: false as const, reason: 'ceiling' as const }
  const { after, floorM2 } = estimateRt60(pack, room, extraPanels)
  if (floorM2 > pack.maxFloorM2 + 0.5 && after > pack.targetRt60 + 0.05) return { ok: false as const, reason: 'size' as const }
  return { ok: true as const, reason: null }
}

// ─── Price (the server uses the same function) ────────────────────────────────
export type PriceInput = { packId: string; extraPanels: number; afterHours: boolean }

export function pricePack({ packId, extraPanels, afterHours }: PriceInput) {
  const pack = getPack(packId)
  if (!pack) throw new Error('Unknown pack')
  const extras = Math.max(0, Math.min(MAX_EXTRA_PANELS, Math.round(extraPanels)))
  const extraRate = PANEL_INFO[extraPanelKind(pack)].rate
  const panels = panelCount(pack) + extras
  const afterHoursCost = afterHours && pack.use === 'office' ? panels * AFTER_HOURS_PER_PANEL : 0
  const total = pack.price + extras * extraRate + afterHoursCost
  return {
    pack,
    extras,
    extraRate,
    panels,
    afterHoursCost,
    total,
    deposit: Math.round(total / 2),
    balance: total - Math.round(total / 2),
  }
}

export function formatPrice(value: number) {
  return `S$${value.toLocaleString('en-SG', { maximumFractionDigits: 0 })}`
}
