# Serialized Publishing — Real-Date Release with a Canon Horizon

**Status:** design proposal (2026-09-01). No decision, nothing built. Companion to
`ARCHITECTURE.md`, `SPACES.md`, and `CHARACTER_WEIGHTS.md` — this doc takes the
"canon horizon" idea from §12.7 and applies it to *releasing Book 1 itself*.

## The idea

Book 1's internal calendar is **October 2–25, 2026** — and the real calendar is about
to be October 2026. The ledger's anchor (Week 1 Sunday = Oct 4, chosen 2026-05-23)
means every story date lands on the correct real weekday **this year only**: Oct 4,
11, 18, 25, 2026 are all real Sundays. Publish each chapter on the day it takes
place, and the book happens in real time.

Alongside the prose, the record layer publishes on the same clock: as each chapter
goes live, the character stateEvents, scene records, and place records *derived from
that chapter* publish to the lexicon. Readers (and anything built on the AT Protocol
data) watch the characters' states update as the story unfolds — the "internal
register → published lexicon" split the author asked for.

## The two lanes (this is the whole design)

| Lane | Contents | Where it lives | Gate |
|---|---|---|---|
| **Internal register** | Tracking layer (`character_matrix`, `timeline_ledger`, `subplot_threads`, `interiority/`), codex secrets, chapter frontmatter's authorial metadata (clues, beats, audit notes), full compiled records | This repo, never published | — |
| **Published lexicon** | Prose chapters + reader-safe records derived from *published* prose | PDS / site | **Canon horizon**: a record publishes iff its `storyDate` ≤ horizon date, and only reader-safe fields |

Two invariants, both already house rules extended one step:
1. **Horizon rule:** nothing derived from an unpublished chapter is visible. The
   horizon only moves forward (monotonic) — an un-publish is a breaking event, not a
   normal operation.
2. **On-page rule:** a published record may contain only facts a reader of the
   published chapters could know. This is the Golden Rule's public face: prose is
   truth, and *published* prose is the only truth readers get.

## What's already safe vs. what leaks (verified against `records/`, 2026-09-01)

- **`character.profile`** — safe as-is. Compiled profiles carry `oneLine` bios only
  (checked: Emma's record has no secrets; the codex files' secrets don't compile out).
- **`character.stateEvent`** — safe *at horizon*. Each event has `storyDate`,
  `register`, and a `state` string derived from chapter frontmatter; the states
  describe on-page beats, including sanctioned feed-excursion dramatic irony (e.g.
  Brenda's Ch10 "recognizes the LLC; warns Jasper" — the reader of Ch10 knows this).
  Gate by `storyDate` and they publish clean.
- **`scene`** — **leaks.** Two fields are authorial metadata, not reader knowledge:
  `beat` (Save-the-Cat labels — Ch12's "Midpoint / False Victory" tells a serialized
  reader the victory is false *on the day they read it*) and `primaryEvent` (compiled
  from `beat_purpose`, which routinely names the reversal being seeded). **Fix:**
  the publish profile either omits `beat`/`primaryEvent` or replaces `primaryEvent`
  with a reader-safe `summary` field authored per chapter. Omission is the safe v1.
- **`place`** — safe, with one check: location files carry `blurbPublic` (already a
  public/private split); publish `blurbPublic`, not `Details`. Gate first appearance
  by horizon (Meadowlight's record must not exist before Oct 20).

## Mechanism (small, and mostly exists)

Pinakes already compiles everything with `storyDate`/`createdAt` stamped. The new
piece is a **publish profile** — a filter over compiled records, not a new compiler:

```
pinakes compile                        # full internal records (unchanged)
publish --horizon 2026-10-11           # → records where storyDate ≤ horizon,
                                       #   spoiler fields stripped, pushed to PDS
```

Whether that's a Pinakes flag or a ~50-line script over `records/` is an
implementation detail; the script version needs nothing from the Pinakes repo.
Editorial revisions after release (like today's pass) flow naturally: re-edit →
recompile → re-publish at the current horizon; AT Protocol records are mutable by
rkey, so corrections propagate.

## The release calendar falls out of the story

- **Oct 1 (Thu)** — launch: front matter, cast profiles (`oneLine` bios), the
  standing places (markets, shops). No story yet.
- **Oct 2 (Fri)** — the one dated fact in the book: LLC #2847's filing. Publishing
  *the antagonist's paperwork* as the first record, two days before Ch1, is the kind
  of teaser this architecture gets for free.
- **Oct 4 (Sun)** — Meal 1: Ch1–5 (one Sunday, one drop).
- **Oct 5–11** — Meal 2, one chapter a day, Mon–Sun.
- **Oct 12–16** — Meal 3, Mon–Fri (crisis week).
- **Oct 16–20** — Meal 4's road-and-campaign run (Ch18–24; note Ch18/19 share Friday,
  Ch20/21 share Saturday — decide same-day double drops vs. splitting).
- **Oct 21–24** — deliberately quiet (off-page in the book; the feed goes quiet too,
  which *is* the story beat).
- **Oct 25 (Sun)** — Family Meal. Finale.

**Year-dependence warning:** this alignment is unique to 2026. Oct 4, 2027 is a
Monday; a later launch means either floating the story's dates (a canon change) or
dropping the weekday alignment. If real-date publishing is wanted, **this October is
the window**, and the decision needs to be made with roughly Oct 1 lead time.

## What this is not (boundaries carried over from prior decisions)

- **Not a spaces build.** Per §12.6, spaces stay unused while alpha. The gated lane
  (private/under-pressure register facets, backstage) is future work; v1 publishes
  only the public, on-page-derived records above. The `register` field ships as
  *data about the character*, not as an access gate.
- **Not character weights.** §12.7's checkpoints would be horizon-versioned too, and
  this pipeline is the substrate they'd sit on — but nothing model-facing is in scope.
- **Interiority never leaves, in any lane.** Unchanged.

## Open questions for the author

1. Same-day multi-chapter days: drop together, or stagger by time of day (frontmatter
   has `time:` fields — Ch1–5 could release morning→late evening across Oct 4)?
2. Does prose publish on the same surface as records (site/ reads from the PDS), or
   does the site publish prose and the PDS carry records only?
3. Reader-safe `summary` per scene (more work, richer feed) vs. omitting
   `primaryEvent` entirely (safe, thinner) for v1?
4. Is Oct 2's LLC-filing teaser in — and if so, as a `scene`-less standalone record
   or a site post?
