/**
 * Build-time data layer over the derived record set
 * (protocol/records/book1/*.json). Used by the static data endpoints and lens
 * pages. Everything here runs at build only — never shipped to the client.
 *
 * The timeline is organized by STORY DATE, not by chapter, because the source
 * records are date-granular: several chapters can share one dated beat (Meal 1's
 * chapters 1–5 all happen on Oct 4 and share one event summary that already
 * covers chapter 5). So a date-entry is gated by the MAX chapter it spans — it
 * only unlocks once the reader has read every chapter that feeds it, which
 * prevents a later chapter's content leaking through an earlier one.
 */
import scenesRaw from '../../../records/book1/scenes.json';
import stateRaw from '../../../records/book1/character_state_events.json';
import placesRaw from '../../../records/series/places.json';
import profilesRaw from '../../../records/series/character_profiles.json';
import custodyRaw from '../../../records/book1/custody_events.json';

export const TOTAL_CHAPTERS = 25;

/* ---- raw record shapes (only the fields the site uses) ---- */
interface SceneRec {
  id: string;
  storyDate: string;
  chapterRefs: string[];
  title: string;
  meal: number;
  placeRefs?: string[];
  placeText?: string[] | null;
  participants?: string[];
  primaryEvent?: string;
}
interface StateRec {
  subject: string;
  register: string;
  registerExpr?: string;
  state: string;
  chapterRef: string;
}
interface PlaceRec {
  id: string;
  name: string;
  status?: string;
  neighborhood?: string | null;
  schedule?: { days?: string[]; hours?: string; note?: string } | null;
}
interface ProfileRec {
  subject: string;
  displayName: string;
  handle?: string | null;
  oneLine?: string | null;
  personaPublic?: string | null;
  keyContradiction?: string | null;
}
interface CustodyRec {
  item: string;
  holder: string;
  fromHolder: string | null;
  chapterRef: string;
  storyDate: string;
  event: string;
}

const scenes = scenesRaw as SceneRec[];
const states = stateRaw as StateRec[];
const places = placesRaw as PlaceRec[];
const profiles = profilesRaw as ProfileRec[];
const custody = custodyRaw as CustodyRec[];

/* ---- entity naming ---- */

// Prefer a curated profile displayName; otherwise prettify the id slug
// (char.brenda-marquez → "Brenda Marquez") so every referenced entity resolves.
const profileName = new Map(profiles.map((p) => [p.subject, p.displayName]));
const placeName = new Map(places.map((p) => [p.id, p.name]));

