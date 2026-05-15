import { defineCollection, z } from 'astro:content';

/**
 * Registers the `articles` content collection so Astro doesn't
 * auto-generate it (which is deprecated in Astro v5).
 * The schema is intentionally loose — authoritative article metadata
 * lives in src/data/articles.ts; MDX files are loaded dynamically
 * via import.meta.glob inside ArticleBody.tsx.
 */
const articles = defineCollection({
  type: 'content',
  schema: z.object({}).passthrough(),
});

export const collections = { articles };
