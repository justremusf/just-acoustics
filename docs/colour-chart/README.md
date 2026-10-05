# Flexi colour chart update — 15 September 2026

Source: supplied CleanShot image, copied unchanged to `public/assets/shop/standard-flexi/colour-chart-2026-09.png` (916 × 1062).

- `lib/flexiColours.ts` is the shared 39-colour list, with names/codes copied from the chart.
- Selector and cart swatches display fabric-only regions of the original chart using CSS background positioning; no generated or recoloured textures.
- Standard Flexi and its test-layout page use this shared list. Soothe 8080/2020 fabrics, custom-print selections, PET and accessories were not assigned this palette.
- Updated the published Flexi product's CMS colour options and gallery chart. CMS swatches use native image crop metadata against the original uploaded chart. `cms-before-*.json` is the public product backup.
- The full chart uses contain sizing to keep every label visible.
- Saved orders retain their original option descriptions; unavailable old cart colour IDs require reselection through existing checkout validation.

Checks: lint/TypeScript, the 13 pricing/matching regression cases, browser checks for 39 unique choices, new codes, chart replacement, cart persistence, specialist exclusions and 390px mobile width.
