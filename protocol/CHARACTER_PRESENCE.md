# Character Presence — Making the Accounts Read as People

**Status:** design, 2026-09-18. Companion to
[`CHARACTER_ACCOUNTS.md`](CHARACTER_ACCOUNTS.md), which settles what a post may
*contain*. This document is about what makes six accounts read as six people rather
than as one author's puppets.

Nothing here requires inventing new characterization. The repo already contains a
near-complete specification for these accounts; it is just filed under a heading
nobody has connected to publishing yet.

---

## 1. The thesis

**A real person's public feed is a curated lie, and we know exactly what each of
these six is lying about.**

That is the whole trick. An account feels fake when it is transparent — when the feed
is a faithful readout of the character. Real feeds have a shape carved by everything
the person is choosing not to say, and a reader can feel that shape without being able
to name it.

`lore/02_character_voice_guide.md` gives every character three registers, a
**Contradiction Engine** (a Surface and a Hidden), and — the useful one — a **Silence
& Deflection** section listing precisely what they will not discuss and how they
change the subject.

A social account is the Surface register, permanently. The Silence & Deflection list
is therefore not background colour: **it is the posting specification**, already
written, per character, in the character's own terms.

---

## 2. Silence and deflection as the posting spec

Lifted directly from the voice guide, reread as account rules:

| Character | Never posts about | Deflects by |
|---|---|---|
| **Emma** | Money. Why she left Bistro Lavande. Anything personal when it gets close. | Going into the kitchen — the feed becomes technique when the subject becomes her |
| **Elijah** | His family, his past, how he feels about work. | Checking his phone — in feed terms, not posting at all |
| **Noah** | Feelings, aesthetics, the sneaker collection. | Declaring a problem unfixable and moving on |
| **Oliver** | His online life. Any variant of Reddit or Wikipedia. | Letting Olivia speak — replying to her rather than posting himself |
| **Olivia** | Her own feelings. Anything serious, for long. | Gossip. "Speaking of disasters, did I tell you about—" |
| **Jasper** | His family. What he actually does for work. | A joke, or sudden interest in his phone |

Every one of those is mechanically enforceable as a lint, and every one of them is a
piece of characterization a reader can feel without being told.

The Contradiction Engine then supplies the texture. The account is the Surface; the
Hidden never appears in words, and shows up at most three or four times across the
book as something a reader can catch but not prove:

- Noah's Hidden is aesthetic consumerism. So a sneaker box is visible, out of focus,
  in the background of a photo about a keyboard. It is never mentioned, never
  acknowledged, and appears perhaps three times in twenty-four days.
- Emma's Hidden is that she is risk-averse and broke. So her feed is abundance —
  beautiful food, generous hosting — published by a woman the reader knows from
  Chapter One cannot make rent. **The gap between her feed and her situation is the
  characterization**, and it requires writing nothing extra.
- Oliver's Hidden is a prolific, respected online life under another name. So his
  account is nearly empty. That is not an absence of content; it is the content.

---

## 3. The six accounts

Cadence, subject, tell. These are voice profiles for the feed, derived from the voice
guide and the group dynamics, and they are what makes the accounts distinguishable
with the names covered up.

### `@emmacooks` — highest effort, second-highest volume
Three or four posts a week, and they look *worked on*, because in canon she is
explicitly building her brand. Food, process, market hauls, the thing she is testing.
Competent and warm and slightly performed.

**The tell:** her Western PA dialect surfaces under pressure. One post, late at night,
that says "needs washed" instead of "needs to be washed" — never explained, never
repeated. One word. Readers who have registered her voice catch it; nobody else
notices anything.

Place it on **October 15**. Emma is off-page that day, so the public-register rule
permits a post; it sits inside the crisis window, so the pressure is real; and a
dialect slip carries no information, so it is safe in a feed that can never be
un-published. The two rule sets compose here rather than fighting — which is the test
of whether they are the right rules.

