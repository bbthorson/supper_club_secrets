/**
 * standard.site — the AT Protocol lexicons for long-form publishing
 * (`site.standard.*`). This file is the site's half of that contract.
 *
 * WHAT THIS IS AND ISN'T. The identity exists (see `handle` below), but the
 * records themselves live on a PDS and are created by an authenticated write —
 * so nothing in this repo creates or publishes anything. What the *website*
 * owes the standard is two verification artifacts:
 *
 *   1. `/.well-known/site.standard.publication` returning the publication's
 *      AT-URI, which proves the domain and the record belong together.
 *   2. `<link rel="site.standard.document" href="at://…">` in each document's
 *      HTML, which ties a page to its record.
 *
 * Both are derived from the config below, so they can never disagree with each
 * other. Until a DID and an rkey are filled in, both are *silent*: the
 * well-known route emits no file and the link tag doesn't render. A fabricated
 * AT-URI would be worse than an absent one — it claims a record that isn't
 * there, on a standard whose whole point is verification.
 *
 * WHAT A HUMAN HAS TO DO. The account is made; three steps are left. Resolve the
 * handle to its DID and paste it below. Create the publication record and one
 * document record per chapter — the payloads are built for you at
 * `/data/standard-site.json`. Paste the rkeys those writes return in here.
 * `/data/standard-site.json` reports which of the three are still outstanding.
 *
 * The series is the publication and a chapter is a document. That's the mapping
 * the standard is shaped for — a chapter is the serialized unit that gets
 * published, linked and recommended, the way a post is on a blog.
 */

export interface StandardSiteConfig {
  /**
   * The account the records belong to. Nothing is derived from it — a handle is
   * a rented name and can move, which is exactly why the standard verifies
   * against a DID instead. It's recorded here so a reader of this repo knows
   * whose publication this is, and so whoever creates the records knows which
   * account to sign in as.
   */
  handle: string;
  /**
   * `did:plc:…` for the identity that owns the records — the stable half of
   * the pair above, and the only one the AT-URIs are built from. Empty = the
   * handle hasn't been resolved yet, and the site stays silent.
   *
   *     curl 'https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=<handle>'
   */
  did: string;
  /** rkey of the `site.standard.publication` record. */
  publicationRkey: string;
  /** rkey of each chapter's `site.standard.document` record, by chapter number.
   *  Only chapters listed here get a link tag — a partial rollout is fine. */
  documentRkeys: Record<number, string>;
  /**
   * Fallback for a chapter whose frontmatter has no `publishDate`. `publishedAt`
   * is required on a document record, and drip serialization leaves the dates
   * empty until a book is actually being served, so this is the date the book
   * went live. Empty = the payload reports the chapter as unresolved rather
   * than inventing a timestamp.
   */
  publishedAt: string;
  /**
   * Whether to put each chapter's prose in the record's `textContent`.
   *
   * Off, deliberately. It's optional in the lexicon, and turning it on
   * publishes all twenty-five chapters as public records — which would make the
   * canon horizon a website-only courtesy and move the book itself outside the
   * place it's read. Metadata federates; the prose stays here. That's an
   * editorial call, not a technical one, so it lives in config as a switch
   * someone can flip on purpose.
   */
  includeTextContent: boolean;
}

export const STANDARD_SITE: StandardSiteConfig = {
  handle: 'supperclubsecrets.bsky.social',
  did: '',
  publicationRkey: '',
  documentRkeys: {},
  publishedAt: '',
  includeTextContent: false,
};

/** True once there's an identity and a publication record to point at. */
export function isVerifiable(config: StandardSiteConfig = STANDARD_SITE): boolean {
  return config.did.startsWith('did:') && config.publicationRkey.length > 0;
}

/** `at://<did>/site.standard.publication/<rkey>`, or null when unconfigured. */
export function publicationUri(config: StandardSiteConfig = STANDARD_SITE): string | null {
  if (!isVerifiable(config)) return null;
  return `at://${config.did}/site.standard.publication/${config.publicationRkey}`;
}

/** A chapter's document AT-URI, or null when that chapter has no record yet. */
export function documentUri(
  chapter: number,
  config: StandardSiteConfig = STANDARD_SITE,
): string | null {
  const rkey = config.documentRkeys[chapter];
  if (!config.did.startsWith('did:') || !rkey) return null;
  return `at://${config.did}/site.standard.document/${rkey}`;
}
