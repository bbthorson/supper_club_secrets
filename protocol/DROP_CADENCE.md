# Drop Cadence — Meal-Sized Drops on a Live Feed

**Status:** design proposal (2026-09-19), author's idea, not decided. Companion to
[`SERIALIZED_PUBLISHING.md`](SERIALIZED_PUBLISHING.md) (which set a chapter-a-day
release), [`CHARACTER_ACCOUNTS.md`](CHARACTER_ACCOUNTS.md) (which set what a post may
contain), and [`CHARACTER_PRESENCE.md`](CHARACTER_PRESENCE.md) (which set how the
accounts read as people).

This document changes **when the prose arrives**, and nothing else. No rule about what
a post may contain is loosened here. That turns out to be the whole argument.

---

## 1. The idea

Three claims, as the author put them:

1. The chapters of a meal drop together, on a weekly rhythm — not one chapter a day.
2. Between drops, the cast accounts post through the week the story is living.
3. A meal's chapters land **right after the big event at the end of that meal**.

The third one is the load-bearing one and it is easy to skim past. It means the drop
time is not a publishing convention — it is **diegetic**. The Meal 2 chapters arrive at
10:30 on a Sunday night because that is the hour the potluck broke up and everyone
walked home. The reader is handed the chapters while the characters are doing the
dishes.

## 2. What it changes, and what it must not

The existing design has one clock: story date = publish date, for prose, records and
posts alike. This proposal splits it in two.

| Lane | Clock | Cadence |
|---|---|---|
| **Cast posts** | Story clock — a post publishes on its own `storyDate` | Daily-ish, uneven, per §5 of `CHARACTER_PRESENCE.md` |
| **Prose chapters** | Drop clock — a chapter publishes at its meal's drop | 7 drops across 24 days |
| **Derived records** | Drop clock — **not** the story clock (§6.1 — this is a live bug) | With the drop |

The posts lane is untouched. The chapters lane slows down and clusters. The records
lane has to be moved onto the drop clock or it leaks, which §6.1 covers.

## 3. Why this is better than chapter-a-day

Not "different" — better, for a specific mechanical reason.

Under chapter-a-day, the feed and the prose describe the same day at the same hour. An
anchored post is a footnote to a chapter the reader already has. The post can only ever
*confirm*.

Under meal-sized drops, a post lands **days before the chapter it shadows**. The same
post, unchanged, moves from footnote to question — and then, when the drop arrives, to
a lie the reader can finally see through. `CHARACTER_PRESENCE.md` §1 already named the
thesis: *a real person's public feed is a curated lie, and we know exactly what each of
these six is lying about.* A feed that runs ahead of the prose is the only arrangement
in which a reader experiences that lie **as a lie** — believing it first, then being
shown the week underneath it.

Worked, from records that already exist:

- **Olivia, Oct 6.** Her state that day is `public`, so a post is permitted. She spends
  it being bright about the flower shop. Under chapter-a-day, Ch7 lands the same night
  and the reader sees the post and the errand together. Under drops, the post sits
  alone for five days; on Oct 11 the reader learns she was pulling Marcus for intel
  that afternoon and prying the LLC out of Oliver that night. The Oct 6 post
  retroactively becomes a performance. Nothing was written to achieve this.
- **Jasper, Oct 9.** Permitted, and he is the loudest account in the set. He posts. The
  reader does not learn until the Oct 11 drop that he called Brenda that day, and not
  until the Oct 14 drop that the call was the breach that broke the case open. Then on
  Oct 14 the account goes dark for good (`CHARACTER_PRESENCE.md` §3). A reader who
  scrolls back afterwards finds the last thing Jasper ever said, posted in public,
  hours after he did the thing he cannot take back.
- **The mundanity floor.** `CHARACTER_PRESENCE.md` §4 asks that most posts be about
  nothing, as a realness device. Under drops, "about nothing" acquires a second job for
  free: it is also the reader's only information for six days, and therefore gets read
  far more closely than it deserves. The floor stops being a cost and becomes the
  engine.

**Cost of the upgrade: zero new rules, zero new prose.** The public-register rule
(`CHARACTER_ACCOUNTS.md` §2) already forbids a post from carrying plot information, and
that rule is what makes a permanent public feed safe for a reader who arrives in
January. It stays exactly as written. The tease is produced by *sequence*, not by
content.

### The boundary this proposal must respect

The author's phrasing — posts "related to what's going to be in story" — is the one
place to be exact, because a post cannot be un-published and Bluesky has no per-reader
horizon.

> **A post may anticipate the character's day. It may never anticipate the chapter's
> information.** Mood, texture, weather, what someone is cooking, the fact that Olivia
> is talking too fast — all permitted, all zero-information. The LLC, the call, the
> letter, the name Meadowlight — never, on any date, in any lane.

This is not a new restriction. It is `CHARACTER_ACCOUNTS.md` §2 restated for a reader
who now encounters the post first. The drop model gets its anticipation from the gap,
which is why it can afford to keep the rule absolutely.

