import { test } from 'node:test';
import assert from 'node:assert/strict';
import { navItems, offcanvasItems } from '../src/nav.ts';

test('nav starts with Home then Blog', () => {
  assert.equal(navItems[0].label, 'Home');
  assert.equal(navItems[1].label, 'Blog');
  assert.equal(navItems[1].href, '/blog');
});

test('every nav href is a root-relative path', () => {
  for (const item of [...navItems, ...offcanvasItems]) {
    assert.match(item.href, /^\//, `${item.label} href must start with /`);
  }
});

test('no duplicate hrefs across nav and offcanvas', () => {
  const hrefs = [...navItems, ...offcanvasItems].map((i) => i.href);
  assert.equal(new Set(hrefs).size, hrefs.length);
});

test('About lives in the offcanvas, not the main nav', () => {
  assert.ok(!navItems.some((i) => i.label === 'About'));
  assert.ok(offcanvasItems.some((i) => i.href === '/about'));
});

test('Blog is marked external - Express owns it, not the SPA router', () => {
  const blog = navItems.find((i) => i.label === 'Blog');
  assert.ok(blog, 'Blog must be present in navItems');
  assert.equal(blog.external, true);
});

test('every other nav and offcanvas item is a real SPA route, so external is unset', () => {
  for (const item of [...navItems, ...offcanvasItems]) {
    if (item.label === 'Blog') continue;
    assert.equal(
      item.external,
      undefined,
      `${item.label} should not carry external - it is an SPA route`,
    );
  }
});
