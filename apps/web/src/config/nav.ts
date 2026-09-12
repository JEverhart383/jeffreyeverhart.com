export interface NavLink {
  label: string;
  /** Omit on a parent with `children` — it becomes a menu label, not a link. */
  href?: string;
  /** Opens in a new tab */
  external?: boolean;
  /** Renders as a dropdown on desktop and an indented group on mobile. */
  children?: NavLink[];
}

/**
 * Top-level navigation links, in display order.
 * Add, remove, or reorder entries here to change the nav everywhere.
 * Use any href: content pages (/about), named routes (/blog), or external URLs.
 */
export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  {
    // A parent with both an href and children is a link *and* a dropdown:
    // /work is the CV, and everything it collects hangs beneath it.
    label: 'Work',
    href: '/work',
    children: [
      { label: 'CV', href: '/work' },
      { label: 'Projects', href: '/work/projects' },
      { label: 'Videos', href: '/work/videos' },
      { label: 'Writing Elsewhere', href: '/work/writing' },
      { label: 'Talks & Appearances', href: '/work/talks' },
      { label: '3D Models', href: '/work/models' },
      { label: 'Builds', href: '/work/builds' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
