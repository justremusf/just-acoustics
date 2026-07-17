import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: true })

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

type ArticleSeed = {
  title: string
  slug: string
  category: 'echo-control' | 'office-acoustics' | 'restaurant-noise' | 'buying-guides'
  metaTitle: string
  metaDescription: string
  excerpt: string
  answer: string
  context: string
  why: string[]
  recommendation: string
  diagramTitle: string
  diagramSteps: string[]
  faqs: { question: string; answer: string }[]
}

const articles: ArticleSeed[] = [
  {
    title: 'Do Acoustic Panels Help With Meeting Room Sound Leakage?',
    slug: 'meeting-room-sound-leakage-acoustic-panels-singapore',
    category: 'office-acoustics',
    metaTitle: 'Meeting Room Sound Leakage: Do Panels Help?',
    metaDescription: 'Learn when acoustic panels can reduce meeting room sound leakage in Singapore offices, and when doors, gaps, or partitions also matter.',
    excerpt: 'Acoustic panels can help reduce the amount of meeting room noise that feels sharp outside the room, but they are not full soundproofing.',
    answer: 'Acoustic panels can help with meeting room sound leakage when the issue is echo and reflected speech building up inside the room. They will not fully soundproof a room, but they can make voices less harsh and reduce the amount of sound energy bouncing around before it escapes.',
    context: 'In many Singapore offices, meeting rooms are built with glass, hard tables, vinyl flooring, and light partitions. The room looks clean, but voices bounce around and leak out into the open office.',
    why: [
      'Panels absorb reflected speech, so the room feels calmer during calls.',
      'Less reflection inside the room can mean less harsh sound escaping through weak points.',
      'Doors, gaps, glass, and partition quality still decide how much true isolation you get.',
    ],
    recommendation: 'Start by treating the main reflective walls first. If people outside can still hear private words clearly, check door seals, wall gaps, and glass partitions next.',
    diagramTitle: 'Where Meeting Room Noise Escapes',
    diagramSteps: ['Voice source', 'Wall reflections', 'Door gaps'],
    faqs: [
      { question: 'Will panels make the meeting room private?', answer: 'They can improve comfort and reduce reflected sound, but privacy depends on the door, glass, walls, and gaps.' },
      { question: 'Should I call this soundproofing?', answer: 'Not really. This is acoustic treatment. Soundproofing is a different construction-level scope.' },
      { question: 'Where should panels go first?', answer: 'Usually on the larger hard walls near the meeting table, especially opposite glass or bare wall surfaces.' },
      { question: 'Can panels help a glass meeting room?', answer: 'Yes, if there is enough wall or ceiling area to treat. Glass itself remains a weak point for isolation.' },
      { question: 'Do you need a site visit?', answer: 'Photos and dimensions can give a rough idea. A site visit is better when privacy or exact panel count matters.' },
    ],
  },
  {
    title: 'Can Acoustic Panels Be Installed on Glass Walls?',
    slug: 'can-acoustic-panels-be-installed-on-glass-walls',
    category: 'buying-guides',
    metaTitle: 'Can Acoustic Panels Go on Glass Walls?',
    metaDescription: 'A practical guide for Singapore offices asking whether acoustic panels can be installed on glass meeting room walls.',
    excerpt: 'Glass walls are common in Singapore offices, but they need a careful acoustic treatment plan.',
    answer: 'Acoustic panels can sometimes be installed on glass, but it depends on the panel weight, mounting method, glass condition, and whether the owner allows it. In many office projects, it is cleaner to treat the surrounding walls or ceiling instead of loading the glass directly.',
    context: 'Clients often ask this when a glass meeting room is too echoey or leaks sound to the open office. The glass is usually the biggest reflective surface, but it may not be the best mounting surface.',
    why: [
      'Glass reflects sound strongly, so it often contributes to echo.',
      'Mounting on glass can create maintenance and landlord concerns.',
      'Treating nearby walls can still reduce the sound build-up inside the room.',
    ],
    recommendation: 'If you are unsure, send photos of the glass, wall areas, and ceiling. We can usually advise whether glass mounting is needed or whether wall treatment is enough.',
    diagramTitle: 'Glass Room Treatment Options',
    diagramSteps: ['Glass wall', 'Side wall', 'Ceiling zone'],
    faqs: [
      { question: 'Will panels damage glass?', answer: 'The risk depends on the mounting method and glass surface. It should be assessed before confirming.' },
      { question: 'Can I avoid mounting on glass?', answer: 'Often yes. Side walls, back walls, or ceiling panels may be enough for echo control.' },
      { question: 'Do panels block outside noise?', answer: 'They mainly absorb reflections inside the room. They do not turn glass into a soundproof wall.' },
      { question: 'What should I send for a quote?', answer: 'Send photos of all walls, room dimensions, ceiling height, and the sound issue you are trying to solve.' },
      { question: 'Can the design still look neat?', answer: 'Yes. The layout can be planned around glass, screens, doors, and branding.' },
    ],
  },
  {
    title: 'Will Treating Only Two Walls Improve a Meeting Room?',
    slug: 'treating-only-two-walls-meeting-room-acoustic-panels',
    category: 'office-acoustics',
    metaTitle: 'Will Two Treated Walls Improve a Meeting Room?',
    metaDescription: 'Find out when two-wall acoustic treatment is enough for a Singapore meeting room, and when you need more coverage.',
    excerpt: 'Two-wall treatment can be a practical first step for smaller meeting rooms with limited wall space.',
    answer: 'Yes, treating only two walls can improve a meeting room if those walls are the main reflective surfaces. It may not be perfect, but it can reduce echo, make speech clearer, and make the room less tiring to use.',
    context: 'This comes up when a projector wall, glass wall, whiteboard, or door area cannot be covered. The question is not whether every wall needs panels, but whether the available walls can do enough work.',
    why: [
      'Small rooms often improve quickly once the biggest bare walls are treated.',
      'Panels near speech reflection points usually give better value than random placement.',
      'Leaving a screen wall clear is normal and can be planned around.',
    ],
    recommendation: 'Treat the largest usable wall areas first, then review the result. If the room still rings, consider ceiling panels or smaller panels around fixed items.',
    diagramTitle: 'Two-Wall Treatment Plan',
    diagramSteps: ['Speaker area', 'First wall', 'Second wall'],
    faqs: [
      { question: 'Is two-wall treatment enough for privacy?', answer: 'It helps room comfort. Privacy still depends on the room construction.' },
      { question: 'Which two walls matter most?', answer: 'Usually the largest hard walls facing or beside the meeting table.' },
      { question: 'Can I leave the projector wall empty?', answer: 'Yes. The layout can work around screens, whiteboards, and display walls.' },
      { question: 'How do I know if I need more panels?', answer: 'If speech still sounds harsh or lingers after treatment, more coverage may be needed.' },
      { question: 'Can this be quoted from photos?', answer: 'A rough estimate is possible from clear photos and dimensions.' },
    ],
  },
  {
    title: 'How Many Acoustic Panels Does a Meeting Room Need?',
    slug: 'how-many-acoustic-panels-for-meeting-room',
    category: 'office-acoustics',
    metaTitle: 'How Many Acoustic Panels for a Meeting Room?',
    metaDescription: 'A simple Singapore office guide to estimating acoustic panel quantity for small, medium, and larger meeting rooms.',
    excerpt: 'Panel count depends on room size, ceiling height, available wall space, and how bad the echo is.',
    answer: 'A meeting room needs enough acoustic panels to cover the main reflective surfaces, not just a random number of panels. Small rooms may need a few panels, while larger rooms with glass and hard finishes usually need more coverage.',
    context: 'Clients often start with room dimensions and ask for a quick number. That is useful, but photos matter because wall space may be blocked by screens, doors, cabinets, and glass.',
    why: [
      'Room size tells us the basic sound volume.',
      'Ceiling height affects how much sound energy the room holds.',
      'Available wall space decides where panels can realistically go.',
    ],
    recommendation: 'Send width, length, ceiling height, photos of every wall, and the main issue. From there, we can suggest a practical panel count and adjust during a site visit if needed.',
    diagramTitle: 'Panel Count Inputs',
    diagramSteps: ['Room size', 'Wall space', 'Echo level'],
    faqs: [
      { question: 'Can I use area in square metres only?', answer: 'It helps, but width, length, and ceiling height are better for planning.' },
      { question: 'Can too few panels still help?', answer: 'Yes, but under-treating may leave the room noticeably echoey.' },
      { question: 'Can too many panels make the room dead?', answer: 'It can, especially in small rooms. The goal is comfortable speech, not a dull room.' },
      { question: 'Do ceiling panels count?', answer: 'Yes. Ceiling panels can be useful when wall space is limited.' },
      { question: 'Is a 3D proposal useful?', answer: 'Yes. It helps everyone see the panel layout before confirming.' },
    ],
  },
  {
    title: 'Are Acoustic Panel Installations Included in the Price?',
    slug: 'are-acoustic-panel-installations-included-singapore',
    category: 'buying-guides',
    metaTitle: 'Are Acoustic Panel Installations Included?',
    metaDescription: 'Understand supply-only, delivery, and installation options for acoustic panels in Singapore before you request a quote.',
    excerpt: 'Installation may be included or quoted separately depending on the project, mounting method, and site access.',
    answer: 'Acoustic panel installation is usually available, but whether it is included depends on the quote. Supply-only, delivery, wall installation, and ceiling installation are different scopes, so it is best to confirm this early.',
    context: 'This matters because a simple wall install is very different from a high ceiling restaurant install that needs mobile scaffolding and more time on site.',
    why: [
      'Wall panels are usually faster to install than ceiling panels.',
      'High ceilings, access rules, and building security can affect cost.',
      'Supply-only works for some studios, but offices often prefer installation handled for them.',
    ],
    recommendation: 'When asking for a quote, say whether you want supply only, delivery, or full installation. Include building access details if it is an office, mall, or commercial unit.',
    diagramTitle: 'Quote Scope Options',
    diagramSteps: ['Supply only', 'Delivery', 'Install'],
    faqs: [
      { question: 'Can I install panels myself?', answer: 'For some wall setups, yes. Ceiling and commercial installs are better handled professionally.' },
      { question: 'Does installation include measurement?', answer: 'For confirmed installation work, measurement and layout checks are usually part of the process.' },
      { question: 'Do I need to clear furniture?', answer: 'Yes. Clearing the work area helps the install go faster and cleaner.' },
      { question: 'Will installers need building access?', answer: 'For offices and malls, yes. Names, timing, loading bay, or security registration may be needed.' },
      { question: 'How do I compare quotes?', answer: 'Check whether panel supply, mounting parts, delivery, installation, and access equipment are included.' },
    ],
  },
  {
    title: 'What Measurements Do You Need for an Acoustic Treatment Quote?',
    slug: 'measurements-needed-for-acoustic-treatment-quote',
    category: 'buying-guides',
    metaTitle: 'Measurements Needed for an Acoustic Quote',
    metaDescription: 'Know what dimensions, photos, and room details to send when asking for an acoustic treatment quote in Singapore.',
    excerpt: 'The fastest way to get a useful acoustic quote is to send dimensions, photos, and the sound problem you want solved.',
    answer: 'For an acoustic treatment quote, send the room width, length, ceiling height, photos of every wall, and a short note on the sound issue. A floor plan is helpful, but rough measurements are enough to start.',
    context: 'Without dimensions, any price is mostly guessing. With photos and measurements, we can estimate panel quantity, check usable surfaces, and prepare a more realistic proposal.',
    why: [
      'Width and length show the room footprint.',
      'Ceiling height affects echo and installation method.',
      'Photos reveal glass, doors, screens, AC units, and blocked wall areas.',
    ],
    recommendation: 'Send a simple WhatsApp message with photos, width x length x ceiling height, and whether the issue is echo, speech clarity, music, or noise spilling out.',
    diagramTitle: 'What To Send',
    diagramSteps: ['Photos', 'Dimensions', 'Sound issue'],
    faqs: [
      { question: 'Do I need a floor plan?', answer: 'No, but it helps. Rough measurements are enough for a first estimate.' },
      { question: 'Should I send a video?', answer: 'Yes, especially if the room is hard to understand from photos.' },
      { question: 'What if I do not know the ceiling height?', answer: 'Give an estimate first. We can confirm it during a site visit.' },
      { question: 'Do you need photos of every wall?', answer: 'Yes. It helps us avoid placing panels where screens, doors, or fixtures are in the way.' },
      { question: 'Can you quote before visiting?', answer: 'Usually yes for a rough estimate. Final placement is better after measurement.' },
    ],
  },
  {
    title: 'Can Acoustic Panels Be Installed Without Drilling?',
    slug: 'acoustic-panels-without-drilling-singapore',
    category: 'buying-guides',
    metaTitle: 'Acoustic Panels Without Drilling in Singapore',
    metaDescription: 'A practical guide to no-drill acoustic panel installation for Singapore homes, rentals, and offices.',
    excerpt: 'No-drill acoustic panel installation is possible for many wall applications, but not every surface or ceiling setup is suitable.',
    answer: 'Acoustic panels can often be installed without drilling on walls, depending on the surface, panel size, and mounting method. For ceilings, heavy panels, or commercial safety requirements, stronger mechanical fixing may still be needed.',
    context: 'This is common for rental homes, condos, and offices that want to avoid visible wall damage. The right method depends on what the wall is made of and how long the panels need to stay up.',
    why: [
      'No-drill mounting is useful for renters and temporary spaces.',
      'Paint condition and wall texture affect how well adhesive systems perform.',
      'Ceiling work has higher safety requirements than wall work.',
    ],
    recommendation: 'Send close-up photos of the wall surface and tell us if the space is rented. We can advise whether no-drill mounting is suitable.',
    diagramTitle: 'No-Drill Suitability Check',
    diagramSteps: ['Wall type', 'Panel size', 'Rental rules'],
    faqs: [
      { question: 'Will no-drill panels damage paint?', answer: 'There is always some risk when removing adhesive from painted walls, especially weak paint.' },
      { question: 'Can no-drill panels go on ceilings?', answer: 'Usually not recommended for safety. Ceiling panels often need stronger fixing.' },
      { question: 'Is no-drill mounting strong enough?', answer: 'For suitable wall panels and surfaces, yes. It depends on the exact setup.' },
      { question: 'Can panels be removed later?', answer: 'Many wall setups can be removed, though mounts or adhesive parts may need replacement.' },
      { question: 'Should I ask my landlord first?', answer: 'Yes, especially for condos, serviced offices, or commercial units.' },
    ],
  },
  {
    title: 'Are Acoustic Panels Safe for Rental Homes or Temporary Spaces?',
    slug: 'rental-home-acoustic-panels-no-drilling',
    category: 'buying-guides',
    metaTitle: 'Rental Home Acoustic Panels Without Drilling',
    metaDescription: 'How Singapore renters can improve piano, work, or home studio acoustics without committing to permanent renovation.',
    excerpt: 'Renters can improve echo with removable wall panels, but the mounting method needs to suit the wall and lease conditions.',
    answer: 'Acoustic panels can be suitable for rental homes when the layout uses removable wall mounting and avoids permanent construction. The safest plan is to treat the main reflection points without drilling into ceilings or making structural changes.',
    context: 'This is useful for people who may move in one or two years but still want better sound for piano, calls, or recording.',
    why: [
      'Portable panels can move with you to the next place.',
      'Wall treatment is usually easier to remove than ceiling work.',
      'A simple layout can still reduce harsh echo in living rooms and study areas.',
    ],
    recommendation: 'Choose a layout that works now but can be reused later. Keep extra mounting parts in mind when moving.',
    diagramTitle: 'Rental-Friendly Treatment',
    diagramSteps: ['No drilling', 'Removable', 'Reusable'],
    faqs: [
      { question: 'Can I bring panels to my next home?', answer: 'Yes, if the panels are removable and the new room has suitable wall space.' },
      { question: 'Should renters avoid ceiling panels?', answer: 'Usually yes, unless the landlord approves and proper fixing is used.' },
      { question: 'Do rugs replace panels?', answer: 'No. Rugs help floor reflections, but wall and ceiling reflections usually remain.' },
      { question: 'Can this work for piano?', answer: 'Yes. Wall panels around a piano area can make the room less harsh.' },
      { question: 'What should I check first?', answer: 'Check lease rules, wall condition, and whether you can accept minor paint touch-up after removal.' },
    ],
  },
  {
    title: 'Can I Move Acoustic Panels to a New Office or Home Later?',
    slug: 'can-acoustic-panels-be-moved-to-new-office',
    category: 'buying-guides',
    metaTitle: 'Can Acoustic Panels Be Moved Later?',
    metaDescription: 'Moving office or home in Singapore? Learn when acoustic panels can be reused and what parts may need replacing.',
    excerpt: 'Many acoustic panels can be reused after a move, but the layout and mounting parts may need to change.',
    answer: 'Yes, many acoustic panels can be moved to a new office or home later. The panels themselves are usually reusable, but the mounting method, layout, and some accessories may need to be replaced or adjusted.',
    context: 'This matters for offices that are moving, studios on short leases, and homeowners who do not want acoustic treatment to feel like sunk cost.',
    why: [
      'Panel sizes may still work, but the new room dimensions will change placement.',
      'Old mounting parts may not be reusable after removal.',
      'A site visit can check how much of the old setup can transfer over.',
    ],
    recommendation: 'Before moving, take photos of the old panels and the new space. We can advise what to reuse, what to add, and what to leave out.',
    diagramTitle: 'Panel Reuse Plan',
    diagramSteps: ['Existing panels', 'New room', 'New layout'],
    faqs: [
      { question: 'Do I need the same number of panels?', answer: 'Not always. The new room may need more, fewer, or different placement.' },
      { question: 'Can old panels match new rooms?', answer: 'Often yes, especially if neutral colours were chosen.' },
      { question: 'What parts may need replacing?', answer: 'Adhesive, hooks, brackets, or ceiling hardware may need to be replaced.' },
      { question: 'Can you quote add-on panels?', answer: 'Yes. Existing clients often add panels for new rooms or expanded spaces.' },
      { question: 'Should I remove panels myself?', answer: 'It depends on mounting method. Ask first if you are unsure.' },
    ],
  },
  {
    title: 'What Acoustic Treatment Works Best for Piano Rooms at Home?',
    slug: 'piano-room-acoustic-treatment-singapore-home',
    category: 'echo-control',
    metaTitle: 'Piano Room Acoustic Treatment in Singapore',
    metaDescription: 'Practical acoustic treatment advice for Singapore homes with piano rooms, high ceilings, and connected living spaces.',
    excerpt: 'Piano rooms usually need reflection control around walls and nearby hard surfaces, not just a rug under the piano.',
    answer: 'The best acoustic treatment for a piano room is usually wall panels placed around the piano and nearby reflective surfaces. The goal is not to make the piano silent, but to reduce harshness, echo, and listener fatigue.',
    context: 'In Singapore homes, piano areas are often in living rooms connected to dining spaces. Hard floors, glass, and high ceilings can make the piano sound much louder than expected.',
    why: [
      'Piano sound spreads into the room quickly and reflects off hard surfaces.',
      'High ceilings and connected rooms increase the amount of echo.',
      'Panels help make practice more comfortable for the player and family.',
    ],
    recommendation: 'Start with the walls around the piano and the main listening area. If the room is tall or open-plan, ceiling height and connected spaces should be included in the quote.',
    diagramTitle: 'Piano Room Reflections',
    diagramSteps: ['Piano', 'Hard walls', 'Panel zones'],
    faqs: [
      { question: 'Will panels make my piano quiet?', answer: 'No. They reduce reflections and harshness, but they do not silence the instrument.' },
      { question: 'Do I need panels behind the piano?', answer: 'Often yes, but side walls and nearby reflective areas may matter too.' },
      { question: 'Can this work in a living room?', answer: 'Yes. The layout can be designed around furniture and interior style.' },
      { question: 'Are panels ugly?', answer: 'They can be selected in colours that blend with the room.' },
      { question: 'Do you need exact dimensions?', answer: 'Width, length, and ceiling height are very helpful for a proper proposal.' },
    ],
  },
  {
    title: 'Do Rugs, Floor Mats, or Acoustic Foam Help Enough for Piano Echo?',
    slug: 'do-rugs-mats-acoustic-foam-help-piano-echo',
    category: 'echo-control',
    metaTitle: 'Do Rugs or Foam Fix Piano Echo?',
    metaDescription: 'Find out when rugs, mats, and acoustic foam help a piano room, and when proper acoustic panels are needed.',
    excerpt: 'Rugs and mats can help a little, but they usually do not solve piano echo in reflective Singapore homes.',
    answer: 'Rugs, mats, and thin acoustic foam can help small parts of a piano room, but they are often not enough for strong echo. They mainly affect floor reflections and light high-frequency reflections, while walls and ceiling reflections remain.',
    context: 'Many homeowners try a mat under the piano or foam behind it first. That is understandable, but the room usually needs broader absorption if the piano still sounds sharp.',
    why: [
      'A rug treats the floor, not the walls or ceiling.',
      'Thin foam has limited performance compared with proper acoustic panels.',
      'Open living and dining areas need more coverage than a small practice nook.',
    ],
    recommendation: 'Use rugs as a supporting measure, not the whole solution. If the room still rings, add proper panels on key walls.',
    diagramTitle: 'DIY Fix vs Proper Panels',
    diagramSteps: ['Rug', 'Thin foam', 'Acoustic panels'],
    faqs: [
      { question: 'Should I remove my rug?', answer: 'No. Keep it if you like it. Just do not expect it to solve all echo.' },
      { question: 'Is foam useless?', answer: 'Not useless, but usually limited for larger rooms and piano energy.' },
      { question: 'Where should proper panels go?', answer: 'Around the piano area and on nearby reflective wall surfaces.' },
      { question: 'Can panels match my home?', answer: 'Yes. Colour and layout can be planned around the interior.' },
      { question: 'Can I start small?', answer: 'Yes. Start with the most reflective wall areas, then add more if needed.' },
    ],
  },
  {
    title: 'How Can I Hear the Effect of Acoustic Panels Before Buying?',
    slug: 'hear-acoustic-panel-effect-before-buying-singapore',
    category: 'buying-guides',
    metaTitle: 'Hear Acoustic Panels Before Buying',
    metaDescription: 'How Singapore customers can assess acoustic panel results using videos, site visits, samples, and real reference spaces.',
    excerpt: 'Videos help, but hearing panels in person or reviewing similar projects gives a better feel for the result.',
    answer: 'You can hear the effect of acoustic panels before buying through before-and-after videos, sample panels, site visits, and visits to similar completed spaces. Videos are useful, but real rooms give a clearer sense of echo reduction.',
    context: 'Some clients can hear the difference immediately in videos. Others need to experience it in person, especially for homes, cafes, and studios where sound matters emotionally.',
    why: [
      'Phone videos compress sound, so the effect may not be fully obvious.',
      'Similar spaces are more useful than random examples.',
      'Sample panels help with colour, texture, and confidence.',
    ],
    recommendation: 'Ask for examples close to your space type. A piano room, cafe, studio, and meeting room each have different acoustic goals.',
    diagramTitle: 'Ways To Check Results',
    diagramSteps: ['Videos', 'Samples', 'Site visit'],
    faqs: [
      { question: 'Are before-and-after videos accurate?', answer: 'They help, but phone audio can limit what you hear.' },
      { question: 'Can I see panels in person?', answer: 'For some projects, samples or a site visit can be arranged.' },
      { question: 'Can I visit past client spaces?', answer: 'Sometimes, if the space is public and suitable to visit as a customer.' },
      { question: 'What should I listen for?', answer: 'Listen for less echo, clearer speech, and less harshness.' },
      { question: 'Do all rooms improve the same way?', answer: 'No. Room size, surfaces, and panel coverage affect the result.' },
    ],
  },
  {
    title: 'Do Acoustic Panels Come in Colours Besides Grey?',
    slug: 'acoustic-panel-colours-for-home-office-studio',
    category: 'buying-guides',
    metaTitle: 'Acoustic Panel Colours Beyond Grey',
    metaDescription: 'See how to choose acoustic panel colours for Singapore homes, offices, studios, and cafes without making the space look messy.',
    excerpt: 'Acoustic panels do not have to be grey, but simple colour choices usually age better.',
    answer: 'Yes, acoustic panels can come in colours besides grey. The best choice depends on your wall colour, lighting, furniture, branding, and whether you want panels to blend in or become a design feature.',
    context: 'Clients often worry that panels will look too industrial. In practice, colour choice is one of the easiest ways to make acoustic treatment feel intentional.',
    why: [
      'Neutral panels blend into offices and homes.',
      'Darker panels can work well in studios and media rooms.',
      'Too many alternating colours can look busy if the room is already detailed.',
    ],
    recommendation: 'If unsure, choose one neutral colour close to your wall or flooring tone. Use bolder colours only when they match the interior plan.',
    diagramTitle: 'Colour Choice Logic',
    diagramSteps: ['Wall tone', 'Lighting', 'One colour'],
    faqs: [
      { question: 'Is grey always safest?', answer: 'Grey is safe, but not the only option. Warm neutrals can look softer in homes and cafes.' },
      { question: 'Can I mix colours?', answer: 'Yes, but minimum quantities and visual balance may affect the choice.' },
      { question: 'Should panels match the wall?', answer: 'Usually yes if you want a calm, clean look.' },
      { question: 'Can you show samples?', answer: 'Samples can often be reviewed during a site visit.' },
      { question: 'Do colours affect acoustic performance?', answer: 'The fabric colour itself is mainly visual. The panel construction affects performance.' },
    ],
  },
  {
    title: 'How Much Do Acoustic Panels Cost for a Small Meeting Room in Singapore?',
    slug: 'small-meeting-room-acoustic-panel-cost-singapore',
    category: 'office-acoustics',
    metaTitle: 'Small Meeting Room Acoustic Panel Cost',
    metaDescription: 'Understand what affects acoustic panel cost for small meeting rooms in Singapore, including panel count, installation, and layout.',
    excerpt: 'Small meeting room cost depends mainly on panel quantity, installation scope, and how much usable wall space there is.',
    answer: 'The cost of acoustic panels for a small meeting room in Singapore depends on the number of panels, panel type, installation method, and site access. A useful quote needs photos and dimensions, because two rooms with the same floor area can need different layouts.',
    context: 'A small room with glass and bare walls may need more careful treatment than a slightly larger room with curtains, carpet, or furniture.',
    why: [
      'Panel count is the main cost driver.',
      'Installation cost changes with wall, ceiling, and access conditions.',
      'Custom colours, site visits, and 3D planning can affect project scope.',
    ],
    recommendation: 'Send photos, dimensions, and the problem you want solved. Ask for the quote to separate supply, installation, and any site visit fee clearly.',
    diagramTitle: 'Cost Factors',
    diagramSteps: ['Panel count', 'Install scope', 'Access'],
    faqs: [
      { question: 'Can you give a rough estimate first?', answer: 'Yes, if photos and dimensions are clear enough.' },
      { question: 'Why not price by room size only?', answer: 'Because usable wall space, glass, doors, and ceiling height change the layout.' },
      { question: 'Is installation always included?', answer: 'Not always. Confirm whether the quote is supply-only or supply-and-install.' },
      { question: 'Can the quote change after site visit?', answer: 'It can if measurements or wall conditions differ from the photos.' },
      { question: 'Can we reduce the cost?', answer: 'Usually by focusing panels on the highest-impact surfaces first.' },
    ],
  },
  {
    title: 'Is There a Minimum Order Quantity for Custom Acoustic Panels?',
    slug: 'minimum-order-quantity-custom-acoustic-panels-singapore',
    category: 'buying-guides',
    metaTitle: 'Custom Acoustic Panel MOQ in Singapore',
    metaDescription: 'Understand minimum order quantities for custom acoustic panels, colour choices, and small add-on orders in Singapore.',
    excerpt: 'MOQ depends on panel type, colour, customisation, and whether it is an add-on to an existing project.',
    answer: 'Custom acoustic panels may have a minimum order quantity, especially when colours, sizes, or production batches are customised. Small add-on orders may still be possible, but they should be checked against the product and production schedule.',
    context: 'MOQ questions often come up when a client wants just a few extra panels, or when a studio wants multiple colours in one room.',
    why: [
      'Made-to-order panels are usually produced in batches.',
      'Multiple colours can create minimum quantities per colour.',
      'Add-on orders may be cheaper to plan together with the main batch.',
    ],
    recommendation: 'Decide colours early and ask whether the MOQ applies per order or per colour. This avoids delays later.',
    diagramTitle: 'MOQ Decision Points',
    diagramSteps: ['Panel type', 'Colour count', 'Batch timing'],
    faqs: [
      { question: 'Can I order only one or two panels?', answer: 'Sometimes, especially for add-ons, but it depends on stock and production.' },
      { question: 'Does each colour have MOQ?', answer: 'For custom colour batches, it may. Confirm before choosing many colours.' },
      { question: 'Should I order extra panels?', answer: 'If you expect expansion soon, ordering together may be cleaner.' },
      { question: 'Can existing clients add panels later?', answer: 'Yes, but colour matching and lead time should be checked.' },
      { question: 'Does MOQ affect price?', answer: 'Yes. Small custom runs can cost more per panel than larger batches.' },
    ],
  },
  {
    title: 'What Happens During an Acoustic Site Visit?',
    slug: 'what-happens-during-acoustic-site-visit',
    category: 'buying-guides',
    metaTitle: 'What Happens During an Acoustic Site Visit?',
    metaDescription: 'A simple walkthrough of acoustic site visits in Singapore, from measurements and samples to quote and 3D proposal.',
    excerpt: 'A site visit helps confirm measurements, panel placement, colours, access, and the real sound issue in the room.',
    answer: 'During an acoustic site visit, we check the room dimensions, listen to the sound issue, review wall or ceiling options, and confirm what can realistically be installed. It turns a rough estimate into a more confident proposal.',
    context: 'For offices, cafes, studios, and homes, the site visit often catches details that photos miss, such as ceiling services, access rules, wall fixtures, and awkward glass areas.',
    why: [
      'Measurements confirm panel count and available surfaces.',
      'Samples help with colour and material decisions.',
      'Access checks prevent installation surprises later.',
    ],
    recommendation: 'Before the visit, prepare photos, floor plan if available, and the main pain point. During the visit, point out screens, doors, landlord limits, and operating hours.',
    diagramTitle: 'Site Visit Flow',
    diagramSteps: ['Measure', 'Check sound', 'Plan layout'],
    faqs: [
      { question: 'Is a site visit always needed?', answer: 'No. Simple rooms can start with photos. Complex rooms benefit from a visit.' },
      { question: 'Can you quote during the visit?', answer: 'Sometimes. Larger spaces may need a proposal after measurements are reviewed.' },
      { question: 'Do I need to be there?', answer: 'It helps, but some commercial visits can be done with staff access and a follow-up call.' },
      { question: 'Will you bring samples?', answer: 'When arranged, samples can be shown for colour and finish.' },
      { question: 'What should I ask during the visit?', answer: 'Ask about placement, install time, access needs, lead time, and expected result.' },
    ],
  },
  {
    title: 'Can You Quote Acoustic Treatment From Photos, Videos, and Floor Plans?',
    slug: 'quote-acoustic-treatment-from-photos-videos-floor-plan',
    category: 'buying-guides',
    metaTitle: 'Quote Acoustic Treatment From Photos',
    metaDescription: 'Find out what photos, videos, dimensions, and floor plans are needed for a remote acoustic treatment estimate in Singapore.',
    excerpt: 'A remote acoustic quote is possible when photos, videos, dimensions, and the sound issue are clear.',
    answer: 'Yes, acoustic treatment can often be quoted from photos, videos, dimensions, and floor plans. The quote may still need confirmation during a site visit if ceiling work, unusual walls, or exact panel placement matter.',
    context: 'Remote quoting is useful when the space is not ready, the office is moving, or the client wants a rough cost before asking management for approval.',
    why: [
      'Photos show surfaces and obstacles.',
      'Videos help explain room shape and ceiling services.',
      'Floor plans speed up measurement and layout planning.',
    ],
    recommendation: 'Send one wide photo of each wall, a short video pan, dimensions, ceiling height, and the main sound problem.',
    diagramTitle: 'Remote Quote Checklist',
    diagramSteps: ['Photos', 'Video', 'Floor plan'],
    faqs: [
      { question: 'Can I send only a video?', answer: 'A video helps, but photos and dimensions make the estimate much better.' },
      { question: 'What if the space is still under renovation?', answer: 'Send the ID drawings or floor plan, plus expected ceiling and wall finishes.' },
      { question: 'Will the final quote change?', answer: 'It may if site conditions differ from the remote information.' },
      { question: 'Can you make a 3D proposal remotely?', answer: 'Yes, if dimensions and photos are clear enough.' },
      { question: 'Should I measure in metres?', answer: 'Yes. Width x length x ceiling height is the simplest format.' },
    ],
  },
  {
    title: 'Should Restaurant Acoustic Panels Be Suspended or Fixed Flat to the Ceiling?',
    slug: 'restaurant-ceiling-panels-suspended-vs-flat-mounted',
    category: 'restaurant-noise',
    metaTitle: 'Suspended vs Flat Restaurant Ceiling Panels',
    metaDescription: 'Compare suspended and flat-mounted acoustic ceiling panels for Singapore cafes, restaurants, and shophouses.',
    excerpt: 'Suspended panels are often more effective, while flat-mounted panels can be neater for some ceiling layouts.',
    answer: 'Restaurant acoustic panels can be suspended or fixed flat to the ceiling. Suspended panels usually absorb sound more effectively and can look intentional, while flat-mounted panels may suit lower ceilings or simpler visual requirements.',
    context: 'This comes up often in cafes and shophouses with exposed ceilings, AC units, lighting tracks, and no false ceiling.',
    why: [
      'Suspended panels expose more absorbing surface area.',
      'Flat panels can look cleaner when height is limited.',
      'AC units, sprinklers, lights, and beams affect the final choice.',
    ],
    recommendation: 'For high-ceiling restaurants, consider suspended panels first. For lower or visually sensitive ceilings, compare a flat layout before deciding.',
    diagramTitle: 'Ceiling Mount Comparison',
    diagramSteps: ['Suspended', 'Flat mount', 'Ceiling services'],
    faqs: [
      { question: 'Are suspended panels ugly?', answer: 'Not if planned well. They can align with lights and AC units.' },
      { question: 'Do flat panels still work?', answer: 'Yes, but suspended panels can perform better in many high-ceiling spaces.' },
      { question: 'Can panels be installed on a true ceiling?', answer: 'Yes, depending on fixing points and site conditions.' },
      { question: 'Will panels block aircon?', answer: 'They should be placed around AC airflow and servicing access.' },
      { question: 'Which option costs more?', answer: 'It depends on height, hardware, access equipment, and installation time.' },
    ],
  },
  {
    title: 'Can Acoustic Panels Be Installed Without a False Ceiling?',
    slug: 'acoustic-panels-without-false-ceiling-restaurant',
    category: 'restaurant-noise',
    metaTitle: 'Acoustic Panels Without a False Ceiling',
    metaDescription: 'How cafes and restaurants in Singapore can install acoustic panels on true ceilings or exposed ceiling structures.',
    excerpt: 'A false ceiling is not always needed. Many restaurant acoustic panels can be installed from the true ceiling.',
    answer: 'Yes, acoustic panels can often be installed without a false ceiling. In many cafes and restaurants, panels are fixed or suspended from the true ceiling, as long as the fixing points, height, and services are suitable.',
    context: 'This is common in shophouses and cafes with exposed ceilings. The acoustic plan needs to work around AC units, pipes, sprinklers, lights, and cleaning access.',
    why: [
      'True ceilings can provide solid fixing points.',
      'Suspended panels can sit below services and improve absorption.',
      'A site check is important before confirming hardware.',
    ],
    recommendation: 'Send ceiling photos and height first. For commercial spaces, confirm building rules and safety requirements early.',
    diagramTitle: 'True Ceiling Install',
    diagramSteps: ['Fixing point', 'Panel drop', 'Service clearance'],
    faqs: [
      { question: 'Do I need renovation work?', answer: 'Not always. Panels can often be added after the space is operating.' },
      { question: 'Can panels hang near AC units?', answer: 'Yes, with proper clearance and placement.' },
      { question: 'Will installation disrupt business?', answer: 'It can usually be scheduled during closed hours or off days.' },
      { question: 'Do you need scaffolding?', answer: 'For higher ceilings, proper access equipment may be required.' },
      { question: 'Can this work in a shophouse?', answer: 'Yes, shophouses are common candidates for ceiling acoustic treatment.' },
    ],
  },
  {
    title: 'Why Do High-Ceiling Cafes and Restaurants Get So Echoey?',
    slug: 'why-high-ceiling-cafes-are-echoey-singapore',
    category: 'restaurant-noise',
    metaTitle: 'Why High-Ceiling Cafes Get Echoey',
    metaDescription: 'Understand why Singapore cafes and restaurants with high ceilings, glass, and hard finishes become noisy during service.',
    excerpt: 'High ceilings, hard finishes, and crowd noise can make cafes feel lively at first, then tiring when service gets busy.',
    answer: 'High-ceiling cafes and restaurants get echoey because sound has more space to build up and fewer soft surfaces to absorb it. Glass, tiles, concrete, timber, and hard furniture all reflect sound back into the dining area.',
    context: 'The problem often feels worse during lunch or dinner because every table adds more speech noise. Staff then speak louder, guests speak louder, and the room becomes tiring.',
    why: [
      'High ceilings increase the volume of sound in the room.',
      'Hard surfaces reflect speech and cutlery noise.',
      'Busy service creates a feedback loop of louder conversations.',
    ],
    recommendation: 'Treat the ceiling and upper wall areas first if the room is tall. This controls the sound without taking away seating space.',
    diagramTitle: 'Restaurant Echo Loop',
    diagramSteps: ['Hard surfaces', 'Crowd noise', 'Louder room'],
    faqs: [
      { question: 'Will acoustic panels make the cafe too quiet?', answer: 'No. The goal is still lively, just less harsh and tiring.' },
      { question: 'Should panels go on walls or ceiling?', answer: 'For high ceilings, ceiling treatment is often very useful.' },
      { question: 'Can panels match the interior?', answer: 'Yes. Colour and layout can be planned with the design.' },
      { question: 'Can we install on an off day?', answer: 'Usually yes, and that is often the best plan for restaurants.' },
      { question: 'Can customers notice the difference?', answer: 'They may not notice the panels first, but they often feel the space is more comfortable.' },
    ],
  },
  {
    title: 'How Long Does Acoustic Panel Installation Take?',
    slug: 'how-long-acoustic-panel-installation-takes',
    category: 'buying-guides',
    metaTitle: 'How Long Acoustic Panel Installation Takes',
    metaDescription: 'Plan acoustic panel installation timing for Singapore offices, homes, studios, restaurants, and high-ceiling spaces.',
    excerpt: 'Installation timing depends on panel count, mounting method, ceiling height, access, and how ready the space is.',
    answer: 'Acoustic panel installation can take from around an hour for a small wall-panel job to a full working day or more for larger ceiling projects. The timing depends on panel quantity, mounting type, height, access, and whether the space is prepared.',
    context: 'Clients often need to plan around office hours, restaurant off days, renovation schedules, or building security access.',
    why: [
      'More panels mean more marking, alignment, and mounting time.',
      'Ceiling work takes longer than simple wall work.',
      'Furniture, plants, fixtures, and access delays can slow the job.',
    ],
    recommendation: 'Before installation, clear the work area, confirm building access, and share any timing restrictions early.',
    diagramTitle: 'Install Time Factors',
    diagramSteps: ['Panel count', 'Mount type', 'Site access'],
    faqs: [
      { question: 'Can installation happen on weekdays?', answer: 'Yes, depending on schedule and site access.' },
      { question: 'Can restaurants install on off days?', answer: 'Usually yes, and it is often the cleanest option.' },
      { question: 'How many installers come?', answer: 'It depends on project size, but small jobs may only need a small team.' },
      { question: 'Do I need to move furniture?', answer: 'Yes, clear anything blocking panel locations.' },
      { question: 'Can shipment delays affect install dates?', answer: 'For made-to-order panels, yes. Dates are usually confirmed closer to readiness.' },
    ],
  },
  {
    title: 'Do High-Ceiling Acoustic Installations Need Ladders or Scaffolding?',
    slug: 'high-ceiling-acoustic-installation-scaffolding-singapore',
    category: 'restaurant-noise',
    metaTitle: 'High-Ceiling Acoustic Installation Access',
    metaDescription: 'Why high-ceiling acoustic panel installations in Singapore may need mobile scaffolding instead of a simple ladder.',
    excerpt: 'High ceiling work needs proper access equipment for safety, alignment, and a cleaner installation finish.',
    answer: 'High-ceiling acoustic installations may need mobile scaffolding or proper access equipment instead of a simple ladder. This is especially true for commercial spaces where safety, height, and installation accuracy matter.',
    context: 'Cafes and restaurants sometimes ask if installers can just use the same ladder used for other maintenance. For acoustic ceiling panels, the answer depends on height, panel size, and safety requirements.',
    why: [
      'Scaffolding gives installers a stable working platform.',
      'Ceiling panels need accurate alignment and secure fixing.',
      'Commercial sites may have safety rules that do not allow ladder-only work.',
    ],
    recommendation: 'Measure ceiling height early and tell your vendor about access restrictions. This prevents surprise costs or rescheduling later.',
    diagramTitle: 'Height Access Decision',
    diagramSteps: ['Ceiling height', 'Panel weight', 'Safe platform'],
    faqs: [
      { question: 'Is scaffolding always required?', answer: 'No. It depends on height, panel type, and site rules.' },
      { question: 'Why not just use a ladder?', answer: 'A ladder may not be stable enough for accurate overhead installation.' },
      { question: 'Does scaffolding affect cost?', answer: 'Yes, access equipment can affect cost and scheduling.' },
      { question: 'Should I tell building management?', answer: 'Yes, especially for malls, offices, and commercial properties.' },
      { question: 'Can this be checked during a site visit?', answer: 'Yes. Ceiling height and access are key site visit checks.' },
    ],
  },
  {
    title: 'Are Acoustic Panels Fire-Safe for Commercial Buildings?',
    slug: 'are-acoustic-panels-fire-safe-commercial-buildings-singapore',
    category: 'buying-guides',
    metaTitle: 'Are Acoustic Panels Fire-Safe?',
    metaDescription: 'What Singapore commercial tenants should ask about acoustic panel fire safety documents, specifications, and building approval.',
    excerpt: 'Commercial buildings may ask for acoustic panel specifications before approving delivery or installation.',
    answer: 'Acoustic panels for commercial buildings should come with the relevant material specifications and fire safety information where required. If building management asks for documents, request them before installation is scheduled.',
    context: 'Studios, malls, offices, and restaurants may need to show that materials are suitable for the building. This can affect approval and timing.',
    why: [
      'Building management may request specifications.',
      'Fire safety documents help avoid last-minute delays.',
      'Panel construction matters more than just the surface fabric.',
    ],
    recommendation: 'Ask for product specifications early if your building has approval requirements. Do this before delivery dates are locked in.',
    diagramTitle: 'Commercial Approval Flow',
    diagramSteps: ['Specs', 'Building check', 'Install approval'],
    faqs: [
      { question: 'Will every building ask for documents?', answer: 'No, but many commercial sites can.' },
      { question: 'What documents should I ask for?', answer: 'Ask for product specifications and relevant fire safety information.' },
      { question: 'Can approval delay installation?', answer: 'Yes, if documents are requested late.' },
      { question: 'Does fibreglass mean unsafe?', answer: 'No. The full panel construction and testing matter.' },
      { question: 'Should this be part of the quote process?', answer: 'Yes, especially for studios, malls, restaurants, and offices.' },
    ],
  },
  {
    title: 'Wall Panels vs Ceiling Panels: Which Is Better for Studios?',
    slug: 'wall-panels-vs-ceiling-panels-studio-acoustic-treatment',
    category: 'echo-control',
    metaTitle: 'Wall vs Ceiling Panels for Studios',
    metaDescription: 'Compare wall and ceiling acoustic panels for Singapore music studios, jam rooms, and recording spaces.',
    excerpt: 'Wall panels usually come first for studios, but ceiling panels can help when the room has strong vertical reflections.',
    answer: 'For studios, wall panels are usually the first priority because they control side reflections and room slap echo. Ceiling panels are useful when the room has strong vertical reflections, drums, recording needs, or limited wall space.',
    context: 'Studios often balance acoustic performance, budget, renovation timing, and visual design. The right answer is not always maximum panels everywhere.',
    why: [
      'Wall panels improve clarity and reduce harsh reflections.',
      'Ceiling panels help with overhead reflections and drum energy.',
      'Budget and mounting access may make a staged approach smarter.',
    ],
    recommendation: 'Start with the live or jamming area that creates the most sound. Add ceiling panels later if the room still feels uncontrolled.',
    diagramTitle: 'Studio Panel Priority',
    diagramSteps: ['Side walls', 'Drum zone', 'Ceiling cloud'],
    faqs: [
      { question: 'Can I skip ceiling panels first?', answer: 'Yes, if wall treatment solves enough of the issue.' },
      { question: 'Do ceiling panels cost more?', answer: 'They can, because hardware and installation are usually more involved.' },
      { question: 'What about the control room?', answer: 'Treat it based on actual use. A resting room may need less than a recording room.' },
      { question: 'Can I add ceiling panels later?', answer: 'Yes, if the layout is planned properly.' },
      { question: 'Do panels help recording?', answer: 'Yes, they can reduce room reflections and make recordings cleaner.' },
    ],
  },
  {
    title: 'How to Choose Acoustic Panel Colours for Offices, Studios, and Cafes',
    slug: 'choose-acoustic-panel-colours-office-studio-cafe',
    category: 'buying-guides',
    metaTitle: 'How to Choose Acoustic Panel Colours',
    metaDescription: 'Simple colour guidance for acoustic panels in Singapore offices, studios, cafes, restaurants, and homes.',
    excerpt: 'The best acoustic panel colour is usually the one that fits the room quietly and still looks good under real lighting.',
    answer: 'Choose acoustic panel colours by matching the room style first, then the brand or feature wall second. For most offices, studios, and cafes, one well-chosen neutral colour looks cleaner than too many mixed colours.',
    context: 'Colour decisions can delay projects because fabric swatches look different under different lighting. A 3D mockup or physical sample can help.',
    why: [
      'Offices usually benefit from calm neutral tones.',
      'Studios can handle darker colours if the room mood supports it.',
      'Cafes often suit warm neutrals that blend with timber, stone, or plaster.',
    ],
    recommendation: 'Pick the safest colour family first, then test whether you want the panels to disappear or become a design feature.',
    diagramTitle: 'Colour Selection Map',
    diagramSteps: ['Room style', 'Lighting', 'Sample check'],
    faqs: [
      { question: 'Should offices use grey?', answer: 'Grey works, but warm neutral shades can feel less cold.' },
      { question: 'Can studios use black panels?', answer: 'Yes, if the room already has a darker visual direction.' },
      { question: 'Can cafes use beige or warm tones?', answer: 'Yes, these often blend well with timber and stone finishes.' },
      { question: 'Can I use brand colours?', answer: 'Yes, but use them carefully so the room does not feel too busy.' },
      { question: 'Should I decide from a screen?', answer: 'Use screen previews for direction, but physical samples are better for final colour.' },
    ],
  },
]

