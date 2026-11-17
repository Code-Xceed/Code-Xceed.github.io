# Plan: every dimension to 10/10

Target: **10 on all six dimensions**, not an average. A 9.5 anywhere is not done.
Baseline from `review/consolidated-review.md`: **4.5 overall** — Positioning 4, Trust 3, Accessibility 5, Performance 5, Craft 7, Code 5.

The rubric is anchored so a score means the same thing in every round:

| Score | Means |
|---|---|
| 10 | Best-in-class; a peer would study it and copy the method |
| 9 | A trained eye finds almost nothing |
| 8 | Polished and intentional; only nits |
| 7 | Good with one noticeable flaw |
| 6 | Works and reads clearly, visible rough edges |
| 5 | Idea is there, execution distracts |
| 3-4 | Broken in places |
| 1-2 | Barely works, or reads as something else |

Each dimension is five criteria at 0-2 points. Every criterion with a number is measured, not judged.

---

## The honest constraint

Ten out of ten on all six is reachable, but only by **removing**, not adding. The site currently carries three audiences, two thin routes, 26 claims, 22 infinite animations and six decorative systems. Every phase below either deletes something or makes an existing thing provable.

If the owner wants to keep everything — both businesses, the Minecraft route, the blog newsletter, the film-prop sub-page palette — the ceiling is about 7.5, because those pieces contradict each other. Say so now rather than discovering it in phase 5.

---

## Phase 0 — Four decisions only you can make

Nothing else should start until these are answered. Each has a default if you do not care.

| # | Decision | Why it blocks | Default if unanswered |
|---|---|---|---|
| D1 | **One audience or two?** Dual track (Hire / Commissions) or developer-only with video as proof | Sets nav, hero, IA and half of phase 2 | Dual track, because the video work already exists and is billable |
| D2 | **Real photograph?** A headshot at 4:5, or keep an illustration | Feeds the `Person` schema image, the hero, and the "placeholder" finding | Keep illustration but commission a consistent one; never ship `profile-placeholder` |
| D3 | **Can you name a client and a price band?** Even one line: `Versova 4BHK · 3-day turnaround · from ₹X` | The commissions page cannot reach 10 without proof or a number | Name the niche, give a range, and say "contact for a quote" — do not leave it blank |
| D4 | **Which claims are you willing to drop?** `<35ms`, `<20MB`, `Pro in`, `2 years`, `17 months` | Trust cannot reach 10 while any survives unverified | Drop all five |

Write the answers at the top of this file before phase 1.

---

## Phase 1 — Trust floor (1 session)

Goal: a stranger can check every claim on the site and find nothing that contradicts it.

| Task | Files | Acceptance |
|---|---|---|
| `Get in touch` becomes a real `mailto:` anchor, address printed in the footer, copy demoted to a labelled secondary control that reports failure | `ContactDealButton.jsx:203-225, 307-313, 396-403`; `Footer.jsx:19-86` | Clicking opens a mail client; address is selectable text; no success toast without a successful copy |
| Availability becomes static text under the role line | `Hero.jsx:76-79`; `HeroPortraitCard.jsx:38, 130` | `Available for …` visible without hover, at 12px+, contrast ≥ 4.5:1 |
| WinPreview numbers match its README | `SelectedWorks.jsx:74, 82` | `<35ms` and `<20MB` gone; CMake pill gone |
| `Pro in Minecraft` and `Ranked Record` replaced with earned facts | `InterestsExperience.jsx:154`; `MinecraftExplorePage.jsx:171` | Every Minecraft claim has a profile link beside it, and the number on the page matches the profile |
| One tenure source, derived | `Hero.jsx:138`; `InterestsExperience.jsx:353, 35-54` | `17 months` and `2 years` both deleted; dates are the only statement |
| Newsletter either wired to a live endpoint or deleted | `BlogSubscribeForm.jsx`; `api/subscribe.js`; `vite.config.js:10-55` | Submitting a bad address shows an error; submitting a good one lands in Resend; `curl` of the endpoint on the live domain returns 200 |
| Status vocabulary fixed | `SelectedWorks.jsx:396-402` | `maintained` / `archived`; no archived card offers a live `Visit` |

