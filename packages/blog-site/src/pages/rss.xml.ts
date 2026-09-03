import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { sortByDateDesc, excludeDrafts } from '../lib/posts';
import { BASE, BLOG_TITLE, BLOG_DESCRIPTION, SITE_URL } from '../config/site';

export const GET: APIRoute = async () => {
  const posts = sortByDateDesc(
    excludeDrafts(await getCollection('posts'), false),
  );

  return rss({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    site: SITE_URL,
    // The site's canonical URLs carry no trailing slash (trailingSlash:
    // 'never' in astro.config.mjs, build.format: 'file' emitting
    // dist/<slug>.html). @astrojs/rss defaults trailingSlash to true and
    // would otherwise append one to every item link/guid, which express's
    // `extensions: ['html']` + `redirect: false` static mount cannot
    // resolve (it looks for dist/<slug>/index.html and falls through to
    // 404). Keep item links exactly as passed.
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `${BASE}/${post.id}`,
      categories: post.data.tags,
    })),
  });
};
