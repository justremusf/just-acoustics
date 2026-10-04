# Soothe original Weave fabrics — 15 September 2026

- Sources: user-supplied Weave Fabric Chart 2.jpeg (8080, 1080×1233) and Chart 1.jpeg (2020, 1080×1202).
- Public JPEGs are byte-for-byte copies. No recolouring, generated texture, or raster edits.
- 54 original names/codes preserved: 26 in 8080 and 28 in 2020.
- `lib/sootheFabrics.ts` explicitly maps chart cells, including blank cells, using a central 120×120-pixel source region.
- Shared CSS region rendering feeds the product selector, home/shop cards and cart.
- CMS sync replaces both old generated chart references, preserves other gallery photos, and writes native Sanity image crops for each fabric. Backups captured before mutation.
- Gobos and Bass Traps CMS records updated. Product page gallery uses original local charts once each.
- Inline Soothe collection stays open on outside mousedown to prevent layout movement swallowing Add to cart clicks. Close button and Escape remain available.

## Verification

- ESLint and TypeScript passed.
- Existing order/pricing tests: 13 passed.
- Desktop/mobile: series switching, sparse chart cell mapping, original texture source, no horizontal overflow.
- Home/shop cards: original 8080 textures.
- Bass trap: selecting Baltic 2020-30 and adding directly from expanded collection succeeds; fabric source region and name/code persist after cart reload.
- Original generated chart asset references absent from product galleries.
