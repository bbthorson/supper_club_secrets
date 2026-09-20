#!/usr/bin/env node
/**
 * Add an author-held recovery key to a cast account's DID.
 *
 * WHAT THIS IS. Each DID document carries an ordered list of rotation keys.
 * Today every account's list holds exactly one: Bluesky's. That is how they can
 * change your handle for you, and it is also why, if you ever lost the account,
 * you would lose the identity — and once records are published, that identity
 * *is* the canon.
 *
 * A key ranked ABOVE the PDS's can reverse an operation signed by a lower
 * priority key within the 72-hour PLC recovery window, and can move the DID to
 * another PDS without the current one's cooperation.
 *
 * You do not "export" anything. You generate a keypair here and PREPEND its
 * public half to the list. Bluesky's key stays — strip it and they can no
 * longer manage your identity, including handle changes.
 *
 *   node tools/plc_recovery.mjs --account emma --request
 *       → asks the PDS to email you a confirmation token
 *
 *   node tools/plc_recovery.mjs --account emma --token ABCDE-FGHIJ
 *       → generates a keypair, has the PDS sign the operation, prints it in
 *         full, and writes key + signed operation to a file. SUBMITS NOTHING.
 *
 *   node tools/plc_recovery.mjs --submit .plc/emma.json
 *       → submits the operation that was printed and reviewed
 *
 * The three steps are separate on purpose. This edits a DID document, which is
 * not reversible, so the operation is written down and read by a human before
 * it goes anywhere. Do one account end to end, verify it at
 * plc.directory/<did>, and only then do the rest.
 *
 * THE PRIVATE KEY NEVER LEAVES THIS MACHINE. It is written to .plc/ (gitignored)
 * so you can move it into a password manager. Losing it costs you the recovery
 * power; leaking it hands someone else control of the identity.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PDS = 'https://bsky.social';
const OUT = path.join(ROOT, '.plc');
const DOMAIN = 'supperclubsecrets.com';

const die = (m) => { console.error(`\n  ERROR  ${m}\n`); process.exit(1); };

/* ---------------------------------------------------------------- did:key */

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function base58btc(bytes) {
  let n = 0n;
  for (const b of bytes) n = n * 256n + BigInt(b);
  let s = '';
  while (n > 0n) { s = B58[Number(n % 58n)] + s; n /= 58n; }
  for (const b of bytes) { if (b === 0) s = '1' + s; else break; }
  return s;
}

/**
 * did:key for a secp256k1 public key: multicodec 0xe7 as a varint (0xe7 0x01),
 * then the 33-byte compressed point, base58btc with a 'z' multibase prefix.
 * Compression is the y-parity byte followed by x, which is what lets 64 bytes
 * of public key travel as 33.
 */
function didKey(publicKey) {
  const jwk = publicKey.export({ format: 'jwk' });
  if (jwk.crv !== 'secp256k1') die(`expected secp256k1, got ${jwk.crv}`);
  const x = Buffer.from(jwk.x, 'base64url');
  const y = Buffer.from(jwk.y, 'base64url');
  const compressed = Buffer.concat([Buffer.from([(y[y.length - 1] & 1) === 1 ? 3 : 2]), x]);
  return 'did:key:z' + base58btc(Buffer.concat([Buffer.from([0xe7, 0x01]), compressed]));
}

/* ------------------------------------------------------------------- xrpc */

/**
 * `post: true` forces a POST with no request body. Some procedures take no
 * input at all and reject `{}` with "A request body was provided when none was
 * expected", so absence of a body cannot be used to infer the verb.
 */
