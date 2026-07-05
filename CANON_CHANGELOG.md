# Canon Changelog

A running log of significant changes to canon — location names, character facts, timeline adjustments, or any edit that touches multiple files. This helps track what changed, why, and where.

---

## 2026-07-05 — protocol/ARCHITECTURE.md reframed: one source, many surfaces

**Decision:** The AT Protocol is **one experimental projection, not the publishing backbone.** Reframed the architecture doc around *one source (the repo), many surfaces*:
- A **public site (e.g. Astro) is the primary reading experience** — chapters plus the record-set lenses (Book Mode, scrubbable Timeline, location/character feeds), full design control, no niche-client dependency.
- The **AT Protocol projection is optional/experimental**, reserved for what it's uniquely good at: characters as portable DIDs and reading a story *inside* a social feed.
- **standard.site** (the shared long-form lexicon Leaflet/pckt.blog/Offprint converged on in 2026) is the chosen schema **only for the optional atproto mirror of chapters**, not the reader surface; **Leaflet** is a hosted editor on that lexicon, not needed since chapters are generated from prose.
- The **gated-backstage tension resolves**: access control lives in our own site layer; backstage content is served with our own gating or simply not emitted as public records (atproto is public-by-default).
- Phases 3 (public site) and 4 (atproto experiment) are now **independent** — the site never waits on the protocol work. Also refreshed the §9 finalization gate (Book 1 is now v1-locked).

Single-file change (`protocol/ARCHITECTURE.md`); no story canon affected.

---

## 2026-07-05 — Meal 4 mini-chapters promoted to full chapters; Book 1 renumbered to 25

**Trigger:** Author decision — the three short Meal 4 "From the Road" interludes (`m4_18a`, `m4_19a`, `m4_19b`) should be full chapters. This resolves F4 from the 2026-06-25 linter pass (orphan chapters). Book 1 is now **25 chapters** (Meal 4 = 18–25).

**Renumbering (files renamed via `git mv`, headings updated):**

