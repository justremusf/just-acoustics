# Just Acoustics Proposal MVP

## Decision

The proposal website is the primary client deliverable.

- Use the website for normal client review, video, visuals, pricing and acceptance.
- Create a PDF only when the client needs a formal downloadable record.
- Create PowerPoint only when someone needs to present the proposal in a meeting.
- Keep 3D modelling manual for now. Export the finished views into the client folder.

## The entire workflow

### 1. Remus supplies one folder

Required:

- `CLIENT-BRIEF.md`
- Site photos
- Floor plan or marked-up layout
- 2-4 exported 3D views
- Product specification or catalogue
- Acoustic figures, if available
- Price, quantities and installation constraints

Ask Remus for the shared proposal libraries when they have not yet been supplied. See `ASSET-LIBRARY-TODO.md`.

Suggested filenames:

```text
client-project/
├── CLIENT-BRIEF.md
├── site-photo-01.jpg
├── site-photo-02.jpg
├── floor-plan.jpg
├── 3d-overview.jpg
├── 3d-client-view.jpg
├── 3d-detail.jpg
└── product-catalogue.pdf
```

The filenames are optional. Codex can organise imperfect uploads.

### 2. Codex produces one approval sheet

Nothing client-facing is created yet. The approval sheet must show:

1. Client and project
2. Problem being solved
3. Product, dimensions and quantities
4. Panel placement and installation method
5. Acoustic claims and confidence
6. Quote line items, rates and total
7. Payment, validity and lead-time terms
8. Missing or uncertain information

Remus replies with corrections or `Approved - generate proposal`.

### 3. Codex produces three outputs

1. **Private proposal website** - mobile first, desktop ready, with one acceptance action.
2. **Infographic set** - 3-5 reusable cards showing only approved figures.
3. **Zoho Books quote draft** - complete line items, descriptions, quantities, rates and terms.

Optional outputs are a PDF summary, PowerPoint deck and WhatsApp send message.

The proposal website follows this order:

1. 3D render and downloadable render
2. Remus walkthrough video and downloadable video
3. Approved results figures
4. Relevant before/after proof from the matching space type
5. Proposed treatment and matching product references
6. Client next steps: verification, colour approval, production, installation and handover
7. FAQ
8. Investment summary, embedded quote PDF and separate downloads

## Required approval gates

There are only two:

### Gate 1 - technical and commercial truth

Approve quantities, dimensions, product, panel locations, acoustic figures, pricing and surcharges.

### Gate 2 - final send

Check the proposal link and Zoho estimate. Remus remains the final sender.

## Zoho Books output rule

Use one clear main line item per treatment type. Put the itemised dimensions and technical specification in the description. Add delivery, mounting, installation access, high-ceiling/scaffold and after-hours work as separate items when applicable.

Every Zoho draft must return this exact structure:

```text
CUSTOMER
Name:
Company:
Billing address:
Site address:

ESTIMATE
Reference:
Date:
Validity:
Currency: SGD

LINE ITEM 1
Item name:
Description:
Quantity:
Rate:
Amount:

LINE ITEM 2
Item name:
Description:
Quantity:
Rate:
Amount:

SUBTOTAL:
GST:
TOTAL:

TERMS
Payment:
Lead time:
Installation duration:
Exclusions:

INTERNAL CHECKS
Margin checked:
Delivery included:
Mounting included:
Access/scaffold included:
After-hours included or excluded:
```

Direct creation in Zoho Books comes later, after a Zoho connection is available. Until then, Codex prepares this reviewed copy-and-paste version.

## Standard run prompt

```text
Create the Just Acoustics proposal package from the attached client folder.

Use CLIENT-BRIEF.md as the main source of truth and verify it against the attached drawings, photos, 3D renders, product documents and pricing.

First produce only the internal approval sheet. Clearly label every missing, uncertain or inferred value. Do not invent dimensions, quantities, acoustic results or pricing.

Wait for me to say: Approved - generate proposal.

After approval, create:
1. A private mobile-first proposal website
2. Three to five client-facing infographic cards
3. A Zoho Books-ready quote draft using the standard structure
4. A short WhatsApp message containing the proposal link

Create a PDF summary or PowerPoint only if I request it.

Use acoustic treatment language, not soundproofing language. Keep every number identical across the website, graphics and quote. Do not send or publish anything until I approve it.
```

## Definition of done

- A client can understand the problem, recommendation, expected outcome and price on a phone.
- The site and Zoho draft use identical approved figures.
- All technical claims are measured, calculated, supplied by a manufacturer, or clearly labelled as estimates.
- The client has one obvious next action.
- Remus can approve and send without rewriting the material.
