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
