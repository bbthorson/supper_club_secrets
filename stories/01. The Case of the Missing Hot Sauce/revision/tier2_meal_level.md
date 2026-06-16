# Book 1 — Tier 2: Meal-Level Pass

Builds on `tier1_high_level.md`. One section per meal, added as each is assessed. Findings here feed the chapter-level work and the back-half rewrite. Prose fixes are flagged, not made, until the chapter-level pass.

---

## Meal 1 — Setup (Ch1–5) — assessed 2026-06-15

**Verdict:** Strong. Ship-shape with light touches only. No structural problems.

### What's working (protect it)
- **All Setup beats land:** opening image (empty stall), theme stated ("just in case" / community protecting its own), characters introduced through the dinner, catalyst (Marcus's "jittery… like a man running from something"), debate (theory competition), the plan (investigate + next-week potluck). Strong closing button: "this was the last Sunday that would feel ordinary."
- **Emotional state nailed:** comfort and routine. Emma's kitchen as "church," the overlapping banter, the warm seasonal menu. Food-as-storytelling is excellent (the soup + sauce as plot and emotional anchor, multi-sensory).
- **Voices are distinct and differentiated:** Jasper (chaos, warmth underneath), Noah (dry tech-snob), Oliver (quiet, reluctant, knowledge-bombs — the tax-policy and permits lines), Olivia (theatrical connector), Elijah (assessing, spare, "a nod is the highest compliment"), Emma (warm; Western PA dialect surfaces under stress — "the kitchen just needs lookin' at").
- **Emma drives** the meal: discovers, frames the mystery, owns the "Big Hot Sauce" instinct. Consistent with Tier 1 #1.
- **Good seeds planted:** Oliver's permits curiosity (his Meal 2 + Book 2 wheelhouse), Olivia's connector role, Elijah late from work on a Sunday (deadline pressure / family-weight thread), and the OnlyFans B-story hinted obliquely.

### Findings / actions
1. **[Continuity — CONFIRMED, fix in chapter pass]** Ch2: Emma says Dorothy "gave it to me yesterday," but Ch1 establishes she received the bottle that same Sunday morning (ledger: Ch1–5 all fall on Sun Oct 4). Change to "this morning." **Validation note:** the author flagged this as exactly the kind of slip an activity-stream/feed model would catch automatically — every event carries a `storyDate`, so contradictory in-world timing surfaces on its own (see `protocol/ARCHITECTURE.md` §10).
2. **[Enhancement — CONFIRMED, Tier 1 #4]** Plant the on-page Pike seed in the Ch1 market scene. Options: Dorothy mentions a well-dressed stranger had come around asking about Hank or the peppers; or Emma half-notices a man who knew produce too well lingering at the empty stall. Subtle now, pays off when Pike goes on-page later.
3. **[B-story — DECISION: keep the secret opaque all of Book 1]** Emma's secret income source stays opaque throughout; the reader and the group never see what it is. The oblique Meal 1 seed ("a few other things she was trying to make work" / "the math she doesn't want to do") is correct and stays. The developer's later retaliation lands as **lost assignments and dried-up revenue**, not exposure. Emma **confides in Olivia** privately (not a group confession). Full reveal **deferred to a later book**. Supersedes the old exposure/confession/goes-public arc; see the 2026-06-15 changelog entry for downstream files to reconcile in the back-half rewrite.
4. **[Pace — low priority]** Ch1's market section runs long, but it earns the length (finances, the sauce, Hank, Dorothy, the bottle, the theme all established). Optional light trim only.

### Feed-model note
Meal 1 is single-feed (Emma) and already models the **convergence-point mechanic**: Marcus's shop intel reaches the reader only as Olivia's relayed table talk, never as an excursion into the shop feed. This is a clean template for how off-Emma feeds should surface (or not) at the table later.

### Carry-forward
Nothing blocking. Items 1 and 2 fold into a light-touch Meal 1 edit during the chapter pass.

---

## Meal 2 — Investigation (Ch6–12) — assessed 2026-06-15

**Verdict:** Strong prose and the cleanest demonstration of the feed-based POV model in the book. Two substantive findings (investigation friction and a canon contradiction in Pike's backstory), plus minor notes. No structural rebuild needed.

### What's working (protect it)
- **The feed model, exemplified.** The one-character-per-day structure is exactly the rule in action: Ch6 Oliver (library feed), Ch7 Olivia (shop + home), Ch8 Elijah (phone), Ch9 Noah (apartment), Ch10 Jasper (Chelsea), Ch11 Emma (McCarren + Sofia), Ch12 convergence. Clean close-third per chapter, no mid-scene head-hopping. Ch12 is the convergence point where feeds surface into group knowledge. This validates Tier 1 #2.
- **Dramatic irony via excursion.** Ch10 and Ch12 hand off to Brenda's feed so the reader sees the breach (Brenda calling the mogul; her unread warning text) while the group celebrates. This is the "reader knows more than the group" lever working as intended.
- **Pace.** Brisk between-meal chapters (Ch8 ~740w, Ch9 ~460w) are the brief-chapter device already at work; Ch12 is the big set piece. Good rhythm.
- **Emotional state** (excitement/discovery) and the ambitious show-off potluck both land. Voices stay distinct in solo interiority, with good seeds (Elijah's "that's what my mother says, usually before asking for money," Oliver's bookshelf and "anchor," Noah's "structured data is my native language").
- **A Pike-world seed already exists:** Ch12's out-of-place man in the wrong coat at Dorothy's stall. Useful anchor for the Tier 1 #4 on-page Pike beat.
- **Midpoint false victory** lands, and the hidden-breach button is excellent.

### Findings / actions
1. **[Investigation too frictionless — Tier 1 #5]** Every source is forthcoming and every trace resolves cleanly. The lone exception is Noah's Monday "the man was a ghost" dead-end, which is pre-LLC. Recommend adding at least one real obstacle in Meal 2: a cagey or partial source, a lead that briefly misdirects, or a trace that hits a wall before breaking through.
2. **[Front-loaded solution starves Meal 3 — Tier 1 #3]** Ch12 currently delivers the *entire* solution (LLC, financial motive, patents, mogul's identity, the Paolo precedent). That leaves Meal 3 with nothing to discover. Recommend holding back one or two pieces for the crisis — e.g., the mogul's confirmed identity, or the full breadth of the patent (that it would criminalize Hank selling his own sauce) — so the Ch12 victory is genuinely *partial* and discovery continues into Meal 3. This is the lever that fixes the "dry back half."
3. **[Canon contradiction — reconcile]** Sofia (Ch11) says the mogul "had a little noodle cart in Red Hook fifteen years ago" and "used to be one of us." Garrett Pike's profile (`canon library/antagonists/book1_garrett_pike.md`) gives his first venture as a farm-to-table restaurant in the East Village (2011), with no street-cart/Red Hook origin. Decide which is canon and align the other (golden rule favors the prose, so the profile would be updated).
4. **[Minor]** LLC label format varies (`#2847` vs `2847-LLC` vs `Filing #2847-LLC`). Standardize in the chapter pass.
5. **[Opaque B-story setup — optional]** Per the new economic-pressure direction, Meal 2 could lightly reinforce Emma's financial precarity to prime the Meal 3 squeeze. Meal 1's seed may be enough. Low priority.

### Feed-model note
Meal 2 is the proof of concept for the feed-based POV. It is already written to the rule, including the Brenda excursions as the dramatic-irony mechanism. Good template for the back half.

### Carry-forward to Meal 3
- The back-half discovery beats (Tier 1 #3) depend on holding back reveals here (finding 2). Coordinate the Meal 3 rewrite with whatever Meal 2 defers.
- The economic-squeeze retaliation (new opaque B-story direction) begins in Meal 3.
- The on-page Pike beat can build on the Ch12 out-of-place-man seed.

---

## Meal 3 — Crisis (Ch13–17) — gap assessment 2026-06-15

**Question asked:** how far is Meal 3 from where it needs to be?

**Verdict: moderately off, and the distance is driven almost entirely by the opaque-secret decision, not by prose quality.** The bones (Bad Guys Close In → All Is Lost → the fight → Oliver's rally → the plan → prep) match the beat sheet and are sound. The prose is strong. But the current Meal 3 is built around the OnlyFans exposure, which runs through all five chapters, and that spine is now being removed. This concentrates the rework in Ch13–14; Ch15–17 need only light edits.

### The core problem
The exposure is load-bearing across the whole meal: Ch13's climax is the "Kinky Kitchen" note; Ch14's emotional center is Emma's confession to the group and their embrace; Ch15's "how did they find Emma?" assumes they dug up her secret account; Ch16/17 carry references ("the OnlyFans chef," "when she told them about the C&D"). Under the new direction (opaque secret; retaliation = lost assignments + revenue; Emma confides in Olivia only; full reveal deferred), the central catharsis of Ch14 is cut, and the threat mechanism changes.

### Chapter-by-chapter gap (reuse estimate)
| Ch | Reuse | What stays | What changes |
|----|-------|-----------|--------------|
| 13 Service for One | ~60% | Sofia/Dorothy silence, closed-market walk, process-server structure, the call to Olivia | Remove the "Kinky Kitchen" note; lead the retaliation with economic hits (cancelled assignments, an editor pulling her article); reframe "they found me" from *my account* to *my livelihood / me*. Natural spot for the on-page Pike beat. Fix the Mon→Wed compression and the Tuesday void. |
| 14 The Seamless Supper | ~40% | Group gathers, the Thai-order chaos, Elijah reads the doc and calls it "toothless," Noah on C&D law, Elijah's family-weight call | **Cut the group confession of "Kinky Kitchen"** (the current emotional center). Rebuild the center around the economic threat plus a **private Emma/Olivia confidence** (deeper precarity; the secret hinted, never named). |
| 15 A Bitter Taste | ~75% | "How did they know?" → Jasper's confession → the fight → Oliver's rally. This is the strongest scene in the meal and is mostly independent of the secret. | Tweak the leak logic: they connected Emma and went after her *livelihood*, not "found her anonymous account." |
| 16 The Recipe for Revenge | ~85% | The swarm plan, role assignments, Jasper's redemption mission. Emma already shows good agency here. | Reframe Emma's "I don't want to be 'the OnlyFans chef'" line to "I don't want to be the story / a martyr." |
| 17 Sharpening the Knives | ~90% | The per-character prep vignettes (a clean feed-model showcase), the bottle-palming beat | Scrub secret/C&D references; address the ~36-hour montage-timing compression. |

### Emotional-spine shift (the key creative call)
Removing the Ch14 confession removes a real high point: shame turning to acceptance. The good news is Meal 3 already has a second, equally strong emotional low that does **not** depend on the secret: the **fracture** (Jasper's betrayal + Noah's cruelty in Ch15). Recommendation: re-center Meal 3's "All Is Lost" on the fracture, with **Emma's economic fear** as her personal stakes (losing what she built, the specter of going back to PA) and the **private Olivia confidence** as the tender beat. Flag for the author: confirm this trade is acceptable — a quieter, deferred-reveal arc in exchange for the group-catharsis scene.

### Additive beats required (not in the current draft)
1. **Continued discovery (Tier 1 #3):** Meal 3 currently has zero new mystery discovery. Add at least one beat surfacing a reveal held back from Ch12 (e.g., Noah/Oliver establish the patent's full breadth, or the mogul's identity is only now confirmed). This is the main fix for the "dry back half."
2. **On-page Pike (Tier 1 #4):** Pike never appears in Meal 3. Add one beat — Emma encountering him (building on the Ch12 market seed), or a charming "offer/warning."
3. **Economic-squeeze texture:** assignments cancelled, an editor pulling her article, revenue drying up. Seed this late Meal 2 / early Ch13. **Convergence:** the previously-proposed compression fix (Emma's editor cancels the squash article with a terse note) now becomes the load-bearing retaliation mechanism. Two problems, one beat.

### What's working (protect it)
Voices and prose are strong throughout. Ch17's vignette structure is a textbook feed-model showcase. Ch15's Oliver rally is a standout and should survive nearly intact. The Jasper bottle-palming planted twist is good and stays.

### Magnitude summary
Not a from-scratch rewrite (unlike the Meal 4 stubs). Roughly two of five chapters substantially reworked (13, 14), three lightly edited (15–17), plus two or three additive beats and the standing compression fixes. The skeleton and most of the prose survive; re-engineering the secret's role is the real surgery.
