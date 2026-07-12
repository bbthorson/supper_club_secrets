# Reader Experience Site — Protocol Phase 3

The public reading surface for *Supper Club Secrets*, per `protocol/ARCHITECTURE.md`
§13 (Phase 3) and `protocol/READER_EXPERIENCE.md`. An Astro static site with full
design control and no atproto dependency — the primary way readers meet the book.

**This is Milestone 1: the reading experience itself** — the menu, the reading
room, the canon horizon, and the redaction. The record-set lenses (Timeline
Explorer, character profiles, feeds, the shelf) are a later pass.

## Run

```sh
cd site
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run check    # astro + TypeScript diagnostics
```

## How it's wired

- **Reads the prose in place.** Chapters are a content collection loaded with a
  `glob()` loader pointing at `../stories/01. .../chapters/*.md` — single source
  of truth, no copy step (`src/content.config.ts`). A remark plugin
  (`src/lib/remark-strip-leading-headings.mjs`) drops the in-prose meal/chapter
  headings so the reading room can render its own from frontmatter.
- **Brand tokens, verbatim.** `protocol/brand/tokens.css` is imported directly
  (Vite `fs.allow` opens the repo root) — hex is never re-derived here. Fonts are
  self-hosted in `public/fonts/` (see that folder's README); no CDN.
- **The canon horizon** (`src/lib/horizon.ts`) is the core object: a per-reader
  bookmark in localStorage (`scs:progress`, versioned + per-book), monotonic by
  chapter number. The menu's "continue reading" and the redaction's auto-reveal
  both read it. A pre-paint head script (`src/lib/horizon-inline.ts`) applies the
  stored theme + progress with no flash. Designed to attach to an identity later
  with no change to this contract.
- **Redaction** (`src/components/Redaction.astro`) is the spoiler bar: manual
  click/keyboard reveal, plus horizon-driven auto-reveal via `data-revealed-by`.

## Pages

| Route | What |
|---|---|
| `/` | The menu — Book 1 as a four-course menu card, all 25 chapters |
| `/read/[chapter]` | The reading room — one page per chapter, day/night |
| `/404` | Off-menu |

## Deploy to Cloudflare Pages

The site is fully static (Astro SSG, no adapter), so Cloudflare Pages serves
`dist/` directly. The build reads files *outside* `site/` (brand tokens, chapter
prose), so Pages must clone the whole repo and build with the **root directory**
set to `site` — the parent dirs are then present at `../`.

**Git-connected (recommended — auto-deploys on push):**

In the Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git,
pick this repo (private is fine via the Cloudflare GitHub app), then set:

| Setting | Value |
|---|---|
| Production branch | `main` (or this branch while previewing) |
| Root directory | `site` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` (pinned by `site/.nvmrc`; or set `NODE_VERSION=22`) |

**Manual (Wrangler CLI — no Git connection):**

```sh
cd site
npm run build
npx wrangler pages deploy      # uses wrangler.toml (output dir = dist)
```

After the first deploy, update `site` in `astro.config.mjs` from the placeholder
to the real URL (`<project>.pages.dev` or a custom domain) so canonical/sitemap
URLs are correct.

## Deferred (next pass)

Timeline Explorer, horizon-gated character profiles, location/character feeds, the
CASE CLOSED shelf. These need three cheap, additive data changes in the pipeline
first (noted in the plan): populate chapter `publishDate`, add per-field
`revealedBy` provenance to `character.profile` records, and normalize a numeric
`firstRevealedChapter` onto `place`/`item` records.
