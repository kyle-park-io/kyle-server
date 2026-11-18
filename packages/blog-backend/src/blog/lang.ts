/**
 * Which blog list `GET /blog` answers with: the Korean list (served at
 * /blog) or the English one (at /blog/en, reached by a redirect).
 *
 * Order:
 *   1. `?lang=ko|en`, sent by the list pages' language toggle. It is stored
 *      in a cookie so the choice holds on the next visit.
 *   2. That cookie.
 *   3. `Accept-Language`. Korean unless the header is present and names no
 *      Korean at a non-zero quality.
 *
 * A request without `Accept-Language` gets Korean on purpose. Google's crawler
 * "sends HTTP requests without setting Accept-Language in the request header"
 * (developers.google.com/search/docs/specialty/international/
 * managing-multi-regional-sites, read 2026-11-18), so it is served the Korean
 * list and reaches the English one through links, instead of being redirected
 * away from /blog.
 */

export type BlogLang = 'ko' | 'en';

export const LANG_COOKIE = 'blog_lang';

const isBlogLang = (value: unknown): value is BlogLang =>
  value === 'ko' || value === 'en';

/** The first valid `blog_lang` value in a Cookie header, if any. */
export function langFromCookie(
  cookieHeader: string | undefined,
): BlogLang | undefined {
  if (!cookieHeader) return undefined;
  for (const pair of cookieHeader.split(';')) {
    const eq = pair.indexOf('=');
    if (eq === -1) continue;
    if (pair.slice(0, eq).trim() !== LANG_COOKIE) continue;
    const value = pair.slice(eq + 1).trim();
    if (isBlogLang(value)) return value;
  }
  return undefined;
}

interface LanguageRange {
  primary: string;
  q: number;
}

function parseAcceptLanguage(header: string): LanguageRange[] {
  const ranges: LanguageRange[] = [];
  for (const part of header.split(',')) {
    const [tag, ...params] = part.trim().split(';');
    if (!tag) continue;
    let q = 1;
    for (const param of params) {
      const [key, value] = param.trim().split('=');
      if (key?.trim().toLowerCase() === 'q') q = Number(value);
    }
    // A malformed quality makes the range unusable rather than preferred.
    if (!Number.isFinite(q)) continue;
    ranges.push({ primary: tag.trim().toLowerCase().split('-')[0], q });
  }
  return ranges;
}

/**
 * Whether an Accept-Language header lets the reader have Korean.
 *
 * An explicit Korean range decides on its own (so `*, ko;q=0` is not
 * Korean). Without one, a wildcard with a non-zero quality accepts Korean.
 * No header, or a blank one, is Korean.
 */
export function prefersKorean(acceptLanguage: string | undefined): boolean {
  if (!acceptLanguage || acceptLanguage.trim() === '') return true;
  const ranges = parseAcceptLanguage(acceptLanguage);
  const korean = ranges.filter((r) => r.primary === 'ko');
  if (korean.length > 0) return korean.some((r) => r.q > 0);
  return ranges.some((r) => r.primary === '*' && r.q > 0);
}

export type ListChoice =
  /** Store this language in the cookie, then redirect to its list. */
  | { kind: 'set'; lang: BlogLang }
  /** Show this language's list. */
  | { kind: 'serve'; lang: BlogLang };

export function chooseList(input: {
  query?: unknown;
  cookie?: string;
  acceptLanguage?: string;
}): ListChoice {
  if (isBlogLang(input.query)) return { kind: 'set', lang: input.query };
  const fromCookie = langFromCookie(input.cookie);
  if (fromCookie) return { kind: 'serve', lang: fromCookie };
  return {
    kind: 'serve',
    lang: prefersKorean(input.acceptLanguage) ? 'ko' : 'en',
  };
}
