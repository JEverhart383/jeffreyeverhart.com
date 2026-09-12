import { getCollection } from 'astro:content';
import { published, byDateDesc, refMatches, hasBody } from './collections';

/**
 * Backlinks are computed, never authored. An artifact names its project and its
 * org once in frontmatter; the project and org pages find their own children by
 * scanning. Nothing has to be kept in sync in two places.
 */

/**
 * Loads every org once and hands back lookups by reference. Pages call this at
 * the top rather than resolving each reference individually.
 *
 * Drafts are included deliberately: a draft org still has to render its name for
 * whatever points at it.
 */
export async function orgResolver() {
  const orgs = await getCollection('organizations');
  const bySlug = new Map(orgs.map((org) => [org.slug, org]));

  const entry = (ref?: { slug?: string; id?: string }) => {
    const slug = ref?.slug ?? ref?.id;
    return slug ? bySlug.get(slug) : undefined;
  };

  return {
    entry,
    name: (ref?: { slug?: string; id?: string }) => entry(ref)?.data.name,
    href: (ref?: { slug?: string; id?: string }) => {
      const org = entry(ref);
      return org ? `/work/orgs/${org.slug}` : undefined;
    },
  };
}

interface Position {
  startDate: Date;
  endDate?: Date;
}

/**
 * The full span across every title held at an org — earliest start to latest
 * end. A missing `endDate` on any position means you're still there.
 */
export function tenure(positions: Position[]): { start?: Date; end?: Date; current: boolean } {
  if (positions.length === 0) return { current: false };

  const current = positions.some((position) => !position.endDate);
  const start = new Date(Math.min(...positions.map((p) => p.startDate.valueOf())));
  const end = current
    ? undefined
    : new Date(Math.max(...positions.map((p) => p.endDate!.valueOf())));

  return { start, end, current };
}

export const ARTIFACT_COLLECTIONS = ['videos', 'writing', 'talks', 'models', 'builds'] as const;
export type ArtifactCollection = (typeof ARTIFACT_COLLECTIONS)[number];

export interface ArtifactLink {
  collection: ArtifactCollection;
  title: string;
  date: Date;
  href: string;
  external: boolean;
}

const LABELS: Record<ArtifactCollection, { singular: string; plural: string }> = {
  videos: { singular: 'video', plural: 'videos' },
  writing: { singular: 'post', plural: 'posts' },
  talks: { singular: 'talk', plural: 'talks' },
  models: { singular: 'model', plural: 'models' },
  builds: { singular: 'build', plural: 'builds' },
};

/** "3 videos · 1 post". Empty groups are dropped. */
export function summarizeCounts(links: ArtifactLink[]): string {
  return ARTIFACT_COLLECTIONS.map((collection) => {
    const count = links.filter((link) => link.collection === collection).length;
    if (count === 0) return null;
    const label = LABELS[collection];
    return `${count} ${count === 1 ? label.singular : label.plural}`;
  })
    .filter(Boolean)
    .join(' · ');
}

/**
 * Where a card should point. Models, builds, videos, and talks have pages here
 * when there's something to show; writing always lives on someone else's site.
 */
function resolveHref(collection: ArtifactCollection, entry: any): { href: string; external: boolean } {
  const dead = entry.data.archive?.linkStatus === 'dead';

  if (collection === 'models' || collection === 'builds') {
    return { href: `/work/${collection}/${entry.slug}`, external: false };
  }
  if ((collection === 'videos' || collection === 'talks') && hasBody(entry)) {
    return { href: `/work/${collection}/${entry.slug}`, external: false };
  }

  const url = entry.data.url ?? entry.data.recordingUrl ?? entry.data.slidesUrl;
  // A dead link is worse than no link — fall back to the index page.
  if (!url || dead) return { href: `/work/${collection}`, external: false };
  return { href: url, external: true };
}

async function loadArtifacts(): Promise<Array<{ collection: ArtifactCollection; entry: any }>> {
  const groups = await Promise.all(
    ARTIFACT_COLLECTIONS.map(async (collection) => {
      const entries = await getCollection(collection, published);
      return entries.map((entry) => ({ collection, entry }));
    })
  );
  return groups.flat();
}

function toLink(collection: ArtifactCollection, entry: any): ArtifactLink {
  return {
    collection,
    title: entry.data.title,
    date: entry.data.date,
    ...resolveHref(collection, entry),
  };
}

/** Everything that named this project. */
export async function artifactsForProject(projectSlug: string): Promise<ArtifactLink[]> {
  const all = await loadArtifacts();
  return all
    .filter(({ entry }) => refMatches(entry.data.project, projectSlug))
    .map(({ collection, entry }) => toLink(collection, entry))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

/**
 * Everything that named this org — directly, or through a project that did.
 * A video made for WP Engine shows up on their page whether or not it was ever
 * filed under a specific project.
 */
export async function artifactsForOrg(orgSlug: string): Promise<ArtifactLink[]> {
  const [all, projects] = await Promise.all([
    loadArtifacts(),
    getCollection('projects', published),
  ]);

  const orgProjectSlugs = new Set(
    projects.filter((p) => refMatches(p.data.org, orgSlug)).map((p) => p.slug)
  );

  return all
    .filter(
      ({ entry }) =>
        refMatches(entry.data.org, orgSlug) ||
        orgProjectSlugs.has(refSlugOf(entry.data.project))
    )
    .map(({ collection, entry }) => toLink(collection, entry))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

function refSlugOf(ref: { slug?: string; id?: string } | undefined): string {
  return ref?.slug ?? ref?.id ?? '';
}

/** Projects done at this org, newest first. */
export async function projectsForOrg(orgSlug: string) {
  const projects = await getCollection('projects', published);
  return projects.filter((project) => refMatches(project.data.org, orgSlug)).sort(byDateDesc);
}
