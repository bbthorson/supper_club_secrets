---
type: SeriesPlan
title: "Supper Club Secrets — Series Plan (Books 1–6)"
description: Series overview, locked decisions, the per-book index, and cross-book threads. Per-book detail lives in codex/books/.
tags: [series-plan, index]
timestamp: 2026-06-15T00:00:00Z
id: series-plan
---

# Supper Club Secrets — Series Plan (Books 1–6)

This is the series overview and index. **Per-book detail now lives in [`codex/books/`](books/)** — one `Book` concept per file. Update individual book files there; keep this file for the series-level frame.

## Series Overview

Six friends along Brooklyn's G line solve neighborhood mysteries over weekly dinner parties. Each of the first six books centers on one character, peeling back their layers while the group's reputation quietly grows from "that was a weird coincidence" to "those are the people who fix things."

**Structure:** Every book follows a four-meal format over the course of one month. Meals map loosely to Save the Cat beats: Setup → Investigation → Crisis → Resolution.

**Setting:** Brooklyn and Queens, loosely along the G line — Williamsburg, Greenpoint, Bushwick, Carroll Gardens, Park Slope, Fort Greene, and potentially into Astoria.

**Tone Dial:** 1–10 scale. Most scenes sit at 3–5. Crisis peaks at 6–7. Never exceeds 7 across the series.

**POV:** Emma remains primary POV throughout all six books (feed-based; she observes through food, kitchen metaphors, and her particular blind spots). See `ai_instructions.md` §5.

---

## Locked Decisions

