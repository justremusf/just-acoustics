import type { FaqItem } from '@/components/sections/FAQ'
import pack from '@/lib/tradePack.json'

// Shared by /trade and the /trade/<audience> pages. Say only what we can back up: unconfirmed claims stay off the site.
export const AUDIENCES = [
  {
    slug: 'interior-designers',
    who: 'Interior designers',
    line: 'A scheme your client will love, at a price that leaves you room.',
    points: [
      'Layout and render in your colours, from your plan',
      '39 fabric colours, bevel or straight edges, custom print',
      'Trade prices, and proposals that can carry your logo',
      'We quote and invoice through your company',
    ],
    cta: { label: 'Request the trade price list', href: '#price-list' },
  },
  {
    slug: 'architects',
    who: 'Architects',
    line: 'The evidence you need to specify it and keep it in the drawings.',
    points: [
      'NRC 1.00 at 50 mm, αw 0.90, to ASTM C423 and EN ISO 354',
      'Core rated EN 13501-1 Class A1 and BS 476 Part 4',
      'Spec sheets, DXF blocks and SGS reports for your submission',
      'RT60 before and after for every room we propose',
    ],
    cta: { label: 'Download the spec sheets', href: '#downloads' },
  },
  {
    slug: 'main-contractors',
    who: 'Main contractors',
    line: 'One subcontractor for supply and install, on your programme.',
    points: [
      'About 4 to 6 weeks from deposit to installed, confirmed in writing',
      'Installs after hours and on weekends for malls and offices',
      'Submittal documents: data sheets and the test reports we hold',
      'Clean handover with photos, 1-year warranty',
    ],
    cta: { label: 'Send a plan for a quote', href: '#send-a-plan' },
  },
]

