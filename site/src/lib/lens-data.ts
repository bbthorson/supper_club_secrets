/**
 * Client-side loader for the horizon-gated lenses. Fetches only the per-chapter
 * fragments up to the reader's horizon, so unread chapters' spoiler payloads are
 * never requested or placed in the DOM. `import type` keeps this free of the
 * build-only record imports in records.ts.
 */
import type { ChapterFragment, TimelineEntry } from './records';

export type { ChapterFragment, TimelineEntry };

const MAX_CHAPTERS = 25;

/** Fetch fragments for chapters 1..min(horizon, MAX) in parallel. A dated entry
 *  lives only in the fragment of its highest chapter, so nothing beyond the
 *  horizon is ever returned.
 *
 *  `book` is the record-set id (`book1`), not the URL slug — it addresses
 *  `records/<book>/`, which is also how the horizon store is keyed. A
 *  series-level lens showing more than one book calls this once per book, each
 *  at that book's own horizon. */
export async function loadUpToHorizon(horizon: number, book: string): Promise<ChapterFragment[]> {
  const cap = Math.min(Math.max(horizon, 0), MAX_CHAPTERS);
  if (cap <= 0) return [];
  const nums = Array.from({ length: cap }, (_, i) => i + 1);
  const frags = await Promise.all(
    nums.map(async (n) => {
      try {
        const res = await fetch(`/data/${book}/timeline/${n}.json`);
        if (!res.ok) return null;
        return (await res.json()) as ChapterFragment;
      } catch {
        return null;
      }
    }),
  );
  return frags.filter((f): f is ChapterFragment => f !== null);
}

/** All unlocked dated entries, chronological. */
export function allEntries(frags: ChapterFragment[]): TimelineEntry[] {
  return frags.flatMap((f) => f.entries).sort((a, b) => a.date.localeCompare(b.date));
}
