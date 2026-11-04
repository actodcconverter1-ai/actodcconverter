import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string(),
    image: z.string(), imageAlt: z.string(), author: z.string(), pubDate: z.coerce.date(), updatedDate: z.coerce.date().optional(),
    categories: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(1), tags: z.array(z.string()),
    seoTitle: z.string(), metaDescription: z.string(), status: z.enum(['draft', 'published', 'trash']).default('published'),
  }).refine(data => !data.updatedDate || data.updatedDate >= data.pubDate, { message: 'Updated date must not precede publication.' }),
});
export const collections = { blog };
