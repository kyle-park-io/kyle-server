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
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `${BASE}/${post.id}`,
      categories: post.data.tags,
    })),
  });
};
