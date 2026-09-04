import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('the blog components are gone', () => {
  assert.ok(!existsSync('src/blog'), 'src/blog must be deleted');
});

test('the router no longer owns blog routes', () => {
  const source = readFileSync('src/index.tsx', 'utf8');
  for (const route of ['/blog', '/blog/:id', '/blog/not-found', '/test']) {
    assert.ok(
      !source.includes(`path="${route}"`),
      `${route} must not be a SPA route — express serves it`,
    );
  }
});

test('axios and file-saver are no longer dependencies', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.equal(pkg.dependencies.axios, undefined);
  assert.equal(pkg.dependencies['file-saver'], undefined);
  assert.equal(pkg.devDependencies['@types/file-saver'], undefined);
});

test('no source file still imports them', () => {
  const source = readFileSync('src/index.tsx', 'utf8');
  assert.ok(!source.includes('axios'));
  assert.ok(!source.includes('file-saver'));
});

test('the homepage links the blog and has no Extra section', () => {
  const app = readFileSync('src/app/App.tsx', 'utf8');
  assert.match(app, /Writing/);
  assert.match(app, /\/blog\/index\.json/);
  assert.ok(!app.includes('Extra'), 'the Extra section is removed');
});
