# Progress: phases 1 and part of 2

Date: 16 November 2026
Baseline: `review/consolidated-review.md` (4.5/10 overall)

## Verified after the change

| Check | Before | After |
|---|---|---|
| Contrast failures (home, 34 styles) | 8 | **0** |
| Text styles under 12px (home) | 19 | 17 |
| `mailto:` links in `src` | 0 | 1 (primary CTA) |
| H1 lines at 390px | 2 | **1** |
| Horizontal overflow at 390/768/800/1024/1440 | 22px clipped at 768 | **0 at every width** |
| Home headings | H1 → H3 → H4, no H2 | H1 → H2 → H3 → H4, no skips |
| Home canvas behind a sheet | live, exposed | `inert` + `aria-hidden` |
| Sheet focus | stayed on hidden home | moves into dialog, first Tab lands inside |
| Sheet dialog label | none | named per route |
| Document title on in-app navigation | never changed | updates and restores |
| Close then Back | re-opened the sheet | closes to `/` with one press |
| Claims contradicted by linked sources | 3 | 0 |

## Phase 1 — trust floor (complete)

- **`ContactDealButton.jsx`** is now an `<a href="mailto:…">`. The clipboard write and the "Email copied to clipboard!" toast are gone; the toast says "Opening your mail app…" and the address is in the accessibility tree. The click still plays the handshake flourish.
- **`Hero.jsx`** states availability as static text under the role line, with a green dot, at 13px and 7.3:1 contrast. It is no longer hidden in a hover bubble.
- **`SelectedWorks.jsx`** claims now match the repositories: `~40 ms warm launch, ~150 ms cold start, 25-40 MB private memory` replaces `<35ms` and `<20MB`. The CMake pill is gone (no CMakeLists in the repo). `active` became `maintained`. CodeX Client no longer leads with "modular cheat engine", its CTA says `View Code`, and it points at the repository instead of a live demo for an archived project.
- **`InterestsExperience.jsx`** drops both tenure counters (`17 months`, `2 years`); the dated rows are the only statement. `Pro in Minecraft` became `Minecraft & Modding`, `Good at DaVinci Resolve` became `DaVinci Resolve`.
- **`BlogSubscribeForm.jsx`** reports success only on `response.ok`; any rejection or 404 shows an error that names the email address as the fallback. `api/subscribe.js` and the Vite middleware both return **503** when no API key is configured instead of pretending to succeed. The localStorage backup now dedupes correctly and only writes after the server confirms.

## Phase 2 — positioning and IA (in progress)

Done:
- Hero has a second path: `Video commissions ↗` beside the primary CTA, on all breakpoints.
- `Selected Works` is a real `H2` with a project count; `Creative Pursuits` is an `H2`; each sub-band is an `H3`; blog rows stay `H4`.
- The duplicate `Interests & Experience` label and the dead chevron are gone.
- The video page opens on **Real Estate Reels** (three real reels) instead of the finance talking-head.
- A **`Send a brief`** mailto button sits above the WhatsApp row, with one line explaining what to send. No invented prices or turnaround times.
- Both explore pages end with an exit row: `All work · GitHub · Email` (and `Video work` on the Minecraft page).
- In-app navigation updates `document.title`; closing restores it.

Not done yet:
- Persistent `<header>` / `<nav>` across the five entries (still `nav: 0`).
- `rel=canonical` is not updated on in-app navigation (title is).
- The Minecraft route still holds one clip and one paragraph; it needs three real projects or a merge into About.
- No named client, price band, or testimonial on the commissions page — blocked on decision D3.

## Side effects to check by eye

- The hero is 810px tall at 390×844 and 900px at 1440, so the first fold still ends at the skills shelf. `Selected Works` begins just below the fold on a 900px laptop.
- Call `Creative Pursuits & Trajectory` a section, not two: the right-hand label cluster was removed to stop the block reading as two sections.
- The new `Send a brief` button competes with `Get in touch` conceptually but not visually (dark primary in the rail vs dark primary in the hero).

## Next

1. `Nav.jsx` + `<header>` on all five entries, with `Work · Video · Contact`.
2. Minecraft route content, or merge it.
3. Phase 3: landmarks, 12px floor, 24px targets, captions, reduced-motion video.
4. Phase 4: icon deep imports, video preload, image resizing.

## Files touched

`src/components/ContactDealButton.jsx`, `Hero.jsx`, `SelectedWorks.jsx`, `InterestsExperience.jsx`, `BlogSubscribeForm.jsx`, `VideoEditingExplorePage.jsx`, `MinecraftExplorePage.jsx`, `src/App.jsx`, `api/subscribe.js`, `vite.config.js`.

---

# Phase 2 completion and Phase 3

## Navigation

