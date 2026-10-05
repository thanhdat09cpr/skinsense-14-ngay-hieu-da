# Design System: #14NgayHieuDa (SkinSense AI)

Single source of truth for the campaign landing `/14-ngay-hieu-da`. Built with the `design-taste-frontend` skill; structure follows `stitch-design-taste`.

## 1. Visual Theme & Atmosphere

"Tờ lịch xé trên bàn": a clean science notebook with a desk calendar and a marker pen. Calm paper surfaces, ink-teal type, one loud yellow highlighter for emphasis. The hero is a deep-teal "stage" echoing the Skinnie poster.

- Dials: `DESIGN_VARIANCE 7`, `MOTION_INTENSITY 5`, `VISUAL_DENSITY 3`.
- Audience: Vietnamese students and young professionals into skincare; mobile first (375px).
- Hard limits from the brief: no price, no buy button, no medical claims, no before/after marketing imagery, consents never pre-ticked, no gradients.
- Photos: optional, stored only in the visitor's browser (IndexedDB), never uploaded. Day 7/14 show Day 1 next to the latest photo, private to the visitor.
- Must match the two teaser posts: cream paper + deep teal, notebook material (paper edges, calendar tiles, ink strokes). Brand logo in the header.
- Few elements, each one big: poster-size headlines, Skinnie doing something with the diary (pointing at the Day 1 page), no rings, outlined numerals or glows.
- Colour-block story: cream hero, yellow slogan tape, cream calendar, soft jade "Cách chơi" block, teal reminder block, cream notes, teal closing block.

## 2. Color Palette & Roles

All pairs verified WCAG AA (4.5:1 text, 3:1 non-text). Tokens live on `[data-campaign]` in `src/app/globals.css`.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | `#F6F6F0` | `#0F2427` | Page background |
| `--paper-raised` | `#FCFCF8` | `#142E32` | Sheets, tiles, cards |
| `--mint` | `#EEF6F4` | `#173539` | Tinted bands, tips |
| `--ink` / `--ink-strong` / `--ink-soft` | `#1F2E32` / `#205860` / `#3F5A60` | `#E6F2EF` / `#CFE9E4` / `#A9C7C2` | Body / headings / secondary |
| `--accent` | `#0F766E` | `#48B0A8` | Buttons, today tile, focus ring |
| `--done` | `#2E9C94` | `#48B0A8` | Completed stamp (never text) |
| `--stage` | `#205860` | `#143A40` | Hero colour block |
| `--highlight` | `#FFE45C` | same | Slogan tape and today tile outline only |
| `--accent-bright` | `#8EDBD2` | same | Emphasis words on the teal stage (5.0:1) |

Event themes swap tokens via `data-event` on the campaign root:
- `womens-day` (20/10 only): accent `#B8455F`, highlight `#F7B6C6`.
- `halloween` (27/10 to 31/10): darker paper `#E8ECEA`, accent `#9A4524`, highlight `#F2A65A`.

Rules: teal = action, yellow = emphasis. Never put light text on the solid yellow (dark mode uses a 32% yellow tint for marks). Original brand `#48B0A8` fails as text on paper (2.4:1), so it is only a fill.

## 3. Typography Rules

- Sans: **Be Vietnam Pro** 400 to 800 (`--font-be-vietnam`), chosen for correct Vietnamese diacritics.
- Mono: **JetBrains Mono** 500 to 800 (`--font-jetbrains`) for numbers, dates, day markers: the "lab notebook" voice.
- Display: `font-extrabold tracking-tight`, H1 48px mobile to 88px desktop, H2 30px to 48px.
- Emphasis inside a heading: `<HighlightMark>` (marker stroke), never a second typeface.
- No em dashes anywhere in visible copy; ranges use a hyphen with spaces (`27/10 - 31/10`).

## 4. Component Stylings

