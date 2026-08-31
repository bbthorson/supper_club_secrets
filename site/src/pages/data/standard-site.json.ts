import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SERIES_TAGLINE, currentBook } from '../../lib/books';
import { STANDARD_SITE, isVerifiable, publicationUri } from '../../lib/standard-site';

/**
 * The standard.site record payloads, built from the same content collection the
 * site renders → `/data/standard-site.json`.
 *
 * This is a DRAFT, not a publication: creating records needs an AT Protocol
 * identity and a PDS, which is a human's job. What this removes is the part
 * that would otherwise be hand-typed twenty-six times and go stale the moment a
 * chapter title changes. Point a publishing tool at this and every record's
 * body is already correct.
 *
 * `ready` says whether the payload can be published as-is; `unresolved` names
 * exactly what's missing, so the gap is a checklist rather than a mystery. When
 * the identity isn't configured, `site` carries a visibly fake `did:plc:PENDING`
 * so nobody mistakes an unpublished draft for a verified record.
 */
export const GET: APIRoute = async ({ site: origin }) => {
  const book = currentBook();
  const siteUrl = (origin ?? new URL('https://example.invalid')).origin;

  const now = new Date();
  const served = (await getCollection('chapters'))
    .filter((c) => !c.data.publishDate || c.data.publishDate <= now)
    .sort((a, b) => a.data.chapter - b.data.chapter);

  const pubUri = publicationUri() ?? `at://did:plc:PENDING/site.standard.publication/PENDING`;
  const fallback = STANDARD_SITE.publishedAt || null;

  const publication = {
    $type: 'site.standard.publication',
    url: siteUrl,
    name: 'Supper Club Secrets',
    description: SERIES_TAGLINE,
    preferences: { showInDiscover: true },
  };

  const documents = served.map((c) => ({
    $type: 'site.standard.document',
    site: pubUri,
    title: c.data.title,
    path: `/books/${book.slug}/read/${c.data.chapter}`,
    // The book's logline, not a per-chapter summary: a description of Chapter 19
    // is a spoiler wherever it's syndicated, and the horizon can't reach into
    // someone else's feed. Every chapter describes the case, not itself.
    description: book.logline,
    publishedAt: c.data.publishDate?.toISOString() ?? fallback,
    tags: ['fiction', 'mystery', book.slug],
    // textContent deliberately omitted unless switched on — see standard-site.ts.
    ...(STANDARD_SITE.includeTextContent ? { textContent: c.body ?? '' } : {}),
  }));

  // One line per outstanding step, in the order they have to happen: an
  // identity, then the publication record, then a record per chapter. Lumping
  // them together made the checklist read as one wall of "not set up" when it
  // is really a sequence, most of which may already be done.
  const unresolved: string[] = [];
  if (!STANDARD_SITE.did.startsWith('did:')) {
    unresolved.push(
      `no did for ${STANDARD_SITE.handle || 'the publishing identity'} — resolve the handle and set STANDARD_SITE.did`,
    );
  }
  if (!STANDARD_SITE.publicationRkey) {
    unresolved.push('publication record not created — set STANDARD_SITE.publicationRkey');
  }
  const unrecorded = served.filter((c) => !STANDARD_SITE.documentRkeys[c.data.chapter]).length;
  if (unrecorded > 0) {
    unresolved.push(
      `${unrecorded} of ${served.length} served chapter(s) have no document record — add their rkeys to STANDARD_SITE.documentRkeys`,
    );
  }
  const undated = documents.filter((d) => !d.publishedAt).length;
  if (undated > 0) {
    unresolved.push(
      `${undated} chapter(s) have no publishDate and no STANDARD_SITE.publishedAt fallback`,
    );
  }

  return new Response(
    JSON.stringify(
      {
        ready: unresolved.length === 0,
        // What the site would serve today, so the two verification artifacts can
        // be checked without grepping the build output.
        verified: isVerifiable(),
        identity: { handle: STANDARD_SITE.handle || null, did: STANDARD_SITE.did || null },
        unresolved,
        publication,
        documents,
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