**The slip:** she repeats a dish. Real feeds repeat, and a repeated cheap dish says
something about the B-plot that she would never post.

### `@oliviaknows` — highest volume, most reactive
Several posts on a good day. People, not things: the flower shop, the tailor, the
woman at the market. She replies and quote-posts more than she posts.

**The tell:** her crisis behaviour is *overdrive*, not silence. During Oct 12–17,
while the group is coming apart, Olivia's feed gets **lighter** — a new coffee place,
a dog she met. A reader who has read those chapters watches her performing fine in
public, which is exactly the Under Pressure register the voice guide gives her.

**The slip:** a post that begins as genuine concern and pivots to a joke halfway
through.

### `@jasper` — erratic, and then gone
Nothing for four days, then eleven posts in ninety minutes. Lowercase. Unclosed
parentheses. The only one of the six who visibly deletes and reposts.

**The tell:** the reversal. His Oct 14 state is `under-pressure (the reversal — goes
quiet)`. So the account goes **completely dark from Oct 14 to the end of the book**.
The loudest account in the set going silent is the single strongest beat available
across all six feeds, and it consists of writing nothing at all.

### `@noahbuilds` — low volume, bursty, opinionated
A strong take on a trivial technical question, then nothing for five days.

**The tell:** the sneaker box (§2). **The slip:** "that's a beautiful design," about a
piece of hardware, immediately followed by two sentences of technical justification
for having said it.

### `@elijahmiller` — the quietest but one
Once a week at most. Mostly replies. A dry one-line observation that lands like a
punchline and is never followed up.

**The tell:** his bio says "mostly here to observe" and the account means it
literally. The realness is that it never gets louder, not once, no matter what is
happening.

**The slip:** one post, late, about land — space, upstate, getting away — undercut
within the same post. "Anyway."

### `@oliverreads` — almost empty, and that is the point
Three or four posts across the entire book. Possibly two. Mostly replies to Olivia.

Then, once, someone asks him a direct question about zoning and he produces a thread
that is genuinely too long for the platform, visibly animated, five posts deep in
municipal history — ending with "sorry, rambling."

**An almost-dead account belonging to someone whose real internet life is happening
elsewhere under a different name is one of the truest things on social media**, and
this cast has it written into canon already.

---

## 4. Mechanical realness

Five things that cost almost nothing and do most of the work.

**Cadence asymmetry.** If all six post on the same days at the same rate, they read as
one author. The ratios above — Olivia many, Oliver almost none — should be visible in
the first week.

**Timestamps that are not round.** Chapter frontmatter carries a `time:` field
("morning → afternoon", "late evening"). Post times derive from it and land at 7:14am
and 11:52pm, never on the hour. Emma's alarm goes off at 6:30 on a Sunday in Chapter
One; her market posts should look like it.

**A mundanity floor.** If every post is plot-adjacent the feed reads authored. Most
posts should be about nothing. The 91 off-page character-days in
`CHARACTER_ACCOUNTS.md` §2 are where the nothing lives.

**They talk to each other.** The `mentions` field exists and the bios already
cross-reference — Oliver's names Olivia, hers names him. Cast-to-cast replies are the
highest-value realness signal available and they cost no new content, because a reply
is shorter than a post.

**A follow graph with a shape.** Olivia follows everyone and everything local. Oliver
follows nine accounts. Elijah follows four. This is visible on every profile page and
takes one afternoon to set up once.

---

## 5. Give the accounts a past

This is the largest single lever and it is not in any existing document.

An account created on October 1st whose first post is October 4th looks like a
marketing launch, because that is what it is. Real accounts have history — thin,
boring, inconsistent history.

**Backfill five to eight posts per character across August and September 2026**,
before the book starts. They establish each character's cadence signature so the
October posts land inside an existing rhythm. And they are the safest content in the
entire project: dated before Chapter One, they cannot spoil anything, they do not
touch the locked prose, and they can be written today.

