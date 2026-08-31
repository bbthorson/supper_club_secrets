# Reader Experience Site — Protocol Phase 3

The public reading surface for *Supper Club Secrets*, per `protocol/ARCHITECTURE.md`
§11 (Reader Surfaces) and §13 (Phase 3). An Astro static site with full design control
and no atproto dependency — the primary way readers meet the book.

**This is Milestone 1: the reading experience itself** — the menu, the reading
room, the canon horizon, and the redaction. The record-set lenses (Timeline
Explorer, character profiles, feeds, the cellar) are a later pass.

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
  chapter number. The front door, the menu's "continue reading" and the
  redaction's auto-reveal all read it. A pre-paint head script
  (`src/lib/horizon-inline.ts`) applies the stored theme and picks the front-door
  panel with no flash. Designed to attach to an identity later
  with no change to this contract.
- **Redaction** (`src/components/Redaction.astro`) is the spoiler bar: manual
  click/keyboard reveal, plus horizon-driven auto-reveal via `data-revealed-by`.
- **Link previews** are Open Graph only (`og:*` in `Base.astro`) — X, Slack,
  iMessage, Discord and Bluesky all read those, so a parallel `twitter:*` set
  would be the same strings maintained twice. The card is `public/og.png`,
  rendered from `scripts/og-card.html` by `node scripts/make-og.mjs` so it is set
  in the real self-hosted faces from the locked tokens; edit the HTML, re-run,
  commit the PNG.

## Pages

| Route | What |
|---|---|
| `/` | The front door — the host stand: have you dined with us before, and the one way in that follows from the answer |
| `/cellar` | The series cellar — what's served, what's still laid down (`/shelf` redirects here) |
| `/books/[book]` | The menu — a book as a four-course menu card, every served chapter |
| `/books/[book]/read/[chapter]` | The reading room — one page per chapter, day/night |
| `/books/[book]/timeline` | The case timeline, drawn at your horizon |
| `/characters`, `/characters/[id]` | The regulars (series-scoped) |
| `/places`, `/places/[id]` | The neighborhood (series-scoped) |
| `/kitchen` | The colophon — how the book becomes the site, and how to make it forget you |
| `/404` | Off-menu |

`/` is deliberately **not** the menu. The site gates everything on how far you've
read, so the first thing it does is ask — and give something back for answering:
a place that's still yours when you come back, on a device that has never seen
you. Three panels ship in one document (stranger / seated / returning) and the
pre-paint script picks one before anything is painted. With no JavaScript the
greeting shows, which is true for everyone.

## standard.site (AT Protocol)

The series is a `site.standard.publication`; each chapter is a
`site.standard.document`. The records live on a PDS, so the site only owns the
two verification artifacts, both derived from `src/lib/standard-site.ts`:

| Artifact | Where |
|---|---|
| `/.well-known/site.standard.publication` | `src/pages/.well-known/[...file].ts` — the publication's AT-URI |
| `<link rel="site.standard.document">` | `Base.astro`, per chapter, via `ReadingRoom.astro` |

Both are **silent until configured**. With no DID the well-known route emits no
file at all and the link tag doesn't render — a placeholder AT-URI is a failed
verification, which is worse than an absent one on a standard built on proving
that a domain and a record belong together.

The identity exists — **`supperclubsecrets.bsky.social`**, recorded as `handle`
in `standard-site.ts`. Three steps are left, and `/data/standard-site.json`
reports which are still outstanding in its `unresolved` list:

1. **Resolve the handle to its DID** and set `STANDARD_SITE.did`. A handle can
   move between accounts, so the standard verifies against the DID and nothing
   here is derived from the handle:
   ```
   curl 'https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=supperclubsecrets.bsky.social'
   ```
2. **Set `STANDARD_SITE.publishedAt`** to the date the book went live. It's
   required on every document record, and drip serialization leaves the
   per-chapter `publishDate` frontmatter empty until a chapter is actually
   served — so without the fallback all 25 payloads carry a null.
3. **Create the records** on the PDS from the bodies at
   `/data/standard-site.json` — one `site.standard.publication`, then one
   `site.standard.document` per chapter — and paste the rkeys those writes
   return into `publicationRkey` and `documentRkeys`.

Nothing in this repo performs those writes: they need credentials for the
account, which don't belong in a static site's build.

Two decisions worth knowing about, both in `standard-site.ts`:

- **`includeTextContent` is off.** Putting the prose in the records publishes all
  twenty-five chapters as public data, which makes the canon horizon a
  website-only courtesy. Metadata federates; the prose stays here. Flip it on
  purpose or not at all.
- **Every document's `description` is the book's logline**, never a per-chapter
  summary — a description of Chapter 19 is a spoiler wherever it's syndicated,
  and the horizon can't reach into someone else's feed.

## Deploy to Cloudflare Workers

The site is fully static (Astro SSG, no adapter), so Workers serves `dist/`
straight from static assets — no Worker script, hence no `main` in
`wrangler.toml`. The build reads files *outside* `site/` (brand tokens, chapter
prose), so the build must clone the whole repo with the **root directory** set
to `site` — the parent dirs are then present at `../`.

**Git-connected (recommended — auto-deploys on push):**

In the Cloudflare dashboard → Workers & Pages → Create → Workers → Connect to
Git, pick this repo (private is fine via the Cloudflare GitHub app), then set:

| Setting | Value |
|---|---|
| Production branch | `main` (or this branch while previewing) |
| Root directory | `site` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node version | `22` (pinned by `site/.nvmrc`; or set `NODE_VERSION=22`) |

Unlike Pages, Workers does *not* share variables between build time and
runtime — set build vars on the build config, runtime vars on the Worker.

**Manual (Wrangler CLI — no Git connection):**

```sh
cd site
npm run build
npx wrangler deploy      # uses wrangler.toml ([assets] directory = dist)
```

After the first deploy, update `site` in `astro.config.mjs` to the real URL
(`<worker>.<account-subdomain>.workers.dev` or a custom domain) so
canonical/sitemap URLs are correct.

## Deferred (next pass)

Timeline Explorer, horizon-gated character profiles, location/character feeds, the
CASE CLOSED in the cellar. These need three cheap, additive data changes in the pipeline
first (noted in the plan): populate chapter `publishDate`, add per-field
`revealedBy` provenance to `character.profile` records, and normalize a numeric
`firstRevealedChapter` onto `place`/`item` records.
