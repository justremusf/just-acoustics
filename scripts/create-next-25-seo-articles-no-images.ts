import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
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

type Category = 'echo-control' | 'office-acoustics' | 'restaurant-noise' | 'buying-guides'

type ArticleSeed = {
  title: string
  slug: string
  category: Category
  metaTitle: string
  metaDescription: string
  excerpt: string
  answer: string
  context: string
  factors: string[]
  advice: string
  warning: string
  example: string
  faqs: { question: string; answer: string }[]
}

const articles: ArticleSeed[] = [
  {
    title: 'What Is NRC Rating and Why Does It Matter for Acoustic Panels?',
    slug: 'nrc-rating-acoustic-panels-singapore',
    category: 'buying-guides',
    metaTitle: 'NRC Rating for Acoustic Panels',
    metaDescription: 'Understand NRC ratings for acoustic panels in simple terms before comparing products for offices, studios, homes, or restaurants.',
    excerpt: 'NRC is a useful shortcut for comparing acoustic absorption, but it should not be the only thing you look at.',
    answer: 'NRC rating tells you how much sound a material absorbs on average across common speech frequencies. A higher NRC usually means better absorption, but panel thickness, placement, room size, and the sound problem still matter.',
    context: 'Many buyers see NRC numbers in catalogues and assume the highest number is always the best choice. It is useful, but it does not tell the full story of how a room will feel after treatment.',
    factors: ['NRC is an average, not a full acoustic report.', 'Speech clarity, music control, and low-frequency control may need different panel choices.', 'A good panel in the wrong place can still underperform.'],
    advice: 'Use NRC as a filter, then check thickness, mounting method, quantity, and room layout before deciding.',
    warning: 'Do not buy only based on one number. If the room has bass problems, glass, high ceilings, or poor doors, NRC alone will not explain everything.',
    example: 'A meeting room may improve with panels that target speech reflections, while a music studio may need thicker panels or bass traps for lower frequencies.',
    faqs: [
      { question: 'Is a higher NRC always better?', answer: 'Usually it means more absorption, but suitability still depends on the room and frequency range.' },
      { question: 'What NRC is good for acoustic panels?', answer: 'Many proper acoustic panels sit around the higher absorption range, but compare full specs where possible.' },
      { question: 'Does NRC measure soundproofing?', answer: 'No. NRC measures absorption, not how much sound is blocked between rooms.' },
      { question: 'Should restaurants care about NRC?', answer: 'Yes, but placement and total coverage matter as much as the rating.' },
      { question: 'Can I ask for test reports?', answer: 'Yes. For commercial projects, product specifications can be useful for approval too.' },
    ],
  },
  {
    title: 'Are Thicker Acoustic Panels Always Better?',
    slug: 'are-thicker-acoustic-panels-better',
    category: 'buying-guides',
    metaTitle: 'Are Thicker Acoustic Panels Better?',
    metaDescription: 'Learn when thicker acoustic panels are worth it, and when standard panels are enough for Singapore rooms.',
    excerpt: 'Thicker panels can absorb more sound, especially lower frequencies, but they are not automatically the right choice for every room.',
    answer: 'Thicker acoustic panels are often better for broader absorption, especially when the room sounds boomy or uncontrolled. But for speech echo in offices, cafes, and homes, good placement and enough coverage can matter more than simply choosing the thickest panel.',
    context: 'Clients often ask whether they should pay for thicker panels. The answer depends on whether the problem is speech clarity, harsh echo, piano loudness, drum energy, or low-frequency build-up.',
    factors: ['Thickness helps with lower frequencies.', 'Standard panels can work well for speech and general echo.', 'Thicker panels take up more space and may affect the look of the room.'],
    advice: 'Choose thickness based on the sound issue first. For speech echo, focus on coverage and placement. For studios and music rooms, consider thicker panels or bass traps.',
    warning: 'Do not overspend on thickness if the room mainly needs better wall or ceiling coverage.',
    example: 'A cafe with high ceilings may need more ceiling coverage, while a small jam room may need thicker treatment in corners and on key walls.',
    faqs: [
      { question: 'Are 50mm panels enough?', answer: 'They can be enough for many speech and echo-control projects, depending on layout.' },
      { question: 'When do I need thicker panels?', answer: 'Consider thicker panels for music rooms, studios, drums, or rooms that sound boomy.' },
      { question: 'Do thicker panels block more noise?', answer: 'They absorb more sound inside the room. They are still not full soundproofing.' },
      { question: 'Will thicker panels look bulky?', answer: 'They can, so design and placement should be considered early.' },
      { question: 'Can I mix thicknesses?', answer: 'Yes, especially in studios where different surfaces may need different treatment.' },
    ],
  },
  {
    title: 'Acoustic Foam vs Acoustic Panels: What Actually Works Better?',
    slug: 'acoustic-foam-vs-acoustic-panels-singapore',
    category: 'buying-guides',
    metaTitle: 'Acoustic Foam vs Acoustic Panels',
    metaDescription: 'Compare acoustic foam and proper acoustic panels before choosing a treatment option for Singapore homes, offices, or studios.',
    excerpt: 'Acoustic foam can help a little, but proper acoustic panels are usually the better long-term solution for serious echo control.',
    answer: 'Acoustic foam and acoustic panels both absorb sound, but they are not equal. Foam is usually lighter and cheaper, while proper acoustic panels tend to perform better, look cleaner, and suit commercial or home interiors more naturally.',
    context: 'Many buyers try foam first because it is easy to buy online. It can help small reflections, but it often disappoints in larger rooms, piano spaces, restaurants, and offices.',
    factors: ['Foam is usually thinner and less durable.', 'Panels can be made with better cores, fabric finishes, and safer mounting systems.', 'Commercial spaces often need better-looking and better-documented products.'],
    advice: 'Use foam only for small, low-risk experiments. For a room that clients, staff, family, or customers actually use, start with proper panels.',
    warning: 'Do not cover random walls with cheap foam and expect a professional result.',
    example: 'A podcast corner may improve slightly with foam, but a meeting room or restaurant usually needs panels planned around the room layout.',
    faqs: [
      { question: 'Is acoustic foam useless?', answer: 'No, but it is often limited and can look messy outside casual setups.' },
      { question: 'Are panels more expensive?', answer: 'Usually yes, but they are more suitable for proper interiors and long-term use.' },
      { question: 'Does foam help soundproofing?', answer: 'No. Foam mainly absorbs reflections inside the room.' },
      { question: 'Can I replace foam later?', answer: 'Yes, but check wall condition if adhesive foam was used.' },
      { question: 'What should offices use?', answer: 'Offices usually look better and perform better with proper acoustic panels.' },
    ],
  },
  {
    title: 'Where Should Acoustic Panels Be Placed First in a Room?',
    slug: 'where-to-place-acoustic-panels-first',
    category: 'buying-guides',
    metaTitle: 'Where to Place Acoustic Panels First',
    metaDescription: 'A practical placement guide for acoustic panels in offices, homes, studios, classrooms, and restaurants.',
    excerpt: 'Panel placement should start with the surfaces creating the strongest reflections, not with whatever wall is empty.',
    answer: 'Acoustic panels should usually be placed first on the largest hard surfaces near the sound source and listening area. For many rooms, that means side walls, back walls, ceiling areas, or the surfaces directly opposite glass or bare walls.',
    context: 'Bad placement is one of the fastest ways to waste budget. A room can have enough panels but still sound poor if they are placed away from the main reflection paths.',
    factors: ['Where sound starts from matters.', 'Where people listen or sit matters.', 'Glass, tiles, concrete, and bare walls usually need attention first.'],
    advice: 'Start with the most reflective surfaces around the actual activity: meetings, piano, calls, dining, recording, or teaching.',
    warning: 'Do not place panels only where they look symmetrical if those areas do not affect the sound problem.',
    example: 'For a meeting room, panels near the meeting table often matter more than a decorative wall far from where people speak.',
    faqs: [
      { question: 'Should panels go behind the speaker?', answer: 'Sometimes, but side and opposite reflections may matter more.' },
      { question: 'Should panels be spread evenly?', answer: 'Not always. Strategic placement usually works better.' },
      { question: 'Can panels go on the ceiling?', answer: 'Yes, especially when wall space is limited or ceilings are high.' },
      { question: 'Do I need a site visit?', answer: 'For complex rooms, yes. It helps confirm the best surfaces.' },
      { question: 'Can I start with fewer panels?', answer: 'Yes, if the first panels go on the highest-impact surfaces.' },
    ],
  },
  {
    title: 'What Are First Reflection Points and Do They Matter?',
    slug: 'first-reflection-points-acoustic-treatment',
    category: 'echo-control',
    metaTitle: 'First Reflection Points Explained',
    metaDescription: 'Understand first reflection points and why they matter for studios, podcast rooms, home offices, and meeting rooms.',
    excerpt: 'First reflection points are the early bounce points that can make speech, music, and recordings sound unclear.',
    answer: 'First reflection points are the surfaces where sound first bounces before reaching your ears or microphone. Treating them can make speech clearer, recordings cleaner, and music less smeared.',
    context: 'This idea is common in studios, but it also matters in meeting rooms, podcast rooms, and work-from-home setups where microphones pick up room reflections.',
    factors: ['Side walls often create early reflections.', 'Ceilings can matter when speakers, voices, or instruments project upward.', 'The listening or microphone position decides which surfaces matter most.'],
    advice: 'If the room is used for recording, calls, or focused listening, identify the first reflection points before buying panels.',
    warning: 'Do not copy another room layout blindly. Reflection points change with furniture, speaker position, and where people sit.',
    example: 'A podcast room may need side-wall panels near the desk, while a piano room may need treatment around the instrument and listening area.',
    faqs: [
      { question: 'Do first reflection points matter for offices?', answer: 'Yes, especially for call rooms, meeting rooms, and video recording rooms.' },
      { question: 'How do I find them?', answer: 'A site visit or simple mirror method can help identify likely reflection points.' },
      { question: 'Are ceiling reflections important?', answer: 'They can be, especially in low or hard-ceiling rooms.' },
      { question: 'Is this only for studios?', answer: 'No. It is just most commonly discussed in studio design.' },
      { question: 'Should I treat every reflection point?', answer: 'Not always. Treat the ones that affect the main use of the room.' },
    ],
  },
  {
    title: 'Why Do Small Rooms Sound Boxy or Boomy?',
    slug: 'why-small-rooms-sound-boxy-boomy',
    category: 'echo-control',
    metaTitle: 'Why Small Rooms Sound Boxy or Boomy',
    metaDescription: 'Learn why small rooms in Singapore homes and studios can sound boxy, boomy, or muddy, and what treatment helps.',
    excerpt: 'Small rooms often sound boxy because sound reflections and low frequencies build up quickly in a tight space.',
    answer: 'Small rooms sound boxy or boomy because reflections hit the listener quickly and low frequencies build up between nearby walls. The room may feel loud, muddy, or tiring even at moderate volume.',
    context: 'This is common in home studios, practice rooms, spare bedrooms, and small office call rooms. The smaller the room, the less time sound has to decay naturally.',
    factors: ['Parallel walls create repeated reflections.', 'Corners can build up low-frequency energy.', 'Thin foam usually does not solve low-frequency boom.'],
    advice: 'Use thicker absorption where needed, treat key wall surfaces, and consider bass traps if the room is used for music or recording.',
    warning: 'Do not assume a small room needs fewer acoustic decisions. Small rooms are often less forgiving.',
    example: 'A compact drum room may need wall panels plus corner treatment, while a small Zoom room may only need wall panels around the desk.',
    faqs: [
      { question: 'Is boxy sound the same as echo?', answer: 'Not exactly. Boxiness often includes short reflections and low-mid build-up.' },
      { question: 'Will normal panels help?', answer: 'Yes for reflections, but boom may need thicker or corner treatment.' },
      { question: 'Are small rooms easier to treat?', answer: 'They need fewer panels, but placement and thickness matter more.' },
      { question: 'Can furniture help?', answer: 'Soft furniture can help a little, but it is usually not targeted enough.' },
      { question: 'Should I measure the room?', answer: 'Yes. Small changes in dimensions can affect the sound.' },
    ],
  },
  {
    title: 'Do I Need Bass Traps or Just Acoustic Panels?',
    slug: 'do-i-need-bass-traps-singapore',
    category: 'echo-control',
    metaTitle: 'Do I Need Bass Traps?',
    metaDescription: 'Find out when bass traps are needed instead of standard acoustic panels for studios, music rooms, and small rooms.',
    excerpt: 'Bass traps are useful when the room has low-frequency build-up, not just normal speech echo.',
    answer: 'You need bass traps when the room has low-frequency problems such as boom, muddiness, or uneven bass. Standard acoustic panels can reduce reflections, but bass traps are better suited for corners and lower-frequency build-up.',
    context: 'This question matters most for studios, jam rooms, home theatres, and music practice spaces. A meeting room usually does not need bass traps unless there is a special audio use case.',
    factors: ['Bass often builds up in corners.', 'Drums, bass guitars, speakers, and subwoofers create more low-frequency energy.', 'Standard thin treatment may leave the room boomy.'],
    advice: 'If the room is for music, recording, mixing, or drums, consider bass control early. If it is for speech, start with normal wall or ceiling panels.',
    warning: 'Do not buy bass traps just because they sound technical. Match them to the actual room problem.',
    example: 'A jam studio may need bass traps in corners, while a conference room mainly needs speech-focused absorption.',
    faqs: [
      { question: 'Are bass traps only for studios?', answer: 'Mostly, but they can also help music rooms and home theatres.' },
      { question: 'Can acoustic panels act as bass traps?', answer: 'Some thicker panels can help, but true bass trapping is usually deeper or corner-focused.' },
      { question: 'Where do bass traps go?', answer: 'Usually in corners or boundary areas where bass builds up.' },
      { question: 'Do restaurants need bass traps?', answer: 'Usually no. Restaurants normally need broad echo control.' },
      { question: 'Should I buy bass traps first?', answer: 'Only if low-frequency build-up is the main problem.' },
    ],
  },
  {
    title: 'What Are Sound Diffusers and Do You Need Them?',
    slug: 'what-are-sound-diffusers',
    category: 'buying-guides',
    metaTitle: 'What Are Sound Diffusers?',
    metaDescription: 'A simple guide to sound diffusers, when they help, and when acoustic absorption is the better choice.',
    excerpt: 'Sound diffusers scatter reflections instead of absorbing them, but most problem rooms need absorption first.',
    answer: 'Sound diffusers spread reflections around the room instead of absorbing them. They can help a room feel more natural, but they are usually not the first solution for echo-heavy offices, restaurants, or homes.',
    context: 'Diffusers look interesting and appear in many studio photos, so buyers sometimes ask if they need them. In many Singapore spaces, absorption is more practical.',
    factors: ['Diffusers need enough room distance to work properly.', 'Absorbers are better for reducing echo and harshness.', 'Studios may use both absorption and diffusion.'],
    advice: 'Use diffusers only after the main echo problem is controlled, or when the room needs a more natural acoustic feel for music or recording.',
    warning: 'Do not use diffusers as decoration and expect them to fix a noisy restaurant or glass meeting room.',
    example: 'A recording studio may use rear-wall diffusion, while a small meeting room usually needs absorption panels instead.',
    faqs: [
      { question: 'Do diffusers absorb sound?', answer: 'No. They scatter sound. Absorbers reduce reflected sound energy.' },
      { question: 'Are diffusers good for restaurants?', answer: 'Usually absorption is more useful for restaurant noise control.' },
      { question: 'Do home studios need diffusers?', answer: 'Some do, but most should control first reflections and bass first.' },
      { question: 'Can diffusers look good?', answer: 'Yes, but design should not be the only reason to use them.' },
      { question: 'Should I combine diffusers and panels?', answer: 'Yes, for some music rooms and studios, after the room goal is clear.' },
    ],
  },
  {
    title: 'Why Cheap Acoustic Foam Often Disappoints Buyers',
    slug: 'why-cheap-acoustic-foam-disappoints',
    category: 'buying-guides',
    metaTitle: 'Why Cheap Acoustic Foam Disappoints',
    metaDescription: 'Why cheap acoustic foam often fails to solve echo, noise, and room clarity problems in real Singapore spaces.',
    excerpt: 'Cheap foam can feel like a quick fix, but it often disappoints because the real problem is bigger than the foam can handle.',
    answer: 'Cheap acoustic foam often disappoints because it is thin, inconsistently made, visually messy, and poor at solving larger room problems. It may reduce a bit of flutter echo, but it usually does not create a polished acoustic result.',
    context: 'This is a common path: buy foam online, stick it to the wall, then realise the room still sounds echoey or unprofessional.',
    factors: ['Thin foam mainly affects high frequencies.', 'Adhesive can damage paint when removed.', 'Foam often looks out of place in offices, homes, and restaurants.'],
    advice: 'If the room matters to clients, customers, staff, or recordings, skip random foam and plan proper acoustic treatment.',
    warning: 'Cheap foam can also create a false sense of progress while the main reflection surfaces remain untreated.',
    example: 'A piano room with hard floors and glass will not be fixed by a small foam patch behind the piano.',
    faqs: [
      { question: 'Is all foam bad?', answer: 'No, but cheap thin foam is limited and often not suitable for finished interiors.' },
      { question: 'Can foam help a podcast corner?', answer: 'It can help slightly, but proper panels usually look and perform better.' },
      { question: 'Will foam stop noise from leaving?', answer: 'No. Foam is not soundproofing.' },
      { question: 'Why do people still buy foam?', answer: 'It is cheap, easy to find, and looks like studio treatment online.' },
      { question: 'What should I use instead?', answer: 'Use proper panels with a layout based on the room problem.' },
    ],
  },
  {
    title: 'How to Improve Speech Clarity in a Conference Room',
    slug: 'improve-speech-clarity-conference-room',
    category: 'office-acoustics',
    metaTitle: 'Improve Conference Room Speech Clarity',
    metaDescription: 'Practical ways to improve speech clarity in conference rooms using acoustic treatment, layout checks, and simple preparation.',
    excerpt: 'Speech clarity improves when reflections are controlled and voices do not bounce around the room.',
    answer: 'To improve speech clarity in a conference room, reduce reflections from hard walls, glass, ceilings, and large tables. The goal is to make voices easier to understand in person and through microphones.',
    context: 'Conference rooms often look premium but sound poor. Glass walls, long tables, and hard ceilings can make every voice smear together.',
    factors: ['Large tables reflect speech upward.', 'Glass walls create sharp reflections.', 'Microphones pick up room echo as well as voices.'],
    advice: 'Treat wall and ceiling surfaces near the meeting area, then check microphone placement and speaker volume.',
    warning: 'Do not solve a speech clarity problem by simply turning up the speakers. It can make the room louder and less clear.',
    example: 'A boardroom with a long hard table may need wall panels plus ceiling absorption above the table.',
    faqs: [
      { question: 'Is this the same as soundproofing?', answer: 'No. Speech clarity is about sound quality inside the room.' },
      { question: 'Will panels help video calls?', answer: 'Yes, because microphones capture less room echo.' },
      { question: 'Where should panels go?', answer: 'Start near the meeting table and major reflective wall surfaces.' },
      { question: 'Do carpets help?', answer: 'They can help floor reflections, but walls and ceilings often still matter.' },
      { question: 'Can this be done without renovation?', answer: 'Often yes, using wall or ceiling-mounted acoustic panels.' },
    ],
  },
  {
    title: 'How to Reduce Echo in a Training Room or Classroom',
    slug: 'reduce-echo-training-room-classroom-singapore',
    category: 'echo-control',
    metaTitle: 'Reduce Echo in Training Rooms',
    metaDescription: 'How acoustic treatment improves speech clarity and listening comfort in Singapore training rooms and classrooms.',
    excerpt: 'Training rooms and classrooms need clear speech because people spend long periods listening and speaking.',
    answer: 'To reduce echo in a training room or classroom, treat the hard surfaces that reflect the trainer’s voice back into the room. Acoustic panels can make speech clearer and reduce listening fatigue.',
    context: 'Singapore training rooms often have glass, whiteboards, vinyl floors, and movable furniture. These surfaces are practical, but they can make voices sound sharp.',
    factors: ['Trainers speak for long periods.', 'Students or staff need to understand speech clearly.', 'Whiteboards, glass, and hard floors increase reflections.'],
    advice: 'Prioritise the walls around the teaching zone and the larger reflective surfaces near the audience.',
    warning: 'Do not block whiteboards, projectors, or classroom fixtures. The treatment layout should work around the teaching setup.',
    example: 'A tuition room with bare walls may only need targeted wall panels, while a larger seminar room may need ceiling treatment too.',
    faqs: [
      { question: 'Can acoustic panels help learning spaces?', answer: 'Yes, clearer speech makes the room easier to listen in.' },
      { question: 'Do panels need to cover every wall?', answer: 'No. Strategic coverage is usually better.' },
      { question: 'Can panels be installed during school holidays?', answer: 'Yes, scheduling can be planned around downtime.' },
      { question: 'Will panels affect the design?', answer: 'They can be selected to blend with the room.' },
      { question: 'Do classrooms need soundproofing?', answer: 'Only if outside noise or room-to-room transfer is the main issue.' },
    ],
  },
  {
    title: 'Acoustic Treatment for Podcast Rooms in Singapore',
    slug: 'podcast-room-acoustic-treatment-singapore',
    category: 'echo-control',
    metaTitle: 'Podcast Room Acoustic Treatment',
    metaDescription: 'Set up a better-sounding podcast room in Singapore with practical acoustic treatment for walls, corners, and recording positions.',
    excerpt: 'Podcast rooms need controlled reflections so voices sound close, clear, and less room-heavy.',
    answer: 'Podcast room acoustic treatment should focus on the walls around the speaker and microphone position. The aim is to reduce echo, flutter, and boxiness so voices sound clearer and more professional.',
    context: 'Many podcast rooms are converted from spare rooms, offices, or small meeting rooms. The equipment may be good, but the room sound can still make recordings feel amateur.',
    factors: ['Microphones capture reflections from nearby walls.', 'Small rooms can sound boxy.', 'Bare desks, glass, and hard ceilings can add harshness.'],
    advice: 'Start with panels behind and beside the speaker position, then assess whether corners or ceiling reflections need treatment.',
    warning: 'Do not rely only on microphone upgrades. A better mic can capture bad room sound more clearly.',
    example: 'A founder recording videos in a small office may need wall panels around the desk more than a full studio build-out.',
    faqs: [
      { question: 'Do podcast rooms need bass traps?', answer: 'Sometimes, especially in small rooms with boomy voices.' },
      { question: 'Can I treat a podcast room without drilling?', answer: 'Often yes for wall panels, depending on surface and mounting method.' },
      { question: 'Should I use foam?', answer: 'Proper panels usually look cleaner and perform better.' },
      { question: 'Does ceiling treatment matter?', answer: 'It can, especially in small rooms with hard ceilings.' },
      { question: 'Can this work in an office?', answer: 'Yes. Many podcast rooms are office conversions.' },
    ],
  },
  {
    title: 'Acoustic Treatment for Video Call Rooms and Zoom Booths',
    slug: 'video-call-room-acoustic-treatment-singapore',
    category: 'office-acoustics',
    metaTitle: 'Video Call Room Acoustic Treatment',
    metaDescription: 'Improve Zoom booths, video call rooms, and small office call spaces with practical acoustic treatment in Singapore.',
    excerpt: 'Small video call rooms need acoustic treatment because microphones make room echo very obvious.',
    answer: 'Video call rooms and Zoom booths need acoustic treatment around the speaker and microphone position. Even a small room can sound echoey if the walls, desk, glass, or ceiling are too reflective.',
    context: 'Many offices add phone booths or small call rooms, then realise calls still sound hollow. The room is private enough visually, but not always comfortable acoustically.',
    factors: ['Microphones exaggerate room echo.', 'Small hard rooms create short, boxy reflections.', 'Glass doors and bare walls are common weak points.'],
    advice: 'Treat the wall behind the speaker, side reflections, and any hard surfaces close to the microphone.',
    warning: 'Do not assume a small room needs no treatment. Small rooms often need acoustic planning more than large ones.',
    example: 'A two-person Zoom room with glass on one side may need panels on the back and side walls to sound natural.',
    faqs: [
      { question: 'Will panels improve call audio?', answer: 'Yes, they can reduce room echo picked up by the microphone.' },
      { question: 'Do call booths need soundproofing?', answer: 'Some do, but echo control inside the booth is a separate issue.' },
      { question: 'Can panels fit small booths?', answer: 'Yes, with compact layouts and suitable mounting.' },
      { question: 'Should panels go behind the monitor?', answer: 'Sometimes, but side and rear walls often matter too.' },
      { question: 'Can this be done after renovation?', answer: 'Yes, acoustic treatment can often be added after the room is built.' },
    ],
  },
  {
    title: 'How to Make a Home Office Sound Better for Calls',
    slug: 'home-office-sound-better-for-calls',
    category: 'echo-control',
    metaTitle: 'Make a Home Office Sound Better',
    metaDescription: 'Simple acoustic treatment advice for Singapore home offices, video calls, online lessons, and recordings.',
    excerpt: 'A home office sounds better when nearby wall reflections and hard surfaces are controlled.',
    answer: 'To make a home office sound better for calls, reduce reflections around your desk and microphone. Wall panels, soft furnishings, and smart placement can make your voice sound clearer and less hollow.',
    context: 'Singapore home offices are often bedrooms, study corners, or living room setups. Hard walls, windows, and desks can make calls sound echoey even with a good headset.',
    factors: ['The wall behind or beside you can reflect your voice.', 'Windows and hard desks add brightness.', 'Microphone position affects how much room sound is captured.'],
    advice: 'Start with the wall nearest your speaking position, then add treatment where the room still sounds sharp.',
    warning: 'Do not buy random foam squares just because the room sounds bad. Placement matters more than decoration.',
    example: 'A study room used for Zoom calls may only need a few well-placed wall panels and better desk positioning.',
    faqs: [
      { question: 'Do I need professional treatment for a home office?', answer: 'Not always, but proper panels help if calls matter to your work.' },
      { question: 'Can curtains help?', answer: 'They can help a little, especially near windows.' },
      { question: 'Where should panels go?', answer: 'Start near your desk and the main reflective wall surfaces.' },
      { question: 'Can this be renter-friendly?', answer: 'Yes, depending on mounting method and wall condition.' },
      { question: 'Will this block neighbour noise?', answer: 'No. That is a soundproofing issue, not just acoustic treatment.' },
    ],
  },
  {
    title: 'Why Restaurants Get Noisy Even When They Are Not Full',
    slug: 'why-restaurants-get-noisy-before-full',
    category: 'restaurant-noise',
    metaTitle: 'Why Restaurants Get Noisy Before Full',
    metaDescription: 'Why restaurants can feel noisy before peak crowd levels, and how acoustic treatment can keep the atmosphere comfortable.',
    excerpt: 'Restaurants can become noisy early because hard surfaces amplify the first few tables of conversation.',
    answer: 'Restaurants get noisy even before they are full because early conversations, cutlery, music, and hard surfaces start a feedback loop. As the room gets louder, guests speak louder, and the noise rises quickly.',
    context: 'This is common in cafes, bakeries, wine bars, and compact restaurants with hard finishes. The problem is not always crowd size. It is how the room handles sound.',
    factors: ['Hard surfaces reflect speech and cutlery noise.', 'Background music adds to the base noise level.', 'Guests raise their voices when the room feels loud.'],
    advice: 'Treat ceiling and wall surfaces before the room reaches the point where customers must talk over each other.',
    warning: 'Do not wait until reviews mention noise. By then, the acoustic issue is already affecting customer experience.',
    example: 'A small cafe with concrete ceiling and glass frontage can feel loud at half capacity if there is no absorption.',
    faqs: [
      { question: 'Does acoustic treatment make restaurants too quiet?', answer: 'No. The aim is comfortable energy, not silence.' },
      { question: 'Should panels go on the ceiling?', answer: 'Often yes, especially when wall space is limited.' },
      { question: 'Can treatment be added after opening?', answer: 'Yes, usually during off hours or rest days.' },
      { question: 'Will customers notice panels?', answer: 'They may not notice the panels, but they can feel the room is more comfortable.' },
      { question: 'Does furniture help?', answer: 'Soft furniture helps a bit, but hard restaurants usually need dedicated absorption.' },
    ],
  },
  {
    title: 'How Acoustic Panels Affect Restaurant Atmosphere',
    slug: 'how-acoustic-panels-affect-restaurant-atmosphere',
    category: 'restaurant-noise',
    metaTitle: 'Acoustic Panels and Restaurant Atmosphere',
    metaDescription: 'How acoustic panels can reduce harsh restaurant noise while keeping the space lively, warm, and comfortable.',
    excerpt: 'Good acoustic treatment should keep a restaurant lively while removing the harsh edge from the room.',
    answer: 'Acoustic panels affect restaurant atmosphere by reducing harsh reflections and making conversations easier. They should not make the restaurant silent. The goal is lively but comfortable.',
    context: 'Some owners worry that acoustic treatment will kill the vibe. In practice, a noisy room often feels less premium because guests leave tired.',
    factors: ['Too much echo makes service feel chaotic.', 'Good treatment lets music and conversation sit better together.', 'Panel colour and placement affect the visual mood.'],
    advice: 'Treat the noisiest reflective surfaces while preserving the interior design and desired energy level.',
    warning: 'Avoid over-treating blindly. A restaurant should still feel alive.',
    example: 'A bakery cafe may use ceiling panels in a warm neutral colour so guests notice comfort more than the treatment itself.',
    faqs: [
      { question: 'Will panels make my restaurant feel dead?', answer: 'Not if coverage is planned properly.' },
      { question: 'Can panels match the interior?', answer: 'Yes, colour and placement can be selected around the design.' },
      { question: 'Do panels affect music?', answer: 'They can make music sound cleaner by reducing harsh reflections.' },
      { question: 'Will staff benefit too?', answer: 'Yes, less noise can make service less tiring.' },
      { question: 'Can treatment be subtle?', answer: 'Yes, especially with ceiling layouts or colour-matched panels.' },
    ],
  },
  {
    title: 'Can Acoustic Panels Match Interior Design?',
    slug: 'can-acoustic-panels-match-interior-design',
    category: 'buying-guides',
    metaTitle: 'Can Acoustic Panels Match Interior Design?',
    metaDescription: 'How acoustic panels can be planned around interior design for Singapore offices, cafes, homes, and studios.',
    excerpt: 'Acoustic panels can be designed to blend into the room instead of looking like an afterthought.',
    answer: 'Yes, acoustic panels can match interior design when colour, size, placement, and layout are considered early. They can blend in quietly or become a planned design feature.',
    context: 'This question comes up with offices, cafes, studios, and homes where the space must look finished. Acoustic treatment should not feel like a last-minute patch.',
    factors: ['Colour should work with wall, floor, and furniture tones.', 'Panel layout should respect screens, lights, doors, and branding.', 'Custom sizes or colours may affect lead time and MOQ.'],
    advice: 'Bring acoustic planning into the design discussion before final wall finishes and lighting are locked.',
    warning: 'Do not choose a panel colour from a screen only if the room lighting is important.',
    example: 'A studio may use darker panels as part of the mood, while an office may choose a softer neutral to blend into meeting rooms.',
    faqs: [
      { question: 'Can panels be colour matched?', answer: 'They can be selected from available fabric colours, with custom options depending on product line.' },
      { question: 'Can panels look premium?', answer: 'Yes, if they are planned into the layout instead of added randomly.' },
      { question: 'Should panels be symmetrical?', answer: 'Only if symmetry also supports the acoustic goal.' },
      { question: 'Can acoustic treatment work with branding?', answer: 'Yes, but brand colours should be used carefully.' },
      { question: 'Should my interior designer be involved?', answer: 'Yes, especially for restaurants, studios, and front-facing offices.' },
    ],
  },
  {
    title: 'Acoustic Panels for Renovation Projects: When Should You Plan Them?',
    slug: 'acoustic-treatment-renovation-projects-singapore',
    category: 'buying-guides',
    metaTitle: 'Plan Acoustic Panels During Renovation',
    metaDescription: 'When to plan acoustic panels during office, restaurant, studio, or home renovation projects in Singapore.',
    excerpt: 'The best time to plan acoustic treatment is before walls, ceilings, lights, and built-ins are finalised.',
    answer: 'Acoustic panels should be planned during renovation before wall finishes, ceiling services, lights, and built-ins are locked. Early planning gives more placement options and fewer compromises later.',
    context: 'Many clients only think about acoustics after renovation when the room looks finished but sounds bad. That is still fixable, but it can limit options.',
    factors: ['Ceiling services can block ideal panel locations.', 'Built-ins may remove usable wall area.', 'Early planning helps with colour and access decisions.'],
    advice: 'If the space will be used for meetings, dining, music, teaching, or recording, include acoustics in the renovation checklist.',
    warning: 'Do not wait until all surfaces are hard, reflective, and fully installed before asking about echo.',
    example: 'A new studio can plan wall panels and ceiling clouds before lighting and guitar hangers are finalised.',
    faqs: [
      { question: 'Can panels be added after renovation?', answer: 'Yes, but early planning usually gives a cleaner result.' },
      { question: 'Should the ID know about acoustics?', answer: 'Yes, especially if wall or ceiling space is limited.' },
      { question: 'Does renovation need soundproofing too?', answer: 'Only if sound isolation is part of the problem.' },
      { question: 'Can you quote from ID drawings?', answer: 'Yes, if dimensions and finishes are clear.' },
      { question: 'When should colours be chosen?', answer: 'Before production, especially for custom or made-to-order panels.' },
    ],
  },
  {
    title: 'Should Acoustic Treatment Be Planned Before or After Interior Design?',
    slug: 'plan-acoustic-treatment-before-interior-design',
    category: 'buying-guides',
    metaTitle: 'Plan Acoustic Treatment Before ID?',
    metaDescription: 'Why acoustic treatment should be considered early in interior design for offices, studios, restaurants, and homes.',
    excerpt: 'Acoustic treatment works best when it is planned with the interior, not squeezed in after everything else is fixed.',
    answer: 'Acoustic treatment should ideally be planned before interior design is fully finalised. It does not need to lead the design, but it should influence wall space, ceiling access, finishes, and colour choices.',
    context: 'When acoustics are added too late, the best surfaces may already be blocked by screens, shelves, lights, branding, or decorative finishes.',
    factors: ['Interior finishes affect sound.', 'Acoustic panels need real wall or ceiling space.', 'Colour and shape decisions are easier before production.'],
    advice: 'Bring the acoustic discussion in once the room use and rough layout are known.',
    warning: 'If acoustics are treated as decoration only, the final room may look nice but still sound tiring.',
    example: 'A restaurant ID plan with exposed ceilings can reserve ceiling panel zones early instead of trying to fit them around lights later.',
    faqs: [
      { question: 'Should acoustics control the whole design?', answer: 'No. It should support the room use and fit into the design.' },
      { question: 'Can panels be hidden?', answer: 'Sometimes, but many projects use visible panels as part of the design.' },
      { question: 'Can an ID choose panel colours?', answer: 'Yes, with acoustic and production constraints in mind.' },
      { question: 'What if design is already done?', answer: 'Treatment can still be added, but choices may be narrower.' },
      { question: 'Does this apply to homes?', answer: 'Yes, especially for piano rooms, home theatres, and work rooms.' },
    ],
  },
  {
    title: 'What Building Management May Ask Before Acoustic Panel Installation',
    slug: 'building-management-acoustic-panel-installation',
    category: 'buying-guides',
    metaTitle: 'Building Approval for Acoustic Panels',
    metaDescription: 'What Singapore building management may ask for before acoustic panel delivery or installation in offices, malls, and studios.',
    excerpt: 'Building management may ask for documents, access details, and installation information before work starts.',
    answer: 'Before acoustic panel installation, building management may ask for product specifications, fire safety information, installer details, work timing, loading bay booking, and access method. This is common in commercial buildings.',
    context: 'This came up often in real projects because offices, malls, and studios may need security registration or approval before delivery.',
    factors: ['Commercial buildings may require material information.', 'Security may need installer names or vehicle details.', 'High-ceiling work may need access equipment approval.'],
    advice: 'Ask building management early what they need, then send the requirements before production or installation is locked.',
    warning: 'Do not leave approval paperwork until installation day.',
    example: 'A studio in a shopping centre may need loading bay booking, unit access, product specs, and payment completion invoice before handover.',
    faqs: [
      { question: 'Will every building ask for this?', answer: 'No, but commercial buildings often have some access rules.' },
      { question: 'What documents are common?', answer: 'Product specifications, fire information, invoice, and installer details.' },
      { question: 'Do homes need this?', answer: 'Usually no, unless condo management has rules for contractors.' },
      { question: 'Can approval delay installation?', answer: 'Yes, if requirements are discovered late.' },
      { question: 'Should I ask before confirming?', answer: 'Yes, especially for offices, malls, restaurants, and studios.' },
    ],
  },
  {
    title: 'What Is the Lead Time for Custom Acoustic Panels?',
    slug: 'custom-acoustic-panel-lead-time-singapore',
    category: 'buying-guides',
    metaTitle: 'Custom Acoustic Panel Lead Time',
    metaDescription: 'Understand lead times for custom acoustic panels in Singapore, including colour selection, production, delivery, and installation.',
    excerpt: 'Lead time depends on panel type, colour choice, production batch, delivery timing, and installation scope.',
    answer: 'Custom acoustic panel lead time depends on whether panels are in stock, made to order, colour-selected, or part of a larger production batch. Delivery and installation timing should also be planned in.',
    context: 'Lead time matters for office moves, studio renovations, restaurant off days, and management approvals.',
    factors: ['Made-to-order panels need production time.', 'Colour selection can delay the order if not confirmed early.', 'Installation dates depend on site access and panel readiness.'],
    advice: 'Confirm colours, quantities, access requirements, and payment steps early so production can start without avoidable delays.',
    warning: 'Do not wait until renovation handover week to confirm custom panels if the room needs to open on time.',
    example: 'A studio may confirm panel quantity first, then finalise colours before the production deadline.',
    faqs: [
      { question: 'Can lead time be shortened?', answer: 'Sometimes, if panels or colours are already available.' },
      { question: 'What delays custom panels?', answer: 'Late colour decisions, quantity changes, approval documents, and payment processing.' },
      { question: 'Can installation be booked before panels are ready?', answer: 'Tentatively, but final dates should be confirmed closer to readiness.' },
      { question: 'Does MOQ affect lead time?', answer: 'It can, especially for custom colours or small batches.' },
      { question: 'Should I order before renovation ends?', answer: 'Often yes, if dimensions and layout are confirmed.' },
    ],
  },
  {
    title: 'How to Prepare Your Space Before Acoustic Panel Installation',
    slug: 'prepare-space-before-acoustic-panel-installation',
    category: 'buying-guides',
    metaTitle: 'Prepare for Acoustic Panel Installation',
    metaDescription: 'A simple checklist before acoustic panel installation in Singapore offices, homes, restaurants, and studios.',
    excerpt: 'Good preparation makes acoustic panel installation faster, cleaner, and less disruptive.',
    answer: 'Before acoustic panel installation, clear furniture, remove wall fixtures where needed, confirm building access, and make sure the installation surfaces are ready. This helps the team work safely and accurately.',
    context: 'In real projects, delays often come from blocked walls, uncleared furniture, missing access approval, or last-minute fixture changes.',
    factors: ['Installers need space to mark and align panels.', 'Furniture can block wall or ceiling access.', 'Commercial sites may require security registration.'],
    advice: 'Use a simple checklist the day before installation and confirm access timing with the building or site contact.',
    warning: 'Do not assume installers can work around every item in the room. It may affect alignment or timing.',
    example: 'A meeting room install may need plants, wall pictures, and loose furniture moved before the team arrives.',
    faqs: [
      { question: 'Should I clear the whole room?', answer: 'Clear the panel locations and working path at minimum.' },
      { question: 'Do I need to remove wall art?', answer: 'Yes, if it blocks the planned panel position.' },
      { question: 'Should security know?', answer: 'Yes, for offices, malls, and commercial buildings.' },
      { question: 'Can installation happen during working hours?', answer: 'Sometimes, but noise and access should be considered.' },
      { question: 'What if the room is under renovation?', answer: 'Protect panels from dust and confirm when surfaces are ready.' },
    ],
  },
  {
    title: 'Can Acoustic Panels Help With Neighbour Noise?',
    slug: 'can-acoustic-panels-help-neighbour-noise',
    category: 'buying-guides',
    metaTitle: 'Can Panels Help Neighbour Noise?',
    metaDescription: 'Understand when acoustic panels help with neighbour noise, and when you actually need soundproofing work.',
    excerpt: 'Acoustic panels may make your room sound better, but they usually do not stop neighbour noise from entering.',
    answer: 'Acoustic panels do not usually solve neighbour noise because they are designed to absorb sound inside your room, not block sound from outside. If the issue is sound entering through walls, windows, floors, or ceilings, that is closer to soundproofing.',
    context: 'This is one of the most common mix-ups. People search for acoustic panels because they want less noise from neighbours, traffic, or nearby rooms.',
    factors: ['Panels reduce reflections inside your room.', 'Neighbour noise travels through structures, gaps, and openings.', 'Soundproofing usually needs heavier construction measures.'],
    advice: 'First identify whether the problem is echo inside your room or noise coming through the building.',
    warning: 'Do not buy wall panels expecting them to block loud neighbour noise.',
    example: 'Panels can make a piano room less harsh inside, but they will not stop a neighbour’s TV from coming through a weak wall.',
    faqs: [
      { question: 'Can panels reduce noise leaving my room?', answer: 'They may reduce room energy slightly, but they are not a soundproof barrier.' },
      { question: 'What helps neighbour noise?', answer: 'Sealing gaps, heavier partitions, window treatment, or construction-level soundproofing may be needed.' },
      { question: 'Should I still use panels?', answer: 'Use them if your own room is echoey or harsh.' },
      { question: 'Can panels help HDB noise?', answer: 'They help room acoustics, not structural neighbour noise.' },
      { question: 'How do I know the difference?', answer: 'If the noise comes from outside the room, think soundproofing. If the room itself sounds echoey, think treatment.' },
    ],
  },
  {
    title: 'Acoustic Treatment vs Noise Control: What Problem Are You Actually Solving?',
    slug: 'acoustic-treatment-vs-noise-control',
    category: 'buying-guides',
    metaTitle: 'Acoustic Treatment vs Noise Control',
    metaDescription: 'A buyer-friendly guide to diagnosing whether you need acoustic treatment, noise control, or soundproofing.',
    excerpt: 'Before buying panels, identify whether the problem is echo, loudness, privacy, outside noise, or room-to-room transfer.',
    answer: 'Acoustic treatment improves sound inside a room. Noise control is broader and can include reducing echo, managing loudness, improving privacy, or controlling sound transfer. The right solution depends on the exact problem.',
    context: 'Clients often use one word for several different issues. They might say soundproofing, noise reduction, echo, privacy, or insulation, but each one points to a different solution.',
    factors: ['Echo inside the room needs absorption.', 'Sound entering or leaving needs isolation work.', 'Operational noise may need layout or behaviour changes too.'],
    advice: 'Describe what you hear, where you hear it, and when it happens before choosing a product.',
    warning: 'Do not jump straight to panels if the real issue is a weak door, open ceiling gap, or neighbour noise.',
    example: 'A restaurant needs acoustic treatment for customer noise, while a studio sharing a wall with another unit may need isolation too.',
    faqs: [
      { question: 'Is noise control the same as soundproofing?', answer: 'No. Soundproofing is one type of noise control.' },
      { question: 'Where do acoustic panels fit?', answer: 'They fit under acoustic treatment for improving sound inside the room.' },
      { question: 'Can one project need both?', answer: 'Yes, especially studios and meeting rooms needing privacy.' },
      { question: 'How should I explain my problem?', answer: 'Say where the sound starts, where it is heard, and what outcome you want.' },
      { question: 'Can a site visit diagnose this?', answer: 'Yes, especially when photos are not enough.' },
    ],
  },
  {
    title: 'How to Tell If Your Room Has an Echo Problem or a Soundproofing Problem',
    slug: 'echo-problem-vs-soundproofing-problem',
    category: 'buying-guides',
    metaTitle: 'Echo Problem or Soundproofing Problem?',
    metaDescription: 'A simple diagnostic guide to tell whether your room needs acoustic treatment or soundproofing.',
    excerpt: 'If the room sounds bad inside, it is probably an acoustic treatment issue. If sound travels through walls, it may be soundproofing.',
    answer: 'You likely have an echo problem if speech, music, or piano sounds harsh inside the room. You likely have a soundproofing problem if sound is entering or leaving through walls, doors, windows, ceilings, or gaps.',
    context: 'This distinction saves a lot of wasted budget. Acoustic panels and soundproofing are related to sound, but they solve different problems.',
    factors: ['Echo is heard inside the same room.', 'Soundproofing problems involve sound crossing a boundary.', 'Some rooms have both problems at the same time.'],
    advice: 'Do a simple test: clap or speak in the room, then listen outside the room. The location of the problem tells you what kind of solution to consider.',
    warning: 'Do not buy panels to solve a boundary problem without checking doors, gaps, walls, and windows.',
    example: 'A meeting room with unclear speech needs treatment. A meeting room where private words are clearly heard outside may also need soundproofing checks.',
    faqs: [
      { question: 'Can acoustic panels help both problems?', answer: 'They can help room sound, but they do not replace soundproofing.' },
      { question: 'What if my room has echo and leakage?', answer: 'Treat the echo and inspect the weak points separately.' },
      { question: 'Can photos diagnose this?', answer: 'Photos help, but leakage issues may need a site check.' },
      { question: 'Is glass a soundproofing problem?', answer: 'Glass can be both reflective and weak for isolation.' },
      { question: 'What should I tell the installer?', answer: 'Tell them whether the problem is inside the room, outside the room, or both.' },
    ],
  },
]