- **Shape lock**: interactive controls are full pills; every surface (tile, card, sheet, input) is 20px radius. Tiny hero squares scale to 10px on phones.
- **Primary button**: accent pill, white text. **Hero CTA**: yellow pill, ink text (`highlightButton`).
- **Day tile**: today = accent fill + yellow outline + gentle breathing; done = mint fill + teal check stamp; missed = dashed; locked = lock icon + unlock date.
- **Diary sheet**: flips down from its top edge like a torn calendar page (`perforated-top` mask).
- **Ruler slider**: native range input styled as a ruler, ticks 1 to 5, labels at both ends.
- **Forms**: label above input, error below, consent boxes unticked and separate.
- **Photo journal**: dashed drop zone "Thêm ảnh hôm nay"; saved state says "Đã lưu vào nhật ký trên máy bạn".

## 5. Layout Principles

- Container `max-w-[1200px]`, 16px gutters on phones, no horizontal scroll at 375px.
- Sections, each a different layout family: stage hero, calendar sheet, yellow block with 3-step bento (Skinnie breaks out of the top edge), teal split form with big Skinnie, colourful tilted notes, large-type list, sticky-title accordion, teal closing block.
- Conversion helpers: phone-only sticky bottom CTA once the hero button is out of view; early-access popup (after ~60% scroll, exit intent or 45s; never before 12s, never over a sheet, 3-day snooze, never after sign-up). No fake countdowns. Review it any time with `?popup=1` (opens at once, no snooze).
- Reminder form: email is required there (the Day 1 prompt can still be skipped with "Để sau", so playing never needs an email).
- Calendar grid: 4 columns on phones, 8 on desktop; Day 7 and Day 14 span 2, so 14 days fill exactly 16 cells.
- One eyebrow pill (hero) only.

## 6. Motion & Interaction

Library: `motion/react`. Every animation has a job; everything collapses under `prefers-reduced-motion`.

| Moment | Motion | Purpose |
|---|---|---|
| Hero load | squares drop in, stickers slap on, Skinnie flies in | explain "14 squares" before reading |
| Today tile | slow breathing scale | the one action that matters |
| Open tile | sheet rotates down from top edge | calendar page reveal |
| Save | check stamp springs in, ring fills | feedback and progress |
| Day 7 / 14 | chart lines revealed left to right | the "my own skin data" moment |
| Colour blocks | big Skinnie springs in when the block enters view | each block has one focal character |
| Scroll | Skinnie guide flies between sections | companion |
| Slogan tape | single marquee | keep campaign slogan visible |

## 7. Skinnie (mascot) Rules

- Companion, not salesperson: asks, never diagnoses; tips are only about how to observe.
- Appears at key moments only: hero, flying guide (bubble auto-hides after 5.5s), tip boxes, Day 7 question, closing.
- Treated as a sticker on paper: transparent PNG, soft drop shadow, never on a busy background.
- Poses live in `public/skinnie/` (page poses via `src/lib/skinnie-poses.ts`): point (hero, flying guide, reminder), magnifier `skinnie.png` (closing, early-access popup, Day 1 tip), flower (20/10 hero + tile), halloween (Halloween hero + tiles), puzzled (Day 7), cheer (final day, how-it-works), wave (welcome email). Carousel only: phone, writing, calendar. Keep the chest flame mark, it is part of the character.
- Scene photos (`public/images/`): phone by window, notebook calendar. No people, no faces.

## 8. Anti-Patterns (Banned)

AI-purple gradients, any gradient fill, Inter, three equal feature cards, emoji in UI, before/after photos, prices, "Mua ngay", medical wording (trị mụn, chẩn đoán, điều trị, chuẩn y khoa), pre-ticked consents, more than one marquee, scroll cues, decorative status dots.

## 9. Mounting on the main site (Next.js multi-zones)

The landing is its own Next.js app with `basePath: "/14-ngay-hieu-da"` (next.config.ts). Every public file goes through `asset()` in `src/lib/campaign-config.ts`, so all requests stay under the base path. The main site adds two `rewrites()` entries pointing `/14-ngay-hieu-da` and `/14-ngay-hieu-da/:path*` to the landing's Vercel URL, and links to it with a plain `<a>`. Verified locally against a stand-in main site: 29 requests, none outside the base path, no failures. Step-by-step for the team: README, "Ghép vào website thật".
