# Protocol Layer Architecture

How *Supper Club Secrets* publishes to the AT Protocol without changing how it is written.

**Status:** Draft for review. Nothing here is built yet. The first story is not finalized, so no records should be published until the prose is locked (see [Dependency on Story Finalization](#9-dependency-on-story-finalization)).

**Companion:** `OKF_ADOPTION_PLAN.md` covers the *inward* knowledge format (an agent-readable canon graph for authoring); this doc covers the *outward* published layer (records for readers). Two formats, opposite directions, shared identity.

---

## 1. Purpose

This document defines how the repo projects its stories onto the AT Protocol (the architecture behind Bluesky) so that the narrative can be published as a living data network: characters as portable identities, locations and groups as feeds, a public chapter layer and a gated backstage layer, and a reader-facing timeline that can be scrubbed.

It answers one question: **what does the repo need so it can emit AT Protocol records, and what stays exactly as it is?**

The short answer: the creative layers do not change. We add one derived layer and one new authoring habit.

---

## 2. Core Principles

These are load-bearing. Every design choice below follows from them.

1. **The protocol layer is derived, never authored.** Records are generated from the prose and tracking files. No one writes a record by hand. If the story changes, records regenerate.

2. **The Golden Rule still holds.** Stories drive the canon. The pipeline reads finalized prose and emits records to match. Records never constrain or overwrite the writing. This inverts the common "AI pipeline" framing where structured state cages the prose. Here, prose is the source; records are the projection.

3. **The repo stays private; the network is the publish target.** All planning, drafts, canon, and the interiority brain live here, in private. Publishing is a one-way compile step that pushes a curated subset outward.

4. **Privacy is a gradient already present in the folders.** Interiority never leaves. Chapters are public. The backstage group chat is gated. The repo structure already encodes who-sees-what.

5. **Author Mode / Scene Mode are unaffected.** The two operating modes govern writing. The protocol layer is downstream of both.

---

## 3. Layer Model

The existing three layers are unchanged. We add a fourth, derived layer.

```
world building/     Rules and patterns        (unchanged, never published)
canon library/      Facts and state           (unchanged, source for records)
stories/            The narratives            (unchanged, source for records)
protocol/           Derived publish layer     (NEW, generated)
```

The `protocol/` layer is a build output plus the schemas and scripts that produce it. It reads from the three creative layers. It never writes back to them.

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

Where a community lexicon already exists, we reuse it rather than minting our own. Long-form chapters use the **standard.site** lexicon (the community schema for articles and blog posts, with content owned as records on the author's PDS). We do not reinvent long-form publishing.

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
| `stories/*/chapters/*.md` | standard.site document | Reuse community lexicon |
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

The backstage layer. Group-chat posts that happen "between the lines." This content does not exist yet and is written separately from the chapters. **Privacy caveat:** records in a public PDS repo are public by default. Monetization-grade gating is deferred (per current direction). Until that is designed, backstage records either stay unpublished or are gated at the reader layer, not assumed private by virtue of the protocol. Do not publish backstage records to a public repo expecting them to be private.

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

**The first story is not finalized.** Per the tracking files, Book 1's later meals still have open work (timeline compression flags in Meals 3-4, placeholder chapters). Because records are derived from prose (Principle 1) and stories drive canon (Principle 2), publishing records from an unfinished story would bake in continuity that the prose may still change.

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

Out of scope for the first build, recorded here so the data model serves them later.

- **Book Mode:** clean sequential reading. Chapters published as standard.site documents.
- **Timeline Explorer:** an interactive view over `scene`, `character.stateEvent`, `place`, and `custodyEvent` records. Scrub a calendar, inspect a character's state changing, trace the bottle's path, view a location's activity. This is a custom AppView reading the backdated records and sorting by `createdAt`.
- **Location / group feeds:** feed generators that filter the same records by place or by character group. This is the "reconstitute posts around locations or people" demonstration. This mirrors the prose's feed-based POV model (`ai_instructions.md` §5): scenes are authored as feed events, so the data projection is a direct mapping rather than a re-derivation.

The reader surfaces are renderings of the record set. They do not change the repo or the pipeline.

---

## 12. Open Decisions

Resolve these before building the corresponding piece.

1. **NSID namespace domain** (blocks: all lexicons). Which owned domain roots `*.character.profile` etc.
2. **Identity model for v1** (blocks: publish step). One repo with multiple collections, or per-character DIDs from the start.
3. **standard.site adoption details** (blocks: chapter publishing). Which standard.site-compatible app/PDS hosts the long-form records.
4. **Backstage gating** (deferred). How `message` records are gated when monetization is taken up. Until then, they stay unpublished or reader-gated.
5. **Per-story vs series-wide records** (blocks: records layout). Whether `records/` is partitioned per book.

---

## 13. Phased Roadmap

- **Phase 0 — This document.** Lock principles and the open decisions above.
- **Phase 1 — Schema + extraction proof.** Define `character.stateEvent`, add the entity registry and frontmatter for one character (Emma), and extract her state series from `character_matrix.md` into validated records. Proves the spine end to end against real data, no network.
- **Phase 2 — Full extraction.** Remaining record types (profile, place, scene, item/custodyEvent) for a finalized Book 1.
- **Phase 3 — Publish layer.** Stand up identity/PDS, adopt standard.site for chapters, publish the finalized record set.
- **Phase 4 — Reader surfaces.** Timeline Explorer and location/group feeds.

Phase 1 can begin while the first story is still being finalized, because it runs against existing tracking data and touches no network.

---

## Summary

No restructuring of the creative layers. One additive `protocol/` layer, one new authoring habit (stable IDs), and a re-runnable read-only pipeline that emits backdated records from finalized prose. The Golden Rule is preserved end to end: the story drives the data.
