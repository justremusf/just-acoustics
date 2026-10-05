import type { ShopColourOption } from './types'

export const FLEXI_COLOUR_CHART_SRC = '/assets/shop/standard-flexi/colour-chart-2026-09.png'
// Names and numbered codes transcribed from the supplied September 2026 chart.
export const FLEXI_COLOUR_NAMES = [
  'Beige White 01', 'Stone Grey 02', 'Sand 03', 'Ash 04', 'Pearl 05', 'Silver Mist 06',
  'Frost 07', 'Dove Grey 08', 'Cement 09', 'Rust 10', 'Moss 11', 'Olive 12',
  'Yellow 13', 'Amber 14', 'Walnut 15', 'Terracotta 16', 'Crimson 17', 'Magenta 18',
  'Burgundy 19', 'Plum 20', 'Mint 21', 'Sky Blue 22', 'Aqua 23', 'Charcoal 24',
  'Slate 25', 'Grey Linen 26', 'Powder Blue 27', 'Ocean Blue 28', 'Blue 29', 'Dark Blue 30',
  'Navy 31', 'Light grey 32', 'Steel 33', 'Blue grey 34', 'Anchor Grey 35', 'Onyx 36',
  'Navy Grey 37', 'Dark Grey 38', 'Pitch Black 39',
] as const

// Display a fabric-only region of the original image: no recolouring or generated textures.
// Source dimensions are 916 × 1062. Each 60px square sits inside its photographed patch.
const centresX = [106, 247.5, 389, 530, 672, 813]
const centresY = [200, 323, 446, 568.5, 691.5, 814.5, 937.5]
export const STANDARD_FLEXI_COLOURS: ShopColourOption[] = FLEXI_COLOUR_NAMES.map((name, index) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  swatchSrc: FLEXI_COLOUR_CHART_SRC,
  swatchRegion: { x: centresX[index % 6] - 30, y: centresY[Math.floor(index / 6)] - 30, width: 60, height: 60, imageWidth: 916, imageHeight: 1062 },
  priceAdjustment: 0,
  available: true,
}))

export const FLEXI_VISIBLE_COLOUR_IDS = [
  'beige-white-01', 'pearl-05', 'terracotta-16', 'magenta-18', 'sky-blue-22',
  'aqua-23', 'grey-linen-26', 'blue-grey-34', 'pitch-black-39',
]
