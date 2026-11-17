# Consolidated Review — codex.is-a.dev

Reviewed: `C:\Users\CodeX\Desktop\New-Portfolio`, commit `52c8777` plus uncommitted `CodeX-logo.webp`, `Reolve-AIEdit.png`, `WinPreview-logo.webp`.
Date: 16 November 2026.
Method: Elephant-Goldfish Model (EGM) `0.1.1`, commit `72d06f5`, eight fresh-context reviewers, plus measured browser evidence.

---

## Verdict

The craft is real and the technical work behind the project cards is real. The problem is that the site does not tell a stranger what it is selling, and the first thing it asks them to trust does not survive a click.

Three defects decide this review:

1. **`Get in touch` cannot contact anyone.** There is no `mailto:` anywhere in `src`. The button copies an address the visitor never sees, plays a 161 kB cat video, and prints "Email copied to clipboard!" even when the clipboard write is rejected. The site's only conversion action for both jobs fails silently.
2. **The most checkable claims are contradicted by the project's own README and the site's own outbound link.** WinPreview's card says `<35ms cold launches`; its README says `~40 ms` background launch and `~150 ms` to a previewed file. "Pro in Minecraft" links to an MCSR profile showing Elo 355, rank 20,778, 29W/58L and one completion.
3. **The video-editing business is unreachable from the home page and unsellable once reached.** The hero never names editing; the only link is a 10px "explore more" under a hobby card; the commissions page has no price, package, turnaround, client name, or primary button.

Everything else — the 592 kB icon chunk, the 2.95 MB of video before interaction, the duplicate `H1` under the sheet, the missing `h2`/`nav` landmarks, 19 text styles below 12px — is repair work on a site that already looks better than it currently argues.

**Overall: 4.5 / 10 as a portfolio for hiring and commissions. 7 / 10 as a visual object.**

| Dimension | Score | Anchor |
|---|---|---|
| Positioning and information architecture | 4 | Three audiences serialised into one scroll, no nav, no emergent path |
| Trust and proof | 3 | Linked evidence contradicts two headline claims; three conflicting tenures |
| Accessibility | 5 | Real reduced-motion support and skip-free markup, but no landmarks, no focus management, 8 contrast failures |
| Performance | 5 | 250 kB gzip JS and 4.1 MB first load for a static page; no LCP work |
| Visual craft and art direction | 7 | Coherent washi/cel-art system that survives close inspection |
| Code health | 5 | Clean component split and good metadata; duplicated subscribe logic, dead endpoints, index-keyed state bugs |

---

## How this was run

- **EGM installed** at a pinned commit: `%USERPROFILE%\.config\opencode\egm-candidate-72d06f5`, all seven skills junctioned into `~/.config/opencode/skills`, 105 files hashed in `installation.json`.
- **Adapter note:** EGM's OpenCode adapter targets **1.18.29** with V1 `task`/`permission`. This host is **2.2.5** with V2 `subagent`/`permissions`, so the V1 installer was not run. The documented fallback was used instead: each reviewer is a fresh `general` subagent told to read its persona file first, with no conversation history and no write access.
- **Elephant:** this report. It holds the project context, wrote `review/portfolio-scope.md`, and verified or rejected every finding before consolidating.
- **Goldfish (8, all fresh context):** design critic, structural, style/copy, comprehension, zoom-out, engineering, accessibility, performance, plus a claim-verification pass against the linked repositories.
- **Skills applied:** `accessibility-audit` (WCAG 2.2 AA structure and severity), `audit-ai-design-slop` (removal-first classification, P0-P3), `browser` (live inspection).

**Correction to my own evidence.** The first contrast pass used a parser that mis-read `oklch()` and reported `active` at 1.53:1 and the portrait labels at 1.15:1. Those figures are withdrawn. Re-measured through a canvas colour resolver: **8 of 34** styles fail, the badge is **3.65:1**, and the portrait labels pass contrast — their defect is 7-8.5px size, not colour. Every number below is from the corrected pass or a direct source check.

