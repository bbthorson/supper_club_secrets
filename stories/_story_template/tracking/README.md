# Tracking

Per-book working files that keep timeline, character interiority, and subplot threads coherent. These are not for readers — they're for the author. Update them alongside chapter edits.

## Files

| File | Purpose | Update cadence |
|------|---------|----------------|
| `character_matrix.md` | Chapter × character snapshot. Register + emotional state per cell. | Every chapter edit |
| `timeline_ledger.md` | Calendar view. Every chapter pinned to a date. Shows simultaneous events. | Every chapter edit |
| `subplot_threads.md` | Every thread (main, B-plot, minor) tracked chapter-by-chapter with status. | Every chapter edit |
| `interiority/[character]_book[N].md` | Per-character per-book internal arc. What cracks open, what shifts, what stays withheld. | Once per book; update if arc changes |

## Workflow

1. **Before writing a chapter:** Read the relevant interiority docs for the characters in the scene. Skim the matrix row above and below to check register continuity. Check the timeline ledger for date and simultaneous events.
2. **While writing:** Use the chapter frontmatter (see `chapters/00_chapter_guide.md`) as your real-time tracker. The frontmatter is the single source of truth for that chapter's metadata.
3. **After editing a chapter:** Update the matrix row, the ledger entry, and any threads in `subplot_threads.md` that were touched. If a character's arc shifted, update the interiority doc.
4. **Before logging a structural change in `CANON_CHANGELOG.md`:** Make sure these four files reflect the change.

## Rules

- The matrix is the **snapshot**. Interiority docs are the **depth**. Don't duplicate.
- A character with no cell in a chapter row is offstage or unmentioned. A character with a cell but no register listed is a flag — they may be reduced to a body in the scene.
- A thread in `subplot_threads.md` with status "dropped" requires a note explaining why. Threads should not silently disappear.
