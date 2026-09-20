#!/usr/bin/env node
/**
 * Publish the cast's authored posts as real Bluesky posts.
 *
 *   node tools/publish_posts.mjs                        # dry run, everything due today
 *   node tools/publish_posts.mjs --through 2026-10-04   # dry run at a date
 *   node tools/publish_posts.mjs --who emma             # one account
 *   node tools/publish_posts.mjs --through … --execute  # actually post
 *
 * WHY THIS IS A SEPARATE TOOL FROM publish_records.mjs
 *
 * They publish different things on different clocks. `publish_records.mjs` pushes
 * custom lexicon records — scenes, places, profiles, state events — at the canon
 * horizon. Those records are the data layer, and **they do not render in the
 * Bluesky app**: an account holding nothing but `character.stateEvent` presents to
 * a visitor as a dead account with a bio. This tool writes `app.bsky.feed.post`,
 * which is the thing a human being actually sees, on the story clock rather than
 * the drop clock (protocol/DROP_CADENCE.md §2).
 *
 * The same authored post feeds both: one is the record, one is the post.
 *
 * IDEMPOTENT, like its sibling. Every run asks "what should exist by now?" and
 * makes the repo match. The rkey is a TID derived deterministically from the
 * post's own timestamp, so re-running overwrites rather than duplicating — which
 * matters more here than anywhere, because a duplicated post cannot be quietly
 * deleted from other people's timelines.
 *
 * DRY RUN IS THE DEFAULT AND --execute IS THE ONLY WAY PAST IT.
 *
 * WHAT IT WILL NOT DO
 *   - Write anything without --execute.
 *   - Post anything not positively marked `lane-public`. The club lane is the
 *     group chat and never touches the open network.
 *   - Post to a repo whose resolved DID disagrees with the codex.
 *   - Post text over the network's 300-grapheme limit. It reports and skips.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PDS = 'https://bsky.social';
const DOMAIN = 'supperclubsecrets.com';
const CAST = ['emma', 'elijah', 'noah', 'oliver', 'olivia', 'jasper'];

/**
 * Book 1 runs 1 Aug – 25 Oct 2026, which is inside EDT from end to end — DST
 * does not end until 1 November. One fixed offset is therefore correct for every
 * post in this book, and is far easier to audit than a timezone library. A book
 * that crosses the boundary needs this revisited, and will say so here.
 */
const OFFSET = '-04:00';

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
  const through = get('--through', new Date().toISOString().slice(0, 10));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(through)) die(`--through must be YYYY-MM-DD, got '${through}'`);
  return {
    through,
    book: get('--book', 'book1'),
    who: get('--who', null),
    execute: a.includes('--execute'),
  };
}

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const exists = (p) => fs.existsSync(path.join(ROOT, p));

/** `handle` and `did` out of each cast character's frontmatter. */
function readAccounts() {
  const out = new Map();
  for (const slug of CAST) {
    const file = `codex/characters/${slug}.md`;
    if (!exists(file)) die(`missing ${file}`);
    const fm = fs.readFileSync(path.join(ROOT, file), 'utf8').split('---')[1] ?? '';
    const pick = (k) => (fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) ?? [])[1]?.trim();
    const handle = pick('handle');
    const did = pick('did');
    if (!handle || !did) die(`${file} needs both 'handle:' and 'did:'`);
    out.set(`char.${slug}`, {
      slug,
      short: handle,
      handle: `${handle}.${DOMAIN}`,
      did,
      secret: `BSKY_PASSWORD_${slug.toUpperCase()}`,
    });
  }
  return out;
}

/* --------------------------------------------------------------------- TIDs */

const B32 = '234567abcdefghijklmnopqrstuvwxyz';

/**
 * A TID: 13 base32-sortable characters over a 64-bit value whose top bit is 0,
 * then 53 bits of microseconds, then a 10-bit clock id.
 *
 * Derived from the post's own timestamp rather than the wall clock, for two
 * reasons. It is deterministic, so a second run of this script produces the same
 * rkey and overwrites instead of duplicating. And a TID sorts by its timestamp,
 * so backdated posts occupy the right position in the repo rather than piling up
 * at whatever moment the backfill happened to run.
 *
 * The clock id is a hash of the post id, which keeps two posts written in the
 * same microsecond apart without needing any shared state between runs.
 */