---

## P0 — Fix before anything visual

### 1. The primary CTA does not contact anyone
`ContactDealButton.jsx:5, 203-225, 307-313, 396-403`; `Hero.jsx:101`

The button is a `<button type="button">`, not a link. It writes `aditya.rathore10101@gmail.com` to the clipboard, plays `cat-handshake.mp4`, and renders a fixed success toast. `:206` swallows the copy rejection with `.catch(() => {})`, so a blocked clipboard still reports success. The address is never printed, and there is **no `mailto:` in `src`** (grep: 0 matches).

*Harm:* a hiring manager who clicks cannot send anything without guessing the address and pasting from a clipboard they may not have. Non-secure contexts and in-app browsers (where most Instagram DM traffic lands) fail outright.

*Fix:* wrap the existing pill in `<a href="mailto:…">` keeping the animation, demote copy to a secondary control that reports failure, and print the address in the footer identity row.

### 2. Two headline claims are contradicted by the linked repositories
`SelectedWorks.jsx:74`, `:82`; `InterestsExperience.jsx:154`

| Claim on site | What the linked source says |
|---|---|
| `<35ms cold launches` | README: `~40 ms` background-service launch, `~150 ms` cold start to first preview |
| `<20MB RAM` | README: `~25-40 MB private` working set |
| `CMake` pill | Repo has no CMakeLists; build is `clang++.exe -std=c++20` via `src/build.bat` |
| `Pro in Minecraft` | MCSR Ranked `OnlyCodeX`: Elo 355, rank 20,778, 105 matches, 29W/58L, 1 completion |
| `Minecraft Speedrunning Ranked Record` | Same profile: one ranked completion, best 33:59.8, 58 forfeits |

*Harm:* these are the claims a reader can disprove in one click, and two of the disproof links are on your own cards. A reader who checks one stops believing the rest — including the parts that are true (42 tools, Direct2D, Java 21, Fabric 1.21.4, `archived` status all match).

*Fix:* rewrite line 74 to the README's numbers (`~40 ms warm, ~150 ms cold, 25-40 MB private`), delete the CMake pill, and replace `Pro in` / `Ranked Record` with the earned fact (`MCSR Ranked · Elo 355` or the rank you want to claim once it is higher). One editing pass removes the entire trust problem.

### 3. The newsletter always reports success and stores nothing
`BlogSubscribeForm.jsx:36-44, 62-76`; `api/subscribe.js:35-42`; `vite.config.js:10-55`

A non-OK response is only `console.warn`ed, and the catch block calls `setStatus('success')`. The API route returns `200 {success:true}` when `RESEND_API_KEY` is absent. The only implementations are the Vite dev middleware and `api/subscribe.js`, but hosting is GitHub Pages (`public/CNAME` = `codex.is-a.dev`, no `vercel.json`/`netlify.toml`) — so `/api/subscribe` does not exist in production at all. The `localStorage` fallback stores `{email, source, date}` objects and then checks `stored.includes(trimmed)` against strings, so it never deduplicates and is never read back.

*Harm:* every subscriber is told "You're subscribed! I'll ping you directly" and their address is discarded. It is the only repeat-contact channel on the site and it is fictional.

*Fix:* point the form at a real endpoint and fail visibly with `aria-invalid` and an error message. If there is no endpoint this week, delete the form — the RSS and email links already exist.

### 4. Availability is hidden inside a hover bubble
`HeroPortraitCard.jsx:38, 87, 130, 180`

"Open for work" is rendered inside a bubble that is `opacity-0` until `group-hover`. It appears only if a visitor happens to hover (or tap) the avatar, at 10-12.5px, under an `ADITYA · 16` label.

*Harm:* the single question a client asks — "can I hire this person" — has no answer on the page. The only other availability signal is the `Available` chip on a sub-page the home page never links to.

*Fix:* put `Available for freelance editing and development` as static text under the role line. Keep the bubble for the portrait.