function key() {
  return Math.random().toString(36).slice(2, 14)
}

function cleanText(value: string) {
  return value
    .replace(/—/g, ',')
    .replace(/\s+/g, ' ')
    .trim()
}

function block(text: string, style = 'normal', listItem?: 'bullet' | 'number') {
  const id = key()
  return {
    _type: 'block',
    _key: id,
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    children: [{ _type: 'span', _key: `${id}-s`, text: cleanText(text), marks: [] }],
    markDefs: [],
  }
}

function linkBlock(before: string, anchor: string, href: string, after = '') {
  const id = key()
  const linkKey = key()
  return {
    _type: 'block',
    _key: id,
    style: 'normal',
    children: [
      { _type: 'span', _key: `${id}-a`, text: cleanText(before), marks: [] },
      { _type: 'span', _key: `${id}-b`, text: cleanText(anchor), marks: [linkKey] },
      { _type: 'span', _key: `${id}-c`, text: cleanText(after), marks: [] },
    ],
    markDefs: [
      {
        _key: linkKey,
        _type: 'link',
        href,
      },
    ],
  }
}

function imageBlock(assetRef: string, alt: string) {
  return {
    _type: 'image',
    _key: key(),
    asset: { _type: 'reference', _ref: assetRef },
    alt,
  }
}

