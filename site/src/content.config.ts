import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Chapters live OUTSIDE the site project, in the creative layer. We read them in
// place with a glob loader (single source of truth — no copy step). The base
// path has spaces and a leading "01. "; that's fine, `base` is a literal dir and
// `pattern` is a separate glob. `m[0-9]*_*.md` matches the 25 chapter files
// (m1_01..m4_25) and excludes the 00_*.md outline/summary files beside them.
//
// The frontmatter is authored richly; we validate the fields the site uses and
// keep the rest via .passthrough() so the schema never fights the prose.
const chapters = defineCollection({
  loader: glob({
    pattern: 'm[0-9]*_*.md',
    base: '../stories/01. The Case of the Missing Hot Sauce/chapters',
  }),
  schema: z
    .object({
      chapter: z.number().int(),
      title: z.string(),
      meal: z.number().int(),
      beat: z.string().optional(),
      day: z.string().optional(),
      // storyDate — a single ISO date or a "start to end" range for multi-day beats
      date: z.string().optional(),
      time: z.string().optional(),
      pov: z.string().optional(),
      location: z.array(z.string()).default([]),
      characters_present: z.array(z.string()).default([]),
      characters_referenced: z.array(z.string()).default([]),
      // Drip serialization is config, not a feature build: when populated, the
      // chapter is only published on/after this date (see pages filtering).
      publishDate: z.coerce.date().optional(),
    })
    .passthrough(),
});

export const collections = { chapters };
