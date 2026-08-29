# AT Protocol Spaces — Evaluation for Publishing

What atproto's new permissioned-data protocol is, and the five places it changes our
options for sharing *Supper Club Secrets*.

**Status (2026-08-29): evaluated, not adopted.** Spaces are in public alpha. The
recommendation below is to take two pieces of free prep now and revisit when the alpha
ends. Decisions live in [`ARCHITECTURE.md`](ARCHITECTURE.md) §12.6; this document is the
reasoning behind them.

**Sources:** [proposal 0016 — permissioned data](https://github.com/bluesky-social/proposals/tree/main/0016-permissioned-data)
(the normative design, still labelled a proposal), the
[spaces alpha announcement](https://atproto.com/blog/atproto-spaces-alpha), the
[permissioned data diary](https://dholms.leaflet.pub/) posts, and the
[bulletin sample app](https://github.com/bluesky-social/bulletin).

---

## 1. Why this matters to us specifically

Our architecture has carried one unresolved tension since it was written: **atproto was
public-by-default, and we have content that isn't public.** §6.6 resolved it by
retreating — the backstage layer would be served through our own site with our own
access control, or simply not emitted. That was the right call against a protocol with
no permissioned lane. There is now a permissioned lane.

Nothing else in the architecture moves. The site is still the reading experience,
records are still derived and never authored, and the story still drives the canon.

---

## 2. What a space is

A **space** is an authorization and sync boundary — "a miniature atproto network that can
be gated." It is identified by a triple:

| Component | What it is | Ours would look like |
|---|---|---|
| space authority | a DID at the root of the space, which issues read credentials | a dedicated project DID (§6) |
| space type | an NSID naming the modality; itself a lexicon | `site.supperclub.backstage` |
| space key (`skey`) | a string distinguishing spaces of the same type under the same authority | `book1`, `self`, a tier slug |

Records inside it are addressed by an `at://` URI with a fixed `space` segment:

```
at://{spaceDid}/space/{spaceType}/{skey}/{authorDid}/{collection}/{rkey}
```

Crucially, a space does **not** colocate data. Each participant's records for a space live
in a **permissioned repo on their own PDS**, right next to their public records. The space
is the aggregate of those per-user repos, assembled by an application that has been
admitted.

Spaces are cheap at both ends of the range: one record with minimal overhead, or a
community of millions.

---

## 3. How access actually works

Reading requires a **space credential** issued by the space authority, obtained in a
three-party flow:

1. The reader authorizes an application over OAuth, granting a `space:` scope.
2. The application asks the reader's PDS for a short-lived **delegation token**
   (`com.atproto.space.getDelegationToken`) — this proves only "this app acts for this
   user," and says nothing about membership.
3. The application presents that token to the **space authority**
   (`com.atproto.space.getSpaceCredential`), with a DPoP proof binding the credential to a
   key it holds, plus a signed **client attestation** if the space gates on app identity.
   The authority decides whether to issue. A credential lasts ~2 hours and is reusable
   across every host serving a repo in the space.

Every PDS must implement `com.atproto.simplespace`, the baseline management surface:
`createSpace` / `updateSpace` / `deleteSpace`, `addMember` / `removeMember` /
`listMembers`. A space's `policy` is one of:

- **`member-list`** (default) — an explicit list of member DIDs.
- **`public`** — authorize anyone who asks.
- **`managing-app`** — at credential-mint time, the authority calls *our* application's
  `checkUserAccess` and takes its answer. This is the hook for dynamic gating: paid
  subscription status, a follower check, an approved join request.

An orthogonal `appAccess` setting (`open` or an allow-list of attested `client_id`s)
decides which *applications* may read, independently of which users.

**Three properties to hold onto, because they shape every option below:**

- **Access control, not confidentiality.** Space data is unencrypted. The hosting PDS and
  every admitted application can read it. It is not E2EE and is not a vault.
- **Read is all-or-nothing at the space boundary.** There is no per-record,
  per-collection, or per-author read grant. You are in the space or you are not.
- **There is no relay.** Permissioned repos are non-rebroadcastable, so nothing collates
  them into a firehose. An application syncs by pulling each member's repo directly
  (`listRepos` for the writer set, `listRepoOps` for incremental catch-up, an LtHash
  set-hash commit to know when it is current). Any multi-writer space-backed view needs a
  process that runs.

---

## 4. Space types are lexicons

A space type NSID resolves to a lexicon definition with `"type": "space"`:

```json
{
  "lexicon": 1,
  "id": "site.supperclub.backstage",
  "defs": {
    "main": {
      "type": "space",
      "key": "any",
      "name": "Supper Club backstage",
      "collections": ["site.supperclub.message"]
    }
  }
}
```

`name` is what a reader sees on the OAuth consent screen, so it is user-facing copy, not a
developer string. `collections` is the default write target for a bare `space:` grant.
The type is also the consent boundary: a reader grants "access to your Supper Club
backstage," not access to a specific space.

The scope string an application would request looks like:

```
space:site.supperclub.backstage?authority=did:plc:…&action=read
```

This slots into the namespace decision we already have: the root is pinned in
`pinakes.yaml` (`project.nsid`), and space types publish under the same root as record
types.

---

## 5. The five leverage points, ranked

### 5.1 The gated backstage layer — the real unlock

This is the one that changes an architectural answer rather than adding a convenience.

The backstage "between the lines" group chat (`message` records, §6.6) is written by
*us*. That makes it a **single-writer, many-reader** space: our project DID is the only
account with a permissioned repo in it, and readers are members who only read. That is
the cheapest possible multi-party space — no syncer fan-out, no per-reader repos to pull,
no writer set to sweep. We publish into our own repo; admitted readers' clients pull it.

Two shapes, depending on how gating should work:

- **`member-list`** — an explicit list of DIDs. Fine for a beta reader circle, an ARC
  group, a small paid tier managed by hand.
- **`managing-app`** — the authority asks our service at mint time. This is the shape for
  anything dynamic: a paid tier, a "subscribers who joined before the drop" window, a
  reward for finishing Book 1. We answer `checkUserAccess`; no member list to maintain.

**The constraint to design around:** read is all-or-nothing, so a single space cannot
express "backstage up to chapter 12." Progressive reveal has to be modelled as *multiple
spaces* — one per drop, per book, or per tier, each with its own `skey` — or kept in our
surface layer where the horizon already lives. Given a space can hold a single record
cheaply, one space per drop is a legitimate design rather than a workaround.

### 5.2 Tiered and gated release without building an account system

The generalization of 5.1. Today, any paid or gated tier means we build subscriber auth,
sessions, and entitlement checks into our own surface. With `managing-app`, the identity
and the access decision split: atproto brings the reader's identity and the credential
machinery, and our service answers one narrow question — *may this DID read this space?* —
from whatever payment or membership state we keep.

This pairs with the public lane rather than replacing it. The public
`site.standard.graph.subscription` record is the discoverable "I follow this publication"
relationship; the gated body lives in a space. Long-form publishing on atproto has been
converging on this split.

### 5.3 A portable canon horizon

The canon horizon (`site/src/lib/horizon.ts`) is the site's core object: how far a reader
has read, gating every lens. It lives in `localStorage`, and its comment already says it
is "designed to attach to an identity later with no change to this contract."

A **personal space** is exactly that identity, and it is the smallest thing spaces do —
authority `self`, one record, no membership at all. The alpha calls out this modality
directly (bookmarks, settings, drafts). A reader who signs in with their atproto identity
gets continue-reading across devices, and we store nothing about them: the record lives in
their repo, on their PDS, under a scope they can revoke.

The scope is a bare `space:site.supperclub.horizon` (authority defaults to `self`). This
is the *lowest-risk* place to experiment, because it is per-reader, non-critical state
with an obvious fallback: if the space is unreachable, `localStorage` still works. It is
also the option most exposed to the alpha's disposable dev PDS, which is why it is behind
5.1 despite being simpler.

### 5.4 A reader community space

A book-club space (`site.supperclub.club`) where readers post theories, meal photos, and
spoiler-safe discussion — each reader's posts living in *their own* PDS repo, not our
database. This is the multi-writer shape spaces were actually built for, and it is the one
that requires real work: a syncer that holds a credential, maintains the writer set, and
pulls each member's repo, because there is no firehose to subscribe to.

Genuinely appealing for a series whose whole premise is a group at a table, and a good
answer to spoiler management (a per-book club space naturally partitions discussion). But
it is a product, not a projection, and it should not be attempted while the protocol is
alpha.

### 5.5 Private drafts and a shared writers' room

Cross-device drafts, and a shared space if the series ever has more than one author or
spins off something multiplayer. Listed for completeness — git already does this well for
us, and this is the weakest case of the five.

---

## 6. Consequences for our identity model

[`ARCHITECTURE.md`](ARCHITECTURE.md) §7 defines a graduation ladder: local stable IDs →
one repo with multiple collections → per-character DIDs only when portability demands it.
Spaces do not disturb it, but they add one decision.

A space authority may be an ordinary account DID, or a **dedicated DID that transfers
between accounts** independently of any individual person. If we ever anchor a backstage
or club space, it should be rooted in a dedicated project DID — a series should not be
hostage to whoever holds a personal Bluesky account. This costs nothing to decide now and
is awkward to change once readers hold credentials issued by an authority.

Note also that the space authority is a position of real power: it can decline to issue
credentials to a specific reader, or stop answering for the space entirely, and members'
records simply become unreadable to everyone but themselves. That is the right lever for a
publisher to hold, and a reason to hold it as the project rather than as a person.

---

## 7. What spaces do *not* solve

- **They are not confidentiality.** Interiority files never leave this repo, in any lane.
  Access control is a door, not a vault.
- **They are not a public distribution channel.** Public chapters stay on the public
  lane — the site first, `site.standard.document` records as an optional mirror. A space
  is the wrong home for anything meant to be found.
- **They do not do spoiler gating.** All-or-nothing read access cannot express a horizon.
  The per-chapter fragment approach in `site/src/lib/lens-data.ts` stays.
- **They do not come with infrastructure.** No relay means any multi-writer view needs a
  syncer we operate. A single-writer space (5.1) mostly dodges this; 5.4 does not.
- **They do not change the derived-layer discipline.** Backstage records would still be
  generated from authored source, not typed into a client.

---

## 8. Alpha risk posture

The alpha ships running code, published SDKs, a sample app, and a hosted dev PDS — and is
explicit that there will be breaking changes, that production code should not run against
it, and that the alpha PDS **goes away when the alpha ends**, taking its accounts with it.
The lexicons under `com.atproto.space` are still moving; proposal 0016 is labelled a
proposal, not a specification.

For a project whose reader-facing surface is a static site that must simply keep working,
that maps to: **build nothing reader-facing on spaces yet.** The cost of being early here
is not wasted code, it is readers whose bookmarks or backstage access break.

---

## 9. Recommendation

**Adopt nothing now. Take the free prep, and set clear triggers.**

Free now, useful regardless:

1. **Reserve the space type NSIDs** under `site.supperclub` alongside the record types —
   `backstage`, `horizon`, `club`. Naming costs nothing and prevents a collision with our
   own record NSIDs later.
2. **Keep writing backstage content as derivable `message` records** with stable ids, the
   same discipline as every other record type. Whether it is later served by our own
   surface or emitted into a space is then a publishing decision, not a rewrite.
3. **Decide the authority DID question in principle** (§6): a dedicated project DID, not a
   personal account.

Triggers to revisit:

| Trigger | Then look at |
|---|---|
| Spaces leave alpha with a stable spec | 5.1 backstage, 5.3 horizon |
| A paid or gated tier becomes a real plan | 5.2 — `managing-app` vs. building our own auth |
| Cross-device reading progress becomes a real complaint | 5.3 — cheapest experiment, safe fallback |
| A reader community becomes a goal, and we can run a service | 5.4 |

The honest summary: spaces resolve a tension in our architecture that we had already
routed around, and the routing-around still works. This is worth watching closely and
worth nothing to rush.
