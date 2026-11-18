import type { Lang } from './i18n.ts';

const CHARS_PER_MINUTE = 500;

/**
 * Brysbaert (2019), "How many words do we read per minute? A review and
 * meta-analysis of reading rate", Journal of Memory and Language 109, 104047,
 * https://doi.org/10.1016/j.jml.2019.104047. Abstract: "the average silent
 * reading rate for adults in English is 238 words per minute (wpm) for
 * non-fiction and 260 wpm for fiction." These posts are non-fiction.
 */
const EN_WORDS_PER_MINUTE = 238;

/**
 * Approximate reading time in minutes, ignoring fenced code blocks.
 *
 * Korean counts non-whitespace characters: word counting is meaningless for
 * Korean. English counts whitespace-separated words, since 500 characters a
 * minute would roughly double an English post's estimate.
 */
export function readingMinutes(markdown: string, lang: Lang = 'ko'): number {
  const prose = markdown.replace(/```[\s\S]*?```/g, '');
  if (lang === 'en') {
    const words = prose.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / EN_WORDS_PER_MINUTE));
  }
  const chars = prose.replace(/\s+/g, '').length;
  return Math.max(1, Math.ceil(chars / CHARS_PER_MINUTE));
}
