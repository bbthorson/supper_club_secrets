// @ts-check
import { defineConfig } from 'astro/config';
import remarkStripLeadingHeadings from './src/lib/remark-strip-leading-headings.mjs';

// The site reads its brand tokens directly from ../protocol/brand/tokens.css
// (the locked source of truth — never re-derived). Allow Vite to serve files
// from the repo root so that verbatim import works without a copy step.
export default defineConfig({
  site: 'https://supperclub.example',
  markdown: {
    // Chapter prose carries its own title/meal headings; the reading room
    // renders those from frontmatter, so drop the leading ones.
    remarkPlugins: [remarkStripLeadingHeadings],
  },
  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
});
