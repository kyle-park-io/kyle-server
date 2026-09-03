# Blog Overhaul Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the client-rendered `/blog` with a statically generated Astro site fed by frontmatter in the existing content repo, and promote the blog from the homepage's `Extra` section to a first-class entry point.

**Architecture:** A new `packages/blog-site` Astro package builds `/blog` to static HTML. The existing express server (`packages/blog-backend`) serves that output at `/blog` ahead of its SPA catch-all, plus a 301 map for the old filename-based URLs. Publishing stays "push markdown, live within 10 minutes": the pod's cron pulls the content repo and, only when `HEAD` moved, rebuilds and atomically swaps the output directory. The Solid SPA keeps the remaining pages and loses all blog code.

**Tech Stack:** Astro 7.3.1 (`output: 'static'`, `base: '/blog'`, `build.format: 'file'`), `@astrojs/sitemap` 3.7.4, `@astrojs/rss` 4.0.19, `rehype-slug` 6.0.0, `rehype-autolink-headings` 7.1.0, Shiki (bundled with Astro), giscus, express 4, SolidJS 1.8 (existing SPA), Go reverse proxy (unchanged), yarn 1.22 workspaces, `node --test`.

**Spec:** `docs/superpowers/specs/2026-09-04-blog-overhaul-design.md`

## Global Constraints

- **Node ≥ 22.12.0.** Astro 7's `engines` field requires it and rejects odd majors like 23. Local machine has v24.19.0 active and v22.23.2 under nvm. The Docker image must move off `node:18` (Task 13).
- **No new test dependencies.** All tests use the built-in `node --test` runner and `node:assert/strict`.
- **Conventional commits.** `.husky/commit-msg` runs commitlint with `@commitlint/config-conventional`. Use `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- **`.husky/pre-commit` runs `npm test` then `yarn run prettier-format` (`prettier --write .`), which rewrites files across the whole repo on every commit.** Expect unrelated formatting churn to appear in `git status`; do not commit it — stage only the files each task names.
- **URLs stay extension-less:** `/blog`, `/blog/<slug>`, `/blog/tags/<tag>`. No trailing slashes, no redirect hops.
- **Article body column is 720px.** Breakpoints reuse the existing `global.css` scale: 1200 / 992 / 768 / 576. Do not introduce a new scale.
- **The Go reverse proxy gets no code changes.** `utils/url.go:14` keys on the first path segment, so every `/blog/**` path already resolves to `site-app-server`. Only `config/dev-links.yaml` changes (one line, Task 3).
- **Content repo:** `kyle-park-io/blog`, checked out at `~/code/blog`, public, GraphQL node id `R_kgDOK0SBsA`.
- **The blog repo's `md/` directory stays in place until Task 15.** The deployed image reads `md/` until the new image ships; deleting it early takes the live blog down. It is also the only rollback path — `push2gke_artifact.sh` deletes every previous image tag from Artifact Registry before pushing, so there is no earlier image to roll back to.
- **Do not rename anything to `static`.** The root `.gitignore:8` ignores `static` everywhere, which is why `packages/blog-backend/static` is untracked.

---

### Task 1: Shared shell package — nav data and design tokens

Creates the single source of truth for navigation, imported by both the Solid header (Task 2) and the Astro header (Task 4). Without it the two shells drift until Phase 2 deletes the Solid one.

**Files:**

- Create: `packages/site-shell/package.json`
- Create: `packages/site-shell/src/nav.ts`
- Create: `packages/site-shell/src/styles/tokens.css`
- Test: `packages/site-shell/__tests__/nav.test.mjs`

**Interfaces:**

- Consumes: nothing.
- Produces: `NavItem` (`{ label: string; href: string; variant?: string }`), `navItems: NavItem[]`, `offcanvasItems: NavItem[]`, and `packages/site-shell/src/styles/tokens.css`. Task 2 and Task 4 both import these.

- [ ] **Step 1: Write the failing test**

Create `packages/site-shell/__tests__/nav.test.mjs`:

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test packages/site-shell/__tests__/nav.test.mjs`
Expected: FAIL — `Cannot find module '../src/nav.ts'`.

(Node 22.18+ strips TypeScript types from `.ts` imports natively. If this Node build reports `Unknown file extension ".ts"`, add `--experimental-strip-types` to the command and to the package's `test` script.)

- [ ] **Step 3: Write the nav module**

Create `packages/site-shell/src/nav.ts`:

```typescript
export interface NavItem {
  label: string;
  href: string;
  /** Optional accent class suffix, e.g. `nyt-header__nav-link--devrel`. */
  variant?: 'devrel' | 'quant' | 'personal-quant';
}

/** Header navigation, in display order. */
export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'DevRel', href: '/devrel', variant: 'devrel' },
  { label: 'Quant', href: '/quant', variant: 'quant' },
  { label: 'P.Quant', href: '/personal-quant', variant: 'personal-quant' },
  { label: 'Profile', href: '/profile' },
];

/** Secondary destinations, shown in the offcanvas panel behind the ☰ button. */
export const offcanvasItems: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Chat', href: '/chat' },
];
```

- [ ] **Step 4: Write the package manifest**

Create `packages/site-shell/package.json`:

```json
{
  "name": "site-shell",
  "version": "0.1.0",
  "private": true,
  "description": "Navigation data and design tokens shared by the SPA and the Astro blog",
  "license": "ISC",
  "author": "kyle-park-io <andy3638@naver.com>",
  "main": "src/nav.ts",
  "types": "src/nav.ts",
  "scripts": {
    "test": "node --test __tests__/*.test.mjs"
  }
}
```

The root `package.json` already declares `workspaces: ["packages/*"]`, so no root change is needed.

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test packages/site-shell/__tests__/nav.test.mjs`
Expected: PASS, 4 tests.

- [ ] **Step 6: Extract the design tokens**

Create `packages/site-shell/src/styles/tokens.css` by copying the `:root` custom properties that the SPA already relies on, so the Astro pages inherit the same palette and type scale. Read `packages/blog-frontend/src/css/global.css` and `packages/blog-frontend/src/layout/Header.css` first and copy the actual values found there rather than inventing new ones. The file must define, at minimum:

```css
/* Shared design tokens — imported by both the Solid SPA and the Astro blog.
   Values are copied from blog-frontend/src/css/global.css; change them here. */
:root {
  /* palette */
  --shell-bg: #ffffff;
  --shell-fg: #121212;
  --shell-muted: #666666;
  --shell-rule: #e2e2e2;
  --shell-accent: #d0021b;

  /* type */
  --shell-serif: Georgia, 'Times New Roman', serif;
  --shell-sans:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  --shell-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* article measure — 720px is ~40-45 Korean characters per line */
  --shell-measure: 720px;
  --shell-toc-width: 240px;
}
```

If a token above already exists in `global.css` under a different name, keep the existing name in `global.css` and set the `--shell-*` token to the same literal value; do not rename existing SPA variables in this task.

- [ ] **Step 7: Run the workspace install so the symlink exists**

Run: `yarn install`
Expected: `site-shell` appears as a symlink at `node_modules/site-shell`.

- [ ] **Step 8: Commit**

```bash
git add packages/site-shell
git commit -m "feat: add site-shell package with shared nav and design tokens"
```

---

### Task 2: Solid header renders real links from the shared nav

Today every header item is `<button onClick={() => window.location.href = …}>`, so no crawler can follow the header to `/blog` and no reader can open a nav item in a new tab. This is half of what "make the blog a root entry point" means.

**Files:**

- Modify: `packages/blog-frontend/src/layout/Header.tsx:19-46` (handlers) and `:130-190` (nav markup)
- Modify: `packages/blog-frontend/src/components/offcanvas/Offcanvas.tsx`
- Modify: `packages/blog-frontend/src/layout/Header.css` (add `a` styling alongside the existing `button` rules)
- Modify: `packages/blog-frontend/package.json` (add the `site-shell` dependency)

**Interfaces:**

- Consumes: `navItems`, `offcanvasItems` from `site-shell/src/nav.ts` (Task 1).
- Produces: nothing new for later tasks.

- [ ] **Step 1: Add the dependency**

In `packages/blog-frontend/package.json`, add to `dependencies`:

```json
"site-shell": "*"
```

Then run `yarn install`.

- [ ] **Step 2: Replace the nav markup with links**

In `packages/blog-frontend/src/layout/Header.tsx`, delete `handleAboutClick`, `handleProfileClick`, `handleDevRelClick`, `handleQuantClick`, `handlePersonalQuantClick` and the `url` constant if it becomes unused, then replace the whole `<ul class="nyt-header__nav-list">` block with:

```tsx
<ul class="nyt-header__nav-list">
  <For each={navItems}>
    {(item) => (
      <li class="nyt-header__nav-item">
        <a
          href={item.href}
          class={
            item.variant !== undefined
              ? `nyt-header__nav-link nyt-header__nav-link--${item.variant}`
              : 'nyt-header__nav-link'
          }
        >
          {item.label}
        </a>
      </li>
    )}
  </For>
  <li class="nyt-header__nav-item">
    <button onClick={handleOpen} class="nyt-header__nav-link">
      ☰
    </button>
    <Move show={show()} onHide={handleClose}></Move>
  </li>
</ul>
```

Add the imports at the top of the file:

```tsx
import { For } from 'solid-js';
import { navItems } from 'site-shell/src/nav';
```

Leave the masthead logo buttons (`handleTitleClick`, `handleImageClick`) alone — they are handled in Step 4.

- [ ] **Step 3: Style anchors the same as the old buttons**

In `packages/blog-frontend/src/layout/Header.css`, find every selector that targets `.nyt-header__nav-link` and confirm it is element-agnostic. Where a rule is written as `button.nyt-header__nav-link` or relies on button defaults, add the anchor:

```css
a.nyt-header__nav-link {
  text-decoration: none;
  color: inherit;
  display: inline-block;
}
```

- [ ] **Step 4: Make the masthead logo a link too**

Replace the two logo buttons with anchors pointing at `/`:

```tsx
<a href="/" class="nyt-header__home-btn">
  <img src={HomeLogo} alt="Home" class="nyt-header__home-icon" />
</a>
```

```tsx
<a href="/" class="nyt-header__logo-btn">
  <span class="nyt-header__logo">
    <span class="nyt-header__logo-accent">KYLE PARK</span>
    <span class="nyt-header__logo-tagline">Personal Website</span>
  </span>
</a>
```

`handleTitleClick` and `handleImageClick` can now be deleted.

- [ ] **Step 5: Render the offcanvas items from the shared list**

Open `packages/blog-frontend/src/components/offcanvas/Offcanvas.tsx` and render `offcanvasItems` as anchors inside the panel, following whatever list markup the component already uses. Import with:

```tsx
import { offcanvasItems } from 'site-shell/src/nav';
```

- [ ] **Step 6: Verify the production build**

Run: `cd packages/blog-frontend && yarn webpack-build-prod`
Expected: build succeeds, `static/index.html` and `static/assets/*.blog.*.js` are produced.

`webpack.config.prod.js` transpiles `/\.tsx?$/` with `exclude: /node_modules/`. Webpack resolves the `site-shell` symlink to its real path (`packages/site-shell/src/nav.ts`), which does not match that exclude, so the `.ts` import is transpiled. If the build instead fails with an unexpected-token error, the symlink was not resolved: add `resolve: { symlinks: true }` to `webpack.config.prod.js` and re-run.

- [ ] **Step 7: Verify the links in a browser**

Run: `cd packages/blog-frontend && npx http-server static -p 4300`
Open `http://localhost:4300`, then:

1. Right-click "DevRel" → the browser offers "Open Link in New Tab" (it would not for a `<button>`).
2. Middle-click "Profile" → opens in a new tab.
3. Click "☰" → the offcanvas lists About and Chat.

- [ ] **Step 8: Commit**

```bash
git add packages/blog-frontend/src/layout/Header.tsx \
        packages/blog-frontend/src/layout/Header.css \
        packages/blog-frontend/src/components/offcanvas/Offcanvas.tsx \
        packages/blog-frontend/package.json
git commit -m "fix: make header navigation crawlable anchors from shared nav data"
```

---

### Task 3: Scaffold `packages/blog-site` and pin down the build output shape

Ends with `astro build` producing a real file on disk, and with the serve root recorded — Astro's `base` option affects URLs, and whether it also nests the output under `dist/blog/` must be observed rather than assumed, because express mounts that directory in Task 11.

**Files:**

- Create: `packages/blog-site/package.json`
- Create: `packages/blog-site/astro.config.mjs`
- Create: `packages/blog-site/tsconfig.json`
- Create: `packages/blog-site/.gitignore`
- Create: `packages/blog-site/src/config/site.ts`
- Create: `packages/blog-site/src/pages/index.astro` (placeholder, replaced in Task 6)
- Modify: `packages/ingress-reverse-proxy/config/dev-links.yaml:6-8`
- Modify: `.prettierrc` and root `package.json` (Astro formatting support)
- Test: `packages/blog-site/__tests__/build-output.test.mjs`

**Interfaces:**

- Consumes: nothing.
- Produces: `SITE_URL = 'https://jungho.dev'` and `BASE = '/blog'` from `src/config/site.ts`; a built `dist/` tree; the documented serve root for Task 11 and Task 12.

- [ ] **Step 1: Write the package manifest**

Create `packages/blog-site/package.json`:

```json
{
  "name": "blog-site",
  "version": "0.1.0",
  "private": true,
  "description": "Static blog at jungho.dev/blog",
  "license": "ISC",
  "author": "kyle-park-io <andy3638@naver.com>",
  "type": "module",
  "scripts": {
    "build": "astro build",
    "dev": "astro dev --port 4321",
    "preview": "astro preview --port 4321",
    "test": "node --test __tests__/*.test.mjs"
  },
  "dependencies": {
    "@astrojs/rss": "4.0.19",
    "@astrojs/sitemap": "3.7.4",
    "astro": "7.3.1",
    "rehype-autolink-headings": "7.1.0",
    "rehype-slug": "6.0.0",
    "sharp": "0.35.4",
    "site-shell": "*"
  }
}
```

Versions are pinned exactly: this package is installed inside the Docker image (Task 13), where a silent minor bump would change production output.

- [ ] **Step 2: Write the Astro config**

Create `packages/blog-site/astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  site: 'https://jungho.dev',
  base: '/blog',
  trailingSlash: 'never',
  output: 'static',
  build: {
    // `file` emits /blog/<slug>.html, which express serves with
    // `extensions: ['html']` — so URLs keep no trailing slash and no
    // directory redirect hop. `directory` would 301 /blog/x to /blog/x/.
    format: 'file',
  },
  integrations: [sitemap()],
  markdown: {
    // Shiki ships with Astro; `github-light` matches the site's light theme.
    shikiConfig: { theme: 'github-light', wrap: false },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: {
            class: 'heading-anchor',
            ariaHidden: 'true',
            tabIndex: -1,
          },
        },
      ],
    ],
  },
});
```

- [ ] **Step 3: Write the remaining scaffold files**

Create `packages/blog-site/tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "src/data"]
}
```

This deliberately does **not** extend the repo root `tsconfig.json`, which sets `module: commonjs` and `jsx: preserve` for Solid — both wrong for Astro.

Create `packages/blog-site/.gitignore`:

```
dist/
.astro/
# Content is rsynced in from the blog repo at build time (see build-blog.sh).
src/data/
```

Create `packages/blog-site/src/config/site.ts`:

```typescript
export const SITE_URL = 'https://jungho.dev';
export const BASE = '/blog';
export const AUTHOR = 'Kyle Park';
export const BLOG_TITLE = 'Kyle Park — Blog';
export const BLOG_DESCRIPTION =
  'Technical writings on blockchain, quant systems, and developer relations.';
export const CONTENT_REPO = 'kyle-park-io/blog';
```

