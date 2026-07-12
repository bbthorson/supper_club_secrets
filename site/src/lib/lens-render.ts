/**
 * Shared client-side render helpers for the horizon-gated lenses (timeline +
 * feeds). Pure string→HTML builders over already-fetched, horizon-bounded dated
 * entries.
 */
import type { TimelineEntry } from './records';

export const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function chip(text: string, href?: string, cls = ''): string {
  const c = `chip ${cls}`.trim();
  return href ? `<a class="${c}" href="${href}">${esc(text)}</a>` : `<span class="${c}">${esc(text)}</span>`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** "2026-10-04" → "Oct 4" (no Date object — avoids timezone drift). Falls back
 *  to the raw string if the month is out of range or the day is missing. */
export function fmtDate(iso: string): string {
  const [, m, d] = iso.split('-').map((x) => Number.parseInt(x, 10));
  const month = MONTHS[m - 1]; // undefined when m is out of 1–12
  return month && d ? `${month} ${d}` : iso;
}

export function chapterRangeLabel(chapters: number[]): string {
  if (chapters.length === 0) return '';
  const lo = chapters[0];
  const hi = chapters[chapters.length - 1];
  return lo === hi ? `Chapter ${lo}` : `Chapters ${lo}–${hi}`;
}

const placeHref = (id: string) => `/places/${id.replace('place.', '')}`;
const charHref = (id: string) => `/characters/${id.replace('char.', '')}`;

/** Place/one-off + participant chips for an entry. `omit` skips the entity whose
 *  own feed we're on (no self-link). */
export function entityChips(entry: TimelineEntry, omit?: string): string {
  const chips: string[] = [];
  for (const p of entry.places) if (p.id !== omit) chips.push(chip(p.name, placeHref(p.id), 'place'));
  for (const t of entry.placeText) chips.push(chip(t, undefined, 'place'));
  for (const person of entry.participants)
    if (person.id !== omit) chips.push(chip(person.name, charHref(person.id)));
  return chips.length ? `<div class="detail-meta">${chips.join('')}</div>` : '';
}

function eventsHTML(entry: TimelineEntry): string {
  return entry.events.map((e) => `<p class="detail-event">${esc(e)}</p>`).join('');
}

function custodyHTML(entry: TimelineEntry): string {
  return entry.custody
    .map((c) => {
      const from = c.fromHolder ? `${esc(c.fromHolder.name)} → ` : '';
      return `<div class="bottle"><span class="bottle-label">The Bottle</span><span class="bottle-event">${from}${esc(c.holder.name)} · ${esc(c.event)}</span></div>`;
    })
    .join('');
}

/** Full detail for a timeline day: events, who/where, state changes, the bottle. */
export function entryDetailHTML(entry: TimelineEntry, omit?: string): string {
  const states = entry.states
    .map((s) => `<p class="detail-state"><b>${esc(s.subject.name)}</b> — ${esc(s.state)}</p>`)
    .join('');
  const body = eventsHTML(entry) + entityChips(entry, omit) + states + custodyHTML(entry);
  return body || '<p class="detail-state">—</p>';
}

/** A dated card for a feed list: date + chapter range, events, who/where, the bottle. */
export function entryCard(entry: TimelineEntry, omit?: string): string {
  return `<article class="feed-card">
    <p class="feed-eyebrow">${esc(fmtDate(entry.date))} · ${esc(chapterRangeLabel(entry.chapters))}</p>
    ${eventsHTML(entry)}
    ${entityChips(entry, omit)}
    ${custodyHTML(entry)}
  </article>`;
}
