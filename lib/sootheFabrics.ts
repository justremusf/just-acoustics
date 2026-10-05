import type { ShopColourOption } from './types';

export const SOOTHE_FABRIC_CHARTS = {
  '8080': '/assets/shop/soothe/weave-8080-2026-09.jpeg',
  '2020': '/assets/shop/soothe/weave-2020-2026-09.jpeg',
} as const;

// Original chart pixels: explicit cells preserve the intentional gaps in both charts.
function createSeries(series: keyof typeof SOOTHE_FABRIC_CHARTS, fabrics: Array<[string, string, number, number]>): ShopColourOption[] {
  const columns = series === '8080' ? [164, 362, 561, 759, 957] : [171, 370, 567, 765, 963];
  const rows = series === '8080' ? [110, 309, 508, 706, 906, 1105] : [87, 286, 484, 683, 882, 1082];
  return fabrics.map(([name, code, row, column]) => ({
    id: code, name: `${name} ${code}`, description: `${series} Series fabric`, fabricSeries: series,
    swatchSrc: SOOTHE_FABRIC_CHARTS[series],
    swatchRegion: { x: columns[column] - 60, y: rows[row] - 60, width: 120, height: 120, imageWidth: 1080, imageHeight: series === '8080' ? 1233 : 1202 },
    priceAdjustment: 0, available: true,
  }));
}

export const SOOTHE_FABRICS = [
  ...createSeries('8080', [
    ['Steel', '8080-11', 0, 0],
    ['Moonstone', '8080-12', 0, 1],
    ['Aqua', '8080-03', 0, 2],
    ['Illume Green', '8080-29', 0, 3],
    ['Winter', '8080-25', 0, 4],
    ['Haze', '8080-23', 1, 0],
    ['Blue Lagoon', '8080-05', 1, 2],
    ['Mango', '8080-06', 1, 3],
    ['Champagne', '8080-26', 1, 4],
    ['Heather', '8080-15', 2, 0],
    ['Teal Blue', '8080-19', 2, 1],
    ['Rose', '8080-08', 2, 2],
    ['Bright Orange', '8080-30', 2, 3],
    ['Buttercup', '8080-27', 2, 4],
    ['Iris', '8080-13', 3, 1],
    ['Flame', '8080-10', 3, 2],
    ['Ash', '8080-28', 3, 4],
    ['Espresso', '8080-24', 4, 0],
    ['Ocean Deep', '8080-18', 4, 1],
    ['Cherry', '8080-09', 4, 2],
    ['Neon Red', '8080-31', 4, 3],
    ['Bamboo', '8080-02', 4, 4],
    ['Carbon', '8080-17', 5, 0],
    ['Royal Purple', '8080-21', 5, 1],
    ['Rust', '8080-20', 5, 3],
    ['Butternut', '8080-01', 5, 4],
  ]),
  ...createSeries('2020', [
    ['Milky Way', '2020-14', 0, 0],
    ['Lemon Peel', '2020-12', 0, 1],
    ['Sorbet Lime', '2020-11', 0, 2],
    ['Glacier', '2020-13', 0, 3],
    ['Mica', '2020-07', 0, 4],
    ['Desert', '2020-16', 1, 0],
    ['Wheat', '2020-03', 1, 1],
    ['Moss', '2020-15', 1, 2],
    ['Sky', '2020-25', 1, 3],
    ['Sea Breeze', '2020-18', 1, 4],
    ['Rattan', '2020-19', 2, 0],
    ['Golden Dust', '2020-22', 2, 1],
    ['Green Field', '2020-06', 2, 2],
    ['Marine Blue', '2020-05', 2, 3],
    ['Stone', '2020-04', 2, 4],
    ['Chestnut', '2020-09', 3, 0],
    ['Freezy Orange', '2020-17', 3, 1],
    ['Green Brier', '2020-08', 3, 2],
    ['Blueridge', '2020-02', 3, 3],
    ['Dark Grey', '2020-26', 3, 4],
    ['Tearose', '2020-01', 4, 0],
    ['Carrot', '2020-27', 4, 1],
    ['Royal', '2020-28', 4, 3],
    ['Capuccino', '2020-23', 4, 4],
    ['Cherry', '2020-29', 5, 0],
    ['Cardinal Red', '2020-24', 5, 1],
    ['Baltic', '2020-30', 5, 3],
    ['Black', '2020-21', 5, 4],
  ]),
];
