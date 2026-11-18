/**
 * Every piece of blog chrome that differs by language, and every path that
 * depends on it. A post is written in one language (`lang` in frontmatter),
 * and that language decides which list it appears in (/blog for Korean,
 * /blog/en for English) and which copy its page carries.
 *
 * This module is imported by node's test runner as well as by Astro, so it
 * stays free of `astro:*` imports.
 */

import { viewsLabel } from './views.ts';

export type Lang = 'ko' | 'en';

export const LANGS: readonly Lang[] = ['ko', 'en'];

export function isLang(value: unknown): value is Lang {
  return value === 'ko' || value === 'en';
}

const BASE = '/blog';
/* The site's name is the domain, which is what the home page's own <title>
   says. "Kyle Park | Blog" named a person and then a category, and read as a
   different site's title next to the home page's `jungho.dev`. Every page
   title on the blog is now `<what this page is> | jungho.dev`. */
const SITE_NAME = 'jungho.dev';

export function listPath(lang: Lang): string {
  return lang === 'en' ? `${BASE}/en` : BASE;
}

export function tagPath(lang: Lang, tag: string): string {
  return `${listPath(lang)}/tags/${tag}`;
}

export function rssPath(lang: Lang): string {
  return `${listPath(lang)}/rss.xml`;
}

/**
 * The language toggle's target. It goes through /blog on purpose: express
 * stores the choice in a cookie there and then redirects to the list, so a
 * reader whose browser is set to another language is not switched back the
 * next time they open /blog.
 */
export function togglePath(lang: Lang): string {
  return `${BASE}?lang=${lang}`;
}

/**
 * Where a link that names a list in its own words points: the back link
 * under a post, a tag bar's All, the 404 page's list button. The English
 * list has an address that is never switched. The Korean list is /blog,
 * which sends a browser that asks only for English to /blog/en, so a
 * Korean reader with an English browser who clicks 「← 글 목록」 would land
 * on the English list. A link written in Korean is the reader choosing
 * Korean, so it goes through the toggle and is stored like one.
 */
export function listLinkPath(lang: Lang): string {
  return lang === 'ko' ? togglePath('ko') : listPath('en');
}

const DATE_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Seoul',
} as const;

export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(
    lang === 'en' ? 'en-US' : 'ko-KR',
    DATE_OPTIONS,
  );
}

export interface Copy {
  readingTime(minutes: number): string;
  updated(date: string): string;
  contents: string;
  comments: string;
  download: string;
  back: string;
  progress: string;
  empty: string;
  postCount(n: number): string;
  views(n: number): string;
  listTitle: string;
  listDescription: string;
  giscusLang: Lang;
  langNav: string;
  archivedSuffix: string;
  archivedNotice(date: string): string;
  newPost: string;
}

export const COPY: Record<Lang, Copy> = {
  ko: {
    readingTime: (m) => `읽는 데 약 ${m}분`,
    updated: (d) => `수정: ${d}`,
    contents: '목차',
    comments: '댓글',
    download: '원문 마크다운 내려받기',
    back: '← 글 목록',
    progress: '읽기 진행률',
    empty: '아직 발행한 글이 없습니다.',
    postCount: (n) => `${n}편`,
    views: (n) => viewsLabel(n, 'ko') as string,
    listTitle: `Blog | ${SITE_NAME}`,
    listDescription: '블록체인, 퀀트 시스템, 데브렐을 다룬 기술 글입니다.',
    giscusLang: 'ko',
    langNav: '언어',
    archivedSuffix: '(보관)',
    archivedNotice: (d) =>
      `보관한 글입니다. ${d}에 쓴 내용을 고치지 않고 그대로 두었고, 블로그 글 목록과 검색 엔진 결과에는 나오지 않습니다.`,
    newPost: '새로 쓴 글:',
  },
  en: {
    readingTime: (m) => `${m} min read`,
    updated: (d) => `Updated ${d}`,
    contents: 'Contents',
    comments: 'Comments',
    download: 'Download the Markdown source',
    back: '← All posts',
    progress: 'Reading progress',
    empty: 'No posts yet.',
    postCount: (n) => `${n} ${n === 1 ? 'post' : 'posts'}`,
    views: (n) => viewsLabel(n, 'en') as string,
    listTitle: `Blog (English) | ${SITE_NAME}`,
    listDescription:
      'Technical writings on blockchain, quant systems, and developer relations.',
    giscusLang: 'en',
    langNav: 'Language',
    archivedSuffix: '(archived)',
    archivedNotice: (d) =>
      `Archived post. Kept as written on ${d}; it is not in the blog list or in search results.`,
    newPost: 'New post:',
  },
};