Create `packages/blog-site/src/pages/index.astro` as a placeholder that Task 6 replaces:

```astro
---
import { BLOG_TITLE } from '../config/site';
---

<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>{BLOG_TITLE}</title>
  </head>
  <body>
    <h1>{BLOG_TITLE}</h1>
  </body>
</html>
```

- [ ] **Step 4: Install**

Run: `yarn install`
Expected: `packages/blog-site/node_modules` (or hoisted equivalents) contains `astro`.

If `sharp` fails to build, it means the platform has no prebuilt binary; run `yarn install --ignore-optional` is **not** an acceptable workaround — image optimization needs it. Install the platform build tools and retry.

- [ ] **Step 5: Write the failing build-output test**

Create `packages/blog-site/__tests__/build-output.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Directory that express mounts at /blog. Task 3 Step 7 records the answer. */
export const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';

test('the build produced a landing page', () => {
  const index = join(SERVE_ROOT, 'index.html');
  assert.ok(existsSync(index), `${index} missing — run \`yarn build\` first`);
  assert.match(readFileSync(index, 'utf8'), /Kyle Park/);
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `cd packages/blog-site && node --test __tests__/build-output.test.mjs`
Expected: FAIL — `dist/index.html missing — run yarn build first`.

- [ ] **Step 7: Build, then record the output shape**

Run: `cd packages/blog-site && yarn build && find dist -maxdepth 2 -name 'index.html'`

Write the observed path into a comment at the top of `astro.config.mjs`, for example:

```javascript
// Build output observed 2026-09-04 with astro 7.3.1: pages land at
// dist/index.html (base is applied to URLs, not to the output tree), so
// express mounts `dist` itself at /blog. build-blog.sh re-checks this.
```

If the build instead produced `dist/blog/index.html`, record that path instead. Both cases are handled by `SERVE_ROOT` in the test and by `build-blog.sh` in Task 12; the comment exists so the next reader does not have to re-derive it.

- [ ] **Step 8: Run the test to verify it passes**

Run: `cd packages/blog-site && node --test __tests__/build-output.test.mjs`
Expected: PASS.

- [ ] **Step 9: Point dev routing at the Astro dev server**

In `packages/ingress-reverse-proxy/config/dev-links.yaml`, change the `blog` entry:

```yaml
- name: blog
  route: /blog
  url: http://localhost:4321
```

Leave `blog-static` pointing at `http://localhost:3002` — that is still the SPA.

- [ ] **Step 10: Teach prettier about `.astro`**

`.husky/pre-commit` runs `prettier --write .` over the whole repo, so `.astro` files need a parser or the hook's behaviour on them is undefined.

Add to the root `package.json` `devDependencies`:

```json
"prettier-plugin-astro": "0.14.1"
```

Replace `.prettierrc` with:

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "plugins": ["prettier-plugin-astro"]
}
```

Run `yarn install`, then `yarn run prettier-format` and confirm it exits 0 and reports the `.astro` files as formatted.

- [ ] **Step 11: Commit**

```bash
git add packages/blog-site .prettierrc package.json \
        packages/ingress-reverse-proxy/config/dev-links.yaml
git commit -m "feat: scaffold blog-site astro package"
```

---

### Task 4: Astro shell — header, footer, and document head

The shell is authored once here; Phase 2 moves the SPA's remaining pages onto it and deletes the Solid copy. Because Astro is static, the nav is assertable in the built HTML — which is exactly the regression the SPA could not test in Task 2.

**Files:**

- Create: `packages/blog-site/src/components/Header.astro`
- Create: `packages/blog-site/src/components/Footer.astro`
- Create: `packages/blog-site/src/layouts/Shell.astro`
- Create: `packages/blog-site/src/styles/shell.css`
- Modify: `packages/blog-site/src/pages/index.astro`
- Test: `packages/blog-site/__tests__/shell.test.mjs`

**Interfaces:**

- Consumes: `navItems`, `offcanvasItems`, `tokens.css` (Task 1); `SITE_URL`, `BASE`, `BLOG_TITLE`, `BLOG_DESCRIPTION` (Task 3).
- Produces: `Shell.astro` with props `{ title: string; description: string; canonicalPath: string; ogType?: 'website' | 'article'; ogImage?: string; lang?: 'ko' | 'en' }`. Tasks 6, 7, 8 and 9 all render inside it.

- [ ] **Step 1: Write the failing test**

Create `packages/blog-site/__tests__/shell.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const html = () => readFileSync(join(SERVE_ROOT, 'index.html'), 'utf8');

test('header renders every nav item as a real anchor', () => {
  const page = html();
  for (const href of [
    '/',
    '/blog',
    '/devrel',
    '/quant',
    '/personal-quant',
    '/profile',
  ]) {
    assert.match(
      page,
      new RegExp(`href="${href.replace(/\//g, '\\/')}"`),
      `missing link to ${href}`,
    );
  }
});

test('head carries canonical, description and OG tags', () => {
  const page = html();
  assert.match(
    page,
    /<link rel="canonical" href="https:\/\/jungho\.dev\/blog"/,
  );
  assert.match(page, /<meta name="description" content="[^"]+"/);
  assert.match(page, /<meta property="og:title" content="[^"]+"/);
  assert.match(page, /<meta property="og:type" content="website"/);
  assert.match(page, /<meta name="twitter:card" content="summary_large_image"/);
});

