# ISHIKA SHRIVASTAV — CINEMATIC PORTFOLIO REDESIGN

## Role and context
You are the lead creative director, senior motion designer and frontend engineer for a flagship creative-portfolio rebuild. Read the existing code and design system before changing anything. You are **modifying an already implemented site**, not starting from scratch. The current site has a working navigation, content and project assets, but the execution is too static and template-like. The priority is a significant improvement in visual art direction and interaction quality without losing existing work.

Inspect the files supplied in `references/`: `current-hero.png` (hero screenshot), `current-site-review.jpg` (frames from walkthrough), and the original videos if present in the workspace. Use `assets/ishika-cinematic-anime-character.png` as a NEW CHARACTER VISUAL REFERENCE / transparent still asset, along with the original character sheet; preserve the woman's distinctive wavy dark hair, warm brown skin, transparent eyeglasses, brown sleeveless top, white pants and expressive personality. The still is not a pre-rigged interactive animation.

## Fixed brand and content rules
- Site owner: Ishika Shrivastav, UI/UX & Graphic Designer.
- Brand ink: `#890149`; warm ivory: `#F3F3E7`; optional near-black `#24121B` for contrast. Add supporting hues only when artistically justified.
- Site fonts: **Cubao** for oversized display, **Poppins** for body/UI; use licensed locally supplied files or verified sources, no replacements without approval. The logo/packaging projects retain their individual original typography and palettes.
- Current information and original project images must remain intact. Use accurate email: `ishikashrivastav@gmail.com`, phone: `+91 77779 58649`. Do not show placeholder contact addresses, invented links, achievements or metrics.
- Selected Work order: (1) Logo Folio (Brûlé, Verda, Nima, Lumora, Tala, Pixel Drift); (2) UI/UX Design — CareConnect; (3) Packaging Design — No Cheat Progelato followed by Aara. Aara stays inside packaging, not before it.
- Fictional logo concepts must be identified as self-initiated AI-assisted explorations. No false client credits or awards. Build a design with award-caliber polish; never claim actual awards.

## Stage 0 — Audit and storyboard (do first, then implement)
1. Inspect existing routes, components, data, animations, images, and dependencies. Preserve reusable content and project assets. Record current component locations.
2. Show an **actual proposed desktop composition** for hero and a storyboard for every section transition; do not return only vague inspiration.
3. Make changes to the existing project and show working results, not only a plan. Run the app, inspect the browser, and save before/after screenshots.
4. Do not erase the existing codebase, metadata, or content during a visual overhaul.

## Stage 1 — Truly new hero composition
Current problem: giant Cubao `HI, I'M ISHIKA` is obscured by a somewhat flat, low-detail character crop; huge pale DESIGNER lettering wastes space; navigation and project layouts look conventional.

Art direction: an expressive, confident young designer on a premium art-directed digital stage, not a SaaS homepage. Create meaningful depth, typography choreography and a restrained modern-magenta/ivory aesthetic.

New hero layout: a deliberately asymmetric composition on desktop with clearly readable headline and 2.5D anime character occupying the right-center, roughly 65–78vh tall. Use a text hierarchy such as eyebrow `ISHIKA SHRIVASTAV / INDEPENDENT DESIGNER`, large `I DESIGN` / `WITH FEELING.` or thoughtfully staged `HI, I'M ISHIKA`, descriptor `UI/UX & Graphic Designer`, and genuine availability `Open to creative opportunities`. Keep all essential text legible; no permanent overlaps that conceal names or CTAs. Rework giant background type into a meaningful masked/sliced secondary layer rather than empty, huge ghost letters.

Animate the hero in a choreographed entrance: background silhouette/magenta shapes (0–0.5 s), Cubao lettermask reveal (0.25–1.0 s), character masked-up reveal with overshoot and subtle rim-light/shadow movement (0.5–1.3 s), eyebrow/CTA fade and microinteraction (0.9–1.5 s). Do not let motion delay access to content.

## Stage 2 — Sharper cinematic anime character (2.5D, NOT plastic 3D)
Reference look: high-end cinematic Japanese anime character compositing with controlled cel-shading, volumetric hair, clean eyes and glasses, fine linework, reflected light, subtle depth and realistic fabric folds, akin to the polished depth of an anime feature. Do not copy a specific copyrighted character. It must stay recognizable as the supplied original character. No cheap bobble-head, low-resolution scaling, muddy edges, cartoon balloon eyes, plastic-looking 3D or generic avatar.