function categoryProblemLine(category: ArticleSeed['category']) {
  switch (category) {
    case 'office-acoustics':
      return 'For offices, the real problem is usually not one loud person. It is a room with too many hard surfaces, glass, light partitions, and not enough absorption.'
    case 'restaurant-noise':
      return 'For cafes and restaurants, the problem normally builds up during service. One table is fine, then ten tables start talking over each other and the room becomes tiring.'
    case 'echo-control':
      return 'For homes and studios, the issue is usually comfort and clarity. You want the room to feel controlled without making it dull or over-treated.'
    case 'buying-guides':
      return 'For most buyers, the hard part is not knowing the product name. It is knowing what information matters before asking for a quote.'
  }
}

function categoryExampleLine(category: ArticleSeed['category']) {
  switch (category) {
    case 'office-acoustics':
      return 'A common example is a glass meeting room in a Singapore office. The team wants better call clarity and less sound spilling into the open area, but there is also a screen wall, a door, and limited wall space.'
    case 'restaurant-noise':
      return 'A common example is a shophouse cafe with tiles, glass, timber tables, exposed ceiling services, and aircon units. The space looks good, but the sound becomes sharp when the shop is full.'
    case 'echo-control':
      return 'A common example is a piano corner, music room, or home studio inside a larger living space. The sound does not stay neatly in one small zone, so the room layout matters.'
    case 'buying-guides':
      return 'A common example is a client who sends a few photos first, then asks whether a site visit, floor plan, or exact measurement is needed before getting a price.'
  }
}