### 5. The video business has no entry point and no offer
`Hero.jsx:73-93`; `HeroSkillsShelf.jsx:257`; `VideoEditingExplorePage.jsx:184, 390-420, 695-805`

The hero never names editing; the skills shelf defaults to `web`, so DaVinci and Premiere are behind an unopened tab. The only route to the editing page is a 10px "explore more" under a card filed under "Creative Pursuits". That page then has no price, package, turnaround, client, or button — only a WhatsApp number and a Discord handle.

*Harm:* a small business arriving from an Instagram DM lands on a software developer portfolio and leaves before reaching the service four screens down. A prospect who does reach it cannot judge the purchase.

*Fix:* add a second hero action (`Video commissions ↗`) and extend the role line; on the editing page default to `real-estate` rather than the finance talking-head, add one named client line under the player, and put a `Send a brief` button above the WhatsApp row.

### 6. Sub-routes are a modal in name only, and Back re-opens what you closed
`App.jsx:92-101, 151-164, 231-235, 252-267`

The sheet declares `role="dialog" aria-modal="true"`, but the home canvas never gets `inert` or `aria-hidden`, focus never moves in, and nothing is trapped. Because sub-page entries mount the same `App`, a direct load of `/interests/*` renders the full home page underneath: **two `H1`s in the live DOM** (verified: `Aditya Rathore` at 56px alongside `Video Editor & Motion Designer`).

`closeSheet` calls `pushState('/')` instead of popping, so after Escape the browser Back button returns to the sheet, which closes and pushes `/` again.

*Harm:* keyboard users tab through an invisible home page (about 30 stops) before reaching the page they asked for; screen readers announce the whole home page first; history grows and a single Back press cannot leave the site.

*Fix:* `inert` the canvas when a sheet is mounted, move focus to the sheet's heading, restore focus to the trigger on close, give the dialog `aria-labelledby`, and use `history.back()` on close when the entry was pushed.

---

## P1 — High return, low risk

### 7. 592 kB of icons for about 40 icons
`vite.config.js:89-93`; installed `lucide-react@1.61.0`

The installed package has no working ESM entry for the bundler, so Vite resolves the CommonJS barrel (`dist/cjs/lucide-react.js`, ~33,400 lines exporting every icon), which cannot be tree-shaken. `manualChunks` then pins all of it into one chunk named `lucide-icons`, imported by all five HTML entries. The string `cassette` is present in the shipped chunk.

Measured: 592.6 kB minified / **153.6 kB gzip** — 61% of the site's total gzip JS. Two independent proofs that nothing is shaken: the chunk contains AirPlay's path data (`m12 15 5 6H7Z`), an icon no source file imports, and `vendor-react` imports *from* the icon chunk, so the "lucide" chunk is a hard dependency of React and can never be deferred.

*Fix:* the reliable path is deep imports at the ~10 call sites — `import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right'` — because only then is the CJS barrel never entered. Deleting the `manualChunks` branch alone will not help. Expect roughly 25-30 kB minified for the ~55 icons actually used; assert the chunk is under 20 kB gzip after the change.

### 8. 2.95 MB of video arrives before interaction, and the clips loop
`InterestsExperience.jsx:130-140, 222-232`; `VideoEditingExplorePage.jsx:435-453, 532-551`

Production first load: **67 requests, 4,090 kB total, 2,952 kB video** (`GixelMC.mp4` 2,405 kB, `Showcase-2.mp4` 385 kB, `cat-handshake-thumb.png` 198 kB). Both home previews carry `autoPlay loop` — in this headless run playback stayed paused at `t=0`, so the network cost is proven and the loop is not, but the attributes are unconditional. On the editing route, four videos are declared `autoPlay` at once (one player plus three reels) with no `IntersectionObserver` and no pause on `visibilitychange`.

*Harm:* the largest single cost on the site is spent on a 150px card the visitor may never look at, on the device most likely to be on a metered connection. It is also the likeliest source of scroll jank on mid-range Android.

*Fix:* `preload="none"`, drop `autoPlay`, play on hover/focus intent, pause offscreen, and downsample `GixelMC.mp4` to a 5-8 second 480p loop.

