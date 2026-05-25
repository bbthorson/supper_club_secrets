# Chapter Writing Guide

## Chapter Frontmatter (REQUIRED)

Every chapter file begins with a YAML frontmatter block. The frontmatter is the chapter's source of truth for timeline, location, voice register, and threads — it forces you to know what the chapter is doing before you write or edit prose. The block is stripped automatically at epub build time.

### Spec

```yaml
---
chapter: 13
title: "Service for One"
meal: 3
beat: "Bad Guys Close In"                 # Save the Cat beat or sub-beat
day: "Monday"
date: "2026-10-26"                        # ISO. Use absolute dates, not relative.
time: "morning to 2:47 PM"                # Time-of-day or span
location:
  - "Emma's apartment"
  - "McGolrick Park (referenced)"         # Mark as (referenced) if not the active scene
pov: "Emma"
characters_present:
  - Emma
  - "Process server (incidental)"
  - "Dorothy (offstage, referenced)"
registers:                                # Voice register per character in scene
  Emma: "private → under pressure"
clues:
  planted: []                             # Foundation / Misdirection / Connective / Confirmation / Keystone
  revealed:
    - "C&D arrives"
    - "Kinky Kitchen is known to the mogul"
threads:                                  # Cross-reference subplot_threads.md
  active:
    - "Main: Pike retaliates"
    - "B-plot: Emma's OnlyFans weaponized"
  touched:
    - "Sofia silence (texts unanswered)"
beat_purpose: "Bring the legal threat home. Emma's safety is no longer abstract."
---
```

### Rules

1. **`date` is absolute.** Never write `date: "the next day"`. Use ISO format. This is the single biggest defense against timeline drift across chapters.
2. **`location` is canonical.** Use the exact name from `canon library/locations_registry.md`. Check the Canon Rules section for schedule constraints (markets, shops, etc.) before assigning a date.
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