**Gate:** a fresh subagent given only the site and permission to follow every outbound link reports **zero contradictions**. Re-run the claim table in `review/consolidated-review.md`; every row says MATCHES or is gone.

**Score after this phase:** Trust 3 → 8.

---

## Phase 2 — Positioning and IA (2 sessions)

Goal: each audience reaches its goal in two clicks from `/`.

| Task | Files | Acceptance |
|---|---|---|
| Add `<header>` with `Work · Video · Contact`, rendered on all five entries | `App.jsx:236`; new `Nav.jsx` | Every entry has the same nav; links work from sub-pages without going home |
| Hero names both jobs and offers two paths | `Hero.jsx:73-93` | Role line names video; a `Video commissions ↗` action sits beside `Get in touch` |
| Section labels become `h2` | `SelectedWorks.jsx`, `InterestsExperience.jsx:97, 189, 304, 348` | Outline is H1 → H2 → H3 with no skips |
| Commissions page gains an offer block: niche, three packages with price band, turnaround, one named client, one primary `Send a brief` | `VideoEditingExplorePage.jsx:695-805` | A prospect can answer "what do I get, how long, how much" without messaging |
| Commissions page defaults to the strongest sample, not the finance talking-head | `:184` | Default tab shows real-estate or brand work |
| Sub-pages get the footer and a sibling link | `VideoEditingExplorePage.jsx:842-844`; `MinecraftExplorePage.jsx:460-462` | No dead end; every page has an exit |
| Minecraft route: either three Modrinth projects with live links, or merged into an About line | `MinecraftExplorePage.jsx` | Route holds ≥ 3 substantial items, or the route is deleted |
| In-app navigation updates `document.title` and canonical | `App.jsx:123-180` | Opening any sheet changes the tab title and canonical to that route |
| Fix `pushState('/')` on close | `App.jsx:151-164` | One Back press leaves the site; no re-open loop |

**Gate:** two scripted click paths pass — `home → commissions → brief` and `home → project repo`, each in ≤ 2 clicks. A fresh subagent asked "what does this person sell, and how do I buy it" answers both correctly in one sentence.

**Score after this phase:** Positioning 4 → 9.5, and 10 once D3 is answered.

---

## Phase 3 — Accessibility to WCAG 2.2 AA and beyond (2 sessions)

Goal: axe reports zero violations, and a keyboard-only user can complete every path.

| Task | Files | Acceptance |
|---|---|---|
| `inert` the home canvas when a sheet is open; move focus in; restore on close; `aria-labelledby` the dialog | `App.jsx:231-235, 252-267` | One `H1` in the DOM at a time; Tab never lands on hidden content |
| Landmarks: `header`, `nav`, one `main`, `footer` outside `main` | `App.jsx:236-249`; `Hero.jsx:135` | Landmark list reads banner → navigation → main → contentinfo |
| Type and colour tokens: 12px floor, metadata `#6B6660`, status emerald-700 | `Hero.jsx:135`; `Footer.jsx:19, 91`; `SelectedWorks.jsx:397-401`; `HeroPortraitCard.jsx:103, 213` | 0 contrast failures; 0 styles under 12px |
| Target sizes: every control ≥ 24×24 | `VideoEditingExplorePage.jsx:612-623`; footer links | 0 controls under 24px; carousel dots 24px with a 6px visual dot |
| Tabs become a real tab set or lose the role | `VideoEditingExplorePage.jsx:391-419` | Arrow keys move between tabs; `aria-controls` resolves; panel announced |
| Captions or a stated "no dialogue" on every video | `VideoEditingExplorePage.jsx:435, 532` | `<track>` present or copy states silence |
| Reduced motion stops video, not just CSS | `InterestsExperience.jsx:130-232`; `ContactDealButton.jsx:58-83` | With `prefers-reduced-motion: reduce`, no video plays and the lerp loop does not run |
| 200% zoom reflow: blog pages scroll with the document | `index.css:119-128`; `PostPage.jsx:112-122` | At 200% text zoom no line is clipped and the article tail is reachable |
| Portrait and reel cards become real buttons with Enter and Space | `HeroPortraitCard.jsx:24-31, 114-121`; `VideoEditingExplorePage.jsx:522-529` | Enter and Space both activate |

