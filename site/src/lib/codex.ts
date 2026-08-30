/**
 * Build-time reader-safe identity, read from the creative layer in place.
 *
 * WHY THIS FILE EXISTS. `records/` is the derived record set and stays the
 * source for everything relational (scenes, state events, custody). But the
 * *authored, reader-facing* identity fields — a character's public persona,
 * a location's type/address/hours — live in `codex/` frontmatter and
 * bodies, and the pinakes compiler does not emit them — as of 0.2.0 the profile
 * Lexicon covers `displayName`, `handle` and `oneLine`, and no more. So the site
 * reads the rest here, the same
 * way it reads chapter prose in place (content.config.ts): single source of
 * truth, no copy step. When these fields move into the compiler, delete this
 * file and drop the values into records.ts — the Profile/PlaceListing shapes
 * are unchanged by design. `handle` already made that move in 0.2.0; when
 * `personaPublic` and `keyContradiction` join the profile Lexicon, and the
 * place Lexicon gains the location facts, this whole file goes away.
 *
 * SPOILER RULE — the important part. Not every authored field is reader copy.
 * `## Overview` (characters) and frontmatter `description` (locations) are
 * CRAFT notes: they state a character's function in the plot and a location's
 * story significance, and several give away Book 1's ending ("where Hank takes
 * refuge", "Garrett Pike's planned legacy restaurant"). They are deliberately
 * NOT read here. Only these are treated as public:
 *   - characters: `personaPublic`, `keyContradiction` (frontmatter, authored in
 *     first-person bio voice — written to be seen). `handle` is NOT read here:
 *     the compiler emits it and the profile Lexicon validates it, so it comes
 *     from the record set like every other validated field.
 *   - locations:  `**Type:**`, `**Address:**`/`**Location:**`, `**Owner:**`,
 *     and the first sentence of `**Operating rule:**` — in-world facts
 * `**Details:**` and `**Story Significance:**` are never read.
 *
 * `blurbPublic` is a reserved frontmatter slot: no location defines one yet.
 * It is the location-side counterpart to `personaPublic` — when one is
 * authored, it surfaces automatically.
 *
 * Everything here runs at build only; none of it reaches the client.
 */
import { parse as parseYaml } from 'yaml';

// Read in place from the creative layer (Vite `fs.allow` opens the repo root —
// see astro.config.mjs). Non-entity files in these folders (the character
// template, the locations index) simply carry no `id` and are skipped below.
// The options object must be an inline literal — Vite parses it statically.
const characterFiles = import.meta.glob('../../../codex/characters/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const locationFiles = import.meta.glob('../../../codex/locations/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/* ---- parsing helpers ---- */

function frontmatter(raw: string): Record<string, unknown> {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!m) return {};
  try {
    const parsed = parseYaml(m[1]) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

const str = (v: unknown): string | null => {
  const s = typeof v === 'string' ? v.trim() : '';
  return s || null;
};

/** Drop the inline markdown these bodies use: bold/italic markers and links. */
function stripMarkdown(s: string): string {
  return s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/(^|\s)\*(\S[^*]*?)\*/g, '$1$2')
    .trim();
}

/**
 * The value of a `**Label:** value` line. `Label` may carry a parenthetical
 * qualifier — `**Operating rule (hard):**` matches the label "Operating rule".
 */
function labelled(raw: string, label: string): string | null {
  const re = new RegExp(`^\\*\\*${label}[^:*]*:\\*\\*\\s*(.+)$`, 'im');
  const m = re.exec(raw);
  return m ? str(stripMarkdown(m[1])) : null;
}

/** First sentence only. The operating rules lead with the public fact and then
 *  continue into craft notes ("…which is how it reads when she walks past in
 *  Ch13"), so everything after the first sentence is dropped. */
function firstSentence(s: string | null): string | null {
  if (!s) return null;
  const cut = s.split(/\.(?:\s|$)/)[0];
  return str(cut);
}

/* ---- characters ---- */

export interface CharacterCodex {
  /** First-person public bio — authored to be read by readers. */
  personaPublic: string | null;
  /** The one-line tension under the persona. */
  keyContradiction: string | null;
}

function buildCharacterCodex(): Map<string, CharacterCodex> {
  const out = new Map<string, CharacterCodex>();
  for (const raw of Object.values(characterFiles)) {
    const fm = frontmatter(raw);
    const id = str(fm.id);
    if (!id) continue; // 00_character_template.md and anything unregistered
    out.set(id, {
      personaPublic: str(fm.personaPublic),
      keyContradiction: str(fm.keyContradiction),
    });
  }
  return out;
}

const CHARACTER_CODEX = buildCharacterCodex();

export function characterCodex(charId: string): CharacterCodex | undefined {
  return CHARACTER_CODEX.get(charId);
}

/** Character ids with a `codex/characters/` file — i.e. the supper club itself,
 *  as distinct from a book's supporting cast under `stories/`. */
export function codexCharacterIds(): string[] {
  return [...CHARACTER_CODEX.keys()];
}

/* ---- locations ---- */

export interface PlaceCodex {
  /** `**Type:**` — "Weekly farmers market", "Boutique on Bedford Avenue". */
  kind: string | null;
  /** `**Address:**` or `**Location:**` — neighborhood-level, never a spoiler. */
  address: string | null;
  /** First sentence of `**Operating rule:**` — the public hours. */
  hours: string | null;
  /** `**Owner:**`, where the file names one. */
  owner: string | null;
  /** Reserved: an authored reader-safe blurb. None exist yet — see the header. */
  blurbPublic: string | null;
}

function buildPlaceCodex(): Map<string, PlaceCodex> {
  const out = new Map<string, PlaceCodex>();
  for (const raw of Object.values(locationFiles)) {
    const fm = frontmatter(raw);
    const id = str(fm.id);
    if (!id || !id.startsWith('place.')) continue; // skips locations/index.md
    out.set(id, {
      kind: labelled(raw, 'Type'),
      address: labelled(raw, 'Address') ?? labelled(raw, 'Location'),
      hours: firstSentence(labelled(raw, 'Operating rule')),
      owner: labelled(raw, 'Owner'),
      blurbPublic: str(fm.blurbPublic),
    });
  }
  return out;
}

const PLACE_CODEX = buildPlaceCodex();

export function placeCodex(placeId: string): PlaceCodex | undefined {
  return PLACE_CODEX.get(placeId);
}