// Built from what designers, architects and contractors ask Google and AI assistants (research 29 Oct 2026).
export const TRADE_FAQ: FaqItem[] = [
  { q: 'Are Flexi™ panels fire rated for Singapore projects?', a: 'The Flexi™ glass fibre core is rated EN 13501-1 Class A1 and BS 476 Part 4 and ASTM E136 non-combustible, and the fabric passes BS 5852 Part 1. Under the SCDF Fire Code, most rooms in a fully sprinklered building generally carry no flame-spread requirement, while exit staircases and passageways need non-combustible or Class 0 finishes. Tell us where the panels go and we send the data that applies. Acceptance rests with the project QP.' },
  { q: 'What is the NRC of your acoustic panels?', a: 'NRC 0.80 at 25 mm and NRC 1.00 at 50 mm (ASTM C423, mounting A). The core has a weighted sound absorption coefficient αw of 0.90 to EN ISO 11654. The 100 mm bass panel adds low-frequency control for studios and home cinemas.' },
  { q: 'How do I get your trade prices?', a: 'Request the trade price list with the form on this page and we email it to you with the trade pack. Every project is also quoted from your plan, supplied and installed.' },
  { q: 'How long from order to installation?', a: 'About 4 to 6 weeks from deposit to installed. Production takes about 15 working days on our production schedule, then delivery and install. Tell us your programme date when you send the plan and we confirm a date in writing.' },
  { q: 'Do you supply only, or supply and install?', a: 'Both, but most trade projects are supply and install by our team, so one party is responsible for the finish from drawing to handover. Installs take a few hours to two days.' },
  { q: 'Can you work at night or on weekends in a mall or office building?', a: 'Yes. We schedule installs after hours or on weekends to suit landlord fit-out rules and your site programme, at an additional cost agreed in the quote.' },
  { q: 'Can you design the panel layout from my drawings?', a: 'Yes. Send a floor plan, RCP, elevation or site photos. We return a panel layout, a render in your colours, a spec sheet and a quote with the room\'s estimated RT60 before and after treatment.' },
  { q: 'Do you have CAD blocks and spec sheets?', a: 'Yes. One-page spec sheets for every product and DXF and SVG blocks for the standard Flexi™ sizes in 25, 50 and 100 mm are free to download. We do not have Revit families yet; ask and we send the dimensions you need.' },
  { q: 'Can you prepare documents for a main contractor submittal?', a: 'Yes. We provide product data sheets and the test reports we hold. Tell us what else your submittal needs and we confirm what we can provide when we quote.' },
  { q: 'What sizes and colours are available?', a: 'Standard sizes are 600 × 600, 1200 × 600 and 1800 × 600 mm in 25 or 50 mm, plus 100 mm bass panels and ceiling clouds. Custom sizes are cut to your layout, up to 2400 × 1200 mm. There are 39 standard fabric colours and a paintable white face for an exact paint match.' },
  { q: 'Can I get a physical swatch card or sample?', a: 'Yes. Screens and print never show dyed fabric accurately, so ask for the physical swatch card before you specify. We post it to your studio.' },
  { q: 'Do your panels help with Green Mark or Green Label?', a: 'Flexi™ does not hold a Singapore Green Label today. We provide the emissions data (formaldehyde and TVOC not detected, asbestos negative) and the acoustic data for your Green Mark health and wellbeing documentation.' },
  { q: 'Is a glass fibre core safe in an occupied space?', a: 'Yes. The resin-hardened edges and the micro-mesh backing fully encapsulate the fibres, and the face is wrapped in fabric, so nothing is released during installation or use. Formaldehyde and TVOC were not detected in testing.' },
  { q: 'Do acoustic panels soundproof a room?', a: 'No. Panels control echo and reverberation inside a room, so speech is clearer and the room is calmer. Stopping sound passing between rooms needs wall, ceiling and door construction. We tell you early if a brief needs sound isolation instead.' },
  { q: 'Do I need an acoustic consultant?', a: 'For most offices, restaurants, classrooms, studios and homes, no: we size the treatment from the room and show the RT60 before and after. Where a consultant has set a target, we design to their specification.' },
  { q: 'Fabric wrapped panels or PET felt panels?', a: 'A fabric wrapped glass fibre panel absorbs more at the same thickness (NRC 1.00 at 50 mm) and gives a tailored, upholstered finish in a wide colour range. PET felt suits cut shapes and baffles where lower absorption is acceptable.' },
  { q: 'How are the panels fixed?', a: 'On walls, with impaling clips and adhesive (no drilling) or with mechanical clips on board and masonry. On ceilings, flush with helical anchors or suspended about 100 mm below the soffit on four spring and wire sets. We fix to solid walls and ceilings only, never to glass or demountable partitions.' },
  { q: 'Can you quote through my company instead of my client?', a: 'Yes. On trade projects we quote and invoice your company at trade rates, and you set your own mark-up. Proposals can carry your logo.' },
  { q: 'What warranty do you give, and how are the panels cleaned?', a: 'One year on materials and workmanship. Vacuum gently or wipe lightly with a dry or slightly damp cloth; do not soak or scrub.' },
]

const flexiFacts = [
  ['NRC at 25 mm (ASTM C423)', '0.80'],
  ['NRC at 50 mm (ASTM C423)', '1.00'],
  ['Weighted absorption αw (EN ISO 11654)', '0.90'],
  ['Core reaction to fire (EN 13501-1)', 'Class A1'],
  ['Core density', '96 kg/m³'],
  ['Fabric colours', '39'],
]

/** Audience and product detail for the Service schema; prices are on request, so no offer carries one. */
export function tradeServiceExtras(audiences: string[]) {
  return {
    audience: audiences.map((audienceType) => ({ '@type': 'BusinessAudience', audienceType })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Acoustic panels',
      itemListElement: pack.PRODUCTS.map((p, i) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: p.name,
          description: p.short,
          brand: { '@type': 'Brand', name: 'Just Acoustics' },
          ...(i === 0 && {
            additionalProperty: flexiFacts.map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
          }),
        },
      })),
    },
  }
}
