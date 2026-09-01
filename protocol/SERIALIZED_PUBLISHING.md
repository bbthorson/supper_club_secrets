# Serialized Publishing — Real-Date Release with a Canon Horizon

**Status:** design proposal (2026-09-01). No decision, nothing built. Companion to
`ARCHITECTURE.md`, `SPACES.md`, and `CHARACTER_WEIGHTS.md` — this doc takes the
"canon horizon" idea from §12.7 and applies it to *releasing Book 1 itself*.

## The idea

Book 1's internal calendar is **October 2–25, 2026** — and the real calendar is about
to be October 2026. The ledger's anchor (Week 1 Sunday = Oct 4, chosen 2026-05-23)
means every story date lands on the correct real weekday **this year only**: Oct 4,
11, 18, 25, 2026 are all real Sundays. Publish each chapter on the day it takes
place, and the book happens in real time.

Alongside the prose, the record layer publishes on the same clock: as each chapter
goes live, the character stateEvents, scene records, and place records *derived from
that chapter* publish to the lexicon. Readers (and anything built on the AT Protocol
data) watch the characters' states update as the story unfolds — the "internal
register → published lexicon" split the author asked for.

## The two lanes (this is the whole design)

| Lane | Contents | Where it lives | Gate |
|---|---|---|---|
| **Internal register** | Tracking layer (`character_matrix`, `timeline_ledger`, `subplot_threads`, `interiority/`), codex secrets, chapter frontmatter's authorial metadata (clues, beats, audit notes), full compiled records | This repo, never published | — |
| **Published lexicon** | Prose chapters + reader-safe records derived from *published* prose | PDS / site | **Canon horizon**: a record publishes iff its `storyDate` ≤ horizon date, and only reader-safe fields |

Two invariants, both already house rules extended one step:
1. **Horizon rule:** nothing derived from an unpublished chapter is visible. The
   horizon only moves forward (monotonic) — an un-publish is a breaking event, not a
   normal operation.
2. **On-page rule:** a published record may contain only facts a reader of the
   published chapters could know. This is the Golden Rule's public face: prose is
   truth, and *published* prose is the only truth readers get.

## What's already safe vs. what leaks (verified against `records/`, 2026-09-01)

