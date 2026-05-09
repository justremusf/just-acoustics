# JustAcoustics Interactive VSL Handoff (Antigravity)

Date: 2026-05-02

## Goal
Build an MVP interactive branching VSL system on:
- Landing page (`/`)
- Pricing page (`/pricing`)

Constraints:
- Match existing JustAcoustics design language exactly (CTA, spacing, colors, radii, typography).
- Native HTML5 video (no external embeds/SaaS).
- Fast, minimal UI: the interface is essentially the video + overlays.
- Track space-type selection event: `vsl_space_type_selected`.

## Current UX (Latest Requirements Implemented)
- Video container is always portrait `9:16` on BOTH mobile + desktop for now (no breakpoint switch to widescreen).
- Space selector is a small liquid-glass overlay INSIDE the video (no extra text/labels; just the buttons).
- Progress is an overlay at the very top of the video:
  - Orange active progress bar
  - Dots as checkpoints (orange reached, gray upcoming)
  - No labels like "Intro", "Pricing", etc.
- Autoplay attempt:
  - If blocked, shows a premium play button overlay.
- Selector overlay appears mid-intro based on config:
  - `intro.selectionPromptAt` ratio (default `0.82`) pauses video and shows selector.
- Category selection fades into the chosen category VSL in the SAME container.
- Category CTA appears as an overlay near the end of the category VSL (ratio >= `0.86`) and links to `/contact`.

## Key Files
- `components/InteractiveVSL.tsx`
  - Main orchestrator: playback, fade switching, overlays, analytics firing.
  - Portrait frame locked (aspect `9/16`) and constrained width for desktop.
- `components/VSLCardGrid.tsx`
  - Liquid-glass pill buttons using `category.shortLabel`.
- `components/VSLProgressTracker.tsx`
  - Top overlay progress bar with dot checkpoints.
- `data/vslConfig.ts`
  - Config for landing + pricing intros and categories.
  - Placeholder video URLs under `/public/media/vsl/...` (MP4 primary, optional WebM).
- `app/page.tsx`
  - Mounts `<InteractiveVSL config={landingVslConfig} pageLocation="/" />` after `<Hero />`.
- `app/pricing/page.tsx`
  - Mounts `<InteractiveVSL config={pricingVslConfig} pageLocation="/pricing" compact />`.
- `public/media/vsl/README.md`
  - Placeholder filenames list / where to replace assets.

## Analytics
Fired on space type selection in `components/InteractiveVSL.tsx`:
- `trackEvent('vsl_space_type_selected', { space_type, page_location, timestamp })`
- If Meta Pixel exists: also fires `window.fbq('trackCustom', ...)` (guarded).

## Video Assets (MVP Placeholder Paths)
Expected under `public/media/vsl/`:
- `just-acoustics-founder-intro.mp4` (+ optional `.webm`)
- `pricing-intro.mp4` (+ optional `.webm`)
- Category videos (landing):
  - `office-meeting-rooms.mp4`
  - `home-studio-residential.mp4`
  - `church-event-space.mp4`
  - `school-education.mp4`
  - `professional-studio.mp4`
- Category videos (pricing page override):
  - `pricing-office.mp4`, `pricing-home-studio.mp4`, etc (see `data/vslConfig.ts`)

Missing video files are handled gracefully:
- `onError` sets `videoError` and surfaces selector/CTA overlays as fallback.

## Known Dev Server Note
There is a recurring Next.js dev runtime bug on some requests (seen as):
- `TypeError: Cannot read properties of undefined (reading 'call')`

Observed behavior:
- It often shows up on `HEAD /` in dev, while normal `GET /` can still return `200`.
- Production build (`npm run build`) passes.

Workaround used for active development:
- Run dev on `http://localhost:3335` (current working dev server).
  - Command: `npm run dev -- -p 3335`
- Use normal page loads for validation (not `HEAD`).

## Quick Validation Commands
- Typecheck: `npx tsc --noEmit`
- Build: `npm run build`
- Smoke: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3335/`

## What Antigravity Should Do Next
- Replace placeholder videos/posters with real compressed MP4s in `public/media/vsl/`.
- Fine-tune `selectionPromptAt` + CTA reveal timing based on real edit pacing.
- Optionally make progress dots clickable (only if it stays snappy + minimal).

