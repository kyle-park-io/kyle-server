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

/** The slice of hast this wrapper touches; the full types live in @types/hast. */
interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}
type HastParent = HastNode & { children: HastNode[] };

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
  integrations: [
    sitemap({
      // Every canonical URL on this site is trailing-slash-free
      // (trailingSlash: 'never' above), including the blog index itself
      // (`/blog`). @astrojs/sitemap otherwise derives `/blog/` for that
      // route from the route pattern, disagreeing with its own canonical
      // link. Strip a trailing slash from every entry so the sitemap
      // always matches the canonical form.
      serialize(item) {
        return { ...item, url: item.url.replace(/\/+$/, '') };
      },
    }),
  ],
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
      () => (tree: HastParent) => {
        // Walks every depth, not just the root's direct children, so a
        // <pre> or <table> nested inside a <blockquote> or <li> is still
        // wrapped. In-place replacement (no splice) keeps each array's
        // length stable and every index visited exactly once.
        const wrap = (parent: HastParent): void => {
          if (!parent || !Array.isArray(parent.children)) return;
          for (let i = 0; i < parent.children.length; i += 1) {
            const node = parent.children[i];
            if (node.type !== 'element') continue;
            // Recurse first, while `node` still holds its original
            // children, so anything nested inside it (including another
            // table inside a table cell) is found before `node` itself is
            // wrapped and moved under a new div.
            if (Array.isArray(node.children)) wrap(node as HastParent);
            if (node.tagName !== 'pre' && node.tagName !== 'table') continue;
            parent.children[i] = {
              type: 'element',
              tagName: 'div',
              properties: {
                className: [
                  node.tagName === 'pre' ? 'code-scroll' : 'table-scroll',
                ],
              },
              children: [node],
            };
          }
        };
        wrap(tree);
      },
    ],
  },
});
