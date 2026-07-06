# Extraction Pipeline — Protocol Phase 2

Re-runnable, read-only pipeline that turns finalized prose + tracking files into
validated record instances. This is the "repo → records" step from
[`../ARCHITECTURE.md`](../ARCHITECTURE.md) §4, and Phase 2 of the roadmap (§13):
**full extraction for a finalized Book 1.**

```sh
python3 protocol/pipeline/extract.py
```

Exit 0 = clean build (all records extracted, **every reference resolved through
the registry**). Exit 1 = a reference didn't resolve, a date is malformed, or a
record failed its lexicon schema. Runs on stock Python 3 — no dependencies.

## What it emits

Output goes to [`../records/book1/`](../records/book1/) (per-book layout; this
resolves open decision §12.5 — a series-wide merge is trivial later). `records/`
is **disposable build output** — the pipeline + `entities/` + `lexicons/` are the
source of truth; regenerate any time.

| File | Record type | Source | Count |
|------|-------------|--------|-------|
| `scenes.json` | `scene` (§6.4) | chapter frontmatter (date/place/participants/pov) + `timeline_ledger.md` (primaryEvent, simultaneous threads) | 25 |
| `character_state_events.json` | `character.stateEvent` (§6.2) | per-chapter `registers` frontmatter | 98 |
| `places.json` | `place` (§6.3) | `canon library/locations/*.md` + known schedule rules | 14 |
| `character_profiles.json` | `character.profile` (§6.1) | character files — reader-safe facts only, never prose wholesale | 7 |
| `items.json` | `item` (§6.5) | `subplot_threads.md` → "Jasper's bottle" | 1 |
| `custody_events.json` | `custodyEvent` (§6.5) | same — the Ch1→17→25 custody chain | 3 |

## How it stays honest

1. **Deterministic resolution.** Every character/place reference (scene
   participants + pov, stateEvent subjects, custody holders, place refs) is
   normalized and looked up in `../entities/entities.yaml` by the same parser
   the Phase 1 resolver uses. An unresolved reference is a build error, not a
   guess. One-off settings (road stops, "Distributed …" montage) and one-off
   people (Murph, etc.) come from `../entities/non_entities.yaml` and are handled
   explicitly — scene one-off settings are kept verbatim as `placeText`.
2. **Backdating.** Every time-anchored record sets `createdAt = storyDate`
   (§8), so a reader surface that honors `createdAt` sorts the story
   chronologically. Multi-day beats carry `storyDateEnd`.
3. **Schema-checked.** Each record is validated against its lexicon in
   [`../lexicons/`](../lexicons/) (required fields, `$type`, enums, id patterns,
   no stray fields) by a minimal built-in checker.

## Notes / scope

- **NSID `$type`** uses the `site.supperclub.*` placeholder from the
  architecture doc. The real namespace root is deferred to §12.1 and is only
  needed when/if records are published to atproto (Phase 4). Nothing here
  touches the network.
- **Profiles are minimal** — `oneLine` is extracted reliably; `personaPublic` /
  `keyContradiction` are left for a curated pass on which facts are reader-safe
  (§6.1), rather than dumping prose.
- This pipeline **generalizes the Phase 1 proof**
  (`../entities/extract_emma_stateevents.py`, Emma only) to the whole cast; that
  script is retained as the Phase 1 record of intent.
