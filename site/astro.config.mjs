// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkStripLeadingHeadings from './src/lib/remark-strip-leading-headings.mjs';

// The site reads its brand tokens directly from ../protocol/brand/tokens.css
// (the locked source of truth — never re-derived). Allow Vite to serve files
// from the repo root so that verbatim import works without a copy step.
// The reading room and the timeline moved under /books/<slug>/ when the site
// stopped hardcoding Book One. These keep the old shared links alive; on a
// static build Astro emits a redirect page for each. A dynamic pattern would
// need a route to enumerate it, so the chapter range is spelled out — retire
// the whole block once the old URLs stop showing up in logs.
const LEGACY_BOOK = 'missing-hot-sauce';
const LEGACY_CHAPTERS = 25;
const legacyChapterRedirects = Object.fromEntries(
  Array.from({ length: LEGACY_CHAPTERS }, (_, i) => [
    `/read/${i + 1}`,
    `/books/${LEGACY_BOOK}/read/${i + 1}`,
  ]),
);

export default defineConfig({
  site: 'https://supper-club-secrets.bbthorson.workers.dev',
  redirects: {
    ...legacyChapterRedirects,
    '/timeline': `/books/${LEGACY_BOOK}/timeline`,
  },
  // Astro 7 makes Sätteri the default Markdown processor; the unified/remark
  // pipeline is opt-in through @astrojs/markdown-remark. Chapter prose carries
  // its own title/meal headings and the reading room renders those from
  // frontmatter, so the leading ones are stripped here.
  markdown: {
    processor: unified({
      remarkPlugins: [remarkStripLeadingHeadings],
    }),
  },
  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
});
