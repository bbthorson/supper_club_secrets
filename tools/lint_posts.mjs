#!/usr/bin/env node
/**
 * Lint the authored cast posts for the things Pinakes cannot check.
 *
 *   node tools/lint_posts.mjs
 *
 * Pinakes already owns most of this: it compiles `stories/<book>/posts/*.md` to
 * `records/<book>/character_posts.json`, resolves authors, places and mentions
 * against the registry, and enforces the public-register rule against each
 * chapter's `registers:` block (`post-register`). None of that is repeated here.
 *
 * What is left is the lane, and the lane is the dangerous one.
 *
 * THE LANE PROBLEM. A character's day does not all come out in public — 72 of
 * Book 1's 97 state events are the private register — so a post is authored for
 * one of two audiences: the open network, or the supper club's group chat in the
 * space. The compiler has no field for that, and the lexicons are generated, so
 * it cannot be given one from this repo. The lane therefore rides in `tags`,
 * which is a field the compiler does carry through:
 *
 *     tags: [lane-public, market, squash]
 *
 * A club message published to the public lane is a spoiler released under a
 * permanent DID. So every post must be POSITIVELY marked, exactly once, and both
 * this lint and the publish path fail closed on anything else.
 *
 * Also checked: the network's 300-grapheme post limit. The lexicon allows 3000,
 * because a `character.post` record also feeds our own site where nothing is
 * truncated — but a public post over 300 cannot be posted to Bluesky at all, and
 * finding that out at publish time means finding it out on the day. The limit is
 * graphemes, not characters: an emoji or an accented letter built from combining
 * marks counts once, the way the network counts it.
 *
 * Also checked: `note:` is authoring direction — image blocking, intent, the
 * thing a reviewer needs and a reader must not have. It is a frontmatter key the
 * compiler does not read, which is exactly why it is safe there and fatal in the
 * body. This catches the day someone moves one down a line.
 *
 * NO DEPENDENCIES, like the other tools in here.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STORIES = path.join(ROOT, 'stories');
const LANES = ['lane-public', 'lane-club'];

const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

/** Every `posts/` directory under `stories/`, skipping templates. */
function postDirs() {
  if (!fs.existsSync(STORIES)) return [];
  return fs
    .readdirSync(STORIES)
    .filter((d) => !d.startsWith('_') && !d.startsWith('.'))
    .map((d) => path.join(STORIES, d, 'posts'))
    .filter((d) => fs.existsSync(d));
}

/** The same filter the compiler applies: `00_` prefixed files are not posts. */
function postFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('00_'))
    .sort()
    .map((f) => path.join(dir, f));
}

let count = 0;
const lanes = { 'lane-public': 0, 'lane-club': 0 };

for (const dir of postDirs()) {
  for (const file of postFiles(dir)) {
    const rel = path.relative(ROOT, file);
    const raw = fs.readFileSync(file, 'utf8');
    const fm = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
    if (!fm) {
      fail(rel, 'no frontmatter block');
      continue;
    }
    count += 1;
    const [, head, body] = fm;

    const tagLine = /^tags:\s*\[(.*)\]\s*$/m.exec(head);
    const tags = tagLine ? tagLine[1].split(',').map((t) => t.trim()) : [];
    const marked = LANES.filter((l) => tags.includes(l));
    if (marked.length !== 1) {
      fail(
        rel,
        marked.length === 0
          ? 'no lane tag. Every post needs exactly one of `lane-public` or `lane-club` ' +
              'in `tags:` — there is no default, because guessing wrong publishes the ' +
              'group chat to the open network.'
          : `carries ${marked.join(' and ')}. Exactly one.`,
      );
    } else {
      lanes[marked[0]] += 1;
    }

    // `lane:` in frontmatter is for the human reading the file and for the day
    // the compiler learns the field. If it disagrees with the tag, the file is
    // lying to its reader about where it is going.
    const laneKey = /^lane:\s*(\S+)\s*$/m.exec(head);
    if (laneKey && marked.length === 1 && `lane-${laneKey[1]}` !== marked[0]) {
      fail(rel, `frontmatter says lane: ${laneKey[1]} but the tag says ${marked[0]}`);
    }

    if (/^\s*note:/m.test(body)) {
      fail(rel, 'a `note:` is in the body, where it would be published. Notes are frontmatter.');
    }

    const time = /^time:\s*"?(\d{2}):(\d{2})"?\s*$/m.exec(head);
    if (!time) {
      fail(rel, '`time:` must be a "HH:MM" clock time — it is what the scheduler posts at.');
    } else if (time[2] === '00') {
      fail(rel, `posts at ${time[1]}:00. Real feeds do not land on the hour.`);
    }

    if (!body.trim()) fail(rel, 'empty post body');

    // Club messages are not bound by the network's limit — they are served
    // through our own surface, where nothing truncates them.
    if (marked[0] === 'lane-public') {
      const n = [...segmenter.segment(body.trim())].length;
      if (n > 300) {
        fail(rel, `${n} graphemes. A public post over 300 cannot be posted at all — trim ${n - 300}.`);
      }
    }
  }
}

console.log(
  `\n  ${count} posts — ${lanes['lane-public']} public, ${lanes['lane-club']} club\n`,
);

if (problems.length) {
  console.error(`  ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`    ✗ ${p}`);
  console.error('');
  process.exit(1);
}
console.log('  clean.\n');
