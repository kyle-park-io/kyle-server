/**
 * The blog used to derive URLs from markdown filenames. Slugs are now the
 * post directory name, so the old URLs must keep working — they are in
 * search indexes and in links people have already shared.
 */
// Object.create(null) rather than a `{}` literal: `Record<string, string>`
// indexed by an attacker-controlled path segment would otherwise resolve
// inherited Object.prototype members — `/blog/constructor`, `/blog/toString`,
// `/blog/__proto__` — to functions instead of `undefined`, producing
// nonsense redirects instead of a 404.
export const LEGACY_SLUGS: Record<string, string> = Object.assign(
  Object.create(null),
  {
    portfolio1: '/blog/project-initial-setup',
    eth: '/blog/ethereum-event-object',
    portfolio4: '/blog/chain-communicator',
    // md/test.md was a fixture and is deleted; send it to the list.
    test: '/blog',
  },
);

/**
 * @param pathname path relative to the /blog mount, e.g. `/eth`
 * @returns the absolute path to redirect to, or undefined if not a legacy slug
 */
export function resolveLegacySlug(pathname: string): string | undefined {
  const slug = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  if (slug === '') return undefined;
  return LEGACY_SLUGS[slug];
}
