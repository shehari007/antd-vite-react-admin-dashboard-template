import { describe, expect, it } from 'vitest';
import {
  ROOT_KEYS,
  buildNavItems,
  findOpenPath,
  getBreadcrumbTrail,
  getSearchablePages,
  getSelectedKey,
} from './navConfig';
import { ROLES } from '@/context/auth-context';

/** Stand in for i18next: returns the key so assertions stay readable. */
const t = (key) => key;

describe('getSelectedKey', () => {
  it('matches an exact route', () => {
    expect(getSelectedKey('/dashboard/products')).toBe('/dashboard/products');
  });

  it('ignores a trailing slash', () => {
    expect(getSelectedKey('/dashboard/products/')).toBe('/dashboard/products');
  });

  it('matches the longest prefix, not the last path segment', () => {
    // The old split('/').pop() implementation returned '404' here, which
    // matched nothing, and '/dashboard/errors/404' has to win over '/dashboard'.
    expect(getSelectedKey('/dashboard/errors/404')).toBe('/dashboard/errors/404');
  });

  it('matches a nested child route to its parent page', () => {
    expect(getSelectedKey('/dashboard/products/p-1001')).toBe('/dashboard/products');
  });

  it('returns undefined for a route outside the tree', () => {
    expect(getSelectedKey('/nope')).toBeUndefined();
  });
});

describe('findOpenPath', () => {
  it('returns the owning group for a leaf', () => {
    expect(findOpenPath('/dashboard/charts')).toEqual(['overview']);
  });

  it('returns null for an unknown key', () => {
    expect(findOpenPath('/dashboard/nope')).toBeNull();
  });

  it('only ever returns keys that are real open keys', () => {
    const path = findOpenPath('/dashboard/invoices');
    path.forEach((key) => expect(ROOT_KEYS).toContain(key));
  });
});

describe('buildNavItems role filtering', () => {
  const labelsOf = (items) =>
    items.flatMap((section) =>
      section.children.flatMap((group) => group.children.map((c) => c.key))
    );

  it('shows the admin only page to an admin', () => {
    const items = buildNavItems(t, { hasRole: (roles) => !roles || roles.includes(ROLES.ADMIN) });
    expect(labelsOf(items)).toContain('/dashboard/roles');
  });

  it('hides the admin only page from an editor', () => {
    const items = buildNavItems(t, { hasRole: (roles) => !roles || roles.includes(ROLES.EDITOR) });
    expect(labelsOf(items)).not.toContain('/dashboard/roles');
  });

  it('keeps every unrestricted page visible to an editor', () => {
    const items = buildNavItems(t, { hasRole: (roles) => !roles || roles.includes(ROLES.EDITOR) });
    expect(labelsOf(items)).toContain('/dashboard/products');
  });
});

describe('getBreadcrumbTrail', () => {
  it('builds section, group, then page', () => {
    const trail = getBreadcrumbTrail('/dashboard/products', t);
    expect(trail.map((crumb) => crumb.label)).toEqual([
      'nav.sections.workspace',
      'nav.groups.management',
      'nav.items.products',
    ]);
  });

  it('is empty for an unknown route', () => {
    expect(getBreadcrumbTrail('/nope', t)).toEqual([]);
  });
});

describe('getSearchablePages', () => {
  it('includes external pages so the palette can open them', () => {
    const pages = getSearchablePages(t);
    expect(pages.find((page) => page.to === '/signin')?.external).toBe(true);
  });

  it('respects the role filter', () => {
    const pages = getSearchablePages(t, (roles) => !roles || roles.includes(ROLES.VIEWER));
    expect(pages.find((page) => page.to === '/dashboard/roles')).toBeUndefined();
  });
});
