---
name: plot-suggest
description: Generate plot event suggestions grounded in Supper Club Secrets canon — next-chapter beats, B-plot moves, or whole-book premises that are canon-legal by construction. Use when planning a chapter or meal, unblocking a stalled outline, or brainstorming the next book. Suggestions cite their canon sources; nothing is invented that contradicts established facts.
---

# Plot Suggest

Generate plot event suggestions that are **grounded in what the universe has already
established**. The difference between this and freeform brainstorming: every suggestion
is built from open material the canon is already carrying (threads, secrets, states,
schedules) and cites it, so accepting a suggestion never creates a contradiction.

## When to use

- "What should happen next?" — planning the next chapter, scene, or meal
- A stalled outline: the meal structure is set but a beat is empty
- Book-level: "what's Book N about?" grounded in the seeds prior books planted
  (start from `canon library/books/bookN.md` — a concept file already exists per book)
- "Give me options for how X could pay off"

## Scope first

Ask (or infer from the request) which altitude the suggestion should live at:
1. **Beat** — the next scene/chapter inside a book in progress
2. **Thread move** — how to advance or pay off one specific subplot
3. **Premise** — shaping a future book beyond its concept file

## Gather the open material

Read, in this order:

1. **`canon library/continuity.md`** (latest `## After Book N` entry) — world state,
   character open threads, recurring-character availability, **Seeds Planted for Future
   Books**.
2. **`stories/<current>/tracking/subplot_threads.md`** — every thread with status
   `introduced` / `developing` / `complicated` / `carry forward` is an open promise;
   the "Threads at risk" table is a to-do list of latent material. The custody entries
   tell you where every tracked object *is* right now.
3. **`stories/<current>/tracking/character_matrix.md`** — each character's current
   register and state. A suggestion should move someone's state, not just the plot.
4. **`stories/<current>/tracking/interiority/*.md`** — the **withhold columns**: what each
   character is not saying is the highest-energy material available. (Private authoring
   input — never quote interiority content into reader-facing text.)
5. **`canon library/series_plan.md`** — the **Character Secret Progression** table is a
   schedule, not a menu: Emma's income source stays opaque until its deferred book;
   Jasper's old money is the series' first full payoff (Book 6). Also the locked
   decisions (book order, hosting rotation, reputation arc).
6. **`canon library/locations/index.md`** — market days (McGolrick = Sunday, McCarren =
   Saturday), shop hours, travel times. Schedules *generate* plot (a closed shop, a
   market-day deadline, a 4-hour drive forcing an overnight) as often as they constrain it.
7. **`canon library/group_dynamics.md`** — which pairings have charge; which two
   characters haven't had a scene alone together.
8. **`ai_instructions.md`** — §6 mystery construction (one central mystery + one B-plot,
   2–3 red herrings, ≤5 key clues, fair play, human villain), §7 tone (3–5, peak 6–7,
   never 8+), §8 red lines, §9 food-as-storytelling (menus reflect the group's emotional
   state — a suggestion that lands in a meal should say what's on the table).
9. **The book's outline** (`chapters/00_story_outline.md`) — which Save-the-Cat beat the
   story is at; suggest beats that belong at this point in the four-meal shape.

## Generate

Produce **3–5 suggestions**, deliberately varied (don't give five versions of the same
move). Good generators, in rough order of strength:

- **An open thread + a character's withheld thing.** Force a `developing` thread through
  the character whose interiority says they can't handle it.
- **A seed that's due.** A planted seed whose payoff book is this one (or whose
  threads-at-risk entry says it's going stale). Sofia's Book 1 silence → Book 2 is the
  canonical example.
- **A schedule collision.** Market days, shop hours, or travel times made to collide
  with what a character needs (they need Hank's stall *today* and it's not Sunday).
- **A custody move.** A tracked object changes hands — every hand-off is a scene, and
  the bottle's Ch1→17→25 path shows how much story one object carries.
- **A secret's knowledge boundary shifting by one person.** Not the full reveal (check
  the progression table for what's reserved) — one character learning one layer, the way
  Olivia got precarity-not-the-account in Ch14.
- **A recurring character's return** consistent with their availability row in
  continuity (Dorothy → Book 3, Marcus → Book 4, Brenda → Book 6, Pike may resurface).

## Output format

For each suggestion:

- **The event** (2–3 sentences, concrete: who does what, where, when — and if it's at a
  meal, what's being served and what that says)
- **Grounded in:** cited sources (`file` + the thread/cell/seed it builds on)
- **What it moves:** which thread(s) advance, whose state changes and to what
- **Cost / constraint check:** date works (market days, travel times), tone stays ≤7,
  no red line crossed, no reserved reveal spent early
- **Where it could go next:** one sentence on the follow-on it opens

Close with a recommendation: which suggestion you'd take and why (fit to the current
Save-the-Cat beat and to the focal character's arc).

## Rules

- **Never contradict canon.** If a suggestion needs a fact bent, say so explicitly and
  flag it as a canon-change proposal, not a plot suggestion.
- **Never spend a reserved reveal.** The secret-progression table is a schedule, not a
  menu — Emma's account and Jasper's money in particular.
- **Respect the tone ceiling.** Nothing that pushes a scene past 7; the villain stays
  human (greedy, not evil).
- **Suggestions are options, not edits.** This skill writes no prose and updates no
  tracking files.
