import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
// Initialising i18next once here means no test has to remember to do it.
import '@/i18n';

/**
 * jsdom is not a browser, so a handful of APIs that Ant Design and the theme
 * context rely on simply do not exist. Each one below fails loudly and
 * confusingly when missing, so they are stubbed once rather than per test.
 */

/**
 * matchMedia: used by the theme context for the OS colour scheme and the
 * reduced motion preference, and by antd's Grid for its breakpoints.
 *
 * A stub that always answers `false` looks harmless and is not: antd then
 * believes every breakpoint failed, decides the viewport is extra small, and
 * renders the mobile drawer instead of the sidebar. So width queries are
 * answered against `window.innerWidth`, which jsdom reports as 1024, and
 * everything else (`prefers-color-scheme`, `prefers-reduced-motion`) answers
 * false, which is the sensible default for a test.
 */
if (!window.matchMedia) {
  const evaluate = (query) => {
    const min = query.match(/min-width:\s*(\d+)px/);
    const max = query.match(/max-width:\s*(\d+)px/);
    if (!min && !max) return false;
    if (min && window.innerWidth < Number(min[1])) return false;
    if (max && window.innerWidth > Number(max[1])) return false;
    return true;
  };

  window.matchMedia = (query) => ({
    get matches() {
      return evaluate(query);
    },
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

// ResizeObserver: used by antd's Table, Menu overflow, and Recharts.
if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Not implemented in jsdom, and antd's Drawer and Modal both call it.
window.scrollTo = window.scrollTo || (() => {});

// Element.scrollTo is missing too, which MainLayout calls to reset the content
// column's scroll position on navigation.
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = () => {};
}

// Keep the console honest: antd warns about deprecated props, and a test run
// that scrolls past fifty warnings hides the one that matters.
vi.spyOn(console, 'warn').mockImplementation(() => {});

afterEach(() => {
  cleanup();
  localStorage.clear();
});