function categoryInternalLink(category: ArticleSeed['category']) {
  switch (category) {
    case 'office-acoustics':
      return {
        before: 'If this is for an office, it is also worth comparing the advice against the ',
        anchor: 'office acoustic treatment page',
        href: '/office-acoustic-treatment',
        after: ' before deciding the final layout.',
      }
    case 'restaurant-noise':
      return {
        before: 'If this is for a cafe or restaurant, compare the advice against the ',
        anchor: 'restaurant echo reduction page',
        href: '/restaurant-echo-reduction',
        after: ' because ceiling height and operating hours matter a lot.',
      }
    case 'echo-control':
      return {
        before: 'If this is for a music room, piano area, or studio, start with the ',
        anchor: 'acoustic panels Singapore guide',
        href: '/acoustic-panels-singapore',
        after: ' before choosing panel quantity.',
      }
    case 'buying-guides':
      return {
        before: 'If you are still comparing options, start with the ',
        anchor: 'acoustic panels Singapore guide',
        href: '/acoustic-panels-singapore',
        after: ', then narrow down the panel type and installation scope.',
      }
  }
}

function buyerChecks(article: ArticleSeed) {
  const checks = [
    'Main issue: describe the problem in plain words, such as echo, sound leakage, harsh piano sound, noisy dining, installation method, or quote approval.',
    'Room details: width, length, ceiling height, and clear photos of every wall.',
    'Constraints: glass, doors, screens, AC units, sprinklers, landlord rules, or building access.',
    'Decision point: whether you need a rough estimate, a site visit, or a full 3D proposal.',
  ]
  if (article.category === 'restaurant-noise') {
    checks.push('Timing: the best installation window is usually before opening, after closing, or on an off day.')
  }
  if (article.category === 'office-acoustics') {
    checks.push('Office access: check security registration, loading lift rules, and whether weekday installation is preferred.')
  }
  if (article.category === 'echo-control') {
    checks.push('Room use: tell us whether the space is for piano, calls, recording, jamming, or general comfort.')
  }
  return checks
}

