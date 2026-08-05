import { Link } from 'react-router-dom';
import {
  AppstoreOutlined,
  DashboardOutlined,
  ExportOutlined,
  IdcardOutlined,
  LayoutOutlined,
  MessageOutlined,
  SafetyOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { ROLES } from '@/context/auth-context';

/* ---------------------------------------------------------------------------
 * The navigation tree
 *
 * This file holds the structure only: keys, icons, roles, and translation keys.
 * The visible text comes from src/i18n/locales/*.json, and the antd menu items
 * are assembled by buildNavItems() further down. Keeping the two apart is what
 * lets the sidebar switch language without the tree being rebuilt by hand.
 *
 * To add a page:
 *   1. add `{ to: '/dashboard/reports', labelKey: 'nav.items.reports' }` to a group
 *   2. add "reports" to nav.items in every locale file
 *   3. add the route in src/routes.jsx
 *
 * `roles` is optional. When present, only those roles see the entry, and the
 * matching route guard in src/routes.jsx enforces the same rule for anyone who
 * types the URL directly. A menu that hides a page is a convenience, never a
 * security boundary.
 * ------------------------------------------------------------------------- */
const NAV_TREE = [
  {
    key: 'sec-workspace',
    labelKey: 'nav.sections.workspace',
    groups: [
      {
        key: 'overview',
        labelKey: 'nav.groups.overview',
        Icon: DashboardOutlined,
        accent: '#7CB8FF',
        items: [
          { to: '/dashboard/home', labelKey: 'nav.items.dashboard' },
          { to: '/dashboard/analytics', labelKey: 'nav.items.analytics' },
          { to: '/dashboard/charts', labelKey: 'nav.items.charts' },
          { to: '/dashboard/calendar', labelKey: 'nav.items.calendar' },
        ],
      },
      {
        key: 'management',
        labelKey: 'nav.groups.management',
        Icon: AppstoreOutlined,
        accent: '#63CE92',
        items: [
          { to: '/dashboard/users', labelKey: 'nav.items.users' },
          { to: '/dashboard/roles', labelKey: 'nav.items.roles', roles: [ROLES.ADMIN] },
          { to: '/dashboard/tables', labelKey: 'nav.items.projects' },
          { to: '/dashboard/products', labelKey: 'nav.items.products' },
          { to: '/dashboard/kanban', labelKey: 'nav.items.kanban' },
          { to: '/dashboard/invoices', labelKey: 'nav.items.invoices' },
        ],
      },
      {
        key: 'communication',
        labelKey: 'nav.groups.communication',
        Icon: MessageOutlined,
        accent: '#B79BFF',
        items: [
          { to: '/dashboard/chat', labelKey: 'nav.items.chat' },
          { to: '/dashboard/notifications', labelKey: 'nav.items.notifications' },
          { to: '/dashboard/activity', labelKey: 'nav.items.activity' },
        ],
      },
    ],
  },
  {
    key: 'sec-library',
    labelKey: 'nav.sections.library',
    groups: [
      {
        key: 'templates',
        labelKey: 'nav.groups.templates',
        Icon: LayoutOutlined,
        accent: '#4BC8C4',
        items: [
          { to: '/dashboard/forms', labelKey: 'nav.items.forms' },
          { to: '/dashboard/pricing', labelKey: 'nav.items.pricing' },
          { to: '/dashboard/faq', labelKey: 'nav.items.faq' },
          { to: '/dashboard/blank', labelKey: 'nav.items.blank' },
        ],
      },
      {
        key: 'auth-pages',
        labelKey: 'nav.groups.authPages',
        Icon: SafetyOutlined,
        accent: '#E8A94F',
        items: [
          { to: '/signin', labelKey: 'nav.items.signIn', external: true },
          { to: '/signup', labelKey: 'nav.items.signUp', external: true },
          { to: '/forgot-password', labelKey: 'nav.items.forgotPassword', external: true },
          { to: '/lock', labelKey: 'nav.items.lock', external: true },
        ],
      },
      {
        key: 'error-pages',
        labelKey: 'nav.groups.errorPages',
        Icon: WarningOutlined,
        accent: '#FF9A9C',
        items: [
          { to: '/dashboard/errors/400', labelKey: 'nav.items.error400' },
          { to: '/dashboard/errors/403', labelKey: 'nav.items.error403' },
          { to: '/dashboard/errors/404', labelKey: 'nav.items.error404' },
          { to: '/dashboard/errors/500', labelKey: 'nav.items.error500' },
          { to: '/maintenance', labelKey: 'nav.items.maintenance', external: true },
        ],
      },
    ],
  },
  {
    key: 'sec-account',
    labelKey: 'nav.sections.account',
    groups: [
      {
        key: 'account',
        labelKey: 'nav.groups.account',
        Icon: IdcardOutlined,
        accent: '#F58FC9',
        items: [
          { to: '/dashboard/profile', labelKey: 'nav.items.profile' },
          { to: '/dashboard/settings', labelKey: 'nav.items.settings' },
        ],
      },
    ],
  },
];

/* The group hue arrives as a custom property rather than an inline `color`,
 * because an inline colour beats every token generated rule, which is why the
 * selected icon used to stay pastel on the pill. */
const groupIcon = (Component, accent) => <Component style={{ '--nav-accent': accent }} />;

/** Every group, flattened, so the derived lookups below stay readable. */
const ALL_GROUPS = NAV_TREE.flatMap((section) =>
  section.groups.map((group) => ({
    ...group,
    sectionKey: section.key,
    sectionLabelKey: section.labelKey,
  }))
);

/** Every routable leaf with its ancestry attached. */
const ALL_LEAVES = ALL_GROUPS.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    groupKey: group.key,
    groupLabelKey: group.labelKey,
    sectionLabelKey: group.sectionLabelKey,
  }))
);

