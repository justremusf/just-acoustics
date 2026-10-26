import { STANDARD_FLEXI_COLOURS } from '@/lib/flexiColours'

// Mean colour of each patch on the September 2026 Flexi chart photo (public/assets/shop/standard-flexi/
// colour-chart-2026-09.png), sampled from the same 40 px centre used for the swatch crops. Only used to
// tint the layout illustration; the picker shows the real photographed swatch.
const CHART_HEX: Record<string, string> = {
  'beige-white-01': '#dbdcdb', 'stone-grey-02': '#b1aaa6', 'sand-03': '#c8bca9', 'ash-04': '#b4b0aa',
  'pearl-05': '#c9c6c7', 'silver-mist-06': '#c9c5c3', 'frost-07': '#cac9ca', 'dove-grey-08': '#a79d97',
  'cement-09': '#9c9491', 'rust-10': '#847974', 'moss-11': '#8e9456', 'olive-12': '#9f9465',
  'yellow-13': '#c7a78f', 'amber-14': '#ac8b4e', 'walnut-15': '#896e5a', 'terracotta-16': '#d37a36',
  'crimson-17': '#c8462a', 'magenta-18': '#df4250', 'burgundy-19': '#953e50', 'plum-20': '#8e4f6e',
  'mint-21': '#c3eadf', 'sky-blue-22': '#98dad9', 'aqua-23': '#98d2ca', 'charcoal-24': '#84adb9',
  'slate-25': '#94a19e', 'grey-linen-26': '#a0b1b1', 'powder-blue-27': '#88a9b1', 'ocean-blue-28': '#43758d',
  'blue-29': '#507698', 'dark-blue-30': '#537585', 'navy-31': '#274261', 'light-grey-32': '#b0b6c2',
  'steel-33': '#7e8283', 'blue-grey-34': '#9fabaf', 'anchor-grey-35': '#5c6166', 'onyx-36': '#83807b',
  'navy-grey-37': '#4e636c', 'dark-grey-38': '#374240', 'pitch-black-39': '#2f3533',
}

export const STUDIO_COLOURS = STANDARD_FLEXI_COLOURS.map((colour) => ({
  ...colour,
  id: colour.id as string,
  name: colour.name as string,
  hex: CHART_HEX[colour.id as string] ?? '#b1aaa6',
  code: `HC817-${(colour.name as string).slice(-2)}`,
}))

export type StudioColour = (typeof STUDIO_COLOURS)[number]

/** Shown first: the colours small rooms are actually quoted in (Zoho Books, 2025–26), then strong accents. */
export const POPULAR_COLOUR_IDS = [
  'stone-grey-02', 'beige-white-01', 'pearl-05', 'sand-03', 'light-grey-32', 'blue-grey-34',
  'anchor-grey-35', 'navy-31', 'pitch-black-39', 'terracotta-16', 'olive-12', 'ocean-blue-28',
]

export const DEFAULT_COLOUR_ID = 'stone-grey-02'

export function getColour(id: string | undefined) {
  return STUDIO_COLOURS.find((colour) => colour.id === id)
}