- New `src/components/Nav.jsx`, used by all five entries: brand (home) or Back (sub-pages), then `Work · Video · Contact`, with an optional section pill at `md+`.
- Contact is a real `mailto:`. Work scrolls to `#projects` on home and returns home from a sub-page.
- Blog posts carry the same links between Back and the blog switcher, verified at 390px with no overflow.
- Verified: `nav[aria-label="Primary"]` present on `/`, `/interests/video-editing/`, `/interests/minecraft/`, `/blogs/how-i-started/`, `/blogs/how-i-got-my-first-client/`.

## Layout corrections caused by the new nav

- Hero `pt-16 sm:pt-24` → `pt-6 sm:pt-10`; hero minimum height now `calc(92svh-56px)` / `calc(100svh-64px)` so the `India · IST` / `Jump to work` strip stays inside the first viewport (measured: bottom 869px in a 900px viewport).
- Mobile H1 at 32px, one line at 390px (236px wide).
- Interests block converted from fixed `md:w-[360px]` + `md:w-[350px]` to `md:grid-cols-2`: no overflow at 390/768/800/1024/1440.

## Phase 3 — accessibility

| Item | Before | After |
|---|---|---|
| Text styles under 11px | 7px, 8.5px, 9px, 9.5px, 10px, 10.5px | none (10px only on the mobile portrait label strip) |
| Controls under 24px tall | 7-13 per page | 0 on home, video, both blogs; 1 on Minecraft fixed in the same pass |
| Reduced motion | CSS only; video kept playing | all 6 videos `paused: true`, `autoplay` false |
| Landmarks | no `header`, no `nav` | `header` + `nav` + one `main` + `footer` |
| Hero meta strip | `<footer>` inside `<main>` | `<div>` |
| Mobile category tabs | 405px strip clipped in 338px | 2×2 grid, all four labels visible |

- 61 type classes raised, via `review/type-floor.cjs` (UTF-8 preserved).
- Reel carousel dots: 6×6px → 24×24px hit area with a 6px visual dot, `aria-current` added.
- Auto-play is gated on `prefers-reduced-motion`, and because an attribute change cannot stop a running video, an effect pauses every player explicitly.

## Verification after this phase

| Check | Result |
|---|---|
| Build | passes, 0 errors |
| Console/page errors on all 5 routes × 2 widths | 0 |
| Contrast (home, 33 styles) | 0 failures |
| Horizontal overflow | 0 at 390/768/800/1024/1440 |
| H1 count | 1 on home/blogs; 2 in the DOM on sub-pages (home canvas is `inert` + `aria-hidden`, so 1 in the accessibility tree) |
| Targets under 24px | 0 (home, video, both blogs); Minecraft 1 → fixed |
| Reduced motion | 6/6 videos paused |

## Still open in this track

- Captions: no `.vtt` assets exist. Needs real transcripts, not generated ones.
- Tab semantics: `role="tab"` still lacks `aria-controls`/`tabpanel` and arrow-key roving.
- 10px remains on the mobile portrait label strip by design; raise it if the strip must meet the floor.

---

# Phase 4 — performance

## What was wrong at the root

`node_modules/lucide-react` was corrupt: 723 `.mjs.map` files and zero `.mjs` sources, while `package.json` advertised `module: dist/esm/lucide-react.mjs`. Vite therefore resolved the CommonJS barrel of 33,400 lines, which cannot be tree-shaken, and `manualChunks` then pinned all of it into a chunk every page imported.

`npm install lucide-react@1.61.0 --force` restored 2,186 ESM files (2,171 icons). The `manualChunks` lucide branch was then deleted so Rollup could decide.

## Measured results

| Metric | Before | After |
|---|---|---|
| Total JS, gzip | ~250 kB | **~105 kB** |
| Icon chunk | 592.6 kB min / 153.6 kB gzip | **0 kB** (icons tree-shaken into `main`, ~9 kB total) |
| Home first load | 4,090 kB | **961 kB** |
| Home video bytes before intent | 2,952 kB | **0** |
| LCP, desktop unthrottled | 2,888 ms | **1,184-1,392 ms** |
| CLS | 0 | 0.001 |
| Deployment payload | ~190 MB | **75.0 MB** |
| Video total in `public/` | 180.6 MB | 71.9 MB |
| Images in `public/` | 11.4 MB of unreferenced PNG originals | moved to `.archive_assets/` |

## Changes

