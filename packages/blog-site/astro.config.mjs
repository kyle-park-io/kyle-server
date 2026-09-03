// Build output observed 2026-09-04 with astro 7.3.1: pages land at
// dist/index.html (base is applied to URLs, not to the output tree), so
// express mounts `dist` itself at /blog. build-blog.sh re-checks this.
//
// package.json also pins a direct `cookie` dependency — do not remove it as
// "redundant with astro's own cookie@^2.0.1". Astro's generated
// dist/.prerender/*.mjs chunk does a bare `import 'cookie'` that resolves
// upward from this package's own root, so `cookie` must sit on this
// package's resolution path. In the yarn workspace, express's exact
// cookie@0.7.1 otherwise wins the hoisted repo-root slot, and the build
// fails with "Named export 'parseCookie' not found". A global yarn
// `resolutions` override is not an alternative: cookie@2.x dropped
// `serialize`, which express calls directly. The pin is inert in the Docker
// image, where the standalone `npm install` hoists astro's own copy anyway.
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
