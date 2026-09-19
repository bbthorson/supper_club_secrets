#!/usr/bin/env node
/**
 * Publish compiled records to the cast's AT Protocol repos.
 *
 * This is a *horizon* publish, not a delta. Every run asks the same question —
 * "what should be visible at this story date?" — and makes the PDS match. It is
 * therefore idempotent and self-healing: a missed day, a half-finished run, or
 * an editorial correction all resolve by running it again. Records are mutable
 * by rkey, so a re-publish overwrites rather than duplicates.
 *
 *   node tools/publish_records.mjs                      # dry run at today
 *   node tools/publish_records.mjs --horizon 2026-10-11 # dry run at a date
 *   node tools/publish_records.mjs --horizon … --execute # actually write
 *
 * DRY RUN IS THE DEFAULT AND --execute IS THE ONLY WAY PAST IT. Preflight item 8
 * requires a human to read every intended write, once, before anything goes out.
 *
 * NO DEPENDENCIES. Three XRPC endpoints are all this needs (createSession,
 * resolveHandle, putRecord), and Node's built-in fetch covers them. A publish
 * path that signs records under permanent identities is a bad place to inherit a
 * supply chain.
 *
 * WHAT IT WILL NOT DO
 *   - Write anything without --execute.
 *   - Write to a repo whose resolved DID disagrees with the DID recorded in the
 *     codex. A handle is a rented name; if one is ever reassigned, publishing by
 *     handle alone would sign a character's canon into a stranger's repo. The
 *     DID check is the guard and it aborts the whole run, not just that account.
 *   - Publish a record whose subject has no account. Those are reported, not
 *     silently dropped.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PDS = 'https://bsky.social';

/* ------------------------------------------------------------------ config */

/** The six with accounts. Everyone else's records have nowhere to go. */
const CAST = ['emma', 'elijah', 'noah', 'oliver', 'olivia', 'jasper'];

/**
 * Fields stripped before a record leaves the repo.
 *
 * `beat` and `primaryEvent` on a scene are the craft layer — what the chapter is
 * *for* — and publishing them turns a factual index card into a synopsis
 * (settled 2026-09-01). `oneLine` on a profile is the compiler's scrape of the
 * source file's Overview, which for the supporting cast states the ending
 * outright. `sourceFile` is repo-internal provenance that also leaks chapter
 * filenames, and no consumer has a use for it.
 */
const STRIP = {
  scene: ['beat', 'primaryEvent', 'sourceFile'],
  'character.profile': ['oneLine', 'sourceFile'],
  'character.stateEvent': ['sourceFile'],
  place: ['sourceFile'],
  'character.post': ['sourceFile'],
};

/* ------------------------------------------------------------------- utils */

const die = (msg) => {
  console.error(`\n  ERROR  ${msg}\n`);
  process.exit(1);
};

function args() {
  const a = process.argv.slice(2);
  const get = (flag, fallback) => {
    const i = a.indexOf(flag);
    return i === -1 ? fallback : a[i + 1];
  };
  const horizon = get('--horizon', new Date().toISOString().slice(0, 10));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(horizon)) die(`--horizon must be YYYY-MM-DD, got '${horizon}'`);
  return { horizon, book: get('--book', 'book1'), execute: a.includes('--execute') };
}

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const exists = (p) => fs.existsSync(path.join(ROOT, p));

/** `handle`, `did` and `id` out of a character file's frontmatter. */
function readAccounts() {
  const out = new Map();
  for (const slug of CAST) {
    const file = `codex/characters/${slug}.md`;
    if (!exists(file)) die(`missing ${file}`);
    const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const fm = text.split('---')[1] ?? '';
    const pick = (k) => (fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) ?? [])[1]?.trim();
    const handle = pick('handle');
    const did = pick('did');
    if (!handle) die(`${file} has no 'handle:' in frontmatter`);
    if (!did) die(`${file} has no 'did:' in frontmatter — run the account setup first`);
    if (!/^did:plc:[a-z2-7]{24}$/.test(did)) die(`${file} has a malformed did: ${did}`);
    out.set(`char.${slug}`, {
      slug,
      handle: `${handle}.${DOMAIN}`,
      did,
      secret: `BSKY_PASSWORD_${slug.toUpperCase()}`,
    });
  }
  return out;
}

const DOMAIN = 'supperclubsecrets.com';
const PROJECT = {
  slug: 'project',
  handle: DOMAIN,
  did: 'did:plc:zvimgmqci4atuvxye2olyn7c',
  secret: 'BSKY_PASSWORD_PROJECT',
};

/* --------------------------------------------------------------- selection */