function whenItWorks(article: ArticleSeed) {
  return [
    'This approach works best when the main issue is echo, speech clarity, harshness, or reflected sound inside the room.',
    'It works better when there is enough usable wall or ceiling area for proper panel placement.',
    'It is also a good fit when the client wants a clean, reversible, non-renovation-heavy improvement.',
  ]
}

function whenItDoesNot(article: ArticleSeed) {
  const base = [
    'It is not the right fix if the main problem is heavy sound transfer through weak walls, open gaps, or doors with no seals.',
    'It is also not ideal to guess the layout from one close-up photo because blocked wall space can change the recommendation.',
  ]
  if (article.category === 'restaurant-noise') {
    base.push('For high ceilings, do not assume a ladder-only installation is enough. Access and safety can change the scope.')
  } else if (article.category === 'office-acoustics') {
    base.push('For confidential meeting rooms, acoustic treatment should be separated from actual sound isolation work.')
  } else if (article.category === 'buying-guides') {
    base.push('For custom orders, lead time, minimum quantity, and installation scope should be confirmed before management approval.')
  } else {
    base.push('For music rooms, small DIY fixes may help a little, but they rarely replace proper coverage on reflective surfaces.')
  }
  return base
}

function wrapLabel(label: string, max = 22) {
  const words = label.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > max && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 2)
}

