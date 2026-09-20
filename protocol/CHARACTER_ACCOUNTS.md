# Character Accounts — Operating the Cast on the AT Protocol

**Status:** design, 2026-09-17. Nothing built, no accounts created, nothing posted.
Companion to [`SERIALIZED_PUBLISHING.md`](SERIALIZED_PUBLISHING.md) (which decided
identity, hosting, tiers, and disclosure on 2026-09-01) and
[`ARCHITECTURE.md`](ARCHITECTURE.md) §6.7 (which reserved the `character.post`
shape on 2026-08-30).

This document does not restate those. It settles the four things they leave open:
**what a post may contain**, **how a permanent public feed stays in step with a
reader who arrives late**, **what custody of the identities actually means**, and
**what has to be true before the first record goes out**. It ends with a
recommendation and a date.

---

## 1. Where the existing design already landed

Read `SERIALIZED_PUBLISHING.md` for the reasoning. The decisions that stand:

- **Core six only** — Emma, Olivia, Oliver, Noah, Elijah, Jasper. No Hank, no
  Dorothy. Hank's absence from the network is story-accurate.
- **Handles** are the codex `handle:` values as subdomains of
  `supperclubsecrets.com` (bought 2026-09-01), with a project handle at the apex.
- **Hosting**: bsky.social accounts, no self-hosted PDS for v1.
- **Bot self-label plus a fiction bio on every account.** Two independent signals,
  machine-readable and human-readable. Non-negotiable.
- **Opt-in interaction only.** Cast accounts never initiate; replies authored
  in-repo if at all, and v1 ships with replies off.
- **The swarm campaign (Ch 17–24) is never re-enacted** through cast accounts.
- **Records route by `subject`**: profiles and stateEvents to the character's repo,
  scenes and places to the project repo.

### One contradiction to resolve

`ARCHITECTURE.md` §12.8 (2026-08-30) says the six characters do **not** need their
own DIDs, because no portability use-case exists. `SERIALIZED_PUBLISHING.md`
(2026-09-01) makes each character their own atproto identity with their own repo,
which gives every one of them a DID.

The later document is the live decision and says so. But §12.8 and §12.2's DID
ladder still read as current, and a reader of `ARCHITECTURE.md` alone would come
away with the opposite answer. **Fix by amending §12.8 to point at the serialized
release as the portability use-case that promoted the cast.** This is a
documentation fix, not a design change — but leave it and the next person to read
the protocol folder gets the wrong answer, the same way the custody records got
built outside validation.

---

## 2. What a post may contain: the public-register rule

This is the part that makes everything else safe, so it comes first.

A `character.stateEvent` is authored *about* a character in craft vocabulary. A post
is authored *as* the character. The bridge between them is the **register**, which
the compiled records already carry — and the distribution is the design.

Across Book 1's 97 state events:

| Register | Events |
|---|---|
| `private` | 72 |
| `public` | 20 |
| `under-pressure` | 5 |

**The plot lives in the private register.** That is not a coincidence — it is what
the book is about. The group runs the campaign anonymously; Emma is targeted
precisely because she was visible asking questions. Information discipline is the
mechanism of the story.

Which gives the rule:

> **A post may be anchored only to a `public`-register state event, or to a day on
> which the character has no event at all. A `private` or `under-pressure` state
> produces silence, never a post. Where a post is anchored to a public event, it may
> draw on the *manner* of that state — the performance — and never on the
> *information* in its parenthetical.**