test('document language is declared', () => {
  assert.match(html(), /<html lang="ko"/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/blog-site && yarn build && node --test __tests__/shell.test.mjs`
Expected: FAIL on the nav assertion — the placeholder page has no header.

- [ ] **Step 3: Write the header**

Create `packages/blog-site/src/components/Header.astro`:

```astro
---
import { navItems, offcanvasItems } from 'site-shell/src/nav';

interface Props {
  /** Path of the current page, used to mark the active nav item. */
  current?: string;
}

const { current = '/blog' } = Astro.props;
const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<header class="shell-header">
  <div class="shell-header__utility">
    <span class="shell-header__date">{today}</span>
  </div>

  <a href="/" class="shell-header__masthead">
    <span class="shell-header__logo">KYLE PARK</span>
    <span class="shell-header__tagline">Personal Website</span>
  </a>

  <nav class="shell-header__nav" aria-label="Main">
    <ul class="shell-header__nav-list">
      {
        navItems.map((item) => (
          <li class="shell-header__nav-item">
            <a
              href={item.href}
              class:list={[
                'shell-header__nav-link',
                item.variant && `shell-header__nav-link--${item.variant}`,
              ]}
              aria-current={item.href === current ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))
      }
      <li class="shell-header__nav-item">
        <details class="shell-header__more">
          <summary class="shell-header__nav-link" aria-label="More">☰</summary>
          <ul class="shell-header__more-list">
            {
              offcanvasItems.map((item) => (
                <li>
                  <a href={item.href} class="shell-header__nav-link">
                    {item.label}
                  </a>
                </li>
              ))
            }
          </ul>
        </details>
      </li>
    </ul>
  </nav>
</header>
```

The visitor-count WebSocket is deliberately omitted from the blog shell: it would add a socket connection to every article read for a number that belongs to the SPA's masthead. Phase 2 decides where it lives.

- [ ] **Step 4: Write the footer**

Create `packages/blog-site/src/components/Footer.astro`:

```astro
---
import { BASE, CONTENT_REPO } from '../config/site';
---

<footer class="shell-footer">
  <nav class="shell-footer__links" aria-label="Footer">
    <a href={`${BASE}/rss.xml`}>RSS</a>
    <a href="https://github.com/kyle-park-io">GitHub</a>
    <a href="https://www.linkedin.com/in/kyle-park-io">LinkedIn</a>
    <a href="https://x.com/bcd_kyle">X</a>
    <a href={`https://github.com/${CONTENT_REPO}`}>Source</a>
  </nav>
  <p class="shell-footer__copy">© {new Date().getFullYear()} Kyle Park</p>
</footer>
```

- [ ] **Step 5: Write the shell layout**

Create `packages/blog-site/src/layouts/Shell.astro`:

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { SITE_URL, BLOG_TITLE } from '../config/site';
import 'site-shell/src/styles/tokens.css';
import '../styles/shell.css';

interface Props {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. `/blog/ethereum-event-object`. */
  canonicalPath: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  lang?: 'ko' | 'en';
  current?: string;
}

const {
  title,
  description,
  canonicalPath,
  ogType = 'website',
  ogImage,
  lang = 'ko',
  current,
} = Astro.props;

const canonical = new URL(canonicalPath, SITE_URL).href;
const absoluteOgImage = ogImage ? new URL(ogImage, SITE_URL).href : undefined;
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    <meta property="og:site_name" content={BLOG_TITLE} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={ogType} />
    <meta property="og:url" content={canonical} />
    {absoluteOgImage && <meta property="og:image" content={absoluteOgImage} />}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {absoluteOgImage && <meta name="twitter:image" content={absoluteOgImage} />}

    <link
      rel="alternate"
      type="application/rss+xml"
      title={BLOG_TITLE}
      href="/blog/rss.xml"
    />
  </head>
  <body class="shell-body">
    <Header current={current} />
    <main class="shell-main">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 6: Write the shell stylesheet**

Create `packages/blog-site/src/styles/shell.css`. Read `packages/blog-frontend/src/layout/Header.css` and `Footer.css` and mirror their visual result — centred masthead, thin rules, serif logo — using the `--shell-*` tokens. The file must at minimum reset the body, centre the masthead, lay the nav out horizontally with wrapping below 768px, and style `details.shell-header__more` so its `summary` shows no default marker:

```css
.shell-body {
  margin: 0;
  background: var(--shell-bg);
  color: var(--shell-fg);
  font-family: var(--shell-sans);
}

.shell-header {
  border-bottom: 1px solid var(--shell-rule);
}

.shell-header__masthead {
  display: block;
  text-align: center;
  padding: 1rem 0 0.5rem;
  text-decoration: none;
  color: inherit;
}

.shell-header__logo {
  display: block;
  font-family: var(--shell-serif);
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  letter-spacing: 0.14em;
}

.shell-header__nav-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 1.25rem;
  margin: 0;
  padding: 0.5rem 1rem;
  list-style: none;
  border-top: 1px solid var(--shell-rule);
}

.shell-header__nav-link {
  color: inherit;
  text-decoration: none;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.shell-header__nav-link[aria-current='page'] {
  border-bottom: 2px solid var(--shell-accent);
}

.shell-header__more > summary {
  list-style: none;
}

.shell-header__more > summary::-webkit-details-marker {
  display: none;
}

.shell-header__more-list {
  position: absolute;
  margin: 0.5rem 0 0;
  padding: 0.5rem 1rem;
  list-style: none;
  background: var(--shell-bg);
  border: 1px solid var(--shell-rule);
}

.shell-main {
  padding: 0 1rem;
}

.shell-footer {
  border-top: 1px solid var(--shell-rule);
  margin-top: 4rem;
  padding: 1.5rem 1rem;
  text-align: center;
}

.shell-footer__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.shell-footer__links a {
  color: var(--shell-muted);
  font-size: 0.8125rem;
  text-decoration: none;
}

.shell-footer__copy {
  color: var(--shell-muted);
  font-size: 0.75rem;
}
```

- [ ] **Step 7: Put the placeholder page inside the shell**

Replace `packages/blog-site/src/pages/index.astro`:

```astro
---
import Shell from '../layouts/Shell.astro';
import { BLOG_TITLE, BLOG_DESCRIPTION } from '../config/site';
---

<Shell
  title={BLOG_TITLE}
  description={BLOG_DESCRIPTION}
  canonicalPath="/blog"
  current="/blog"
>
  <h1>{BLOG_TITLE}</h1>
</Shell>
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `cd packages/blog-site && yarn build && node --test __tests__/shell.test.mjs`
Expected: PASS, 3 tests.

- [ ] **Step 9: Commit**

```bash
git add packages/blog-site
git commit -m "feat: add astro shell layout with crawlable nav and OG metadata"
```

---

### Task 5: Content collection, frontmatter schema, and pure post helpers

Replaces `head -n 1 | cut -c 3-` for titles and `git log -1 --format=%ci` for dates with validated frontmatter. The list/tag/RSS logic is split into pure functions so it is testable without booting Astro.

**Files:**

- Create: `packages/blog-site/src/content.config.ts`
- Create: `packages/blog-site/src/lib/posts.ts`
- Create: `packages/blog-site/src/lib/reading-time.ts`
- Create: `packages/blog-site/src/data/posts/hello-world/index.md` (fixture; `src/data/` is gitignored)
- Create: `packages/blog-site/src/data/posts/second-post/index.md` (fixture)
- Test: `packages/blog-site/__tests__/posts.test.mjs`
- Test: `packages/blog-site/__tests__/reading-time.test.mjs`
- Test: `packages/blog-site/__tests__/schema.test.mjs`

**Interfaces:**

- Consumes: nothing from earlier tasks.
- Produces:
  - `content.config.ts` exporting `collections = { posts }`; entry ids equal the post directory name.
  - `src/lib/posts.ts`: `interface PostLike { id: string; data: { date: Date; draft: boolean; tags: string[]; title: string } }`, `sortByDateDesc<T extends PostLike>(posts: T[]): T[]`, `excludeDrafts<T extends PostLike>(posts: T[], includeDrafts: boolean): T[]`, `tagCounts<T extends PostLike>(posts: T[]): Array<{ tag: string; count: number }>`, `postsWithTag<T extends PostLike>(posts: T[], tag: string): T[]`.
  - `src/lib/reading-time.ts`: `readingMinutes(markdown: string): number`.

- [ ] **Step 1: Write the failing reading-time test**

Create `packages/blog-site/__tests__/reading-time.test.mjs`:

````javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readingMinutes } from '../src/lib/reading-time.ts';

test('500 characters is one minute', () => {
  assert.equal(readingMinutes('가'.repeat(500)), 1);
});

test('rounds up to the next minute', () => {
  assert.equal(readingMinutes('가'.repeat(501)), 2);
});

test('never returns zero for a short post', () => {
  assert.equal(readingMinutes('짧다'), 1);
});

test('fenced code blocks do not count', () => {
  const md = '가'.repeat(100) + '\n\n```js\n' + 'x'.repeat(5000) + '\n```\n';
  assert.equal(readingMinutes(md), 1);
});

test('whitespace does not count', () => {
  assert.equal(readingMinutes('가 '.repeat(500)), 1);
});
````

- [ ] **Step 2: Run it to verify it fails**

Run: `cd packages/blog-site && node --test __tests__/reading-time.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement reading-time**

Create `packages/blog-site/src/lib/reading-time.ts`:

````typescript
const CHARS_PER_MINUTE = 500;

/**
 * Approximate reading time in minutes.
 *
 * Counts non-whitespace characters outside fenced code blocks. Word counting
 * is meaningless for Korean, which is the language most posts are written in.
 */
export function readingMinutes(markdown: string): number {
  const prose = markdown.replace(/```[\s\S]*?```/g, '');
  const chars = prose.replace(/\s+/g, '').length;
  return Math.max(1, Math.ceil(chars / CHARS_PER_MINUTE));
}
````

- [ ] **Step 4: Run it to verify it passes**

Run: `cd packages/blog-site && node --test __tests__/reading-time.test.mjs`
Expected: PASS, 5 tests.

- [ ] **Step 5: Write the failing posts-helper test**

Create `packages/blog-site/__tests__/posts.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sortByDateDesc,
  excludeDrafts,
  tagCounts,
  postsWithTag,
} from '../src/lib/posts.ts';

const post = (id, date, tags, draft = false) => ({
  id,
  data: { title: id, date: new Date(date), tags, draft },
});

const fixture = [
  post('old', '2023-12-01', ['ethereum']),
  post('new', '2024-09-05', ['ethereum', 'tooling']),
  post('middle', '2024-01-15', ['tooling']),
  post('hidden', '2026-01-01', ['tooling'], true),
];

test('sorts newest first', () => {
  assert.deepEqual(
    sortByDateDesc(fixture.filter((p) => !p.data.draft)).map((p) => p.id),
    ['new', 'middle', 'old'],
  );
});

test('sorting does not mutate the input', () => {
  const input = [...fixture];
  sortByDateDesc(input);
  assert.equal(input[0].id, 'old');
});

test('drafts are excluded unless explicitly included', () => {
  assert.deepEqual(
    excludeDrafts(fixture, false).map((p) => p.id),
    ['old', 'new', 'middle'],
  );
  assert.equal(excludeDrafts(fixture, true).length, 4);
});

test('tag counts are sorted by count then alphabetically', () => {
  assert.deepEqual(tagCounts(excludeDrafts(fixture, false)), [
    { tag: 'ethereum', count: 2 },
    { tag: 'tooling', count: 2 },
  ]);
});

test('postsWithTag filters and keeps newest first', () => {
  assert.deepEqual(
    postsWithTag(excludeDrafts(fixture, false), 'tooling').map((p) => p.id),
    ['new', 'middle'],
  );
});

test('postsWithTag returns empty for an unknown tag', () => {
  assert.deepEqual(postsWithTag(fixture, 'nope'), []);
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `cd packages/blog-site && node --test __tests__/posts.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement the post helpers**

Create `packages/blog-site/src/lib/posts.ts`:

```typescript
export interface PostLike {
  id: string;
  data: {
    title: string;
    date: Date;
    tags: string[];
    draft: boolean;
  };
}

/** Newest first. Returns a new array; does not mutate the input. */
export function sortByDateDesc<T extends PostLike>(posts: T[]): T[] {
  return [...posts].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

/** Drafts are visible in `astro dev` and hidden in production builds. */
export function excludeDrafts<T extends PostLike>(
  posts: T[],
  includeDrafts: boolean,
): T[] {
  return includeDrafts ? posts : posts.filter((p) => !p.data.draft);
}

/** Descending by count, then alphabetical, so the tag bar is stable. */
export function tagCounts<T extends PostLike>(
  posts: T[],
): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function postsWithTag<T extends PostLike>(posts: T[], tag: string): T[] {
  return sortByDateDesc(posts.filter((p) => p.data.tags.includes(tag)));
}
```

- [ ] **Step 8: Run it to verify it passes**

Run: `cd packages/blog-site && node --test __tests__/posts.test.mjs`
Expected: PASS, 6 tests.

- [ ] **Step 9: Write the content collection**

Create `packages/blog-site/src/content.config.ts`:

```typescript
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/data/posts',
    // Without this the id would be `<slug>/index`; the slug is the directory.
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      summary: z.string().min(1),
      tags: z.array(
        z
          .string()
          .regex(
            /^[a-z0-9]+(-[a-z0-9]+)*$/,
            'tags must be lowercase kebab-case',
          ),
      ),
      cover: image().optional(),
      draft: z.boolean().default(false),
      lang: z.enum(['ko', 'en']).default('ko'),
    }),
});

export const collections = { posts };
```

- [ ] **Step 10: Add the fixtures**

Create `packages/blog-site/src/data/posts/hello-world/index.md`:

````markdown
---
title: 첫 번째 글
date: 2024-09-05
summary: 스키마와 목차 렌더링을 확인하기 위한 픽스처 글입니다.
tags: [tooling, astro]
lang: ko
---

본문 첫 단락입니다.

## 첫 번째 절

내용.

## 두 번째 절

내용.

### 하위 절

내용.

```js
const answer = 42;
```
````

````

Create `packages/blog-site/src/data/posts/second-post/index.md`:

```markdown
---
title: 두 번째 글
date: 2023-12-01
summary: 목차가 렌더되지 않는 짧은 글 픽스처입니다.
tags: [ethereum]
lang: ko
---

제목이 두 개 미만이라 목차 블록이 렌더되지 않아야 합니다.

## 하나뿐인 절

내용.
````

These live under the gitignored `src/data/`, so they exist only on the machine running the build. Task 12's `build-blog.sh` overwrites the directory with the real content repo. Re-create them with this exact content whenever the tests need them.

- [ ] **Step 11: Write the schema-rejection test**

Create `packages/blog-site/__tests__/schema.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';

const BAD_DIR = 'src/data/posts/__schema-probe';

const build = () => {
  try {
    execFileSync('yarn', ['build'], { encoding: 'utf8', stdio: 'pipe' });
    return { ok: true, output: '' };
  } catch (err) {
    return { ok: false, output: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
};

test('a post missing `summary` fails the build', () => {
  mkdirSync(BAD_DIR, { recursive: true });
  writeFileSync(
    `${BAD_DIR}/index.md`,
    '---\ntitle: 누락\ndate: 2026-01-01\ntags: []\n---\n\n본문\n',
  );
  try {
    const result = build();
    assert.equal(result.ok, false, 'build should have failed');
    assert.match(result.output, /summary/);
  } finally {
    rmSync(BAD_DIR, { recursive: true, force: true });
  }
});

test('an uppercase tag fails the build', () => {
  mkdirSync(BAD_DIR, { recursive: true });
  writeFileSync(
    `${BAD_DIR}/index.md`,
    '---\ntitle: 대문자\ndate: 2026-01-01\nsummary: 요약\ntags: [Ethereum]\n---\n\n본문\n',
  );
  try {
    const result = build();
    assert.equal(result.ok, false, 'build should have failed');
    assert.match(result.output, /kebab-case|tags/);
  } finally {
    rmSync(BAD_DIR, { recursive: true, force: true });
  }
});

test('the valid fixtures build cleanly', () => {
  assert.equal(build().ok, true);
});
```

- [ ] **Step 12: Run it to verify the schema is enforced**

Run: `cd packages/blog-site && node --test __tests__/schema.test.mjs`
Expected: PASS, 3 tests. Each build takes a few seconds, so this file is slower than the others.

- [ ] **Step 13: Commit**

```bash
git add packages/blog-site/src/content.config.ts \
        packages/blog-site/src/lib \
        packages/blog-site/__tests__
git commit -m "feat: add blog content collection schema and post helpers"
```

---

### Task 6: List page with tag bar and cover-conditional featured block

One template, two states — a cover turns the newest post into a featured block; without one it is just the first index row. This is what removes the bet on whether cover images will keep being made.

**Files:**

- Modify: `packages/blog-site/src/pages/index.astro`
- Create: `packages/blog-site/src/components/PostIndexRow.astro`
- Create: `packages/blog-site/src/components/FeaturedPost.astro`
- Create: `packages/blog-site/src/components/TagBar.astro`
- Create: `packages/blog-site/src/styles/list.css`
- Test: `packages/blog-site/__tests__/list-page.test.mjs`

**Interfaces:**

- Consumes: `Shell.astro` (Task 4); `sortByDateDesc`, `excludeDrafts`, `tagCounts` (Task 5); the `posts` collection (Task 5).
- Produces: `PostIndexRow.astro` with props `{ post: CollectionEntry<'posts'>; index: number }`; `FeaturedPost.astro` with props `{ post: CollectionEntry<'posts'> }`; `TagBar.astro` with props `{ tags: Array<{ tag: string; count: number }>; active?: string }`. Task 8's tag pages reuse `PostIndexRow` and `TagBar`.

- [ ] **Step 1: Write the failing test**

Create `packages/blog-site/__tests__/list-page.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const html = () => readFileSync(join(SERVE_ROOT, 'index.html'), 'utf8');

test('lists both fixture posts, newest first', () => {
  const page = html();
  const first = page.indexOf('첫 번째 글');
  const second = page.indexOf('두 번째 글');
  assert.ok(first > -1 && second > -1, 'both titles must appear');
  assert.ok(first < second, '2024 post must precede the 2023 post');
});

test('each row links to the extension-less post URL', () => {
  assert.match(html(), /href="\/blog\/hello-world"/);
});

test('rows carry summary, date and tags', () => {
  const page = html();
  assert.match(page, /스키마와 목차 렌더링을 확인하기 위한 픽스처 글입니다/);
  assert.match(page, /2024/);
  assert.match(page, /href="\/blog\/tags\/tooling"/);
});

test('no featured block while no post has a cover', () => {
  assert.ok(
    !html().includes('data-featured'),
    'featured block must not render',
  );
});

test('the RSS link is exposed on the list page', () => {
  assert.match(html(), /href="\/blog\/rss\.xml"/);
});

test('no pagination controls', () => {
  const page = html();
  assert.ok(!page.includes('«'), 'pagination was removed');
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd packages/blog-site && yarn build && node --test __tests__/list-page.test.mjs`
Expected: FAIL — the placeholder page has no post titles.

- [ ] **Step 3: Write the index row**

Create `packages/blog-site/src/components/PostIndexRow.astro`:

```astro
---
import type { CollectionEntry } from 'astro:content';
import { BASE } from '../config/site';

interface Props {
  post: CollectionEntry<'posts'>;
  index: number;
}

const { post, index } = Astro.props;
const iso = post.data.date.toISOString().slice(0, 10);
const shown = post.data.date.toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Seoul',
});
---

<article class="post-row">
  <span class="post-row__number">{String(index + 1).padStart(2, '0')}</span>
  <div class="post-row__body">
    <h2 class="post-row__title">
      <a href={`${BASE}/${post.id}`}>{post.data.title}</a>
    </h2>
    <p class="post-row__summary">{post.data.summary}</p>
    <div class="post-row__meta">
      <time datetime={iso}>{shown}</time>
      {post.data.lang === 'en' && <span class="post-row__lang">EN</span>}
      <ul class="post-row__tags">
        {
          post.data.tags.map((tag) => (
            <li>
              <a href={`${BASE}/tags/${tag}`}>#{tag}</a>
            </li>
          ))
        }
      </ul>
    </div>
  </div>
</article>
```

- [ ] **Step 4: Write the featured block**

Create `packages/blog-site/src/components/FeaturedPost.astro`:

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import { BASE } from '../config/site';

interface Props {
  post: CollectionEntry<'posts'>;
}

const { post } = Astro.props;
const iso = post.data.date.toISOString().slice(0, 10);
---

<article class="featured" data-featured>
  {
    post.data.cover && (
      <a href={`${BASE}/${post.id}`} class="featured__image">
        <Image
          src={post.data.cover}
          alt=""
          widths={[480, 960]}
          loading="eager"
        />
      </a>
    )
  }
  <div class="featured__body">
    <span class="featured__label">LATEST</span>
    <h2 class="featured__title">
      <a href={`${BASE}/${post.id}`}>{post.data.title}</a>
    </h2>
    <p class="featured__summary">{post.data.summary}</p>
    <time datetime={iso}>{iso}</time>
  </div>
</article>
```

- [ ] **Step 5: Write the tag bar**

Create `packages/blog-site/src/components/TagBar.astro`:

```astro
---
import { BASE } from '../config/site';

interface Props {
  tags: Array<{ tag: string; count: number }>;
  active?: string;
}

const { tags, active } = Astro.props;
---

<nav class="tag-bar" aria-label="Tags">
  <a
    href={BASE}
    class:list={['tag-bar__item', !active && 'tag-bar__item--active']}
  >
    All
  </a>
  {
    tags.map(({ tag, count }) => (
      <a
        href={`${BASE}/tags/${tag}`}
        class:list={[
          'tag-bar__item',
          active === tag && 'tag-bar__item--active',
        ]}
      >
        #{tag} <span class="tag-bar__count">{count}</span>
      </a>
    ))
  }
</nav>
```

- [ ] **Step 6: Write the list page**

Replace `packages/blog-site/src/pages/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Shell from '../layouts/Shell.astro';
import PostIndexRow from '../components/PostIndexRow.astro';
import FeaturedPost from '../components/FeaturedPost.astro';
import TagBar from '../components/TagBar.astro';
import { sortByDateDesc, excludeDrafts, tagCounts } from '../lib/posts';
import { BASE, BLOG_TITLE, BLOG_DESCRIPTION } from '../config/site';
import '../styles/list.css';

const all = excludeDrafts(await getCollection('posts'), import.meta.env.DEV);
const posts = sortByDateDesc(all);
const tags = tagCounts(all);

// A cover on the newest post promotes it to a featured block; without one the
// page is a plain index. This is why a cover is a bonus, not a requirement.
const featured = posts[0]?.data.cover ? posts[0] : undefined;
const rows = featured ? posts.slice(1) : posts;
---

<Shell
  title={BLOG_TITLE}
  description={BLOG_DESCRIPTION}
  canonicalPath={BASE}
  current={BASE}
>
  <div class="list-page">
    <header class="list-header">
      <h1 class="list-header__title">Blog</h1>
      <p class="list-header__subtitle">{BLOG_DESCRIPTION}</p>
      <a class="list-header__rss" href={`${BASE}/rss.xml`}>RSS</a>
    </header>

    <TagBar tags={tags} />

    {featured && <FeaturedPost post={featured} />}

    <div class="post-list">
      {
        rows.map((post, i) => (
          <PostIndexRow post={post} index={featured ? i + 1 : i} />
        ))
      }
    </div>

    {
      posts.length === 0 && (
        <p class="post-list__empty">아직 발행한 글이 없습니다.</p>
      )
    }
  </div>
</Shell>
```

- [ ] **Step 7: Write the list stylesheet**

Create `packages/blog-site/src/styles/list.css`:

```css
.list-page {
  max-width: calc(var(--shell-measure) + var(--shell-toc-width) + 2rem);
  margin: 0 auto;
  padding: 2rem 0 0;
}

.list-header__title {
  font-family: var(--shell-serif);
  font-size: clamp(2rem, 6vw, 3rem);
  margin: 0;
}

.list-header__subtitle {
  color: var(--shell-muted);
  margin: 0.5rem 0 1rem;
}

.list-header__rss {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: var(--shell-accent);
  text-decoration: none;
}

.tag-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--shell-rule);
}

.tag-bar__item {
  border: 1px solid var(--shell-rule);
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: var(--shell-muted);
  text-decoration: none;
}

.tag-bar__item--active {
  border-color: var(--shell-fg);
  color: var(--shell-fg);
}

.tag-bar__count {
  color: var(--shell-muted);
  font-size: 0.6875rem;
}

.featured {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--shell-rule);
}

.featured__image {
  flex: 1 1 280px;
  max-width: 42%;
}

.featured__image img {
  width: 100%;
  height: auto;
  display: block;
}

.featured__body {
  flex: 1 1 320px;
}

.featured__label {
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  color: var(--shell-accent);
}

.featured__title {
  font-family: var(--shell-serif);
  font-size: 1.75rem;
  margin: 0.25rem 0 0.5rem;
}

.post-row {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--shell-rule);
}

.post-row__number {
  flex: none;
  width: 2rem;
  color: var(--shell-muted);
  font-size: 0.75rem;
  padding-top: 0.4rem;
}

.post-row__title {
  font-family: var(--shell-serif);
  font-size: 1.25rem;
  margin: 0;
}

.post-row__title a,
.featured__title a {
  color: inherit;
  text-decoration: none;
}

.post-row__summary {
  color: var(--shell-muted);
  margin: 0.375rem 0;
}

.post-row__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--shell-muted);
}

.post-row__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.post-row__tags a {
  color: var(--shell-muted);
  text-decoration: none;
}

.post-row__lang {
  border: 1px solid var(--shell-rule);
  padding: 0 0.25rem;
  font-size: 0.625rem;
}