### 9. There is no document outline and no navigation landmark
`Hero.jsx:73`; `SelectedWorks.jsx:434`; `InterestsExperience.jsx:328`; `App.jsx:236`

Outline: `H1 Aditya Rathore → H3 Resolve-AIEdit → H3 WinPreview → H3 CodeX Client → H4 How I Started → H4 How I Got My First Client`. No `H2` anywhere. `Selected Works`, `Creative Pursuits & Trajectory`, `Interests & Experience`, `What Can I Edit?` are `<span>`s. The page has no `<header>` and no `<nav>`; `Footer.jsx` is the only real link cluster and it sits below everything.

*Harm:* screen-reader users navigating by heading get three project cards and two blog rows with no section stops, and cannot jump to work, video, or contact. Every visitor pays for the lack of a nav by scrolling.

*Fix:* promote section labels to `h2`, demote cards to `h3`, wrap the identity in `<header>`, add nav links to Work / Video / Contact, and reuse the footer on both sub-pages (which currently have no exit at all).

### 10. Contrast and type size
Measured with a canvas resolver, home at 1440, 34 distinct styles:

| Element | Size | Colour | Ratio | Need |
|---|---|---|---|---|
| `at` (tooltip/meta) | 11px | `#A8A29E` | 2.41:1 | 4.5 |
| `explore more` | 10px | stone-400 | 2.47:1 | 4.5 |
| `Also:` | 9.5px | stone-400 | 2.47:1 | 4.5 |
| `2 notes` | 10px | stone-400 | 2.47:1 | 4.5 |
| blog dates `Nov '26` | 11px | stone-400 | 2.47:1 | 4.5 |
| `17 months of shipping`, experience dates | 12px | `#8C867E` | 3.45:1 | 4.5 |
| `active` badge | 10px | emerald-600 | 3.65:1 | 4.5 |

**8 of 34 styles fail; 19 render below 12px.** Verified replacements: `#78716C` = 4.59:1 and `#6B6660` = 5.44:1 on the canvas; emerald-700 on the tint = 5.21:1.

*Fix:* metadata to `#6B6660` at 12px minimum, status words to emerald-700, and delete the 7-8.5px portrait label row or raise it to 10px.

### 11. Mobile defects at 390px
- `H1` wraps to two lines because the portrait card shares the title row (`Hero.jsx:71-85`), although "Aditya Rathore" fits on one line at that width.
- Editing tab strip: 405px of content in a 338px container, `no-scrollbar` removes the affordance, so `Events Reels` and `Brand Commercials` are invisible (`VideoEditingExplorePage.jsx:390-420`).
- 7 controls per page are under 24px tall; footer links measure ~15px (WCAG 2.2 SC 2.5.8).
- Reel carousel dots are 6×6px with 6px gaps (`:612-623`).

*Fix:* move the portrait below the name or drop the `H1` to 32px on mobile; use `grid-cols-2` for tabs below `sm`; give every control a 24px hit area with padding or `after:-inset-2`; make dots 24px with a 6px visual dot.

### 12. Three tenures that cannot all be true
`Hero.jsx:138` `17 months of shipping`; `InterestsExperience.jsx:353` `2 years`; log rows `Sept '26 – Present`, `Mar '26 – Jun '26`, `2024 – 2025`. Today is November 2026; the GitHub account's earliest public repo is 2026-03-09.

*Fix:* keep the dated rows as the only tenure claim and delete both counters. They are already self-consistent and they are the version a reader can verify.

### 13. The page selling sound is muted by default
`VideoEditingExplorePage.jsx:188, 442, 540`

`ytMuted` initialises `true` for every player while the copy sells "clean audio ducking" and "Sound Staging".

*Fix:* unmute the active piece on first interaction, add one page-level "Sound on" control, and label the showcase accordingly. If autoplay policy blocks it, show a clear unmute prompt — do not leave the differentiator inaudible.

