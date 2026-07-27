import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const execute = process.argv.includes("--execute");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN are required.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const content = {
  studios: {
    tagline: "Hear the room honestly. Create with confidence.",
    audiences: [
      [
        "Recording and production studios",
        "Control reflections and low-frequency build-up so microphones and monitors reveal the work accurately.",
      ],
      [
        "Mixing and mastering rooms",
        "Build a dependable listening position so decisions translate beyond the studio.",
      ],
      [
        "Podcast and voice rooms",
        "Capture focused speech with less room tone, flutter echo, and corrective editing.",
      ],
      [
        "Home theatres and listening rooms",
        "Improve dialogue, imaging, bass control, and long-session comfort without making the room feel dead.",
      ],
    ],
    sections: [
      [
        "Accurate monitoring",
        "Trust what you hear",
        "Early reflections and room modes can disguise detail and shift tonal balance. Broadband absorption, bass control, and careful placement create a more reliable monitoring environment.",
      ],
      [
        "Cleaner recordings",
        "Capture the source, not the room",
        "Balanced treatment reduces boxiness, ringing, and unwanted ambience so vocals and instruments arrive at the microphone with greater clarity.",
      ],
      [
        "Natural balance",
        "Control without over-damping",
        "A successful studio combines absorption with reflective or diffusive surfaces so the room remains comfortable, responsive, and useful for long sessions.",
      ],
    ],
    products: [
      "standard-flexi-acoustic-panel",
      "soothe-studio-bass-trap",
      "acoustic-wall-panels",
    ],
    projectCategory: "studios-homes",
    faqs: [
      [
        "Do better speakers remove the need for treatment?",
        "No. Speakers cannot correct reflections, room modes, or decay created by the room itself. Treatment lets your equipment perform more consistently.",
      ],
      [
        "Will acoustic panels soundproof my studio?",
        "Acoustic treatment improves sound inside the room. Soundproofing limits sound transfer and usually requires construction changes.",
      ],
      [
        "Can you design around an existing studio setup?",
        "Yes. We assess the room, listening position, speakers, workflow, and available surfaces before proposing placement.",
      ],
      [
        "How much treatment should I start with?",
        "The right amount depends on room size and use. Reflection points and low-frequency control are usually the most valuable first steps.",
      ],
    ],
  },
  offices: {
    tagline: "Clearer conversations. Calmer, more productive work.",
    audiences: [
      [
        "Open-plan offices",
        "Reduce the build-up of conversation noise and create a more comfortable background sound level.",
      ],
      [
        "Meeting and board rooms",
        "Improve speech clarity for in-person discussion, presentations, and video calls.",
      ],
      [
        "Call and focus areas",
        "Limit distracting reflections so staff can concentrate and communicate more comfortably.",
      ],
      [
        "Reception and collaboration zones",
        "Keep active shared areas welcoming without allowing noise to dominate adjacent workspaces.",
      ],
    ],
    sections: [
      [
        "Speech clarity",
        "Make every meeting easier to follow",
        "Glass walls, hard ceilings, and large tables create strong reflections. Targeted wall and ceiling treatment helps voices remain clear across the room.",
      ],
      [
        "Focus and comfort",
        "Reduce the cumulative noise load",
        "Lowering reverberation does not silence an office, but it reduces how far and how aggressively everyday sound spreads through the space.",
      ],
      [
        "Integrated design",
        "Treatment that belongs in the fit-out",
        "Panels can be colour-matched, printed, suspended, or arranged as visual features so acoustic performance supports the interior design.",
      ],
    ],
    products: [
      "acoustic-ceiling-panels",
      "acoustic-wall-panels",
      "office-soundproofing",
    ],
    projectCategory: "office-spaces",
    faqs: [
      [
        "Can treatment improve speech privacy?",
        "It can reduce reflected speech and distraction. Full privacy may also require partitions, door seals, masking, or construction changes.",
      ],
      [
        "Can panels be installed after the office is occupied?",
        "Yes. We can phase work and use wall or ceiling locations that minimise disruption.",
      ],
      [
        "Will the office become too quiet?",
        "The aim is controlled, comfortable sound—not silence. Treatment is distributed to preserve a natural working atmosphere.",
      ],
      [
        "Do you provide documentation for designers or landlords?",
        "Yes. We can provide layouts, product information, finishes, and installation scope for project coordination.",
      ],
    ],
  },
  churches: {
    tagline: "Help every word and musical detail reach the congregation.",
    audiences: [
      [
        "Church sanctuaries",
        "Improve sermon intelligibility and musical definition across large reflective rooms.",
      ],
      [
        "Worship and prayer halls",
        "Reduce long reverberation while respecting architectural character and daily use.",
      ],
      [
        "Event and multipurpose halls",
        "Create adaptable acoustics for speech, music, teaching, and community events.",
      ],
      [
        "Fellowship and function rooms",
        "Control crowd noise so conversation remains comfortable during gatherings.",
      ],
    ],
    sections: [
      [
        "Speech intelligibility",
        "Keep the message clear",
        "Long reverberation causes syllables to overlap, particularly at the back of large rooms. Strategic absorption shortens decay and supports the sound system.",
      ],
      [
        "Music and worship",
        "Preserve energy without muddiness",
        "The goal is not to deaden the room. Balanced coverage retains warmth and participation while controlling harsh reflections and low-mid build-up.",
      ],
      [
        "Architectural integration",
        "Respect the visual character",
        "Custom colours, printed finishes, ceiling elements, and carefully positioned panels allow treatment to work with the architecture.",
      ],
    ],
    products: [
      "acoustic-wall-panels",
      "acoustic-ceiling-panels",
      "custom-acoustic-panels",
    ],
    projectCategory: "churches",
    faqs: [
      [
        "Will acoustic treatment replace the sound system?",
        "No. Treatment improves the room so the sound system can work more effectively and consistently.",
      ],
      [
        "Can treatment be visually discreet?",
        "Yes. We can coordinate colours, locations, custom shapes, and printed finishes with the interior.",
      ],
      [
        "Can installation happen around services?",
        "Yes. Work can be scheduled in phases or outside regular worship and event times.",
      ],
      [
        "Do large halls require a site assessment?",
        "Yes. Room volume, finishes, occupancy, and loudspeaker coverage materially affect the treatment strategy.",
      ],
    ],
  },
  restaurants: {
    tagline:
      "Keep the atmosphere lively without making conversation difficult.",
    audiences: [
      [
        "Restaurants and cafés",
        "Reduce reflected crowd noise so guests can speak comfortably at the table.",
      ],
      [
        "Bars and hospitality venues",
        "Control harsh build-up while keeping the room energetic and social.",
      ],
      [
        "Food courts and shared dining",
        "Treat large hard-surfaced areas where sound accumulates across multiple operators.",
      ],
      [
        "Private dining and event rooms",
        "Improve clarity for conversation, presentations, and hosted functions.",
      ],
    ],
    sections: [
      [
        "Guest comfort",
        "Make conversation part of the experience",
        "When voices compete with reflections, the room becomes progressively louder. Absorption interrupts that cycle and reduces listening effort.",
      ],
      [
        "Operational fit",
        "Work around the venue, not against it",
        "Ceiling panels, baffles, wall features, and custom prints can be coordinated with lighting, services, cleaning, and opening hours.",
      ],
      [
        "Brand and ambience",
        "Acoustics that support the interior",
        "Treatment can become a deliberate design element through colour, artwork, texture, and repeated architectural forms.",
      ],
    ],
    products: [
      "acoustic-ceiling-panels",
      "acoustic-wall-panels",
      "custom-print-acoustic-panels",
    ],
    projectCategory: "restaurants",
    faqs: [
      [
        "Can you treat a restaurant without closing it?",
        "Often, yes. Installation can be staged outside service hours depending on access and fixing requirements.",
      ],
      [
        "Will panels absorb kitchen smells or moisture?",
        "We select finishes and locations appropriate to the environment and keep treatment away from unsuitable wet or grease-heavy zones.",
      ],
      [
        "How do you keep a venue feeling lively?",
        "Coverage and placement are balanced to control excessive decay without removing the energy expected in hospitality spaces.",
      ],
      [
        "Can treatment include branded artwork?",
        "Yes. Selected systems support custom printing and colour coordination.",
      ],
    ],
  },
  education: {
    tagline: "Help students hear, focus, and participate with less effort.",
    audiences: [
      [
        "Classrooms and tuition rooms",
        "Improve teacher-to-student speech clarity and reduce distracting reverberation.",
      ],
      [
        "Libraries and study areas",
        "Create calmer zones for concentration while managing movement and group activity.",
      ],
      [
        "Multipurpose halls",
        "Support assemblies, performances, teaching, and community use in one adaptable room.",
      ],
      [
        "Early learning spaces",
        "Reduce the intensity of activity noise in rooms used by young children and educators.",
      ],
    ],
    sections: [
      [
        "Learning clarity",
        "Make instruction easier to understand",
        "Excess reverberation masks consonants and makes listening more demanding. Treatment helps speech remain distinct across the room.",
      ],
      [
        "Teacher comfort",
        "Reduce the need to project over the room",
        "A controlled acoustic environment can reduce vocal strain and make everyday classroom management less tiring.",
      ],
      [
        "Safe integration",
        "Durable treatment for active spaces",
        "Products and fixing methods are selected for the age group, room use, cleaning needs, and required project documentation.",
      ],
    ],
    products: [
      "polyester-felt-panels",
      "acoustic-wall-panels",
      "acoustic-ceiling-panels",
    ],
    projectCategory: "schools",
    faqs: [
      [
        "Which school spaces benefit most?",
        "Classrooms, halls, canteens, libraries, music rooms, and tuition rooms commonly benefit from shorter reverberation.",
      ],
      [
        "Can panels be installed above reach?",
        "Yes. Ceiling and high-wall locations are useful where impact resistance or clear wall space is important.",
      ],
      [
        "Can treatment suit a school colour scheme?",
        "Yes. Colours, patterns, and custom shapes can be coordinated with the interior.",
      ],
      [
        "Can work be completed during school holidays?",
        "Yes. Project programmes can be planned around term breaks and restricted access periods.",
      ],
    ],
  },
  "gym-and-activity-spaces": {
    tagline:
      "Control high-energy noise without taking the energy out of the room.",
    audiences: [
      [
        "Fitness and spin studios",
        "Improve instructor clarity and reduce harsh build-up from amplified music.",
      ],
      [
        "Commercial gyms",
        "Manage reflected equipment, voice, and music noise across large hard-surfaced rooms.",
      ],
      [
        "Dance and movement rooms",
        "Create more comfortable sound for classes, rehearsals, and coaching.",
      ],
      [
        "Auditoriums and activity halls",
        "Support speech, music, sports, and events with more controlled reverberation.",
      ],
    ],
    sections: [
      [
        "High sound levels",
        "Reduce noise build-up at the source",
        "Large mirrors, hard floors, and exposed ceilings intensify music, voices, and equipment noise. Distributed treatment lowers reverberant energy.",
      ],
      [
        "Clear instruction",
        "Help coaches communicate without shouting",
        "Improved speech clarity makes classes easier to follow and reduces the need to push volume levels higher.",
      ],
      [
        "Practical durability",
        "Design for active, humid environments",
        "Locations, materials, and fixing systems are selected around impact risk, airflow, maintenance, and the visual identity of the venue.",
      ],
    ],
    products: [
      "polyester-felt-panels",
      "acoustic-ceiling-panels",
      "custom-acoustic-panels",
    ],
    projectCategory: "gym-leisure",
    faqs: [
      [
        "Will wall panels withstand an active gym?",
        "We position and specify treatment according to impact risk. High walls and ceilings are often preferred in active zones.",
      ],
      [
        "Does acoustic treatment stop neighbour complaints?",
        "It reduces sound build-up inside the room. Structural sound transfer may require separate soundproofing measures.",
      ],
      [
        "Can treatment work around mirrors and equipment?",
        "Yes. Ceiling systems and targeted wall areas can provide useful coverage without disrupting the layout.",
      ],
      [
        "Will treatment reduce the energy of group classes?",
        "The aim is clearer, more comfortable sound while retaining the intensity expected in the space.",
      ],
    ],
  },
};

