// Build output observed 2026-09-04 with astro 7.3.1: pages land at
// dist/index.html (base is applied to URLs, not to the output tree), so
// express mounts `dist` itself at /blog. build-blog.sh re-checks this.
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