function key() {
  return Math.random().toString(36).slice(2, 14)
}

function cleanText(value: string) {
  return value.replace(/—/g, ',').replace(/\s+/g, ' ').trim()
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
    markDefs: [{ _key: linkKey, _type: 'link', href }],
  }
}

function categoryLink(category: Category) {
  switch (category) {
    case 'office-acoustics':
      return { before: 'For office projects, compare this with our ', anchor: 'office acoustic treatment page', href: '/office-acoustic-treatment', after: ' before deciding the layout.' }
    case 'restaurant-noise':
      return { before: 'For F&B spaces, compare this with our ', anchor: 'restaurant echo reduction page', href: '/restaurant-echo-reduction', after: ' because service flow and ceiling height matter.' }
    case 'echo-control':
      return { before: 'For general panel selection, start with our ', anchor: 'acoustic panels Singapore guide', href: '/acoustic-panels-singapore', after: ' and then match the room use.' }
    case 'buying-guides':
      return { before: 'If you are still comparing options, start with our ', anchor: 'acoustic panels Singapore guide', href: '/acoustic-panels-singapore', after: ' before choosing the final product.' }
  }
}

function categoryFrame(category: Category) {
  switch (category) {
    case 'office-acoustics':
      return 'In Singapore offices, the practical goal is usually clearer speech, better call quality, and less fatigue in rooms used every day.'
    case 'restaurant-noise':
      return 'In Singapore restaurants and cafes, the practical goal is not silence. It is a lively room where guests and staff do not have to fight the noise.'
    case 'echo-control':
      return 'For homes, studios, classrooms, and music rooms, the practical goal is controlled sound that feels comfortable without making the room dull.'
    case 'buying-guides':
      return 'For buyers, the practical goal is to understand what actually changes the quote and result before spending money.'
  }
}

