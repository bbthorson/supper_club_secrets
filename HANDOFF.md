# Handoff — Book 1 Work In Progress

Last updated: 2026-05-25

This is a working punch list for picking up Book 1 (*The Case of the Missing Hot Sauce*) on another machine. Decisions captured here are authoritative — update as you go.

---

## Decisions resolved this session

### Ch17 / Ch20 continuity → Option A
Ch17 puts Jasper on an Amtrak to Philly Thursday. Ch20 currently opens with him in "his chaotic apartment on Saturday morning" and a Tuesday afternoon McGolrick Park bench. Both contradict Ch17. Decision: **rewrite Ch20's opening to keep Jasper in Pennsylvania through the phone marathon.**

Also relevant: per canon, **Jasper lives in Chelsea (Manhattan)**, not Brooklyn. The McGolrick Park bench (Brooklyn) cannot be his Tuesday-afternoon location regardless of the PA fix. Replace with a roadside park bench, a motel parking lot, or strike the geography. The "Brooklyn skinny jeans" descriptor at line 59 is stylistic (city-coded) and can stay.

Unlocks: Ch17b "Lancaster County" mini-chapter (hotel/doubt beat).

### Emma's recurring intel source → the farmers market network
Not a single person. The markets themselves — McGolrick (Sunday only) and McCarren (Saturday only) — are Emma's standing source. Vendors come from across the boroughs and beyond; each is a different neighborhood's eyes and ears. Sherlock with Irregulars.

- Sofia (cheesemonger, single-scene Ch8) stays a useful neighborhood node, no longer the recurring locus.
- Dorothy, Ruth, and future vendors fit the same network frame.
- Distinct from Olivia's recurring source (Marcus / The Gilded Fern = boutique business gossip).
- Pending edit: add this frame to `canon library/locations_registry.md` (Markets section) and `canon library/series_plan.md`.

### Marcus — clarification
Marcus owns The Gilded Fern. He is **Olivia's** contact, not Emma's. Earlier framing of a "Marcus vs. Sofia" decision was incorrect.

### Elijah family weight → ambient texture only
No Book 1 payoff. Ch8 mother text and Ch14 sister-car work call are intentional background pressure. Full arc held for Book 3 (Elijah-focal). See `tracking/interiority/elijah_book1.md` for the detailed read.

---

## Decisions still open

### OnlyFans reveal — mechanic resolved, disclosure pattern pending
**Resolved:** The lawyers attack Emma's visible income (writing gigs). Publishers cite "character reference" without naming OnlyFans overtly. Coded surveillance — the reader and Emma can tell someone dug, but it's never said aloud.

**Pending:** Who does Emma confide in?

| Option | Effect |
|---|---|
| **Olivia-only** (recommended) | OnlyFans stays ambient menace. Group sees writing gigs die; Emma + Olivia privately track the next domino. Honors the "containing multitudes" theme. Sets up Book 2/3 thread. Requires reframing or relocating the Ch14 "market inefficiency monetized" Elijah line. |
| **Whole group** | One scene resolves it. Elijah's line lands as written. Group bonds further. Cleaner plot mechanics, but spends a thread you can't get back. |

Author leaning: undecided. Both have craft cost; Olivia-only has higher series value.

### Ch21b "Withdrawn" sample
~620-word mini-chapter drafted inline, not yet saved. Format question: filename `m4_21b_withdrawn.md`, YAML frontmatter, tracking updates. Hold for sign-off on format, slot, and prose before saving.

---

## Queued mini-chapters

Letter-suffix filename convention: `m4_21b_*.md`. Renumber consecutively at publication.

| Slot | Title | State | Gated on |
|---|---|---|---|
| Ch12b | Marcus, Monday (Olivia POV) | Sketched | OnlyFans decision |
| Ch13b | Killing the Squash Piece | Sketched | OnlyFans decision |
| Ch17b | Lancaster County | Unlocked, queued | None (Option A resolved) |
| Ch21b | Withdrawn | Drafted inline | Format sign-off |
| Ch22b | Monday Morning (coda) | Optional | Author preference |

---

## Open structural work in Book 1

- **Ch19 "The Counterpunch"** — placeholder, unwritten
- **Ch21 "The Turning Tide"** — placeholder, unwritten
- **Ch18 investor pullout mechanism** — on hold per author direction
- **Emma sidelined in Meal 4** — needs an active beat somewhere in Ch18 / 19 / 21
- **Ch20 opening rewrite** — see Option A above

---

## Scaffolding state (FYI, no pending work)

- `stories/_story_template/tracking/` complete: matrix, ledger, threads, interiority template, README
- `stories/_story_template/chapters/00_chapter_guide.md` has YAML frontmatter spec
- `canon library/locations_registry.md` has Canon Rules section (market days, travel times, hours)
- Book 1 tracking populated: timeline_ledger.md, character_matrix.md, subplot_threads.md, seven interiority docs (emma, elijah, noah, oliver, olivia, jasper, hank)
- `CANON_CHANGELOG.md` has 2026-05-23 entries logged

---

## Recent file changes (in the working diff)

Scaffolding:
- `stories/_story_template/` (entire directory — new)
- `stories/01. The Case of the Missing Hot Sauce/tracking/` (entire directory — new)
- `canon library/locations_registry.md` (Canon Rules section added)

Chapter edits:
- `m2_06_a_fine_sieve.md` — LLC filing date shifted to Oct 2
- `m2_12_coming_to_a_boil.md` — Dorothy seed paragraph added
- `m3_13_service_for_one.md` — YAML frontmatter, Dorothy encounter replaced with closed-market silence
- `m3_17_sharpening_the_knives.md` — Jasper packs the stolen bottle
- `m4_20_farm_to_table.md` — propulsion date fix, Noah conduit beat. **Opening still needs Option A rewrite.**
- `m4_22_family_meal.md` — anchor shift, bottle return restructure, Hank interior reckoning, Noah/Jasper conduit payoff, Brenda throwaway, Oliver "I'll go first" + Smithsonian seed observation

Character file rename:
- `brenda_chen.md` → `brenda_marquez.md` (git mv) plus heading and reference updates
- `canon library/characters/jasper.md` — Ch9 → Ch10 references corrected

Changelog:
- `CANON_CHANGELOG.md` — four 2026-05-23 entries

---

## First thing to do on the next machine

1. Decide OnlyFans disclosure pattern (Olivia-only vs. whole group)
2. Approve or revise the Ch21b "Withdrawn" inline draft → save as `m4_21b_withdrawn.md` if approved
3. Rewrite Ch20 opening per Option A
4. Add farmers-market-network note to `locations_registry.md` and `series_plan.md`