@media (max-width: 576px) {
  .post-row__number {
    display: none;
  }

  .featured__image {
    max-width: 100%;
  }
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `cd packages/blog-site && yarn build && node --test __tests__/list-page.test.mjs`
Expected: PASS, 6 tests.

- [ ] **Step 9: Verify the featured state, then restore**

Add a cover to the newest fixture so the other branch is exercised:

```bash
cd packages/blog-site
cp ../ingress-reverse-proxy/public/blog-bg.jpg src/data/posts/hello-world/cover.jpg
sed -i 's/^lang: ko$/lang: ko\ncover: .\/cover.jpg/' src/data/posts/hello-world/index.md
yarn build
grep -c 'data-featured' dist/index.html   # expect 1
grep -c 'post-row' dist/index.html        # expect the remaining rows only
```

Then revert the fixture:

```bash
git checkout -- src/data/posts/hello-world/index.md 2>/dev/null || \
  sed -i '/^cover: \.\/cover\.jpg$/d' src/data/posts/hello-world/index.md
rm src/data/posts/hello-world/cover.jpg
yarn build
```

(`src/data/` is gitignored, so `git checkout` will not restore it — use the `sed` deletion.)

- [ ] **Step 10: Commit**

```bash
git add packages/blog-site/src/pages/index.astro \
        packages/blog-site/src/components \
        packages/blog-site/src/styles/list.css \
        packages/blog-site/__tests__/list-page.test.mjs
git commit -m "feat: add blog list page with tag bar and cover-conditional featured post"
```

---

### Task 7: Article page — table of contents, progress bar, raw markdown

**Files:**

- Create: `packages/blog-site/src/pages/[slug].astro`
- Create: `packages/blog-site/src/pages/[slug].md.ts`
- Create: `packages/blog-site/src/components/Toc.astro`
- Create: `packages/blog-site/src/components/ProgressBar.astro`
- Create: `packages/blog-site/src/styles/post.css`
- Test: `packages/blog-site/__tests__/post-page.test.mjs`

**Interfaces:**

- Consumes: `Shell.astro` (Task 4); `readingMinutes`, `excludeDrafts` and the `posts` collection (Task 5).
- Produces: `Toc.astro` with props `{ headings: Array<{ depth: number; slug: string; text: string }> }`, which renders nothing when fewer than 3 h2/h3 headings survive filtering. Task 9 mounts giscus inside `[slug].astro`.

- [ ] **Step 1: Write the failing test**

Create `packages/blog-site/__tests__/post-page.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const read = (file) => readFileSync(join(SERVE_ROOT, file), 'utf8');

test('a post is emitted as an extension-less-servable html file', () => {
  assert.ok(existsSync(join(SERVE_ROOT, 'hello-world.html')));
  assert.ok(existsSync(join(SERVE_ROOT, 'second-post.html')));
});

test('the article carries its own canonical, OG type and language', () => {
  const page = read('hello-world.html');
  assert.match(
    page,
    /<link rel="canonical" href="https:\/\/jungho\.dev\/blog\/hello-world"/,
  );
  assert.match(page, /<meta property="og:type" content="article"/);
  assert.match(page, /<title>첫 번째 글/);
});

test('headings get ids and anchor links', () => {
  const page = read('hello-world.html');
  assert.match(page, /id="첫-번째-절"|id="[^"]+"[^>]*>\s*첫 번째 절/);
  assert.match(page, /class="heading-anchor"/);
});

test('a table of contents renders for a post with 3+ headings', () => {
  const page = read('hello-world.html');
  assert.match(page, /class="toc"/);
  assert.match(page, /href="#/);
});

test('no table of contents for a post with fewer than 3 headings', () => {
  assert.ok(!read('second-post.html').includes('class="toc"'));
});

test('code blocks are highlighted by shiki and horizontally scrollable', () => {
  const page = read('hello-world.html');
  assert.match(page, /class="astro-code/);
  assert.match(page, /class="code-scroll"/);
});

test('reading time is shown', () => {
  assert.match(read('hello-world.html'), /약 \d+분/);
});

test('the raw markdown is downloadable', () => {
  assert.ok(existsSync(join(SERVE_ROOT, 'hello-world.md')));
  assert.match(
    readFileSync(join(SERVE_ROOT, 'hello-world.md'), 'utf8'),
    /첫 번째 절/,
  );
});

test('a scroll progress bar is present', () => {
  assert.match(read('hello-world.html'), /class="progress-bar"/);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd packages/blog-site && yarn build && node --test __tests__/post-page.test.mjs`
Expected: FAIL — `dist/hello-world.html` does not exist.

- [ ] **Step 3: Write the table of contents**

Create `packages/blog-site/src/components/Toc.astro`:

```astro
---
export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: Heading[];
}

const { headings } = Astro.props;

// h2 and h3 only; deeper levels make the rail unreadable on a phone.
const entries = headings.filter((h) => h.depth === 2 || h.depth === 3);
// Below 3 entries a table of contents is noise, and on desktop it would leave
// an empty rail beside the article.
const show = entries.length >= 3;
---

{
  show && (
    <aside class="toc" aria-label="목차">
      <details class="toc__details" open>
        <summary class="toc__summary">목차</summary>
        <ol class="toc__list">
          {entries.map((h) => (
            <li class:list={['toc__item', `toc__item--h${h.depth}`]}>
              <a class="toc__link" href={`#${h.slug}`} data-toc-link={h.slug}>
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </aside>
  )
}

<script>
  // Scroll spy + close the collapsed panel after a jump.
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'),
  );
  if (links.length > 0) {
    const bySlug = new Map(links.map((a) => [a.dataset.tocLink, a]));
    const targets = links
      .map((a) => document.getElementById(a.dataset.tocLink ?? ''))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (!record.isIntersecting) continue;
          for (const link of links) link.removeAttribute('aria-current');
          bySlug.get(record.target.id)?.setAttribute('aria-current', 'true');
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    for (const target of targets) observer.observe(target);

    const details = document.querySelector<HTMLDetailsElement>('.toc__details');
    const collapsed = () => window.matchMedia('(max-width: 1199px)').matches;
    for (const link of links) {
      link.addEventListener('click', () => {
        if (details && collapsed()) details.open = false;
      });
    }
  }
</script>
```

- [ ] **Step 4: Write the progress bar**

Create `packages/blog-site/src/components/ProgressBar.astro`:

```astro
---

---

<div
  class="progress-bar"
  role="progressbar"
  aria-label="읽기 진행률"
  aria-valuemin="0"
  aria-valuemax="100"
>
  <div class="progress-bar__fill" data-progress-fill></div>
</div>

<script>
  const fill = document.querySelector<HTMLElement>('[data-progress-fill]');
  const bar = document.querySelector<HTMLElement>('.progress-bar');
  if (fill && bar) {
    let queued = false;
    const update = (): void => {
      queued = false;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      const pct = Math.min(100, Math.max(0, Math.round(ratio * 100)));
      fill.style.width = `${pct}%`;
      bar.setAttribute('aria-valuenow', String(pct));
    };
    const onScroll = (): void => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }
</script>
```

- [ ] **Step 5: Write the article page**

Create `packages/blog-site/src/pages/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import { Image } from 'astro:assets';
import Shell from '../layouts/Shell.astro';
import Toc from '../components/Toc.astro';
import ProgressBar from '../components/ProgressBar.astro';
import { excludeDrafts } from '../lib/posts';
import { readingMinutes } from '../lib/reading-time';
import { BASE } from '../config/site';
import '../styles/post.css';

export async function getStaticPaths() {
  const posts = excludeDrafts(
    await getCollection('posts'),
    import.meta.env.DEV,
  );
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content, headings } = await render(post);
const minutes = readingMinutes(post.body ?? '');
const iso = post.data.date.toISOString().slice(0, 10);
const shown = post.data.date.toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Seoul',
});
const updatedShown = post.data.updated
  ? post.data.updated.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Seoul',
    })
  : undefined;
---

<Shell
  title={`${post.data.title} — Kyle Park`}
  description={post.data.summary}
  canonicalPath={`${BASE}/${post.id}`}
  ogType="article"
  ogImage={post.data.cover?.src}
  lang={post.data.lang}
  current={BASE}
>
  <ProgressBar />

  <div class="post-page">
    <article class="post" lang={post.data.lang}>
      <header class="post__header">
        <h1 class="post__title">{post.data.title}</h1>
        <p class="post__meta">
          <time datetime={iso}>{shown}</time>
          <span class="post__dot">·</span>
          <span>약 {minutes}분</span>
          {updatedShown && <span class="post__dot">·</span>}
          {updatedShown && <span>수정: {updatedShown}</span>}
        </p>
        <ul class="post__tags">
          {
            post.data.tags.map((tag) => (
              <li>
                <a href={`${BASE}/tags/${tag}`}>#{tag}</a>
              </li>
            ))
          }
        </ul>
      </header>

      {
        post.data.cover && (
          <figure class="post__cover">
            <Image
              src={post.data.cover}
              alt=""
              widths={[720, 1440]}
              loading="eager"
            />
          </figure>
        )
      }

      <div class="post__content">
        <Content />
      </div>

      <footer class="post__footer">
        <a class="post__download" href={`${BASE}/${post.id}.md`} download>
          원문 마크다운 내려받기
        </a>
        <a class="post__back" href={BASE}>← 글 목록</a>
      </footer>
    </article>

    <Toc headings={headings} />
  </div>
</Shell>
```

- [ ] **Step 6: Write the raw-markdown endpoint**

Create `packages/blog-site/src/pages/[slug].md.ts`:

```typescript
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
```

- [ ] **Step 7: Write the article stylesheet**

Create `packages/blog-site/src/styles/post.css`:

```css
.progress-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 3px;
  background: transparent;
}

.progress-bar__fill {
  height: 100%;
  width: 0;
  background: var(--shell-accent);
}

/* Article + table of contents are centred as a group, so the body does not
   read as left-shifted on a wide screen. */
.post-page {
  display: flex;
  gap: 2rem;
  justify-content: center;
  max-width: calc(var(--shell-measure) + var(--shell-toc-width) + 2rem);
  margin: 0 auto;
  padding: 2rem 0 0;
}

.post {
  flex: 1 1 auto;
  min-width: 0;
  max-width: var(--shell-measure);
}

.post__title {
  font-family: var(--shell-serif);
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  line-height: 1.2;
  margin: 0 0 0.75rem;
}

.post__meta {
  color: var(--shell-muted);
  font-size: 0.8125rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
}

.post__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 0.75rem 0 0;
  list-style: none;
  font-size: 0.75rem;
}

.post__tags a {
  color: var(--shell-muted);
  text-decoration: none;
}

.post__cover img,
.post__content img {
  width: 100%;
  height: auto;
  display: block;
}

.post__content {
  font-family: var(--shell-serif);
  font-size: 1.0625rem;
  line-height: 1.85;
  margin-top: 2rem;
}

.post__content h2 {
  font-size: 1.5rem;
  margin-top: 2.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--shell-rule);
}

.post__content h3 {
  font-size: 1.1875rem;
  margin-top: 2rem;
}

.post__content a {
  color: var(--shell-fg);
  text-decoration: underline;
}

.heading-anchor {
  margin-left: 0.4rem;
  opacity: 0;
  text-decoration: none;
  color: var(--shell-muted);
}

.heading-anchor::after {
  content: '#';
}

:is(h2, h3):hover .heading-anchor {
  opacity: 1;
}

/* Code, tables and wide images break past the measure and scroll inside
   themselves, so they never widen the page on a phone. */
.code-scroll,
.post__content pre,
.table-scroll {
  overflow-x: auto;
  max-width: 100%;
}

.post__content pre {
  font-family: var(--shell-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  padding: 1rem;
  border: 1px solid var(--shell-rule);
}

.post__content :not(pre) > code {
  font-family: var(--shell-mono);
  font-size: 0.9em;
  background: #f4f4f4;
  padding: 0.1rem 0.3rem;
}

.post__content table {
  border-collapse: collapse;
  width: 100%;
  font-family: var(--shell-sans);
  font-size: 0.9rem;
}

.post__content th,
.post__content td {
  border: 1px solid var(--shell-rule);
  padding: 0.5rem 0.75rem;
  text-align: left;
}

@media (min-width: 1200px) {
  .code-scroll,
  .post__content pre,
  .table-scroll {
    width: calc(100% + 6rem);
    margin-left: -3rem;
  }
}

.post__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid var(--shell-rule);
  font-size: 0.8125rem;
}

.post__footer a {
  color: var(--shell-muted);
}

/* --- table of contents ------------------------------------------------- */

.toc {
  flex: none;
  width: var(--shell-toc-width);
  align-self: flex-start;
  position: sticky;
  top: 2rem;
  font-family: var(--shell-sans);
  font-size: 0.8125rem;
}

.toc__summary {
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--shell-muted);
  cursor: pointer;
}

.toc__list {
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0 0 0 0.75rem;
  border-left: 1px solid var(--shell-rule);
}

.toc__item {
  margin: 0.4rem 0;
}

.toc__item--h3 {
  padding-left: 0.75rem;
}

.toc__link {
  color: var(--shell-muted);
  text-decoration: none;
}

.toc__link[aria-current='true'] {
  color: var(--shell-fg);
  font-weight: 600;
}

/* Below 1200 the rail collapses under the title. */
@media (max-width: 1199px) {
  .post-page {
    display: block;
  }

  .toc {
    position: static;
    width: auto;
    margin: 1.5rem 0;
    border: 1px solid var(--shell-rule);
    padding: 0.75rem 1rem;
  }

  .toc__details:not([open]) .toc__list {
    display: none;
  }
}
```

Note `.toc__details` is rendered with `open` and the mobile rule hides the list only when it is closed. To make the collapsed state the default below 1200px, add to the `Toc.astro` script:

```javascript
const initial = document.querySelector < HTMLDetailsElement > '.toc__details';
if (initial && window.matchMedia('(max-width: 1199px)').matches) {
  initial.open = false;
}
```

- [ ] **Step 8: Wrap code blocks in a scroll container**

Astro emits `<pre class="astro-code …">`. The test asserts a `code-scroll` wrapper exists, which needs a rehype plugin. Add to `astro.config.mjs` `markdown.rehypePlugins`, after the autolink entry:

```javascript
      () => (tree) => {
        for (let i = 0; i < tree.children.length; i += 1) {
          const node = tree.children[i];
          if (node.type !== 'element') continue;
          if (node.tagName !== 'pre' && node.tagName !== 'table') continue;
          tree.children[i] = {
            type: 'element',
            tagName: 'div',
            properties: {
              className: [node.tagName === 'pre' ? 'code-scroll' : 'table-scroll'],
            },
            children: [node],
          };
        }
      },
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `cd packages/blog-site && yarn build && node --test __tests__/post-page.test.mjs`
Expected: PASS, 9 tests.

If the heading-id assertion fails because `rehype-slug` produced a different slug for Korean text, read the actual `id` out of `dist/hello-world.html` and relax that one assertion to `assert.match(page, /<h2 id="[^"]+"/)` — the behaviour under test is "headings have ids", not the exact transliteration.

- [ ] **Step 10: Commit**

```bash
git add packages/blog-site/src/pages packages/blog-site/src/components \
        packages/blog-site/src/styles/post.css packages/blog-site/astro.config.mjs \
        packages/blog-site/__tests__/post-page.test.mjs
git commit -m "feat: add article page with table of contents and reading progress"
```

---

### Task 8: Tag pages, RSS, homepage JSON feed, 404, sitemap

**Files:**

- Create: `packages/blog-site/src/pages/tags/[tag].astro`
- Create: `packages/blog-site/src/pages/rss.xml.ts`
- Create: `packages/blog-site/src/pages/index.json.ts`
- Create: `packages/blog-site/src/pages/404.astro`
- Test: `packages/blog-site/__tests__/feeds.test.mjs`

**Interfaces:**

