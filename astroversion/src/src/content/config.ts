/// <reference types="astro/client" />

import { defineCollection, z } from 'astro:content';

const commonFields = {
  title: z.string(),
  summary: z.string().max(280).optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(true),
  date: z.string().transform(str => new Date(str))
};

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    ...commonFields,
    image: z.string().optional(),
    repo: z.string().url().optional(),
    link: z.string().url().optional(),
    stack: z.array(z.string()).default([])
  })
});

// 3D Design / CAD models
const design = defineCollection({
  type: 'content',
  schema: z.object({
    ...commonFields,
    image: z.string().optional(),
    repo: z.string().url().optional(),
    link: z.string().url().optional(),
    stack: z.array(z.string()).default([])
  })
});

const art = defineCollection({
  type: 'content',
  schema: z.object({
    ...commonFields,
    medium: z.string().optional(),
    image: z.string().optional()
  })
});

const reviews = defineCollection({
  type: 'content',
  schema: z.object({
    ...commonFields,
    book: z.string(),
    author: z.string(),
    rating: z.number().min(0).max(5).optional()
  })
});

const thoughts = defineCollection({
  type: 'content',
  schema: z.object({
    ...commonFields,
    topic: z.string().optional()
  })
});

export const collections = { projects, design, art, reviews, thoughts };
