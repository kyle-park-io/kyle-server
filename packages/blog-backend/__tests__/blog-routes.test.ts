import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../dist/app.js';

let server;
let base;
let root;

before(async () => {
  root = mkdtempSync(join(tmpdir(), 'blog-routes-'));

  const blogDist = join(root, 'blog-dist');
  mkdirSync(join(blogDist, 'tags'), { recursive: true });
  writeFileSync(join(blogDist, 'index.html'), '<h1>Blog list</h1>');
  writeFileSync(join(blogDist, 'hello-world.html'), '<h1>Hello</h1>');
  writeFileSync(join(blogDist, 'hello-world.md'), '# raw markdown');
  writeFileSync(join(blogDist, 'rss.xml'), '<rss></rss>');
  writeFileSync(join(blogDist, '404.html'), '<h1>글을 찾을 수 없습니다</h1>');
  writeFileSync(join(blogDist, 'tags', 'ethereum.html'), '<h1>#ethereum</h1>');
  writeFileSync(join(blogDist, 'en.html'), '<h1>English list</h1>');
  mkdirSync(join(blogDist, 'en', 'tags'), { recursive: true });
  writeFileSync(join(blogDist, 'en', 'tags', 'astro.html'), '<h1>#astro</h1>');
  writeFileSync(join(blogDist, 'en', 'rss.xml'), '<rss></rss>');

  const spaStatic = join(root, 'spa');
  mkdirSync(join(spaStatic, 'assets'), { recursive: true });
  writeFileSync(join(spaStatic, 'index.html'), '<div id="root"></div>');
  writeFileSync(join(spaStatic, 'assets', 'main.blog.js'), 'console.log(1)');

  const app = createApp({ blogDist, spaStatic });
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  rmSync(root, { recursive: true, force: true });
});

test('GET /blog serves the static list page', async () => {
  const res = await fetch(`${base}/blog`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type') ?? '', /text\/html/);
  assert.match(await res.text(), /Blog list/);
});

test('GET /blog/<slug> serves the article without a redirect', async () => {
  const res = await fetch(`${base}/blog/hello-world`, { redirect: 'manual' });
  assert.equal(res.status, 200);
  assert.match(await res.text(), /Hello/);
});

test('GET /blog/tags/<tag> serves the tag page', async () => {
  const res = await fetch(`${base}/blog/tags/ethereum`);
  assert.equal(res.status, 200);
});

test('GET /blog/<slug>.md serves the raw markdown', async () => {
  const res = await fetch(`${base}/blog/hello-world.md`);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /raw markdown/);
  // Astro's static output never persists the content-type set inside
  // [slug].md.ts — only the response body survives to disk — so what a
  // reader actually gets is decided entirely by express's own MIME table
  // (send@`mime`@1.6.0, via serve-static). Pin it down and surface it.
  const contentType = res.headers.get('content-type');
  console.log('content-type served for /blog/<slug>.md:', contentType);
  assert.equal(contentType, 'text/markdown; charset=UTF-8');
});

test('GET /blog/rss.xml serves the feed', async () => {
  assert.equal((await fetch(`${base}/blog/rss.xml`)).status, 200);
});

test('a legacy slug 301s to its new path', async () => {
  const res = await fetch(`${base}/blog/eth`, { redirect: 'manual' });
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), '/blog/ethereum-event-object');
});

test('an unknown blog path serves the blog 404, not the SPA', async () => {
  const res = await fetch(`${base}/blog/does-not-exist`);
  assert.equal(res.status, 404);
  assert.match(await res.text(), /글을 찾을 수 없습니다/);
});

test('the SPA still serves its own static assets', async () => {
  const res = await fetch(`${base}/blog-static/assets/main.blog.js`);
  assert.equal(res.status, 200);
});

test('a non-blog route still falls through to the SPA shell', async () => {
  const res = await fetch(`${base}/devrel`);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /id="root"/);
});

test('the removed blog API is gone', async () => {
  for (const path of [
    '/api/blog',
    '/api/blog/number',
    '/api/blog/update',
    '/api/blog/sorted-by-date/top-10',
  ]) {
    const res = await fetch(`${base}${path}`);
    assert.notEqual(res.status, 200, `${path} must no longer respond 200`);
  }
});

test('POST /blog does not serve the list page', async () => {
  const res = await fetch(`${base}/blog`, { method: 'POST' });
  assert.notEqual(res.status, 200);
  assert.equal(res.status, 404);
});

test('a missing BLOG_DIST degrades to 503, not a crawler-hostile 404', async () => {
  // build-blog.sh's publish swap has a real window where BLOG_DIST does not
  // exist between the "move old out" and "move new in" renames. Simulate
  // that by pointing an app at a directory that was never created.
  const missingRoot = mkdtempSync(join(tmpdir(), 'blog-routes-missing-'));
  const missingBlogDist = join(missingRoot, 'blog-dist');
  const spaStatic = join(missingRoot, 'spa');
  mkdirSync(spaStatic, { recursive: true });
  writeFileSync(join(spaStatic, 'index.html'), '<div id="root"></div>');

  const app = createApp({ blogDist: missingBlogDist, spaStatic });
  const missingServer = app.listen(0);
  await new Promise((resolve) => missingServer.once('listening', resolve));
  const missingBase = `http://127.0.0.1:${missingServer.address().port}`;

  try {
    const res = await fetch(`${missingBase}/blog`);
    assert.equal(res.status, 503);
    assert.equal(res.headers.get('retry-after'), '1');
  } finally {
    await new Promise((resolve) => missingServer.close(resolve));
    rmSync(missingRoot, { recursive: true, force: true });
  }
});

