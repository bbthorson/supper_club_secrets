# Chapter Writing Guide

## Chapter Frontmatter (REQUIRED)

Every chapter file begins with a YAML frontmatter block. The frontmatter is the chapter's source of truth for timeline, location, voice register, and threads — it forces you to know what the chapter is doing before you write or edit prose. The block is stripped automatically at epub build time.

### Spec (canonical field set — locked 2026-07-05)

Example mirrors the live block in `stories/01. The Case of the Missing Hot Sauce/chapters/m3_13_service_for_one.md` (the canonical demo — keep the two in sync). **Required:** `chapter`, `title`, `meal`, `beat`, `date`, `pov`, `characters_present`, `registers`, `threads`, `beat_purpose`. **Optional:** `day`, `time`, `location`, `characters_referenced`, `clues`, `audit_notes` (include when they apply).

```yaml
---
chapter: 13
title: "Service for One"
meal: 3
beat: "Bad Guys Close In"                 # Save the Cat beat or sub-beat
day: "Monday → Wednesday"                 # human-readable (optional)
date: "2026-10-12 to 2026-10-14"          # ISO, absolute (required). A span is allowed.
time: "Mon morning → Tue afternoon → Wed midday"   # time-of-day or span (optional)
location:                                 # exact canonical names from canon library/locations/index.md
  - "Emma's Apartment"
  - "McGolrick Park Farmers Market (referenced)"
pov: "Emma"                               # the chapter's feed owner (required)
characters_present:                       # on-page in an active scene (required)
  - "Emma (centerstage)"
  - "Garrett Pike (Wed, in person — first on-page appearance)"
  - "Olivia (phone call, end of chapter)"
characters_referenced:                    # named but not on-page (optional)
  - "Sofia (texted, silent)"
  - "Dorothy (texted, no read receipt)"
  - "Emma's editor (kills the squash piece)"
registers:                                # voice register per PRESENT character (required)
  Emma: "private → under-pressure"
  Garrett Pike: "public (charm-as-menace)"
  Olivia: "private (protective)"
clues:                                     # optional; powers clue-tracing
  planted: []                              # Foundation / Misdirection / Connective / Confirmation / Keystone
  revealed:
    - "C&D arrives"
    - "Pike has dug into Emma's finances (coded, unnamed)"
threads:                                   # must cross-reference tracking/subplot_threads.md
  active:
    - "Main mystery: retaliation begins as an economic squeeze on Emma's livelihood"
    - "Antagonist revealed: Garrett Pike approaches Emma in person (identity payoff + Ch1 market-seed payoff)"
  touched:
    - "Sofia/Dorothy silence — the menace has neighborhood reach"
beat_purpose: "Bring the threat home and put a face on it. The pressure is economic and personal, not an exposed secret. Pike reveals himself with a charm that reads as menace."
audit_notes:                               # optional; continuity/decision notes for this chapter
  - "Economic squeeze (cancelled assignments) spreads across Mon–Wed, which resolves the old day-jump compression and fills the Tuesday void."
  - "Pike's appearance pays off the well-dressed man seeded in Ch1 and the out-of-place man at Dorothy's stall in Ch12."
  - "Opaque-secret direction: no OnlyFans exposure. Emma's vulnerability is economic/precarity, confided privately to Olivia in Ch14."
---
```

### Rules

1. **`date` is absolute.** Never write `date: "the next day"`. Use ISO format. This is the single biggest defense against timeline drift across chapters.
2. **`location` is canonical.** Use the **exact** display name from `canon library/locations/index.md` (capitalization included) so extraction can resolve it to a canonical ID. The only permitted qualifier is a trailing `(referenced)` when a place is named but isn't the active scene. Settings that genuinely aren't in the registry (a one-off road stop, a public space) are written as plain free text — they simply won't resolve to an entity. Check the scheduling/travel rules in the index for constraints (markets, shops, etc.) before assigning a date.
3. **`registers` only lists characters in active scene.** A character mentioned but not present doesn't get a register. If a character is in the scene but no register is listed, that's a flag — they're probably reduced to set dressing.
4. **`threads` must reference an entry in `tracking/subplot_threads.md`.** If a thread is touched here, it should appear there with this chapter cited.
5. **`beat_purpose` is one sentence.** What does this chapter accomplish that no other chapter does? If you can't answer, the chapter probably doesn't need to exist.

---

## Chapter Structure

Each chapter should accomplish **1-2 story beats** (see Writing Guide). Length follows function:

| Chapter Type | Word Count | Purpose |
|--------------|------------|---------|
| Scene bridge | 800-1,200 | Quick transition, single beat |
| Standard | 2,000-2,500 | One or two beats, moderate pacing |
| Meal scene | 2,500-3,500 | Ensemble dialogue, multiple threads |

---

## File Organization

Chapters live in a single flat `chapters/` folder. Each chapter file is prefixed with its meal number for at-a-glance arc tracking:

```
chapters/
├── 00_story_outline.md          ← Full chapter-by-chapter breakdown
├── 00_meal_summaries.md         ← Quick-reference arc summaries per meal
├── m1_01_chapter_title.md       ← Meal 1: Setup (Chs. 1–5)
├── m1_02_chapter_title.md
├── m1_03_chapter_title.md
├── m1_04_chapter_title.md
├── m1_05_chapter_title.md
├── m2_06_chapter_title.md       ← Meal 2: Investigation (Chs. 6–11)
├── m2_07_chapter_title.md
├── ...
├── m3_12_chapter_title.md       ← Meal 3: Crisis (Chs. 12–15)
├── ...
├── m4_16_chapter_title.md       ← Meal 4: Resolution (Chs. 16–18)
├── m4_17_chapter_title.md
└── m4_18_chapter_title.md
```

### Naming Convention

`m[meal]_[chapter number]_[snake_case_title].md`

- **Meal prefix** (`m1_`, `m2_`, `m3_`, `m4_`): Groups chapters visually by story arc
- **Chapter number**: Sequential across the entire story (not per-meal)
- **Title**: Snake_case version of the chapter title

### Typical Chapter Distribution

| Meal | Arc | Chapters | Count |
|------|-----|----------|-------|
| m1 | Setup | 1–5 | 5 |
| m2 | Investigation | 6–11 | 6 |
| m3 | Crisis | 12–15 | 4 |
| m4 | Resolution | 16–18 | 3 |
| **Total** | | | **18** |

This is a guideline, not a rule. Books may have 17–21 chapters, and the meal boundaries can shift by a chapter or two.

---

## Chapter Titles

Each chapter should have a title. Use the format:

```markdown
### Chapter [Number] — [Title]
```

Titles should be evocative and often food-related (e.g., "Stirring the Pot," "A Fine Sieve," "Coming to a Boil").

---

## Chapter Checklist

Before moving on from a chapter:

- [ ] Clear POV maintained throughout
- [ ] At least one beat accomplished
- [ ] Character voices consistent with Voice Guide
- [ ] Sensory details ground the scene (if meal scene: 2+ senses)
- [ ] Any clues planted are subtle but findable on reread
- [ ] Dialogue tags minimized, actions preferred
- [ ] Chapter ends with forward momentum
- [ ] Menu references consistent with the story's menu plan