function body(seed: ArticleSeed) {
  const link = categoryLink(seed.category)
  return [
    block(seed.answer),
    block('Quick take', 'h2'),
    block(`${seed.context} ${categoryFrame(seed.category)}`),
    block('The most useful starting point is to name the sound problem clearly. Echo, speech clarity, bass boom, neighbour noise, and room-to-room leakage do not all need the same fix.'),
    block('Why this matters', 'h2'),
    ...seed.factors.map((item) => block(item, 'normal', 'bullet')),
    block('A bad acoustic decision usually happens when the room is treated like a product purchase instead of a room problem. The panel itself matters, but the placement, coverage, thickness, and mounting method decide whether the result feels useful.'),
    block('What to check first', 'h2'),
    block('Look at the room use, the sound source, the hard surfaces, and where people are sitting or listening. Then check the surfaces that sound is bouncing off first: glass, bare wall, ceiling, floor, table, or nearby corners.'),
    ...[
      'Who is speaking, playing, recording, or listening in the room?',
      'Which surfaces are closest to that activity?',
      'Is the issue mostly echo, harshness, boom, privacy, or outside noise?',
      'Are there practical limits such as screens, lights, AC units, doors, or landlord rules?',
    ].map((item) => block(item, 'normal', 'bullet')),
    block('A realistic Singapore example', 'h2'),
    block(seed.example),
    linkBlock(link.before, link.anchor, link.href, link.after),
    block('Practical recommendation', 'h2'),
    block(seed.advice),
    block('If you are working with a budget, start with the highest-impact areas first. A smaller, properly placed treatment plan is better than buying random panels and hoping the room improves.'),
    block('What a good result should feel like', 'h2'),
    block('A good result is not always dramatic silence. Most of the time, the room should simply feel easier to use. Speech should be clearer, music should feel less messy, calls should sound less hollow, and people should not feel like they need to raise their voices.'),
    block('For commercial spaces, the improvement should also make operations easier. Staff should not get as tired from noise, customers should feel more comfortable staying longer, and meeting rooms should feel more professional during calls.'),
    block('How this affects budget', 'h2'),
    block('Budget is usually affected by the number of panels, the type of panel, whether the work is on walls or ceilings, and how difficult the site access is. High ceilings, custom colours, made-to-order panels, and building approvals can change the final scope.'),
    block('The cheapest option is not always the best value if it leaves the main reflection points untreated. The better question is: what is the smallest treatment plan that solves the real issue properly?'),
    block('When to be careful', 'h2'),
    block(seed.warning),
    block('Also be careful when a product is sold as a universal fix. Acoustic treatment works best when the panel type, quantity, mounting method, and placement match the actual room problem.'),
    block('What to send before asking for a quote', 'h2'),
    ...[
      'Photos of every wall and the ceiling.',
      'Width x length x ceiling height.',
      'A short note on what sounds wrong and when it happens.',
      'Any constraints such as glass, doors, AC units, landlord rules, renovation timing, or building access.',
    ].map((item) => block(item, 'normal', 'bullet')),
    block('If you have renovation drawings, an ID render, or a floor plan, send those too. They help us spot conflicts before the quote is finalised, especially for ceiling services, glass walls, built-in carpentry, and lighting positions.'),
    block('Next step', 'h2'),
    block('Send the room details first. From there, we can usually tell whether you need a rough estimate, a site visit, a 3D proposal, or a different type of solution entirely.'),
    linkBlock('When you are ready, use the ', 'contact page', '/contact', ' to send photos, dimensions, and the main sound issue.'),
  ]
}