### 14. Selected Works contains no video work, and one third of it is a cheat client
`SelectedWorks.jsx:100, 512-517`

The section named "Selected Works" renders three developer projects. The second audience has no evidence above the "Creative Pursuits" hobby card. The third card describes "modular cheat engine" while showing `archived` next to a live `Visit` button.

*Fix:* swap one slot for a single editing case study using the same card layout, and remove the phrase from the retained card. If the client is kept, explain what it is in one neutral line — "Minecraft UI client" — rather than leading with the anti-cheat implication.

### 15. iPad portrait clips the interests block
`InterestsExperience.jsx:86, 91, 298`

The two columns are fixed (`md:w-[360px]`, `md:w-[350px]`, both `shrink-0`) with a 48px gap: 758px of content inside a 704px padded box at 768px. Measured at 768×900: the right column's edge sits at **790px against a 768px viewport — 22px clipped**, hidden by `overflow-x: hidden` on the body. Fits again at 800px and above. iPad portrait is exactly 768.

*Harm:* the trailing controls in the right column (blog arrows, experience periods) are cut with no scrollbar to reveal them, on the most common tablet size.

*Fix:* `md:grid md:grid-cols-2` with `minmax(0,1fr)` and drop both fixed widths. Remove `overflow-x: hidden` from `index.css:38` in development so this class of defect becomes visible.

### 16. 188 kB for an 80px avatar, and no responsive images anywhere
`public/profile-placeholder.svg`; `index.html:59, 99`; `HeroPortraitCard.jsx:94-100, 189-203`

The "SVG" is 188 kB: a 400×500 viewBox wrapping a base64 PNG, with about 2 kB of actual vector. It is preloaded in the document head, rendered at 80×100 and 164×205, and used as the `Person` schema image. Nothing in `src` uses `srcset` or `sizes`, and `/videoeditor-bg.webp` (1920×1080) is served whole to a 390px viewport.

*Fix:* export the portrait as AVIF/WebP at 328 and 656 widths, add `srcSet` with `width`/`height`, and remove the SVG preload. Use `<picture>` for the page background.

---

## P2 — Craft and consistency

17. **Generic-sounding claims where specifics exist.** `Built with Vibe & Code` (`Footer.jsx:31, 100`), `Good at DaVinci Resolve`, `Pro in Minecraft`, `Ultra-fast`. "Vibe" is the one word a technical reader will quote back, and it undercuts `Full-Stack Developer` in the same viewport. Replace the footer clause with `React · TypeScript · DaVinci Resolve`.
18. **Status words that need decoding.** `active` / `archived` at 10px, adjacent to `View Code`, could mean maintained, released, or for sale. Use `maintained` / `archived`, or state the fact (`v1.4`).
19. **The identity image is a placeholder, wired into structured data.** `HeroPortraitCard.jsx:199` uses `/profile-placeholder.svg`; `index.html:59` preloads that filename and `:99` uses it as the `Person` schema image, so the Google entity image is an unfinished asset. Replace it with a real photograph at the same 4:5 crop; the frame, label strip and hover bubble survive untouched. Weight is addressed in #16.
20. **Decorative stacking.** Home stacks botanical branches, drifting petals, zen ripples, a full-screen paper texture at `z-30`, and an ambient blur — on a page whose first job is to prove engineering. Project tiles add printer registration crosshairs, Seigaiha waves and a blueprint grid. Keep the branches and the paper; the rest compete with the cards. The `kanji` values in `SelectedWorks.jsx:35` are declared and never rendered.
21. **Sheet navigation leaves metadata stale.** `App.jsx:123-180` pushes URLs without updating `document.title` or `rel=canonical`, so in-app history entries and bookmarks keep the home page identity even though each static entry ships correct metadata.
22. **Reel state is keyed by index and reset too late.** `VideoEditingExplorePage.jsx:193-217` pauses the *newly mounted* reels after a category switch and leaves the pause icon over a frozen frame.
23. **No captions on 13 narrated or advert videos** (`VideoEditingExplorePage.jsx:435, 532`), while a mute control implies audio is part of the content.
24. **A personal phone number is published** as the commission contact (`:697-804`). A form or a business handle avoids the scraping cost.
25. **Six route images are fetched twice on the home page and none is visible there.** `index.html:133-138` prefetches `blog-1-bg`, `blog-2-bg`, both mobile variants, `minecraft-bg` and `videoeditor-bg`; then `App.jsx:77-89` creates `new Image()` for the same six. They compete with the four genuinely first-paint-critical preloads.
26. **Permanently composited layers.** Three fixed full-viewport layers (paper texture, botanical borders, zen effects) plus `will-change: transform, opacity` held permanently on `.blog-sheet-container` and on six entrance elements; `backdrop-filter` sits over the animating petal layer and directly over playing video. A 650ms one-shot entrance needs no `will-change`; scope it to the entering/exiting state, and paint the grain on the root element instead of a fixed blended overlay.

