import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { sortByDateDesc, excludeDrafts } from '../lib/posts';
import { BASE } from '../config/site';

/**
 * Consumed by the SPA homepage's Writing section. Replaces the deleted
 * /api-blog/api/blog/sorted-by-date/top-10 endpoint.
 */
export const GET: APIRoute = async () => {
  const posts = sortByDateDesc(
    excludeDrafts(await getCollection('posts'), false),
  );

  const items = posts.map((post) => ({
    slug: post.id,
    title: post.data.title,
    summary: post.data.summary,
    date: post.data.date.toISOString().slice(0, 10),
    tags: post.data.tags,
    url: `${BASE}/${post.id}`,
  }));

  return new Response(JSON.stringify(items), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
