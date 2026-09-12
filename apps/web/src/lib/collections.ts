/**
 * Small helpers shared by the collection index pages.
 */

/** What `reference()` resolves to. Legacy collections key on `slug`. */
type EntryRef = { collection: string; slug?: string; id?: string };

/**
 * The slug a reference points at. Legacy content collections expose `slug` and
 * the content-layer API exposes `id`; read whichever is there so a future
 * migration doesn't silently break every cross-link.
 */
export function refSlug(ref: EntryRef | undefined): string | undefined {
  if (!ref) return undefined;
  return ref.slug ?? ref.id;
}

/** Whether a reference points at a given entry slug. */
export function refMatches(ref: EntryRef | undefined, slug: string): boolean {
  return refSlug(ref) === slug;
}

/**
 * Drafts render in `astro dev` so you can preview them, but never in a build.
 * Pass as the second argument to `getCollection`.
 */
export function published<T extends { data: { draft: boolean } }>(entry: T): boolean {
  return import.meta.env.DEV || !entry.data.draft;
}

/**
 * Whether an entry has commentary worth a page of its own.
 *
 * Not just `entry.body.trim()`: Astro leaves `body` undefined for a file that is
 * frontmatter and nothing else. Drafts are the usual source of those, and drafts
 * only render in `astro dev` — so reading `.body` directly blows up in dev while
 * the production build stays green.
 */
export function hasBody(entry: { body?: string }): boolean {
  return (entry.body ?? '').trim().length > 0;
}

/** Newest first. */
export function byDateDesc<T extends { data: { date: Date } }>(a: T, b: T): number {
  return b.data.date.valueOf() - a.data.date.valueOf();
}

/**
 * Always format dates in UTC.
 *
 * YAML parses a date-only value like `2018-04-10` as UTC midnight. Formatting
 * that in a negative-offset local zone rolls it back a day — "April 9, 2018" —
 * so every date on the site must be read in the zone it was written in.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** "Mar 2024", for CV position ranges. */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' });
}

/** The year as written, not as shifted by the reader's timezone. */
export function yearOf(date: Date): number {
  return date.getUTCFullYear();
}

/** YouTube's derived thumbnail, so videos don't need a hand-made image. */
export function youtubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * "2019 – 2021", "2023 – present", or just "2020" for something that started
 * and finished in the same year. Projects span time; a single date undersells it.
 */
export function formatYearRange(start: Date, end?: Date, ongoing = false): string {
  const startYear = start.getUTCFullYear();
  if (!end) return ongoing ? `${startYear} – present` : String(startYear);

  const endYear = end.getUTCFullYear();
  return endYear === startYear ? String(startYear) : `${startYear} – ${endYear}`;
}

/** "1:04:12" / "8:31" from a duration in seconds. */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}