async function xrpc(method, { body, token, query, post } = {}) {
  const url = new URL(`/xrpc/${method}`, PDS);
  for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method: post || body !== undefined ? 'POST' : 'GET',
    headers: {
      ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  if (!res.ok) {
    if (text.includes('Bad token scope')) {
      die(
        `${method} rejected the session's scope.\n\n` +
          `         You are signed in with an APP password. Identity operations need the\n` +
          `         account password — app passwords are scoped out of them on purpose.\n` +
          `         Set BSKY_ACCOUNT_PASSWORD to the real account password and retry.`
      );
    }
    die(`${method} ${res.status}: ${text.slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : {};
}

function account(slug) {
  if (slug === 'project') {
    return { slug, handle: DOMAIN, did: 'did:plc:zvimgmqci4atuvxye2olyn7c' };
  }
  const file = path.join(ROOT, `codex/characters/${slug}.md`);
  if (!fs.existsSync(file)) die(`no such character file: codex/characters/${slug}.md`);
  const fm = fs.readFileSync(file, 'utf8').split('---')[1] ?? '';
  const pick = (k) => (fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) ?? [])[1]?.trim();
  const handle = pick('handle'), did = pick('did');
  if (!handle || !did) die(`${slug} is missing handle: or did: in frontmatter`);
  return { slug, handle: `${handle}.${DOMAIN}`, did };
}

/**
 * Signs in with the ACCOUNT password, not an app password.
 *
 * This is forced, not a choice. A session created from an app password carries
 * scope `com.atproto.appPass`, and every identity operation here requires the
 * full `com.atproto.access` scope — the PDS answers an app-password session with
 * `InvalidToken: Bad token scope`. That boundary is deliberate and good: it is
 * what stops a leaked app password being used to take over an account.
 *
 * It does NOT loosen the standing rule in CHARACTER_ACCOUNTS.md §4 that app
 * passwords, never account passwords, go in the pipeline. This is a one-off
 * manual operation run by hand; the publish path still uses app passwords and is
 * unaffected. The account password must never reach a file, a repo secret, or a
 * chat message — read it into the environment and unset it when you are done.
 */
async function login(acct) {
  const password = process.env.BSKY_ACCOUNT_PASSWORD;
  if (!password) {
    die(
      `BSKY_ACCOUNT_PASSWORD is not set.\n\n` +
        `         This step needs @${acct.handle}'s ACCOUNT password, not its app password.\n` +
        `         App-password sessions are scoped out of identity operations by design.\n\n` +
        `         zsh:   read -s "?Account password for @${acct.handle}: " BSKY_ACCOUNT_PASSWORD; export BSKY_ACCOUNT_PASSWORD\n` +
        `         bash:  read -rsp "Account password for @${acct.handle}: " BSKY_ACCOUNT_PASSWORD; export BSKY_ACCOUNT_PASSWORD`
    );
  }
  console.log(`  Signing in as @${acct.handle} …`);
  const resolved = await xrpc('com.atproto.identity.resolveHandle', { query: { handle: acct.handle } });
  if (resolved.did !== acct.did) {
    die(`DID mismatch for @${acct.handle}\n         codex: ${acct.did}\n         live:  ${resolved.did}`);
  }
  const s = await xrpc('com.atproto.server.createSession', {
    body: { identifier: acct.handle, password },
  });
  return s.accessJwt;
}

/* --------------------------------------------------------------- commands */

async function requestToken(acct) {
  const jwt = await login(acct);
  await xrpc('com.atproto.identity.requestPlcOperationSignature', { token: jwt, post: true });
  console.log(`\n  Token emailed for @${acct.handle}.`);
  console.log(`  Next:  node tools/plc_recovery.mjs --account ${acct.slug} --token <TOKEN>\n`);
}

async function prepare(acct, token) {
  const jwt = await login(acct);

  const current = await xrpc('com.atproto.identity.getRecommendedDidCredentials', { token: jwt });
  const existing = current.rotationKeys ?? [];
  if (existing.length === 0) die('the PDS reported no existing rotation keys — refusing to continue');

  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'secp256k1' });
  const recovery = didKey(publicKey);

  if (existing.includes(recovery)) die('generated key is somehow already present — rerun');

  // Ours FIRST (higher priority, which is what buys the 72-hour override),
  // every existing key kept AFTER it. Dropping the PDS's key would leave
  // Bluesky unable to manage this identity at all, including handle changes.
  const rotationKeys = [recovery, ...existing];

  const signed = await xrpc('com.atproto.identity.signPlcOperation', {
    token: jwt,
    body: {
      token,
      rotationKeys,
      alsoKnownAs: current.alsoKnownAs,
      verificationMethods: current.verificationMethods,
      services: current.services,
    },
  });
  if (!signed.operation) die('the PDS returned no operation');

  fs.mkdirSync(OUT, { recursive: true, mode: 0o700 });
  const file = path.join(OUT, `${acct.slug}.json`);
  fs.writeFileSync(
    file,
    JSON.stringify(
      {
        account: acct.slug,
        handle: acct.handle,
        did: acct.did,
        createdAt: new Date().toISOString(),
        recoveryKeyPublic: recovery,
        recoveryKeyPrivatePem: privateKey.export({ format: 'pem', type: 'pkcs8' }),
        rotationKeysBefore: existing,
        rotationKeysAfter: rotationKeys,
        operation: signed.operation,
      },
      null,
      2
    ) + '\n',
    { mode: 0o600 }
  );

  console.log(`\n${'='.repeat(74)}`);
  console.log(`  PREPARED — @${acct.handle}`);
  console.log('='.repeat(74));
  console.log(`\n  DID              ${acct.did}`);
  console.log(`  New recovery key ${recovery}`);
  console.log(`\n  rotationKeys BEFORE (${existing.length}):`);
  for (const k of existing) console.log(`      ${k}`);
  console.log(`\n  rotationKeys AFTER (${rotationKeys.length}):`);
  rotationKeys.forEach((k, i) => console.log(`      ${i === 0 ? '→' : ' '} ${k}${i === 0 ? '   (yours, highest priority)' : ''}`));

  const kept = existing.every((k) => rotationKeys.includes(k));
  console.log(`\n  Bluesky's key(s) retained: ${kept ? 'YES' : 'NO — DO NOT SUBMIT'}`);
  console.log(`  Ours ranked first:         ${rotationKeys[0] === recovery ? 'YES' : 'NO — DO NOT SUBMIT'}`);
  console.log(`\n  Written to ${path.relative(ROOT, file)} (private key inside — move it to your`);
  console.log('  password manager and delete the file once the operation is submitted).');
  console.log(`\n  NOTHING HAS BEEN SUBMITTED. When the two checks above read YES:`);
  console.log(`      node tools/plc_recovery.mjs --submit ${path.relative(ROOT, file)}\n`);
  if (!kept || rotationKeys[0] !== recovery) process.exit(1);
}

