# Portfolio Review Scope — codex.is-a.dev

## What this document is

A description of the live portfolio as it exists today (commit `52c8777` plus uncommitted logo files), written so that independent reviewers can challenge it. It states intent, the current structure, the claims the site makes, and the measurements already taken. It is not a redesign brief and it does not propose fixes.

Reviewed artifact: a React 19 + Vite single-page portfolio with five HTML entry points: `/`, `/interests/video-editing/`, `/interests/minecraft/`, `/blogs/how-i-started/`, `/blogs/how-i-got-my-first-client/`.

## Owner and purpose

Aditya Rathore, 16, presents himself as a full-stack developer and creative engineer. The site has to do three jobs at once:

1. Convince a hiring manager or client that he can build and ship software.
2. Sell video-editing commissions to small businesses.
3. Read as a personal place rather than a template (hobbies, writing, character).

The tension is that these three jobs want different pages, different proof, and different calls to action. The site currently serves all three from one long scroll plus two sub-pages.

## Current structure

Home page, in order:

1. Hero: name, role line, one-paragraph manifesto, `Get in touch` button, four social icon links, portrait card, a skills shelf with three categories (Web & Full-Stack 14, Creative 5, Minecraft & Modding 7) and 12 tool pills.
2. Hero footer strip: `17 months of shipping` and a `Selected Works` scroll cue.
3. Selected Works: three project cards (Resolve-AIEdit, WinPreview, CodeX Client), each with an illustration tile, a status badge, a description, a repo link, and 4-5 tech pills.
4. Creative Pursuits & Trajectory: a two-column block. Left: Minecraft card with an autoplaying clip, "Pro in Minecraft", and an "ALSO: PUBG, Chess.com" line; a Video Editing card with a five-thumbnail strip and "Good at DaVinci Resolve" plus "ALSO: Premiere, AE, Mine-imator". Right: Blogs (2 notes), Experience (3 rows with role, organisation, period, and a section-level `2 years` label).
5. Footer: identity, `Built with Vibe & Code`, links to Blogs / GitHub / LinkedIn, and a Top control.

Sub-pages (`/interests/*`) render inside a fixed `role="dialog"` sheet over the still-mounted home page. They are also built as separate HTML entries. They show a Back control, a top-right label, a hero video player with a title and one-line description, a contact rail (WhatsApp number, Discord handle), a credential row ("Video Editor & Motion Designer", "DaVinci Resolve Studio"), a capability grid, and — on Minecraft — "Other Games" with two IGN handles.

Blog pages are standalone documents with a washi illustration, a fixed reading canvas, and a subscribe form.

## Claims inventory and contradictions

- Hero: `17 months of shipping`. Experience block label: `2 years`. Earliest role start: `2024`. Today is November 2026. The three numbers cannot all be true.
- Experience row `Video Editor — Sept '26 - Present` sits under a `2 years` label while covering roughly two months.
- `Pro in Minecraft` and `Good at DaVinci Resolve` are self-assessments stated next to verified-looking badges and tool pills, with no external proof (rank, rating, client, view count).
- WinPreview claims `<35ms cold launches`, `<20MB RAM`, and "pure Direct2D/Direct3D11 hardware rendering". Resolve-AIEdit claims `42 verified tools`. No link, benchmark, or repository evidence is shown for these numbers on the card itself.
- The Minecraft page lists `IGN: BGMIHACKER112` as a credential.
- A personal WhatsApp number is published as a contact method.
- Portrait card shows `ADITYA · 16`, `INDIA` at 7-8.5px, and two values in the card's tooltip that have no interpretation on the page.

## Measurements already taken

Environment: headless Edge, 1440x900 and 390x844, both at device scale 1-2, served from the local production-equivalent build.

Contrast and type, home page at 1440:

- 8 of 34 distinct text styles fail WCAG AA, measured with a canvas colour resolver. Worst offenders: `at` 11px `#A8A29E` at 2.41:1; `explore more` 10px, `Also:` 9.5px, `2 notes` 10px and blog dates 11px in `stone-400` at 2.47:1; `17 months of shipping` and the experience dates at 12px `#8C867E` at 3.45:1; the `active` badge at 10px emerald on white at 3.65:1.
- A first pass with a naive colour parser reported 11 failures and 1.53:1 / 1.15:1 on the portrait labels. That pass mis-read `oklch()` values and is withdrawn: the portrait labels are `#57534E` and `#161514`, which pass. The real portrait-card defect is size, not contrast — 7px on mobile and 8.5px on desktop.
- 19 distinct text styles render below 12px on desktop.
- On `/interests/video-editing/` the count rises to 16 failing styles out of 49.

Structure:

- Heading outline on home: `H1 Aditya Rathore` → `H3 Resolve-AIEdit` → `H3 WinPreview` → `H3 CodeX Client` → `H4 How I Started` → `H4 How I Got My First Client`. No `H2`. Section labels (`Selected Works`, `Creative Pursuits & Trajectory`, `Interests & Experience`, `What Can I Edit?`) are not headings.
- The document has no `header` and no `nav` landmark.
- `/interests/*` routes keep the home page headings in the accessibility tree, producing two `H1` elements and a full duplicate of the home content above the sheet. The home canvas receives no `inert` and no `aria-hidden`.

Responsive:

- At 390px the `H1` wraps to two lines because the portrait card shares the title row, although the name fits on one line at that width.
- The video-editing tab strip has `scrollWidth 405` against `clientWidth 338` at 390px. The last tabs are cut off with no scroll affordance.
- 7 controls per page are under 24px tall (WCAG 2.2 target size minimum). Footer links sit at roughly 15px tall.

Performance, production build:

- `lucide-icons` chunk is 592.6 kB minified / 153.6 kB gzip. String `cassette` and other unused icon names are present in the chunk, which means the whole icon set ships.
- Total JS: about 946 kB minified / 250 kB gzip across six chunks.
- Home page downloads 3.2 MB of video before any interaction (`GixelMC.mp4` 2.4 MB, `Showcase-2.mp4` 385 kB) for cards that only play on hover.
- The deployment carries 180.6 MB of video, including one 48.9 MB file.
- First contentful paint measured at 744 ms locally; TTFB 25 ms. No LCP entry was reported by this Chromium build, so LCP is unknown.

Interaction:

- Direct loads of `/blogs/*` are standalone pages with their own focus order and no dialog. In-app navigation to the same content opens a sheet with `role="dialog"` and `aria-modal="true"`, but no focus trap and no focus move into the sheet.
- Motion is CSS-driven; `prefers-reduced-motion` disables all animation and transition durations globally.

## Design intent as stated in the code

Japanese washi paper, sumi ink, cel-art botanical borders, drifting petals, zen ripples, `ma` (negative space), and "museum-grade" portrait card. The sub-pages shift to a cream film-production palette with film strip and clapperboard props. The blogs use hand-painted washi illustrations with a fixed canvas.

## What this review needs to decide

1. Whether one page can carry three unrelated jobs, or whether the site needs distinct entry paths.
2. Whether the self-assessed claims and the inconsistent tenure numbers damage trust enough to fix before anything visual.
3. Whether the decorative layer (botanical branches, petals, ripples, paper texture, film props, ambient glows) earns its place or competes with the content.
4. What the correct hierarchy and naming is for the "interests" pages, which are currently the thinnest content on the site despite being separate routes.
5. What must change for the site to be usable by keyboard and screen-reader users, not just pass a colour check.
6. Which performance work has the highest return.

## Evidence files

- `review/shots/` — full-page and tall-viewport captures at desktop and mobile.
- `review/evidence.json` — per-route text styles, contrast, targets, headings, overflow.
- `review/capture-report.json` — page metrics per route and viewport.
- Source: `src/App.jsx`, `src/index.css`, `src/components/*.jsx`.
