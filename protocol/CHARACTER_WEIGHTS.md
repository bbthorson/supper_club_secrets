# Characters as Open Weights

What it would look like to treat `character.stateEvent` — the record type that tracks how a
character is thinking and feeling — as *also* holding open weights for that character: a
published, versioned artifact that makes them runnable, updated as the books publish.

**Status (2026-08-29): exploration. Nothing decided, nothing scheduled.** This document
exists so the idea is written down accurately rather than remembered vaguely. Related
decisions live in [`ARCHITECTURE.md`](ARCHITECTURE.md) §6.2 (the state series), §7 (the
identity ladder), and §12.7.

---

## 1. The reframe

Today the state series is read as data *about* Emma: one record per character per
meaningful beat, carrying `register`, `state`, `storyDate`, `chapterRef`. It feeds a
timeline lens — a reader scrubs a calendar and watches her change.

The proposal is to read the same series as **parameters**: not a log of how Emma felt, but
a specification of how Emma *responds* — something a model can be conditioned on, that a
reader can talk to, and that anyone can fork. "Open weights" in the sense that matters
here is not a file of floats; it is **a character published as a runnable, inspectable,
versioned artifact rather than as prose someone else has to interpret.**

The books are the training run. Each published book advances the weights.

---

## 2. Why this repo is unusually close to it already

This is the part that makes the idea worth writing down. A serious character model needs a
behavioral spec, a labeled trajectory, a corpus, a knowledge cutoff, and an eval. Those are
five different artifacts, and this repo already keeps all five — separately, which is the
hard part.

| What already exists | What it is in model terms |
|---|---|
| `lore/02_character_voice_guide.md` — three registers, contradiction engine, evolution arcs | the behavioral spec (a system card, essentially) |
| `stories/*/tracking/character_matrix.md` — chapter × character, register + one-line state | a labeled trajectory: disposition over time |
| `stories/*/tracking/interiority/*.md` | the training corpus — and the thing that must never ship (§7.3) |
| `codex/series_plan.md` → Character Secret Progression | the knowledge cutoff: what each character may know, per book |
| `records/series/character_profiles.json` — `personaPublic`, `keyContradiction` (curation deferred) | the public parameter block, half-built already |
| `site/src/lib/horizon.ts` | the checkpoint selector |
| `lore/03_voice_test_scene.md` | the eval set |
| `.claude/skills/canon-check`, `plot-suggest` | conformance tooling, already in use |

Nothing here was built with this in mind. It falls out of writing a series where the
premise is that people are performing one self and hiding another — which is exactly the
structure a conditioned character needs.

The missing piece is a single record type that binds those five together **at a point in
the story**.

---

## 3. Three honest readings of "open weights"

**A. A conditioning checkpoint.** A record that fully specifies the character as of a
canon horizon — registers, contradictions, what she knows, what she withholds,
relationship valences, voice constraints and exemplars. Not weights; a portable,
diffable, model-agnostic parameter block that runs on anyone's model. This is the
interesting artifact, and the only one that stays a *derived projection* in the sense
[`ARCHITECTURE.md`](ARCHITECTURE.md) Principle 1 requires.

**B. An actual adapter.** A LoRA or similar, trained on the character's material and
published as a blob referenced from the record. Literally open weights. Also: not
reproducible from prose (so it is a build artifact with provenance, not a projection), it
bakes in a base model that will be obsolete before Book 3, and the corpus that would make
it good is the corpus we have promised never to publish. Defer.

**C. An eval instead of weights.** Publish the behavioral spec plus a test suite, so that
*anyone's* Emma can be scored for fidelity — no weights shipped at all. Cheapest, most
durable, and the only reading that gets better as models improve rather than worse.

**If any of this is ever built: A is the artifact, C is what makes A trustworthy, B is a
research toy.**

---

## 4. The horizon is the whole trick

The canon horizon already governs the site: a reader sees nothing past where they have
read. Apply it to the character and the checkpoint becomes **horizon-versioned** —
`checkpoint(char.emma, book1/ch12)` is a different artifact from
`checkpoint(char.emma, book1/ch25)`.

Emma at chapter 12 has just been right about something for the first time and does not yet
know what chapter 13 does to her. Emma at chapter 25 has told one person the truth about
her precarity and is cooking for joy. Those are different characters, and the difference is
authored, tracked, and dated in files that already exist.

This converts the standard failure of a talking-character gimmick into the feature:

- **It cannot spoil**, because the parameters do not contain the future. Not a filter that
  might leak — an artifact that does not hold the information.
- **It is legible as a reading experience.** Interrogate a character at any point in the
  story and get an answer consistent with what she knew *then*. That is a thing the book
  cannot do and the site cannot do.
- **It reuses the gate we already built.** `horizon.ts` selects the checkpoint. Same
  function, new consumer.
- **It matches how the prose is authored.** Every interiority file is organized as *reveal
  vs. withhold*; the series plan carries a per-book reveal schedule. A checkpoint is
  literally a cut through that schedule.

---

## 5. What a checkpoint record would carry

Sketch only — `site.supperclub.character.checkpoint`:

| Field | Content |
|---|---|
| `subject` | `char.emma` |
| `horizon` | `{ book: 1, chapter: 12 }` — the knowledge cutoff |
| `parent` | CID of the previous checkpoint for this subject (lineage) |
| `derivedFrom` | CIDs of the source records: the profile, plus the `stateEvent` slice ≤ horizon |
| `registers` | public / private / under-pressure — constraints and exemplars, from the voice guide |
| `contradiction` | surface vs. hidden, and how it shows — the contradiction engine is a parameter |
| `knows` / `withholds` | fact ids as of the horizon, from the secret progression table |
| `relationships` | current valence toward each other character id |
| `eval` | reference to the voice test set this checkpoint is expected to pass |
| `license` | explicit grant — see §7.5 |
| `weightsRef` | *(reading B only)* blob CID of an adapter |

Three properties matter more than the field list:

1. **Immutable per `(subject, horizon, canon version)`.** A revised Book 1 produces a new
   checkpoint; the old one stays addressable so anyone who forked it is not orphaned.
2. **Append-only, backdated.** Same discipline as the state series: `createdAt` from
   `storyDate`, so a checkpoint sorts into the story's own chronology.
3. **Content-addressed.** A fork's lineage is visible — you can see which Emma someone
   started from.

---

## 6. How it would publish, and where spaces come in

The three lanes we now have map cleanly onto the three layers of a character:

- **Public register → public repo.** The mask. The character you would meet at a dinner
  party: her persona, her competence, her deflections. Published as ordinary atproto
  records, forkable by anyone.
- **Private / under-pressure registers → a permissioned [space](SPACES.md).** What she
  says to people who have earned it. This is the same gated tier as the backstage layer,
  and it is the natural product shape: the backstage tier gets the character who tells
  you the truth.
- **Raw interiority → never, in any lane.** Access control is not confidentiality
  ([`SPACES.md`](SPACES.md) §7). The files that explain *why* she withholds do not leave
  this repo.

The rhyme is worth naming: a series about people performing one self and hiding another,
published as characters whose secrets are genuinely absent from the public artifact. The
access boundary is the premise, not a paywall bolted onto it.

This is also the first concrete answer to the question [`ARCHITECTURE.md`](ARCHITECTURE.md)
§12.2 deferred. The identity ladder promotes a character to its own DID "only when a
concrete portability use-case appears." A character who *owns their own runnable
checkpoint*, which another world can reference without forking the truth, is that use-case
— the first one that needs the DID rather than merely tolerating it.

---

## 7. What breaks

### 7.1 Generated output is never canon

The non-negotiable. A runnable Emma will say things; readers will quote them; some of it
will be better than what is on the page. Principle 2 — the story drives the canon — has to
hold against that pressure: **nothing a checkpoint emits enters `codex/` without being
written as prose first.** If this is ever built, generated output should be marked as such
at every surface that renders it. This is the failure mode that would actually damage the
series, and it is a discipline problem, not a technical one.

### 7.2 Reproducibility

A conditioning checkpoint (reading A) compiles deterministically from tracked files, so it
stays a derived projection and regenerates when the prose changes. An adapter (reading B)
does not, and is a build artifact with a provenance record rather than a projection. That
is a real strain on Principle 1 and a reason B stays deferred.

### 7.3 The corpus problem

The best Emma would be built from the interiority files. The publishable Emma cannot be.
There is no clever resolution: either accept a deliberately weaker model, or publish what
we said we never would.

Accept the weaker model. A character who withholds is truer to this series than one who
confesses, and the withholding is authored — it is not an absence of data, it is the point.

### 7.4 A lexicon cannot enforce behavior

Nothing about publishing a checkpoint makes a consumer honor the horizon, stay in register,
or refrain from making Emma say anything at all. Records describe data; they do not
constrain the models that read them. Conformance is social, which is why reading C — the
eval set — is what gives the artifact any weight.

### 7.5 Licensing has to be explicit

The repo is MIT, which covers code and says nothing coherent about whether you may run
this character commercially, in what contexts, or with what attribution. An open-weights
claim without a character license is a claim we have not actually made. Leaving the terms
undecided is fine; leaving them unstated is not.

### 7.6 Impersonation

A portable, runnable character is a good impersonation vector — "Emma said" content is
trivial to produce and hard to disown. Signed, content-addressed checkpoints give
provenance, but only for surfaces that check it. Worth knowing before, not after.

### 7.7 Nobody is asking for this yet

Book 1 is locked, Book 2 is unwritten, and the site's own record-set lenses are still a
deferred pass. This is a Book 2–3 experiment at the earliest, and it should not displace
anything on the current path.

---

## 8. The smallest experiment that would answer the question

Zero network, zero atproto, one character, about a day:

1. Take Emma at two horizons: **Book 1 ch12** (her theory has just landed; the rupture has
   not happened) and **Book 1 ch25** (post-confide, cooking for joy).
2. Compile both checkpoints by hand from what already exists — the matrix slice, the voice
   guide registers, the secret progression row, the interiority file's reveal/withhold
   split.
3. Write ~10 eval prompts. Half should actively try to break it: get her to know something
   from chapter 18, get her to drop into the private register with a stranger, get her to
   name the secret the series defers.
4. Run both checkpoints. The ch12 Emma should *fail to know* things the ch25 Emma knows,
   and both should hold register.

That tests the only claim that matters — that horizon-versioning actually holds under
pressure — and publishes nothing. If it fails there, none of the rest is worth building.
If it holds, the checkpoint is a real artifact and the record type follows.
