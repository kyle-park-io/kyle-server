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