| Decision | Detail |
|----------|--------|
| Book order | Emma → Oliver → Elijah → Olivia → Noah → Jasper |
| Monthly progression | Oct → Nov → Dec → Jan → Feb → Mar |
| Structure | 4 meals per book, one month timespan. Chapter count is not a target. Quick, crushable reads; brief chapters used for pace, notably in the Meal 3 crisis. |
| Hosting rotation | See individual book files |
| Olivia/Oliver | Never in succession as focal characters |
| Jasper | Last — his secret (old money) is the biggest series reveal, and the **first full secret payoff in the series** (Emma's stays opaque in Book 1) |
| Reputation arc | Books 1–2: stumbling into it. Books 3–4: people start noticing. Books 5–6: known quantity along the G line. |
| Loose connectivity | Minor characters recur across books. No serialized "big bad," but names and neighborhood changes thread through. |
| Future books (7+) | Main characters may be absent; minor characters can step into larger roles. |

---

## Books (index)

| Book | Focal | Month | One-line | File |
|------|-------|-------|----------|------|
| 1 — The Case of the Missing Hot Sauce | Emma | Oct | A vendor vanishes; the group uncovers developer Garrett Pike's land grab | [book1.md](books/book1.md) |
| 2 — TBD | Oliver | Nov | A bureaucratic squeeze forces G-line businesses out; Oliver's secret online life is key | [book2.md](books/book2.md) |
| 3 — TBD | Elijah | Dec | A community credit union is being asset-stripped | [book3.md](books/book3.md) |
| 4 — TBD | Olivia | Jan | A past contact is accused of art fraud; rotating-home dinners | [book4.md](books/book4.md) |
| 5 — TBD | Noah | Feb | A beloved neighborhood app is being weaponized | [book5.md](books/book5.md) |
| 6 — TBD | Jasper | Mar | Stolen legacies laundered through philanthropy lead into Jasper's family | [book6.md](books/book6.md) |

---

## Cross-Book Threads

### Recurring Minor Characters
| Character | Book 1 | Book 2 | Book 3 | Book 4 | Book 5 | Book 6 |
|-----------|--------|--------|--------|--------|--------|--------|
| Hank | Central | — | — | — | — | Cameo (market reopens) |
| Dorothy | Intro | — | Central (loan crisis) | — | — | — |
| Sofia | Intro | Central (shop threatened) | — | — | Returns (review-bombed) | — |
| Marcus | Intro | Possible | — | Returns | — | — |
| Brenda Marquez | Intro | — | Possible | — | — | Returns |
| Garrett Pike | Central (on-page) | Possible (did his lawyers pioneer the squeeze?) | — | Possible (restaurant opening) | — | Possible (Jasper's family orbit) |

### Character Secret Progression
| Character | Secret | Introduced | Cracked Open | Fully Revealed |
|-----------|--------|-----------|-------------|----------------|
| Emma | Secret income source (kept opaque) | Book 1 (oblique hints only) | — | **Deferred to a later book** (not revealed in Book 1) |
| Oliver | Online life | Book 1 (hints) | Book 2 | Book 2 (partially — Jasper suspects) |
| Elijah | Family compound dream | — | Book 3 (seeded) | Later book (TBD) |
| Olivia | Anxiety about Oliver | — | Book 4 | Book 4 (internal, not voiced) |
| Noah | Sneaker collection | Book 1 (hints via different shoes) | Book 5 | Book 5 |
| Jasper | Old money | Book 1 (hints) | Books 2–5 (accumulating clues) | Book 6 (series' first full payoff) |

### Neighborhood Evolution
The G line corridor changes across six months. Track: what opens, what closes, what shifts. The supper club isn't just solving mysteries — they're witnessing and participating in the life of their neighborhood across half a year.

---

## Open Questions for Future Development

1. **Working titles** — Each book needs a food-related title that hints at the mystery
2. **POV evolution** — Does Emma remain sole POV for all six books, or do we experiment with dual POV in later books?
3. **Book 7+ direction** — Which minor characters are strong enough to step into focus roles?
4. **Halloween revisit** — A short story or novella set during Book 1's October that we skipped?
5. **Garrett Pike** — He's not destroyed in Book 1, only stalled. Does this thread resurface (Books 2/4/6 touchpoints above), or stay resolved?
6. **Emma's deferred secret** — Pick the book and occasion for its eventual reveal.

## Craft Notes Carried Forward from Book 1 (2026-07-12 audit)

- **Red herrings need real page-time.** Book 1's false leads (the Ch4 theory competition) were comically dismissed in-chapter; every investigated thread turned out correct. Accepted for Book 1 as a howdunit/whydunit — but from Book 2 on, give at least one mid-book lead a plausible wrong turn that gets investigated and cleanly eliminated by evidence (per ai_instructions.md §6's 2–3 legitimate red herrings).
- **Olivia's Book 4 payoff must land harder for the runway she got.** Her Book 1 micro-arc intentionally ran in service of others (comforting Emma, managing Oliver, running the network) with only one crack of vulnerability (Ch20) — she is the least visibly changed of the six by book's end. Book 4 needs to convert that restraint into payoff.

### Added 2026-09-19, from a mechanical prose pre-pass over the locked Book 1

All four are Tier 3 — the author's call. Carve-outs were checked against
`lore/02_character_voice_guide.md` and `codex/characters/*.md` before flagging
anything; where a beat turned out to be catalogued it is named below as *not* a
finding.

**Two were acted on in Book 1** (author reopened the lock on 2026-09-19); each is
marked *Addressed* below, with the edit. A third was attempted and reverted — see
the negative-parallelism note for why, because the reason generalises. The other two are structural or
diffuse and are Book 2 guidance only — deleting instances would not fix either,
and would move the voice more than it fixed the rhythm.

- **Half the chapters close on the narrator explaining what the scene meant.**
  The 2026-09-17 pass named seven "chapter buttons" and rewrote two. Read by
  *move* rather than by length, the count is higher: roughly twelve of
  twenty-five closers end with the narrator summarising emotional significance
  (Ch4, 5, 6, 8, 9, 11, 16, 18, 21, 23, 24, 25), against eight that close on
  dialogue and five on a concrete image or an in-scene action. Cozy crime wants
  a satisfying beat at a chapter break and none of these is wrong on its own —
  but at half the book it is a rhythm, and the taxonomy's "perfect symmetry"
  entry is about exactly this. Ch12's rewrite is the model: it kept the dread
  and moved it inside Jasper's own experience. **For Book 2: aim for a third of
  closers on the summarising move, not half, and prefer the concrete image —
  Ch19's "the car that smelled like wet dog and freedom" carries more than any
  of the summaries do.** *Not addressed in Book 1, deliberately: a closing-move
  distribution cannot be changed by word edits, only by rewriting endings.*

- **The same temporal frame announces twenty-two turning points.** Sentence-initial
  uses number nine — `For the first time since/in …` six times (Ch6, 9, 14, 18,
  21, 25), `For once` twice (Ch12, 23), `For one evening` once (Ch18) — and four
  of those nine are the final beat of their chapter (Ch9, 18, 21, 23). A further
  **thirteen** run mid-sentence in lowercase (Ch15 ×3, Ch16 ×3, Ch18, Ch20, Ch22,
  Ch23 ×2, Ch24, Ch25), which the first count missed because it only matched a
  capital `For`. Twenty-two uses in ~41,700 words is one every 1,900. It is one rhetorical gesture, "this is the
  moment something changed," reused as the default way to mark a turn. No
  word-level grep predicts it, because the words differ every time; only reading
  the closers together shows it. Ch21 stacks it with a negative-parallelism close
  in the same paragraph ("For the first time since Brooklyn … it didn't feel like
  trouble. It felt like use."), which makes it the most formula-shaped closer in
  the book. **For Book 2: treat `For the first time…` as spent. Let the turn show
  in what the character does next.** *Not addressed in Book 1, deliberately:
  each of the nine is defensible in its own chapter — Ch6's is an honest turn.
  The defect is that it is the only tool the book reaches for to mark a change,
  and inventing nine alternatives retroactively would move the voice more than
  it fixed the rhythm.*

- **An uncatalogued somatic default carries Emma's warmth beat, twice, nearly
  verbatim.** Ch2: "Emma watched them eat and felt something loosen in her chest.
  This was the reaction she'd been hoping for." Ch12: "Emma watched her friends
  eat and felt something loosen in her chest. This was why she cooked." Same
  subject, same action, same somatic carrier, same `This was…` follow-on, ten
  chapters apart, both at a supper. Ch19 uses the chest a third time for Jasper.
  Not in the voice guide and not in any character file, so the carve-out does not
  apply — this is the "recycled physical tell" the SCS calibration calls the
  highest-value thing to watch, and with six recurring characters eating together
  every few chapters it is the easiest one to spread. A second pair: the
  greenhouse "held its breath" in Ch23 and the apartment was "holding its breath"
  in Ch24, one chapter apart, the same personification. **For Book 2: give each
  character a different physical vocabulary for relief, and keep a running list
  of which one has already been used for it.**
  *Addressed in Book 1:* Ch2's instance became "stopped rehearsing the apology
  she'd had ready" — Ch12's was left alone because it carries the thematic "This
  was why she cooked. Not the technique, not the plating" that the 2026-09-17
  pass kept as earned anaphora. Ch23's "the greenhouse held its breath" became
  "he let the silence stand", which also avoids doubling the greenhouse
  personification the same chapter's closer already uses. **Still open:** Ch12
  ("loosen in her chest", Emma) and Ch19 ("loosening in his chest", Jasper) are
  seven chapters apart with different subjects — weaker than the pair that was
  fixed, but the same carrier twice.
  *Checked and NOT a finding:* Oliver pushing his glasses up (Ch3, Ch25) is
  catalogued at `codex/characters/oliver.md:96` and is designed. Oliver's
  `quietly` register accounts for four of Ch25's seven magic adverbs and is
  likewise designed.

- **Ch15 is the book's negative-parallelism cluster.** Four distinct instances in
  2,177 words — "not because it was bad, but because it wasn't theirs. It was
  someone else's cooking", "Not loud, but clear", "wasn't defensive and it wasn't
  performance. It was the genuine…", "This wasn't a mystery anymore. This was
  their friendship…". Book-wide the device is well short of a tic, and the
  2026-09-17 pass was right to leave the earned uses alone; the finding is the
  local density, and the taxonomy tiers a device "clustered heavily in one"
  chapter as a slip. Ch15 is the emotional low point, so the reach for a
  corrective cadence is understandable. **For Book 2: at the equivalent beat,
  keep one and let the others be plain statements — the device loses its force
  when the chapter around it is already built from it.**
  *Attempted and reverted in Book 1, deliberately:* the "wasn't defensive and it
  wasn't performance" sentence was briefly shortened to "and the performance was
  gone", and that was wrong on two counts. Ch16 already lands "for once there was
  no performance in it" one chapter later, so it created a tighter repeat than
  the one being fixed *and* spent Ch16's payoff early. More importantly,
  **Jasper's performance dropping away is a tracked arc beat, not loose
  phrasing** — Ch19's `registers:` carries "the loneliness under the
  performance", Ch22's threads carry "The performance stripped away", and the
  outline tracks it too. The arc strips the performance in the back half; Ch15 is
  where it *cracks under pressure*, which is a different beat. All four
  instances stand. **For Book 2 the guidance above still holds — but check any
  repeated phrase against chapter frontmatter before cutting it, because a motif
  the tracking is steering reads exactly like an accidental repeat from the
  prose alone.**

---

## Future Concept: South Slope Sleuths (Post–Book 2 Spinoff)

**Status:** Early idea, not locked. One possible answer to Open Question 3 (Book 7+ direction).

**Pitch:** At the close of Book 2, a press event (building on the Book 1 social-media attention plus Book 2's bureaucratic-squeeze story going public) puts the Supper Club's amateur-sleuthing in the open. A group of friends in a different neighborhood hears about it and decides to replicate the model — they meet over pinball instead of dinner and start investigating their own neighborhood mysteries. Becomes a separate but connected offshoot series, with crossover characters showing the "export" of the SCS cast into other stories.

**Open questions to resolve before this becomes canon:**
- Crossover direction — do Sleuths characters cameo into G-line books, or do SCS characters cross into South Slope, and whose POV carries it?
- Is "South Slope" a real/adjacent NYC micro-neighborhood distinct from Park Slope, consistent with the existing G-line setting list?
- Tone — same "stumbling into it" energy as early SCS books, or more self-aware/parody-adjacent since this group knows SCS already exists?