function tid(micros, seed) {
  const clock = BigInt(parseInt(crypto.createHash('sha256').update(seed).digest('hex').slice(0, 8), 16) % 1024);
  let v = (BigInt(micros) << 10n) | clock;
  let s = '';
  for (let i = 0; i < 13; i += 1) {
    s = B32[Number(v & 31n)] + s;
    v >>= 5n;
  }
  return s;
}

/* ------------------------------------------------------------------- facets */

/**
 * `@liv-living` in a post body is how these people write to each other, and it
 * is not a resolvable handle — the real one carries the domain. A mention facet
 * is a byte range plus a DID, and the text inside the range can be anything, so
 * the short form links correctly without anyone having to type
 * `@liv-living.supperclubsecrets.com` in dialogue.
 *
 * Offsets are byte offsets into UTF-8, not character offsets. Getting that wrong
 * silently mislinks a range, so the text is measured as bytes throughout.
 */
function facets(text, accounts) {
  const bytes = Buffer.from(text, 'utf8');
  const out = [];
  for (const acct of accounts.values()) {
    const needle = Buffer.from(`@${acct.short}`, 'utf8');
    let from = 0;
    for (;;) {
      const at = bytes.indexOf(needle, from);
      if (at === -1) break;
      const after = bytes[at + needle.length];
      // Don't match `@liv` inside `@liv-living`: a mention ends at a boundary.
      const isWordChar = after !== undefined && /[A-Za-z0-9._-]/.test(String.fromCharCode(after));
      if (!isWordChar) {
        out.push({
          index: { byteStart: at, byteEnd: at + needle.length },
          features: [{ $type: 'app.bsky.richtext.facet#mention', did: acct.did }],
        });
      }
      from = at + needle.length;
    }
  }
  return out.sort((a, b) => a.index.byteStart - b.index.byteStart);
}

/** What the network counts. Graphemes, not code units. */
const graphemes = (s) => [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(s)].length;

/* --------------------------------------------------------------- selection */

function plan({ through, book, who }) {
  const accounts = readAccounts();
  const file = `records/${book}/character_posts.json`;
  if (!exists(file)) die(`no ${file} — run the compiler first`);

  const due = [];
  const held = [];
  const clubHeld = [];
  const skipped = [];

  for (const p of readJson(file)) {
    const tags = p.tags ?? [];
    // Fail closed. Only a post POSITIVELY marked public is eligible; absent,
    // doubled or misspelled is the group chat as far as this tool is concerned.
    if (!(tags.includes('lane-public') && !tags.includes('lane-club'))) {
      clubHeld.push(p.id);
      continue;
    }
    const acct = accounts.get(p.author);
    if (!acct) {
      skipped.push(`${p.id} (${p.author} has no account)`);
      continue;
    }
    if (who && acct.slug !== who) continue;

    // storyTime is the clock the post was written at; the compiled createdAt is
    // only ever midnight, so the record's own timestamp is not good enough to
    // post with. A post with no clock time would land all six of a character's
    // days at the same instant, which is the single most obvious bot tell there
    // is, so it is refused rather than defaulted.
    const hhmm = p.storyTime ?? '';
    if (!/^\d{2}:\d{2}$/.test(hhmm)) {
      skipped.push(`${p.id} (storyTime '${hhmm}' is not a clock time)`);
      continue;
    }
    const when = `${p.storyDate}T${hhmm}:00.000${OFFSET}`;
    if (p.storyDate > through) {
      held.push(p.id);
      continue;
    }
    const n = graphemes(p.text);
    if (n > 300) {
      skipped.push(`${p.id} (${n} graphemes — the network's limit is 300)`);
      continue;
    }
    due.push({ post: p, acct, when, rkey: tid(Date.parse(when) * 1000, p.id) });
  }

  due.sort((a, b) => a.when.localeCompare(b.when));
  return { due, held, clubHeld, skipped, accounts };
}

/* ------------------------------------------------------------------ reports */

