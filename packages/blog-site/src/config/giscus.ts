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
  categoryId: 'DIC_kwDOK0SBsM4DE083',
} as const;
