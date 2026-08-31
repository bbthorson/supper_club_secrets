/**
 * Renders scripts/og-card.html to public/og.png — the link-preview card.
 *
 * Kept as a build-time script rather than a checked-in binary someone edits in
 * an image editor: the card is set in the real self-hosted faces and reads the
 * locked brand tokens, so it can never drift from the site it represents.
 * Re-run after editing the HTML, then commit the PNG.
 *
 *   npm i -D playwright && npx playwright install chromium
 *   node scripts/make-og.mjs
 *
 * Playwright is deliberately NOT a site dependency — this runs by hand when the
 * card changes, not on every build, and the site should not carry a browser
 * download to render one PNG. Set CHROMIUM_PATH to reuse a Chromium you have.
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, 'og-card.html');
const out = resolve(here, '../public/og.png');

// 1200×630 is the Open Graph card ratio every platform crops toward.
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
await page.goto(`file://${src}`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log(`wrote ${out}`);
