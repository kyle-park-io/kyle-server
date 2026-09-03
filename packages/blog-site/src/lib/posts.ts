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
