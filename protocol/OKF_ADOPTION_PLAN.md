# OKF Adoption Plan — the inward knowledge layer

A phased plan to make the repo's knowledge layers conform to Google's **Open Knowledge Format** (OKF, v0.1). This is the *inward* half of the two-format architecture: OKF makes the canon agent-readable for authoring and continuity work; AT Protocol (`ARCHITECTURE.md`) is the *outward* half that publishes the narrative to readers. See [Alignment with the protocol layer](#alignment-with-the-protocol-layer).

**Status:** plan only. Not urgent. Sequenced for the protocol phase, after Book 1's back half is finished. Nothing here touches prose.

---

## Why
The canon is already 90% OKF-shaped: markdown files, a concept graph (characters ↔ locations ↔ antagonists ↔ books), an index (`00_book_metadata.md`), and a log (`CANON_CHANGELOG.md`). OKF formalizes the small set of conventions that make that bundle portable and machine-parseable, which directly serves the "AI production pipeline" in the protocol vision: any OKF-aware agent can consume the canon for drafting and continuity-checking with no bespoke parsing. The adoption cost is low because we're standardizing what already exists, not migrating.

## Scope
**In:** `canon library/`, `world building/`, `stories/*/tracking/`, the per-story bibles (`00_book_metadata.md`), and the changelog.
**Light only:** `stories/*/chapters/*.md` — prose stays prose; chapters get minimal frontmatter (the kind Ch13 already carries), and are NOT fragmented into "concepts."
**Excluded from the public-facing intent:** `tracking/interiority/*` stays private author notes (OKF has no privacy model — privacy here just means "it lives in a private repo").

## OKF v0.1 essentials we must honor
- One concept = one markdown file. **The file path is the concept's identity.**
- Exactly one required frontmatter field: `type`.
- Recommended queryable fields: `title`, `description`, `tags`, `timestamp`; `resource` where a canonical link exists.
- Body is freeform markdown.
- Concepts cross-link with normal markdown links → the directory becomes a graph.
- Optional `index.md` per directory (progressive disclosure) and `log.md` (chronological history).

---

## Project type vocabulary (controlled list)
OKF leaves the type vocabulary to the producer. Ours:

| `type` | Applies to |
|---|---|
| `Character` | `canon library/characters/*` |
| `Antagonist` | `canon library/antagonists/*` |
| `Location` | per-location files (see Phase C) |
| `Book` | per-book plan entries (see Phase C) |
| `SeriesPlan` | `series_plan.md` (overview/index) |
| `Guide` | `world building/*` (craft rules) |
| `Reference` | `glossary.md`, `group_dynamics.md` |
| `Continuity` | `continuity.md` |
| `StoryBible` | `stories/*/00_book_metadata.md` |
| `Chapter` | `stories/*/chapters/*` (prose, light) |
| `Tracking` | `character_matrix.md`, `timeline_ledger.md`, `subplot_threads.md` |
| `Interiority` | `tracking/interiority/*` (private) |
| `Template` | `00_character_template.md` |

## Frontmatter standard
```yaml
---
type: Character            # required
title: Emma Hartley        # recommended
description: Grounded chef learning to trust her instincts; Book 1 focal character.
tags: [supper-club, book1, focal]
timestamp: 2026-06-15T00:00:00Z   # last meaningful update
# optional / project-specific:
id: char.emma              # stable key — shared with the protocol layer (see below)
status: active
book: series-wide
resource: ../../stories/01. The Case of the Missing Hot Sauce/00_book_metadata.md
---
```
Keep it minimal. `type` is the only hard requirement; add the rest where it earns its place.

## Cross-linking & identity
- Replace prose references ("see locations_registry") with real relative markdown links, so the graph is machine-traversable.
- **The OKF file path is the concept's identity, and it should align with the protocol layer's stable IDs.** The `id:` field (e.g., `char.emma`) is the bridge: `entities.yaml` (protocol) maps `id → file path → eventual DID`. One identity, three views (human file, OKF concept, protocol record).

## index.md and log.md
- Add `index.md` to `canon library/`, `characters/`, `antagonists/`, `world building/`, `tracking/`, and (after Phase C) `locations/` and `books/`.
- `CANON_CHANGELOG.md` already functions as the canon `log.md`; either rename/symlink conceptually or keep it as the bundle's log of record.

---

## File-by-file mapping (current state: none have frontmatter)
- `characters/*.md` → `Character`; `antagonists/*.md` → `Antagonist`. Straight frontmatter add.
- `world building/0X_*.md` → `Guide`. Straight add.
- `glossary.md`, `group_dynamics.md` → `Reference`. `continuity.md` → `Continuity`.
- `series_plan.md` → `SeriesPlan` (becomes the index for per-book files after Phase C).
- `locations_registry.md` → today it's one file holding many places. **Decided (2026-06-15): split** into `canon library/locations/<slug>.md` (`type: Location`) + a `locations/index.md`, mapping 1:1 to the protocol `place` records (Phase C).
- `tracking/*.md` → `Tracking`; `tracking/interiority/*` → `Interiority` (private).
- `stories/*/00_book_metadata.md` → `StoryBible` (the story bundle's index).
- `stories/*/chapters/*.md` → `Chapter`, light frontmatter only; Ch13's existing block is the template.

---

## Phased plan
**Phase A — frontmatter in place (≈ half day).** Add the standardized frontmatter block to every knowledge file listed above, no restructuring. This alone makes the bundle substantially conformant. Highest value per effort.

**Phase B — graph + navigation (≈ half day).** Add `index.md` files; convert implicit references to real markdown links; confirm `CANON_CHANGELOG.md` as the log of record.

**Phase C — split aggregates (planned, 1–2 sessions).** Split `locations_registry.md` → per-`Location` files (`canon library/locations/<slug>.md`) and `series_plan.md` → per-`Book` files (`canon library/books/bookN.md`), each with an `index.md`; keep `series_plan.md` as the `SeriesPlan` overview. **Decided 2026-06-15** — the idiomatic OKF shape, maps 1:1 to the protocol `place` and book records. The most work of the phases, but committed.

**Phase D — validate (quick).** Check against the OKF SPEC conformance criteria; optionally run Google's reference HTML visualizer to view the canon as a graph. Pin the spec version we target.

---

## Alignment with the protocol layer
Two formats, opposite directions, shared identity:
- **OKF = inward.** Private, static, agent-readable knowledge graph for *producing* the work.
- **AT Protocol = outward.** Live, identity-owned, time-ordered records for *publishing* to readers.
- **Shared IDs.** The OKF `id:`/file path is the same stable key `entities.yaml` uses for protocol records.
- **Concept → record mapping.** `Character` concept → `character.profile` record; `Location` → `place`; the per-scene/event tracking → `scene`/`stateEvent`. Authoring happens in OKF; publishing projects selected concepts outward to ATProto.

## Guardrails
- Don't OKF-ify prose. Chapters get light frontmatter only; never fragment scenes into concepts.
- Keep the type vocabulary small and documented here; expand deliberately.
- **OKF is v0.1 and days old (published 2026-06-12).** Pin the spec version we conform to and expect change; it's just markdown conventions, so churn is cheap but real.
- This serves authoring and the AI pipeline. If it starts feeling like bureaucracy, stop.

## Open decisions
1. ~~Phase C now or later — split `locations_registry` and `series_plan`, or keep them aggregate?~~ **RESOLVED (2026-06-15):** split both. `locations_registry.md` → per-`Location` files under `canon library/locations/` (+ `locations/index.md`); `series_plan.md` → per-`Book` files under `canon library/books/` (+ `series_plan.md` retained as the `SeriesPlan` overview/index). Idiomatic OKF, and maps 1:1 to the protocol `place` and book records. Still sequenced for the protocol phase.
2. Finalize the type vocabulary above.
3. ~~Is `interiority/` part of the bundle (private) or excluded entirely?~~ **RESOLVED (2026-06-15):** `interiority/` is part of the internal tracking bundle (`type: Interiority`) — included for authoring and agent use, kept private, and never projected outward to the public AT Protocol layer.
4. Which OKF spec version to pin.

## Sequencing
After Book 1's back half; folded into the protocol phase. Phase A is a clean, self-contained first step whenever there's an afternoon for it.
