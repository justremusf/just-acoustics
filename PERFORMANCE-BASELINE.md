# Public-site performance baseline

Captured with `npm run build` on 17 July 2026 before the public-site performance pass.

| Route group | First-load JavaScript |
| --- | ---: |
| Shared baseline | 103 kB |
| Homepage (`/`) | 174 kB |
| Product detail (`/shop/[slug]`) | 204 kB |
| Typical content pages | 106–125 kB |

After performance changes, run `npm run build` and compare the route table printed by Next.js. The homepage and product-detail totals must decrease; investigate any unexpected increase on another public route. The internal `/studio` bundle is intentionally excluded.

## First implementation pass

Captured with `npm run build` after deferred VSL and panel-calculator loading:

| Route | Before | After | Change |
| --- | ---: | ---: | ---: |
| Homepage (`/`) | 174 kB | 168 kB | -6 kB |
| Product detail (`/shop/[slug]`) | 204 kB | 201 kB | -3 kB |
| Shared baseline | 103 kB | 103 kB | no change |

The route table measures JavaScript only. Header image deferral, product-grid loading changes, and video visibility pausing reduce network and background work but are not represented in these totals.
