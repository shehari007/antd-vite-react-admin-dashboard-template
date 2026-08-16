# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Dependency bumps: `antd` 6.6, `react` and `react-dom` 19.2.8, `vite` 8.2.1,
  `@vitejs/plugin-react` 6.0.5, `jsdom` 30, `globals` 17, and patch level moves
  on the Testing Library packages and `eslint-plugin-react-refresh`.
- **First load moved from 324 kB to 336 kB gzipped.** Vite 8.2 uses Rolldown
  1.2, which splits the app into 36 eager files where 8.1 produced 12. The code
  is identical and the raw total barely changes, but many small files compress
  worse than a few large ones. The trade is finer cache granularity, so a
  release only invalidates the chunks it actually touched.
- The `manualChunks` comparison in `vite.config.js` and the README was
  re-measured on the current toolchain: 627 kB grouped against 336 kB letting
  the bundler decide. The gap narrowed slightly, the conclusion did not change.

### Known issues

- `eslint` 10 and `@eslint/js` 10 cannot be adopted yet.
  `eslint-plugin-jsx-a11y@6.10.2` still declares a peer range that stops at
  ESLint 9, so `npm install` fails outright. Waiting on an upstream release.

## [2.2.0]

The release that turns the template from a good looking set of pages into a
starting point you can actually build on. Two real bugs fixed, the bundle cut
roughly in half on first load, and the pieces every admin app ends up needing:
roles, a data layer, charts, tests, and a second and third language.

### Fixed

- **`@ant-design/icons` was never declared as a dependency.** It is imported in
  22 files and only resolved because npm hoists antd's transitive copy. Anyone
  installing with pnpm or Yarn PnP got `Cannot find module '@ant-design/icons'`
  and could not run the template at all. It is now a direct dependency.
- **The production build was a single 1.62 MB JavaScript file.** Opening the
  sign in screen downloaded the Kanban board, every chart, and all 25 pages
  first. Routes are lazy now and the first load is 1.00 MB across 13 files,
  which is 324 kB gzipped.
- Signing in did a `window.location.replace`, throwing away the React app and
  reloading the whole page. It navigates through the router now.
- `npm audit` advisories in `brace-expansion` and `postcss` resolved.
- The header search box was decorative and did nothing when typed into.
- Fullscreen state was tracked on click, so leaving fullscreen with the Escape
  key left the button showing the wrong icon.
- `.env` was committed to the repository, which teaches a habit that leaks a
  real key sooner or later. It is now ignored, with `.env.example` in its place.

### Added

- **Route level code splitting.** Every page is a `lazy()` import with Suspense
  boundaries inside the shell, so the sidebar and header stay on screen while a
  page loads.
- **Error boundaries.** One around the whole app and one inside the dashboard
  shell keyed on the pathname, so a page that throws no longer blanks the
  browser, and navigating away recovers without a reload.
- **Real authentication flow.** `AuthProvider` with sign in, sign up, sign out,
  a lock screen, session persistence, and a deep link that survives the detour
  through the sign in page.
- **Roles and permissions.** `RequireRole` guards routes, the sidebar hides what
  the current role cannot open, and a new Roles page shows the permission matrix.
  Try `editor@vitedash.dev` to watch a page disappear.
- **A data layer.** `src/services/` holds mock async services shaped like a real
  API, `src/data/` holds the fixtures, and the `useAsync` hook gives every page
  loading, error, and empty states. The Products page has a switch that makes a
  request fail on purpose so the error path is visible.
- **Charts.** Recharts with a `useChartTheme` hook and a custom tooltip, so
  every chart follows the active theme and the chosen primary colour instead of
  rendering white text on a white tooltip in dark mode.
- **Internationalisation and right to left.** English, Spanish, and Arabic, with
  a language switcher, antd locale packages, dayjs locales, and the whole layout
  mirroring for Arabic.
- **Theme customizer.** A drawer for the primary colour, corner radius, density,
  light or dark, and language. Everything persists to localStorage and applies
  instantly through `ConfigProvider`.
- **Command palette.** Ctrl+K or Cmd+K searches every page in the navigation
  tree, filtered by role, plus a few actions. Arrow keys and Enter work.
- **Seven new pages:** Charts, Products, Roles and Permissions, Notifications,
  Activity Log, Lock Screen, and Maintenance.
- **Shared components:** `PageHeader` with an automatic breadcrumb, `StatCard`,
  `EmptyState`, `ErrorState`, `PageLoader`, `ErrorBoundary`, `RequireRole`,
  `ChartCard`, and `CommandPalette`.
- **Tests.** Vitest and Testing Library with 51 tests covering route matching,
  role filtering, the auth provider, the service layer, `useAsync` race
  conditions, and the shared components.
