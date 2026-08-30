import type { APIRoute } from 'astro';
import { allChapters, chapterFragment } from '../../../../lib/records';
import { publishedBooks } from '../../../../lib/books';

// Prerenders one JSON fragment per chapter → /data/book1/timeline/1.json … 25.json.
// The client fetches only ch 1..horizon, so spoiler payloads for unread chapters
// never enter the page source or the network (progressive-fetch spoiler model).
//
// Keyed by the record-set book id rather than the URL slug: this is a data path
// the lenses fetch, not something a reader navigates, and the id is what the
// horizon store and `records/<book>/` already use.
export function getStaticPaths() {
  return publishedBooks().flatMap((book) =>
    allChapters().map((n) => ({ params: { book: book.id, chapter: String(n) } })),
  );
}

export const GET: APIRoute = ({ params }) => {
  const chapter = Number.parseInt(params.chapter ?? '', 10);
  return new Response(JSON.stringify(chapterFragment(chapter)), {
    headers: { 'Content-Type': 'application/json' },
  });
};
