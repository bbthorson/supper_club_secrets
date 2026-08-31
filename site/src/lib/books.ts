/**
 * The series' books, in one place.
 *
 * WHY THIS EXISTS. Book 1 used to be hardcoded across the site: the menu lived
 * at `/`, the timeline at `/timeline`, and the horizon read a `BOOK = 'book1'`
 * constant. But the record set has been per-book since Phase 2
 * (`records/book1/` beside `records/series/`) and the progress store has always
 * been keyed by book — only the URLs pretended the series was one book. This
 * registry is what the routes read instead, so Book 2 is a new entry rather
 * than a restructure.
 *
 * The split that matters: anything under `records/book1/` is BOOK-scoped and
 * lives at `/books/<slug>/…` (the menu, the reading room, the timeline).
 * Anything under `records/series/` is SERIES-scoped and stays top-level (the
 * cast, the neighborhood) — for an anthology the recurring six and the
 * neighborhood are the connective tissue between books, and nesting them under
 * one book would say the opposite of what the series is.
 */

/**
 * The series in one line. Series-level on purpose: it describes the whole
 * anthology, not this case, so it belongs beside BOOKS rather than inside one.
 * The book's own `logline` says what a particular case is about.
 */
export const SERIES_TAGLINE =
  'Six friends exploring the mysteries of Brooklyn, one meal at a time.';

export interface Meal {
  ordinal: string; // "First", "Second", …
  name: string;
  tagline: string;
  /** Rendered as a redaction — the part of the tagline that would spoil. */
  secretTail?: string;
}

export interface Book {
  /** Record-set id: the folder under `records/`, and the progress-store key. */
  id: string;
  /** URL slug — `/books/<slug>`. Permanent once published. */
  slug: string;
  ordinal: string; // "One"
  title: string;
  month: string;
  host: string;
  /** What this case is about, for search results and link previews. The cover
   *  shows SERIES_TAGLINE; this is the per-book line underneath it. */
  logline: string;
  totalChapters: number;
  /** The book the site opens on, and the one series-level lenses read from. */
  current: boolean;
  meals: Meal[];
}

export const BOOKS: Book[] = [
  {
    id: 'book1',
    slug: 'missing-hot-sauce',
    ordinal: 'One',
    title: 'The Case of the Missing Hot Sauce',
    month: 'October',
    host: 'Emma',
    logline:
      "The Sunday the hot sauce man doesn't show up at the market, dinner becomes a case.",
    totalChapters: 25,
    current: true,
    meals: [
      {
        ordinal: 'First',
        name: 'The Discovery',
        tagline: 'a vendor vanishes from McGolrick Park',
      },
      {
        ordinal: 'Second',
        name: 'The Investigation',
        tagline: 'everyone brings a theory to the table',
      },
      {
        ordinal: 'Third',
        name: 'The Crisis',
        tagline: 'takeout night — no one can cook',
      },
      {
        ordinal: 'Fourth',
        name: 'The Reveal',
        tagline: 'the check comes due, and',
        secretTail: 'one thing we can’t print yet',
      },
    ],
  },
];

/** Books whose menus are public. Books 2–6 exist as sealed spines in the cellar
 *  and are deliberately not registered here until they have content. */
export function publishedBooks(): Book[] {
  return BOOKS;
}

/** The book the site opens on. Falls back to the first registered book so a
 *  missing `current` flag can never leave `/` with nothing to render. */
export function currentBook(): Book {
  return BOOKS.find((b) => b.current) ?? BOOKS[0];
}

export function bookBySlug(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}

export function bookById(id: string): Book | undefined {
  return BOOKS.find((b) => b.id === id);
}

/* ---- URL helpers. Every book-scoped link in the site goes through these, so
       the shape of these routes is changed in one place. ---- */

export const bookHref = (b: Book) => `/books/${b.slug}`;
export const readHref = (b: Book, chapter: number) => `/books/${b.slug}/read/${chapter}`;
export const timelineHref = (b: Book) => `/books/${b.slug}/timeline`;