// Node's fetch sends `accept-language: *` unless told otherwise, so every
// language test below sets the header it means.
const get = (path: string, headers: Record<string, string> = {}) =>
  fetch(`${base}${path}`, { redirect: 'manual', headers });

test('an english browser is sent to /blog/en', async () => {
  const res = await get('/blog', { 'accept-language': 'en-US,en;q=0.9' });
  assert.equal(res.status, 302);
  assert.equal(res.headers.get('location'), '/blog/en');
});

test('a korean browser gets the korean list', async () => {
  const res = await get('/blog', { 'accept-language': 'ko-KR,ko;q=0.9' });
  assert.equal(res.status, 200);
  assert.match(await res.text(), /Blog list/);
});

test('a request without accept-language gets the korean list', async () => {
  const res = await get('/blog', { 'accept-language': '' });
  assert.equal(res.status, 200);
});

// fetch always sends accept-language (`*` when not told otherwise), so the
// test above sends an empty one. node:http sends only the headers it is
// given, which is what a crawler without the header looks like.
test('a request with no accept-language header at all gets the korean list', async () => {
  const { request } = await import('node:http');
  const res = await new Promise<{ status: number; body: string }>((resolve, reject) => {
    const req = request(`${base}/blog`, (r) => {
      let body = '';
      r.on('data', (c) => (body += c));
      r.on('end', () => resolve({ status: r.statusCode ?? 0, body }));
    });
    req.on('error', reject);
    req.end();
  });
  assert.equal(res.status, 200);
  assert.match(res.body, /Blog list/);
});

test('the cookie beats the header both ways', async () => {
  const ko = await get('/blog', {
    'accept-language': 'en-US',
    cookie: 'blog_lang=ko',
  });
  assert.equal(ko.status, 200);
  const en = await get('/blog', {
    'accept-language': 'ko-KR',
    cookie: 'blog_lang=en',
  });
  assert.equal(en.status, 302);
  assert.equal(en.headers.get('location'), '/blog/en');
});

test('?lang sets the cookie and redirects to the canonical list', async () => {
  const ko = await get('/blog?lang=ko', { 'accept-language': 'en-US' });
  assert.equal(ko.status, 302);
  assert.equal(ko.headers.get('location'), '/blog');
  const cookie = ko.headers.get('set-cookie') ?? '';
  for (const part of [
    'blog_lang=ko',
    'Path=/blog',
    'Max-Age=31536000',
    'SameSite=Lax',
    'Secure',
  ]) {
    assert.ok(cookie.includes(part), `${part} in ${cookie}`);
  }

  const en = await get('/blog?lang=en&utm_source=x', {
    'accept-language': 'ko',
  });
  assert.equal(en.status, 302);
  assert.equal(en.headers.get('location'), '/blog/en');
  assert.match(en.headers.get('set-cookie') ?? '', /blog_lang=en/);
});

test('an unknown ?lang is ignored and sets no cookie', async () => {
  const res = await get('/blog?lang=fr', { 'accept-language': 'ko' });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('set-cookie'), null);
});

test('every /blog response varies on language and cookie and is not shared-cached', async () => {
  for (const headers of [
    { 'accept-language': 'en-US' },
    { 'accept-language': 'ko' },
    { 'accept-language': 'en-US', cookie: 'blog_lang=ko' },
  ]) {
    const res = await get('/blog', headers);
    const vary = res.headers.get('vary') ?? '';
    assert.match(vary, /Accept-Language/, JSON.stringify(headers));
    assert.match(vary, /Cookie/, JSON.stringify(headers));
    assert.equal(res.headers.get('cache-control'), 'private, no-cache');
  }
});

test('a trailing slash and HEAD follow the same rule', async () => {
  const slash = await get('/blog/', { 'accept-language': 'en-US' });
  assert.equal(slash.status, 302);
  const head = await fetch(`${base}/blog`, {
    method: 'HEAD',
    redirect: 'manual',
    headers: { 'accept-language': 'en-US' },
  });
  assert.equal(head.status, 302);
});

test('/blog/en serves the english list and is never redirected', async () => {
  const res = await get('/blog/en', {
    'accept-language': 'ko-KR',
    cookie: 'blog_lang=ko',
  });
  assert.equal(res.status, 200);
  assert.match(await res.text(), /English list/);
});

test('english tag pages and the english feed are served', async () => {
  assert.equal((await get('/blog/en/tags/astro')).status, 200);
  assert.equal((await get('/blog/en/rss.xml')).status, 200);
});

test('a korean post is not redirected by language', async () => {
  const res = await get('/blog/hello-world', { 'accept-language': 'en-US' });
  assert.equal(res.status, 200);
});

test('an old address of an english-only tag forwards to the english tag page', async () => {
  // /blog/tags/<tag> served every tag before the lists split by language;
  // tags only English posts use now live under /blog/en/tags.
  const res = await get('/blog/tags/astro');
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), '/blog/en/tags/astro');
});

test('a korean tag page is still served where it was', async () => {
  assert.equal((await get('/blog/tags/ethereum')).status, 200);
});

test('a tag that exists in neither language is a 404', async () => {
  assert.equal((await get('/blog/tags/nothing-here')).status, 404);
  assert.equal((await get('/blog/tags/..%2Fen')).status, 404);
  assert.equal((await get('/blog/tags/Astro')).status, 404);
});