They also do real work. Emma's August is a summer menu and one post about a catering
gig that clearly did not pay well. Oliver's entire September is two posts. Jasper has
a four-day run in August about something that turned out to be nothing — establishing,
before the reader meets him, that his theories are usually wrong.

**One thing to verify before relying on this.** atproto records carry a settable
`createdAt`, and the intent is that backdated posts appear in the account's history at
their stated date. Whether the Bluesky app and its feeds actually display and order
them that way should be **tested on a throwaway account before any cast account is
created**. If backdating does not display as expected, the fallback is to create the
accounts earlier and post the backfill in real time across late September — which
means account creation moves up, not that the idea dies.

---

## 6. What the accounts look like

The one decision here that is genuinely the author's, because it has no correct
technical answer.

**Recommendation: no faces, on any of the seven accounts.**

Three reasons. A face is the most deceptive element available — the fiction label in
the bio is doing exactly the work of preventing these from reading as real people, and
a generated or stock portrait of a person who does not exist works against that label
harder than anything else on the profile. The brand direction is "The Menu" — objects,
type, redaction, dotted brass leaders — and portraits are not in it. And object
photography in the locked palette is distinctive in a way that six portraits would not
be.

One object per character, shot the same way, in Linen and Espresso with the single
Hot Sauce pop:

| Account | Avatar |
|---|---|
| `@emmacooks` | A scarred wooden cutting board, used |
| `@oliviaknows` | A table set for six, mid-conversation — two glasses moved |
| `@oliverreads` | A stack of municipal binders |
| `@noahbuilds` | One t-shirt on a hanger |
| `@elijahmiller` | A legal pad, numbers in columns, close crop |
| `@jasper` | A corkboard with too much on it |

Banners take the wordmark treatment from `protocol/brand/BRAND.md`. Every bio is the
character's existing `personaPublic` frontmatter, unedited — it was written for this
and it is already in the right voice — plus the fiction disclosure and link.

---

## 7. What the author has to do

Ordered by what blocks what. Everything not on this list is Claude's.

1. **Create the seven accounts, generate app passwords, and export the PLC recovery
   keys.** Blocks everything, cannot be delegated, and the recovery keys are the
   irreversible part (`CHARACTER_ACCOUNTS.md` §4). If the October 2 date is being
   held, this wants to be done by **September 25** so there is a week for the rest.
2. **Decide the avatars.** §6 is a recommendation, not a decision. Six images either
   commissioned, shot, or made from the brand kit.
3. **Approve the voice of the first posts.** Eight anchored posts and the backfill,
   written here and read by the author before any of them exist publicly. This is the
   author's call in a way none of the infrastructure is — these are new canon in the
   characters' own mouths.
4. **Two open yes/nos** carried over: the Tier C artifact accounts (the commentator,
   the critic, Pike's restaurant group) and the Oliver easter egg. Both are
   deferred-by-default and both are better as Book 2 material than as launch material.
5. **The October 2 go/no-go**, with §5's backdating test as an input.

---

## 8. What ambition costs against the date

Being ambitious and hitting October 2 are compatible, but only with one cut and one
addition.

**Cut Tier C.** The antagonist artifact accounts are the highest-risk surface in the
project — a fabricated development scandal on a public network — and they are the
wrong thing to build under deadline. They are also the least load-bearing: the Ch 20
and Ch 24 posts already exist verbatim in the prose, and they will still be there for
Book 2.

**Add the backfill.** It is the biggest realness gain available, it carries no spoiler
risk, it does not depend on the locked prose, and it is the one piece of content that
must exist *before* launch rather than during it.

That leaves: seven accounts, the pre-book backfill, eight anchored posts, the ambient
lane, cast-to-cast replies, and Tier A's record routing. It is a real launch and it is
two weeks of work, of which the author's share is item 1 and item 2 above.

If the accounts do not exist by September 25, the honest move is to let the 2026
calendar alignment go and bring the whole thing up properly for Book 2 — which is
Oliver's book, and Oliver is the character whose relationship with being online is the
plot.