/**
 * Builds the horizon map: entity id -> the earliest story date it is visible.
 *
 * Scenes and state events carry their own `storyDate`, so they gate themselves.
 * Places and profiles do not — they are standing facts — but publishing all of
 * them on day one would put a location the reader meets in chapter 20, and a
 * character they have not been introduced to, on a public feed three weeks
 * early. So a standing record inherits the date of the first scene that
 * references it.
 */
function firstSeen(scenes) {
  const seen = new Map();
  const mark = (id, date) => {
    if (!id) return;
    const prev = seen.get(id);
    if (!prev || date < prev) seen.set(id, date);
  };
  for (const s of scenes) {
    for (const p of s.placeRefs ?? []) mark(p, s.storyDate);
    for (const c of s.participants ?? []) mark(c, s.storyDate);
    if (s.pov) mark(s.pov, s.storyDate);
  }
  return seen;
}

function plan({ horizon, book }) {
  const accounts = readAccounts();
  const scenes = readJson(`records/${book}/scenes.json`);
  const events = readJson(`records/${book}/character_state_events.json`);
  const places = readJson('records/series/places.json');
  const profiles = readJson('records/series/character_profiles.json');
  const posts = exists(`records/${book}/character_posts.json`)
    ? readJson(`records/${book}/character_posts.json`)
    : [];

  const seen = firstSeen(scenes);
  const writes = [];
  const skipped = [];
  const held = [];
  const clubHeld = [];

  const add = (target, rec) => {
    const type = rec.$type.replace(/^[^.]+\.[^.]+\./, '');
    const body = { ...rec };
    for (const f of STRIP[type] ?? []) delete body[f];
    writes.push({ target, collection: rec.$type, rkey: rec.id, body });
  };

  // Scenes and places -> the project repo. Profiles, state events and posts ->
  // the subject's own repo, which is what makes each character the author of
  // their own history rather than a field inside someone else's.
  for (const s of scenes) {
    if (s.storyDate > horizon) { held.push(s.id); continue; }
    add(PROJECT, s);
  }
  for (const p of places) {
    const date = seen.get(p.id);
    if (!date) { skipped.push(`${p.id} (never appears in a scene)`); continue; }
    if (date > horizon) { held.push(p.id); continue; }
    add(PROJECT, p);
  }
  for (const rec of [...profiles, ...events, ...posts]) {
    // The club lane never touches the open network. A message in the supper
    // club's group chat is the private register — it is the content the public
    // feed is silent about — and publishing one to a cast account's public repo
    // would release a spoiler under a permanent identity, where it cannot be
    // taken back.
    //
    // The lane rides in `tags` because the pinned compiler has no lane field and
    // the lexicons are generated, so it cannot be given one from this repo (see
    // protocol/CHARACTER_ACCOUNTS.md). tools/lint_posts.mjs guarantees every post
    // carries exactly one lane tag; this check does not trust that and fails
    // closed anyway. A post is published only if it is POSITIVELY marked public —
    // an absent, misspelled or doubled tag is held, never guessed.
    if (rec.$type.endsWith('.character.post')) {
      const tags = rec.tags ?? [];
      if (!(tags.includes('lane-public') && !tags.includes('lane-club'))) {
        clubHeld.push(`${rec.id} (tags: ${tags.join(' ') || 'none'})`);
        continue;
      }
    }
    const subject = rec.subject ?? rec.author;
    const acct = accounts.get(subject);
    if (!acct) { skipped.push(`${rec.id} (${subject} has no account)`); continue; }
    const date = rec.storyDate ?? seen.get(subject);
    if (!date) { skipped.push(`${rec.id} (no date and subject never on-page)`); continue; }
    if (date > horizon) { held.push(rec.id); continue; }
    add(acct, rec);
  }

  return { writes, skipped, held, clubHeld, accounts };
}

/* ----------------------------------------------------------------- reports */

function report({ writes, skipped, held, clubHeld }, { horizon, execute }) {
  const byTarget = new Map();
  for (const w of writes) {
    if (!byTarget.has(w.target.handle)) byTarget.set(w.target.handle, []);
    byTarget.get(w.target.handle).push(w);
  }
  console.log(`\n${'='.repeat(74)}`);
  console.log(`  ${execute ? 'PUBLISH' : 'DRY RUN'} — horizon ${horizon}`);
  console.log('='.repeat(74));
  for (const [handle, ws] of [...byTarget].sort()) {
    console.log(`\n  @${handle}  (${ws.length} records)`);
    const byColl = new Map();
    for (const w of ws) byColl.set(w.collection, (byColl.get(w.collection) ?? 0) + 1);
    for (const [c, n] of [...byColl].sort()) console.log(`      ${String(n).padStart(4)}  ${c}`);
  }
  console.log(`\n  ${writes.length} writes across ${byTarget.size} repos.`);
  console.log(`  ${held.length} records held back by the horizon.`);
  if (clubHeld?.length) {
    console.log(`  ${clubHeld.length} held back by lane — the club never leaves the space.`);
  }
  if (skipped.length) {
    console.log(`\n  ${skipped.length} NOT PUBLISHED — no destination:`);
    for (const s of skipped.slice(0, 12)) console.log(`      ${s}`);
    if (skipped.length > 12) console.log(`      … and ${skipped.length - 12} more`);
  }
  console.log('');
}