**Gate:** `@axe-core/puppeteer` on all five routes × 1440/768/390 returns 0 violations; a manual keyboard pass (Tab, Shift-Tab, Enter, Space, Escape, arrows) completes every path; one screen-reader pass with NVDA or VoiceOver reads the page in a sensible order.

**Score after this phase:** Accessibility 5 → 10.

---

## Phase 4 — Performance to a budget (2 sessions)

Goal: a mid-range Android on 4G gets useful content in under two seconds.

| Budget | Target | How measured |
|---|---|---|
| JS transferred | ≤ 120 kB gzip total, icons ≤ 20 kB | `dist` sizes + gzip |
| First load before interaction | ≤ 400 kB | Lighthouse network |
| LCP (Moto G4, 4G throttle) | ≤ 1.8 s | Lighthouse / WebPageTest |
| CLS | ≤ 0.05 | Lighthouse |
| INP | ≤ 200 ms | field or traced interaction |
| Video before intent | 0 bytes | network log |

| Task | Files | Acceptance |
|---|---|---|
| Deep-import icons; delete the `manualChunks` lucide branch | `vite.config.js:89-97`; 10 import sites | Icon chunk ≤ 20 kB; AirPlay's path is absent from `dist` |
| Remove `autoPlay`; `preload="none"`; play on intent; pause offscreen | `InterestsExperience.jsx:130-232`; `VideoEditingExplorePage.jsx:435, 532` | 0 video bytes before hover/focus/scroll; only one decoder active |
| Re-encode `GixelMC.mp4` to a 5-8 s 480p loop and the 48.9 MB file to ≤ 2.5 Mbps 720p | `public/gallery/videos/` | Home video ≤ 500 kB; deployment ≤ 60 MB |
| Delete the duplicate prefetch | `index.html:133-138`; `App.jsx:77-89` | Each route image requested at most once, and only on intent |
| Portrait and backgrounds as AVIF/WebP with `srcSet` and dimensions | `public/profile-placeholder.svg`; `HeroPortraitCard.jsx:94-203`; `VideoEditingExplorePage.jsx:344` | Portrait ≤ 25 kB at 1x; no CLS |
| Drop permanent `will-change`; grain on the root; blur off moving video | `index.css:185, 259, 276`; `App.jsx:225-228` | No element holds `will-change` outside a transition |
| Pause decorative animation when the sheet is open or the tab is hidden | `App.jsx:219-222`; `index.css:389-440` | 0 animations run behind an opaque sheet |

**Gate:** a `review/checks/budget.cjs` script fails the build when any budget is exceeded, wired into CI. Lighthouse mobile performance ≥ 95 with the budgets above.

**Score after this phase:** Performance 5 → 10.

---

## Phase 5 — Craft to 10 (1-2 sessions)

Goal: a designer looking at the site finds nothing borrowed and nothing competing.

| Task | Acceptance |
|---|---|
| One art direction: keep paper + botanical branches; remove the film props, registration crosshairs, blueprint grid, and one of the three corner systems | A screenshot audit finds one visual language per page |
| Type system: 5 sizes (12/14/17/24/44), one mono for metadata only, no size used decoratively | Every size maps to a role; no 7-9.5px |
| Hierarchy: one entry point per screen, section labels at heading size, no two competing labels for one block | Squint test — the intended first read is the actual first read |
| Real identity asset replaces `profile-placeholder` everywhere, including schema | `grep profile-placeholder` returns nothing |
| Motion removal test: delete every animation that does not communicate state, causality or hierarchy | ≤ 6 animations total; all stop under reduced motion |
| Empty space earns its place: no sub-page ends at 23% of its height | Every route fills its height with content or is merged |
| Copy voice: no self-graded adjectives (`Good at`, `Pro in`, `Ultra-fast`), no `Vibe` in a credential slot | A grep for a banned-word list returns nothing |