async function main() {
  const slugs = articles.map((article) => article.slug)
  const existing = await sanity.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "post" && slug.current in $slugs] { _id, "slug": slug.current }`,
    { slugs }
  )
  const plannedIds = new Set(articles.map((article) => `next-25-${article.slug}`))
  const unsafeExisting = existing.filter((item) => !plannedIds.has(item._id))
  if (unsafeExisting.length) {
    throw new Error(`Refusing to overwrite unrelated existing slugs: ${unsafeExisting.map((item) => item.slug).join(', ')}`)
  }

  const publishedAt = new Date().toISOString()
  const results: { title: string; slug: string; id: string }[] = []

  for (let index = 0; index < articles.length; index++) {
    const article = articles[index]
    const id = `next-25-${article.slug}`
    const doc = {
      _id: id,
      _type: 'post',
      title: cleanText(article.title),
      slug: { _type: 'slug', current: article.slug },
      category: article.category,
      contentType: 'article',
      excerpt: cleanText(article.excerpt),
      publishedAt,
      body: body(article),
      faqs: article.faqs.map((faq) => ({
        _key: key(),
        _type: 'faqItem',
        question: cleanText(faq.question),
        answer: cleanText(faq.answer),
      })),
      imagePrompts: [],
      seo: {
        metaTitle: cleanText(article.metaTitle),
        metaDescription: cleanText(article.metaDescription),
      },
    }

    await sanity.createOrReplace(doc)
    results.push({ title: article.title, slug: article.slug, id })
    console.log(`[${index + 1}/${articles.length}] Published ${article.title}`)
  }

  await mkdir(resolve(process.cwd(), 'generated'), { recursive: true })
  await writeFile(
    resolve(process.cwd(), 'generated/next-25-seo-articles-created.json'),
    JSON.stringify({ createdAt: new Date().toISOString(), results }, null, 2)
  )

  console.log(`Done. Published ${results.length} next-batch articles with no images.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