## 4. The schedule that falls out

Book 1's meals are not actually weekly — they are weekly for the first half, and then
the crisis breaks the rhythm, which is what the crisis is *for*. Forcing four equal
Sunday drops would flatten exactly the structure the book spends its middle act
earning, and would leave the Ch23–24 climax unpublished for five days behind a feed
that has gone deliberately silent.

Anchoring each drop to its triggering event instead produces this:

| Drop | Real datetime (ET) | Chapters | Story span | The event it lands behind |
|---|---|---|---|---|
| **0** | Thu Oct 1 | — | — | Front matter, cast profiles, standing places |
| **—** | Fri Oct 2 | — | Oct 2 | LLC #2847's filing record. The teaser, diegetic |
| **1** | **Sun Oct 4, 22:30** | 1–5 | Oct 4 | The first supper, and the plan |
| **2** | **Sun Oct 11, 22:30** | 6–12 | Oct 5–11 | The potluck. False victory |
| **3** | **Wed Oct 14, 23:45** | 13–16 | Oct 12–14 | The letter, the confession, the fight, Jasper leaves |
| **4** | **Fri Oct 16, 21:00** | 17–18 | Oct 14–16 | The campaign launches |
| **5** | **Sun Oct 18, 22:30** | 19–22 | Oct 16–18 | Meadowlight surfaces in a bar in Pennsylvania |
| **6** | **Tue Oct 20, 22:00** | 23–24 | Oct 20 | Hank found. The rebuttal lands. Investors distance |
| **7** | **Sun Oct 25, 21:30** | 25 | Oct 25 | The Family Meal |

Read the left column as a shape and the design argues for itself: **Sunday, Sunday —
then the rhythm breaks** (Wednesday, Friday) — **then a Sunday that is Jasper alone in a
dive bar** — **then a Tuesday that is the whole book paying off** — **then Sunday,
restored, and it is the Family Meal.** The release cadence dramatizes the story's own
structure. Four of the seven drops are Sundays, which is the rhythm the reader is being
taught, and the three that are not are the three times the supper club loses it.

Two honest wrinkles, both small:

- **Drop 3 at 23:45 Wed** is a few hours inside Ch16, which runs "late night →
  overnight." The alternative is Thursday morning, which trades the best cliff in the
  book for an hour of tidiness. Take the slack.
- **Drop 5 at 22:30 Sun** sits inside Ch22's "night." Same trade, same answer.

Optional refinement, not required: split Drop 1 — Ch1 alone at ~14:00 Sunday (Emma
finds the stall empty), Ch2–5 at 22:30. The afternoon gap is the only moment in the
book where the reader knows the hook and the cast does not.

## 5. What carries the days between drops

The gaps run 2–5 days. Something has to be in them, and the book's own design has two
long silences that fall in exactly the wrong places:

- **Oct 12–17** — the crisis. `CHARACTER_ACCOUNTS.md` §2 requires the feed to read as
  near-silent here.
- **Oct 21–24** — off-page in the book. Completely silent by design.

Under chapter-a-day those silences were free, because prose arrived daily regardless.
Under weekly drops they stack: a strict four-Sunday schedule would give the reader
*nothing on either surface* for most of week 3. That is where a serialized audience
leaves.

The schedule in §4 is built to prevent it, and the rule is worth stating explicitly:

> **The two cadences are complementary, never simultaneous. When the feed goes quiet,
> the prose arrives.** Drops 3, 4 and 6 sit inside the crisis silence. Drop 6 hands the
> reader six chapters to carry the dead days of Oct 21–24, ending on the win, with only
> the Family Meal withheld.

## 6. What the idea breaks, and what it costs

### 6.1 The record lane is on the wrong clock (a real leak, not a style note)

`tools/publish_records.mjs` defaults its horizon to **today**, and
`.github/workflows/publish-records.yml` runs it daily. That is correct under
chapter-a-day and wrong under drops.

A `character.stateEvent` is only reader-safe *at horizon* because the reader of that
day's chapter already knows its content (`CHARACTER_ACCOUNTS.md` §2). Decouple the
chapter from the date and that justification evaporates. Concretely: on Oct 12 the
daily run would publish Emma's Oct 12 state event — post-victory glow curdling into
Sofia's silence — to her permanent public repo, two days before Ch13 is readable. Same
for Meadowlight's `place` record, which `SERIALIZED_PUBLISHING.md` explicitly requires
not to exist before it is named on the page.

**Fix:** the publish horizon becomes *the latest story date covered by a dropped
chapter*, not the current date. Derived from the drop schedule, so it advances in steps
with the prose and never ahead of it. Small change; invisible failure if missed;
published under permanent identities, where it cannot be quietly corrected.

### 6.2 Tier B stops being optional

`CHARACTER_ACCOUNTS.md` §7 recommends launching Tier A plus the eight anchored posts
and stopping, and lists the ambient lane as "the first thing to cut against the date."

