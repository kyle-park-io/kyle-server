export interface NavItem {
  label: string;
  href: string;
  /** Optional accent class suffix, e.g. `nyt-header__nav-link--devrel`. */
  variant?: 'devrel' | 'quant' | 'personal-quant';
}

/** Header navigation, in display order. */
export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
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