- Consumes: `Shell.astro` (Task 4); `PostIndexRow.astro`, `TagBar.astro` (Task 6); `sortByDateDesc`, `excludeDrafts`, `tagCounts`, `postsWithTag` (Task 5).
- Produces: `/blog/index.json` with the shape `Array<{ slug: string; title: string; summary: string; date: string; tags: string[]; url: string }>`, newest first. Task 14's homepage `Writing` section consumes exactly this.

- [ ] **Step 1: Write the failing test**

Create `packages/blog-site/__tests__/feeds.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const read = (file) => readFileSync(join(SERVE_ROOT, file), 'utf8');

test('a static page exists per tag', () => {
  assert.ok(existsSync(join(SERVE_ROOT, 'tags', 'tooling.html')));
  assert.ok(existsSync(join(SERVE_ROOT, 'tags', 'ethereum.html')));
});

test('a tag page lists only its own posts', () => {
  const page = read(join('tags', 'ethereum.html'));
  assert.match(page, /두 번째 글/);
  assert.ok(!page.includes('첫 번째 글'), 'untagged post must not appear');
});

test('a tag page is canonical to itself', () => {
  assert.match(
    read(join('tags', 'ethereum.html')),
    /<link rel="canonical" href="https:\/\/jungho\.dev\/blog\/tags\/ethereum"/,
  );
});

test('rss lists every post with absolute links', () => {
  const xml = read('rss.xml');
  assert.match(
    xml,
    /<title><!\[CDATA\[첫 번째 글\]\]><\/title>|<title>첫 번째 글<\/title>/,
  );
  assert.match(xml, /https:\/\/jungho\.dev\/blog\/hello-world/);
  assert.equal((xml.match(/<item>/g) ?? []).length, 2);
});

test('index.json is newest-first and carries what the homepage needs', () => {
  const items = JSON.parse(read('index.json'));
  assert.equal(items.length, 2);
  assert.equal(items[0].slug, 'hello-world');
  assert.deepEqual(Object.keys(items[0]).sort(), [
    'date',
    'slug',
    'summary',
    'tags',
    'title',
    'url',
  ]);
  assert.equal(items[0].url, '/blog/hello-world');
  assert.match(items[0].date, /^\d{4}-\d{2}-\d{2}$/);
});

test('a 404 page is emitted', () => {
  assert.ok(existsSync(join(SERVE_ROOT, '404.html')));
  assert.match(read('404.html'), /글을 찾을 수 없습니다/);
});

test('the sitemap index is emitted', () => {
  assert.ok(existsSync(join(SERVE_ROOT, 'sitemap-index.xml')));
  const files = readFileSync(join(SERVE_ROOT, 'sitemap-index.xml'), 'utf8');
  assert.match(files, /sitemap-0\.xml/);
});

test('the sitemap contains post URLs', () => {
  assert.match(
    read('sitemap-0.xml'),
    /https:\/\/jungho\.dev\/blog\/hello-world/,
  );
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd packages/blog-site && yarn build && node --test __tests__/feeds.test.mjs`
Expected: FAIL — the tag page does not exist.

- [ ] **Step 3: Write the tag page**

Create `packages/blog-site/src/pages/tags/[tag].astro`:

```astro
---
import { getCollection } from 'astro:content';
import Shell from '../../layouts/Shell.astro';
import PostIndexRow from '../../components/PostIndexRow.astro';
import TagBar from '../../components/TagBar.astro';
import { excludeDrafts, tagCounts, postsWithTag } from '../../lib/posts';
import { BASE } from '../../config/site';
import '../../styles/list.css';

export async function getStaticPaths() {
  const posts = excludeDrafts(
    await getCollection('posts'),
    import.meta.env.DEV,
  );
  const tags = new Set(posts.flatMap((post) => post.data.tags));
  return [...tags].map((tag) => ({ params: { tag } }));
}

const { tag } = Astro.params;
const all = excludeDrafts(await getCollection('posts'), import.meta.env.DEV);
const posts = postsWithTag(all, tag!);
const tags = tagCounts(all);
---

<Shell
  title={`#${tag} — Kyle Park 블로그`}
  description={`${tag} 태그가 붙은 글 ${posts.length}편.`}
  canonicalPath={`${BASE}/tags/${tag}`}
  current={BASE}
>
  <div class="list-page">
    <header class="list-header">
      <h1 class="list-header__title">#{tag}</h1>
      <p class="list-header__subtitle">{posts.length}편</p>
    </header>

    <TagBar tags={tags} active={tag} />

    <div class="post-list">
      {posts.map((post, i) => <PostIndexRow post={post} index={i} />)}
    </div>
  </div>
</Shell>
```

- [ ] **Step 4: Write the RSS endpoint**

Create `packages/blog-site/src/pages/rss.xml.ts`:

```typescript
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
```

- [ ] **Step 5: Write the homepage JSON feed**

Create `packages/blog-site/src/pages/index.json.ts`:

```typescript
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
```

- [ ] **Step 6: Write the 404 page**

Create `packages/blog-site/src/pages/404.astro`:

```astro
---
import Shell from '../layouts/Shell.astro';
import { BASE } from '../config/site';
---

<Shell
  title="글을 찾을 수 없습니다 — Kyle Park 블로그"
  description="요청한 글이 없습니다."
  canonicalPath={`${BASE}/404`}
  current={BASE}
>
  <div class="list-page">
    <h1 class="list-header__title">글을 찾을 수 없습니다</h1>
    <p class="list-header__subtitle">
      주소가 바뀌었거나 삭제된 글일 수 있습니다.
    </p>
    <p><a href={BASE}>← 글 목록으로</a></p>
  </div>
</Shell>
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `cd packages/blog-site && yarn build && node --test __tests__/feeds.test.mjs`
Expected: PASS, 8 tests.

If `sitemap-index.xml` is absent, `@astrojs/sitemap` needs `site` set — confirm `astro.config.mjs` still has `site: 'https://jungho.dev'`.

- [ ] **Step 8: Commit**

```bash
git add packages/blog-site/src/pages packages/blog-site/__tests__/feeds.test.mjs
git commit -m "feat: add tag pages, rss, homepage json feed and blog 404"
```

---

### Task 9: giscus comments

The giscus app is already installed on `kyle-park-io/blog`, but the repository's Discussions feature is **off** and therefore has no categories — verified via the GitHub GraphQL API. Both are fixed here.

**Files:**

- Create: `packages/blog-site/src/config/giscus.ts`
- Create: `packages/blog-site/src/components/Giscus.astro`
- Modify: `packages/blog-site/src/pages/[slug].astro` (mount it below the article footer)
- Modify: `packages/blog-site/src/styles/post.css` (spacing)
- Test: `packages/blog-site/__tests__/giscus.test.mjs`

**Interfaces:**

- Consumes: `[slug].astro` (Task 7).
- Produces: `GISCUS` config object (`{ repo, repoId, category, categoryId }`).

- [ ] **Step 1: Enable Discussions on the content repo**

Run:

```bash
gh api -X PATCH repos/kyle-park-io/blog -f has_discussions=true
```

Expected: JSON response with `"has_discussions": true`.

- [ ] **Step 2: Read back the repository and category ids**

Run:

```bash
gh api graphql -f query='query { repository(owner:"kyle-park-io", name:"blog") { id hasDiscussionsEnabled discussionCategories(first:20) { nodes { id name } } } }'
```

Expected: `hasDiscussionsEnabled: true` and a non-empty `discussionCategories.nodes` list. The repository id is already known to be `R_kgDOK0SBsA`; confirm it matches.

Pick the **Announcements** category — only the repository owner can open threads in it, so giscus creates the discussion for each post while nobody can spam new top-level threads. If the auto-created categories do not include Announcements, create it in the repository's Discussions settings UI and re-run this command.

- [ ] **Step 3: Write the config**

Create `packages/blog-site/src/config/giscus.ts`, substituting the `categoryId` printed in Step 2:

```typescript
/**
 * giscus identifiers. These are public — giscus embeds them in the client
 * script on every article page — so they are committed rather than injected
 * as build secrets.
 *
 * Obtained with:
 *   gh api graphql -f query='query { repository(owner:"kyle-park-io", name:"blog")
 *     { id discussionCategories(first:20) { nodes { id name } } } }'
 */
export const GISCUS = {
  repo: 'kyle-park-io/blog',
  repoId: 'R_kgDOK0SBsA',
  category: 'Announcements',
  categoryId: 'PASTE_THE_ID_FROM_STEP_2',
} as const;
```

Replace `PASTE_THE_ID_FROM_STEP_2` with the literal `DIC_…` value before committing. The build does not validate it; a wrong value shows an empty comment box in the browser, which Step 7 checks.

- [ ] **Step 4: Write the failing test**

Create `packages/blog-site/__tests__/giscus.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { GISCUS } from '../src/config/giscus.ts';

const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const page = () => readFileSync(join(SERVE_ROOT, 'hello-world.html'), 'utf8');

test('the giscus ids are filled in', () => {
  assert.match(GISCUS.repoId, /^R_/);
  assert.match(GISCUS.categoryId, /^DIC_/);
});

test('the article embeds the giscus client verbatim', () => {
  const html = page();
  assert.match(html, /src="https:\/\/giscus\.app\/client\.js"/);
  assert.match(html, new RegExp(`data-repo="${GISCUS.repo}"`));
  assert.match(html, new RegExp(`data-repo-id="${GISCUS.repoId}"`));
  assert.match(html, new RegExp(`data-category-id="${GISCUS.categoryId}"`));
  assert.match(html, /data-mapping="pathname"/);
  assert.match(html, /data-loading="lazy"/);
});

test('the list page does not load giscus', () => {
  const list = readFileSync(join(SERVE_ROOT, 'index.html'), 'utf8');
  assert.ok(!list.includes('giscus.app'));
});
```

- [ ] **Step 5: Run it to verify it fails**

Run: `cd packages/blog-site && node --test __tests__/giscus.test.mjs`
Expected: FAIL on the embed assertion.

- [ ] **Step 6: Write the component and mount it**

Create `packages/blog-site/src/components/Giscus.astro`:

```astro
---
import { GISCUS } from '../config/giscus';
---

<section class="comments" aria-label="댓글">
  <h2 class="comments__heading">댓글</h2>
  <script
    is:inline
    src="https://giscus.app/client.js"
    data-repo={GISCUS.repo}
    data-repo-id={GISCUS.repoId}
    data-category={GISCUS.category}
    data-category-id={GISCUS.categoryId}
    data-mapping="pathname"
    data-strict="1"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-input-position="top"
    data-theme="light"
    data-lang="ko"
    data-loading="lazy"
    crossorigin="anonymous"
    async></script>
</section>
```

`is:inline` is required — without it Astro bundles the tag and drops the `data-*` attributes giscus reads.

In `packages/blog-site/src/pages/[slug].astro`, import it and place it immediately after `</footer>`, still inside `<article>`'s parent:

```astro
import Giscus from '../components/Giscus.astro';
```

```astro
<Toc headings={headings} />

<Giscus />
```

Add to `packages/blog-site/src/styles/post.css`:

```css
.comments {
  max-width: var(--shell-measure);
  margin: 3rem auto 0;
}

.comments__heading {
  font-family: var(--shell-sans);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--shell-muted);
  border-top: 1px solid var(--shell-rule);
  padding-top: 1rem;
}
```

- [ ] **Step 7: Run the test, then confirm in a browser**

Run: `cd packages/blog-site && yarn build && node --test __tests__/giscus.test.mjs`
Expected: PASS, 3 tests.

Then run `yarn preview` and open `http://localhost:4321/blog/hello-world`. Expected: the giscus iframe renders a "Sign in with GitHub" comment box. An error banner inside the iframe means the category id is wrong or Discussions is still off — re-run Step 1 and Step 2.

- [ ] **Step 8: Commit**

```bash
git add packages/blog-site/src/config/giscus.ts \
        packages/blog-site/src/components/Giscus.astro \
        packages/blog-site/src/pages/'[slug]'.astro \
        packages/blog-site/src/styles/post.css \
        packages/blog-site/__tests__/giscus.test.mjs
git commit -m "feat: add giscus comments to blog articles"
```

---

### Task 10: Restructure the content repo

**This task's commits go to `~/code/blog` (`kyle-park-io/blog`), not to `kyle-server`.** `md/` and `sort/` stay in place; Task 15 removes them once the new image is verified in production.

**Files (all under `~/code/blog`):**

- Create: `content/posts/project-initial-setup/index.md`
- Create: `content/posts/ethereum-event-object/index.md`
- Create: `content/posts/chain-communicator/index.md`
- Create: `scripts/validate-frontmatter.mjs`
- Create: `.husky/pre-commit`
- Create: `CONTRIBUTING.md`
- Modify: `.gitignore`
- Modify: `package.json` (add the `validate` script)
- Test: `__tests__/validate-frontmatter.test.mjs`

**Interfaces:**

- Consumes: the schema defined in Task 5's `content.config.ts` — the validator must accept exactly what zod accepts.
- Produces: `content/posts/<slug>/index.md` files that Task 12's `build-blog.sh` rsyncs into `blog-site/src/data/posts/`.

- [ ] **Step 1: Write the failing validator test**

Create `~/code/blog/__tests__/validate-frontmatter.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validatePosts } from '../scripts/validate-frontmatter.mjs';

const withPosts = (posts, run) => {
  const root = mkdtempSync(join(tmpdir(), 'blog-validate-'));
  for (const [slug, body] of Object.entries(posts)) {
    mkdirSync(join(root, slug), { recursive: true });
    writeFileSync(join(root, slug, 'index.md'), body);
  }
  try {
    return run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

const valid = `---
title: 제목
date: 2024-09-05
summary: 요약
tags: [ethereum, dev-tools]
lang: ko
---

본문
`;

test('a valid post produces no errors', () => {
  withPosts({ 'good-post': valid }, (root) => {
    assert.deepEqual(validatePosts(root), []);
  });
});

test('a missing required key is reported with the file path', () => {
  const missing = valid.replace('summary: 요약\n', '');
  withPosts({ 'bad-post': missing }, (root) => {
    const errors = validatePosts(root);
    assert.equal(errors.length, 1);
    assert.match(errors[0], /bad-post/);
    assert.match(errors[0], /summary/);
  });
});

test('a non-ISO date is reported', () => {
  const bad = valid.replace('date: 2024-09-05', 'date: 2024/09/05');
  withPosts({ 'bad-date': bad }, (root) => {
    assert.match(validatePosts(root)[0], /date/);
  });
});

test('an uppercase tag is reported', () => {
  const bad = valid.replace('tags: [ethereum, dev-tools]', 'tags: [Ethereum]');
  withPosts({ 'bad-tag': bad }, (root) => {
    assert.match(validatePosts(root)[0], /tag/i);
  });
});

test('a cover pointing at a missing file is reported', () => {
  const bad = valid.replace('lang: ko', 'lang: ko\ncover: ./nope.webp');
  withPosts({ 'bad-cover': bad }, (root) => {
    assert.match(validatePosts(root)[0], /nope\.webp/);
  });
});

test('a body that repeats the title as an h1 is reported', () => {
  const bad = `${valid}\n# 제목\n`;
  withPosts({ 'dup-title': bad }, (root) => {
    assert.match(validatePosts(root)[0], /h1|# /);
  });
});

