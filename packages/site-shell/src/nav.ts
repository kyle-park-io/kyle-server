export interface NavItem {
  label: string;
  href: string;
  /** Optional accent class suffix, e.g. `nyt-header__nav-link--devrel`. */
  variant?: 'devrel' | 'quant' | 'personal-quant';
  /**
   * Set when `href` is not an SPA route — a path a plain server (or a
   * different app entirely, e.g. the statically-built blog) owns instead.
   * Consumers that do client-side routing (like the SolidJS shell's
   * Header) must render these with `rel="external"` so the router's
   * global anchor interception lets the browser navigate there for real,
   * rather than resolving the click against its own catch-all route.
   * Consumers with no client router (the Astro shell) can ignore it.
   */
  external?: boolean;
}

/** Header navigation, in display order. */
export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog', external: true },
  { label: 'DevRel', href: '/devrel', variant: 'devrel' },
  { label: 'Quant', href: '/quant', variant: 'quant' },
  { label: 'P.Quant', href: '/personal-quant', variant: 'personal-quant' },
  { label: 'Profile', href: '/profile' },
];

/** Secondary destinations, shown in the offcanvas panel behind the ☰ button. */
export const offcanvasItems: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Chat', href: '/chat' },
];
