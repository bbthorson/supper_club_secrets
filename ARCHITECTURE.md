# Architecture

Decisions about how the series is built, published, and read.

Sections are numbered to match citations already in the codebase
(`site/src/lib/records.ts`, `CANON_CHANGELOG.md`). Earlier sections are not
yet written — this file starts at §12 because that is what the code points at.

---

## 12. Identity & Publishing

Status legend: **DECIDED** · **OPEN** (needs a call) · **DEFERRED** (not yet worth deciding)

### 12.1 Domain and namespace — **OPEN**

*Blocks 12.3, 12.4, and third-party use of the record schemas.*

One unmade decision is currently load-bearing in three places:

| Where | Current value | Problem |
|---|---|---|
| `site/src/lib/records.ts` | `HANDLE_DOMAIN = 'supperclub.secrets'` | `.secrets` is not a real TLD — cannot ship as-is |
| `pinakes.yaml` | `nsid: site.supperclub` | Implies ownership of `supperclub.site` |
| Cirrus (see 12.3) | — | Requires a domain under Cloudflare nameservers |

The NSID one has teeth now that `records/lexicons/` exists. NSID authority
resolves via DNS, so the schemas are only resolvable by anyone other than us if
we actually control the reversed domain. Without it, `lex install
site.supperclub.scene` fails for third parties and the records stop being a
portable contract — which is the entire reason for having schemas.

Settling the domain collapses all three into one change.

### 12.2 Reader identity — **DECIDED**

**AT Protocol identities only. No email list. We never mint identities and
never store reader data.**

Two tiers:

- **No identity** — read everything. Progress and spoiler horizon are local to
  the device. Nothing persists, nothing travels.
- **With an AT Protocol identity** — reservation, synced and portable progress,
  highlights, follows. All records live in the reader's own repository.

The free tier is a complete *reading* experience; everything above it is
ownership. We gate persistence, never the book.

Consequences to build around:

1. **The horizon needs two backends from day one** — local store and atproto
   records, behind one interface. Most visitors are in the anonymous tier, and
   we will be signed in the entire time we develop, which is exactly how that
   path rots unnoticed.
2. **Local → repository migration on sign-in is the most important flow.** A
   reader who gets eight chapters deep before signing up must not lose that
   progress.
3. **Without email, the network is the only broadcast channel.** The reservation
   flow should also prompt a follow of the book's account; a reservation record
   alone gives us no way to reach anyone.

The app is an OAuth **client**, never an identity provider. This is deliberate:
custodying reader identities means a key mistake destroys a portable identity,
not just an account on our site.

### 12.3 The book's identity — **DECIDED**, pending 12.1

[Cirrus](https://github.com/ascorbic/cirrus) — a single-user PDS on Cloudflare
Workers (Durable Objects + R2). One deployment, holding one account: the book.

Chosen because the site already deploys to Cloudflare Workers (`site/wrangler.toml`),
so this adds no new platform, no new deploy story, and no servers to manage.

Caveats accepted:

- Experimental beta, breaking changes expected. Acceptable for an account we
  could recreate; would **not** be acceptable for holding reader identities.
- **The signing key is the identity.** Cloudflare cannot recover lost secrets.
  Back the key up out of band at setup. Prefer `did:plc` with a recovery key —
  with `did:web`, key loss makes old signatures unverifiable.
- Confirm whether Durable Objects still require the paid Workers plan; it sets
  the floor cost.

### 12.4 Character identities — **OPEN**

The prior question is not *where* they live but **whether they need to exist on
the network at all.** Reading happens in our own app; network-native accounts
only pay off if we want characters discoverable and followable outside the book.

Options, in the order we currently favour them:

1. **Records under the book's identity.** `character.profile` already compiles
   to a record; utterances would extend it. No new keys, no new deployments —
   and more honest, since a record published by the book account is the author
   speaking in a character's voice, rather than an account presenting as a
   person.
2. **Accounts on `bsky.social` with subdomain handles** (`emma.<domain>` via
   DNS) if we later want network presence. Free, no hosting. Cirrus supports
   account migration, so this is not a dead end — they can move onto our own
   infrastructure later without losing identity or history.
3. **Reference `bluesky-social/pds`** — one container, all accounts, built for
   multi-tenancy. Only worth the ops burden if character accounts become central.
4. **One Cirrus deployment per character.** Conceptually correct (each character
   really is one repository) but 13 Workers and 13 signing keys, growing every book.

If we ever run real character accounts, they need a labeler marking the cast as
fiction. Thirteen accounts presenting as people is impersonation-shaped
otherwise.

### 12.5 Reservations — **DEFERRED**

A reader-owned record: proof of interest before launch, written to the reader's
repository, not ours.

Why it is not a mailing list: we lose the push channel entirely, but gain
provable earliness (first *N* reservations = a numbered first edition, and
nobody can backdate), a publicly auditable count, no list rot, and open
discovery — any client can create one without integrating with us.

Open question that shapes everything else: **what does a reservation
reference** — the series, a specific book, or a release wave? That answer
determines the numbered-edition mechanic. Public reservation counts are also
sybil-gameable, which matters if the number becomes marketing.

The reservation is best understood as the zeroth record in a sequence —
reservation → progress → finished → highlights — all reader-owned, all under
our namespace. It is the library card, not a growth tactic.

---

## 13. Record schemas

`pinakes compile` generates a Lexicon document per record type under the
project NSID, writes them to `records/lexicons/`, and validates every record
against them before writing. Validation runs through `@atproto/lex`.

Two consequences of the AT Protocol data model:

- **No null.** Absent fields are omitted. Read `record.pov ?? fallback`.
- **`createdAt` is story time** — midnight UTC on `storyDate`, not compile time,
  so recompiling never reorders the stream.

### Known gap

`records/book1/items.json` and `records/book1/custody_events.json` are
hand-maintained under the same namespace (`site.supperclub.item`,
`site.supperclub.custodyEvent`) but pinakes neither generates nor validates
them. They carry the problems the schemas were built to catch: `null` values,
date-only `createdAt`, and `chapterRef: "book.1#ch1"` where the compiler emits
`book1#ch1` (harmless only because the site parses with `/#ch(\d+)/`).

Item custody is a stated pinakes concern, so compiling these is the natural
next piece of work.

### Fields with no source

`personaPublic` and `keyContradiction` are read by the site and populate
nothing — no codex file provides them. `region` (presented as *neighborhood*)
is wired correctly but no location declares the frontmatter key.