test('an unknown frontmatter key is reported', () => {
  const bad = valid.replace('lang: ko', 'lang: ko\nauthor: 나');
  withPosts({ 'extra-key': bad }, (root) => {
    assert.match(validatePosts(root)[0], /author/);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd ~/code/blog && node --test __tests__/validate-frontmatter.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the validator**

Create `~/code/blog/scripts/validate-frontmatter.mjs`:

```javascript
#!/usr/bin/env node
// Frontmatter guard for content/posts/<slug>/index.md.
//
// This mirrors the zod schema in kyle-server's packages/blog-site/src/
// content.config.ts. The build is the hard gate; this hook exists so a typo
// fails at commit time instead of showing up as a silently missing post ten
// minutes later. No dependencies on purpose — it runs from a bare checkout.

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const REQUIRED = ['title', 'date', 'summary', 'tags'];
const OPTIONAL = ['updated', 'cover', 'draft', 'lang'];
const KNOWN = new Set([...REQUIRED, ...OPTIONAL]);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Minimal frontmatter reader: `key: value` pairs, `[a, b]` arrays. */
function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n')) return { fields: null, body: raw };
  const end = raw.indexOf('\n---', 4);
  if (end === -1) return { fields: null, body: raw };

  const fields = {};
  for (const line of raw.slice(4, end).split('\n')) {
    if (line.trim() === '') continue;
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v !== '');
    }
    fields[key] = value;
  }
  return { fields, body: raw.slice(end + 4) };
}

export function validatePosts(root) {
  const errors = [];
  if (!existsSync(root)) return [`content directory missing: ${root}`];

  const slugs = readdirSync(root).filter((name) =>
    statSync(join(root, name)).isDirectory(),
  );

  const seen = new Set();
  for (const slug of slugs) {
    const file = join(slug, 'index.md');
    const path = join(root, file);
    const at = (msg) => errors.push(`${file}: ${msg}`);

    if (!KEBAB.test(slug))
      at(`directory name "${slug}" must be lowercase kebab-case`);
    if (seen.has(slug)) at(`duplicate slug "${slug}"`);
    seen.add(slug);

    if (!existsSync(path)) {
      at('missing index.md');
      continue;
    }

    const { fields, body } = parseFrontmatter(readFileSync(path, 'utf8'));
    if (fields === null) {
      at('missing or unterminated frontmatter block');
      continue;
    }

    for (const key of REQUIRED) {
      if (fields[key] === undefined || fields[key] === '')
        at(`missing required key: ${key}`);
    }
    for (const key of Object.keys(fields)) {
      if (!KNOWN.has(key)) at(`unknown frontmatter key: ${key}`);
    }

    for (const key of ['date', 'updated']) {
      const value = fields[key];
      if (value !== undefined && !ISO_DATE.test(value)) {
        at(`${key} must be YYYY-MM-DD, got "${value}"`);
      }
    }

    const tags = fields.tags;
    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        at('tags must be an array, e.g. tags: [ethereum, dev-tools]');
      } else {
        for (const tag of tags) {
          if (!KEBAB.test(tag)) at(`tag "${tag}" must be lowercase kebab-case`);
        }
      }
    }

    if (fields.lang !== undefined && !['ko', 'en'].includes(fields.lang)) {
      at(`lang must be ko or en, got "${fields.lang}"`);
    }

    if (
      fields.draft !== undefined &&
      !['true', 'false'].includes(fields.draft)
    ) {
      at(`draft must be true or false, got "${fields.draft}"`);
    }

    if (fields.cover !== undefined) {
      const rel = String(fields.cover).replace(/^\.\//, '');
      if (!existsSync(join(root, slug, rel)))
        at(`cover file not found: ${fields.cover}`);
    }

    if (/^# /m.test(body)) {
      at('body must not contain an h1 (# ) — the title comes from frontmatter');
    }
  }

  return errors;
}

const isMain = process.argv[1]?.endsWith('validate-frontmatter.mjs');
if (isMain) {
  const root = process.argv[2] ?? 'content/posts';
  const errors = validatePosts(root);
  if (errors.length > 0) {
    console.error('frontmatter validation failed:');
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  console.log('frontmatter OK');
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `cd ~/code/blog && node --test __tests__/validate-frontmatter.test.mjs`
Expected: PASS, 7 tests.

- [ ] **Step 5: Wire the hook and script**

Add to `~/code/blog/package.json` `scripts`:

```json
"test": "node --test __tests__/*.test.mjs",
"validate": "node scripts/validate-frontmatter.mjs content/posts"
```

Create `~/code/blog/.husky/pre-commit`:

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn run validate
```

Run `chmod +x .husky/pre-commit scripts/validate-frontmatter.mjs`.

Add to `~/code/blog/.gitignore`:

```
sort/
```

- [ ] **Step 6: Migrate the three posts**

For each source file, create the new directory and copy the body across, adding frontmatter and deleting the body's `# ` title line. Dates come from the existing `sort/sorted_md_files.txt`, which recorded the original commit dates — use those, not today's date.

**Copy, do not `git mv`.** Moving would empty `md/`, which the currently deployed image still reads every ten minutes; the live blog would go blank before the new image ships. Task 15 deletes the originals once production is verified.

```bash
cd ~/code/blog
mkdir -p content/posts/project-initial-setup \
         content/posts/ethereum-event-object \
         content/posts/chain-communicator
cp md/portfolio1.md content/posts/project-initial-setup/index.md
cp md/eth.md content/posts/ethereum-event-object/index.md
cp md/portfolio4.md content/posts/chain-communicator/index.md
```

Then edit each copy. `content/posts/ethereum-event-object/index.md` starts:

```markdown
---
title: 이더리움 이벤트 객체
date: 2023-12-01
summary: ethers.js가 넘겨주는 ContractEventPayload의 구조를 필드 단위로 해부합니다.
tags: [ethereum, ethers, node]
lang: ko
---
```

…followed by the original body **with its first `# 이더리움 이벤트 객체` line removed**.

`content/posts/project-initial-setup/index.md`:

```markdown
---
title: 프로젝트 초기 개발 환경 설정 권장 사례
date: 2024-09-05
summary: 새 프로젝트에 투입되거나 새로 시작할 때, 개발 환경과 공통 설정을 어떤 순서로 잡아야 하는지 정리했습니다.
tags: [dev-tools, conventions, onboarding]
lang: ko
---
```

Remove both the original `# 프로젝트 초기 개발 환경 설정 권장 사례` line **and** the hand-written `# # 목차` section — the table of contents is generated now.

`content/posts/chain-communicator/index.md`:

```markdown
---
title: Chain Communicator
date: 2023-12-01
summary: 여러 체인 사이의 통신을 중계하는 Chain Communicator의 설계와 구현 기록입니다.
tags: [blockchain, architecture]
lang: ko
---
```

Remove the original `# Chain Communicator` line. Then read each migrated file and rewrite `summary` if it misrepresents the post — the summaries above are written from the first screens of each file and must be checked against the full text.

- [ ] **Step 7: Validate the migrated content**

Run: `cd ~/code/blog && yarn run validate`
Expected: `frontmatter OK`. Fix any reported error before continuing.

- [ ] **Step 8: Write the contributor guide**

Create `~/code/blog/CONTRIBUTING.md`:

```markdown
# Writing a post

One post is one directory: `content/posts/<slug>/index.md`. The directory name
is the URL — `content/posts/ethereum-event-object` is served at
`https://jungho.dev/blog/ethereum-event-object`. Slugs are lowercase
kebab-case and must not change after publishing; changing one breaks every
link to the post.

Images live next to the post and are referenced relatively:

    content/posts/my-post/
      index.md
      cover.webp
      diagram.webp

    ![구조도](./diagram.webp)

## Frontmatter

| Key       | Required | Rule                                                                               |
| --------- | -------- | ---------------------------------------------------------------------------------- |
| `title`   | yes      | Do **not** repeat it as `# ` in the body                                           |
| `date`    | yes      | `YYYY-MM-DD`, written by hand. Editing a post never reorders the list              |
| `updated` | no       | `YYYY-MM-DD`. Shown as "수정: …"; does not affect ordering                         |
| `summary` | yes      | One sentence. Used on the list page, in `<meta description>`, and in link previews |
| `tags`    | yes      | Lowercase kebab-case array. `[]` is allowed                                        |
| `cover`   | no       | `./cover.webp`. The file must exist                                                |
| `draft`   | no       | `true` hides it from the published site                                            |
| `lang`    | no       | `ko` (default) or `en`                                                             |

Example:

    ---
    title: 이더리움 이벤트 객체
    date: 2023-12-01
    summary: ethers.js 이벤트 페이로드 구조를 해부합니다.
    tags: [ethereum, ethers]
    lang: ko
    ---

## Publishing

`git commit` runs `yarn run validate`, which fails on a bad slug, a missing
key, a malformed date, an uppercase tag, a missing cover file, or an `# ` in
the body. After `git push`, the site's cron picks the change up within ten
minutes, rebuilds, and swaps the output in. No deploy is needed.

If a post does not appear, the build rejected it — the previous version of the
site stays up on purpose. Check the pod logs for the astro build output.
```

- [ ] **Step 9: Commit (in the blog repo)**

```bash
cd ~/code/blog
git add content scripts __tests__ .husky/pre-commit .gitignore package.json CONTRIBUTING.md
git commit -m "feat: restructure posts into content/posts with frontmatter"
git push
```

`md/` and `sort/` are intentionally left in the tree.

---

### Task 11: express serves the static blog, redirects legacy slugs, and drops the markdown pipeline

**Files:**

- Modify: `packages/blog-backend/src/app.ts` (whole file restructured)
- Create: `packages/blog-backend/src/blog/legacy-slugs.ts`
- Create: `packages/blog-backend/src/blog/serve.ts`
- Modify: `packages/blog-backend/src/routes/api.ts`
- Delete: `packages/blog-backend/src/services/blog.ts`
- Delete: `packages/blog-backend/src/utils/md.ts`
- Modify: `packages/blog-backend/package.json` (add `build`, real `test`; drop `md-to-html3`)
- Modify: `packages/blog-backend/production/package.json` (drop `md-to-html3`)
- Test: `packages/blog-backend/__tests__/legacy-slugs.test.mjs`
- Test: `packages/blog-backend/__tests__/blog-routes.test.mjs`

**Interfaces:**

- Consumes: the built blog output from Task 3–9; `SERVE_ROOT` resolution recorded in Task 3 Step 7.
- Produces: `createApp(options: { blogDist: string; spaStatic: string }): express.Express` exported from `src/app.ts`; `LEGACY_SLUGS: Record<string, string>` and `resolveLegacySlug(pathname: string): string | undefined` from `src/blog/legacy-slugs.ts`. Task 12's `build-blog.sh` writes into the directory `blogDist` points at.

- [ ] **Step 1: Write the failing legacy-slug test**

Create `packages/blog-backend/__tests__/legacy-slugs.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEGACY_SLUGS, resolveLegacySlug } from '../dist/blog/legacy-slugs.js';

test('every old filename-based URL maps somewhere', () => {
  assert.deepEqual(Object.keys(LEGACY_SLUGS).sort(), [
    'eth',
    'portfolio1',
    'portfolio4',
    'test',
  ]);
});

test('maps an old slug to its new path', () => {
  assert.equal(resolveLegacySlug('/portfolio1'), '/blog/project-initial-setup');
  assert.equal(resolveLegacySlug('/eth'), '/blog/ethereum-event-object');
  assert.equal(resolveLegacySlug('/portfolio4'), '/blog/chain-communicator');
});

test('the deleted test post falls back to the list', () => {
  assert.equal(resolveLegacySlug('/test'), '/blog');
});

test('a current slug is not a legacy slug', () => {
  assert.equal(resolveLegacySlug('/ethereum-event-object'), undefined);
  assert.equal(resolveLegacySlug('/'), undefined);
});

test('trailing slashes are tolerated', () => {
  assert.equal(resolveLegacySlug('/eth/'), '/blog/ethereum-event-object');
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd packages/blog-backend && npx tsc && node --test __tests__/legacy-slugs.test.mjs`
Expected: FAIL — `dist/blog/legacy-slugs.js` not found.

- [ ] **Step 3: Write the legacy-slug module**

Create `packages/blog-backend/src/blog/legacy-slugs.ts`:

```typescript
/**
 * The blog used to derive URLs from markdown filenames. Slugs are now the
 * post directory name, so the old URLs must keep working — they are in
 * search indexes and in links people have already shared.
 */
export const LEGACY_SLUGS: Record<string, string> = {
  portfolio1: '/blog/project-initial-setup',
  eth: '/blog/ethereum-event-object',
  portfolio4: '/blog/chain-communicator',
  // md/test.md was a fixture and is deleted; send it to the list.
  test: '/blog',
};

/**
 * @param pathname path relative to the /blog mount, e.g. `/eth`
 * @returns the absolute path to redirect to, or undefined if not a legacy slug
 */
export function resolveLegacySlug(pathname: string): string | undefined {
  const slug = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  if (slug === '') return undefined;
  return LEGACY_SLUGS[slug];
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `cd packages/blog-backend && npx tsc && node --test __tests__/legacy-slugs.test.mjs`
Expected: PASS, 5 tests.

- [ ] **Step 5: Write the failing routing test**

Create `packages/blog-backend/__tests__/blog-routes.test.mjs`:

```javascript
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
```

- [ ] **Step 6: Run it to verify it fails**

Run: `cd packages/blog-backend && npx tsc && node --test __tests__/blog-routes.test.mjs`
Expected: FAIL — `createApp` is not exported.

- [ ] **Step 7: Write the blog serving middleware**

Create `packages/blog-backend/src/blog/serve.ts`:

```typescript
import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import * as path from 'path';
import { resolveLegacySlug } from './legacy-slugs';

/**
 * Mounts the statically built blog at /blog.
 *
 * Order matters: static files first so a real page never pays for the
 * redirect lookup, then the legacy 301 map, then the blog's own 404 so an
 * unknown /blog path does not fall through to the SPA shell.
 */
export function mountBlog(app: express.Express, blogDist: string): void {
  app.use(
    '/blog',
    express.static(blogDist, {
      // build.format: 'file' emits <slug>.html; this serves it at /blog/<slug>
      // with no trailing-slash redirect.
      extensions: ['html'],
      index: 'index.html',
      redirect: false,
    }),
  );

  app.use('/blog', (req: Request, res: Response, next: NextFunction) => {
    const target = resolveLegacySlug(req.path);
    if (target === undefined) {
      next();
      return;
    }
    res.redirect(301, target);
  });

  app.use('/blog', (req: Request, res: Response) => {
    res.status(404).sendFile(path.join(blogDist, '404.html'));
  });
}
```

- [ ] **Step 8: Restructure `app.ts`**

Replace `packages/blog-backend/src/app.ts` entirely:

```typescript
import express from 'express';
import helmet from 'helmet';
import * as path from 'path';
import apiRouter from './routes/api';
import { serverConfig } from './config/server.config';
import { mountBlog } from './blog/serve';

export interface AppOptions {
  /** Directory holding the built astro output that is served at /blog. */
  blogDist: string;
  /** Directory holding the SPA webpack build, served at /blog-static. */
  spaStatic: string;
}

export function createApp(options: AppOptions): express.Express {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));

  // Static blog. Must come before the SPA catch-all.
  mountBlog(app, options.blogDist);

  // SPA assets.
  app.use('/blog-static', express.static(options.spaStatic));

  app.use('/api', apiRouter);

  // An unmatched API path must 404 as an API, not fall through to the SPA
  // shell — otherwise every deleted blog endpoint would still answer 200 with
  // a page of HTML, which is worse than being gone.
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'not found' });
  });

  // Everything else is a SPA route.
  app.get('*', (_req, res) => {
    res.sendFile(path.join(options.spaStatic, 'index.html'));
  });

  return app;
}

function start(): void {
  const config = serverConfig();
  const port = config.server.port;

  const app = createApp({
    blogDist: process.env.BLOG_DIST ?? '/usr/src/app/blog-dist',
    spaStatic: path.join(__dirname, '../static'),
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// `node dist/app.js` starts the server; importing the module does not.
if (require.main === module) {
  start();
}
```

The 10-minute `setInterval` that re-converted every markdown file, and the `initialize()` that ran the same conversion on boot, are gone — the cron script owns rebuilding now.

- [ ] **Step 9: Shrink the API router and delete the dead modules**

Replace `packages/blog-backend/src/routes/api.ts`:

```typescript
import { type Request, type Response } from 'express';
import express from 'express';

const apiRouter = express.Router();

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true });
});

export default apiRouter;
```

Then:

```bash
cd packages/blog-backend
git rm src/services/blog.ts src/utils/md.ts
```

Remove `"md-to-html3"` from both `package.json` and `production/package.json`, and add to `package.json` `scripts`:

```json
"build": "tsc",
"test": "tsc && node --test __tests__/*.test.mjs"
```

Delete the lerna-scaffolded stub `__tests__/blog-backend.test.js` — it asserts `require('..')() === 'Hello from blogBackend'` and tests nothing.

- [ ] **Step 10: Run the tests to verify they pass**

Run: `cd packages/blog-backend && yarn test`
Expected: PASS — 5 legacy-slug tests and 10 routing tests.

- [ ] **Step 11: Commit**

```bash
git add packages/blog-backend
git commit -m "feat: serve the static blog from express and drop the markdown pipeline"
```

---

### Task 12: Content sync and build script with atomic swap

Preserves the current publishing experience — push markdown, live within ten minutes, no deploy — while producing static output. A failed build must never take the site down.

**Files:**

- Create: `packages/blog-backend/scripts/build-blog.sh`
- Modify: `packages/blog-backend/scripts/init-script.sh`
- Modify: `packages/blog-backend/scripts/start-server.sh`
- Modify (in `~/code/blog`): `scripts/cron-update-blog.sh`, `cron/update-blog`
- Delete (in `~/code/blog`): `scripts/cron-sort-blog.sh`, `scripts/cron-sort-blog.old.sh`
- Test: `packages/blog-backend/__tests__/build-blog.test.mjs`

**Interfaces:**

- Consumes: `content/posts/` from Task 10; `packages/blog-site` from Tasks 3–9; `BLOG_DIST` read by `createApp` in Task 11.
- Produces: `build-blog.sh`, invoked with `CONTENT_SRC`, `SITE_DIR`, `BLOG_DIST` and `LOCK_FILE` environment variables so the tests can drive it against fixtures.

- [ ] **Step 1: Write the failing script test**

Create `packages/blog-backend/__tests__/build-blog.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  chmodSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SCRIPT = resolve('scripts/build-blog.sh');

/**
 * Builds a sandbox where the "astro build" step is a stub script we control,
 * so the test exercises the sync/build/swap logic rather than astro itself.
 */
function sandbox({ buildExitCode = 0 } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'build-blog-'));

  const contentSrc = join(root, 'content');
  mkdirSync(join(contentSrc, 'posts', 'a-post'), { recursive: true });
  writeFileSync(join(contentSrc, 'posts', 'a-post', 'index.md'), '# a');

  const siteDir = join(root, 'site');
  mkdirSync(siteDir, { recursive: true });

  // Stub build command: writes dist/index.html then exits with the given code.
  const stub = join(siteDir, 'fake-build.sh');
  writeFileSync(
    stub,
    [
      '#!/bin/sh',
      'mkdir -p "$PWD/dist"',
      'echo "<h1>built $(date +%s%N)</h1>" > "$PWD/dist/index.html"',
      `exit ${buildExitCode}`,
    ].join('\n') + '\n',
  );
  chmodSync(stub, 0o755);

  const blogDist = join(root, 'blog-dist');

  return {
    root,
    env: {
      ...process.env,
      CONTENT_SRC: contentSrc,
      SITE_DIR: siteDir,
      BLOG_DIST: blogDist,
      BUILD_CMD: stub,
      LOCK_FILE: join(root, 'lock'),
    },
    blogDist,
  };
}

const run = (env) => {
  try {
    return {
      ok: true,
      output: execFileSync('sh', [SCRIPT], {
        env,
        encoding: 'utf8',
        stdio: 'pipe',
      }),
    };
  } catch (err) {
    return { ok: false, output: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
};

test('a successful build publishes the output', () => {
  const box = sandbox();
  try {
    assert.equal(run(box.env).ok, true);
    assert.ok(existsSync(join(box.blogDist, 'index.html')));
    assert.match(
      readFileSync(join(box.blogDist, 'index.html'), 'utf8'),
      /built/,
    );
  } finally {
    rmSync(box.root, { recursive: true, force: true });
  }
});

test('content is synced into the site directory before building', () => {
  const box = sandbox();
  try {
    run(box.env);
    assert.ok(
      existsSync(
        join(box.env.SITE_DIR, 'src', 'data', 'posts', 'a-post', 'index.md'),
      ),
    );
  } finally {
    rmSync(box.root, { recursive: true, force: true });
  }
});

test('a failed build leaves the previously published output in place', () => {
  const good = sandbox();
  try {
    run(good.env);
    const before = readFileSync(join(good.blogDist, 'index.html'), 'utf8');

    const failing = { ...good.env };
    const stub = join(good.env.SITE_DIR, 'failing-build.sh');
    writeFileSync(stub, '#!/bin/sh\nmkdir -p "$PWD/dist"\nexit 1\n');
    chmodSync(stub, 0o755);
    failing.BUILD_CMD = stub;

    const result = run(failing);
    assert.equal(result.ok, false, 'the script must exit non-zero');
    assert.equal(
      readFileSync(join(good.blogDist, 'index.html'), 'utf8'),
      before,
      'published output must be untouched',
    );
  } finally {
    rmSync(good.root, { recursive: true, force: true });
  }
});

test('a stale temporary directory from a previous crash does not block the build', () => {
  const box = sandbox();
  try {
    mkdirSync(`${box.blogDist}.new`, { recursive: true });
    writeFileSync(join(`${box.blogDist}.new`, 'junk.html'), 'junk');
    assert.equal(run(box.env).ok, true);
    assert.ok(!existsSync(join(box.blogDist, 'junk.html')));
  } finally {
    rmSync(box.root, { recursive: true, force: true });
  }
});

test('a run whose lock is already held exits 0 without publishing', (t) => {
  const hasFlock = (() => {
    try {
      execFileSync('sh', ['-c', 'command -v flock'], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  })();
  if (!hasFlock) {
    t.skip('flock is not available on this platform');
    return;
  }

  const box = sandbox();
  try {
    // Hold the lock for 3s in the background, then run the script. It must
    // give up immediately and leave BLOG_DIST uncreated.
    const result = execFileSync(
      'sh',
      [
        '-c',
        `flock "${box.env.LOCK_FILE}" sleep 3 & sleep 0.3; sh "${SCRIPT}"; echo "exit=$?"; wait`,
      ],
      { env: box.env, encoding: 'utf8' },
    );
    assert.match(result, /already running/);
    assert.match(result, /exit=0/);
    assert.ok(!existsSync(join(box.blogDist, 'index.html')));
  } finally {
    rmSync(box.root, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd packages/blog-backend && node --test __tests__/build-blog.test.mjs`
Expected: FAIL — `scripts/build-blog.sh` does not exist.

- [ ] **Step 3: Write the build script**

Create `packages/blog-backend/scripts/build-blog.sh`:

```sh
#!/bin/sh
# Sync the content repo into the astro project, build it, and atomically
# publish the result.
#
# Called by cron every 10 minutes and once at image build time. Every path is
# overridable so the tests can drive it against fixtures.
#
# Guarantees:
#   - a failed build never replaces the live output
#   - a crashed previous run cannot leave a half-built directory in place
#   - two runs never build at the same time

set -eu

CONTENT_SRC="${CONTENT_SRC:-/blog/content}"
SITE_DIR="${SITE_DIR:-/usr/src/blog-site}"
BLOG_DIST="${BLOG_DIST:-/usr/src/app/blog-dist}"
LOCK_FILE="${LOCK_FILE:-/tmp/build-blog.lock}"
BUILD_CMD="${BUILD_CMD:-}"

log() { echo "[build-blog] $*"; }

# Serialise runs: re-enter under flock, then fall through to the real work.
#
# `-E 99` makes "could not acquire the lock" distinguishable from "the child
# exited 1", which a plain `flock -n` conflates. Do not use `exec` here — it
# would replace this shell, so the exit-code check below could never run.
if [ -z "${BUILD_BLOG_LOCKED:-}" ] && command -v flock >/dev/null 2>&1; then
  BUILD_BLOG_LOCKED=1
  export BUILD_BLOG_LOCKED
  flock -n -E 99 "$LOCK_FILE" "$0" "$@"
  status=$?
  if [ "$status" -eq 99 ]; then
    log "another build is already running; skipping"
    exit 0
  fi
  exit "$status"
fi

if [ ! -d "$CONTENT_SRC/posts" ]; then
  log "no posts at $CONTENT_SRC/posts; nothing to build"
  exit 1
fi

log "syncing content from $CONTENT_SRC"
mkdir -p "$SITE_DIR/src/data"
rm -rf "$SITE_DIR/src/data/posts"
cp -R "$CONTENT_SRC/posts" "$SITE_DIR/src/data/posts"

STAGING="$BLOG_DIST.new"
PREVIOUS="$BLOG_DIST.old"
rm -rf "$STAGING" "$PREVIOUS"

log "building"
cd "$SITE_DIR"
rm -rf dist
if [ -n "$BUILD_CMD" ]; then
  "$BUILD_CMD"
else
  npm run build
fi

# `base: '/blog'` is applied to URLs; whether it also nests the output was
# recorded in astro.config.mjs. Handle both so this never silently serves an
# empty directory.
BUILT="dist"
if [ -d "dist/blog" ]; then
  BUILT="dist/blog"
fi

if [ ! -f "$BUILT/index.html" ]; then
  log "build produced no index.html; keeping the previous output"
  exit 1
fi

log "publishing"
mkdir -p "$(dirname "$BLOG_DIST")"
cp -R "$BUILT" "$STAGING"
if [ -d "$BLOG_DIST" ]; then
  mv "$BLOG_DIST" "$PREVIOUS"
fi
mv "$STAGING" "$BLOG_DIST"
rm -rf "$PREVIOUS"

log "published $(find "$BLOG_DIST" -name '*.html' | wc -l) pages"
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd packages/blog-backend && chmod +x scripts/build-blog.sh && node --test __tests__/build-blog.test.mjs`
Expected: PASS, 5 tests.

- [ ] **Step 5: Rewrite the content-pull cron script (in the blog repo)**

Replace `~/code/blog/scripts/cron-update-blog.sh`:

```sh
#!/bin/sh
# Pull the content repo and rebuild the site only when something changed.
set -eu

cd /blog

BEFORE=$(git rev-parse HEAD)
git pull --ff-only
AFTER=$(git rev-parse HEAD)

if [ "$BEFORE" = "$AFTER" ]; then
  echo "[update-blog] no new commits; skipping build"
  exit 0
fi

echo "[update-blog] $BEFORE -> $AFTER; rebuilding"
exec /usr/src/app/scripts/build-blog.sh
```

Replace `~/code/blog/cron/update-blog`:

```cron
*/10 * * * * /blog/scripts/cron-update-blog.sh >> /var/log/update-blog.log 2>&1
```

Delete the sort scripts:

```bash
cd ~/code/blog
git rm scripts/cron-sort-blog.sh scripts/cron-sort-blog.old.sh
```

- [ ] **Step 6: Commit the blog repo changes**

```bash
cd ~/code/blog
git add scripts/cron-update-blog.sh cron/update-blog
git commit -m "feat: rebuild the site on content change instead of sorting with shell"
git push
```

- [ ] **Step 7: Commit the kyle-server changes**

```bash
cd ~/code/kyle-server
git add packages/blog-backend/scripts/build-blog.sh \
        packages/blog-backend/__tests__/build-blog.test.mjs
git commit -m "feat: add content sync and atomic swap build script"
```

---

### Task 13: Docker image — Node 22, Astro toolchain, repo-root build context

**Files:**

- Modify: `packages/blog-backend/Dockerfile`
- Modify: `packages/blog-backend/scripts/init-script.sh`
- Modify: `packages/blog-backend/scripts/start-server.sh`
- Modify: `packages/blog-backend/push2gke_artifact.sh`
- Create: `.dockerignore` (repo root)

**Interfaces:**

- Consumes: everything from Tasks 1–12.
- Produces: an image that serves `/blog` from `/usr/src/app/blog-dist` and rebuilds it on cron.

- [ ] **Step 1: Move the build context to the repo root**

The Dockerfile must copy `packages/blog-site` and `packages/site-shell`, which are outside its current context (`packages/blog-backend`). In `packages/blog-backend/push2gke_artifact.sh`, change:

```sh
CONTEXT_PATH=$SCRIPT_DIR
```

to:

```sh
# Context is the repo root: the image needs packages/blog-site and
# packages/site-shell alongside this package.
CONTEXT_PATH=$SCRIPT_DIR/../..
```

Leave `DOCKERFILE_PATH` as it is — `-f` already points at the Dockerfile explicitly.

Do **not** touch `push2gke_container.sh`: it pushes `gcr.io/kyle-server-402706/site-node`, which no Kubernetes manifest references (`~/code/kubenetes/kubenetes/site/site-app-k8s/site-app-server.yaml` uses the Artifact Registry `site-app-server` image that `push2gke_artifact.sh` builds). It is dead.

- [ ] **Step 2: Add a `.dockerignore`**

Create `.dockerignore` at the repo root so the new context does not ship `node_modules` or build output:

```
node_modules
**/node_modules
**/dist
**/.astro
.git
.superpowers
docs
packages/*/static
!packages/blog-backend/static
```

- [ ] **Step 3: Rewrite the Dockerfile**

Replace `packages/blog-backend/Dockerfile`:

```dockerfile
## build stage — compile the express server
# Astro 7 requires Node >= 22.12.0 and rejects odd majors; node:18 is EOL.
FROM node:22 AS builder

WORKDIR /usr/src/app

COPY packages/blog-backend/production/package*.json ./
COPY packages/blog-backend/production/tsconfig.json ./

RUN npm install

COPY packages/blog-backend/src ./src

RUN npm run build

## prod stage
FROM node:22-slim

# cron for the content pull, git to clone the content repo, Korean locale and
# fonts for the markdown content.
RUN apt-get update && apt-get install -y --no-install-recommends \
  cron \
  git \
  vim \
  locales fonts-nanum && \
  echo "ko_KR.UTF-8 UTF-8" > /etc/locale.gen && \
  locale-gen ko_KR.UTF-8 && \
  update-locale LANG=ko_KR.UTF-8 && \
  rm -rf /var/lib/apt/lists/*

ENV LANG=ko_KR.UTF-8
ENV LC_ALL=ko_KR.UTF-8

# Clone the content repo to /blog and install its cron entry.
COPY packages/blog-backend/scripts ./scripts
RUN chmod +x scripts/init-script.sh && ./scripts/init-script.sh

## the astro project, installed so cron can rebuild in place
WORKDIR /usr/src/blog-site
COPY packages/blog-site/package.json ./
COPY packages/site-shell /usr/src/site-shell
# `site-shell: "*"` resolves through the workspace on a dev machine; inside the
# image there is no workspace root, so link it explicitly.
RUN npm install --no-audit --no-fund && \
    rm -rf node_modules/site-shell && \
    ln -s /usr/src/site-shell node_modules/site-shell
COPY packages/blog-site/astro.config.mjs packages/blog-site/tsconfig.json ./
COPY packages/blog-site/src ./src

## the express server
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
COPY packages/blog-backend/static ./static
COPY packages/blog-backend/config ./config
COPY packages/blog-backend/scripts ./scripts

RUN chmod +x scripts/build-blog.sh scripts/start-server.sh

# Bake an initial blog build so a fresh pod serves /blog before the first
# cron tick.
RUN ./scripts/build-blog.sh

ENV NODE_ENV="production"
ENV BLOG_DIST="/usr/src/app/blog-dist"

EXPOSE 8080

ENTRYPOINT ["scripts/start-server.sh"]
```

- [ ] **Step 4: Update the init script**

Replace `packages/blog-backend/scripts/init-script.sh`:

```sh
#!/bin/sh
set -eu

git clone --depth 1 https://github.com/kyle-park-io/blog.git /blog

chmod +x /blog/scripts/*.sh
/blog/scripts/cron-init.sh
```

The old script copied `md/` and `sort/` into `/usr/src/app`; nothing reads those paths any more.

- [ ] **Step 5: Update the start script**

Replace `packages/blog-backend/scripts/start-server.sh`:

```sh
#!/bin/sh
set -eu

# cron pulls content and rebuilds the blog every 10 minutes.
cron -f &

exec node dist/app.js
```

- [ ] **Step 6: Build the image locally**

Run:

```bash
cd ~/code/kyle-server/packages/blog-frontend && yarn webpack-build-prod
cp -R static/. ../blog-backend/static/
cd ~/code/kyle-server
docker buildx build --platform linux/amd64 \
  -f packages/blog-backend/Dockerfile -t site-app-server:local --load .
```

Expected: the build completes and the `./scripts/build-blog.sh` layer logs `[build-blog] published N pages`.

If it logs `no posts at /blog/content/posts`, the content repo push from Task 10 has not landed — verify `https://github.com/kyle-park-io/blog/tree/main/content/posts` exists.

- [ ] **Step 7: Smoke-test the container**

Run:

```bash
docker run --rm -p 8081:8080 site-app-server:local &
sleep 5
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' http://localhost:8081/blog
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:8081/blog/eth
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8081/blog/ethereum-event-object
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8081/blog/rss.xml
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8081/blog/nope
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8081/
curl -s http://localhost:8081/blog/index.json | head -c 200
```

Expected: `200 text/html`, `301 /blog/ethereum-event-object`, `200`, `200`, `404`, `200`, and a JSON array of three posts.

- [ ] **Step 8: Commit**

```bash
git add packages/blog-backend/Dockerfile \
        packages/blog-backend/scripts \
        packages/blog-backend/push2gke_artifact.sh \
        .dockerignore
git commit -m "chore: build the blog inside the image on node 22"
```

---

### Task 14: SPA cleanup and the homepage Writing section

**Files:**

- Delete: `packages/blog-frontend/src/blog/` (all six files)
- Modify: `packages/blog-frontend/src/index.tsx` (remove four routes and their imports)
- Modify: `packages/blog-frontend/src/app/App.tsx` (Writing section; remove `Extra`)
- Modify: `packages/blog-frontend/src/app/App.css` (Writing styles)
- Modify: `packages/blog-frontend/package.json` (drop `axios` and `file-saver`)
- Test: `packages/blog-frontend/__tests__/spa-cleanup.test.mjs`

**Interfaces:**

- Consumes: `/blog/index.json` produced in Task 8 — `Array<{ slug, title, summary, date, tags, url }>`, newest first.
- Produces: nothing for later tasks.

- [ ] **Step 1: Write the failing cleanup test**

Create `packages/blog-frontend/__tests__/spa-cleanup.test.mjs`:

```javascript
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd packages/blog-frontend && node --test __tests__/spa-cleanup.test.mjs`
Expected: FAIL — `src/blog` still exists.

- [ ] **Step 3: Delete the blog components and routes**

```bash
cd packages/blog-frontend
git rm -r src/blog
```

In `src/index.tsx`, delete these imports:

```tsx
import BlogList from './blog/BlogList';
import BlogDetail from './blog/BlogDetail';
import BlogNotFound from './blog/BlogNotFound';
import Test from './blog/Test';
```

and these routes:

```tsx
<Route path="/test" component={Test} />
<Route path="/blog" component={BlogList} />
<Route path="/blog/not-found" component={BlogNotFound} />
<Route path="/blog/:id" component={BlogDetail} />
```

Express now serves every `/blog**` path before the SPA catch-all, so these routes could only ever shadow the real blog on a client-side navigation.

- [ ] **Step 4: Drop the dependencies**

Remove `"axios"` and `"file-saver"` from `dependencies` and `"@types/file-saver"` from `devDependencies` in `packages/blog-frontend/package.json`, then run `yarn install`.

Confirm nothing else imports them:

```bash
grep -rn "axios\|file-saver" src/ && echo "STILL USED — stop" || echo "clean"
```

- [ ] **Step 5: Add the Writing section to the homepage**

In `packages/blog-frontend/src/app/App.tsx`, extend the existing `solid-js` import — the file already imports `{ type Component, type JSX }` from it, so add to that same statement rather than writing a second one:

```tsx
import {
  type Component,
  type JSX,
  createSignal,
  onMount,
  For,
  Show,
} from 'solid-js';
```

Inside the component, before the `return`:

```tsx
interface RecentPost {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  url: string;
}

const [recent, setRecent] = createSignal<RecentPost[]>([]);

onMount(() => {
  // Generated by the astro build; replaces the deleted
  // /api-blog/api/blog/sorted-by-date/top-10 endpoint.
  void fetch('/blog/index.json')
    .then((res) => (res.ok ? res.json() : []))
    .then((posts: RecentPost[]) => setRecent(posts.slice(0, 3)))
    .catch(() => setRecent([]));
});
```

Insert this section immediately after the `Featured` section and before `Introduce`:

```tsx
{
  /* Writing Section — recent posts, fed by the static blog build */
}
<section class="home-section">
  <div class="home-section__head">
    <h2 class="home-section__title">Writing</h2>
    <a class="home-section__more" href="/blog">
      글 전체 보기 →
    </a>
  </div>
  <Show
    when={recent().length > 0}
    fallback={
      <a class="writing-empty" href="/blog">
        블로그로 이동 →
      </a>
    }
  >
    <div class="writing-list">
      <For each={recent()}>
        {(post, index) => (
          <a class="writing-item" href={post.url}>
            <span class="writing-item__number">
              {String(index() + 1).padStart(2, '0')}
            </span>
            <span class="writing-item__body">
              <span class="writing-item__title">{post.title}</span>
              <span class="writing-item__summary">{post.summary}</span>
              <time class="writing-item__date" datetime={post.date}>
                {post.date}
              </time>
            </span>
          </a>
        )}
      </For>
    </div>
  </Show>
</section>;
```

Then delete the whole `Extra` section and `handleBlogClick`, and move the Chat card into the `Projects` grid:

```tsx
<button class="project-card" onClick={handleChatClick}>
  <span class="project-card__icon">💬</span>
  <h3 class="project-card__title">Chat</h3>
  <p class="project-card__desc">Anonymous real-time chat</p>
</button>
```

- [ ] **Step 6: Style the Writing section**

Append to `packages/blog-frontend/src/app/App.css`:

```css
.home-section__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.home-section__more {
  font-size: 0.8125rem;
  color: #666;
  text-decoration: none;
  white-space: nowrap;
}

.writing-list {
  display: flex;
  flex-direction: column;
}

.writing-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e2e2;
  text-decoration: none;
  color: inherit;
}

.writing-item__number {
  flex: none;
  width: 2rem;
  font-size: 0.75rem;
  color: #999;
  padding-top: 0.25rem;
}

.writing-item__body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.writing-item__title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.125rem;
}

.writing-item__summary {
  font-size: 0.875rem;
  color: #666;
}

.writing-item__date {
  font-size: 0.75rem;
  color: #999;
}

.writing-empty {
  display: inline-block;
  padding: 1rem 0;
  color: #666;
}

@media (max-width: 576px) {
  .writing-item__number {
    display: none;
  }
}
```

- [ ] **Step 7: Run the test and build**

Run:

```bash
cd packages/blog-frontend
node --test __tests__/spa-cleanup.test.mjs
yarn webpack-build-prod
```

Expected: 5 tests PASS; the webpack build succeeds. Compare the reported bundle size against the previous build — dropping axios, file-saver and `Blog.css` should shrink it.

- [ ] **Step 8: Verify the homepage against a running blog**

Run the container from Task 13 (`docker run --rm -p 8081:8080 site-app-server:local`) after copying the new SPA build into `packages/blog-backend/static` and rebuilding the image, then open `http://localhost:8081/`. Expected: a `Writing` section listing three posts, each linking to `/blog/<slug>`; no `Extra` section; Chat in the Projects grid.

- [ ] **Step 9: Commit**

```bash
cd ~/code/kyle-server
git add packages/blog-frontend
git commit -m "feat: replace SPA blog with a homepage writing section"
```

---

### Task 15: Search-engine wiring, dead package removal, and final verification

**Files:**

- Modify: `packages/ingress-reverse-proxy/public/root/robots.txt`
- Delete: `packages/md-to-html/`
- Modify: `docs/superpowers/specs/2026-09-04-blog-overhaul-design.md` (two corrections)
- Modify (in `~/code/blog`): delete `md/` and `sort/`

**Interfaces:**

- Consumes: a deployed image from Tasks 11–14.
- Produces: nothing.

- [ ] **Step 1: Point robots.txt at the blog sitemap**

Replace `packages/ingress-reverse-proxy/public/root/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://jungho.dev/sitemap.xml
Sitemap: https://jungho.dev/blog/sitemap-index.xml
```

Multiple `Sitemap:` lines are valid. The root sitemap stays hand-maintained for the SPA pages; the blog's is generated per build, so posts no longer need to be added by hand.

- [ ] **Step 2: Delete the dead markdown converter**

```bash
cd ~/code/kyle-server
grep -rn "md-to-html3" --include='*.json' --include='*.ts' packages/ | grep -v node_modules
```

Expected: no matches (Task 11 removed both manifest entries). Then:

```bash
git rm -r packages/md-to-html
yarn install
```

`md-to-pdf` in the root `devDependencies` is unrelated — `scripts/build-cv.sh` uses it for the CV PDFs. Leave it.

- [ ] **Step 3: Correct the spec**

In `docs/superpowers/specs/2026-09-04-blog-overhaul-design.md`:

1. Section 2 says "Astro 6 requires Node ≥ 22.12.0". The installed version is Astro **7.3.1**; the Node floor is unchanged. Fix the version number.
2. Section 9 says rollback is "redeploying the previous image tag". `push2gke_artifact.sh` runs `gcloud artifacts docker images delete --delete-tags` before every push, so no previous tag survives. Replace that sentence with: rollback is reverting the commits and rebuilding, which is why `md/` stays in the content repo until this task.

- [ ] **Step 4: Deploy**

```bash
cd ~/code/kyle-server/packages/blog-frontend && yarn webpack-build-prod
cp -R static/. ../blog-backend/static/
cd ~/code/kyle-server/packages/blog-backend && ./push2gke_artifact.sh
kubectl rollout restart deployment/site-app-server-deployment
kubectl rollout status deployment/site-app-server-deployment
```

- [ ] **Step 5: Verify production**

```bash
for path in /blog /blog/ethereum-event-object /blog/tags/ethereum /blog/rss.xml \
            /blog/index.json /blog/sitemap-index.xml /blog/ethereum-event-object.md \
            / /devrel /robots.txt; do
  printf '%-40s %s\n' "$path" "$(curl -s -o /dev/null -w '%{http_code}' "https://jungho.dev$path")"
done
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://jungho.dev/blog/eth
curl -s -o /dev/null -w '%{http_code}\n' https://jungho.dev/blog/definitely-not-a-post
```

Expected: `200` for every path in the loop, `301 -> /blog/ethereum-event-object`, and `404` for the unknown post.

- [ ] **Step 6: Verify the reading experience at three widths**

Use Playwright against `https://jungho.dev/blog/project-initial-setup` at 1280×800, 834×1112 and 390×844. Check at each width:

1. No horizontal page scroll — `document.documentElement.scrollWidth <= window.innerWidth`.
2. Code blocks scroll inside themselves rather than widening the page.
3. At 1280 the table of contents is a sticky rail; at 834 and 390 it is a collapsed `<details>` that opens on tap and closes after selecting an entry.
4. The progress bar advances on scroll.
5. giscus renders a comment box below the article.

- [ ] **Step 7: Check the JavaScript budget**

In the browser devtools Network panel on `https://jungho.dev/blog/project-initial-setup`, filter to JS and record the transferred total, excluding the lazily loaded giscus iframe. Expected: under 10 KB. If it is larger, find which component pulled in a client bundle — the only intended client scripts are the table-of-contents scroll spy and the progress bar.

- [ ] **Step 8: Confirm the Go proxy is untouched**

```bash
cd packages/ingress-reverse-proxy && go build ./... && go test ./...
git diff --stat HEAD~15 -- packages/ingress-reverse-proxy
```

Expected: build and tests pass; the only changed files are `config/dev-links.yaml` and `public/root/robots.txt`.

- [ ] **Step 9: Retire the old content layout**

Only after Steps 5–7 pass in production:

```bash
cd ~/code/blog
git rm -r md sort
git commit -m "chore: remove the pre-frontmatter content layout"
git push
```

Wait for one cron cycle (10 minutes) and re-run Step 5. If anything regresses, `git revert` this commit and the site's previous build is still being served.

- [ ] **Step 10: Commit**

```bash
cd ~/code/kyle-server
git add packages/ingress-reverse-proxy/public/root/robots.txt \
        docs/superpowers/specs/2026-09-04-blog-overhaul-design.md
git commit -m "chore: expose the blog sitemap and remove the dead markdown converter"
```

---

## Self-Review

**Spec coverage.** Every numbered spec section maps to at least one task: §1 serving → Tasks 3, 11; §2 pipeline → Tasks 12, 13; §3 content repo → Tasks 5, 10; §4 article page → Tasks 7, 9; §5 list page → Tasks 6, 8; §6 root entry points → Tasks 1, 2, 4, 14; §7 deletions → Tasks 11, 14, 15; §8 verification → the test steps in every task plus Task 15 Steps 5–8; §9 rollout order → Tasks 10, 13, 15; §10 out of scope → nothing added; §11 prerequisites → Task 9.

**Two spec corrections are folded in, not papered over.** The framework is Astro 7.3.1 rather than 6, and image-tag rollback does not exist because the push script deletes prior tags — Task 15 Step 3 rewrites both statements in the spec.

**Four defects found and fixed during review, kept here so they are not
reintroduced.**

1. Task 10 originally showed a `git mv` block before saying to use `cp` — an
   executor reading top-to-bottom would have emptied `md/` and blanked the
   live blog. The `git mv` block is gone.
2. `createApp` originally let unmatched `/api/*` paths fall through to the SPA
   catch-all, so every deleted blog endpoint would have answered `200` with a
   page of HTML — and Task 11's own test asserting they no longer respond
   `200` would have failed. An `/api` 404 handler now sits before the
   catch-all.
3. `build-blog.sh` used `exec flock -n … || fallback`. `exec` replaces the
   shell, so the fallback was unreachable and a lock conflict would have
   exited 1 instead of 0 — turning a harmless overlap into a cron failure.
   It now re-enters under `flock -n -E 99` and checks the status.
4. Task 6's cover-image verification contained a stray `printf` line marked
   "do not use". Removed.

**Known soft spots, called out rather than hidden.**

- Whether `base: '/blog'` nests the build output is observed in Task 3 Step 7 rather than assumed; the test helper and `build-blog.sh` handle both shapes.
- `rehype-slug`'s exact slug for Korean headings is not asserted; Task 7 Step 9 says to relax that one assertion to "headings have ids" if the transliteration differs.
- Markup-only changes in the Solid SPA (Task 2) get a build plus a scripted browser check instead of a unit test, because the package has no DOM test harness. The nav _data_ those changes render is unit-tested in Task 1.