const ctaTitles = {
  studios: "Plan a studio you can trust",
  offices: "Plan a calmer, clearer office",
  churches: "Help every listener hear clearly",
  restaurants: "Create a more comfortable dining room",
  education: "Create a better space for learning",
  "gym-and-activity-spaces": "Control the room without losing its energy",
};

const services = await client.fetch(`
  *[_type == "service" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
    _id, title, slug, mainImage, shortDescription, benefits, body, seo
  }
`);

if (services.length === 0) {
  const counts = await client.fetch(`{
    "spaces": count(*[_type == "space" && !(_id in path("drafts.**"))]),
    "services": count(*[_type == "service"])
  }`);
  if (counts.spaces === 6 && counts.services === 0) {
    console.log(
      JSON.stringify(
        {
          mode: execute ? "execute" : "dry-run",
          status: "already-migrated",
          ...counts,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }
}

if (services.length !== 6) {
  throw new Error(
    `Expected 6 published Service documents, found ${services.length}.`,
  );
}

const missingContent = services.filter(
  (service) => !content[service.slug?.current],
);
if (missingContent.length > 0) {
  throw new Error(
    `Missing Space content for: ${missingContent.map((service) => service.slug?.current).join(", ")}`,
  );
}

const productSlugs = [
  ...new Set(Object.values(content).flatMap((item) => item.products)),
];
const [shopItems, projects] = await Promise.all([
  client.fetch(
    `*[_type == "shopItem" && slug.current in $slugs] { _id, "slug": slug.current }`,
    { slugs: productSlugs },
  ),
  client.fetch(
    `*[_type == "project" && defined(category)] | order(completionDate desc) { _id, category, mainImage }`,
  ),
]);

const shopBySlug = new Map(shopItems.map((item) => [item.slug, item._id]));
const projectByCategory = new Map();
for (const project of projects) {
  if (!projectByCategory.has(project.category))
    projectByCategory.set(project.category, []);
  projectByCategory.get(project.category).push(project);
}

const targetIds = services.map((service) => `space.${service.slug.current}`);
const collisions = await client.fetch(
  `*[_type == "space" && !(_id in $ids)] { _id, title, "slug": slug.current }`,
  { ids: targetIds },
);
if (collisions.length > 0) {
  throw new Error(
    `Unexpected Space documents already exist:\n${JSON.stringify(collisions, null, 2)}`,
  );
}

const documents = services.map((service) => {
  const slug = service.slug.current;
  const details = content[slug];
  const matchingProjects = projectByCategory.get(details.projectCategory) || [];
  const projectImages = matchingProjects
    .filter((project) => project.mainImage)
    .slice(0, 6);

  return {
    _id: `space.${slug}`,
    _type: "space",
    title: service.title,
    slug: service.slug,
    heroTagline: details.tagline,
    shortDescription: service.shortDescription,
    mainImage: service.mainImage,
    benefits: service.benefits,
    body: service.body,
    audiences: details.audiences.map(([title, description], index) => ({
      _key: `audience-${index + 1}`,
      _type: "object",
      title,
      description,
      ...(index === 0 && service.mainImage ? { image: service.mainImage } : {}),
    })),
    editorialSections: details.sections.map(
      ([eyebrow, title, description], index) => ({
        _key: `section-${index + 1}`,
        _type: "object",
        eyebrow,
        title,
        description,
        ...(projectImages[index]?.mainImage
          ? { image: projectImages[index].mainImage }
          : service.mainImage
            ? { image: service.mainImage }
            : {}),
      }),
    ),
    recommendedShopItems: details.products.flatMap((productSlug, index) => {
      const id = shopBySlug.get(productSlug);
      return id
        ? [{ _key: `product-${index + 1}`, _type: "reference", _ref: id }]
        : [];
    }),
    featuredProjects: matchingProjects.slice(0, 6).map((project, index) => ({
      _key: `project-${index + 1}`,
      _type: "reference",
      _ref: project._id,
    })),
    gallery: projectImages.map((project, index) => ({
      ...project.mainImage,
      _key: `gallery-${index + 1}`,
    })),
    faqs: details.faqs.map(([question, answer], index) => ({
      _key: `faq-${index + 1}`,
      _type: "object",
      question,
      answer,
    })),
    cta: {
      title: ctaTitles[slug],
      body: "Share your room, goals, and constraints with our team. We will recommend a practical treatment direction for your space.",
      label: "Book a Free Consultation",
      href: "/contact",
    },
    seo: service.seo,
  };
});

console.log(
  JSON.stringify(
    {
      mode: execute ? "execute" : "dry-run",
      sourceServices: services.map((service) => ({
        id: service._id,
        title: service.title,
        slug: service.slug.current,
      })),
      targetSpaces: documents.map((space) => ({
        id: space._id,
        title: space.title,
        slug: space.slug.current,
        audiences: space.audiences.length,
        editorialSections: space.editorialSections.length,
        recommendedShopItems: space.recommendedShopItems.length,
        featuredProjects: space.featuredProjects.length,
        gallery: space.gallery.length,
        faqs: space.faqs.length,
      })),
    },
    null,
    2,
  ),
);

if (!execute) {
  console.log(
    "\nDry run complete. Re-run with --execute to create, verify, and remove legacy Services.",
  );
  process.exit(0);
}

let transaction = client.transaction();
for (const document of documents)
  transaction = transaction.createOrReplace(document);
await transaction.commit();

const migrated = await client.fetch(
  `*[_type == "space" && _id in $ids] {
  _id, title, slug, mainImage, shortDescription, benefits, body, seo,
  heroTagline, audiences, editorialSections, recommendedShopItems, featuredProjects, gallery, faqs, cta
}`,
  { ids: targetIds },
);

const byId = new Map(migrated.map((space) => [space._id, space]));
const errors = [];
for (const source of services) {
  const target = byId.get(`space.${source.slug.current}`);
  if (!target) {
    errors.push(`${source.title}: target missing`);
    continue;
  }
  const checks = {
    title: target.title === source.title,
    slug: target.slug?.current === source.slug.current,
    mainImage:
      JSON.stringify(target.mainImage ?? null) ===
      JSON.stringify(source.mainImage ?? null),
    shortDescription: target.shortDescription === source.shortDescription,
    benefits:
      JSON.stringify(target.benefits ?? null) ===
      JSON.stringify(source.benefits ?? null),
    body:
      JSON.stringify(target.body ?? null) ===
      JSON.stringify(source.body ?? null),
    seo:
      JSON.stringify(target.seo ?? null) === JSON.stringify(source.seo ?? null),
    audiences: target.audiences?.length === 4,
    editorialSections: target.editorialSections?.length === 3,
    faqs: target.faqs?.length === 4,
    cta: Boolean(target.cta?.title && target.cta?.label && target.cta?.href),
  };
  for (const [field, passed] of Object.entries(checks)) {
    if (!passed) errors.push(`${source.title}: ${field} verification failed`);
  }
}

if (errors.length > 0 || migrated.length !== 6) {
  throw new Error(`Space migration verification failed:\n${errors.join("\n")}`);
}

let deleteTransaction = client.transaction();
for (const service of services) {
  deleteTransaction = deleteTransaction
    .delete(service._id)
    .delete(`drafts.${service._id}`);
}
await deleteTransaction.commit();

const finalCounts = await client.fetch(`{
  "spaces": count(*[_type == "space" && !(_id in path("drafts.**"))]),
  "services": count(*[_type == "service"])
}`);

if (finalCounts.spaces !== 6 || finalCounts.services !== 0) {
  throw new Error(
    `Final count validation failed: ${JSON.stringify(finalCounts)}`,
  );
}

console.log(
  `\nMigration complete: ${finalCounts.spaces} Spaces, ${finalCounts.services} Services.`,
);
