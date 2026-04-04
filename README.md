# Supper Club Secrets

*Supper Club Secrets* is a "cozy crime" anthology series about a group of friends in Brooklyn who solve local mysteries, one dinner party at a time. This repository contains all the world-building, character, and story files for the series.

---

## Directory Structure

This universe is organized into three layers, each with a distinct role:

### 📚 world building/
**Role: Rules and patterns.** High-level creative rules that govern how the series works — tone, voice, structure, pacing. These files change rarely. They tell you *how to write* in this universe.

Contents:
- `01_series_overview.md` — Target audience, core concept, format, anthology guidelines
- `02_character_voice_guide.md` — Voice profiles with three registers per character, pairing dynamics
- `03_voice_test_scene.md` — Example dialogue showcasing all six voices
- `04_writing_guide.md` — Craft rules: chapter length, beat structure, mystery formula, food as anchor

### 📇 canon library/
**Role: Facts and state.** The encyclopedia of specific people, places, and things in the universe. These files update after every book. They tell you *what is true* in this universe right now.

Contents:
- `characters/` — Individual profiles with background, relationships, secrets, and per-book lore tracking
- `antagonists/` — One antagonist profile per planned book
- `series_plan.md` — Locked book order, monthly progression, secrets reveal schedule
- `glossary.md` — Canon terms, quick-reference character table, and consistency rules
- `group_dynamics.md` — Character tensions, alliances, and pairing dynamics
- `locations_registry.md` — All recurring and story-specific locations

**Key distinction:** Character *voice rules* (how they talk, their registers) live in `world building/`. Character *facts* (backstory, what's happened to them, relationships) live in `canon library/`.

### 📜 stories/
**Role: The actual narratives.** Each story has its own subdirectory with chapters, outlines, character notes, and plot documents. Stories are the primary drivers of the universe — they are always right.

Contents:
- `_story_template/` — Standardized scaffold for starting a new book
- `01. The Case of the Missing Hot Sauce/` — Book 1 (complete)

---

## The Golden Rule: The Story Drives the Canon

Your highest priority is maintaining consistency with the **most recently written material** in the `📜 stories/` folder. If you find a conflict between a story and the canon library, **the story is correct** and the canon file needs to be updated.

## Workflow: The "Living Canon"

When new information is revealed in a story, the canon library must be updated to reflect it. This can happen:
- **During editing** — when changes affect canon (e.g., changing a location name)
- **After completing a story** — using the Canon Updates checklist in the story template
- **On request** — when I say "propose an update" to a file based on new material

All significant canon changes should be logged in [CANON_CHANGELOG.md](CANON_CHANGELOG.md).

## Modes of Operation

You will operate in one of two modes, which I will specify:

- **✍️ Author Mode (Omniscient):** You are my co-creator with a bird's-eye view. You can access all information to help with planning, outlining, and consistency checks. When in Author Mode, you should be familiar with the contents of `📇 canon library/` and `📚 world building/`.

- **🎭 Scene Mode (Limited Context):** You are a focused writing assistant. You must ONLY use the specific files I provide for that request. This maintains authentic character perspective — characters don't know everything.

## Creative Direction

For tone, style, voice, and craft guidelines, see [ai_instructions.md](ai_instructions.md).
