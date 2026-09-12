import { defineCollection, reference, z } from 'astro:content';

/**
 * Organizations are the entity table: companies, universities, clients, and
 * publications. They're the stable join key for everything else.
 *
 * `positions` is what puts an org on the CV. An org with no positions is just a
 * venue you published through — it still gathers content, but doesn't claim you
 * worked there. Titles live *inside* the org because you can hold several at one
 * company, and a project done there shouldn't have to pick which one.
 */
const organizations = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    /**
     * CV bullets: what you accomplished here, one claim per entry.
     *
     * Shown only on /work. The org's own page renders the body instead, so the
     * two are never seen together — write them as separate pieces rather than
     * letting one be a truncation of the other.
     */
    highlights: z.array(z.string()).default([]),
    kind: z
      .enum(['company', 'university', 'nonprofit', 'client', 'freelance', 'publication'])
      .default('company'),
    url: z.string().url().optional(),
    logo: z.string().optional(),
    location: z.string().optional(),
    positions: z
      .array(
        z.object({
          title: z.string(),
          startDate: z.coerce.date(),
          /** Omit for the role you currently hold. */
          endDate: z.coerce.date().optional(),
          summary: z.string().optional(),
        })
      )
      .default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/**
 * Points at a captured copy under `/archive` at the repo root.
 *
 * The entry itself is only a *pointer* to where something lives; the archive is
 * a snapshot of what was actually there. Nothing under `/archive` is part of the
 * site build — it exists so that when a link rots, the content isn't gone too.
 *
 * When an original disappears, set `linkStatus: 'dead'`. Cards stop linking out
 * and say so, and the captured copy under `/archive/<slug>` is what's left.
 */
const archiveRef = z.object({
  /** Directory name under `/archive`. Conventionally matches the entry slug. */
  slug: z.string(),
  capturedAt: z.coerce.date(),
  linkStatus: z.enum(['live', 'dead', 'moved']).default('live'),
  /** Where it moved to, when `linkStatus` is 'moved'. */
  movedTo: z.string().url().optional(),
});

/** Fields every content type carries, whatever medium it is. */
const base = {
  title: z.string(),
  date: z.coerce.date(),
  summary: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  archive: archiveRef.optional(),
  /**
   * Who this was for. A reference rather than free text so the join key is
   * spell-checked at build time and every org page can gather its own work.
   */
  org: reference('organizations').optional(),
};

/**
 * Links an artifact up to the initiative it belongs to. Set once, here — the
 * project page computes its own backlinks, so nothing is maintained twice.
 */
const belongsToProject = { project: reference('projects').optional() };

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
    archive: archiveRef.optional(),
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

/**
 * Video work — your own channel and videos made for other people.
 * Leave `publisher` off for anything on your own channel.
 */
const videos = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    ...belongsToProject,
    url: z.string().url(),
    platform: z.enum(['youtube', 'vimeo', 'other']).default('youtube'),
    /** YouTube ID. Supplies the embed and the thumbnail, so `image` is optional. */
    videoId: z.string().optional(),
    /** Whose channel it went out on. Omit for anything on my own. */
    publisher: z.string().optional(),
    /** Groups multi-part runs on an index page. */
    series: z.string().optional(),
    durationSeconds: z.number().int().positive().optional(),
    /** Overrides the thumbnail derived from `videoId`. */
    image: z.string().optional(),
  }),
});

/**
 * Writing published somewhere other than this site — guest posts, docs,
 * newsletters. Your own posts belong in `blog`.
 */
const writing = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    ...belongsToProject,
    url: z.string().url(),
    /** Required: if it were self-published it would be a blog post. */
    org: reference('organizations'),
    /**
     * Where it ran, as a reader would name it: "Mux", "Smashing Magazine".
     * Free text rather than a reference, because `org` is who the work was *for*
     * and a one-off venue shouldn't have to become an entity to be credited.
     */
    publisher: z.string().optional(),
    kind: z
      .enum(['guest-post', 'article', 'documentation', 'newsletter', 'whitepaper'])
      .default('article'),
    coAuthors: z.array(z.string()).default([]),
    image: z.string().optional(),
  }),
});

/**
 * Anywhere you showed up to talk: podcasts, conferences, webinars, panels.
 */
const talks = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    ...belongsToProject,
    format: z.enum([
      'podcast',
      'conference',
      'meetup',
      'webinar',
      'panel',
      'livestream',
      'interview',
    ]),
    /** The show or event: "Syntax.fm", "JSConf US 2023". */
    venue: z.string(),
    /** Episode number or title, for podcasts. */
    episode: z.string().optional(),
    location: z.string().optional(),
    /** Listen/watch link. Absent for things that were never recorded. */
    url: z.string().url().optional(),
    slidesUrl: z.string().url().optional(),
    recordingUrl: z.string().url().optional(),
    hosts: z.array(z.string()).default([]),
    /** YouTube ID for a recording. Supplies the embed and the thumbnail. */
    videoId: z.string().optional(),
    durationSeconds: z.number().int().positive().optional(),
    image: z.string().optional(),
  }),
});