Use supplied transparent `ishika-cinematic-anime-character.png` as a visual candidate, not a rig: compare it with the source character sheet for likeness. Preserve or refine consistency before using in production.

Render at native device resolution; never upscale a small source into a blurry hero. Use WebP/AVIF for static cutouts with proper alpha and high-resolution sources. Avoid visible white halos.

For actual interaction, prepare separate visual layers or a proper Rive/Live2D rig (hair back, hair front, face/head, pupils/eyes, glasses, torso, arms). A single flat PNG must **not** be falsely passed off as rigged eye tracking. If no rig exists, use limited depth parallax (2–4deg head-like total tilt via layered composite), idle breathing and slight hair drift; mark eye tracking as requiring a separate eye rig. Desktop: cursor-driven smoothed x/y motion with clamped safe limits; mobile: idle motion only; reduced-motion: still image. Aim for character expression changes (smile/blink) only if real layered assets are available.

## Stage 3 — Cinematic chapter introductions BEFORE project content
Replace immediate plain headings/cards with immersive section title sequences. Create **real working motion-intro assets** if choosing video mode; do not invent `*.mp4` files or link to assets that do not exist. Render short portrait-friendly and desktop versions using Remotion, After Effects exports supplied by user, or another renderable approach. If video rendering is unavailable, implement equally rich editable SVG/HTML/GSAP motion graphics and explicitly report that the result is code-driven rather than an exported video.

Use a reusable `ChapterIntro` or `SectionIntro` component with a unique intro for each chapter, preserving normal scrolling and accessibility. Chapter intro takes over the viewport momentarily when approached, plays its title choreography, then transitions directly into actual work (never a plain white-card snap). Short, replayable, and skippable, not an intrusive compulsory gate.

INTRO A — `LOGO FOLIO` (first Selected Work chapter)
Visual language: creative marks, letterform fragments, ink printing, spinning/settling grids. Beat map (~2.5–3s): start with near-black ink and sparse small typographic fragments; six custom brand symbols/colors move into an asymmetric composition; oversized `LOGO` and `FOLIO` assemble as cut-out typography with magenta masks; a rapidly expanding editorial window reveals the authentic six-brand overview/gallery. The intro must visually connect to the first Logo Folio image, not cut to an unrelated page.

INTRO B — `UI / UX DESIGN` → CareConnect
Visual language: cursor path, fine grids, wireframes evolving into actual user interface screens. Beat map: one glowing magenta/lavender path connects nodes; wireframe device panels slide/stack with subtle perspective; `UI / UX` resolves in large kinetic type; the panels become the real CareConnect 10-screen case study. Never create fake CareConnect screen visuals in place of supplied assets.

INTRO C — `PACKAGING DESIGN` → No Cheat Progelato
Visual language: dieline folding, color fan, material/tactile shadows. Beat map: flat vector package outline folds toward the viewer; seven authentic flavor accent colors sweep across; oversized `PACKAGING` condenses/explodes into negative-space type; center visual transforms into the actual seven-flavor Progelato family-shot asset. As visitor continues through packaging, use a subtler botanical/leaf wipe to introduce Aara; do NOT add an unrelated full-screen interruption between Progelato and Aara.

INTRO D — `EXPERIENCE` (if existing career timeline section)
Visual language: typographic dates, timeline, growing line and stamped year cards. Kinetic `EXPERIENCE` headline morphs into the legitimate Silvercayde/Ambizor timeline with existing exact dates. Avoid fake numerical achievements or career claims.

Visual pacing: title choreography 2–3 seconds maximum on normal playback. The transition out should have a distinctive mask wipe or morph into chapter content. No identical animation repeated on all chapters. Avoid full-screen flashes or intense strobing.

