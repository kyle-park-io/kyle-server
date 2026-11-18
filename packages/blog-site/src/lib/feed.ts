import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortByDateDesc, listed, inLang } from './posts';
import { BASE, SITE_URL } from '../config/site';
import { COPY, type Lang } from './i18n';

/** The RSS feed of one language's list. */
export async function feed(lang: Lang): Promise<Response> {
  const posts = sortByDateDesc(
    inLang(listed(await getCollection('posts'), false), lang),
  );

  return rss({
    title: COPY[lang].listTitle,
    description: COPY[lang].listDescription,
    site: SITE_URL,
    // The site's canonical URLs carry no trailing slash (trailingSlash:
    // 'never' in astro.config.mjs, build.format: 'file' emitting
    // dist/<slug>.html). @astrojs/rss defaults trailingSlash to true and
    // would otherwise append one to every item link/guid, which express's
    // `extensions: ['html']` + `redirect: false` static mount cannot
    // resolve (it looks for dist/<slug>/index.html and falls through to
    // 404). Keep item links exactly as passed.
    trailingSlash: false,
    // Each feed holds one language's posts; readers use this to pick a
    // font, a hyphenation dictionary or a translation offer.
    customData: `<language>${lang}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `${BASE}/${post.id}`,
      categories: post.data.tags,
    })),
  });
}
