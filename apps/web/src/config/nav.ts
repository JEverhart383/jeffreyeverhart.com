export interface NavLink {
  label: string;
  href: string;
  /** Opens in a new tab */
  external?: boolean;
}

/**
 * Top-level navigation links, in display order.
 * Add, remove, or reorder entries here to change the nav everywhere.
 * Use any href: content pages (/about), named routes (/blog), or external URLs.
 */
export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Contact', href: '/contact' },
];
