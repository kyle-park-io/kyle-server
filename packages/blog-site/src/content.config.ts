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
