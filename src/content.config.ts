import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Registers the `articles` content collection (one entry per MDX file).
 * The schema is intentionally loose — authoritative article metadata
 * lives in src/data/articles.ts; /article/[slug] renders each MDX file
 * from this collection at build time.
 */
const articles = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/articles' }),
  schema: z.object({}).passthrough(),
});

export const collections = { articles };