The second clause matters. Jasper's Oct 9 event is `public → private (competitive
itch — everyone else has contributed; calls Brenda; misses her warning text)`. The
register permits a post. The content permits Jasper being competitive and
underfoot; it does not permit Brenda, the LLC, or the call.

This rule is mechanically checkable against `character_state_events.json`. It should
be a lint, not a judgement call — see §6.

### The posting calendar this produces

Applying the rule to the core six across Book 1's October 2–25 span
(`P` = anchored post permitted, `X` = non-public register present, `.` = off-page):

```
date        day  emma    olivia  oliver  noah    elijah  jasper
2026-10-02  Fri  .       .       .       .       .       .
2026-10-03  Sat  .       .       .       .       .       .
2026-10-04  Sun  P*      P       X       P*      X       P
2026-10-05  Mon  .       .       X       .       .       .
2026-10-06  Tue  .       P       X       .       .       .
2026-10-07  Wed  .       X       .       .       X       .
2026-10-08  Thu  .       .       .       X       .       .
2026-10-09  Fri  .       .       .       .       .       P
2026-10-10  Sat  X       .       .       .       .       .
2026-10-11  Sun  P       P       X       X       X       X
2026-10-12  Mon  X       X       .       .       .       .
2026-10-13  Tue  .       .       .       .       .       .
2026-10-14  Wed  X       X       X       X       X       X
2026-10-15  Thu  .       .       .       .       .       .
2026-10-16  Fri  X       X       X       X       X       X
2026-10-17  Sat  X       X       X       X       X       X
2026-10-18  Sun  .       .       .       .       .       X
2026-10-19  Mon  .       .       .       .       .       .
2026-10-20  Tue  X       X       X       X       X       X
2026-10-21  Wed  .       .       .       .       .       .
2026-10-22  Thu  .       .       .       .       .       .
2026-10-23  Fri  .       .       .       .       .       .
2026-10-24  Sat  .       .       .       .       .       .
2026-10-25  Sun  X       X       X       X       X       X
```

47 of 144 character-days are silenced by register. 91 are off-page. **Six days carry
a clean anchor**, and two more (`P*`) are Emma and Noah on Oct 4, where the
character has a public event at the first supper alongside private events elsewhere
that day.

Take the scene-level reading rather than the day-level one and the total is **eight
anchored posts**. Take Emma and Noah out and it is six. Recommend eight: Oct 4 is the
first supper and the launch, and a launch where the focal character does not post is
the wrong launch. Emma's Oct 4 anchor is `public → private (hostess persona softening
as the soup lands)` — pure performance, zero information.

Eight anchored posts is a very different number from the 60–100 that
`SERIALIZED_PUBLISHING.md` §"Scope tiers" estimated, and it is the number that falls
out of the register data rather than from imagining a full feed. It is the difference
between Tier B being a month of authoring and Tier B being an afternoon.

### The other 91 days

Off-page days permit ambient posts — the character is not in a scene, so nothing
about them is on the page to contradict. Two constraints still bind:

1. **Knowledge state.** An ambient post on Oct 13 is still subject to what the
   character knows on Oct 13. This is the same reverse-causality check canon-check
   already runs on prose.
2. **Tone.** Oct 12–17 is the crisis. Legally a character could post about the
   weather on Oct 13 and 15; it would be tonally false. **The crisis window should
   read as near-silent**, and Oct 21–24 — already deliberately off-page in the book —
   should be completely silent. The feed going quiet *is* the beat.

Budget the ambient lane at roughly one post per character per week, concentrated in
Oct 2–11, tapering to nothing after Oct 12. That is another ten or so posts, which
puts the whole of Tier B at **under twenty posts**, all of them short.

### Scenes do not map to posts at all

`com.supperclubsecrets.scene` publishes to the project repo as a bare factual index card
(title, storyDate, placeRefs, participants) with `beat` and `primaryEvent` stripped —
this was settled on 2026-09-01. Nothing in a scene record becomes a post. A post that
narrated a scene would be the character reporting the plot, which is the failure the
register rule exists to prevent.

---

## 3. Staying in step with the reader

`ARCHITECTURE.md` §6.7 requires two gates on every post: `publishDate` decides
whether it exists yet, `chapterRef` decides whether *this reader* has earned it,
resolved against the per-reader canon horizon in `site/src/lib/horizon.ts`.

**Both gates work on our site. Only one of them exists on Bluesky.**

A public feed is a single global timeline. There is no per-reader horizon, there
cannot be one, and space read access is all-or-nothing so a space cannot express one
either. Every visitor to `@emmacooks.supperclubsecrets.com` sees the same feed at the
same moment, in whatever state it has reached.

The consequence is not a bug during the live run — from Oct 2 to Oct 25, 2026 the
readers are reading along and time and horizon coincide. The consequence lands on
**Oct 26 and every day after**, when the feed becomes a permanent, publicly indexed
archive of Book 1 in chronological order, and a reader who starts Chapter One in
January sees Oct 25 at the top.

Three ways out, and only one of them is real:

- **Delete after the run.** No. Un-publishing is a breaking event by the horizon
  rule, it breaks every link, and it destroys the artifact the whole exercise exists
  to create.
- **Rely on readers not looking.** No. The accounts are public and discoverable by
  design; that is the point of the public lane.
- **Make the feed permanently spoiler-free by construction.** Yes — and §2 is
  exactly that. If no post carries information a reader could be spoiled by, then
  permanence costs nothing and the second gate is not needed on the public lane.

So the rule is not a stylistic preference. **The public-register rule is what makes a
permanent public feed compatible with a per-reader horizon**, and it is load-bearing.

This also divides the lanes cleanly:

| Lane | Gates | Content |
|---|---|---|
| **Bluesky public feed** | `publishDate` only | Posts that pass the public-register rule — permanently safe at any reading position |
| **Our site's character hubs** | `publishDate` + `chapterRef` | The same posts, plus stateEvents, scenes, relations — everything horizon-gated |
| **The group chat (space, later)** | membership | `message` records, the private register, unlocked deliberately |

The same authored post serves all three without a rewrite, which is why the record
carries no visibility field.

### After Oct 25

Book 1's calendar ends on Oct 25. Book 2 is set in **November** and is not drafted —
it has a chapter outline and nothing else. Do not let the feeds walk into November on
a real clock; that would commit to drafting Book 2 against a publishing deadline,
which is how continuity gets broken.

**The feeds close with the Family Meal on Oct 25 and go dormant.** An account that
stops when its book stops reads as a finished work. An account that posts twice in
November and then trails off reads as an abandoned bot. Book 2 restarts them when
Book 2 is drafted and locked, on whatever calendar Book 2 earns.

---

## 4. Key custody

`SERIALIZED_PUBLISHING.md` says the author holds all credentials and the accounts are
operated, never autonomous. That stands. Four operational points it does not cover:

1. **App passwords, not account passwords, in the pipeline.** The publish script
   sessions in with a per-account app password read from the environment. App
   passwords are individually revocable; the account password never enters the
   pipeline, a committed file, or a chat message.

   **One documented exception, found 2026-09-20.** Adding a PLC recovery key
   (item 2) cannot use an app password. A session created from one carries scope
   `com.atproto.appPass`, and every identity operation requires the full
   `com.atproto.access` scope, so the PDS answers `InvalidToken: Bad token scope`.
   That boundary is the point of app passwords — it is what stops a leaked one
   being used to take over an account — so the rule is working, not failing.

   The exception is narrow and does not touch the rule above. `tools/plc_recovery.mjs`
   is run by hand, once per account, reading `BSKY_ACCOUNT_PASSWORD` from the
   environment and never from a file or repo secret. The publish path is
   unaffected and still uses app passwords.
2. **Add an author-held PLC recovery key to each account.** A DID is permanent,
   and once records are published under a cast account's DID that identity *is* the
   canon record. Losing the credentials without a recovery key means losing the
   identity — not the posts alone, the subject they were published by.

   **Corrected 2026-09-19: there is nothing to "export".** The earlier wording sent
   a reader looking for a button that does not exist. Each DID document carries an
   *ordered* list of rotation keys, and today every account's list holds exactly
   one — Bluesky's. That is how they change your handle for you. A recovery key is a
   keypair you generate yourself and **prepend** to that list; ranked above the
   PDS's, it can reverse an operation signed by a lower-priority key inside the
   72-hour PLC window, and can move the DID to another PDS without the current one's
   cooperation. Bluesky's key must stay in the list — strip it and they can no longer
   manage the identity at all.

   Mechanism: `requestPlcOperationSignature` → `signPlcOperation` →
   `submitPlcOperation`, scripted at `tools/plc_recovery.mjs`. Per account:

   ```
   read -s "?ACCOUNT password: " BSKY_ACCOUNT_PASSWORD; export BSKY_ACCOUNT_PASSWORD
   node tools/plc_recovery.mjs --account <slug> --request
   node tools/plc_recovery.mjs --account <slug> --token <TOKEN>
   node tools/plc_recovery.mjs --submit .plc/<slug>.json
   node tools/plc_recovery.mjs --store  .plc/<slug>.json
   ```

   The slug is the character name (`oliver`), not the handle
   (`ollie-oxen-free`). `--token` prints the before/after rotation lists and two
   checks that must both read YES before submitting. `--store` files the key in
   the macOS keychain, verifies the read-back, and deletes the local file itself
   — there is no separate cleanup step, deliberately.

   **First run, 2026-09-20 (Jasper):** done, and it cost six fixes to the tool.
   Two of them matter as precedent. A private key was lost to a `rm` pasted from
   a two-line block whose first line failed — the account stayed fully functional,
   because a rotation key nobody holds cannot be used by anyone, and the fix was
   to run the flow again. And the keychain read-back genuinely mismatched, because
   `security` does not preserve the newlines in a PEM; the value is stored base64
   now. Both failures stopped safely rather than silently, which is the property
   to preserve in anything added here later.

   **It is not a launch blocker.** A rotation key can be added at any time and is
   equally effective from the moment it lands. Doing it before the first publish only
   closes the gap in which a compromise would be unrecoverable. Do it early because
   it is cheap, not because Oct 2 depends on it.
3. **Seven identities, one custodian.** Project account plus six cast accounts, all
   author-held, all in one credential store. There is no second operator and no
   delegation. That is correct for v1 and should be stated rather than assumed.
4. **Claude never creates accounts, never handles password values, never posts.**
   Account creation, app-password generation, and credential storage are author
   actions. Claude writes the records, the posts, the lint, and the publish script,
   and hands over DNS records to paste or runs them against an author-provided scoped
   token. Already the standing rule; repeated here because this is the document
   someone will read before setting it up.

---

## 5. What the records gaps actually block

The Pinakes documentation merged on 2026-09-17 names six code-versus-docs gaps, the
most serious being that `records/book1/items.json` and `custody_events.json` are
hand-maintained with no lexicon and no command that produces them, so they sit
outside validation while the site imports them at build time.

Being precise about what that does and does not block here:

- **It does not block the bot lane directly.** Neither `item` nor `custodyEvent`
  appears in the publish routing table. Nothing routes them to a character repo or
  the project repo. They are a site problem and a canon-integrity problem, not an
  atproto-publishing problem.
- **It does block the claim that the record layer is validated**, which is the claim
  the whole one-source-many-surfaces architecture rests on.
- **And it names exactly the mistake about to be repeated at higher stakes.**
  `com.supperclubsecrets.character.post` has no lexicon file, and the Pinakes compiler
  emits four record types — `scene`, `character.stateEvent`, `place`,
  `character.profile` — and knows nothing about posts. Author posts today and they
  are hand-maintained JSON outside validation, exactly like `custody_events.json`,
  except published to a public network under permanent identities where they cannot
  be quietly corrected later.

That is the real version of "close the record gaps first." Not *items and custody
must be fixed before bots* — those are parallel work. **The post type must exist as a
lexicon and a compiler output before the first post is authored.**

---

## 6. Preflight — what must be true before anything posts publicly

In order. Nothing below is optional.

**Identity and disclosure**
1. Project domain resolves; `_atproto.<subdomain>` TXT records verified for all seven
   handles.
2. Every account carries the bot self-label *and* the fiction bio with a link to the
   site — **before the first record is published**, not after.
3. PLC recovery keys exported and stored for all seven accounts (§4).

**Validation**
4. `com.supperclubsecrets.character.post` lexicon committed to `records/lexicons/`.
5. Pinakes compiles `stories/<book>/posts/*.md` to
   `records/book1/character_posts.json`. Posts are authored in the creative layer and
   compiled, never typed into a client.
6. A lint enforcing the public-register rule (§2) against
   `character_state_events.json`, wired into the continuity-lint workflow. Mechanical,
   not by eye.
7. Every post passes canon-check for knowledge state on its `storyDate` and for voice
   against the character's `personaPublic`.

**Publishing**
8. The publish script does a dry run that prints, for every date Oct 2–25, exactly
   what would go to which repo. Reviewed end to end, once, by a human, before
   anything goes out.
9. Replies off. Opt-in interaction is the standing rule and v1 does not need to
   exercise it.
10. The swarm campaign is not re-enacted; the antagonist ecosystem (Tier C) is either
    decided in or explicitly deferred, not left ambiguous at launch.

**Content**
11. Book 1 prose is locked. It is — v1-locked 2026-07-05 — and it must stay locked
    through the run, because a prose edit after Oct 2 desynchronises a feed that
    cannot be un-published.

---

## 7. Recommendation

Three things are true at once.

**The calendar window is real and closes for a year.** Book 1's internal calendar is
Oct 2–25, 2026, and the ledger's anchor puts every story date on its correct real
weekday *this year only* — Oct 4, 11, 18 and 25, 2026 are all Sundays. Oct 4, 2027 is
a Monday. Publishing in real time is available this October or not for a long time.

**Tier A is small.** The compiler already emits all four record types the routing
table needs. What is missing is a filter-route-push script and account setup. No
Pinakes change is required for Tier A.

**Tier B at the register-rule scale is also small** — under twenty short posts, not
sixty to a hundred. But it needs a lexicon, a compiler change, and a lint before the
first post is written, and today is Sept 17.

So: **launch Tier A plus the eight anchored posts, on Oct 2, and stop there.**

Tier A alone is the wrong answer even though it is the safest one. Custom lexicon
records do not render in the Bluesky app — six accounts publishing only stateEvents
and profiles would present to any visitor as six dead accounts with bios. The eight
anchored posts are what make the accounts legible as accounts, and they are the ones
the register data says are safe by construction.

Defer, explicitly:
- **The ambient lane** (the ~10 off-page posts). Nice, not load-bearing, and the
  first thing to cut against the date.
- **Tier C** — the commentator, critic, and Pike's-group artifact accounts. The Ch 20
  and Ch 24 posts are written verbatim in the prose and would be the loudest
  artifacts of the book, but a fabricated development scandal on a public network is
  the highest-risk surface here and it should not be built under deadline.
- **The Oliver easter egg.** High delight, real ops burden, and one hard rule that is
  easier to keep by not starting: nothing may link the two accounts before the book
  does.
- **The space / group chat.** Spaces are alpha, run no backups, and warn of
  destructive migrations. §12.6's standing decision covers this. Author the `message`
  records anyway — the content cost is paid once and where it is served is a later
  decision.

### What blocks, and who owns it

| | Owner | Blocks |
|---|---|---|
| Create 7 accounts, app passwords, export recovery keys | Author | Everything |
| DNS TXT for 7 handles | Claude, given a scoped token — or records to paste | Handle verification |
| `character.post` lexicon + compiler + lint | Claude | Any post |
| Author 8 anchored posts, canon-check each | Claude, author reviews | Tier B |
| Publish script (horizon filter, subject routing, scene-field stripping) | Claude | Everything |
| Amend `ARCHITECTURE.md` §12.8 (§1 above) | Claude | Nothing — but do it |

The account creation is the long pole and it is the author's, not because it is hard
but because it cannot be delegated. Everything else can run in parallel behind it.

### If the date slips

It is not a disaster. Losing the 2026 weekday alignment costs the real-time
conceit — the chapters still publish on a schedule, the records still publish on the
horizon, the posts still work, and the feed still reads as a feed. What is lost is
"the book happens in real time," which is a genuinely good idea and is worth two
weeks of work, but is not worth publishing unvalidated records under permanent
identities to hit a date.

**The gate is §6, not the calendar.** If preflight is not clean by Oct 1, launch the
site's serialized run without the atproto lane and bring the accounts up for Book 2.