/**
 * 3D models. Unlike the other three, these live here rather than elsewhere,
 * so each one gets a real page with renders, print notes, and downloads.
 */
const models = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    ...belongsToProject,
    /** A model often crosses tools — modelled in FreeCAD, rendered in Blender. */
    tools: z
      .array(z.enum(['blender', 'freecad', 'openscad', 'fusion360', 'tinkercad', 'other']))
      .default([]),
    heroImage: z.string().optional(),
    /** Additional renders or photos of the printed object. */
    images: z.array(z.string()).default([]),
    /** Printables / MakerWorld / Thingiverse / GitHub listing. */
    sourceUrl: z.string().url().optional(),
    downloads: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    license: z.string().optional(),
    printSettings: z
      .object({
        layerHeight: z.string(),
        infill: z.string(),
        material: z.string(),
        supports: z.boolean(),
        printTimeMinutes: z.number().int().positive(),
      })
      .partial()
      .optional(),
    status: z.enum(['concept', 'in-progress', 'printed', 'published']).default('published'),
  }),
});

/**
 * Bigger initiatives that don't reduce to a single video, post, or talk —
 * things with a span of time, a stack, and usually several other entries
 * orbiting them. Like `models`, these live here and get a real page.
 *
 * This is not `work` (the narrative page of roles and employers): a project is
 * one initiative, which may or may not have happened inside a job.
 */
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    /** `date` is when it started. Leave `endDate` off for ongoing work. */
    endDate: z.coerce.date().optional(),
    status: z.enum(['active', 'completed', 'maintained', 'archived']).default('completed'),
    /**
     * What you did on *this* project specifically: "Tech lead", "Sole developer".
     * Distinct from the titles on the org, which cover the whole tenure.
     */
    role: z.string().optional(),
    tech: z.array(z.string()).default([]),
    collaborators: z.array(z.string()).default([]),
    /** The thing itself, if it's still up. */
    url: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    /** Anything else worth pointing at: a case study, a launch post, press. */
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
    heroImage: z.string().optional(),
    images: z.array(z.string()).default([]),
  }),
});

/**
 * Things built in the physical world: woodworking, and Raspberry Pi /
 * microcontroller electronics. Like `models` and `projects`, these live here and
 * get a real page — the photos, the cut list, and the wiring are the content.
 *
 * One collection rather than two because the interesting builds are `mixed`:
 * a Pi that ends up inside a box you made. `kind` sorts them out; the
 * type-specific fields are all optional, so a shelf carries `materials` and a
 * sensor rig carries `components` without either schema pretending to be both.
 */
const builds = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    ...belongsToProject,
    kind: z.enum(['woodworking', 'electronics', 'mixed']).default('woodworking'),
    /** `date` is when it was finished — or started, on anything still open. */
    status: z.enum(['planned', 'in-progress', 'complete', 'retired']).default('complete'),
    /** Stock and hardware: "walnut", "baltic birch ply", "8020 extrusion". */
    materials: z.array(z.string()).default([]),
    /** Boards, sensors, and modules: "Pi Zero 2 W", "DHT22", "ESP32-C3". */
    components: z.array(z.string()).default([]),
    /**
     * What it was built *with* — "table saw", "soldering iron", "MicroPython".
     * Free text, unlike the software enum on `models`: a shop has a long tail.
     */
    tools: z.array(z.string()).default([]),
    /** Finished size, however you'd describe it out loud: "72 x 30 x 29 in". */
    dimensions: z.string().optional(),
    /** Woodworking only: "shellac + wax", "Rubio Monocoat". */
    finish: z.string().optional(),
    /** Rough hours at the bench. Useful context on anything ambitious. */
    buildTimeHours: z.number().positive().optional(),
    /** Roughly what it cost to make: "~$140 in lumber and hardware". */
    cost: z.string().optional(),
    /** Firmware, control code, or CAD kept in version control. */
    repoUrl: z.string().url().optional(),
    /** Someone else's plans, tutorial, or parts list that this followed. */
    plansUrl: z.string().url().optional(),
    /** Printed parts this build used. Gives the model a reason to exist. */
    models: z.array(reference('models')).default([]),
    /** Cut lists, wiring diagrams, SVGs — anything worth handing over. */
    downloads: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    heroImage: z.string().optional(),
    /** Progress shots and finished photos. */
    images: z.array(z.string()).default([]),
  }),
});

export const collections = {
  blog,
  pages,
  organizations,
  projects,
  videos,
  writing,
  talks,
  models,
  builds,
};