| Old | New | File |
|---|---|---|
| 18 | 18 | `m4_18_turning_up_the_heat` (unchanged) |
| 18a | **19** | `m4_18a_the_diner` → `m4_19_the_diner` (The Ridgeline Diner) |
| 19 | **20** | `m4_19_the_counterpunch` → `m4_20_the_counterpunch` (prose heading "Ghost Kitchen") |
| 19a | **21** | `m4_19a_the_drive_in` → `m4_21_the_drive_in` (The Starlite Drive-In) |
| 19b | **22** | `m4_19b_the_dive` → `m4_22_the_dive` (Murph's) |
| 20 | **23** | `m4_20_farm_to_table` → `m4_23_farm_to_table` |
| 21 | **24** | `m4_21_the_turning_tide` → `m4_24_the_turning_tide` (prose heading "The Proof") |
| 22 | **25** | `m4_22_family_meal` → `m4_25_family_meal` |

**Reference updates (all chapter refs remapped 19→20, 20→23, 21→24, 22→25):** `00_book_metadata.md` (chapter list + structure table + counts + status), `chapters/00_story_outline.md` (Meal 4 sections + beat sheet + timeline; three new road-chapter subsections added), `chapters/00_meal_summaries.md` (structure bullets), `tracking/character_matrix.md` (rows renumbered + rows added for Ch19/21/22), `tracking/subplot_threads.md` (Jasper arc rows added), `tracking/timeline_ledger.md` (road-trip rows tagged 19/21/22), `tracking/interiority/*.md`, and canon (`glossary.md` untouched here; `books/book1.md`, `locations/meadowlight-collective.md`, `characters/hank.md`, `characters/marcus_gilded_fern.md`).

**Also fixed (pre-existing numbering errors surfaced during the pass):** `hank.md` had "Farm to Table" as Ch17 and "Family Meal" as Ch18 → corrected to Ch23 / Ch25 (by title); `marcus_gilded_fern.md` goat-cheese/heroes ref → Ch25; `meadowlight-collective.md` `first_appearance` → Ch23. Counts updated to 25 chapters / ~38,600 words in `book_metadata` and `book1.md`; both statuses set to **v1 complete**.

**Titles resolved:** the cooking-metaphor prose titles **"Ghost Kitchen" (Ch20)** and **"The Proof" (Ch24)** are canonical (prose wins over the old outline names "The Counterpunch" / "The Turning Tide"). Files renamed to match (`m4_20_ghost_kitchen.md`, `m4_24_the_proof.md`); metadata and outline reconciled.

---

## 2026-07-05 — Structure cleanup + opaque-secret reconciliation pass (completed)

**Trigger:** Repo-structure review. Book 1 prose was locked as v1 ("finalizing v1 of book 1", 2026-06-22) on the opaque-secret / economic-squeeze direction (decided 2026-06-15), but the **verification/reconciliation pass never finished** — many canon/tracking/outline files still described the *superseded* OnlyFans-exposure plot, contradicting the finalized prose (a Golden Rule violation). Also cleaned up stale planning docs and build artifacts.

**Structural cleanup:**
- Deleted the 5 committed `.epub` build artifacts and added `*.epub` to `.gitignore`.
- Deleted `HANDOFF.md` (2026-06-15 punch list — every item resolved) and the entire `stories/01…/revision/` folder (5 working docs for the now-complete revision). Git preserves history.
- Updated `00_book_metadata.md` Status → **v1 complete**: removed the "Ch19/Ch21 unwritten" claims, refreshed counts (~38,600 words; noted the 18a/19a/19b mini-chapters), rewrote Status & Open Issues to list only optional polish.

**Canon/tracking reconciliation (prose wins; docs updated to match):** scrubbed the superseded framing — the C&D "exposing"/naming Kinky Kitchen, Emma's whole-group confession in Ch14, and the account going "public" in Ch22 — and reframed to current canon: secret stays **opaque/deferred** (never named on the page), villain leverage is an **economic squeeze**, and the intimate beat is Emma **privately confiding her precarity to Olivia** (Ch14). Files:
- `canon library/continuity.md` — "Public Knowledge: OnlyFans is now public" section and Emma's row rewritten.
- `canon library/glossary.md` — Kinky Kitchen entry (opaque/deferred); also fixed a stale **LLC #2847 date (Oct 18 → Oct 2)** that the 2026-06-25 linter pass missed.
- `stories/01…/characters/the_mogul.md` — was a wholly superseded antagonist profile (unnamed, never-on-page, OnlyFans leverage, "Brenda Chen"); **rewritten as a thin story-scoped stub pointing to the canonical `antagonists/book1_garrett_pike.md`**.
- `stories/01…/chapters/00_meal_summaries.md` and `00_story_outline.md` — exposure/confession/public beats reframed; Ch19/Ch21 titles filled in (The Counterpunch / The Turning Tide); beat-sheet B-story updated.
- `stories/01…/tracking/timeline_ledger.md`, `character_matrix.md`, `subplot_threads.md` — OnlyFans-weaponization / group-confession / public-aftermath rows reframed; B-plot retitled to "Emma's financial precarity"; stale `[PLACEHOLDER CHAPTER]` markers cleared for the now-drafted Ch19/Ch21.
- `stories/01…/tracking/interiority/emma_book1.md` and `elijah_book1.md` — reframed the Ch14 confide, the Ch22 aftermath, and the reveal/withhold table to the opaque-secret direction (interiority still privately knows the secret; only the on-page mechanics changed).

**Also fixed:** "Brenda Chen" → "Brenda Marquez" in `the_mogul.md` (surname changed 2026-04-07).

**Verified:** no chapter *prose* contained the superseded beats (the finalized Ch13 C&D names no secrets; Ch14 is a private Olivia confide) — the drift was entirely in the derived/meta layer. `series_plan.md` and `canon library/characters/emma.md` were already reconciled (no change needed).

**Not changed (flagged for author):** the remaining craft "action needed" flags in `tracking/` (Sofia silence, Emma's Meal 4 beat); the `_story_template` chapter-guide example line that still uses "Kinky Kitchen is known to the mogul" as an illustration.

---

## 2026-06-25 — Continuity-linter pass: two date fixes (tracking-vs-prose drift)

**Trigger:** Dry-run of a continuity linter (plotted-arc rules) against Book 1, using the tracking files as the data layer. Two errors surfaced where a derived tracking file contradicted the locked prose; both fixed story-driven (prose wins, tracking updated).

**What changed:**

1. **LLC filing date — stale tracking citation (`subplot_threads.md` Ch6).** The Ch6 main-mystery row still read "filed Oct 18" and cited evidence "Filed on October 18th…" — a quote that no longer exists in the prose. The 2026-05-23 anchor shift (Oct 18 → Oct 2) updated the chapter prose (`m2_06:35` reads "Filed on October 2nd—exactly two days after Hank had given up his stall") and `timeline_ledger.md`, but `subplot_threads.md` was missed. Now corrected to "Oct 2" with the citation matching the prose verbatim.

2. **Ch16 date typo (`character_matrix.md`).** The Ch16 row read "Wed Oct 14 → Thu Oct 29 (overnight)" — a 15-day overnight that breaks the timeline chain into Ch17 ("Thu Oct 15"). Corrected to "Thu Oct 15."

**Verified clean:** no residual "October 18"/"Oct 18" LLC references remain (the surviving "Oct 18" hits are the legitimate anchor-history note in `timeline_ledger.md` and Ch20's in-world story dates); zero "Oct 29" references remain.

**Files touched:**
- `stories/01. The Case of the Missing Hot Sauce/tracking/subplot_threads.md` — Ch6 LLC date + citation
- `stories/01. The Case of the Missing Hot Sauce/tracking/character_matrix.md` — Ch16 date typo
- `CANON_CHANGELOG.md` — this entry

**Open items surfaced by the linter pass (not changed now):**
- **F4 — orphan chapters.** `m4_18a` (the diner), `m4_19a` (the drive-in), `m4_19b` (the dive) exist as prose but appear in no tracking file (not in the outline spine, `character_matrix`, or `subplot_threads`). Decide: fold into the spine + tracking, or mark as intentional interstitials.
- **F5 — unresolved threads at Ch22.** Sofia's silence (last status Ch13 `complicated` → `dropped`, unannotated) and Emma sidelined in Meal 4 (`AT RISK`) both lack a terminal status. (Already tracked in `subplot_threads.md` → "Threads at risk.")
- **F7 — Ch20 date span disagreement.** `character_matrix` says Ch20 runs Sat Oct 17 → Tue Oct 20 (Hank found Oct 20); `timeline_ledger:31` and `revision/meal_4_scaffold.md` say Sun–Mon Oct 18–19. Days-of-week are valid in both, so this is an author call on which days Jasper's search spans, not a typo. Prose doesn't pin it (Ch20 is placeholder-adjacent). Left for author.

---

## 2026-06-15 — OKF Phase C: split locations and series plan into per-concept files

**Trigger:** OKF adoption decision (split aggregates into one concept per file). See `protocol/OKF_ADOPTION_PLAN.md`.

**What changed:**

1. **Locations split.** `canon library/locations_registry.md` → per-`Location` files under `canon library/locations/` (13 locations) plus `locations/index.md` (rotation table, geography facts, hard schedule/travel rules). Each location file embeds its own operating rule. `locations_registry.md` is now a redirect stub so existing references still resolve.

2. **Series plan split.** `canon library/series_plan.md` → per-`Book` files under `canon library/books/` (`book1.md`–`book6.md`). `series_plan.md` retained as the `SeriesPlan` overview/index (series frame, locked decisions, book index, cross-book threads, open questions).

3. **OKF frontmatter** added to all new files (`type`, `title`, `description`, `tags`, `timestamp`, `id`). `id` values align with the protocol layer (`place.*`, `book.*`).

4. **Reconciliations made during the split (story-driven):**
   - Book 1 entry (`book1.md`) updated to the opaque-secret direction: economic squeeze, Pike on-page, Emma confides in Olivia, secret deferred (no OnlyFans exposure/confession/going-public).
   - Cross-book Secret-Progression table: Emma's row changed to "secret income source (opaque), deferred to a later book."
   - Book 6 reveal note adjusted (Emma's secret is NOT revealed in Book 1, so Jasper's is the series' first full secret payoff).
   - Fixed a pre-existing canon slip: Jasper's apartment is **Chelsea**, not Bushwick (Books 4 & 5 entries referenced Bushwick).

**Still pending (verification pass):** `continuity.md` after-Book-1 state, the tracking files, and `00_book_metadata.md`/outline re-sync — unchanged here.

---

## 2026-06-15 — Book 1 direction: keep Emma's secret opaque; Meal 1 decisions

**Trigger:** Tier 2 meal-level pass, Meal 1. Author decisions.

**Decisions:**

1. **Emma's secret income stays opaque throughout Book 1 (major direction change).** The reader and the group never learn what it is. The developer's retaliation lands as **lost assignments and dried-up revenue** (economic pressure), not exposure. Emma **confides in Olivia privately** (not a group confession). The full reveal is **deferred to a later book**. The underlying canon fact (the secret itself) is unchanged in `emma.md`; only its Book-1 revelation changes. Emma's *on-page* vulnerability in Book 1 becomes her shame over the dramatic Bistro Lavande exit and her gig-economy precarity, confided privately to Olivia; the secret income is the opaque deeper layer beneath it. **Supersedes** the prior arc (C&D note exposing "Kinky Kitchen" in Ch13, group confession in Ch14, goes public in Ch18).

2. **Bottle timeline fix (Ch2):** "gave it to me yesterday" → "this morning" (Ch1–5 are all Sun Oct 4). Flagged by the author as a validation case for the activity-stream/feed model, which would catch such `storyDate` contradictions automatically.

3. **Plant Garrett Pike on-page seed in the Ch1 market scene** (Tier 1 #4), to set up his later on-page appearance.

**Documented now in:**
- `stories/01. The Case of the Missing Hot Sauce/00_book_metadata.md` — logline, premise, B-story section, seeds
- `stories/01. The Case of the Missing Hot Sauce/revision/tier2_meal_level.md` — Meal 1 findings
- `world building/04_writing_guide.md` — B-plot line
- `protocol/ARCHITECTURE.md` — continuity-check note
- `CANON_CHANGELOG.md` — this entry

**Downstream to reconcile during the back-half rewrite (NOT changed yet):**
- `canon library/continuity.md` — remove the "Emma's OnlyFans is now public" end-state; reflect opaque + Olivia-only
- `canon library/characters/emma.md` — lore tracking (drop the Ch12 C&D-references-secret, Ch13/Ch14 confession, Ch18 public beats; add opaque + confides in Olivia). Keep the Secrets section (underlying truth).
- `canon library/series_plan.md` — Book 1 "Secret Addressed" line and the after-Book-1 "Public Knowledge" note
- `tracking/character_matrix.md` — the Ch14 "confesses about Kinky Kitchen" beat
- `tracking/timeline_ledger.md` — C&D / OnlyFans-intel / confession references
- Chapters `m3_13`, `m3_14`, `m4_18` — the exposure / confession / goes-public beats

---

## 2026-06-15 — Feed-based POV rule adopted (replaces "Emma-only" framing)

**Trigger:** Book 1 tier-1 high-level pass surfaced that the stated POV rule ("Emma is the only POV, no mind-reading") contradicted the draft (Meal 2's solo single-character chapters; per-character interiority files). Author confirmed the redefinition.

**What changed:** POV is now a **feed-based model**. Every scene belongs to a feed (a place or a character's thread). Emma's feed is the spine; limited excursions into other feeds are allowed and create deliberate dramatic irony; meals are convergence points where feeds surface into group knowledge; no head-hopping within a scene. This mirrors the protocol layer's locations/characters-as-feeds model, so prose written to feeds projects cleanly to records later.

**Files touched:**
- `ai_instructions.md` — §5 rewritten; §8 red line updated
- `world building/04_writing_guide.md` — POV & Perspective section rewritten
- `protocol/ARCHITECTURE.md` — cross-link added (location/group feeds ↔ prose POV)
- `stories/01. The Case of the Missing Hot Sauce/revision/tier1_high_level.md` — decision #2 records the rationale
- `CANON_CHANGELOG.md` — this entry

---

## 2026-06-15 — Book 1 metadata finalized (story bible created, headline facts reconciled)

**Trigger:** Phase 1 of the current work plan — finalize Book 1's canonical metadata before light planning of Books 2–6 and the Book 1 text revision.

**What changed:**

1. **New canonical story bible:** Created `stories/01. The Case of the Missing Hot Sauce/00_book_metadata.md` as the single source of truth for Book 1 story-level facts (logline, premise, four-meal map, chapter list with one-line summaries, counts, status, arc, secret, full cast, locations, series position, open issues).

2. **Corrected headline facts (story drives canon):** Verified against the actual chapter files. Book 1 is **22 chapters** (5/7/5/5) and **~37,400 words**, not the "18 chapters / ~33,400 words" previously recorded. Status changed from "COMPLETE" to "DRAFT — revision pending": Meals 1–2 are tight, Meals 3–4 need revision, and Ch19 (145 words) and Ch21 (161 words) are stubs.

3. **Secret-reveal chapter corrected:** The OnlyFans reveal sequence is C&D exposure in Ch13, Emma's confession to the group in Ch14, public by Ch18. `series_plan.md` previously said "revealed to the group in Ch. 13," which conflicted with the story layer (`meal_summaries`, `timeline_ledger`, `character_matrix` all place the confession in Ch14).

**Files touched:**
- `stories/01. The Case of the Missing Hot Sauce/00_book_metadata.md` — new file
- `canon library/series_plan.md` — Book 1 header, status line, secret line
- `README.md` — Book 1 status note
- `CANON_CHANGELOG.md` — this entry

**Flagged for the Book 1 revision phase (not changed now):**
- `canon library/characters/emma.md` lore tracking has chapter references that appear off by one against the current 22-chapter numbering (e.g. C&D listed at Ch12 and confession at Ch13, vs. Ch13/Ch14 in the story layer). This looks like a residue of the earlier 18-chapter numbering. Defer a full chapter-reference audit of the character files until the prose is finalized, since the stub chapters (19, 21) and compression fixes will shift numbering further.

---

## 2026-05-23 — Ch22 small additions + Elijah family weight decision

**Trigger:** Author yes/no responses to the docket questions.

**What changed:**

1. **Oliver unprompted observation added (Ch22):** During Hank's family-history beat, Oliver volunteers the Smithsonian seed archive fact — Fish Peppers were listed as critically endangered in 1991, and Hank's family is likely one reason the variety still exists. Quiet, sourced, classically Oliver. Hank "really looks at him for the first time all night." Carries the Ch15 emergence forward as a second voluntary contribution alongside "I'll go first."

2. **Brenda throwaway line added (Ch22):** Slotted into the Noah/Jasper apology scene. Jasper notes that he texted Brenda when the C&D was withdrawn and she hasn't replied. "Some bridges you don't get to fix on your own timeline." Single line, easily redirected when Books 2-6 plans are finalized.

3. **Elijah's family financial weight — decision:** Author chose intentional ambient texture over Book 1 payoff. The existing Ch8 mother text and Ch14 sister's car beat stay as background pressure; no additional Book 1 payoff added. Thread is held for Book 3 (Elijah's focal book + credit union asset-stripping mirrors family precarity). The Ch8/Ch14 beats are no longer flagged as dropped — they're framed as ambient pressure that resolves later.

**Files touched:**
- `stories/01. The Case of the Missing Hot Sauce/chapters/m4_22_family_meal.md` — Oliver observation + Brenda line
- `stories/01. The Case of the Missing Hot Sauce/tracking/interiority/elijah_book1.md` — ambient-texture framing
- `stories/01. The Case of the Missing Hot Sauce/tracking/subplot_threads.md` — Elijah thread reframed, audit summary updated
- `CANON_CHANGELOG.md` — this entry

**Pending author input (still on docket):**
- The three load-bearing decisions (OnlyFans hold, Sofia's role, tiny propulsion chapters)
- Ch17/Ch20 Jasper-in-PA continuity issue (see flag below)
- Marcus vs. Sofia recurring-source comparison
- Dorothy in-person at Ch22 (decision: text-only, hold reunion for Book 2)

---

## 2026-05-23 — Anchor shift, Brenda rename, Ch22 substantial edits, conduit pattern, bottle arc

**Trigger:** Author review of the inconsistency audit (see prior 2026-05-23 entries). This batch addresses the explicit-direction items: LLC date shift, Brenda Chen → Marquez file rename, Dorothy Ch22 reconciliation, Oliver Ch22 voluntary contribution, Noah/Jasper conduit pattern, Jasper's stolen-and-returned bottle, next-week propulsion signal.

### Story anchor shift

1. **LLC #2847 filing date:** Ch6 changed from "October 18th" → "October 2nd."
2. **Story calendar anchored:** Week 1 Sunday = **2026-10-04** (was Oct 18). All chapters slide back two weeks.
3. **Ch20 Hank dinner promise:** "two weeks from Sunday" → "this Sunday." Compresses the search-to-dinner gap from ~13 days to 5 days, raising stakes and aligning the timeline.
4. **Ch22 opening:** "Two weeks later" → "The following Sunday." Resolves the "October night" continuity issue. Final dinner now lands Sun Oct 25 (October ✓).
5. **Ch22 internal:** "formally withdrawn four days after the story went viral" → "three days" (matches the new tighter timing).
6. **Tracking files updated:** `timeline_ledger.md`, `character_matrix.md`, `m3_13` frontmatter — all dates re-anchored.

### Brenda Chen → Brenda Marquez

7. **File renamed:** `brenda_chen.md` → `brenda_marquez.md` (`git mv`).
8. **File heading updated:** `# Brenda Chen` → `# Brenda Marquez`.
9. **Notes section corrected** ("Her last name is Chen" → "Her last name is Marquez").
10. **`00_character_overviews.md` reference updated** to point to the new file and use the current surname.
11. **Jasper lore tracking updated:** Ch. 9 references corrected to Ch. 10 (post-renumber).

### Dorothy Ch22 reconciliation (option b — text)

12. **Ch22 morning text** added. Dorothy texts Emma explaining the man at the market on Sunday and Tuesday, the threat to her stand, apologizing for the silence, committing to a chestnut honey delivery next week. Emma replies with an open invitation. Adds the reflection: "the fear didn't end when the threat did. It just changed shape."

### Jasper's stolen-and-returned bottle (new planted twist)

13. **Ch17 packing scene:** Jasper takes the original "just in case" bottle from Emma's counter on his way out of the emergency dinner. Wraps it in a sock and packs it. Reflects: "if he was going to ask a man to come back to the place that had broken him, he needed proof in his hand that the bottle had already done what the bottle was for."
14. **Ch20 greenhouse scene:** Jasper shows Hank the bottle as proof the sauce has already lived in other people's kitchens. Hank's later (Ch22) reflection anchors his decision to return on this moment.
15. **Ch22 arrival:** Hank arrives empty-handed; Jasper is the one holding the bottle. He returns it to Emma with an explicit apology for taking it. Emma sets it back on her counter "right where it had lived since Ch1."
16. **Ch22 final image** updated: "The bottle was back on her counter where it had started." The bottle's full arc closes where it started.

### Noah/Jasper conduit pattern

17. **Ch20 inserted beat:** After getting the Meadowlight address, Jasper texts Noah (not the group) — asks him to keep the lead private. Reflects on why Noah specifically: "Noah had told him he was the liability and then gone quiet, and somehow that quiet had felt like the cleanest thing in the room."
18. **Ch22 apology rewritten:** Noah's apology now references the conduit explicitly. "You kept texting *me* about it. Not the group — just me. I didn't know what to say back, so I didn't say anything, which is exactly the same thing I was mad at you for doing the other night. So I'm sorry twice." Jasper's response adds: "If I texted the group I'd get five opinions on a hotel reservation. I needed one person who wouldn't try to fix it."

### Oliver Ch15 emergence carried forward (small dose)

19. **Ch22 added beat:** During the "rotate hosting" discussion, Oliver volunteers unprompted: "I'll go first." "Next Sunday. Our place. I'll figure out the menu." Olivia repeats it ("Next Sunday") and the group commits. This carries the Ch15 voluntary-speech beat forward without dramatic shift.

### Hank's interior reckoning

20. **Ch22 storytelling beat added:** Hank explains what changed his mind, anchored on the bottle. "I'd given the bottle away — I just hadn't lived with what that meant. *Just in case.* Turns out the case was you all." His grandmother's line "a recipe wasn't yours until other people had it" is the through-line.

### Next-week propulsion signal

21. **Ch22 final lines** updated: "The first mystery was solved. The hot sauce vendor was home. The bottle was back on her counter where it had started. And next Sunday, somebody else would be doing the dishes. / The Supper Club was just getting started." Anchors next Sunday explicitly and ties to Book 2's Oliver-hosts premise per series_plan.md.

### Subplot threads tracker — closures

22. **`tracking/subplot_threads.md`** updated with resolutions for: Dorothy reconciliation (paid off), Jasper's bottle (new thread, closed), Noah/Jasper conduit (resolved), Oliver Ch15 carry-forward (resolved small dose), Jasper Ch22 reversion (resolved as earned), Hank's return decision (resolved/motivated). Still open: Sofia's silence, Emma OnlyFans emotional aftermath (pending OnlyFans-hold decision), Emma sidelined in Meal 4, Elijah's family weight (pending discussion).

**Files touched:**
- `stories/01. The Case of the Missing Hot Sauce/chapters/m2_06_a_fine_sieve.md` — LLC date
- `stories/01. The Case of the Missing Hot Sauce/chapters/m3_13_service_for_one.md` — frontmatter dates
- `stories/01. The Case of the Missing Hot Sauce/chapters/m3_17_sharpening_the_knives.md` — bottle theft
- `stories/01. The Case of the Missing Hot Sauce/chapters/m4_20_farm_to_table.md` — Hank dinner promise + Noah text conduit
- `stories/01. The Case of the Missing Hot Sauce/chapters/m4_22_family_meal.md` — opening, Dorothy text, bottle reveal, conduit apology, Hank reckoning, Oliver volunteers, final image
- `stories/01. The Case of the Missing Hot Sauce/characters/brenda_marquez.md` — renamed, heading fixed, notes corrected
- `stories/01. The Case of the Missing Hot Sauce/characters/00_character_overviews.md` — Brenda reference updated
- `stories/01. The Case of the Missing Hot Sauce/tracking/timeline_ledger.md` — re-anchored
- `stories/01. The Case of the Missing Hot Sauce/tracking/character_matrix.md` — dates + Ch17, Ch20, Ch22 rows updated
- `stories/01. The Case of the Missing Hot Sauce/tracking/subplot_threads.md` — multiple threads closed, new bottle thread added, audit summary updated
- `canon library/characters/jasper.md` — Ch. 9 → Ch. 10 references
- `CANON_CHANGELOG.md` — this entry

**Open items deferred to next round:**
- Ch12 → Ch13 visible-machinery beats (Marcus reports stranger, Emma's editor cancels article) — also raises the OnlyFans-hold question
- Ch13 Tuesday anchored scene (possibly tiny propulsion chapter)
- Sofia's role (farmers-market info-source idea) and Ch22 inclusion
- Elijah's family financial weight (single beat + Book 3 seed)
- Ch17 non-Brooklyn scenery expansion (Jasper's hotel night, doubt beat)
- Ch18 investor pullout mechanism (HOLD per author)
- Ch19 and Ch21 placeholder chapters (write or restructure)
- Emma sidelined in Meal 4 — active beat in Ch18/19/21

---

## 2026-05-23 — Dorothy cold beat moved Ch13 → Ch12 (canon market rule fix)

**Trigger:** Original Ch13 had Emma walking to McGolrick on Wednesday noon and encountering Dorothy at her stall. The newly added canon rule (McGolrick is Sunday-only) flagged this as impossible. Author also recognized the craft opportunity: planting the intimidation seed in an earlier chapter as ambiguous texture, payoff in Ch13.

**What changed:**

1. **Ch12 (Coming to a Boil)** — Added a paragraph at the start (after the opening line) showing Emma's Sunday morning McGolrick stop. Dorothy is at her usual spot but already busy with a customer Emma doesn't recognize — "a man in a coat that didn't fit the Sunday-morning McGolrick crowd." Dorothy's smile is "the practiced kind." Emma drifts off, dismisses the briskness, buys sage two stalls down, goes home to cook. Reads as background texture in context; reads as planted seed on reread.

2. **Ch13 (Service for One)** — Removed the Wednesday market encounter (canon violation) and the Dorothy cold beat. Replaced with:
   - Emma walking toward McGolrick out of habit on Wednesday, finding the market closed (which she knew), standing in the empty space longer than she needed to.
   - Emma texting Dorothy from the walk home. Message delivers, no read receipt comes. The silence joins Sofia's in Emma's chest. The temperature-drop metaphor preserved as the chapter's closing beat.

3. **Tracking files updated:**
   - `character_matrix.md` — Ch12 row gained Dorothy seed; Ch13 row updated to reflect text silence rather than in-person encounter; minor character tracker updated.
   - `subplot_threads.md` — Dorothy thread reorganized. Ch12 seed row inserted. Ch13 row updated to "silence" status. New "Canon rule fix log" note added.
   - `timeline_ledger.md` — Oct 25 row notes morning + evening; Oct 26-28 rows updated to reflect closed-market walk rather than market encounter; Pike's people visible at McGolrick on Sunday morning added as off-page thread.

4. **Ch13 frontmatter updated** to reflect new locations and characters present.

**Why this is better than the original:**

- Canon-legal (Sunday market visit, closed midweek walk).
- Plants the intimidation seed during the false-victory chapter, where the reader is celebrating with the characters and likely to miss the warning.
- Pairs Dorothy's silence with Sofia's in Ch13, doubling the pre-C&D dread instead of dividing it across two encounter types.
- Strengthens the "Pike's machinery is moving" off-page texture by giving the corporate world a *visible* presence at McGolrick a full three days before the C&D arrives.

**Files touched:**
- `stories/01. The Case of the Missing Hot Sauce/chapters/m2_12_coming_to_a_boil.md`
- `stories/01. The Case of the Missing Hot Sauce/chapters/m3_13_service_for_one.md` (prose + frontmatter)
- `stories/01. The Case of the Missing Hot Sauce/tracking/character_matrix.md`
- `stories/01. The Case of the Missing Hot Sauce/tracking/subplot_threads.md`
- `stories/01. The Case of the Missing Hot Sauce/tracking/timeline_ledger.md`
- `CANON_CHANGELOG.md` — this entry

**Open item:** Dorothy still needs a Ch22 reconciliation moment. See `subplot_threads.md` → Dorothy → "Action needed (still open)." Recommended option (b): text reconciliation morning of Ch22.

---

## 2026-05-23 — Tracking scaffolding introduced; Book 1 retrofit

**Trigger:** Meal 3–4 timeline frayed and character interiority felt thin. Goal: build scaffolding that scales across all six planned books and catches inconsistencies before they propagate.

**What changed:**

**New scaffolding (template + Book 1 retrofit):**

1. **Chapter frontmatter spec** added to `stories/_story_template/chapters/00_chapter_guide.md`. Every chapter now begins with a YAML block carrying: chapter, title, meal, beat, day, ISO date, time, location, POV, characters_present, registers (per character in scene), clues (planted / revealed), threads (active / touched), beat_purpose, and optional audit_notes. Strippable at epub build time.

2. **`stories/_story_template/tracking/`** directory created with templates for:
   - `character_matrix.md` — chapter × character snapshot, one row per chapter, register + one-line state per cell
   - `timeline_ledger.md` — every chapter pinned to a date, simultaneous events, compression audit
   - `subplot_threads.md` — every thread tracked chapter-by-chapter with status (introduced / developing / complicated / paid off / dropped / carry forward); includes a "Threads at risk" audit section
   - `interiority/` subdirectory with `00_interiority_template.md` — per-character per-book internal arc (opening state, hidden tension, what cracks open, what shifts, voice register map, reveal/withhold ledger, risks and tells, threads they carry forward)
   - `README.md` — workflow spec for how the four files relate and when to update each

3. **Canon Rules section** added to `canon library/locations_registry.md`. Hard rules covering:
   - Farmers market schedules (McGolrick: Sunday only; McCarren: Saturday only)
   - Sofia's cheese shop hours (closed Mondays)
   - The Gilded Fern hours
   - Elijah's workplace schedule (Sunday work signals deadline)
   - NYPL Rose Reading Room hours (closed Sundays)
   - Jasper's 311 shifts (flexible)
   - Travel times between key locations (Brooklyn ↔ Manhattan, McGolrick ↔ McCarren, Brooklyn ↔ Meadowlight, Brooklyn ↔ Philly)
   - Rule: "If a scene violates one of these, the scene is wrong — not the rule."

**Book 1 retrofit (populated tracking files):**

4. **`stories/01. The Case of the Missing Hot Sauce/tracking/`** populated with:
   - `timeline_ledger.md` — all 22 chapters anchored. Calendar anchor: Week 1 Sunday = 2026-10-18 (selected because Ch6 states LLC #2847 was filed on Oct 18, and Oliver finds it the Monday after Week 1 dinner). Seven specific compression/gap issues flagged with proposed resolutions.
   - `subplot_threads.md` — all threads catalogued. Surfaced dropped/at-risk threads: Sofia silence (Ch13 → never resolved), Emma's OnlyFans emotional aftermath (Ch22 outcome reported but not felt), Emma sidelined in Meal 4 execution, Elijah's family financial weight (introduced Ch8/14 then dropped), Noah's reconciliation with Jasper (happens offstage), Oliver's Ch15 emergence not carried to Ch22, Jasper's Ch22 reversion (intentional vs. undercooked), Hank's decision to return (unmotivated), Dorothy never warmed back up.
   - `character_matrix.md` — all 22 chapter rows × 6 core characters + minor character tracker. Cells carry register and one-line state. Audit ⚠ markers flag the same issues as subplot_threads.md.
   - `interiority/emma_book1.md`, `interiority/elijah_book1.md`, `interiority/noah_book1.md`, `interiority/oliver_book1.md`, `interiority/olivia_book1.md`, `interiority/jasper_book1.md`, `interiority/hank_book1.md` — per-character per-book internal arc documents.

5. **Chapter frontmatter demo** applied to `m3_13_service_for_one.md` as the first retrofit. Mass retrofit across remaining 21 chapters is pending author sign-off on the demo's shape.

**Structural rationale:**

- The matrix is the at-a-glance view (chapter × character × register/state). Interiority docs are the depth. Subplot threads are the open-thread audit. Canon location rules are the geography enforcement. Each file does one job.
- Stories drive the canon — these tracking files are derivative of the stories, not constraints on them. When story and tracking conflict, story wins and tracking updates.
- Designed to scale to six books. Books 2–6 will each get their own `tracking/` directory inheriting from `_story_template/`.

**Open items surfaced by the retrofit (for author review):**

- Ch22 "October night" line conflicts with mid-November landing (math from "two weeks later" anchor). Pick: change to "ten days later" or "November night."
- Ch12 → Ch13 compression: mogul retaliates with full OnlyFans-aware C&D in ~3 days from Brenda's call. Either push C&D arrival to Friday Oct 30 OR insert a brief beat showing the corporate machinery building.
- Ch14 family weight beat (Elijah's sister/mother): pay off with one Ch16 or Ch21 callback, OR cut. Currently the seed goes nowhere.
- Ch15 Oliver's online life parenthetical: confirm this is the right Book 2 seed level. Currently fine.
- Sofia's silence (Ch13 → never): plant noticed-silence in Ch15-16, hint reconnection in Ch22, payoff in Book 2.
- Ch20 Hank's decision to return: add one beat showing internal reckoning.
- Ch22 reversion beats (Jasper, Oliver, Noah's apology, Emma's OnlyFans feelings): the audit lists specific small fixes.

**Files touched:**
- `canon library/locations_registry.md` — Canon Rules section added
- `stories/_story_template/chapters/00_chapter_guide.md` — Chapter frontmatter spec added
- `stories/_story_template/tracking/` — new directory with 4 template files + interiority subdirectory
- `stories/01. The Case of the Missing Hot Sauce/tracking/` — populated with 4 files + 7 interiority docs
- `stories/01. The Case of the Missing Hot Sauce/chapters/m3_13_service_for_one.md` — frontmatter applied (demo)
- `CANON_CHANGELOG.md` — this entry

---

## 2026-04-07 — Expanded to 22-chapter structure (5+7+5+5)

**Trigger:** Author review identified Meals 3–4 as underserved. "Bad guys close in" was compressed, the campaign deserved a three-act arc (hope → doubt → breakthrough), and Jasper's solo journey to find Hank needed its own chapter.

**What changed:**

**Meal 3 expanded from 4 to 5 chapters:**
- Ch13–16 unchanged in position (content updates pending for Ch13 signs-of-trouble expansion)
- Ch17 "Sharpening the Knives" — NEW. Vignettes of each character preparing their campaign piece. Mirrors Meal 2 investigation montage but compressed.

**Meal 4 expanded from 3 to 5 chapters:**
- Ch18 "Turning Up the Heat" (was Ch17) — Campaign launch, hope builds
- Ch19 "The Counterpunch" — NEW. Pushback, doubt, the campaign might fail
- Ch20 "Farm to Table" (was Ch18) — Jasper's solo journey to Meadowlight
- Ch21 "The Turning Tide" — NEW. Oliver's rebuttal, food critic picks up story, tide turns
- Ch22 "Family Meal" (was Ch19) — Celebratory dinner, Jasper brings Hank

**Structural rationale:**
- Save the Cat midpoint (Ch12 false victory) now lands at 55%
- Campaign gets proper three-act arc: hope (Ch18) → doubt (Ch19) → breakthrough (Ch21)
- Jasper's chapter (Ch20) sits between doubt and triumph — emotional contrast
- "Bad guys close in" gets three chapters (Ch13–15) instead of one

**Files touched:**
- `00_story_outline.md` — Complete rewrite with 22-chapter structure, Save the Cat beat sheet, timeline
- `00_meal_summaries.md` — Updated for 5+7+5+5 structure
- `m4_17_turning_up_the_heat.md` → renamed to `m4_18_turning_up_the_heat.md` (Ch17→Ch18)
- `m4_18_farm_to_table.md` → renamed to `m4_20_farm_to_table.md` (Ch18→Ch20)
- `m4_19_family_meal.md` → renamed to `m4_22_family_meal.md` (Ch19→Ch22)
- `m3_17_sharpening_the_knives.md` — NEW placeholder
- `m4_19_the_counterpunch.md` — NEW placeholder
- `m4_21_the_turning_tide.md` — NEW placeholder
- All epub files regenerated

---

## 2026-04-07 — Dorothy's bottle moves to Chapter 1; dual-market structure established

**Trigger:** Author decision to have Emma receive Hank's last bottle of hot sauce in Ch1 (before Meal 1 dinner), so the group tastes the sauce and understands what's at stake. Hank sold at two markets: McGolrick (Sunday) and McCarren (Saturday).

**What changed:**

1. **Ch1 restructured:** Emma goes to McGolrick Park on Sunday morning (her usual market). Dorothy (honey vendor, Hank's neighbor at McGolrick) replaces Ruth as the first market contact. Dorothy gives Emma the "just in case" bottle. Hank's stall is empty — a raw gap in the row. Emma cooks that afternoon — the hot sauce goes into the butternut squash soup.

2. **Ch2 updated:** Soup scene rewritten. Group tastes the hot sauce and reacts — the sauce becomes the emotional centerpiece of the dinner. Emma tells the Hank/Dorothy story with the physical bottle in hand. Olivia's "are you okay" check-in now follows the Hank reveal rather than preceding it.

3. **Ch3 updated:** Oliver's summary to Elijah now describes the incredible sauce + missing vendor (not "wanted to buy sauce but couldn't"). Elijah tastes the soup and confirms it's exceptional.

4. **Ch4 minor fix:** Oliver's joke adjusted ("none of us have ever met Hank" instead of "seen").

5. **Ch5 updated:** Emma's kitchen glance now focuses on the bottle on the counter (not the empty counter where a bottle should have been).

6. **Ch11 rewritten:** Emma visits McCarren Park the following Saturday — a different market, checking out Hank's Saturday spot. His stall has already been filled by a new vendor (jarred salsa with string lights and a chalkboard sign). The market has moved on. No Dorothy here — Emma goes to Sofia's cheese shop nearby for the deeper intel (Hank's "big offer," Paolo the pickle guy precedent, the waterfront restaurant mogul). Stall progression: empty at McGolrick (Ch1) → filled at McCarren (Ch11) = escalating erasure.

**Dual-market canon established:**
- **McGolrick Park** (Sunday): Emma's home market. Dorothy sells here, next to Hank's stall. Stall remains empty.
- **McCarren Park** (Saturday): Larger market. Hank's stall filled by new vendor by Ch11. Near Sofia's cheese shop.

**Canon docs updated:**
- `locations_registry.md` — Added McCarren Park entry, updated McGolrick details, added character geography to canon facts, updated Jasper's apartment to Chelsea, Olivia/Oliver to Clinton Hill
- `00_meal_summaries.md` — Updated Meal 1 setup beats (bottle, soup, group reaction), updated Ch11 description

**Files touched:**
- `chapters/m1_01_the_missing_hot_sauce.md` — Rewritten (Sunday McGolrick, Dorothy, bottle, cooking with sauce)
- `chapters/m1_02_the_first_supper.md` — Soup scene rewritten (group tastes sauce)
- `chapters/m1_03_a_simmering_suspicion.md` — Oliver's summary + Elijah tasting scene
- `chapters/m1_04_stirring_the_pot.md` — Minor dialogue fix
- `chapters/m1_05_mise_en_place.md` — Bottle on counter reference
- `chapters/m2_11_the_empty_stall.md` — Rewritten (McCarren Saturday, filled stall, Sofia intel, no Dorothy)
- `canon library/locations_registry.md` — McCarren added, character geography, canon facts
- `chapters/00_meal_summaries.md` — Meal 1 and Ch11 descriptions updated
- Meal 1, Meal 2, and full book epubs regenerated

---

## 2026-04-07 — Meal Two restructure and chapter-by-chapter edit pass

**Trigger:** Author review of Meal Two flagged flat characterization, timeline issues, information flow problems, and one-note character voices.

**Structural change:** Meal Two expanded from 6 chapters (Ch6–Ch11) to 7 chapters (Ch6–Ch12). Each investigation chapter now follows a one-character-per-day rhythm (Monday–Sunday), with the narrative chain flowing through character personality rather than plot convenience.

**Chapter mapping:**
- Ch6: Oliver (Monday) — Library research, LLC discovery
- Ch7: Olivia (Tuesday) — Marcus intel + shares findings with Oliver at home
- Ch8: Elijah (Wednesday) — NEW CHAPTER. Bridges Oliver's finding to the group chat
- Ch9: Noah (Thursday) — Re-engaged by Elijah's text, traces corporate structure
- Ch10: Jasper (Friday) — Calls Brenda, motivated by group chat competition
- Ch11: Emma (Sunday morning) — Market visit, Dorothy + Sofia scenes
- Ch12: Dinner (Sunday evening) — Combined former Ch10+Ch11

**Key changes:**
1. **Added Elijah bridge chapter (Ch8):** Olivia calls Elijah about a tailor; she shares Oliver's finding. Elijah posts to group chat on Oliver's behalf, knowing Oliver won't share it himself.
2. **Noah voice overhaul (Ch9, Ch12):** Removed "optimize/efficient/algorithm" one-note dialogue. Noah now shows genuine frustration with analog problems and quiet competence with structured data.
3. **Jasper backstory softened (Ch10):** Removed heavy-handed "previous life"/"family's expectations" exposition. 311 job description removed. Walk location changed from McGolrick to Chelsea (where Jasper lives). Brenda surname changed from Chen to Marquez. Jasper no longer names Emma to Brenda.
4. **Saturday→Sunday fix (Ch11):** McGolrick Park Greenmarket is a Sunday market. All references corrected.
5. **Dinner scene reconciled (Ch12):** Group already knows LLC finding from group chat; dinner opens with "We all saw the group chat. Who's got more?" Oliver doesn't re-present known info. Elijah presents financial model fresh. Noah presents week-long trace results. Brenda's closing text no longer mentions Emma.
6. **Brenda's warning softened (Ch10):** "He's ruthless. Really ruthless." → "These aren't small-time operators. They don't appreciate attention."
7. **Character geography established:** Emma (Williamsburg/Greenpoint border), Noah (Williamsburg waterfront), Olivia & Oliver (Clinton Hill), Jasper (Chelsea), Elijah (Bed-Stuy near Classon Ave G).

**Renumbering cascade:** Adding Ch8 pushed all subsequent chapters +1. Meal 3: Ch12→13, Ch13→14, Ch14→15, Ch15→16. Meal 4: Ch16→17, Ch17→18, Ch18→19. All chapter headers and filenames updated.

**Files touched:**
- `chapters/m2_06_a_fine_sieve.md` — Rewritten (Oliver opener, bookshelf detail, trimmed editorializing)
- `chapters/m2_07_gathering_the_ingredients.md` — Rewritten (Olivia opener, Marcus exit beat, Clinton Hill location, Oliver at desk)
- `chapters/m2_08_the_bottom_line.md` — NEW FILE (Elijah bridge chapter)
- `chapters/m2_09_a_pinch_too_much.md` — Rewritten (Noah past-tense recap, re-engaged by Elijah's text)
- `chapters/m2_10_loose_lips.md` — Rewritten (Jasper in Chelsea, Brenda Marquez, competitive motivation, no Emma naming)
- `chapters/m2_11_the_empty_stall.md` — Saturday→Sunday fix
- `chapters/m2_12_coming_to_a_boil.md` — Rewritten (combined dinner, reconciled info flow, Noah voice, Elijah model fresh)
- `chapters/m3_13_service_for_one.md` through `m4_19_family_meal.md` — Renumbered
- `chapters/00_meal_summaries.md` — Updated chapter-meal mapping
- All 5 epub files regenerated

---

## 2026-04-04 — Consistency fixes from external review (5 items)

**Trigger:** External review flagged narrative inconsistencies across canon docs and chapters.

**What changed:**

1. **Antagonist naming:** Removed "Intentionally unnamed" from character overview. Garrett Pike is now consistently named across canon docs (already existed in `book1_garrett_pike.md` and `continuity.md`). Character overview updated with full name and link to antagonist profile. Name surfaces publicly in the story during the food critic's coverage (Ch16).

2. **Olivia's Meal 2 potluck contribution:** Ch5 promised Olivia and Oliver would handle the entree together, but Ch10 had Olivia arriving with only flowers/candles. Fixed: Olivia now arrives with sourced ingredients (wild mushrooms, local honey, fresh thyme) gathered during her Bedford Ave intel-gathering trip on Tuesday. She did the sourcing; Oliver did the cooking. Team contribution intact.

3. **Noah's Ch9 investigation framing:** Noah's dismissiveness in Ch9 read as lazy/disinterested, inconsistent with his playful engagement during Meal 1 theories. Reframed: Noah now actively searches multiple variations and databases, but hits a wall because Hank has zero digital footprint. His frustration is about tools, not apathy — "like trying to grep a handwritten notebook." His re-engagement once Elijah provides real data now reads naturally.

4. **Fish Pepper regional context (Ch17):** Jasper calling Maryland nurseries when Hank's seeds are from Virginia wasn't contradictory (Fish Peppers are a Chesapeake variety), but could confuse readers. Added one clarifying line: "Fish Peppers were a Chesapeake Bay variety—Maryland, Virginia, up into Pennsylvania—so he cast a wide net."

5. **Continuity doc OnlyFans phrasing:** Continuity doc implied the group outed Emma's OnlyFans. Corrected to match Ch18's actual text: internet sleuths connected the dots independently after the C&D note's "Kinky Kitchen" reference became public. The group's swarm campaign was anonymous; the exposure was an indirect consequence.

**Files touched:**
- `stories/01. The Case of the Missing Hot Sauce/characters/00_character_overviews.md`
- `stories/01. The Case of the Missing Hot Sauce/chapters/m2_09_a_pinch_too_much.md`
- `stories/01. The Case of the Missing Hot Sauce/chapters/m2_10_coming_to_a_boil.md`
- `stories/01. The Case of the Missing Hot Sauce/chapters/m4_17_farm_to_table.md`
- `canon library/continuity.md`

---

## 2026-04-04 — Book title: "The Missing Hot Sauce" → "The Case of the Missing Hot Sauce"

**Trigger:** "The Case of..." framing better sets genre expectations for cozy crime and gives the series a natural naming pattern.

**What changed:** Story folder renamed from `01. The Missing Hot Sauce` to `01. The Case of the Missing Hot Sauce`. All book-title references updated across canon docs. Chapter 1's title ("Chapter One - The Missing Hot Sauce") deliberately left unchanged — it works as a chapter title.

**Files touched (12):** README.md, 6 character files, continuity.md, series_plan.md, glossary.md, locations_registry.md, book1_garrett_pike.md

---

## 2026-04-04 — Chapter folder structure flattened

**Trigger:** Too much nesting. Four levels deep to reach a chapter file was cumbersome during editing.

**What changed:** Removed meal subfolders (`01_meal_one/`, `02_meal_two/`, etc.) from Book 1's chapters directory. All 18 chapter files now live in a single flat `chapters/` folder with meal prefixes in the filename: `m1_01_the_missing_hot_sauce.md`, `m2_06_a_fine_sieve.md`, etc. The four `_overview.md` files were consolidated into a single `00_meal_summaries.md`. Story template and chapter guide updated to reflect the new convention.

**New naming convention:** `m[meal]_[chapter number]_[snake_case_title].md`

---

## 2026-04-04 — Farmers market location: McCarren Park → McGolrick Park

**Trigger:** Factual accuracy. The story takes place on a Sunday; McCarren Park Greenmarket operates on Saturdays. McGolrick Park's Down to Earth Farmers Market operates Sundays year-round (9am–2pm).

**What changed:** All references to "McCarren Park" updated to "McGolrick Park" throughout the project. The market is now described as a smaller, community-feel Down to Earth market in Greenpoint (center of the park between Driggs and Nassau off Russell St), which better fits the intimate neighborhood vibe of the story.

**Files touched (16):**
- `stories/01. The Missing Hot Sauce/chapters/01_meal_one/01.md`
- `stories/01. The Missing Hot Sauce/chapters/02_meal_two/06.md`
- `stories/01. The Missing Hot Sauce/chapters/02_meal_two/07.md`
- `stories/01. The Missing Hot Sauce/chapters/02_meal_two/09.md`
- `stories/01. The Missing Hot Sauce/chapters/04_meal_four/17.md`
- `stories/01. The Missing Hot Sauce/chapters/00_story_outline.md`
- `stories/01. The Missing Hot Sauce/plot/00_story_background.md`
- `stories/01. The Missing Hot Sauce/characters/00_character_overviews.md`
- `stories/01. The Missing Hot Sauce/characters/dorothy.md`
- `stories/01. The Missing Hot Sauce/characters/hank.md`
- `stories/01. The Missing Hot Sauce/characters/ruth.md`
- `canon library/locations_registry.md`
- `canon library/glossary.md`
- `canon library/series_plan.md`
- `canon library/characters/emma.md`
- `canon library/characters/olivia.md`
- `canon library/antagonists/book1_garrett_pike.md`

---

## 2026-04-04 — Book 1 Meal One menu established

**Trigger:** Consistency issues during chapter edits — spaghetti squash / butternut squash overlap, missing dishes.

**What changed:** Emma's Meal 1 menu is now explicitly established in Ch. 1 and referenced consistently across Chs. 1–5:
- Appetizer: Deviled eggs with smoked paprika
- First course: Butternut squash soup (missing Hank's hot sauce)
- Main: Roasted root vegetables (parsnips, carrots, turnips) with herbed brown butter
- Dessert: Apple tarte tatin
- Elijah's late plate: Roasted root vegetables (replaces former spaghetti squash)

**Files touched:**
- `stories/01. The Missing Hot Sauce/chapters/01_meal_one/01.md` — Menu established
- `stories/01. The Missing Hot Sauce/chapters/01_meal_one/02.md` — Root vegetables referenced
- `stories/01. The Missing Hot Sauce/chapters/01_meal_one/03.md` — Spaghetti squash → roasted root vegetables
- `stories/01. The Missing Hot Sauce/chapters/01_meal_one/05.md` — Consistent references

---

## 2026-04-04 — Book 1 Meal One chapter edits (various)

**Trigger:** Author review of Chapters 1–5.

**Summary of changes:**
- Removed banjo busker from Ch. 1 (replaced with Citi Bike basketball guy)
- Toned down OnlyFans hints in Chs. 1–2 (vaguer financial stress)
- Deviled eggs: Olivia now owns the plating/photography moment in Ch. 2 (introduces her pitching private gigs for Emma)
- Wine sequencing tightened in Ch. 2 (Jasper's wine "running low" instead of "long since finished")
- Fixed folding chair armrest in Ch. 3 (folding chairs don't have armrests)
- Emma's position: consistently in the kitchen leaning against the counter in Chs. 3–4 (was inconsistently on the floor / on a milk crate)
- Added wine-sharing moment in Ch. 3 (Jasper asks Emma to share Elijah's bottle)
- Fixed typo: "only think" → "only thing" (Ch. 3)
- Fixed "his own wine—his own" repetition (Ch. 3)
- Replaced banjo/Russian folk reference with McGolrick Park landmark (Ch. 4)
- Added Olivia's "socialite abduction" to Elijah's theory summary (Ch. 4)
- Added leaving cues before hat draw in Ch. 5 (Noah checking trains, Olivia finding her shoe)
- Reworked Ch. 5 ending: friends arguing as they file out the door and down the stairwell
