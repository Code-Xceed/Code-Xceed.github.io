# Portfolio

Personal portfolio for **Aditya Rathore** — full-stack developer and video editor.
Built with React 19 and Vite, with a hand-drawn Japanese paper art direction and
static entry points for each section.

[![verify](https://github.com/Code-Xceed/portfolio/actions/workflows/verify.yml/badge.svg)](https://github.com/Code-Xceed/portfolio/actions/workflows/verify.yml)

![Portfolio home page](.github/screenshot.webp)

The site has five entry points, all pre-rendered as static HTML and then hydrated:

| Route | Content |
|---|---|
| `/` | Hero, selected work, creative pursuits, experience, footer |
| `/interests/video-editing/` | Commission page: reels by niche, client contact, brief |
| `/interests/minecraft/` | Speedrunning clip, Modrinth work, other games |
| `/blogs/how-i-started/` | Written note |
| `/blogs/how-i-got-my-first-client/` | Written note |

## Stack

- **React 19** with Vite 8 (rolldown) and five HTML entries
- **Tailwind CSS v4** for styling, with a small set of paper/texture tokens in `src/index.css`
- **lucide-react** for icons, tree-shaken
- **Puppeteer** (dev only) for the repository's verification scripts
- No runtime state library, no router package — routing is a small resolver in `src/App.jsx`

## Structure

```
.
├── .github/
│   ├── workflows/                 # CI: verify, and dispatch-only Pages deploy
│   ├── is-a-dev/codex.json        # domain record for the is-a.dev pull request
│   ├── screenshot.webp            # README preview
│   └── social-preview.png         # 1280x640 repository social preview
├── blogs/*/index.html             # pre-rendered blog entries
├── interests/*/index.html         # pre-rendered section entries
├── public/                        # images, video, icons, sitemap, robots
├── scripts/
│   ├── verify.mjs                 # budgets and banned-content gate
│   ├── check-assets.mjs           # every referenced asset must exist in dist
│   └── send-blog-update.js        # manual newsletter send (Gmail SMTP)
├── src/
│   ├── components/                # one component per section or surface
│   ├── App.jsx                    # route resolver, sheet, focus and scroll handling
│   ├── index.css                  # tokens, texture, motion
│   └── post.jsx                   # standalone blog entry
├── index.html
├── vite.config.js
└── package.json
```

## Development

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/
npm run preview    # serve the production build
npm run verify     # quality gates (run after build)
```

## Quality gates

`npm run verify` fails the build when any of these regress:

| Gate | Budget |
|---|---|
| JavaScript | ≤ 120 kB gzip total, no separate icon chunk |
| `public/` payload | ≤ 80 MB, no single asset over 20 MB |
| Retracted claims | must not reappear in source or the SEO fallback |
| Type floor | no text below 10px |
| Primary action | must remain a real `mailto:` |
| Video loading | `preload` required, unconditional `autoplay` forbidden |

`node scripts/check-assets.mjs` additionally verifies that every asset referenced
by the built HTML, CSS and JS actually exists in `dist/`.

`node scripts/check-seo.mjs` verifies, for all five entry points: title and
description length, canonical and `og:url` agreement, `og:image`, a single `h1`,
and the required JSON-LD types (`Person`, `ItemList`, `CollectionPage`,
`BlogPosting`, `BreadcrumbList`). It also checks that `robots.txt` points at the
sitemap and that every page appears in it.

The same gates run on every push and pull request via `.github/workflows/verify.yml`.

## Deployment

The build is a plain static bundle. `public/CNAME` is intentionally **absent**
until `codex.is-a.dev` resolves: with it present, GitHub Pages redirects the
`github.io` URL to a domain that does not exist yet, so nothing is reachable.

### 1. Publish on GitHub Pages

The repository must be named `<owner>.github.io` for the site to serve at the
domain root. Otherwise Pages serves at `/<repo>/` and every root-absolute asset
path breaks.

1. Settings → rename the repository to `Code-Xceed.github.io`.
2. `git remote set-url origin https://github.com/Code-Xceed/Code-Xceed.github.io.git`
3. Settings → Pages → Source: **Deploy from a branch** → `gh-pages` / **(root)**.
4. Push to `main`. `deploy.yml` builds, runs the gates, and force-pushes `dist/`
   to `gh-pages`; Pages then rebuilds from that branch.
5. Confirm `https://code-xceed.github.io/` renders the full site.

Branch publishing is used instead of `upload-pages-artifact` because the Pages
API refuses to create a site for a repository whose Pages came from a branch,
and `GITHUB_TOKEN` cannot convert it.

### 2. Claim the subdomain

`.github/is-a-dev/codex.json` is the record to submit to
[`is-a-dev/register`](https://github.com/is-a-dev/register) as
`domains/codex.json`. Merge it before touching the custom domain.

### 3. Attach the custom domain

After the record resolves (`nslookup codex.is-a.dev` → `code-xceed.github.io`):

1. Restore `public/CNAME` containing `codex.is-a.dev`.
2. Rebuild and run the **deploy** workflow.
3. Settings → Pages → Custom domain → `codex.is-a.dev`, then tick **Enforce HTTPS**.

Until then the site stays reachable on `code-xceed.github.io`, which is what the
domain application needs as its preview URL.

There is no newsletter backend. Each note ends with a `mailto:` so the promise
in the copy is one a static site can keep.

## Adding content

| To add | Edit |
|---|---|
| A project card | `PROJECTS` in `src/components/SelectedWorks.jsx` |
| A blog post | `POSTS` in `src/components/blogPosts.jsx` plus an entry HTML file |
| A video or reel | `CATEGORIES` in `src/components/VideoEditingExplorePage.jsx` |
| Experience or a hobby line | `EXPERIENCES` / card copy in `src/components/InterestsExperience.jsx` |
| Navigation | `src/components/Nav.jsx` |

Keep the claims on a card checkable. Every number should be traceable to the
linked repository or removed.

## Accessibility and performance

- WCAG 2.2 AA contrast, measured; a 10px minimum type size; 24px minimum targets.
- The section sheet is a real modal: the page behind it is `inert`, focus moves in
  on open and returns to the trigger on close, and one Back press leaves the site.
- `prefers-reduced-motion` stops every video, not only CSS animation.
- No video bytes before intent; poster-first previews.
- Images are WebP with `srcset` where it matters; decorative mobile art is
  downscaled rather than shipped full size.

## License

[MIT](LICENSE) © Aditya Rathore
