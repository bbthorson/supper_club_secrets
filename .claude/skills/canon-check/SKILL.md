---
name: canon-check
description: Verify a chapter, scene, or revision against series canon and continuity for Supper Club Secrets. Use when asked to check continuity, canon, or consistency; before locking a chapter; or after drafting/revising a scene. Reports contradictions only — never edits the prose.
---

# Canon Check

Verify that a piece of prose is consistent with established canon, continuity, and the
project's hard constraints. This is a **read-only audit**. It reports problems; it never
rewrites the story. The Golden Rule holds: stories drive canon, so when prose and a
tracking file disagree, the *tracking file* is what gets flagged for update — the prose is
never edited to match a record (see `protocol/ARCHITECTURE.md` §10).

## When to use

- "Check continuity / canon / consistency" on a chapter or scene
- After drafting or revising a scene, before sign-off
- Before a chapter or meal is locked / finalized

## Inputs

Identify the target prose (a chapter file under `stories/<book>/chapters/`, a scene, or a
diff) and which book it belongs to. The canonical sources live in two places:

- **Series-wide:** `canon library/` — `continuity.md`, `characters/*.md`,
  `antagonists/*.md`, `locations/*.md` (+ `locations/index.md`), `group_dynamics.md`,
  `glossary.md`, `series_plan.md`
- **Per-story:** `stories/<book>/tracking/` — `character_matrix.md`,
  `timeline_ledger.md`, `subplot_threads.md`

## Procedure

Run every check. Read the target prose first, then cross-reference each source. Note that
story folders contain spaces (e.g. `stories/01. The Case of the Missing Hot Sauce/`).

### 1. Character state & voice
For each character in the scene, open their row in `tracking/character_matrix.md` for this
chapter (and adjacent chapters):
- **Register** (`public` / `private` / `under-pressure` / a transition) — does the prose
  match? A character in `public` register should not be dropping into raw vulnerability
  without a transition beat.
- **State arc** — is the one-line emotional state a believable step from the previous
  chapter's cell? Flag jumps with no on-page cause.
- **Voice** — cross-check `canon library/characters/<name>.md` and the voice guide.
  Distinctive tics (Emma's Western PA dialect, Jasper's breathlessness) should appear
  *roughly once per scene, not every line*. Flag overuse and flag voice that could belong
  to any character.
- **Established facts** — no contradiction of background, relationships, or secrets in the
  character file or `continuity.md` (e.g. who knows about Emma's Kinky Kitchen account at
  this point in the timeline; what is still hidden).

### 2. Timeline & travel
Cross-check `tracking/timeline_ledger.md`:
- Does the scene's implied date match the ledger row for this chapter?
- **Relative-time slips** — a prop/event referred to as "this morning," "yesterday," "two
  days ago" must agree with the absolute dates. (This class of bug is real here — see the
  Oct 2 LLC chronology note in the ledger.)
- **Travel time** — movements between locations must respect the scheduling/travel rules in
  `canon library/locations/index.md`. No teleporting across Brooklyn within an impossible window.

### 3. Location consistency
Cross-check `canon library/locations/index.md` and `canon library/locations/*.md`:
- Is the location **open/operating** on the scene's story date? (Market days, shop hours
  are encoded as schedule rules — e.g. McGolrick market is Sunday; McCarren is Saturday.)
- Physical details (layout, who works there, neighborhood) match the location file.

### 4. Subplot & clue custody
Cross-check `tracking/subplot_threads.md`:
- Every clue/prop is in the **right hands** at this point in its custody chain (e.g. the
  heritage hot-sauce bottle's path).
- Thread status is consistent — nothing "paid off" that was never introduced; nothing
  contradicting an earlier `complicated`/`developing` beat.
- Flag any thread that ends in silence: a thread may only end `paid off`, explicitly
  `dropped` (with its why note), or `carry forward` — and a `carry forward` thread still
  needs its on-page carry-forward beat (a nod that keeps it alive), not disappearance.
  (Sofia's Book 1 thread was the canonical miss: intentionally open, but the planned
  noticed-silence and reconnection beats were never executed until the audit caught it.)

### 5. Hard constraints (`ai_instructions.md`)
These are red lines — flag any violation:
- **POV:** no head-hopping within a scene; stay in the active feed's limited POV (Emma's by
  default). No mind-reading of other characters.
- **Tone:** scene sits 3–5, peaks at 6–7. **Never 8+.** Flag anything that reads as thriller.
- **Red lines:** no on-page violence, no gore, villain stays human (greedy, not evil), no
  deus ex machina reveals in Meal 4.

### 6. Cross-book continuity (series-wide scenes)
If the target is the opening of a new book or references prior events, check the relevant
`## After Book N` entry in `canon library/continuity.md` for world state, character state,
and recurring-character availability.

### 7. AI-tells (light craft glance, optional)
A single scene can't reveal the *patterns* that mark AI-generated prose — that's a whole-book
judgment the `story-audit` prose-craft pass makes (see
`.claude/skills/story-audit/references/ai_tells.md`). But at draft time it's cheap to catch
the obvious ones in the scene in front of you: negative parallelism ("not X — it's Y") used
as a reflex, a "here's the kicker" reveal, magic adverbs propping up flat sentences, an
*uncatalogued* physical tell (hitched breath, tight jaw) carrying the emotion, or the same two
or three stock smells. Flag these as 🔵 craft suggestions — or 🟡 if a single scene clusters
the *same* tell several times — never a contradiction, never a mandate. Honor the SCS carve-outs: sensory-first prose is required (flag a narrow palette,
not scent itself), and a catalogued voice tic (Emma's dialect, Jasper's breathlessness) is
never a tell. If the scene feels tell-heavy, recommend a full `story-audit` prose-craft pass
rather than judging the pattern from one scene.

## Output

Report findings as a list, grouped by check. For each:

- **Severity:** 🔴 contradiction (breaks canon) · 🟡 likely slip / needs author call · 🔵 nit
- **Location:** chapter + the prose phrase at issue (`file:line` where possible)
- **Conflict:** what the prose says vs. what the source says, with the source cited
- **Suggested resolution:** which side is likely wrong. Default assumption: the prose is the
  truth and the tracking file needs updating — *unless* the prose violates a §5 hard
  constraint, in which case the prose is the problem.

End with a one-line verdict: **clean**, **slips found (N)**, or **canon contradictions found
(N)**. Do not modify any prose file. If asked to *fix* findings, update the **tracking
files** to match the prose (Golden Rule), and only touch prose for §5 hard-constraint
violations after confirming with the author.
