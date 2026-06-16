# Book 1 — Tier 1: High-Level Pass & Locked Decisions

**Date:** 2026-06-15
**Method:** Top-down development, tier 1 of 3 (high level → meal level → chapter level). This file is the reference the meal-level pass builds on. Where it conflicts with later, more specific decisions, the later decision wins and this file is updated.

---

## Verdict

The skeleton is sound. Premise, the four-meal Save the Cat shape, and the Garrett Pike antagonist conception need no structural surgery. The work concentrated in the back half (Meals 3–4), plus three foundational decisions now locked below.

## What's working (leave alone)

- Food-anchored cozy premise; the disappearance becomes personal because the group tastes what's at stake.
- Emma's "Big Hot Sauce" comic theory turning out correct dramatizes her arc (trust your instincts).
- Four-meal beats map cleanly to Save the Cat.
- Garrett Pike: human, sympathetic internal logic, real blind spot, no mustache-twirling.
- Whodunit fair play holds (LLC, patents, financial motive, Paolo pattern, mogul identity all land by the Ch12 midpoint).

---

## Locked Decisions

### 1. Emma owns Book 1, but the books are ensemble evolution
Emma is the accelerated, foregrounded arc in Book 1 (she hosts all four meals; the space is hers; she discovers the case and carries the emotional core). This does **not** flatten the book to one character. Every book advances the whole group; each book simply accelerates at least one character. 

**Implication for revision:** Keep ensemble growth, but make sure Emma has clear *agency in the resolution*, not only in discovery and confession. Oliver's emergence (Ch15 speech, Ch21 rebuttal) stays as a deliberate seed for Book 2, but it must not eclipse Emma in her own climax. The resolution should turn on something Emma does or realizes.

### 2. POV model: feed-based perspective (NEW canonical rule)
Replaces the older "Emma is the only POV, no mind-reading" framing, which the draft already contradicts. The intent behind that rule (meals carry discussion of what was learned; the reader sometimes knows more than the group) is preserved and sharpened.

**The model:**
- Every scene belongs to a **feed**: a place (the market, Sofia's shop, the library) or a character's personal thread.
- **Emma's feed is the spine.** The book is anchored in her close-third perspective most of the time.
- The narrative may take **limited excursions** into other feeds. When it does, the reader gains knowledge Emma and the group may not have. This dramatic irony is a feature.
- **Meals are convergence points.** Feed content becomes shared group knowledge through table discussion. What gets shared, mis-shared, or withheld at the table is a tension lever.
- **Some feed content never reaches the group** (e.g., Olivia's shop conversation as a "shop feed" event the others never follow). The reader may or may not see it.
- **No head-hopping within a scene.** Inside any feed/excursion, stay in that one character's limited perspective.

**Why it matters twice:** this is also the AT Protocol layer's location/character-feed model (see `protocol/ARCHITECTURE.md`, locations-as-feeds and the public-timeline vs. private layers). The prose POV and the eventual data model are the same idea. Writing to feeds now makes the protocol projection clean later.

**Pending:** promote this rule into `ai_instructions.md` (POV section) and `world building/` once wording is confirmed; cross-link to `protocol/ARCHITECTURE.md`.

### 3. Keep the early crack, but keep discovering through Meal 3
The whodunit intentionally resolves at the Ch12 midpoint so the team can work out its specialties (this is the group's origin book). That intent stays. But the back half currently runs on pure execution and reads dry.

**Implication for revision:** seed *continued small discoveries* through the end of Meal 3, even minor ones, so the investigation keeps a pulse alongside the campaign. New layers to mine: the true breadth of the patent, the outcome of the Paolo precedent, the personal-note/Kinky Kitchen angle, early threads toward Hank's whereabouts. The initial investigation may also be slightly too easy (see #5); some discovery can be deferred to later in the book.

### 4. Put the antagonist on-page at least once
Pike is currently entirely off-page; the threat is only paperwork and a process server, with no confrontation or catharsis.

**Implication for revision:** add at least one on-page Pike beat. Strong candidate: Emma unknowingly encounters him (his profile notes he visited the McGolrick market, knows food, can identify a Fish Pepper by sight, and knows Emma as "the chef who's been asking questions"). Plant early, pay off when she realizes who he was.

### 5. Red herrings: low priority, but tighten the easy investigation
Not adding contrived misdirection. The Ch4 theory competition stays as comedy. But the early investigation is a little too frictionless. Consider adding genuine discovery/complication later in the book rather than front-loading a clean solve. Folds into #3.

### 6. The back half is the priority rewrite/regeneration zone
Meals 3–4 were deliberately left under-developed while macro planning happened. This is where revision effort concentrates: it carries the most narrative load, has the least mystery momentum, holds the two unwritten chapters (Ch19, Ch21), the underdeveloped Ch20, and all the timeline compression flags.

**Implication for revision:** lock and rewrite/regenerate the back half, incorporating #1 (Emma's resolution agency), #3 (continued discovery), and #4 (on-page Pike).

---

## Carry-forward to Tier 2 (Meal-Level Pass)

- **Meals 1–2:** mostly intact. Light touches only: plant the on-page Pike beat (#4), establish feed-based excursions cleanly (#2), and check whether the investigation is too frictionless (#5).
- **Meal 3:** add continued-discovery beats (#3); resolve the known compression flags (Ch12→13 retaliation speed, Ch13 Tuesday void, Ch17 prep-montage timing); confirm Emma's role in shaping the counter-plan (#1).
- **Meal 4:** the heaviest rebuild. Draft Ch19 and Ch21; develop Ch20 (Jasper's PA journey); ensure Emma drives the resolution (#1); land the on-page Pike payoff (#4); fix the Ch22 timeline note (outline still says "two weeks later / TBD" vs. the anchored "following Sunday").

## Open follow-ups (not blocking Tier 2)

- Promote the feed-based POV rule (#2) into `ai_instructions.md` and `world building/`, cross-linked to `protocol/ARCHITECTURE.md`.
- Re-sync `chapters/00_story_outline.md` and `00_book_metadata.md` after the back-half rewrite (counts, the Ch22 timeline note).
