# Antigravity animated portfolio — prompt pack

## Project identity
- Style: premium playful editorial portfolio; reference Video-91063.mp4 for layout, transitions, oversized type, projects, and contact flow.
- Hero: character from provided character sheet; reference Video-68706.mp4 specifically for cursor-following head and eyes.
- Brand colors: #890149 (signature magenta), #F3F3E7 (warm ivory). Optional supporting near-black #24121B when necessary for contrast.
- Fonts: **USE ONLY THE FONTS FROM MY LATEST UPLOADED FONT SCREENSHOT.** Add the screenshot as `references/typography-reference.png`. Identify exact font family and weights; use the displayed families for headings/body/accent according to their appearance. Don't default to Space Grotesk, DM Sans, Caveat, or other substitutes. If a family isn't legible, ask me for its exact name before final typography implementation. Respect font licensing; I will provide licensed local font files if required.
- Portfolio owner/content: replace placeholders with my true name, role, work, links, and contact details. Do not fabricate projects or testimonials.

## Prompt 0 — Analyze references and plan (start here)
You are the creative director, senior motion designer, and senior frontend engineer for an award-level personal portfolio. Study the files in `/references`: character sheet, stills from Video-68706, stills from Video-91063, and typography-reference.png (I'll provide it). If original videos exist, sample representative frames with ffmpeg. Extract an accurate visual direction; distinguish the cursor-following character reference from the site layout/style reference.

Before coding, create DESIGN_PLAN.md containing: exact identified font family names and usage hierarchy; color tokens (#890149, #F3F3E7); hero composition; section-by-section wireframe; interaction specs; animation intensity; image pipeline for a clean transparent hero asset; responsive states (1440px and 390px); performance/accessibility plan; implementation milestones. Don't substitute font families or pretend a static illustration is already a rigged 3D asset. If the typography names cannot be verified, mark them pending, do not invent names. Show me the plan for review.

## Prompt 1 — Build the portfolio foundation
Implement the approved design using Next.js App Router, TypeScript, Tailwind CSS, GSAP + ScrollTrigger. Use components, readable code, and centralized design tokens. Sections: navigation, high-impact hero, selected works/projects, about, skills/services, creative process, contact, footer. Give the hero oversized typographic composition like Video-91063, adapted to my specified palette and uploaded fonts. Use strong spacing, unexpected but elegant asymmetry, rounded project thumbnails, hairline dividers, small editorial labels, and selective hand-drawn accents only if compatible with the fonts.

Visual palette: warm ivory #F3F3E7 for the main background, berry magenta #890149 for high-impact regions/accents, and supporting near-black only where necessary. Body text must be readable. Typography: import/use exactly the fonts from typography-reference.png with locally supplied licensed font files or legal hosted imports. Set heading/body/accent family tokens. Do not use generic default font fallbacks as a final styling choice.

Use typed project arrays with clearly marked placeholder content—not invented accomplishments. Include a working mobile menu, keyboard-visible focus indicators, responsive layouts, real anchored nav links, email contact action, semantic headings, alt text, and SEO metadata. Keep implementation modular and testable. Start the app and fix compile issues.

## Prompt 2 — Implement the animated character hero
Implement the hero character based on the original uploaded character sheet. Preserve her defining visual identity: shoulder-length voluminous wavy black hair, transparent-frame glasses, medium-brown skin, dark brown sleeveless top, white wide-leg pants, black belt, white sneakers, youthful warm smile. Do not insert the whole character-sheet image, crop a frame with its background, or generate an unrelated character.

The visual reference Video-68706 shows a head/eyes reacting to the cursor. Recreate this behavior using legitimate assets: a transparent character bust with separated head/eyes/pupils and optional hair layers, or a properly rigged Rive/Live2D model if one is supplied. A single flat PNG alone cannot produce independently moving eyes and head. Use a graceful fallback if layers aren't yet available (small whole-character rotation/translation only) and clearly mark that limitation. Don't fake eye movement by deforming the whole image.

On pointer movement within the hero, normalize pointer location around the character, smooth with requestAnimationFrame/GSAP quickTo, rotate head max 5–7 degrees and translate max 8–12px; move pupils max 3–6px only when separately masked/rigged. Add subtle idle breathing and blinking only when real layers allow it. Restore neutral state on pointer leave; disable cursor tracking on coarse pointers, respect prefers-reduced-motion, and keep the character from blocking CTA clicks. Prevent overflow, layout shifts, and excessive CPU usage. Test desktop and mobile. 

## Prompt 3 — Add motion and editorial polish
Use Video-91063 to guide polished transitions, not to literally clone its brand. Add scroll-triggered entrance transitions, subtle staggered reveal of project cards, an about-section marquee only if it enhances legibility, gentle image parallax, tasteful magnetic/button hover (not essential to access links), animated chapter labels, and a strong contact/footer finale. Keep animation smooth and understated. Only animate transform/opacity where possible. Add ScrollTrigger cleanup and reduced-motion support. Avoid universal scroll hijacking, fake loading screens, gratuitous particle effects, and animations that hide content.

Build a custom pointer motif only if accessible and not interfering with native cursor targets. Make every button/CTA operational. Validate breakpoint layout at 390, 768, 1024, 1440, and 1920 widths.

## Prompt 4 — QA and launch readiness
Audit implementation against DESIGN_PLAN.md and all provided references. Run type checking, linting, build, and browser QA; inspect at least 1440x900 and 390x844. Capture screenshots of hero, projects, about, and contact. Check typography names and files actually load, colors are exact, no horizontal overflow, no dead links, no console errors, no accessibility failures from color contrast or missing labels, no CLS from fonts/images, and reduced-motion behavior works. Confirm cursor-following head and eyes only when supported by rigged assets; state any asset blockers. Fix issues, then provide deployment steps for Vercel. Do not publish until I approve.

## Quickstart (Windows)
1. Install Antigravity at https://antigravity.google/download, sign in, and create a project containing an empty `portfolio` folder.
2. Inside the project put the provided `references` folder, plus your `typography-reference.png` screenshot. If available, put original videos in `references` too.
3. Paste Prompt 0 and review the plan. Follow with Prompts 1 through 4, one phase at a time.
4. Provide true portfolio name, role, projects, images, links, and email when replacing placeholders.
5. Preview locally, review browser screenshots, and request precise fixes section-by-section before deploying.
