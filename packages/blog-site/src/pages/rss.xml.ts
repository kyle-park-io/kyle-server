import type { APIRoute } from 'astro';
import { feed } from '../lib/feed';

/** Korean posts only. English posts are in /blog/en/rss.xml. */
export const GET: APIRoute = () => feed('ko');