## Stage 4 — Scroll choreography
Prefer GSAP + ScrollTrigger for scroll-aware timeline/pin/reveal; use proper React cleanup if project uses React. Implement a single testable `ChapterIntro` pattern, but customize each sequence.
- Let user scroll normally; do not lock wheel for 3 seconds or trap touch users. Desktop can pin the chapter scene while scrolling through its animation timeline, or play a short muted inline video on entry while revealing content without blocking scroll.
- Make playback reversible/rewatchable on upward scroll when feasible. If videos are used, provide WebM and MP4 sources, posters, `muted`, `playsInline`, preload strategy and `onEnded`/skip fallback. A fast scroll should not expose a blank stage.
- On desktop, chapter stage fills 100svh. A typical scroll story: 0–35% intro visual builds, 35–65% section title locks into place, 65–100% mask reveals real project media. Total pinned distance about 130–180vh, refined by browser testing.
- Use `clip-path`, transform, SVG masks and opacity judiciously. Animate project media with depth/parallax, not generic every-card fade-ups. Never animate pinned wrapper geometry itself.
- On mobile, reduce or remove pinning and shorten intros to ~0.8–1.2 seconds; support reduced-motion as instant visible heading + content.
- Include visible skip affordance for video intros longer than ~2 seconds, functional progress bar if used, and keyboard-friendly navigation.

## Stage 5 — Project storytelling layouts (replace generic cards)
`LOGO FOLIO`: big full-bleed editorial collage + interactive six-brand grid; hover reveals words/symbols, click opens `/work/logo-folio`. Retain original supplied generated brand images, not random stock.
`CARECONNECT`: warm-lavender phone wall / tilted stacked UI screens with intuitive parent-vs-caregiver flow; carefully preserve screen readability. CTA `/work/careconnect`.
`PROGELATO`: seven-product hero lineup on elegant warm product-stage; taste/color transitions; gallery with front/back packaging. CTA `/work/no-cheat-progelato`.
`AARA`: atmospheric dark-olive and ivory botanical editorial treatment within PACKAGING chapter, with tea packaging hero and original art. CTA `/work/aara`.
Respect real project visual identity, keep site shell unified with `#890149` and `#F3F3E7`. Do not use the same large white rounded card for every project. Use dynamic but accessible spacing and responsive image crops.

## Stage 6 — Detailed visual quality rules
- Art direction: textured grain in moderation, controlled illustration strokes, sophisticated accent transitions, overlapping shapes with intentional meaning, expressive cursor hover states, refined microinteractions.
- Retain accessible contrast, large legible type, clean line-height, intuitive click targets, no content hidden permanently behind character.
- Add small deliberate interactive details, e.g., cursor reveals alternate crop/brand mark on Logo Folio, drag-to-scrub horizontal flavor cards, phone screens subtle tilt, but never interfere with clickability.
- Avoid stock hero photos, cookie-cutter templates, excessive glassmorphism, unreadable word clouds, infinite loading spinners, dozens of identical hover cards, cheap marquee loops.
- Adjust contact section to exact supplied real email; remove `ishika.design@example.com` or any other placeholder if still present.

## Engineering, performance and QA
Inspect existing stack. If React, use GSAP ScrollTrigger with `@gsap/react` or clean useLayoutEffect contexts; use `gsap.matchMedia` for desktop/mobile/reduced-motion. Avoid excessive libraries. Use CSS transforms/opacities, lazy loading, asset size budgets, correct `will-change` application, prevent horizontal overflow, prevent cumulative layout shifts and keep time-to-interaction reasonable.

Check screens at 1440x900, 1024x768, 390x844, 360x800. Test scroll down and UP, skip, deep linking to individual cases, touch, keyboard, different scroll speeds, and `prefers-reduced-motion`. Check video is present and playable if video implementation chosen. Confirm every intro flows into the appropriate real project and does not repeat incorrectly.

### Deliverables
1. Short audit: what existed and what was too plain.
2. Revised hero composition and character strategy; say which visual asset and rigging method is used.
3. Concrete motion storyboards for Logo Folio / UIUX / Packaging / Experience.
4. IMPLEMENT all modified code/assets and run site; never stop at only a pretty conceptual description.
5. Desktop and mobile captures for hero, each cinematic intro, and the revealed project content. Include a short screen recording if available.
6. QA report listing working transitions, any intro videos actually rendered, visual bugs corrected, accessibility fallback and outstanding limitations.

**DO NOT simply add fade-ins to the existing page. The target is a genuinely re-composed motion-led site. Preserve accurate real content and original project artwork.**
