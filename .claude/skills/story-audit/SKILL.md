---
name: story-audit
description: Full-book audit of a Supper Club Secrets book — every chapter, tracking file, canon file, and protocol record, checked in parallel passes and reported as tiered findings. Use before locking a book, before manuscript sign-off, or when a book has accumulated enough edits that continuity confidence is low. Read-only; produces a findings report, not edits.
---

# Story Audit

A full-book audit. Where `canon-check` verifies one chapter or scene, this audits an
entire book — prose, tracking, canon, and the protocol records — and produces a tiered,
actionable findings report. This is the method that ran on Book 1 (2026-07-11, see
`stories/01. The Case of the Missing Hot Sauce/tracking/audit_2026-07-11.md`) and found
6 contradictions, 28 slips, and 19 nits in a book that had already been reviewed
chapter-by-chapter: whole-book passes catch what per-chapter checks structurally cannot
(doubled beats, dropped characters, arcs that hollow out when a twist was layered in late).

**Read-only.** The output is a report file; fixing is a separate, explicitly-requested
pass. Golden Rule throughout: prose is truth; tracking files get flagged for update;
prose is only flagged where it violates a hard constraint in `ai_instructions.md`
(§5 feed-based POV, §7 tone ceiling — scenes 3–5, peaks 6–7, never 8+ — §8 red lines).

## When to use

- Before locking a book (v1 or final)
- Before manuscript sign-off
- After a structural revision (a twist added, chapters renumbered, a subplot re-threaded)
  — late-layered changes are the #1 source of contradictions (Book 1's bottle-in-two-places
  and Meadowlight-named-early both came from the late Jasper-steals-the-bottle layer)

## Method: parallel passes

Divide the work into independent read-only passes and run them as parallel subagents
(each pass names the files it needs — they don't overlap in judgment, only in reading):

1. **Per-meal continuity passes** (four, one per meal). Each runs the full `canon-check`
   procedure over its chapters *plus* checks against adjacent meals: entrances/exits,
   register continuity across the meal boundary, props and knowledge carried over.
2. **Story-structure pass** (whole book, prose only). Does every Save-the-Cat beat land
   where `chapters/00_story_outline.md` says? Is the mystery fair-play (≤5 key clues,
   solvable by end of Meal 3 — check the clue tracker and chapter `clues:` frontmatter)?
   Do the four menus match their emotional mapping (`ai_instructions.md` §9)? Does every
   ensemble member get an on-page micro-arc or an explicit series-plan carry-forward?
3. **Tracking-fidelity pass.** Do `character_matrix.md`, `timeline_ledger.md`, and
   `subplot_threads.md` actually match the prose, chapter by chapter? Stale tracking is a
   finding even when the prose is fine — the tracking layer is what every future book
   builds on.
4. **Records-layer pass.** Run `python3 protocol/entities/resolve.py` and
   `python3 protocol/pipeline/extract.py`; any resolution miss or schema failure is a
   finding. Check that character files' Book-N lore sections are current with the
   finished prose (this is where the stale-OnlyFans-bullet class of finding lives).
5. **Prose-craft / AI-tells pass** (whole book, prose only). Scans for the stylistic tells
   of AI-generated prose — negative parallelism, em-dash addiction, magic adverbs, recycled
   physical tells, a narrow sensory palette, perfect chapter-ending symmetry. The full
   checklist, the SCS calibration (the sanctioned voice-tic allowlist, the sensory-first
   carve-out), and the mechanical count-first method live in
   [`references/ai_tells.md`](references/ai_tells.md). **Two-stage:** first count the
   greppable tells per chapter (regexes in the reference), then judge which counts are
   genre-legitimate and read for the non-greppable ones. This pass feeds **Tier 3 — Craft**
   only: its findings are 🔵/🟡 suggestions, never contradictions. A tell only resolves into
   a pattern *across* the book, so this is a whole-book judgment the per-meal passes can't
   make. Do **not** re-flag catalogued voice tics (Emma's dialect, Jasper's breathlessness) —
   their overuse is already the continuity passes' §3 voice check; this pass covers
   *uncatalogued* tells.

## Severity and tiers

Every finding gets a severity:
- 🔴 **contradiction** — breaks canon; a reader can catch it
- 🟡 **slip** — likely error / needs an author call
- 🔵 **nit** — polish

The report groups findings into action tiers:
- **Tier 1 — Critical (fix before locking):** contradictions a reader can catch, and
  canon files asserting superseded facts.
- **Tier 2 — High priority (before sign-off):** dropped threads (a character who enables
  the plot and then vanishes; a payoff the tracker recommended that was never executed),
  doubled beats, timeline knots.
- **Tier 3 — Craft:** POV drift, register/tic overuse, pacing flags, and AI-tells (the
  prose-craft pass — see `references/ai_tells.md`) — real but subjective, all suggestions.
- **Tier 4 — Hygiene:** stale tracking cells, draft residue (names/props from abandoned
  directions), outdated ⚠ flags.

## Report format

Write the report to `stories/<book>/tracking/audit_YYYY-MM-DD.md` (Book 1's
`audit_2026-07-11.md` is the canonical example — match its shape):

1. **Verdict paragraph** — is the book structurally sound? What kind of problems dominate
   (repairs vs. refinements)?
2. **Finding counts table** — 🔴/🟡/🔵 per pass, with a one-line "state of the prose" per meal.
3. **Tiered findings**, each with: severity · location (`file:line`) · the conflict
   (prose vs. source, source cited) · suggested resolution (which side is wrong).
4. **Author calls** — findings where the right fix is a creative decision, listed
   separately with options rather than a recommendation.

## Fix pass (separate, on request)

When asked to fix: work tier by tier, Tier 1 first. Tracking/canon files are updated to
match prose; prose is edited only for hard-constraint violations or Tier 1 contradictions,
and each prose fix should be the **minimal** change that resolves the finding (Book 1
precedent: the bottle fix swapped Emma's inspiration object for a photo — no scene was
rewritten). Annotate the audit report with ✅ fix notes as items land, so the report
remains the record of what was found and what was done. Re-run the records pipeline after
fixes and confirm a clean build; commit the regenerated `protocol/records/`.
