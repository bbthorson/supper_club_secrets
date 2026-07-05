# Protocol Layer Architecture

How *Supper Club Secrets* projects to reader-facing surfaces — a public site first, the AT Protocol as one experimental lens — without changing how it is written.

**Status:** Draft for review. Nothing here is built yet. Book 1 reached a locked v1 on 2026-07-05, so the finalization gate (see [Dependency on Story Finalization](#9-dependency-on-story-finalization)) is now satisfiable — extraction and publishing can proceed whenever we choose to build them.

**Companion:** `OKF_ADOPTION_PLAN.md` covers the *inward* knowledge format (an agent-readable canon graph for authoring); this doc covers the *outward* published layer (records for readers). Two formats, opposite directions, shared identity.

---

## 1. Purpose

This document defines how the repo — the single source of truth — is **projected onto reader-facing surfaces**, and how the AT Protocol (the architecture behind Bluesky) fits in as *one* of those surfaces rather than the backbone.

We are exploring new and interesting ways to tell stories. **Not everything goes on the AT Protocol.** The model is *one source, many surfaces*:

- **A public site (e.g. Astro) is the primary reading experience.** Chapters — plus interactive lenses like a scrubbable timeline and location/character feeds — are rendered from the derived record set, with full design control and no dependency on any niche client. This is where the public information lives.
- **The AT Protocol is an experimental projection**, used only for what it is uniquely good at: characters as portable identities (DIDs) and the novelty of a story you can read *inside* a social feed — follow a character, watch their state change across the timeline, trace a clue's custody. A lens, not the distribution channel.

Both surfaces read from the same derived layer, so the choice of surface never re-derives the truth.

It answers one question: **what does the repo need so it can emit these projections, and what stays exactly as it is?**

The short answer: the creative layers do not change. We add one derived layer and one new authoring habit.

---

## 2. Core Principles

These are load-bearing. Every design choice below follows from them.

1. **The protocol layer is derived, never authored.** Records are generated from the prose and tracking files. No one writes a record by hand. If the story changes, records regenerate.

2. **The Golden Rule still holds.** Stories drive the canon. The pipeline reads finalized prose and emits records to match. Records never constrain or overwrite the writing. This inverts the common "AI pipeline" framing where structured state cages the prose. Here, prose is the source; records are the projection.

3. **The repo stays private; publishing is outward-only.** All planning, drafts, canon, and the interiority brain live here, in private. Publishing is a one-way compile step that pushes a curated subset outward — to the public site first, and to the AT Protocol projection optionally. Access control lives in our own surface layer, not assumed from the protocol (see §6.6).

4. **Privacy is a gradient already present in the folders.** Interiority never leaves. Chapters are public. The backstage group chat is gated — and because gating lives in our surface layer, "gated" means served through our own site with access control, or simply not emitted as public records. The repo structure already encodes who-sees-what.

5. **Author Mode / Scene Mode are unaffected.** The two operating modes govern writing. The protocol layer is downstream of both.

---

## 3. Layer Model

The existing three layers are unchanged. We add a fourth, derived layer.

```
world building/     Rules and patterns        (unchanged, never published)
canon library/      Facts and state           (unchanged, source for records)
stories/            The narratives            (unchanged, source for records)
protocol/           Derived projection layer  (NEW, generated)
```

The `protocol/` layer is a build output plus the schemas and scripts that produce it. It reads from the three creative layers and never writes back to them. Its derived record set feeds **both** the public site and the optional AT Protocol projection — the name is historical; think of it as "the derived layer," not "the atproto layer."

---

## 4. Directory Layout

```
protocol/
  ARCHITECTURE.md          This document
  lexicons/                NSID-namespaced schema definitions (JSON)
    character/
      profile.json
      stateEvent.json
    place.json
    scene.json
    item.json
    custodyEvent.json
    message.json
  entities/                Canonical ID registry
    entities.yaml          Stable IDs for every character, place, item
  records/                 Generated record instances (build output)
  pipeline/                Extraction and compile scripts (repo -> records)
  README.md                How to run the pipeline
```

`records/` is build output. It can be regenerated at any time and should be treated as disposable. `lexicons/` and `entities/` are committed source of truth for the protocol layer.

---

## 5. Lexicon Namespace (NSID)

AT Protocol identifies record types with reverse-DNS names (NSIDs), for example `site.supperclub.character.profile`. The namespace root must be a domain we control.

**Open decision:** which domain roots the namespace. The narrative is planned to be hosted via a `standard.site` publication, but the lexicon namespace should sit under a domain the project owns. Placeholder used throughout this doc: `site.supperclub.*`. This must be finalized before any lexicon is published, because the NSID threads through every schema and every record.

Where a community lexicon already exists, we reuse it rather than minting our own. *If* we project chapters onto atproto at all, they use **standard.site** — the shared long-form lexicon (`site.standard.publication` / `site.standard.document`) that Leaflet, pckt.blog, and Offprint converged on in 2026. Its whole premise fits our model: keep the content on our own site and *also* emit records so a chapter is portable and discoverable on atproto **without that being its reading surface**. The public site (e.g. Astro) remains the actual reading experience; standard.site records are an optional mirror.

Note that **Leaflet is a hosted editor built on this same lexicon, not a competing standard** — and because our chapters are generated from prose, we would emit `site.standard.document` records from the pipeline rather than author in Leaflet. We do not reinvent long-form publishing.

---

## 6. Record Types

How the repo's existing files project onto record types. The key insight: most of this data is already structured in the tracking files, so the work is extraction, not re-authoring.

| Repo source (today) | Record type | Extraction effort |
|---|---|---|
| `canon library/characters/*.md` | `character.profile` | Light. Needs frontmatter (see §7) |
| `stories/*/tracking/character_matrix.md` | `character.stateEvent` | Low. Already a date x character table |
| `canon library/locations_registry.md` | `place` | Low. Already structured, includes schedule rules |
| `stories/*/tracking/timeline_ledger.md` | `scene` | Low. Already date-pinned with anchor |
| `stories/*/tracking/subplot_threads.md` | `item` + `custodyEvent` | Medium. Powers clue-tracing |
| `stories/*/chapters/*.md` | Astro content (public read) + optional standard.site `document` record | Reuse the community lexicon for the atproto mirror |
| (to be written) backstage chat | `message` (gated) | New content, new schema |
| `stories/*/tracking/interiority/*.md` | **none, ever** | Author-only. Never published |

### 6.1 character.profile

Static identity. Drawn from the character markdown overview, personality, skills. Fields (sketch): `id`, `displayName`, `oneLine`, `personaPublic`, `keyContradiction`. The prose body of the profile is not published wholesale; only the structured facts intended for readers.

### 6.2 character.stateEvent

The backdated time-series. This is the feature that lets a reader watch a character change. One record per character per meaningful beat, sourced from `character_matrix.md` cells.

Fields (sketch): `subject` (character id), `storyDate` (the in-world date, e.g. 2026-10-04), `register` (`public` | `private` | `under-pressure` | a transition), `state` (the one-line emotional descriptor), `chapterRef`, `sceneRef`.

`createdAt` on the record is set to `storyDate` so the records sort chronologically on a reader surface that honors `createdAt` (see §8).

### 6.3 place

From `locations_registry.md`. Includes the operating-constraint rules (market days, shop hours) as structured fields, which lets a reader surface flag or display when a location is "open" on a given story date. Fields (sketch): `id`, `name`, `type`, `neighborhood`, `schedule`, `firstAppearance`.

### 6.4 scene

From `timeline_ledger.md` rows. One record per dated beat. Fields (sketch): `id`, `storyDate`, `chapterRefs`, `placeRef`, `participants` (character ids), `primaryEvent`, `simultaneousThreads`. This is the spine of the Timeline Explorer.

### 6.5 item + custodyEvent

The "trace a clue" mechanic. The hot sauce bottle in Book 1 has a tracked path (see `subplot_threads.md`, Jasper's bottle). `item` is the object; `custodyEvent` records each hand-off with a `storyDate` and a `holder` (character id). Reading the custodyEvent series ordered by date reconstructs the literal path of the clue.

### 6.6 message (gated)

The backstage layer. Group-chat posts that happen "between the lines." This content does not exist yet and is written separately from the chapters. **Privacy caveat:** records in a public PDS repo are public by default; atproto has no native private-records / access-control story. In the one-source/many-surfaces model this resolves cleanly rather than fighting the protocol: the backstage layer is served (if at all) through our own site with our own access control, and simply **not emitted as public atproto records**. Monetization-grade gating is deferred (per current direction). The rule of thumb: never publish backstage records to a public repo expecting them to be private.

---

## 7. Identity Model

This is the **one new authoring habit** the repo must adopt.

Today, entities are referenced by first name in prose and by filename slug as files. Records need stable, canonical identifiers that never change even when a display name or filename does.

**Phase 1 (local IDs):** every character, place, and item gets a permanent key in `protocol/entities/entities.yaml`, for example `char.emma`, `place.mcgolrick-market`, `item.heritage-bottle`. Entity markdown files carry an `id:` field in frontmatter so extraction is deterministic, not guesswork.

**Phase 2 (DIDs):** when we stand up the identity/PDS layer, each character maps to a DID. The local IDs become the stable internal key that maps to a DID. Modeling each character as its own DID is what demonstrates the portable-canon thesis (a character owns its records; multiple worlds can reference the same identity without forking the truth). A simpler interim option is one repo with multiple record collections; we can graduate to per-character DIDs later.

Frontmatter sketch for a character file:

```yaml
---
id: char.emma
displayName: Emma Hartley
status: active
---
```

The prose body below the frontmatter is unchanged.

---

## 8. Timestamps and Backdating

This determines whether the timeline mechanic works. It does, with one known edge.

- **`createdAt` is self-asserted.** A record's `createdAt` lives inside the record and clients may set any value. The protocol explicitly supports this for imports and migration. So a record dated to the story's October timeline is legitimate.

- **Backdating sorts correctly everywhere,** including the official Bluesky app, because Bluesky computes `sortAt` as the earlier of `createdAt` and `indexedAt`.

- **Future-dating is clamped in Bluesky's app, not in the data.** If `createdAt` is in the future, Bluesky's AppView falls back to `indexedAt` for sorting. The record still holds the real `createdAt`. Our own reader surface can sort by `createdAt` literally. This only matters if we depend on the Bluesky app to display the story in order, which we do not.

- **Project-specific note:** the Book 1 timeline is anchored to October 2026 (`timeline_ledger.md`: Week 1 Sunday = 2026-10-04). Relative to a publish before October 2026, those dates are in the *future* and would be clamped by Bluesky's app. For the eventual launch after that date, this is moot. For any pre-October demo, the reader must sort by `createdAt` directly.

- **Hard limit:** the `datetime` format targets the contemporary era. Far-past (pre-1970) and far-future (5-digit year) values should be rejected. Supper Club is contemporary, so this never bites here. (It is relevant to the decentralized D&D product with fantasy calendars, where in-world dates would be stored as a plain string field while `createdAt` carries a real ordering timestamp.)

---

## 9. Dependency on Story Finalization

**Book 1 reached a locked v1 on 2026-07-05.** Earlier drafts had open work (placeholder chapters, timeline-compression flags in Meals 3–4) that made publishing premature; that is now resolved. The principle still holds for every story: because records are derived from prose (Principle 1) and stories drive canon (Principle 2), publishing an unfinished story's records would bake in continuity the prose may still change.

**Rule:** no records are published from a story until its prose is locked. The pipeline is re-runnable by design, so we can extract against drafts for testing, but a published record set corresponds to a finalized story.

This sequencing also de-risks the build: we can develop and test the lexicons and extraction against Book 1's existing, well-structured tracking data while the story itself is being finished, then publish once it is locked.

---

## 10. The Publish Pipeline

A one-way compile: repo to records. Conceptually:

1. **Read** the creative layers: entity registry, character profiles (frontmatter + body), `character_matrix.md`, `timeline_ledger.md`, `locations_registry.md`, `subplot_threads.md`, chapters.
2. **Resolve** every name reference to a canonical ID via `entities.yaml`.
3. **Emit** records into `protocol/records/`, setting each record's `createdAt` from its `storyDate`.
4. **Validate** records against the lexicon schemas.
5. **Publish** (separate, gated step) to the PDS layer once a story is finalized.

Steps 1 to 4 run locally and safely against drafts. Step 5 is the only step that touches the network and is gated on finalization.

Reconciliation with the Golden Rule: extraction is read-only against prose. When the prose and an old record disagree, the record is wrong and is regenerated. The prose is never edited to match a record.

**Continuity benefit:** because every event record carries a `storyDate`, the generated record set doubles as a continuity check. Contradictory in-world timing surfaces as inconsistent dates — for example, a prop received "this morning" in one scene but referenced as given "yesterday" in another (a real slip found in Book 1, Meal 1). This is a concrete argument for anchoring events in the stream early.

---

## 11. Reader Surfaces (Downstream)

Out of scope for the first build, recorded here so the data model serves them later. All three are **renderings of the same record set** and can be built on the public site (e.g. Astro) first; the atproto versions are the optional experiment.

- **Book Mode:** clean sequential reading on the public site, rendered from the chapter files. Optionally mirrored as standard.site `document` records for atproto discoverability.
- **Timeline Explorer:** an interactive view over `scene`, `character.stateEvent`, `place`, and `custodyEvent` records. Scrub a calendar, inspect a character's state changing, trace the bottle's path, view a location's activity. Built as an Astro page over the record set for the public site — and/or, as the experiment, a custom atproto AppView reading the backdated records and sorting by `createdAt`.
- **Location / group feeds:** filter the same records by place or by character group. On the site this is just a filtered view; on atproto it's a feed generator — the "reconstitute posts around locations or people" demonstration, and the story-inside-a-social-feed novelty. Either way it mirrors the prose's feed-based POV model (`ai_instructions.md` §5): scenes are authored as feed events, so the projection is a direct mapping rather than a re-derivation.

The reader surfaces are renderings of the record set. They do not change the repo or the pipeline.

---

## 12. Open Decisions

Resolve these before building the corresponding piece.

1. **NSID namespace domain** (blocks: all lexicons). Which owned domain roots `*.character.profile` etc.
2. **Identity model for v1** (blocks: publish step). One repo with multiple collections, or per-character DIDs from the start.
3. **Public reading surface** (blocks: chapter publishing). Confirm the site stack (e.g. Astro) as the primary reader, and decide whether to *also* emit standard.site records for atproto discoverability — and if so, which PDS holds them.
4. **Backstage gating** (deferred). How `message` records are gated when monetization is taken up. Until then, they stay unpublished or reader-gated.
5. **Per-story vs series-wide records** (blocks: records layout). Whether `records/` is partitioned per book.

---

## 13. Phased Roadmap

- **Phase 0 — This document.** Lock principles and the open decisions above.
- **Phase 1 — Schema + extraction proof.** Define `character.stateEvent`, add the entity registry and frontmatter for one character (Emma), and extract her state series from `character_matrix.md` into validated records. Proves the spine end to end against real data, no network.
- **Phase 2 — Full extraction.** Remaining record types (profile, place, scene, item/custodyEvent) for a finalized Book 1.
- **Phase 3 — Public site (primary reader surface).** Render chapters and the record-set lenses (Book Mode, Timeline Explorer, location/character feeds) as a site (e.g. Astro). Full design control, no network/atproto dependency. This is the reading experience.
- **Phase 4 — AT Protocol experiment (optional).** Stand up identity/PDS and per-character DIDs, mirror chapters as standard.site records, and build feed generators / a custom AppView — the portable-identity and story-inside-a-social-feed lens. Additive to Phase 3, never a prerequisite for it.

Phase 1 can begin while a story is still being finalized, because it runs against existing tracking data and touches no network. Phases 3 and 4 are independent: the public site does not wait on the atproto work.

---

## Summary

No restructuring of the creative layers. One additive `protocol/` layer, one new authoring habit (stable IDs), and a re-runnable read-only pipeline that emits backdated records from finalized prose. The Golden Rule is preserved end to end: the story drives the data.
