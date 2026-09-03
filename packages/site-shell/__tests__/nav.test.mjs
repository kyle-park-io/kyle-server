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