- **`@/` path alias** for imports, configured in Vite and `jsconfig.json`.
- **Prettier, `eslint-plugin-jsx-a11y`, EditorConfig, `.nvmrc`,** and an
  `engines` field. `npm run check` runs lint, format, and tests together.
- **Bundle analysis** with `npm run analyze`.
- **Deployment configs** for Netlify and Docker with nginx, alongside the
  existing Vercel config, all with SPA fallback and cache headers.
- **SEO and PWA basics:** meta description, Open Graph and Twitter cards, a web
  manifest, `robots.txt`, `sitemap.xml`, and a loading splash so the first paint
  is not a blank white page.
- **Community files:** contributing guide, code of conduct, security policy,
  issue templates, and a pull request template.
- **A `pre-push` git hook** that runs `npm run check` before anything reaches
  the remote. It is a plain hook with no dependency behind it: `npm install`
  points git at `.githooks/` through the `prepare` script.
- **`RELEASING.md`**, a checklist covering the version bump, the hardcoded
  README badges, regenerating the screenshots, tagging, and publishing.
- **`public/og-image.png`**, generated by the screenshot script from the dark
  mode capture taken in the same run, so the social card can never advertise a
  version of the app that no longer exists.
- **Dependabot config** on a monthly grouped schedule, and a `FUNDING.yml`.

### Changed

- `.gitattributes` now pins shell scripts, YAML, and the Dockerfile to LF
  endings. A hook checked out with CRLF on Windows fails on macOS and Linux
  with `bad interpreter: /bin/sh^M`, which is a confusing way to find out.
- **Inter is self hosted** through `@fontsource-variable/inter` instead of being
  fetched from Google Fonts, which unblocks the first paint, keeps development
  working offline, and stops sending visitor IP addresses to a third party.
- **`navConfig.jsx` was rebuilt.** It now holds structure only, with translation
  keys and optional roles, and derives the menu, the breadcrumb trail, and the
  command palette index from one tree.
- The app version comes from `package.json` at build time through Vite's
  `define`, rather than importing the whole file into the bundle.
- `src/Utils/Auth/` and `src/ProtectedRoute.jsx` are gone. Their jobs now belong
  to `src/services/authService.js`, `src/context/AuthContext.jsx`, and
  `src/layout/DashboardLayout.jsx`.
- The Settings page's Appearance tab now controls the real theme tokens instead
  of showing a switch that did nothing.
- The layout uses logical CSS properties throughout so right to left works
  without a second stylesheet.
- The empty `src/App.css` was deleted.

## [2.1.0]

A focused rebuild of the sidebar around a single geometric constraint, plus the
correctness and accessibility fixes that surfaced along the way.

### Fixed

- Icons sit on one 40px axis in both states, so collapsing no longer shifts them
  13px sideways
- The logo and account avatar are geometrically immobile during collapse instead
  of sliding right, then left
- The whole collapse gesture runs on one curve and one duration. Menu padding
  previously animated over 0.4s against the rail's 0.2s, which read as overshoot
- Collapsed hover flyouts are titled panels painted with `Menu.darkPopupBg`, so
  they match the rail instead of Ant Design's stock navy
- Logout stays reachable on the 80px rail, and section labels become hairline
  rules rather than clipped words
- Collapsing and re-expanding no longer wipes the open group
- `.ant-drawer-body { padding: 0 !important }` was global and stripped padding
  from the Invoices and Chat drawers. It is now scoped to the sidebar
- Route matching uses full path prefixes, so `/dashboard`, trailing slashes, and
  nested error routes all resolve correctly
- The selected menu item met contrast at only 1.8:1. The pill is now tinted
  rather than solid
- Keyboard focus is visible throughout, icon only buttons are labelled, and
  `prefers-reduced-motion` is honoured in both CSS and Ant Design's motion token

### Changed

- Tablets between 768px and 991px get a persistent icon rail that overlays on
  demand, rather than dropping straight to a modal drawer
- The mobile drawer no longer re-opens by itself after crossing a breakpoint
- Viewport heights use `dvh`, so the footer is no longer trapped under mobile
  browser chrome
- The collapse state persists across reloads, and the scroll position resets on
  navigation
- Sidebar widths are defined once in `theme-mode-context.js` instead of as three
  unsynchronised numbers

## [2.0.0]

- New pages, user interface improvements, and more components
- Upgraded to React 19, Vite 8, and Ant Design 6

[2.2.0]: https://github.com/shehari007/vitedash-vite-antd-dashboard-template/releases/tag/v2.2.0
[2.1.0]: https://github.com/shehari007/vitedash-vite-antd-dashboard-template/releases/tag/v2.1.0
[2.0.0]: https://github.com/shehari007/vitedash-vite-antd-dashboard-template/releases/tag/v2.0.0
