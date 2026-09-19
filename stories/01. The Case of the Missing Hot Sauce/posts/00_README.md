# Posts — the cast's authored feed

Every in-character post in Book 1 lives here, **one file per post**, written in the
repo and reviewed like prose before it is published. Generated output is never canon;
that house rule applies here with more force than anywhere else, because a post is
published under a permanent identity and cannot be quietly corrected later.

Pinakes compiles this directory to `records/book1/character_posts.json`. Files
beginning `00_` are skipped, which is why this one is named the way it is.

## Format

Filenames are `<character>-<NN>.md`, numbered in that character's own chronological
order, because the compiler derives each record's id from the author and the file
sort: `emma-03.md` becomes `post.book1.ch0.emma.3`. Renumbering a character's files
renumbers their post ids, and anything replying to them, so insert rather than
renumber once posts are published.

```markdown
---
author: Emma
date: "2026-09-27"
chapter: 0
time: "10:12"
lane: public
tags: [lane-public, market, squash]
location: "McGolrick Park Farmers Market"
mentions: [Olivia]
reply_to: post.book1.ch0.olivia.7
note: >-
  Authoring direction. Never published — see below.
---

Delicata are in and they are the one squash you do not have to peel.
```

| Key | Required | Becomes | Notes |
|---|---|---|---|
| `author` | yes | `author` | A registry name — `Emma`, not `char.emma`. Resolved, so a typo is a lint error. |
| `date` | yes | `storyDate` | In-story date. |
| `chapter` | yes | `chapterRef` | Reveal gate on our own site. **`0` = pre-book**, safe at any horizon. |
| `time` | yes | `storyTime` | `"HH:MM"`. What the scheduler posts at. **Never on the hour.** |
| `tags` | yes | `tags` | Must carry exactly one of `lane-public` / `lane-club`. See below. |
| `lane` | yes | — | Not read by the compiler. It is here for the human reading the file, and the lint checks it agrees with the tag. |
| `location` | no | `placeRef` | A registry place name. Resolved. |
| `mentions` | no | `mentions` | Registry character names. Resolved. |
| `reply_to` | no | `inReplyTo` | A compiled post id, so a thread reads as a thread. |
| `publish` | no | `publishDate` | Release gate. Absent means released. |
| `note` | no | — | **Authoring direction. Never published.** Image blocking, intent, the thing a reviewer needs and a reader must not have. Safe because the compiler does not read it — which is also why it must stay in frontmatter and never drift into the body. |

## The two lanes

A character's day does not all come out in public. It never has — the book is full of
the group chat, and the register data says so outright: of Book 1's 97 state events,
**72 are `private`**, 20 are `public`, 5 are `under-pressure`.

| Lane | Destination | Register it may draw on |
|---|---|---|
| `lane-public` | The character's own repo — a real post in the world, permanently | `public` only |
| `lane-club` | The supper club's group chat, in an AT Protocol space, when spaces leave alpha | `private`, and `public` |

This is the same authored day, split by who is listening. It also fixes what made the
public feed feel thin: a `private` state used to produce **silence**, because silence
was the only output available. Now it produces a group-chat message instead. The crisis
week goes quiet in public *and loud in the club*, which is exactly what the book
depicts.

**Why the lane rides in `tags`.** The compiler has no lane field and the lexicons under
`records/lexicons/` are generated — a hand-added field is wiped on the next compile —
so a first-class `lane` needs a Pinakes change. Until then `tags` is the carrier the
compiler already passes through unchanged.

**Nothing guesses a lane.** `tools/lint_posts.mjs` rejects a post carrying zero or two
lane tags, and `tools/publish_records.mjs` publishes a post only if it is *positively*
marked `lane-public`; absent, doubled, or misspelled is withheld. A club message on the
open network is a spoiler released under a permanent DID, so both ends fail closed.

**`club` is authored now, published later.** Spaces are alpha, run no backups, and warn
of destructive migrations; nothing reader-facing ships on them while that is true. The
content cost is paid once; where it is served is a publishing decision, not a rewrite.

## What is checked, and by what

| Check | Where |
|---|---|
| Author, place and mention names resolve to the registry | `pinakes lint` / `compile` |
| **Public-register rule** — a post's chapter must leave its author in the `public` register | `pinakes lint` (`post-register`) |
| Records match the lexicon, and committed records match a fresh compile | `continuity-lint` workflow |
| Exactly one lane tag; `lane:` agrees with it; no `note:` in the body; `time:` is a clock and not on the hour | `tools/lint_posts.mjs` |

Two things no lint can check, which is why a human reads every post before the run:

- **Knowledge state.** What the character knows on that date, checked the way
  canon-check checks prose. A post cannot know a thing before its chapter happens.
- **Voice.** Against `lore/02_character_voice_guide.md` and the character's
  `personaPublic`. A public post is the Surface register, permanently.

## What is here now

**Pre-book backfill — 48 posts, 1 August to 1 October 2026.** Dated before Chapter One,
so it cannot spoil anything, does not touch the locked prose, and is the safest content
in the project. It exists to give the accounts a past: an account created in October
whose first post is October 4th looks like a marketing launch, because that is what it
is.

Volume is deliberately unequal, per `protocol/CHARACTER_PRESENCE.md` §3 — if all six
post at the same rate they read as one author:

| | Posts | Shape |
|---|---|---|
| Olivia | 13 | Highest volume, most reactive. People, not things. Replies more than she posts. |
| Jasper | 11 | Nothing for days, then a burst. A four-day August run about something that turns out to be nothing. |
| Emma | 10 | Worked-on, three or four a week. **Eleven days of silence in September, unexplained, where she walks out of Bistro Lavande.** |
| Noah | 6 | Bursty and opinionated, then nothing for weeks. |
| Elijah | 6 | Once a week at most, mostly replies, never louder. |
| Oliver | 2 | Almost empty, and that is the content. Do not fill it. |

Five of those are `lane-club`: the group chat on the night before the first supper.

The per-character tells — Emma's dialect slip, Noah's sneaker box, Elijah's one post
about land, Jasper going dark — are specified in `protocol/CHARACTER_PRESENCE.md` §3
and mostly land *during* the run, not in the backfill. What the backfill establishes is
the rhythm they will later break.