**Under this proposal that recommendation inverts.** With drops, the feed is the only
surface the reader has on 17 of 24 days, so it *is* the retention mechanism. Six
accounts producing three posts between them across a six-day gap is not a quiet week;
it is a dead run.

Worse, the lead effect §3 depends on is mostly not in the anchored posts. Of the eight,
four fall on Oct 4 and two on Oct 11 — the drop days themselves, hours of lead at most.
Only Olivia's Oct 6 and Jasper's Oct 9 land meaningfully ahead of their chapters.
**The value of this idea lives almost entirely in the ambient lane** — the lane
currently marked for the chop. That is the single most important consequence in this
document.

Revised content estimate: the ambient lane fattens across Oct 2–11, where it is both
legal and spoiler-free, to roughly three or four posts per character per week, keeping
the taper after Oct 12 untouched. Call it **35–45 short posts** total, against the ~20
of the current plan and the 60–100 of the original guess. Still an afternoon or two of
authoring, not a month — but it is no longer cuttable, and the pre-book backfill
(`CHARACTER_PRESENCE.md` §5) gets more load-bearing, not less, because a reader
arriving Oct 4 lives inside these feeds for a week before the second drop.

### 6.3 Build timing

The site's drip is per-chapter `publishDate`, evaluated at **build time**
(`site/src/components/BookMenu.astro`, `FrontDoor.astro`,
`pages/books/[book]/read/[chapter].astro`). A chapter appears when the site rebuilds,
not when its timestamp passes. Today's workflow has one daily cron at 12:00 UTC.

Seven late-evening drops need seven scheduled builds at their drop times (plus the
daily records run, which stays). Cron entries or one dispatch per drop; either is
minutes of work. A drop that fires twenty minutes late is not a problem — but a drop
that does not fire until the following morning is the whole conceit lost for that meal,
so each drop wants a manual fallback and someone awake.

### 6.4 What it does not break

- **The public-register rule** — untouched, and more load-bearing than before.
- **Permanence** — a spoiler-free feed is spoiler-free in any reading order. Unchanged.
- **The per-reader horizon on our own site** — chapter-integer based, unaffected.
- **Prose lock** — still required through the run, for the same reason.
- **The 2026 calendar alignment** — the drop dates are all real 2026 weekdays; the
  Sunday rhythm in §4 exists *because* of the alignment and dies with it.

## 7. Recommendation

**Adopt it.** It is a better release design than chapter-a-day for this specific book,
and the reason is not novelty: it makes the cast accounts do narrative work that the
chapter-a-day schedule structurally prevented them from doing, without changing one
word of what a post is allowed to say.

Adopt it with three conditions, in order of how quietly they fail:

1. **Move the record lane onto the drop clock** (§6.1). This is not optional and it is
   not a preference. It is the difference between a horizon-safe publish and stateEvents
   leaking days ahead of their prose under permanent DIDs.
2. **Fund the ambient lane** (§6.2). Cutting it under this model is not a trim, it is
   removing the only thing in the gaps.
3. **Keep the event anchors, not the calendar grid** (§4). Four equal Sundays would
   strand the climax and stack the silences.

### Against the date

It is Sept 19. Accounts are due Sept 25 per `CHARACTER_PRESENCE.md` §7, prose is locked,
and preflight (`CHARACTER_ACCOUNTS.md` §6) is the real gate. This proposal moves work in
both directions: it *reduces* publishing-mechanism work (seven builds instead of
twenty-four daily reveals, and the drop schedule is a small table) and *increases*
content work (§6.2, another 15–25 short posts, all of which must pass canon-check and
the register lint).

That trade is affordable only because every one of those posts is zero-information by
construction and can be written against locked prose. If it is not affordable, the
correct cut is **not** the ambient lane — it is the schedule: fall back to chapter-a-day
and keep the eight anchored posts. Chapter-a-day with a thin feed works. Weekly drops
with a thin feed does not.

## 8. Open questions (author)

1. **Seven drops or four?** §4 recommends seven, event-anchored. Four equal Sundays is
   simpler to explain to a reader and worse for the book.
2. **Split Drop 1?** Ch1 at Sunday midday, Ch2–5 at night (§4, refinement).
3. **Ambient-lane budget.** Three-to-four posts per character per week across Oct 2–11
   is the §6.2 estimate. Does the author want to read all ~40 before Oct 1, or approve a
   week at a time during the run?
4. **Late-night operator.** Drops 3 and 5 land near midnight ET. Automated with a manual
   fallback, or is someone awake for each one?
5. **Does the site announce the schedule?** A published drop calendar ("next: Sunday,
   10:30pm") sets the appointment and makes the gaps feel designed rather than stalled.
   It also tells a reader that Wednesday's drop is coming, which is itself a mild
   structural spoiler — the reader learns the rhythm is about to break before the
   characters do.