function diagramSvg(article: ArticleSeed, variant: 'hero' | 'inline') {
  const title = variant === 'hero' ? article.diagramTitle : 'Simple Next Step'
  const steps = variant === 'hero' ? article.diagramSteps : ['Send details', 'Review layout', 'Confirm scope']
  const subtitle = variant === 'hero' ? article.title : article.recommendation
  const cards = steps.map((step, index) => {
    const x = 98 + index * 315
    const lines = wrapLabel(step)
      .map((line, lineIndex) => `<tspan x="${x + 85}" dy="${lineIndex === 0 ? 0 : 24}">${line}</tspan>`)
      .join('')
    return `
      <g>
        <rect x="${x}" y="300" width="220" height="190" rx="22" fill="#ffffff" stroke="#d8d3ca" stroke-width="2"/>
        <circle cx="${x + 58}" cy="358" r="28" fill="#1f6f68"/>
        <text x="${x + 58}" y="369" text-anchor="middle" font-family="Arial" font-size="28" font-weight="700" fill="#ffffff">${index + 1}</text>
        <path d="M${x + 132} 356 q34 -34 68 0 q-34 34 -68 0z" fill="#d9b56d" opacity="0.9"/>
        <text x="${x + 85}" y="440" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#28322f">${lines}</text>
      </g>`
  }).join('')
  const arrows = [0, 1].map((index) => {
    const x = 325 + index * 315
    return `<path d="M${x} 392 H${x + 80}" stroke="#1f6f68" stroke-width="6" stroke-linecap="round"/><path d="M${x + 80} 392 l-18 -13 v26z" fill="#1f6f68"/>`
  }).join('')

  return `
  <svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="675" fill="#f5f1e8"/>
    <rect x="54" y="54" width="1092" height="567" rx="34" fill="#fbfaf6" stroke="#ddd5c8" stroke-width="2"/>
    <text x="92" y="130" font-family="Arial" font-size="42" font-weight="800" fill="#1d2926">${title}</text>
    <text x="92" y="176" font-family="Arial" font-size="22" fill="#59645f">${wrapLabel(subtitle, 82).join(' ')}</text>
    ${cards}
    ${arrows}
    <rect x="92" y="552" width="1016" height="2" fill="#ddd5c8"/>
    <text x="92" y="590" font-family="Arial" font-size="19" fill="#59645f">Just Acoustics Singapore, diagram guide for acoustic treatment decisions</text>
  </svg>`
}

