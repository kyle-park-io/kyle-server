import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The Navigate panel stayed open after picking Chat or About: the router
// changed the page without a reload, and the Header that owns the panel's
// open state sat outside the Router and never saw the change (2026-11-28).
// A modal drawer closes once an item is activated (Material Components,
// mdc-drawer README). Checked in a headless Chrome against the production
// build: Chat, LinkedIn and Back all left the panel open before this change.

test('the Header renders inside the Router so it can follow the path', () => {
  const index = readFileSync('src/index.tsx', 'utf8');
  assert.match(index, /<Router root=\{Layout\}>/);
  const layout = index.slice(
    index.indexOf('const Layout'),
    index.indexOf('if (root'),
  );
  assert.ok(layout.includes('<Header />'), 'the Layout must render the Header');
});

test('the Header closes the panel when the path changes', () => {
  const header = readFileSync('src/layout/Header.tsx', 'utf8');
  assert.match(
    header,
    /on\(\s*\(\) => location\.pathname,\s*\(\) => \{\s*setShow\(false\);/,
  );
});

test('picking any link or button in the panel closes it', () => {
  const panel = readFileSync('src/components/offcanvas/Offcanvas.tsx', 'utf8');
  assert.match(
    panel,
    /class="nav-panel__body"\s*onClick=\{\(event\) => \{\s*if \(\(event\.target as Element\)\.closest\('a, button'\) !== null\) \{\s*props\.onHide\(\);/,
  );
});
