/**
 * The canon horizon — the site's core object (protocol/ARCHITECTURE.md §11).
 *
 * A per-reader bookmark: how far they've read, as a plain chapter integer. The
 * whole site renders relative to it, so nothing spoils past where the reader
 * has earned. Anonymous readers keep it in localStorage; it is designed to
 * attach to an identity later with no change to this contract.
 *
 * Horizon is a chapter number, not a storyDate: chapters are strictly ordered
 * (1..N), whereas story dates repeat across scenes. storyDate is for
 * positioning on the timeline (a later lens), never for gating.
 */

export const BOOK = 'book1';
export const TOTAL_CHAPTERS = 25;

/** What an anonymous reader (no stored progress, no ?h=) may see. 0 = full
 *  spoiler-lockdown until they start reading. */
export const ANON_HORIZON = 0;

const PROGRESS_KEY = 'scs:progress';
const THEME_KEY = 'scs:theme';
const PROGRESS_VERSION = 1;

export type Theme = 'day' | 'night';
type BookProgress = { chapter: number };
/** Stored as `{ v: 1, books: { book1: { chapter: N } } }` — version is separate
 *  from the per-book map, so book entries have one unambiguous shape. */
type ProgressStore = { v: number; books: Record<string, BookProgress> };

function emptyStore(): ProgressStore {
  return { v: PROGRESS_VERSION, books: {} };
}

function hasStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function readStore(): ProgressStore {
  if (!hasStorage()) return emptyStore();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Partial<ProgressStore>;
    if (!parsed || typeof parsed !== 'object' || typeof parsed.books !== 'object' || !parsed.books) {
      return emptyStore();
    }
    return { v: PROGRESS_VERSION, books: parsed.books };
  } catch {
    return emptyStore();
  }
}

/** Highest chapter the reader has reached in `book` (0 if none). */
export function getHorizon(book: string = BOOK): number {
  const entry = readStore().books[book];
  return entry && typeof entry.chapter === 'number' ? entry.chapter : 0;
}

/** Advance the horizon to `chapter` (monotonic — never moves backward). */
export function setHorizon(book: string, chapter: number): number {
  if (!hasStorage()) return getHorizon(book);
  const store = readStore();
  const next = Math.max(store.books[book]?.chapter ?? 0, chapter);
  store.books[book] = { chapter: next };
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
  } catch {
    /* private mode / quota — non-fatal */
  }
  return next;
}

/* ---- the host stand ---- */

const CHECKIN_KEY = 'scs:checkin';
/** How a reader came in. Stored so the host stand is asked once, not nightly. */
export type CheckIn = 'guest' | 'resumed';

export function getCheckIn(): CheckIn | null {
  if (!hasStorage()) return null;
  try {
    const v = localStorage.getItem(CHECKIN_KEY);
    return v === 'guest' || v === 'resumed' ? v : null;
  } catch {
    return null;
  }
}

export function setCheckIn(how: CheckIn): void {
  if (!hasStorage()) return;
  try {
    localStorage.setItem(CHECKIN_KEY, how);
  } catch {
    /* private mode / quota — the reader just gets asked again */
  }
}

export function clearCheckIn(): void {
  if (!hasStorage()) return;
  try {
    localStorage.removeItem(CHECKIN_KEY);
  } catch {
    /* non-fatal */
  }
}

/* ---- things the house says exactly once ---- */

const TOLD_KEY = 'scs:told';

/**
 * The house explaining itself is onboarding, not furniture. A note that fires
 * on every chapter is the same sentence twenty-five times a book, so anything
 * that is only true the first time goes through here: `tellOnce` returns true
 * the first time it's asked about a note and false forever after, so a caller
 * gates on the call itself.
 *
 * Keyed by note, and callers scope a per-book note by putting the book id in
 * the key. Storage unavailable means the note is simply never shown twice in a
 * session and may return — which is the right way for a nicety to fail.
 */
export function tellOnce(note: string): boolean {
  if (!hasStorage()) return true;
  try {
    const told = new Set((localStorage.getItem(TOLD_KEY) ?? '').split(',').filter(Boolean));
    if (told.has(note)) return false;
    told.add(note);
    localStorage.setItem(TOLD_KEY, [...told].join(','));
    return true;
  } catch {
    /* private mode / quota — say it, rather than swallowing it forever */
    return true;
  }
}

/**
 * Forget stored progress — for a reader who wants to start over, or who simply
 * wants the number gone. Named `clear` rather than `reset` because it deletes
 * rather than zeroing: with no entry, `getHorizon` falls back to ANON_HORIZON
 * and every lens re-locks. Pass a book to forget just that one; omit it to drop
 * the whole store. The theme is stored separately and is deliberately untouched.
 */
export function clearProgress(book?: string): void {
  if (!hasStorage()) return;
  try {
    if (!book) {
      localStorage.removeItem(PROGRESS_KEY);
      // starting over means starting over: a reader at chapter zero again has
      // not been told how the gating works
      localStorage.removeItem(TOLD_KEY);
      return;
    }
    const store = readStore();
    delete store.books[book];
    if (Object.keys(store.books).length === 0) localStorage.removeItem(PROGRESS_KEY);
    else localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
  } catch {
    /* private mode / quota — non-fatal */
  }
}

/**
 * The horizon a lens should render at: an explicit `?h=` pin (shareable views)
 * wins, then stored progress, then the anonymous default.
 */
export function resolveHorizon(book: string = BOOK): number {
  if (typeof location !== 'undefined') {
    const q = new URLSearchParams(location.search).get('h');
    if (q !== null) {
      const n = Number.parseInt(q, 10);
      if (Number.isFinite(n) && n >= 0) return n;
    }
  }
  const stored = getHorizon(book);
  return stored > 0 ? stored : ANON_HORIZON;
}

/**
 * Reveal every `[data-revealed-by]` node whose chapter is at or below the
 * resolved horizon. Redactions with no `data-revealed-by` stay manual-only.
 */
export function applyGates(root: ParentNode = document, book: string = BOOK): void {
  const horizon = resolveHorizon(book);
  const nodes = root.querySelectorAll<HTMLElement>('[data-revealed-by]');
  nodes.forEach((el) => {
    const at = Number.parseInt(el.dataset.revealedBy ?? '', 10);
    if (Number.isFinite(at) && horizon >= at) {
      el.classList.add('is-revealed');
      el.setAttribute('aria-expanded', 'true');
    }
  });
}

/* ---- theme (day = default / night = after hours) ---- */

export function getTheme(): Theme {
  if (!hasStorage()) return 'day';
  try {
    return localStorage.getItem(THEME_KEY) === 'night' ? 'night' : 'day';
  } catch {
    return 'day';
  }
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme === 'night' ? 'night' : 'day';
  if (!hasStorage()) return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* non-fatal */
  }
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'night' ? 'day' : 'night';
  setTheme(next);
  return next;
}