**Gate:** two blind judges, given the site and the rubric but not this report, score craft independently. Take the lower. Both must say 10.

**Score after this phase:** Craft 7 → 10.

---

## Phase 6 — Code health and lock-in (1 session)

Goal: the site cannot silently regress.

| Task | Acceptance |
|---|---|
| One source of truth for claims, dates and page metadata | A claim edited in one file updates the card, the static fallback and the schema |
| Delete dead code: unused `BLOG_INDEX`, `kanji` values, duplicate subscribe logic, unused exports | `knip` or equivalent reports nothing |
| Reel/carousel state keyed by id, reset in the right order | Switching category never pauses a freshly mounted reel |
| Shared subscribe handler for dev and production, with validation, rate limit and env-only audience id | One file, two adapters, identical behaviour |
| Honest failure paths everywhere: clipboard, forms, network, video | Every failure shows a message and a retry |
| CI: axe, budget, link check, claim check, build | Four checks run on every push |
| Scorecard committed to the repo | `qa/portfolio/README.md` holds rubric, before/after, evidence, date |

**Score after this phase:** Code 5 → 10.

---

## Verification harness to build in phase 3-4

| Script | Checks | Fails when |
|---|---|---|
| `review/checks/a11y.cjs` | axe on 5 routes × 3 widths | Any violation |
| `review/checks/budget.cjs` | gzip JS, icon chunk, image sizes, video bytes | Over any budget |
| `review/checks/vitals.cjs` | LCP, CLS, INP on throttled profile | Over any budget |
| `review/checks/links.cjs` | Every outbound link and every claim link | Non-200, or a claim with no link |
| `review/checks/claims.json` | Claim text vs source text | Source disagrees |
| `review/checks/outline.cjs` | One H1, no skipped levels, landmarks present | Outline broken |

New dev dependencies: `@axe-core/puppeteer`, `lighthouse`, `knip`.

---

## Sequence and effort

| Phase | Sessions | Depends on | Cumulative score |
|---|---|---|---|
| 0 Decisions | 0 | — | 4.5 |
| 1 Trust | 1 | D4 | ~5.5 |
| 2 IA | 2 | D1, D3 | ~6.9 |
| 3 Accessibility | 2 | Phase 2 headings | ~7.8 |
| 4 Performance | 2 | — (parallel to 3) | ~8.5 |
| 5 Craft | 1-2 | D2 | ~9.5 |
| 6 Lock-in | 1 | phases 1-5 | 10 |

Total: **9-10 sessions**. Phases 3 and 4 can run in parallel because they touch different files.

---

## What will still stop you at 10

These are not code problems and no amount of refactoring fixes them:

1. **Trust needs a third party.** A named client, a testimonial with a face, a published benchmark, or a rank you have actually reached. Without one, the honest ceiling on trust is 9 — the site can be internally consistent but still self-referential.
2. **Craft needs real assets.** A placeholder portrait, a stock anime avatar, or a logo drawn by an agent caps craft at 8. One real photograph and one real brand mark lift it.
3. **Positioning needs a decision you keep.** If the site tries to serve hiring and commissions forever, both paths stay slightly compromised. Ten requires choosing which one the home page is for and giving the other a clean door.
4. **Performance needs asset discipline forever.** One 48 MB upload undoes phase 4. The budget check in CI is the only thing that keeps it.

---

## First three moves, if you want to start today

1. Answer D1-D4 at the top of this file. Nothing else unblocks.
2. Land phase 1 (one session, no redesign, highest trust return).
3. Run the claim table again with a fresh subagent — that single gate is what separates a 3 from an 8.