- **`character.profile`** — safe as-is. Compiled profiles carry `oneLine` bios only
  (checked: Emma's record has no secrets; the codex files' secrets don't compile out).
- **`character.stateEvent`** — safe *at horizon*. Each event has `storyDate`,
  `register`, and a `state` string derived from chapter frontmatter; the states
  describe on-page beats, including sanctioned feed-excursion dramatic irony (e.g.
  Brenda's Ch10 "recognizes the LLC; warns Jasper" — the reader of Ch10 knows this).
  Gate by `storyDate` and they publish clean.
- **`scene`** — **leaks.** Two fields are authorial metadata, not reader knowledge:
  `beat` (Save-the-Cat labels — Ch12's "Midpoint / False Victory" tells a serialized
  reader the victory is false *on the day they read it*) and `primaryEvent` (compiled
  from `beat_purpose`, which routinely names the reversal being seeded). **Fix:**
  the publish profile either omits `beat`/`primaryEvent` or replaces `primaryEvent`
  with a reader-safe `summary` field authored per chapter. Omission is the safe v1.
- **`place`** — safe, with one check: location files carry `blurbPublic` (already a
  public/private split); publish `blurbPublic`, not `Details`. Gate first appearance
  by horizon (Meadowlight's record must not exist before Oct 20).

## Mechanism (small, and mostly exists)

Pinakes already compiles everything with `storyDate`/`createdAt` stamped. The new
piece is a **publish profile** — a filter over compiled records, not a new compiler:

```
pinakes compile                        # full internal records (unchanged)
publish --horizon 2026-10-11           # → records where storyDate ≤ horizon,
                                       #   spoiler fields stripped, pushed to PDS
```

Whether that's a Pinakes flag or a ~50-line script over `records/` is an
implementation detail; the script version needs nothing from the Pinakes repo.
Editorial revisions after release (like today's pass) flow naturally: re-edit →
recompile → re-publish at the current horizon; AT Protocol records are mutable by
rkey, so corrections propagate.

## The release calendar falls out of the story

- **Oct 1 (Thu)** — launch: front matter, cast profiles (`oneLine` bios), the
  standing places (markets, shops). No story yet.
- **Oct 2 (Fri)** — the one dated fact in the book: LLC #2847's filing. Publishing
  *the antagonist's paperwork* as the first record, two days before Ch1, is the kind
  of teaser this architecture gets for free.
- **Oct 4 (Sun)** — Meal 1: Ch1–5 (one Sunday, one drop).
- **Oct 5–11** — Meal 2, one chapter a day, Mon–Sun.
- **Oct 12–16** — Meal 3, Mon–Fri (crisis week).
- **Oct 16–20** — Meal 4's road-and-campaign run (Ch18–24; note Ch18/19 share Friday,
  Ch20/21 share Saturday — decide same-day double drops vs. splitting).
- **Oct 21–24** — deliberately quiet (off-page in the book; the feed goes quiet too,
  which *is* the story beat).
- **Oct 25 (Sun)** — Family Meal. Finale.

**Year-dependence warning:** this alignment is unique to 2026. Oct 4, 2027 is a
Monday; a later launch means either floating the story's dates (a canon change) or
dropping the weekday alignment. If real-date publishing is wanted, **this October is
the window**, and the decision needs to be made with roughly Oct 1 lead time.

## What this is not (boundaries carried over from prior decisions)

- **Not a spaces build.** Per §12.6, spaces stay unused while alpha. The gated lane
  (private/under-pressure register facets, backstage) is future work; v1 publishes
  only the public, on-page-derived records above. The `register` field ships as
  *data about the character*, not as an access gate.
- **Not character weights.** §12.7's checkpoints would be horizon-versioned too, and
  this pipeline is the substrate they'd sit on — but nothing model-facing is in scope.
- **Interiority never leaves, in any lane.** Unchanged.

## Decisions (author, 2026-09-01)

1. **Same-day multi-chapter drops: fine.** No staggering required (staggering by the
   chapters' `time:` fields remains available if wanted later).
2. **Surface split decided in principle:** the book/community handle publishes the
   prose; **each character is their own AT Protocol identity** — their own PDS repo
   holds their lexicon records, and ideally they also post in-character. Design below.

3. **Q3 dissolved by reframe.** The narrow question was what to do with the scene
   record's two spoiler fields (`beat`, `primaryEvent`). The author's response —
   "we may be thinking about publishing too narrowly" — points at the right v1: in
   the character-account architecture the story's public voice is the prose plus the
   cast's own records and posts, so the scene record doesn't narrate anything. It
   publishes as a **bare factual index card** (title, storyDate, placeRefs,
   participants); `beat` and `primaryEvent` stay internal. Nothing to author,
   nothing to spoil.
4. **Pending author review.** The referent is the manuscript's one dated fact —
   "Filed on October 2nd—exactly two days after Hank had given up his stall"
   (`m2_06_a_fine_sieve.md:66`) — proposed as the pre-launch teaser in "Pike's side"
   below.

---

## Character accounts — each character as an AT Protocol identity

This is *more* protocol-native than the single-repo design: the subject owns their
data. The `handle:` field already in every core character's codex frontmatter
(`emmacooks`, `oliverreads`, `oliviaknows`, `noahbuilds`, `elijahmiller`, `jasper`)
becomes real.

### Identity & infrastructure

- **Handles:** domain handles under an author-owned domain —
  `@emmacooks.supperclubsecrets.com`-style (or subdomains of whatever the project
  domain is). Domain verification means nobody can squat the cast's names, and the
  domain itself signals the fiction. The project/community handle
  (`@supperclubsecrets.…`) publishes prose, scene records, and place records.
- **Hosting:** v1 needs **no self-hosted PDS**. Accounts on bsky.social accept custom
  lexicon records via `com.atproto.repo.putRecord`, so `site.supperclub.character.stateEvent`
  and `profile` records can live in each character's repo from day one. A self-hosted
  PDS (all cast on project infrastructure, one key-custody story) is a later
  consolidation, not a prerequisite.
- **Key custody:** the author holds all credentials; one publish script sessions into
  each account. Cast accounts are operated, never autonomous.

### Record routing (replaces the single-repo publish)

The compiled records already carry `subject`. The publish profile routes by it:

| Record | Destination repo |
|---|---|
| `character.profile`, `character.stateEvent` | that character's PDS repo |
| `scene`, `place`, book/front-matter | the project handle's repo |

Same canon-horizon filter, same spoiler-field stripping, applied per-repo. A reader
following @emmacooks sees *Emma's* state history accumulate; the project handle
carries the story spine.

### In-character posts — a new canon surface, with rules

Posts ("Weird vibes at the farmers market today") are **new in-world content**, not
derived from prose. That makes them canon-bearing, so they get the full apparatus:

1. **Authored, never live-generated.** House rule carries over: *generated output is
   never canon* — every post is written in the repo first (a new per-character posts
   file under the story, e.g. `stories/<book>/posts/emma.md`, each post with
   `storyDate`, optional `time`, and text), reviewed like prose, then published on
   schedule. Replies from real users do **not** get generated in-character answers.
2. **Linted like prose.** Every post must pass canon-check: the character's knowledge
   state *on that date* (the info-flow/reverse-causality machinery from the
   2026-09-01 skill upgrade applies directly), voice guide register, tone ceiling.
   Posts are by definition the character's **public register** — which is itself
   characterization (what Elijah won't post says more than what he would).
3. **In-world posting behavior must match the book.** This is the subtle one. The
   plot *turns on* information discipline: the group runs the campaign anonymously,
   and Emma is targeted precisely because she was visible asking questions. So:
   - Emma posting is canon-consistent — she's explicitly "building her brand"
     freelance (Ch 1). Food content, yes; investigation content, never.
   - The interesting texture is **negative space**: feeds go oblique or quiet during
     the crisis weeks (Oct 12–16), Jasper's feed goes dark during the PA search,
     Emma's "weird vibes" post on Oct 4 is exactly the level of specificity she'd
     later regret. Observant readers can read the feeds *as* story.
   - The swarm campaign itself (Ch 17–24) is **not** re-enacted through the cast
     accounts — in-world it's anonymous, and out-of-world simulating a viral exposé
     with real accounts shades into fabricated-news territory (below).
4. **Fiction disclosure, non-negotiable.** Every cast account bio labels itself as a
   character in Supper Club Secrets (with a link). Real-feeling local posts from
   unlabeled "Brooklyn residents" would deceive real people, and the Pike storyline
   (a development scandal, an investor exodus) must never read as actual news about
   actual Williamsburg. Fictional accounts, clearly fictional — the ARG lives inside
   the label, not by hiding it.

### Pike's side (answers open question 4)

The antagonist ecosystem publishes too, on the same horizon, all fiction-labeled:
- **Oct 2:** LLC #2847's restaurant-permit filing surfaces from the project handle —
  the teaser, now diegetic.
- The **commentator's #FreeMarketFriday post** (Ch 20, quoted verbatim in prose) and
  the **critic's post** (Ch 24) can exist as real posts on their real dates from
  labeled fictional accounts — the two loudest artifacts of the book, readable in
  the wild on the day the chapters drop.
- Pike's restaurant group account posts the **non-apology statement** (Ch 25 text) on
  Oct 22–23. Its earlier feed is bland hospitality PR — which *is* his
  characterization.

### Bot declaration (author decision 2026-09-01: required)

Cast accounts are built as declared bots per the
[atproto bot tutorial](https://atproto.com/guides/bot-tutorial):

- **Self-label:** every cast account's profile carries the standard bot self-label —
  `labels: { $type: 'com.atproto.label.defs#selfLabels', values: [{ val: 'bot' }] }` —
  in addition to the fiction disclosure in the bio. Two independent signals: the
  machine-readable label says *automated*, the bio says *fictional*.
- **Opt-in interaction only:** the tutorial's rule — a bot interacts (like, repost,
  reply) only when tagged — is adopted wholesale, and it settles open question 4
  from the protocol side: cast accounts never initiate interaction; any reply is
  authored, in-repo, and only ever to someone who tagged the character. v1 can still
  ship with replies off entirely.
- **Mechanics:** app passwords per account (author-held), posting via the SDK
  (`app.bsky.feed.post`), network rate limits respected — trivially, since the whole
  book is ~100 scheduled posts over 25 days.

### The spaces question — core-six posts in an AT Protocol Space (under consideration)

The author is considering putting the core six characters' posts into a space,
hoping it supports view-only access for external readers. Grounding this against
`SPACES.md` (2026-08-29) and the alpha announcement (re-checked 2026-09-01):

**Can external readers get view-only access?** Per proposal 0016: yes in shape —
space read policies include **`public`** ("authorize anyone who asks"), and reading
is inherently view-only for non-members-with-repos. But two qualifiers:
1. "Public" is not *web-public*: a reader needs an atproto identity and must OAuth
   through an **admitted application** (ours) to obtain the ~2-hour read credential.
   No anonymous drive-by reading, no Google indexing.
2. Space records **do not appear in the Bluesky app** — no feeds, no discovery, no
   real replies. A post in a space is gated content readable through our surface,
   not a post in the world.

**Which means the register model decides what goes where.** If the six characters'
*public* posts live only in a space, we lose exactly what makes the idea magical —
ambient discovery, feeds that feel real, the commentator artifacts existing in the
wild. The split that keeps both:

- **Public register → public lane.** In-character posts publish as ordinary
  (bot-labeled) Bluesky posts. This is Tier B, unchanged.
- **Private register → the space.** The thing a space is *for* here is the
  **supper club group chat** — the book is full of it (the theory threads, the
  campaign coordination, *FOUND IT*), it's the cast's private register, and "get
  access to the group chat" is a genuinely compelling reader unlock. This is
  `SPACES.md` 5.1's backstage concept with the six characters as the in-world
  authors.

**Confirmed by the author (2026-09-01):**
- **The split stands:** the cast posts publicly *outside* the group chat; the group
  chat lives in the space. Requiring an atproto identity for the full experience is
  acceptable — the public lane is the free ambient layer, the space is the
  logged-in layer.
- **Accounts: the core six only.** No Hank, no Dorothy, no other side characters.
  The in-world logic is exact: the space *is* the supper club's group chat, and
  they wouldn't invite outsiders in. Space membership maps to club membership;
  external readers aren't "in the chat" — they're granted read credentials by the
  *publisher* (the space authority is the project DID, not a character), flies on
  the wall rather than participants. Hank's absence from the network stays
  story-accurate (a landing page and a voicemail).
- Corollary to check: Tier C's antagonist-ecosystem accounts (commentator, critic,
  Pike's group) are *not* covered by "just our main crew" one way or the other —
  they'd be public-lane artifact accounts, not space members. Needs its own yes/no.

**Writer topology:** six real writer repos means running a syncer (no relay exists
for permissioned repos). Since *we* author all six characters anyway, the
alpha-pragmatic shape is **single-writer**: the project DID holds the only
permissioned repo and writes every `message` record with in-record character
attribution (`author: char.emma`). Cheapest possible space, no syncer, and consistent
with the derived-records discipline. Per-character permissioned repos are the
protocol-pure end state, worth revisiting when spaces are stable.

**Alpha risk vs. the Oct 1 launch (this is the hard constraint).** The alpha
announcement is blunt: no security review, *"we are not running backups, and we may
do destructive data migrations,"* schema not final, and the hosted alpha PDS's data
is "neither permanent nor stable." §12.6's recorded decision — nothing reader-facing
on spaces while alpha — was written for exactly this. The launch date is immovable
(the 2026 calendar alignment), so the launch cannot depend on alpha infrastructure.
The reconciliation:

1. **Oct 1 ships without the space.** Public lane (prose, records, posts) only.
2. **The group chat is authored anyway, now, as derivable `message` records** in the
   repo — same discipline as everything else. Content cost is paid once; where it's
   served is a publishing decision, not a rewrite (this is `SPACES.md` §9 prep #2,
   already recommended).
3. **The space lane targets spaces' full launch** — the announcement says "later
   this year," i.e. plausibly *during or just after the book's run*. If it lands
   mid-run, unlocking the group chat becomes a mid-season event; if not, the chat
   waits for the re-read audience or Book 2, or ships through our own surface's
   gate. Either way nothing published to readers can be destroyed by an alpha
   migration.
4. Space type NSID to reserve now, per §9 prep #1: `site.supperclub.groupchat`
   (alongside the already-reserved `backstage`, `horizon`, `club`), rooted in the
   dedicated project DID (§6 — decided in principle, now becomes real when the
   domain/accounts are set up).

### Launch checklist (new, launch-critical)

1. **Buy the project domain** — blocks everything: handles derive from it
   (`@emmacooks.<domain>` etc.), so it must exist before account creation. Then DNS
   TXT records (or `.well-known`) per handle.
2. Create the project account + six cast accounts; set domain handles; apply bot
   self-labels + fiction bios; store app passwords in author-held credential storage.
3. Establish the dedicated project DID (space authority + record authority).
4. Publish profiles + standing places (Oct 1 front-matter payload).
5. Publish script: horizon filter + subject routing + scene-field stripping + post
   scheduler.

### The Oliver easter egg (optional, flagged not decided)

Oliver's pseudonymous zoning account is canon (3,000 followers, dry commentary,
nobody knows). It could exist as a real, separately-named account — never linked to
`@oliverreads` — so readers who make the connection after Ch 15/24 get the payoff
themselves. High delight, real ops burden, and one hard rule if attempted: nothing
may link the two accounts before the book does.

### Scope tiers (build order)

- **Tier A (the original ask):** project handle + prose + horizon-filtered records
  routed to per-character repos. Six cast accounts + project account.
- **Tier B:** authored in-character posts for the cast, posts file + lint + scheduler.
- **Tier C:** antagonist-ecosystem accounts (commentator, critic, Pike's group),
  Oliver easter egg.

Tier A is the committed design; B and C are content-authoring costs more than
engineering costs — B for six characters over 25 days is roughly 60–100 short posts
to write and lint.

## To-dos toward Oct 1

Deadline-driven: the calendar alignment only exists in 2026, so everything below has
a hard ceiling of **Oct 1, 2026** (and the account/domain items block the rest).

### Author decisions (blocking)
- [x] **Buy the project domain** — **done 2026-09-01: `supperclubsecrets.com`**,
      registered via Cloudflare (same account as the Workers deploy — DNS, domain,
      and hosting in one place; records scriptable via the Cloudflare API). Handle
      scheme: project = `@supperclubsecrets.com`, cast = codex handles as
      subdomains (`@emmacooks.supperclubsecrets.com`, `@oliverreads.…`,
      `@oliviaknows.…`, `@noahbuilds.…`, `@elijahmiller.…`, `@jasper.…` — the bare
      `jasper` question dissolves under domain handles). Verification per handle:
      `_atproto.<subdomain>` TXT `did=did:plc:…` once each account's DID exists.
- [ ] **Pick the launch tier:** A (records only) / A+B (in-character posts) / A+B+C
      (antagonist artifact accounts).
- [ ] **Oct 2 LLC-filing teaser: in or out** (review `m2_06:66` + "Pike's side").
- [ ] **Tier C artifact accounts** (commentator, critic, Pike's group): in or out.
- [ ] **Space-lane timing:** wait for spaces' full launch (recommended) vs. ride the
      alpha accepting data-loss risk. Plus single-writer topology sign-off.

### Build (once unblocked)
- [ ] **Author:** create the project + six cast accounts (account creation and
      credential handling are author actions — Claude never creates accounts or
      touches password values); generate an app password per account and store
      them in author-held storage (e.g. `.env`, never committed; values never
      pasted into chat).
- [ ] **Claude, after that:** DNS TXT records for the seven handles (via Cloudflare
      API with an author-provided scoped token in env, or hand the author the
      exact records to paste); switch each account's handle to its domain handle;
      bot self-labels + fiction bios via the API.
- [ ] Establish the dedicated project DID (record + space authority); reserve
      `site.supperclub.groupchat` alongside the existing space-type NSIDs.
- [ ] Publish script: canon-horizon filter, subject routing (stateEvents/profiles →
      character repos; scenes/places → project repo), scene-field stripping
      (`beat`/`primaryEvent`), post scheduler.
- [ ] Oct 1 front-matter payload: profiles (`oneLine` bios) + standing places.

### Content (author + Claude, voice-linted)
- [ ] If Tier B: author the in-character post files
      (`stories/<book>/posts/<char>.md`, ~60–100 posts, storyDate-keyed), run
      canon-check (knowledge-state + voice) on each.
- [ ] Author the group-chat `message` records (derivable, single-writer with
      in-record character attribution) — content cost paid now regardless of
      space-lane timing.
- [ ] If Tier C: stage the three artifact accounts' feeds (the Ch 20/24/25 posts are
      already written verbatim in the prose; backfill bland ambient posts for
      Pike's group).

## Resolved questions (log)

1. The Oct 2 LLC-filing teaser: in or out (pending review of `m2_06:66` and "Pike's
   side" above)?
2. Which tier ships Oct 1? (A alone is real; B is the magic; C is the flourish.)
3. Domain: what's the project domain for handles, and does `@jasper` need a
   distinguishing handle (his codex handle is bare `jasper`)?
4. ~~Reply policy~~ — settled by the bot-tutorial rule (opt-in only: cast accounts
   never initiate; authored replies only to users who tagged them; v1 may ship with
   replies off entirely).
5. ~~Hank/Dorothy accounts~~ — settled: **core six only**; the space is the club's
   group chat and they wouldn't invite outsiders in.
6. ~~The spaces split~~ — settled: public posts on the public lane, group chat in
   the space; readers wanting the full experience need an atproto identity.
   Remaining sub-questions: single-writer topology sign-off, and whether the space
   lane waits for spaces' full launch (recommended — the alpha PDS runs no backups)
   or rides the alpha with an accepted data-loss risk.
7. Tier C artifact accounts (commentator, critic, Pike's group — public lane, not
   space members): in or out?
5. Do Hank and Dorothy get accounts? (Hank has no handle in canon — arguably right:
   the man has a landing page and a voicemail. His *absence* from the network is
   story-accurate.)
