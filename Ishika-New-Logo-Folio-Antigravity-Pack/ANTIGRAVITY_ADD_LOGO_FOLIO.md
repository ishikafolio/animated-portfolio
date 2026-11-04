# ANTIGRAVITY — INTEGRATE UPDATED LOGO FOLIO INTO ISHIKA'S EXISTING PORTFOLIO

## Context and goal
This is an UPDATE to the existing Ishika Shrivastav portfolio, not a new website. The newest approved Logo Folio is provided in `public/projects/logo-folio/` with structured data in `logo-folio.project.json`.

**Replace the OLD Project 03 / Logo Folio content** (solis, noka, FORMA, arc, kefi, COVE) with the SIX NEW CONCEPT BRANDS below. Do not duplicate the project or keep the old names in cards, detail pages, filters, summaries, or metadata.

## Preserve the approved visual system
- Main brand palette: `#890149` and `#F3F3E7`.
- Typography: Cubao for display headlines; Poppins for body and UI (use the project's legitimate installed/local fonts).
- Keep the animated character, cursor-follow behavior, page transitions, existing navigation, page structure, animations, and responsive components.
- Brand images inside this project must retain their **own** visual styles and colors. Do not force magenta filters, recolor logos, or use CSS blend effects on project imagery.
- Build using the existing app framework, design tokens, reusable components, and routing conventions. Do not rebuild from scratch.

## Project 03 content
Title: **Logo Folio**
Category: **Logo Design · Brand Identity · Visual Exploration**
Headline: **Six Brands. Six Stories. Six Unique Identities.**
Summary: **A collection of six fictional brand identities exploring distinctive typography, illustrative symbols, visual storytelling, and applications across different industries.**
Type: **Self-initiated concept collection · AI-assisted visual study**
Year: **2026**

Brands and required order:
1. **brùlè** — Specialty Coffee / Café — Good Coffee. Brighter Days.
2. **vèrda** — Natural Skincare / Wellness — Skin Rituals in Harmony.
3. **nína** — Fashion / Apparel — Wear Your Story.
4. **lùmora** — Travel / Hospitality — Journeys with Meaning.
5. **tála** — Gourmet Food / Beverage — Flavours That Feel Like Home.
6. **pixel drift** — Creative Studio / Digital — Ideas in Motion.

Read `logo-folio.project.json` for full text, exact slugs, and asset paths. Do not paraphrase the individual brand names incorrectly.

## Homepage featured-work card
- Use `/projects/logo-folio/logo-folio-homepage-cover.webp` as cover.
- Title: Logo Folio.
- Eyebrow: Brand Identity / Concept Series.
- Subheading: Six Brands. Six Stories. Six Unique Identities.
- Link the full card and CTA to the case study route, using the project's existing routing pattern (e.g. `/projects/logo-folio`).
- Use an ivory background around the image. Keep the cover fully visible and do not crop away the left headline or bottom row.
- Preserve all existing hover, layout, and navigation behaviors.

## Case study detail page
Use the existing project-page template. Structure:
1. Full-width intro and complete editorial board using `/projects/logo-folio/logo-folio-overview.webp`.
2. Short, honest explanation that this is a speculative six-brand design exploration, with the AI-assisted concept label visible in project metadata.
3. An editorial 6-brand gallery, **one panel for each brand**, using the images in `brands/`.
4. Optional reveal/hover feature using corresponding images from `previews/`.
5. A concise closing note about varied design directions: expressive typography, illustrative symbols, brand applications, and color systems.
6. Standard next-project navigation back to the portfolio's actual other projects.

Visual treatment:
- This is one curated case study, not six extra top-level portfolio projects.
- All images are image-based artwork and compositions extracted from one original concept board. They are **not separate editable vectors or six production-ready logos**.
- For panels use `object-fit: contain` with an appropriate warm-ivory surface so no mockup or wordmark is clipped.
- Maintain generous whitespace, thoughtful editorial hierarchy, restrained motion and legible labels.
- Render real images from `/public`, not placeholder stock photos. Use the exact asset paths from the JSON.
- Provide descriptive alt text, image size hints, lazy loading below fold, and a reduced-motion fallback.
- Keep the responsive project gallery visually engaging on mobile (single column) and desktop (2-3 columns as appropriate).

## Accuracy and attribution
- Treat all six brands as **fictional / speculative concepts**, not paid client work.
- The artwork is an AI-assisted visual concept: **do not invent** a human-led research process, client brief, measurable results, approvals, or production deliverables.
- If the site has a 'process' area, describe it as concept exploration and art-direction experimentation, not validated strategic design research.
- Do not invent logo source vectors, editable Illustrator files, testimonials, or external project URLs.
- Avoid name and typography corrections inside the image itself; flag any spelling needing human review.

## Execution instructions
1. Inspect the existing repo to find the project-card data source, shared project template, routes, and existing Logo Folio entry.
2. Copy/confirm the supplied assets in `public/projects/logo-folio` without renaming them.
3. Replace the old Logo Folio data with the contents of `logo-folio.project.json`; keep the project in position 03.
4. Make the homepage card clickable and implement/update the project detail page using the existing components.
5. Remove old Solis/Noka/FORMA/Arc/Kefi/COVE references from the rendered website; leave unrelated repo files untouched.
6. Check images for 404s, correct navigation, image aspect ratios, accessible labels, desktop and mobile layout, and reduced-motion behavior.
7. Show a browser screenshot of the homepage card and the Logo Folio detail page and a concise list of files changed.

**Do not start a new website, change the main color palette or replace the existing animated hero character.**