function prettifySlug(id: string): string {
  return id
    .replace(/^[a-z]+\./, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
export function charName(id: string): string {
  return profileName.get(id) ?? prettifySlug(id);
}
export function placeDisplayName(id: string): string {
  return placeName.get(id) ?? prettifySlug(id);
}

export interface NamedRef {
  id: string;
  name: string;
}
const namedChar = (id: string): NamedRef => ({ id, name: charName(id) });
const namedPlace = (id: string): NamedRef => ({ id, name: placeDisplayName(id) });

/* ---- chapter resolution ---- */

/** Parse the chapter integer from a `book.N#chM` ref (0 if unparseable). */
export function chapterNumFromRef(ref: string | undefined | null): number {
  const m = /#ch(\d+)/.exec(ref ?? '');
  return m ? Number.parseInt(m[1], 10) : 0;
}
const sceneChapter = (s: SceneRec) => chapterNumFromRef(s.chapterRefs?.[0]);

/** All chapter numbers that carry at least one scene, ascending. */
export function allChapters(): number[] {
  return [...new Set(scenes.map(sceneChapter))].filter((n) => n > 0).sort((a, b) => a - b);
}

// chapter -> its scene's story date (used to bucket state/custody onto the
// right dated entry regardless of a record's own storyDate).
const chapterDate = new Map<number, string>();
for (const s of scenes) {
  const ch = sceneChapter(s);
  if (ch > 0 && !chapterDate.has(ch)) chapterDate.set(ch, s.storyDate);
}

/* ---- dated timeline entries (denormalized: names resolved here) ---- */

export interface StateBit {
  subject: NamedRef;
  register: string;
  registerExpr?: string;
  state: string;
  chapter: number;
}
export interface CustodyBit {
  item: string;
  holder: NamedRef;
  fromHolder: NamedRef | null;
  event: string;
  chapter: number;
}
export interface TimelineEntry {
  date: string; // ISO story date
  meal: number;
  chapters: number[]; // ascending
  revealChapter: number; // entry unlocks at this horizon (max chapter it spans)
  events: string[]; // distinct scene primaryEvents on this date
  places: NamedRef[];
  placeText: string[];
  participants: NamedRef[];
  states: StateBit[];
  custody: CustodyBit[];
}

function buildEntries(): TimelineEntry[] {
  const map = new Map<string, TimelineEntry>();
  const ensure = (date: string): TimelineEntry => {
    let e = map.get(date);
    if (!e) {
      e = {
        date,
        meal: 0,
        chapters: [],
        revealChapter: 0,
        events: [],
        places: [],
        placeText: [],
        participants: [],
        states: [],
        custody: [],
      };
      map.set(date, e);
    }
    return e;
  };
  const pushRef = (arr: NamedRef[], r: NamedRef) => {
    if (!arr.some((x) => x.id === r.id)) arr.push(r);
  };

  for (const s of scenes) {
    const ch = sceneChapter(s);
    const e = ensure(s.storyDate);
    if (!e.meal) e.meal = s.meal;
    if (!e.chapters.includes(ch)) e.chapters.push(ch);
    if (s.primaryEvent && !e.events.includes(s.primaryEvent)) e.events.push(s.primaryEvent);
    for (const p of s.placeRefs ?? []) pushRef(e.places, namedPlace(p));
    for (const t of s.placeText ?? []) if (!e.placeText.includes(t)) e.placeText.push(t);
    for (const p of s.participants ?? []) pushRef(e.participants, namedChar(p));
  }
  for (const st of states) {
    const ch = chapterNumFromRef(st.chapterRef);
    const date = chapterDate.get(ch);
    if (!date) continue;
    ensure(date).states.push({
      subject: namedChar(st.subject),
      register: st.register,
      registerExpr: st.registerExpr,
      state: st.state,
      chapter: ch,
    });
  }
  for (const c of custody) {
    const ch = chapterNumFromRef(c.chapterRef);
    const date = chapterDate.get(ch) ?? c.storyDate;
    ensure(date).custody.push({
      item: c.item,
      holder: namedChar(c.holder),
      fromHolder: c.fromHolder ? namedChar(c.fromHolder) : null,
      event: c.event,
      chapter: ch,
    });
  }

  const entries = [...map.values()];
  for (const e of entries) {
    e.chapters.sort((a, b) => a - b);
    e.revealChapter = Math.max(
      0,
      ...e.chapters,
      ...e.states.map((s) => s.chapter),
      ...e.custody.map((c) => c.chapter),
    );
    e.states.sort((a, b) => a.chapter - b.chapter);
    e.custody.sort((a, b) => a.chapter - b.chapter);
  }
  entries.sort((a, b) => a.date.localeCompare(b.date));
  return entries;
}

const ENTRIES = buildEntries();

/** The dated entries, chronological (build-time; for scaffolds). */
export function timelineEntries(): TimelineEntry[] {
  return ENTRIES;
}

export interface ChapterFragment {
  chapter: number;
  entries: TimelineEntry[];
}
/** The entries that unlock exactly at `chapter` (its max-chapter). A multi-day
 *  beat therefore appears only in the fragment of its highest chapter, so the
 *  client — fetching 1..horizon — never receives an entry it hasn't earned. */
export function chapterFragment(chapter: number): ChapterFragment {
  return { chapter, entries: ENTRIES.filter((e) => e.revealChapter === chapter) };
}

export interface ScaffoldRow {
  date: string;
  meal: number;
  chapters: number[];
  revealChapter: number;
}
/** Spoiler-free structure for the server-rendered timeline (dates + chapter
 *  ranges only — no event text). */
export function timelineScaffold(): ScaffoldRow[] {
  return ENTRIES.map((e) => ({
    date: e.date,
    meal: e.meal,
    chapters: e.chapters,
    revealChapter: e.revealChapter,
  }));
}

/* ---- listings for feed getStaticPaths ---- */

/** The chapter a place is first revealed = min chapter of scenes referencing it. */
export function placeFirstChapter(placeId: string): number {
  const chs = scenes.filter((s) => (s.placeRefs ?? []).includes(placeId)).map(sceneChapter);
  return chs.length ? Math.min(...chs) : 0;
}

export interface PlaceListing extends NamedRef {
  neighborhood: string | null;
  status: string;
  firstChapter: number;
  schedule: { days?: string[]; hours?: string; note?: string } | null;
}
/** Places that actually appear in a scene (skip referenced-only), for feed pages. */
export function placeListings(): PlaceListing[] {
  return places
    .map((p) => ({
      id: p.id,
      name: p.name,
      neighborhood: p.neighborhood ?? null,
      status: p.status ?? '',
      firstChapter: placeFirstChapter(p.id),
      schedule: p.schedule ?? null,
    }))
    .filter((p) => p.firstChapter > 0)
    .sort((a, b) => a.firstChapter - b.firstChapter || a.name.localeCompare(b.name));
}

export interface CharListing extends NamedRef {
  firstChapter: number;
}

// char id -> first chapter they participate in a scene.
const charFirstChapter = new Map<string, number>();
for (const s of scenes) {
  const ch = sceneChapter(s);
  for (const id of s.participants ?? []) {
    const current = charFirstChapter.get(id);
    if (current === undefined || ch < current) charFirstChapter.set(id, ch);
  }
}

/** Characters that participate in ≥1 scene, with their first-appearance chapter. */
export function charListings(): CharListing[] {
  return [...charFirstChapter.entries()]
    .map(([id, firstChapter]) => ({ id, name: charName(id), firstChapter }))
    .sort((a, b) => a.firstChapter - b.firstChapter || a.name.localeCompare(b.name));
}

/* ---- character profiles (curated, reader-safe identity) ---- */

// The antagonist has a profile record (for his gated hub) but is kept off the
// public roster — a villain roster entry would spoil.
export const ANTAGONIST = 'char.garrett-pike';

// The domain suffix for atproto-style handles (e.g. @emmacooks → the canonical
// emmacooks.supperclub.secrets). Placeholder pending the real domain — the same
// deferred decision as the lexicon namespace (ARCHITECTURE.md §12.1). Kept in
// one place so the eventual swap is a one-liner.
export const HANDLE_DOMAIN = 'supperclub.secrets';

export interface Profile extends NamedRef {
  handle: string | null;
  oneLine: string | null;
  personaPublic: string | null;
  keyContradiction: string | null;
  firstChapter: number;
}
function toProfile(p: ProfileRec): Profile {
  return {
    id: p.subject,
    name: p.displayName,
    handle: p.handle ?? null,
    oneLine: p.oneLine ?? null,
    personaPublic: p.personaPublic ?? null,
    keyContradiction: p.keyContradiction ?? null,
    firstChapter: charFirstChapter.get(p.subject) ?? 0,
  };
}

/** Every profiled character id (incl. the antagonist) — for getStaticPaths so
 *  the hub page resolves even for those off the roster. */
export function allProfileIds(): string[] {
  return profiles.map((p) => p.subject.replace('char.', ''));
}

export function profileById(charId: string): Profile | undefined {
  const p = profiles.find((r) => r.subject === charId);
  return p ? toProfile(p) : undefined;
}

/** The public roster — club members only (antagonist excluded), in reading order. */
export function profileListings(): Profile[] {
  return profiles
    .filter((p) => p.subject !== ANTAGONIST)
    .map(toProfile)
    .sort((a, b) => a.firstChapter - b.firstChapter || a.name.localeCompare(b.name));
}

export interface CharacterHub {
  slug: string;
  id: string;
  name: string;
  profile: Profile | undefined; // curated persona, only for profiled characters
}
/** Every character that needs a hub page: anyone who participates in a scene
 *  (they get chip-linked from the lenses) plus anyone profiled. Non-profiled
 *  minor characters get a name + their gated thread, no persona. */
export function characterHubs(): CharacterHub[] {
  const ids = new Set<string>([...charFirstChapter.keys(), ...profiles.map((p) => p.subject)]);
  return [...ids].map((id) => ({
    slug: id.replace('char.', ''),
    id,
    name: charName(id),
    profile: profileById(id),
  }));
}
