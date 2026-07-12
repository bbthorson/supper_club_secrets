# AI-Tells Taxonomy

A checklist for the **prose-craft pass** (see `SKILL.md`). AI-generated prose has recurring
stylistic tells — phrasing patterns, buzzwords, and fiction tics that make writing feel
formulaic. This file is the catalogue the pass scans against, calibrated for *Supper Club
Secrets* at the bottom.

## The one rule that keeps this honest

**Flag repetition and formula, not presence.** Almost every item below is also a legitimate
craft tool. Em-dashes, the rule of three, sensory grounding, a character's physical reaction
to fear — these are how good prose works. The tell is not that they appear; it's that they
appear *on a schedule*: the same device, the same rhythm, the same somatic beat, recurring
until the prose reads as generated rather than written.

Three consequences:

1. **This is a whole-book judgment.** A single em-dash or one metallic tang is invisible at
   the chapter level and only resolves into a tell across the book. That's why this is an
   audit pass, not a `canon-check` line — per-chapter reads structurally cannot see the
   pattern.
2. **Frequency beats instinct.** For the greppable tells, get a count before you judge.
   "Feels em-dash-heavy" is worthless; "41 em-dashes across 12 chapters, 9 of them in Ch. 7"
   is a finding. The mechanical pre-pass (below) exists for exactly this.
3. **Honor the style guide's carve-outs.** *SCS mandates sensory-first prose* — the book is
   *supposed* to smell of things, so the tell here is the recycled palette, not scent. And a
   **catalogued voice tic** (Emma's dialect, Jasper's breathlessness) is a designed feature —
   never flag it as an AI physical-tell. See the SCS calibration section for the specifics.

## Severity mapping

AI tells are a **craft** concern. They feed **Tier 3 — Craft** of the report and follow a
different severity ladder than continuity findings:

- A tell appearing **once or twice** → 🔵 nit (note it, don't tier it).
- A tell forming a **pattern** (same device recurring across many chapters, or clustered
  heavily in one) → 🟡 slip.
- **Never 🔴, never Tier 1.** An AI tell does not break canon; it's a polish call the author
  owns. Frame every finding as a *suggestion with a location*, not a mandate.

## The mechanical pre-pass (feeds the judgment pass)

Some tells are countable. Run these before the judgment read and hand the model the counts,
so it spends its attention deciding *whether the frequency is a problem in this genre* rather
than hunting blind. Report per chapter and book-total.

| Tell | Cheap signal (adapt regex to your prose) |
|------|------------------------------------------|
| Em-dash density | count `—` per 1000 words, per chapter |
| Negative parallelism | `not (just \|merely \|only )?[^.]{1,40}[—,] (it'?s\|but) ` and "It wasn't X. It was Y." |
| "Here's the kicker" | `here'?s (the\|where) (the )?(thing\|kicker\|catch\|interesting\|deal)`, `but here'?s` |
| Corporate/AI filler | `\b(delve\|leverage\|unlock\|elevate\|testament\|tapestry\|landscape\|ecosystem\|symphony\|realm\|navigate the)\b` |
| Magic adverbs | `\b(deeply\|quietly\|fundamentally\|remarkably\|profoundly\|utterly\|palpably)\b` frequency |
| Recycled physical tells | somatic-beat frequency per chapter: `\b(jaw\|breath\|throat\|chest\|pulse\|swallow\w*\|exhal\w*)\b`; then flag the *same* beat (e.g. a clenched jaw) recurring across chapters or clustered in one |
| Chapter-ending symmetry | for each chapter, flag when its **last sentence stands alone as its own paragraph and runs under ~12 words** — a cheap proxy for the "epiphany button" close. A pattern across many chapters is the tell. |

Counts are inputs, not verdicts. The judgment pass decides which counts are genre-legitimate
and which are the model's fingerprints.

The last two rows are **proxies**, not detectors — a somatic word isn't automatically a tell,
and a short final paragraph is sometimes the right ending. They exist because these two tells
have no clean single-token signal and are the easiest to skip on a judgment-only read (the
chapter-ending one especially: it requires deliberately reading all N closing paragraphs
together). In the Book 1 test drive the epiphany-button close was the single highest-yield
finding *and* had zero mechanical signal — this proxy exists so a future pass can't miss it.
Watch the SCS-specific carve-out: **do not** count Oliver's catalogued "quietly" register or
a somatic beat listed in the voice guide against these totals. A **repeated-construction /
n-gram scan** (the same distinctive phrase reused at two big beats — Book 1's "the version of
himself who lived in the forums" appeared near-verbatim at both of Oliver's peak moments) is a
worthwhile optional extension: it's a symmetry tell no fixed regex predicts.

## The taxonomy

### A. Phrasing & structure

- **Negative parallelism ("Not X — it's Y").** The reflexive "It's not a bug; it's a design
  flaw" cadence. One is rhetoric; a habit of it is a tell. Flag when it recurs as a
  paragraph- or scene-closing move.
- **Rule of three / tricolon abuse.** Concepts, adjectives, or clauses grouped in threes,
  especially semicolon-separated lists. Flag *repetition of the pattern*, not any single triad.
- **Em-dash addiction.** Em-dashes forcing dramatic pauses or explanatory asides at high
  density. Use the count; flag clusters and book-wide density spikes.
- **"Here's the kicker" reveals.** Manufactured revelation: "But here's the thing," "Here's
  where it gets interesting," "The kicker?" A narrator nudging the reader toward its own
  cleverness.

### B. Buzzwords & vocabulary

- **Magic adverbs.** "Deeply," "quietly," "fundamentally," "remarkably" propping up a flat
  sentence to feel profound. Flag frequency and the *deeply/quietly + verb* construction.
- **Grandiose metaphors.** Over-reliance on "tapestry," "landscape," "ecosystem," "symphony,"
  "realm," "dance of." Flag when abstraction substitutes for a concrete image.
- **Corporate/AI filler.** "Delve," "leverage," "innovative," "transform," "unlock,"
  "testament to," "navigate." Genre-check each; the tell is the cluster.
- **Vague attribution.** "Experts argue," "studies show," "it's said that," "many believe" —
  unspecified authorities. Flag when it stands in for a real source or a specific voice
  (watch Noah's tech exposition and any essayistic narration).

### C. Fiction & storytelling tics

- **Physical tells as emotion.** The recycled somatic vocabulary: hitched/caught breath,
  tight or clenched jaw, dilating pupils, swallowing hard, a "breath he didn't know he was
  holding," exhaling through the nose. Flag when the *same* beat recurs across chapters as the
  default emotion-carrier. **Carve-out:** a somatic beat catalogued as a character's voice tic
  is designed, not a tell (see SCS calibration).
- **Sensory clichés.** The stock sensory kit: metallic tang, the smell of ozone, jasmine,
  sandalwood, petrichor; "the air was thick with." Flag *recycling of the same few
  sensations*, not sensory writing itself. **Carve-out:** SCS is sensory-first by mandate —
  the tell is the narrow, repeated palette, not the presence.
- **Meaningless action filler.** Characters performing business they don't want and that
  carries no meaning — the cigarette they didn't want, the coffee they don't drink, crossing
  and uncrossing arms to fill a beat. Flag gestures that neither characterize nor advance.
- **Perfect symmetry.** Paragraphs of near-identical length; every scene or chapter closing on
  a tidy, inspirational bow; each beat resolving too neatly. Flag mechanical evenness — real
  prose has ragged, load-bearing asymmetry.

## SCS calibration

*Supper Club Secrets* is warm cozy-crime with a mandated sensory-first style. That combination
makes two tells easy to over-flag and two easy to miss.

**Never flag these — they're designed (the allowlist).** Catalogued voice tics from
`ai_instructions.md` §3–§4 and `world building/02_character_voice_guide.md`:

- **Emma's** Western PA dialect surfacing under pressure.
- **Jasper's** breathless energy — *and its reversal, going quiet*.
- Each character's registered public/under-pressure modes (Elijah's cold precision, Noah's
  tech jargon, Olivia's dramatic storytelling, Oliver's quiet deference).

These are *supposed* to recur — roughly once per scene, per §3. That's a voice signature, not
an AI tell. (Their *overuse* — every line instead of once per scene — is already a Tier 3
finding under the continuity pass's voice check; don't double-report it here.) Before flagging
any repeated verbal or somatic beat, check it against the voice guide and
`canon library/characters/*.md`; if it's catalogued there, it's out of scope for this pass.

**The sensory carve-out is load-bearing here.** §2 requires sensory-first prose and "at least
two senses beyond taste" in food scenes. Do **not** flag the *presence* of smell/texture/sound.
**Do** flag a narrow, recycled palette — if the same three or four sensations (e.g. one
signature smell, one texture word) carry every food scene, that's the tell the mandate is meant
to prevent, not license.

**Two tells this genre is especially prone to — watch them:**

- **Perfect symmetry / inspirational bow.** Warm cozy-crime wants to close chapters and meals
  on a satisfying note; the failure mode is *every* chapter landing the same tidy emotional
  bow. Check chapter-ending rhythm across the book.
- **Recycled physical tells.** With six recurring characters and frequent emotional beats at
  the table, an *uncatalogued* somatic default (everyone "swallowing hard," breaths catching)
  spreads easily. This is the highest-value thing to count here.

**Menus and meals** map to fixed emotional states (§9). Repetition of a *dish or ritual across
books* is intentional series texture — not a symmetry tell. Judge symmetry on sentence and
paragraph rhythm, not on the recurring supper-club structure.

## What a finding looks like

> 🟡 **Recycled physical tell — "breath she didn't know she was holding."** Appears Ch. 3, 6,
> 7, 11 (4×), each as the release beat after tension. `ch07.md:212`, `ch11.md:88`, … Not in
> the voice guide's tic list. Suggest varying the release or cutting two instances. *(Tier 3
> — author's call; not a continuity issue.)*

Cite locations, give the count, name the carve-out you checked (voice guide / sensory mandate),
and mark it a suggestion. Never present an AI-tell finding as something the book is *wrong* for
having.