async function submit(file) {
  const abs = path.resolve(ROOT, file);
  if (!fs.existsSync(abs)) die(`no such file: ${file}`);
  const saved = JSON.parse(fs.readFileSync(abs, 'utf8'));
  if (!saved.operation) die('that file has no signed operation in it');
  if (!saved.rotationKeysBefore.every((k) => saved.rotationKeysAfter.includes(k))) {
    die('refusing to submit: the operation drops an existing rotation key');
  }
  if (saved.rotationKeysAfter[0] !== saved.recoveryKeyPublic) {
    die('refusing to submit: your key is not ranked first');
  }
  // submitPlcOperation is authenticated like every other identity call, so this
  // step signs in again rather than being a pure file-to-network hand-off.
  const acct = account(saved.account);
  if (acct.did !== saved.did) die(`file is for ${saved.did} but ${saved.account} now records ${acct.did}`);
  const jwt = await login(acct);
  await xrpc('com.atproto.identity.submitPlcOperation', {
    token: jwt,
    body: { operation: saved.operation },
  });
  console.log(`\n  Submitted for @${saved.handle}.`);
  // /<did> returns the W3C DID document, which deliberately does not expose
  // rotation keys — they are PLC-internal state. /data returns the current
  // operation state, which does.
  console.log(`  Verify:  curl -s https://plc.directory/${saved.did}/data | jq .rotationKeys`);
  console.log(`  Expect your key first: ${saved.recoveryKeyPublic}\n`);
}

/* ------------------------------------------------------------------- main */

const a = process.argv.slice(2);
const flag = (f) => { const i = a.indexOf(f); return i === -1 ? undefined : a[i + 1]; };

if (a.includes('--submit')) {
  await submit(flag('--submit') ?? die('--submit needs a file path'));
} else {
  const slug = flag('--account') ?? die('--account <slug> is required');
  const acct = account(slug);
  if (a.includes('--request')) await requestToken(acct);
  else {
    const token = flag('--token') ?? die('pass --request first, then --token <TOKEN>');
    await prepare(acct, token);
  }
}
