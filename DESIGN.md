# Just Acoustics — Design System

## Brand Identity

**Company:** Just Acoustics  
**Tagline:** Acoustic panels, echo control, and sound treatment across Singapore  
**Tone:** Clean, premium, confident. Not clinical. Think high-end interior brand, not tech startup.  
**Industry:** Acoustic treatment — offices, restaurants, churches, studios, Singapore

---

## Colours

| Token | Hex | Usage |
|-------|-----|-------|
| Brand Orange | `#ffa500` | Primary accent, CTAs, hover states, highlights |
| Dark 100 | `#010101` | Headings, primary text, filled buttons |
| Gray 100 | `#4a4a4a` | Body copy |
| Gray 200 | `#6a6a6a` | Secondary text, captions |
| White 100 | `#ffffff` | Backgrounds, card fills |
| White 200 | `#f5f5f5` | Subtle section backgrounds |
| White 300 | `#e9e9e9` | Borders, dividers |

**Brand gradient (body background):**
```
radial-gradient(circle at top right, rgba(255,165,0,0.06), transparent 20%),
linear-gradient(180deg, #fff, #fbfbfb 42%, #fff 100%)
```

---

## Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Headings | Instrument Sans | 600–700 | Tight tracking (−0.5px to −2px), very short line-height (0.98–1.1) |
| Body | Manrope | 400–500 | 16px base, 1.6 line-height |
| Labels / Pills | Manrope | 600 | All-caps, 0.12em letter-spacing |
| Display (logo) | League Spartan | 800 | Logo wordmark only |

**Type scale:**
- h1: 84px / h2: 64px / h3: 52px / h4: 48px / h5: 40px
- Large body: 20px / Standard: 16px / Small: 14px

---

## Surfaces & Cards

### Glass Card (primary card surface)
```css
border-radius: 24px;
border: 1px solid rgba(0,0,0,0.08);
background: linear-gradient(180deg, rgba(255,255,255,0.88), rgba(245,245,245,0.92));
box-shadow: 0 24px 60px rgba(0,0,0,0.09), 0 8px 24px rgba(0,0,0,0.04), 0 1px 0 rgba(255,255,255,0.8) inset;
backdrop-filter: blur(20px);
```
Hover: lifts −2px, shadow deepens, no colour change

### Dark Glass Card (testimonials, dark accents)
```css
border: 1px solid rgba(255,255,255,0.08);
background: linear-gradient(180deg, rgba(22,18,15,0.76), rgba(14,11,9,0.82));
box-shadow: 0 20px 60px rgba(0,0,0,0.22), 0 1px 0 rgba(255,255,255,0.08) inset;
backdrop-filter: blur(18px);
```

### Soft Pill (category label / badge)
```css
border-radius: 999px;
border: 1px solid rgba(1,1,1,0.10);
background: rgba(255,255,255,0.86);
padding: 8px 14px;
font-size: 12px;
font-weight: 600;
letter-spacing: 0.12em;
text-transform: uppercase;
color: #4a4a4a;
```

---

## Interactive Components

### Primary CTA Button
```css
border-radius: 999px;
background: #010101;
color: white;
font-weight: 600;
font-size: 15px;
min-height: 56px;
padding: 16px 28px;
```
Hover: translateY(−1px), box-shadow: `0 0 24px 6px rgba(255,165,0,0.4)`  
The orange glow on hover is a signature brand interaction.

### Filter Chip
```css
border-radius: 999px;
border: 1px solid rgba(1,1,1,0.08);
background: rgba(255,255,255,0.76);
padding: 10px 18px;
font-size: 14px;
font-weight: 500;
```
Active state: `background: #010101; color: white;`

### Link Arrow
Text links end with `→` arrow. Style: `font-weight: 600`, brand orange on hover.

---

## Motion & Animation Principles

- **Lift on hover:** Cards and buttons translate `−1px` to `−2px` Y on hover
- **Orange glow:** CTA buttons emit `rgba(255,165,0,0.4)` glow on hover/focus
- **Smooth transitions:** `transition: all 0.3s ease` as default, `0.4s cubic-bezier(0.4,0,0.2,1)` for accordion expand
- **Image zoom:** Product/project images scale to `1.05` on parent hover (`duration-700`)
- **Fade-up entrance:** Sections animate in with `opacity: 0 → 1` + `translateY(20px → 0)` on scroll
- **No jarring motion.** Everything is subtle, considered, premium.

---

## Layout

- Max content width: `1280px`
- Section padding: `py-10 md:py-12` (generous vertical rhythm)
- Card gap: `20px` (5 in Tailwind)
- Grid: `1 col mobile → 2 col tablet → 3–4 col desktop`
- Border radius hierarchy: sections `32px`, cards `24–28px`, pills/buttons `999px`

---

## Link in Bio Page — Brief

**Purpose:** Instagram link-in-bio landing page. Users arrive here instead of the homepage.  
**Vibe:** Premium, warm, calm. Like arriving at a well-designed studio.  
**Format:** Single scrollable column, mobile-first, max-width ~420px centred on desktop

### Content blocks (top to bottom):
1. **Header** — Logo + tagline ("Acoustic panels. Singapore.")
2. **Hero line** — One punchy sentence: "We make rooms sound the way they should."
3. **Navigation links** (5 cards, stacked):
   - 🌐 Visit our website → justacoustics.co
   - 🏗️ See our projects → justacoustics.co/projects
   - ❓ Frequently asked questions → justacoustics.co/#faq
   - 💬 WhatsApp us → wa.me/6589301905
   - 📞 Call us → tel:+6589301905
4. **Social proof line** — "Trusted by restaurants, offices, and churches across Singapore."
5. **Footer** — Instagram handle + copyright

### Link card style (each nav item):
- Full-width glass card
- Left icon + label + right arrow `→`
- Hover: lift + orange glow on arrow
- WhatsApp card could have a subtle green tint; phone card standard dark

### Animations for the Link in Bio:
- Cards stagger-fade in on load (50ms delay between each)
- Subtle parallax on a blurred background texture (acoustic foam pattern or abstract wave)
- Hover on each card: lift −3px + shadow deepen + arrow slides right 4px

---

## Brand Voice (for copy in designs)
- Direct, no fluff. Short sentences.
- "We make rooms sound the way they should." not "Transforming acoustic environments."
- Singapore-specific where relevant.
- Warm but professional. Not corporate.
