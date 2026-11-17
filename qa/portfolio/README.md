# Portfolio scorecard

Rubric, scores and evidence for codex.is-a.dev. Reviewed 16-17 November 2026.
Full findings: `review/consolidated-review.md`. Plan: `review/plan-to-10.md`.
Changelog: `review/CHANGELOG-phase1-2.md`.

## How to score

Each dimension is five criteria at 0-2 points, so every dimension is out of 10.
Score from rendered evidence and measurements, never from the code alone.
Re-run the scripts in `review/` before changing a score.

| Score | Means |
|---|---|
| 10 | Best-in-class; a peer would study and copy the method |
| 8 | Polished and intentional; only nits |
| 6 | Works and reads clearly, visible rough edges |
| 4 | Clearly broken or wrong in places |

## Current

| Dimension | Baseline | Now | Target | Blocking gap |
|---|---|---|---|---|
| Trust and proof | 3 | **8** | 10 | Needs a named client, testimonial or verified rank — third-party evidence |
| Positioning and IA | 4 | **8** | 10 | Minecraft route still thin; no price band (D3) |
| Accessibility | 5 | **8** | 10 | Captions need real transcripts; tab semantics incomplete |
| Performance | 5 | **8** | 10 | LCP on a throttled client-rendered page: needs a pre-rendered hero |
| Visual craft | 7 | **8** | 10 | Portrait is still an illustration; needs a real photograph |
| Code health | 5 | **8** | 10 | CI covers static gates only; no DOM/a11y test yet |

Overall: **4.5 → 8.0**.

## Verified evidence

| Check | Baseline | Now | Command |
|---|---|---|---|
| JS gzip | ~250 kB | 101 kB | `npm run build` |
| Icon chunk | 153.6 kB gzip | absent | `npm run verify` |
| Home first load | 4,090 kB | 830 kB | `review/prod-vitals.cjs` |
| Video before intent | 2,952 kB | 0 | `review/prod-vitals.cjs` |
| LCP desktop | 2,888 ms | 1,184-1,392 ms | `review/prod-vitals.cjs` |
| LCP throttled mobile (4x CPU, 4G) | not measured | 3.6-5.3 s, median ~4 s | `review/throttled.cjs` |
| CLS | 0 | 0.001 | `review/prod-vitals.cjs` |
| Deployment | ~190 MB | 75.0 MB | `npm run build` |
| Contrast failures (home) | 8 of 34 | 0 | `review/contrast-fixed.cjs` |
| Text under 11px | 7px-10.5px | none | `review/final-check.cjs` |
| Targets under 24px | 7-13/page | 0 | `review/final-check.cjs` |
| Console errors | — | 0 across 5 routes | `review/final-check.cjs` |
| Claims contradicted by sources | 3 | 0 | `npm run verify` |
| Videos playing under reduced motion | 6 | 0 | `review/verify-phase3.cjs` |

## Gates now enforced

`scripts/verify.mjs` runs in CI on every push and pull request. It fails the
build when: JS exceeds 120 kB gzip, an icon chunk reappears, `public/` exceeds
80 MB, any asset exceeds 20 MB, a retracted claim returns, type drops below
10px, the primary CTA loses its `mailto:`, or a `<video>` ships without
`preload` or with unconditional `autoPlay`.

## Open, deliberately

1. **Captions.** No `.vtt` files exist; generating them would invent content.
2. **Real photograph.** The hero still shows an illustration. Needs an asset.
3. **Client name and price band.** D3 remains unanswered; the commissions page
   says "reply with a quote" instead of inventing a number.
4. **Decorative art on mobile.** Shipping a smaller `<picture>` breakpoint for
   the botanical plates is the remaining LCP win, but it changes the look.
5. **Minecraft route.** One clip and one paragraph. Either three real Modrinth
   projects or fold it into About.
