/**
 * How many people have read each post, as the ingress proxy reports it
 * (`/api-views`, ingress-reverse-proxy/redis/views.go). The pages render a
 * hidden span per post (ViewCount.astro) and one script (ViewCounts.astro)
 * fills them; this module is the part of that script node's test runner can
 * check, so it stays free of DOM and `astro:*` imports.
 *
 * It also owns the count's wording, which COPY in i18n.ts re-exports. Astro
 * inlines a script this small into every page, so the script must not import
 * i18n.ts: that would put the whole copy table of both languages into each
 * page's HTML.
 */

import type { Lang } from './i18n';

export const VIEWS_API = '/api-views';

/**
 * The proxy is not in front of `astro dev` or a local preview, so these
 * hosts ask for nothing, as the presence socket in Header.astro does.
 */
export function isLocalHost(hostname: string): boolean {
  return /^(localhost|127\.0\.0\.1|\[::1\])$/.test(hostname);
}

const thousands = (n: number, locale: string): string =>
  new Intl.NumberFormat(locale).format(n);

/** `조회 1,234` / `1,234 views`; null for a language the blog does not have. */
export function viewsLabel(n: number, lang: string | undefined): string | null {
  if (lang === 'ko') return `조회 ${thousands(n, 'ko-KR')}`;
  if (lang === 'en')
    return `${thousands(n, 'en-US')} ${n === 1 ? 'view' : 'views'}`;
  return null;
}

/** One request for every count a list page shows. */
export function listQuery(slugs: string[]): string {
  return `${VIEWS_API}?slugs=${[...new Set(slugs)].join(',')}`;
}

const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0;

/** The count in a `POST /api-views/<slug>` reply, if it is about `slug`. */
export function readCount(body: unknown, slug: string): number | null {
  if (typeof body !== 'object' || body === null) return null;
  const { slug: about, views } = body as { slug?: unknown; views?: unknown };
  return about === slug && isCount(views) ? views : null;
}

/** The counts in a `GET /api-views?slugs=` reply; anything else is dropped. */
export function readCounts(body: unknown): Record<string, number> {
  const counts: Record<string, number> = {};
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return counts;
  }
  for (const [slug, views] of Object.entries(body)) {
    if (isCount(views)) counts[slug] = views;
  }
  return counts;
}
