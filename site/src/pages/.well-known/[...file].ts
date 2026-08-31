import type { APIRoute } from 'astro';
import { publicationUri } from '../../lib/standard-site';

/**
 * `/.well-known/site.standard.publication` — the domain's half of standard.site
 * verification. It returns the publication record's AT-URI and nothing else,
 * which is how a consumer confirms that this domain and that record are the
 * same publication.
 *
 * A catch-all with an enumerated path rather than a fixed `site.standard.publication.ts`
 * so that `getStaticPaths` can return NOTHING while the publication is
 * unconfigured. A fixed route would always emit a file, and a well-known
 * endpoint serving an empty or placeholder AT-URI is a failed verification
 * rather than an absent one — worse than not being there at all.
 */
export function getStaticPaths() {
  const uri = publicationUri();
  return uri ? [{ params: { file: 'site.standard.publication' }, props: { uri } }] : [];
}

export const GET: APIRoute = ({ props }) =>
  new Response(`${(props as { uri: string }).uri}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