async function uploadDiagram(article: ArticleSeed, variant: 'hero' | 'inline') {
  const svg = diagramSvg(article, variant)
  const png = await sharp(Buffer.from(svg)).png().toBuffer()
  const filename = `${article.slug}-${variant}-diagram.png`
  const asset = await sanity.assets.upload('image', png, {
    filename,
    contentType: 'image/png',
  })
  await mkdir(resolve(process.cwd(), 'generated/client-query-diagrams'), { recursive: true })
  await writeFile(resolve(process.cwd(), 'generated/client-query-diagrams', filename), png)
  return asset._id
}

function buildBody(article: ArticleSeed, inlineAssetRef: string) {
  const link = categoryInternalLink(article.category)
  return [
    block(article.answer),
    block('Quick take', 'h2'),
    block(`${article.context} ${categoryProblemLine(article.category)}`),
    block('The key is to separate acoustic treatment from full soundproofing. Acoustic treatment improves how sound behaves inside the room. Soundproofing is construction work that blocks sound from entering or leaving. Many clients ask for soundproofing, but what they actually need first is echo control and clearer speech.'),
    block('Why this happens', 'h2'),
    block('Sound keeps bouncing when there are too many hard surfaces and not enough absorption. In Singapore spaces, this often means glass walls, tiled floors, concrete ceilings, hard tables, and compact rooms with little soft furnishing.'),
    imageBlock(inlineAssetRef, `${article.diagramTitle} diagram`),
    block('What usually matters', 'h2'),
    ...article.why.map((item) => block(item, 'normal', 'bullet')),
    block('When this approach works well', 'h2'),
    ...whenItWorks(article).map((item) => block(item, 'normal', 'bullet')),
    block('When to be careful', 'h2'),
    ...whenItDoesNot(article).map((item) => block(item, 'normal', 'bullet')),
    block('A realistic Singapore example', 'h2'),
    block(categoryExampleLine(article.category)),
    block('In that kind of situation, the best answer is rarely "put panels everywhere". The better answer is to find the biggest reflective surfaces, avoid blocking screens or services, and choose a layout that the client can actually approve.'),
    linkBlock(link.before, link.anchor, link.href, link.after),
    block('Practical recommendation', 'h2'),
    block(article.recommendation),
    block('If budget is a concern, start with the highest-impact surfaces first. A smaller but well-placed treatment plan is usually better than buying a random number of panels and hoping for the best.'),
    block('How to get a useful quote', 'h2'),
    block('Before asking for a quote, prepare these details. It saves back-and-forth and makes the first estimate much more accurate.'),
    ...buyerChecks(article).map((item) => block(item, 'normal', 'bullet')),
    block('What we would check before confirming', 'h2'),
    block('We would look at the available wall or ceiling area, check whether the suggested panel count fits the room, and confirm if the installation method suits the site. For commercial spaces, access timing, loading bay rules, security registration, and work-at-height requirements can also affect the plan.'),
    block('If you want help, send us the room details on WhatsApp and we will tell you the cleanest next step before you commit to anything.'),
  ]
}

