import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string().optional(),
    heroImage: z.string().optional(),
    categories: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    wpId: z.number().optional(),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    wpId: z.number().optional(),
  }),
});

export const collections = { blog, pages };
