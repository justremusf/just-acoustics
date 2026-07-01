import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const execute = process.argv.includes("--execute");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const priceUpdates = {
  "flexi-acoustic-panels": 55,
  "flexi-custom-print-panels": 75,
  "forma-pet-panels": 100,
  "flexi-ceiling-mount-kit": 15,
  "flexi-wall-mounting-accessories": 10,
  "soothe-wall-mount-kit": 10,
};

const items = await client.fetch(
  '*[_type == "shopItem" && slug.current in $slugs]{_id, "slug": slug.current, price}',
  { slugs: Object.keys(priceUpdates) },
);
const church = await client.fetch(
  '*[_type == "space" && slug.current == "churches"][0]{_id, audiences}',
);

const changes = items.flatMap((item) => {
  const price = priceUpdates[item.slug];
  return item.price === price
    ? []
    : [
        {
          type: "price",
          id: item._id,
          slug: item.slug,
          from: item.price,
          to: price,
        },
      ];
});

const audienceIndex =
  church?.audiences?.findIndex(
    (item) => item.title === "Mosques and prayer halls",
  ) ?? -1;
if (audienceIndex >= 0) {
  changes.push({
    type: "audience",
    id: church._id,
    from: "Mosques and prayer halls",
    to: "Worship and prayer halls",
  });
}

console.log(JSON.stringify({ execute, changes }, null, 2));

if (execute && changes.length) {
  const transaction = client.transaction();
  for (const change of changes) {
    if (change.type === "price")
      transaction.patch(change.id, (patch) => patch.set({ price: change.to }));
    if (change.type === "audience")
      transaction.patch(change.id, (patch) =>
        patch.set({ [`audiences[${audienceIndex}].title`]: change.to }),
      );
  }
  await transaction.commit();
  console.log(`Applied ${changes.length} update(s).`);
}
