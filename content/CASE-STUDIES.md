# Project case-study drafts

`content/case-study-drafts.json` holds draft text (description, problem, solution, result,
and a few metrics) for every project on /projects. It only uses facts from Sanity (client,
location, category) and from matching Bigin deals (room type, follow-up jobs). Deal amounts
are never included. Each entry has a `confidence` value and a `needsOwnerInput` list of the
things only you can confirm, such as products, panel count and completion month.

Edit the JSON first if anything is wrong. Then:

1. **Dry run** (writes nothing, shows what each project would get):

   ```bash
   node scripts/import-case-study-drafts.mjs --dry-run
   ```

2. **Write the drafts** (needs `SANITY_API_TOKEN` with write access in `.env.local`, plus
   `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`):

   ```bash
   node scripts/import-case-study-drafts.mjs
   ```

   It copies each published project to a draft and fills only the fields that are empty.
   Anything you already wrote stays as it is. Nothing is published.

3. **Review in /studio.** Open each project, check the text against the `needsOwnerInput`
   notes, add products, panel counts, dates and photos, and fix anything that is not right.

4. **Publish** each project from Studio when you are happy with it. The page at
   /projects/<slug> updates within about a minute. Sections you leave empty stay hidden.

Running the script again is safe: fields that already have content are skipped.