- **Media**: `preload="none"` and no `autoPlay` on the two home cards, the cat flourish, and the inactive reels; only the active reel may autoplay. A new `GixelMC-card.mp4` (132 kB, 6s, 480w) replaces the 2.4 MB original on the home card.
- **Encoding**: nine videos re-encoded to `scale=min(720,iw)` CRF 28 with `+faststart`; the 48.9 MB file is now 17.3 MB, `Versova` 17.4 → 11.4 MB, `youtube-creditcard` 11.7 → 2.2 MB.
- **Images**: portrait 188 kB SVG → `profile-328.webp` 9 kB / `profile-656.webp` 18 kB with `srcSet` and intrinsic `width`/`height`; preload and JSON-LD `image` point at the WebP. Cat poster PNG 198 kB → WebP 15 kB. Two botanical plates re-encoded smaller.
- **Loading**: the six parse-time `prefetch` links were removed and the `App.jsx` image warm-up moved to `requestIdleCallback`, so route artwork no longer competes with first paint and is no longer fetched twice.
- **Compositing**: permanent `will-change` removed from `.blog-sheet-container`, `.animate-fade-in` and `.animate-fade-in-up`.

## Budget status

| Budget | Target | Measured |
|---|---|---|
| JS gzip | ≤ 120 kB | **105 kB — met** |
| First load | ≤ 400 kB | **961 kB — not met** |
| Video before intent | 0 bytes | **0 — met** |
| CLS | ≤ 0.05 | 0.001 — met |
| LCP, throttled mobile (4x CPU) | ≤ 1.8 s | **2.9-3.5 s — not met** |

LCP is now set by the botanical artwork (≈894 kB of WebP) plus React hydration under 4× CPU throttling, not by JavaScript. Closing that gap means shipping smaller art at mobile widths (a `<picture>` breakpoint) or accepting a lighter decorative layer on phones. That is an art-direction decision, not a code fix, so it is left open rather than guessed.

## Verified

- Build passes; zero console/page errors across 5 routes × 2 viewports.
- Icons render correctly after the package repair (checked in the desktop capture).
- All videos `paused: true` with `preload="none"` on first load.

---

# Phase 5 — craft

- Removed the four corner registration crosshairs and the blueprint grid from the project plates. The Seigaiha wave and the accent ring carry the accent alone now, so the logo is the only focal point.
- Footer identity reads `React · TypeScript · DaVinci Resolve` instead of `Built with Vibe & Code`, in the desktop and mobile rows, with the stale comments updated.
- Hero manifesto rewritten from self-description to what the work is: "I build developer tools, web interfaces and video edits — mostly the kind of work where speed and feel decide whether it is any good."
- Meta description dropped the "spatial audio experiences" claim, which nothing on the site supports.

# Phase 6 — lock-in

- `scripts/verify.mjs` + `npm run verify` + `.github/workflows/verify.yml`. Static gates: JS ≤ 120 kB gzip, no icon chunk, `public/` ≤ 80 MB, no asset > 20 MB, retracted claims must not return, type floor ≥ 10px, `mailto:` must exist, every `<video>` must set `preload` and must not use unconditional `autoPlay`.
- The first run of the gate immediately caught live drift: the SEO fallback in `index.html` still carried `<35ms`, `<20MB`, "cheat engine" and a demo link for an archived project. Those are now corrected to match the cards.
- Three unused `kanji` fields removed.
- `qa/portfolio/README.md` records the rubric, baseline, current scores, every measured check, and the five items left open on purpose.

## Gate result

```
· JS: 365 kB raw, 101 kB gzip across 5 files
· public/: 74.5 MB in 103 files
All static gates passed.
```

---

# Final pass — the two dimensions still under 10

## Performance

- Identified the real LCP element on a throttled phone: `japanese-right-lower.webp`, a 165 kB decorative plate drawn at 30% opacity and 112 px wide. The other two plates now ship 320w sources (`<picture>`, 20 kB and 14 kB on mobile), and the heavy third one is hidden below 640 px, where it was indistinguishable at 30% opacity.
- Removed the 500 ms opacity gate that withheld the whole home canvas until two `requestAnimationFrame` callbacks resolved. Content now paints as soon as React mounts.
- Removed the staggered entrance animation from the five above-the-fold hero elements. LCP measures the final painted position, so a 650 ms translate was adding to it.
- Home first load 961 kB → **830 kB**.

Measured LCP at 4× CPU and 4G throttling: **3.6-5.3 s across six runs**, median around 4 s. That is honest but short of the 1.8 s target, and the variance shows the metric is now bound by compositing and hydration rather than bytes. The remaining fix is architectural: pre-render the hero markup outside `#root` so it does not wait for React, or drop the blurred aura layers behind the branches. Neither is a code tweak, so it stays open.

## Accessibility

- Category tabs are a real tab set now: `aria-controls`, one `tabpanel` with `aria-labelledby`, roving `tabindex`, and Left/Right/Home/End handling.

## Dimensions deliberately left below 10

Trust and Craft cannot be closed by code. They need a real photograph, a named client, a price band, caption files, and a decision on the Minecraft route. Inventing any of those would repeat the exact failure this review opened with, so the site states what it can prove and nothing more.




