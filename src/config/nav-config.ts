import { NavItem } from '@/types';

/**
 * Navigation configuration
 *
 * Public nav items are used in the marketing/product pages header.
 * Dashboard nav items are used in the authenticated sidebar.
 */

// Public navigation (top-level site pages)
export const publicNavItems: NavItem[] = [
  {
    title: 'Home',
    url: '/',
    icon: 'home',
    isActive: false,
    items: []
  },
  {
    title: 'Showcase',
    url: '/projects',
    icon: 'folder',
    isActive: false,
    items: []
  },
  {
    title: 'SaaS Projects',
    url: '/saas-projects',
    icon: 'folder',
    isActive: false,
    items: []
  },
  {
    title: 'About',
    url: '/about',
    icon: 'user',
    isActive: false,
    items: []
  },
  {
    title: 'Brand',
    url: '/brand',
    icon: 'palette',
    isActive: false,
    items: []
  }
];

// Dashboard sidebar navigation (authenticated)
export const navItems: NavItem[] = [
  {
    title: 'Overview',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'MCP',
    url: '/dashboard/mcp',
    icon: 'shield',
    isActive: false,
    shortcut: ['m', 'm'],
    items: []
  },
  {
    title: 'Training',
    url: '/dashboard/training',
    icon: 'brain',
    isActive: false,
    shortcut: ['t', 't'],
    items: []
  },
  {
    title: 'Referrals',
    url: '/dashboard/referrals',
    icon: 'link',
    isActive: false,
    shortcut: ['r', 'r'],
    items: []
  },
  {
    title: 'Account',
    url: '#',
    icon: 'account',
    isActive: true,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'profile',
        shortcut: ['p', 'p']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  }
];
