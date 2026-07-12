import type { APIRoute } from 'astro';
import { allChapters, chapterFragment } from '../../../../lib/records';

// Prerenders one JSON fragment per chapter → /data/book1/timeline/1.json … 25.json.
// The client fetches only ch 1..horizon, so spoiler payloads for unread chapters
// never enter the page source or the network (progressive-fetch spoiler model).
export function getStaticPaths() {
  return allChapters().map((n) => ({ params: { chapter: String(n) } }));
}

export const GET: APIRoute = ({ params }) => {
  const chapter = Number.parseInt(params.chapter ?? '', 10);
  return new Response(JSON.stringify(chapterFragment(chapter)), {
    headers: { 'Content-Type': 'application/json' },
  });
};
