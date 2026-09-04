import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { excludeDrafts } from '../lib/posts';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = excludeDrafts(
    await getCollection('posts'),
    import.meta.env.DEV,
  );
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { body: post.body ?? '' },
  }));
};

export const GET: APIRoute = ({ props }) =>
  new Response(props.body as string, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
