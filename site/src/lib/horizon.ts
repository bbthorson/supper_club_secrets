/**
 * The canon horizon — the site's core object (READER_EXPERIENCE.md §3, §7.1).
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
type ProgressStore = { v: number; [book: string]: { chapter: number } | number };

function hasStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function readStore(): ProgressStore {
  if (!hasStorage()) return { v: PROGRESS_VERSION };
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { v: PROGRESS_VERSION };
    const parsed = JSON.parse(raw) as ProgressStore;
    if (!parsed || typeof parsed !== 'object') return { v: PROGRESS_VERSION };
    return parsed;
  } catch {
    return { v: PROGRESS_VERSION };
  }
}

/** Highest chapter the reader has reached in `book` (0 if none). */
export function getHorizon(book: string = BOOK): number {
  const store = readStore();
  const entry = store[book];
  if (typeof entry === 'object' && entry && typeof entry.chapter === 'number') {
    return entry.chapter;
  }
  return 0;
}

/** Advance the horizon to `chapter` (monotonic — never moves backward). */
export function setHorizon(book: string, chapter: number): number {
  if (!hasStorage()) return getHorizon(book);
  const store = readStore();
  const current = getHorizon(book);
  const next = Math.max(current, chapter);
  store.v = PROGRESS_VERSION;
  store[book] = { chapter: next };
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
  } catch {
    /* private mode / quota — non-fatal */
  }
  return next;
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