function report({ due, held, clubHeld, skipped }, { through, execute }) {
  const byWho = new Map();
  for (const d of due) byWho.set(d.acct.handle, (byWho.get(d.acct.handle) ?? 0) + 1);

  console.log(`\n${'='.repeat(74)}`);
  console.log(`  ${execute ? 'POST' : 'DRY RUN'} — everything through ${through}`);
  console.log('='.repeat(74));
  for (const [handle, n] of [...byWho].sort()) {
    console.log(`\n  @${handle}  (${n} posts)`);
    for (const d of due.filter((x) => x.acct.handle === handle)) {
      console.log(`      ${d.when.slice(0, 16).replace('T', ' ')}   ${d.post.id}`);
    }
  }
  console.log(`\n  ${due.length} posts across ${byWho.size} accounts.`);
  console.log(`  ${held.length} not due yet.`);
  console.log(`  ${clubHeld.length} held back by lane — the club never leaves the space.`);
  if (skipped.length) {
    console.log(`\n  ${skipped.length} NOT POSTED:`);
    for (const s of skipped) console.log(`      ${s}`);
  }
  console.log('');
}

/* ---------------------------------------------------------------- publishing */

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

/** Sign in, and refuse to write if the handle no longer resolves to our DID. */
async function session(acct) {
  const password = process.env[acct.secret];
  if (!password) die(`${acct.secret} is not set`);
  const resolved = await xrpc('com.atproto.identity.resolveHandle', {
    query: { handle: acct.handle },
  });
  if (resolved.did !== acct.did) {
    die(
      `DID MISMATCH for @${acct.handle}\n` +
        `         recorded in codex: ${acct.did}\n` +
        `         resolved right now: ${resolved.did}\n` +
        `         Refusing to post.`
    );
  }
  const s = await xrpc('com.atproto.server.createSession', {
    body: { identifier: acct.handle, password },
  });
  if (s.did !== acct.did) die(`@${acct.handle} signed in as ${s.did}, expected ${acct.did}`);
  return s.accessJwt;
}

async function publish({ due, accounts }) {
  const tokens = new Map();
  const tokenFor = async (acct) => {
    if (!tokens.has(acct.did)) tokens.set(acct.did, await session(acct));
    return tokens.get(acct.did);
  };

  // post id -> { uri, cid }, so a reply can point at its parent. Posts are
  // published oldest first, so a parent is always already in here — except on a
  // re-run of a partially-applied batch, where it is fetched back instead.
  const refs = new Map();
  const locate = async (id) => {
    if (refs.has(id)) return refs.get(id);
    const parent = due.find((d) => d.post.id === id);
    if (!parent) return null;
    const got = await xrpc('com.atproto.repo.getRecord', {
      query: { repo: parent.acct.did, collection: 'app.bsky.feed.post', rkey: parent.rkey },
    }).catch(() => null);
    if (!got) return null;
    const ref = { uri: got.uri, cid: got.cid };
    refs.set(id, ref);
    return ref;
  };

  let done = 0;
  for (const d of due) {
    const token = await tokenFor(d.acct);
    const record = {
      $type: 'app.bsky.feed.post',
      text: d.post.text,
      createdAt: d.when,
      langs: ['en'],
    };
    const f = facets(d.post.text, accounts);
    if (f.length) record.facets = f;

    if (d.post.inReplyTo) {
      const parent = await locate(d.post.inReplyTo);
      if (!parent) {
        console.error(`  ! ${d.post.id}: parent ${d.post.inReplyTo} not found — posting unthreaded`);
      } else {
        // These threads are one deep, so the root is the parent. A deeper thread
        // would need the parent's own root carried forward.
        record.reply = { root: parent, parent };
      }
    }

    const res = await xrpc('com.atproto.repo.putRecord', {
      token,
      body: {
        repo: d.acct.did,
        collection: 'app.bsky.feed.post',
        rkey: d.rkey,
        record,
      },
    });
    refs.set(d.post.id, { uri: res.uri, cid: res.cid });
    done += 1;
    console.log(`  ✓ @${d.acct.handle}  ${d.post.id}`);
  }
  console.log(`\n  ${done} posts written.\n`);
}

/* --------------------------------------------------------------------- main */

const opts = args();
const p = plan(opts);
report(p, opts);

if (!opts.execute) {
  console.log('  Dry run. Nothing was written. Re-run with --execute to post.\n');
  process.exit(0);
}
await publish(p);