---

## What to keep

These are not filler — they are the parts a rewrite would destroy:

- The washi/cel-art art direction holds up at full resolution. The branch geometry, the paper grain and the illustration style are consistent and unusual; this is the site's actual differentiator.
- The blog pages are the strongest work on the site. The fixed canvas, the painted illustration and the 17px/1.7 reading measure are better than most developer blogs. The only change needed there is the profanity in the opening of post 1 — it undercuts the professional claim on the page a hiring manager reads most closely.
- `prefers-reduced-motion` is handled globally and correctly in CSS.
- SEO infrastructure is already better than typical: per-route titles, canonicals, OG images, `ProfilePage`/`Person` JSON-LD, a five-URL sitemap, and a readable static fallback inside each entry.
- The component split is clean, the token layer in `index.css` is sensible, and the copy in the project descriptions is specific rather than generic — it just needs its numbers corrected.
- All three project repositories, the client demo and the live site return 200. The proof links exist; they are currently arguing against the cards.

---

## Fix order

**Pass 1 — one afternoon, no redesign.** `mailto:` CTA + printed address; correct the three WinPreview numbers and delete the CMake pill; replace `Pro in Minecraft` with an earned fact; make availability static text; delete the dead newsletter form; correct the tenures; `inert` the home canvas and fix the close-history bug.

**Pass 2 — one session each.**
- Performance: icon deep-imports; strip `autoPlay`, `preload="none"`, pause offscreen; compress `GixelMC.mp4`; delete the duplicate prefetch.
- Structure: `h2` sections, `header`/`nav`, reuse footer on sub-pages, fix the mobile `H1` wrap and tab strip, fix the 768px two-column overflow.
- Assets: portrait and background to AVIF/WebP with `srcSet`.
- Type and colour: metadata to `#6B6660` at 12px+, kill 7-9.5px text, emerald-700 status.

**Pass 3 — the commercial work.** Add the video entry point to the hero, a named client and a `Send a brief` action on the commissions page, one editing case study in Selected Works, and a price band. Then decide whether `/interests/minecraft` earns a route: at ~500px of content it currently costs more than it returns.

**Do not** start with the botanical layer, the palette, or a new font. The visual system is not the problem.

---

## Evidence

| File | What it holds |
|---|---|
| `review/portfolio-scope.md` | The reviewed description of the site (Elephant artifact) |
| `review/evidence.json` | Per-route styles, targets, headings, overflow |
| `review/contrast-fixed.cjs` | Canvas-resolved contrast measurement (supersedes `evidence.cjs` contrast) |
| `review/prod-vitals.cjs` | Production LCP/CLS/long tasks/transfer |
| `review/tablet-band.cjs` | 768-1024px overflow measurement |
| `review/capture.cjs`, `capture-tall.cjs`, `capture-fold.cjs` | Screenshot harnesses |
| `review/shots/` | Desktop, mobile, tall-sheet and first-fold captures |
| `review/capture-report.json` | Per-route metrics |

Unverified: LCP element identity, mobile production transfer (second run served from cache), and real-device behaviour on iOS Safari.