async function main() {
  const start = new Date('2026-07-10T02:00:00.000Z')
  const spacingMs = Math.floor((14 * 24 * 60 * 60 * 1000) / articles.length)
  const results: { title: string; slug: string; id: string }[] = []

  for (let index = 0; index < articles.length; index++) {
    const article = articles[index]
    const heroRef = await uploadDiagram(article, 'hero')
    const inlineRef = await uploadDiagram(article, 'inline')
    const publishedAt = new Date(start.getTime() + index * spacingMs).toISOString()
    const docId = `drafts.client-query-${article.slug}`

    const doc = {
      _id: docId,
      _type: 'post',
      title: cleanText(article.title),
      slug: { _type: 'slug', current: article.slug },
      category: article.category,
      contentType: 'article',
      mainImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: heroRef },
        alt: `${article.diagramTitle} diagram`,
      },
      excerpt: cleanText(article.excerpt),
      publishedAt,
      body: buildBody(article, inlineRef),
      faqs: article.faqs.map((faq) => ({
        _key: key(),
        _type: 'faqItem',
        question: cleanText(faq.question),
        answer: cleanText(faq.answer),
      })),
      imagePrompts: [
        {
          _key: key(),
          _type: 'imagePrompt',
          role: 'hero',
          placement: 'hero',
          aspectRatio: '16:9',
          alt: `${article.diagramTitle} diagram`,
          prompt: `Clean editorial diagram for "${article.title}" with icons, numbered callouts, arrows, warm neutral background, teal accent, no fake project photo, no long text.`,
        },
        {
          _key: key(),
          _type: 'imagePrompt',
          role: 'inline',
          placement: 'after-h2-1',
          aspectRatio: '16:9',
          alt: `Step diagram for ${article.title}`,
          prompt: `Simple infographic showing ${article.diagramSteps.join(', ')}. Use icons, numbers, arrows, and concise labels only. No photorealistic room image.`,
        },
      ],
      seo: {
        metaTitle: cleanText(article.metaTitle),
        metaDescription: cleanText(article.metaDescription),
      },
    }

    await sanity.createOrReplace(doc)
    results.push({ title: article.title, slug: article.slug, id: docId })
    console.log(`[${index + 1}/${articles.length}] ${article.title}`)
  }

  await mkdir(resolve(process.cwd(), 'generated'), { recursive: true })
  await writeFile(
    resolve(process.cwd(), 'generated/client-query-drafts-created.json'),
    JSON.stringify({ createdAt: new Date().toISOString(), results }, null, 2)
  )

  console.log(`Done. Created or replaced ${results.length} Sanity draft posts.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
