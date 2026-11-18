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
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `${BASE}/${post.id}`,
      categories: post.data.tags,
    })),
  });
}
