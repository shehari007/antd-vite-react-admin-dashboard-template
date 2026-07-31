import { Link } from 'react-router-dom';
import {
  ExportOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  LayoutOutlined,
  IdcardOutlined,
  SafetyOutlined,
  WarningOutlined,
} from '@ant-design/icons';

/* Group accents, normalised to one lightness band on the #101B34 rail (7.9:1 —
 * 9.2:1) so no section optically shouts. Applied as a custom property rather
 * than an inline `color`, because an inline colour beats every token-generated
 * rule — which is why the selected icon used to stay pastel on the pill. */
const groupIcon = (Component, accent) => <Component style={{ '--nav-accent': accent }} />;

const nav = (to, label) => ({ key: to, label: <Link to={to}>{label}</Link> });

/* Auth pages are full-page shells outside /dashboard, so navigating in place
 * would strand a demo user with no way back — they stay new-tab on purpose.
 * The marker goes in antd's `extra` slot, which is flush-right via
 * `margin-inline-start: auto`, so it can never be clipped by the label's
 * ellipsis box the way an in-label icon was. */
const ext = (to, label) => ({
  key: `ext:${to}`,
  label: (
    <a
      href={to}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
    >
      {label}
    </a>
  ),
  extra: <ExportOutlined style={{ fontSize: 11 }} />,
});

/* Children carry no icon. The group hue was previously repeated on every child,
 * where it distinguished nothing from its siblings, and dropping it is what
 * puts child text at exactly x=56 — under the parent's text — with no CSS
 * fighting rc-menu's inline padding-left. */
const navSections = [
  {
    type: 'group',
    key: 'sec-workspace',
    label: 'Workspace',
    children: [
      {
        key: 'overview',
        label: 'Overview',
        icon: groupIcon(DashboardOutlined, '#7CB8FF'),
        children: [
          nav('/dashboard/home', 'Dashboard'),
          nav('/dashboard/analytics', 'Analytics'),
          nav('/dashboard/calendar', 'Calendar'),
        ],
      },
      {
        key: 'management',
        label: 'Management',
        icon: groupIcon(AppstoreOutlined, '#63CE92'),
        children: [
          nav('/dashboard/users', 'Users'),
          nav('/dashboard/tables', 'Projects'),
          nav('/dashboard/kanban', 'Kanban Board'),
          nav('/dashboard/invoices', 'Invoices'),
        ],
      },
    ],
  },
  {
    type: 'group',
    key: 'sec-library',
    label: 'Page Library',
    children: [
      {
        key: 'templates',
        label: 'Templates',
        icon: groupIcon(LayoutOutlined, '#4BC8C4'),
        children: [
          nav('/dashboard/forms', 'Forms'),
          nav('/dashboard/pricing', 'Pricing'),
          nav('/dashboard/chat', 'Chat'),
          nav('/dashboard/faq', 'Help Center'),
          nav('/dashboard/blank', 'Blank Page'),
        ],
      },
      {
        key: 'auth-pages',
        label: 'Auth Pages',
        icon: groupIcon(SafetyOutlined, '#E8A94F'),
        children: [
          ext('/signin', 'Sign In'),
          ext('/signup', 'Sign Up'),
          ext('/forgot-password', 'Forgot Password'),
        ],
      },
      {
        key: 'error-pages',
        label: 'Error Pages',
        icon: groupIcon(WarningOutlined, '#FF9A9C'),
        children: [
          nav('/dashboard/errors/400', '400 Bad Request'),
          nav('/dashboard/errors/403', '403 Forbidden'),
          nav('/dashboard/errors/404', '404 Not Found'),
          nav('/dashboard/errors/500', '500 Server Error'),
        ],
      },
    ],
  },
  {
    type: 'group',
    key: 'sec-account',
    label: 'Account',
    children: [
      {
        key: 'account',
        label: 'Account',
        icon: groupIcon(IdcardOutlined, '#F58FC9'),
        children: [
          nav('/dashboard/profile', 'Profile'),
          nav('/dashboard/settings', 'Settings'),
        ],
      },
    ],
  },
];

/**
 * Mark the group owning the current route.
 *
 * Collapsed, a group's children live in a portaled flyout, so neither
 * `:has(.ant-menu-item-selected)` nor anything else in the rail's own subtree
 * can see which section is active — and antd styles `ant-menu-submenu-selected`
 * with a text colour only, no pill or bar. Deriving the class here keeps the
 * collapsed active state independent of rc-menu's internal path registration.
 */
export const buildNavItems = (activeRootKey) =>
  navSections.map((section) => ({
    ...section,
    children: section.children.map((group) =>
      group.key === activeRootKey
        ? { ...group, className: 'app-nav__group--active' }
        : group
    ),
  }));

export const ROOT_KEYS = [
  'overview',
  'management',
  'templates',
  'auth-pages',
  'error-pages',
  'account',
];

/* Titles for the collapsed flyout panels — collapsed, the glyph alone would
 * have to carry the section's identity otherwise. */
export const SECTION_LABEL = {
  overview: 'Overview',
  management: 'Management',
  templates: 'Templates',
  'auth-pages': 'Auth Pages',
  'error-pages': 'Error Pages',
  account: 'Account',
};

/** Every routable leaf key, longest first, for prefix matching. */
const LEAF_KEYS = (function collect(nodes, acc = []) {
  nodes.forEach((node) => {
    if (node.children) collect(node.children, acc);
    else if (node.key.startsWith('/')) acc.push(node.key);
  });
  return acc;
})(navSections).sort((a, b) => b.length - a.length);

/**
 * Resolve a pathname to a menu key by longest-prefix match.
 *
 * The previous `pathname.split('/').pop()` was lossy: a trailing slash yielded
 * '', /dashboard highlighted nothing, and any two routes sharing a leaf name
 * would both highlight.
 */
export const getSelectedKey = (pathname) => {
  const path = pathname.replace(/\/+$/, '') || '/dashboard';
  return LEAF_KEYS.find((key) => path === key || path.startsWith(`${key}/`));
};

/** Open-key path to a leaf. Skips `type: 'group'` nodes — a group is not an openKey. */
export const findOpenPath = (targetKey, nodes = navSections, path = []) => {
  for (const node of nodes) {
    if (node.key === targetKey) return path;
    if (node.children) {
      const next = node.type === 'group' ? path : [...path, node.key];
      const found = findOpenPath(targetKey, node.children, next);
      if (found) return found;
    }
  }
  return null;
};