export const ROOT_KEYS = ALL_GROUPS.map((group) => group.key);

/** Internal routes only, longest first, for prefix matching. */
const LEAF_KEYS = ALL_LEAVES.filter((leaf) => !leaf.external)
  .map((leaf) => leaf.to)
  .sort((a, b) => b.length - a.length);

/**
 * Resolve a pathname to a menu key by longest prefix match.
 *
 * A `pathname.split('/').pop()` would be lossy: a trailing slash yields '',
 * /dashboard highlights nothing, and any two routes sharing a leaf name both
 * highlight.
 */
export const getSelectedKey = (pathname) => {
  const path = pathname.replace(/\/+$/, '') || '/dashboard';
  return LEAF_KEYS.find((key) => path === key || path.startsWith(`${key}/`));
};

/** Open key path to a leaf. Sections are not open keys, only groups are. */
export const findOpenPath = (targetKey) => {
  const leaf = ALL_LEAVES.find((item) => item.to === targetKey);
  return leaf ? [leaf.groupKey] : null;
};

/** Section titles for the collapsed flyout panels, translated on demand. */
export const getSectionLabels = (t) =>
  Object.fromEntries(ALL_GROUPS.map((group) => [group.key, t(group.labelKey)]));

/** Breadcrumb trail for the current route: section, group, then page. */
export const getBreadcrumbTrail = (pathname, t) => {
  const selected = getSelectedKey(pathname);
  const leaf = ALL_LEAVES.find((item) => item.to === selected);
  if (!leaf) return [];
  return [
    { key: 'section', label: t(leaf.sectionLabelKey) },
    { key: 'group', label: t(leaf.groupLabelKey) },
    { key: 'page', label: t(leaf.labelKey), to: leaf.to },
  ];
};

/** Flat list for the command palette and the header search. */
export const getSearchablePages = (t, hasRole) =>
  ALL_LEAVES.filter((leaf) => !hasRole || hasRole(leaf.roles)).map((leaf) => ({
    key: leaf.to,
    to: leaf.to,
    external: Boolean(leaf.external),
    label: t(leaf.labelKey),
    group: t(leaf.groupLabelKey),
  }));

/**
 * Build the antd Menu items.
 *
 * `activeRootKey` marks the group owning the current route. Collapsed, a
 * group's children live in a portaled flyout, so neither `:has()` nor anything
 * else in the rail's own subtree can see which section is active, and antd
 * styles `ant-menu-submenu-selected` with a text colour only. Deriving the
 * class here keeps the collapsed active state independent of rc-menu's
 * internal path registration.
 */
export const buildNavItems = (t, { activeRootKey, hasRole } = {}) =>
  NAV_TREE.map((section) => {
    const groups = section.groups
      .map((group) => {
        const items = group.items.filter((item) => !hasRole || hasRole(item.roles));
        if (items.length === 0) return null;

        return {
          key: group.key,
          label: t(group.labelKey),
          icon: groupIcon(group.Icon, group.accent),
          className: group.key === activeRootKey ? 'app-nav__group--active' : undefined,
          children: items.map((item) =>
            item.external
              ? {
                  /* Auth and standalone pages are full page shells outside
                     /dashboard, so navigating in place would strand a demo user
                     with no way back. They open in a new tab on purpose. The
                     marker goes in antd's `extra` slot, which is flush end via
                     margin-inline-start: auto, so it can never be clipped by
                     the label's ellipsis box. */
                  key: `ext:${item.to}`,
                  label: (
                    <a
                      href={item.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t('nav.newTab', { label: t(item.labelKey) })}
                    >
                      {t(item.labelKey)}
                    </a>
                  ),
                  extra: <ExportOutlined style={{ fontSize: 11 }} />,
                }
              : {
                  key: item.to,
                  label: <Link to={item.to}>{t(item.labelKey)}</Link>,
                }
          ),
        };
      })
      .filter(Boolean);

    return {
      type: 'group',
      key: section.key,
      label: t(section.labelKey),
      children: groups,
    };
  }).filter((section) => section.children.length > 0);