/** Every intended write, one line each, for the human read preflight requires. */
function manifest({ writes }, out) {
  const lines = writes
    .map((w) => `${w.target.handle}\t${w.collection}\t${w.rkey}`)
    .sort();
  fs.writeFileSync(out, lines.join('\n') + '\n', 'utf8');
  console.log(`  Full manifest: ${out}\n`);
}

/* -------------------------------------------------------------------- xrpc */

async function xrpc(method, { body, token, query } = {}) {
  const url = new URL(`/xrpc/${method}`, PDS);
  for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

/**
 * Signs in and proves the account is who the codex says it is.
 *
 * Resolving the handle and comparing to the recorded DID is the one check worth
 * failing the entire run over. Writes here are signed commits under a permanent
 * identity; there is no retraction, only a later record saying otherwise.
 */
async function session(target) {
  const password = process.env[target.secret];
  if (!password) die(`${target.secret} is not set`);

  const resolved = await xrpc('com.atproto.identity.resolveHandle', {
    query: { handle: target.handle },
  });
  if (resolved.did !== target.did) {
    die(
      `DID MISMATCH for @${target.handle}\n` +
        `         recorded in codex: ${target.did}\n` +
        `         resolved right now: ${resolved.did}\n` +
        `         Refusing to write. Either the handle was reassigned or the codex is stale.`
    );
  }

  const s = await xrpc('com.atproto.server.createSession', {
    body: { identifier: target.handle, password },
  });
  if (s.did !== target.did) die(`@${target.handle} signed in as ${s.did}, expected ${target.did}`);
  return s.accessJwt;
}

async function execute({ writes, accounts }) {
  const targets = new Map();
  for (const w of writes) targets.set(w.target.handle, w.target);

  // Fail on a missing secret before writing anything, rather than halfway
  // through and leaving the repos in disagreement about the horizon.
  const missing = [...targets.values()].filter((t) => !process.env[t.secret]);
  if (missing.length) die(`missing secrets: ${missing.map((t) => t.secret).join(', ')}`);

  const tokens = new Map();
  for (const t of targets.values()) {
    process.stdout.write(`  signing in @${t.handle} … `);
    tokens.set(t.handle, await session(t));
    console.log('ok, DID verified');
  }

  let done = 0;
  let failed = 0;
  for (const w of writes) {
    try {
      await xrpc('com.atproto.repo.putRecord', {
        token: tokens.get(w.target.handle),
        body: {
          repo: w.target.did,
          collection: w.collection,
          rkey: w.rkey,
          record: w.body,
        },
      });
      done++;
      if (done % 25 === 0) console.log(`  … ${done}/${writes.length}`);
    } catch (e) {
      failed++;
      console.error(`  FAILED ${w.target.handle} ${w.rkey}: ${e.message}`);
    }
  }
  console.log(`\n  ${done} written, ${failed} failed.\n`);
  return failed;
}

/** A rebuild is what actually reveals a chapter: the site gates on build-time
 *  dates, so records without a deploy mean readers see nothing new. */
async function deploy() {
  const hook = process.env.CLOUDFLARE_DEPLOY_HOOK;
  if (!hook) {
    console.log('  CLOUDFLARE_DEPLOY_HOOK not set — skipping site rebuild.');
    console.log('  Records are published but no new chapter will appear until the site rebuilds.\n');
    return;
  }
  const res = await fetch(hook, { method: 'POST' });
  console.log(`  Cloudflare deploy hook: ${res.status} ${res.ok ? 'triggered' : 'FAILED'}\n`);
}

/* -------------------------------------------------------------------- main */

const opts = args();
const p = plan(opts);
report(p, opts);
manifest(p, path.join(ROOT, `.publish-manifest-${opts.horizon}.tsv`));

if (!opts.execute) {
  console.log('  Dry run. Nothing was written. Re-run with --execute to publish.\n');
  process.exit(0);
}
const failures = await execute(p);
await deploy();
process.exit(failures > 0 ? 1 : 0);
