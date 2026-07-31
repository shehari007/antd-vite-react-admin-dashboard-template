<p align="center">
  <img src="src/assets/logo/logo-horizontal-light.png" alt="ViteDash" width="360" />
</p>

<h1 align="center">ViteDash</h1>

<p align="center">
  A modern, responsive, and production-ready admin dashboard template built with <b>React 19</b>, <b>Vite 8</b>, and <b>Ant Design 6</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Ant%20Design-6.5-0170FE?logo=antdesign" alt="Ant Design" />
</p>

## Features

- **Fully Responsive** - Three distinct navigation states: a full sidebar on desktop, a persistent icon rail on tablet, and a drawer on mobile
- **Modern UI** - Clean, professional design using Ant Design 6 with the Inter typeface
- **Lightning Fast** - Powered by Vite 8 for instant HMR and optimized builds
- **Authentication Ready** - Sign in, sign up, forgot password, protected routes, and a split-screen `AuthLayout`
- **System-Wide Light/Dark Mode** - Powered entirely by Ant Design's `ConfigProvider` theme algorithm, not CSS overrides. Persisted to `localStorage` and defaults to the OS preference
- **Header Quick Actions** - Global search, quick-create dropdown, fullscreen toggle, notifications, and theme switch
- **Precision Sidebar** - Icons sit on a single 40px axis in both the expanded and collapsed state, so collapsing is pure clipping with no horizontal drift. Accordion groups under uppercase section labels, titled hover flyouts on the collapsed rail, a persisted collapse state, and an account card that keeps logout reachable at 80px
- **20+ Starter Pages** - Dashboard, Analytics, Calendar, Users, Projects, Kanban, Invoices, Forms, Pricing, Chat, Help Center, Profile, Settings, and more, all built purely with Ant Design components
- **Live Messaging UI** - A Chat page with resizable panels, contacts, requests, a new-chat flow, and confirmation prompts
- **Error Pages** - Ready-made 400, 403, 404, and 500 pages using Ant Design's `Result` component
- **App Version Display** - Shown in the footer, driven by a single env variable
- **Branded** - Ships with the ViteDash logo (icon, horizontal lockup, favicon) in light and dark variants
- **Accessible by Default** - Visible keyboard focus rings, labelled icon buttons, `aria-expanded` navigation state, and full `prefers-reduced-motion` support
- **Minimal Dependencies** - Only essential packages included

## Live Demo

[https://vitedash.msyb.dev](https://vitedash.msyb.dev)

## What's New in 2.1.0

A focused rebuild of the sidebar around a single geometric constraint, plus the correctness and accessibility fixes that surfaced along the way.

### Layout & collapse

- Icons now sit on one 40px axis in both states, so collapsing no longer shifts them 13px sideways. See [The 40px axis](#the-40px-axis)
- The logo and account avatar are geometrically immobile during collapse instead of sliding right, then left
- The whole collapse gesture runs on one curve and one duration; menu padding previously animated over 0.4s against the rail's 0.2s, which read as overshoot
- Collapsed hover flyouts are titled panels painted with `Menu.darkPopupBg`, so they match the rail instead of Ant Design's stock navy
- Logout stays reachable on the 80px rail, and section labels become hairline rules rather than clipped words
- Sidebar widths are defined once in `theme-mode-context.js` instead of as three unsynchronised numbers

### Responsive

- Tablets (768–991px) get a persistent icon rail that overlays on demand, rather than dropping straight to a modal drawer
- The mobile drawer no longer re-opens by itself after crossing a breakpoint
- Viewport heights use `dvh`, so the footer is no longer trapped under mobile browser chrome
- The collapse state persists across reloads, and the scroll position resets on navigation

### Fixes

- Collapsing and re-expanding no longer wipes the open group
- `.ant-drawer-body { padding: 0 !important }` was global and stripped padding from the Invoices and Chat drawers; it is now scoped to the sidebar
- Route matching uses full-path prefixes, so `/dashboard`, trailing slashes, and nested error routes all resolve correctly
- The selected menu item met contrast at only 1.8:1; the pill is now tinted rather than solid
- Keyboard focus is visible throughout, icon-only buttons are labelled, and `prefers-reduced-motion` is honoured in both CSS and Ant Design's motion token

## Tech Stack

| Technology | Version | Description |
|------------|---------|-------------|
| [React](https://react.dev/) | 19.2 | UI Library |
| [Vite](https://vitejs.dev/) | 8.1 | Build Tool |
| [Ant Design](https://ant.design/) | 6.5 | UI Component Library |
| [React Router](https://reactrouter.com/) | 7.18 | Client-side Routing |

## Pages

| Page | Route | Notes |
|------|-------|-------|
| Dashboard | `/dashboard/home` | Stat cards, gauges, orders table, activity, team, schedule |
| Analytics | `/dashboard/analytics` | Traffic sources, device breakdown, funnel, top pages |
| Calendar | `/dashboard/calendar` | Full calendar with upcoming events |
| Users | `/dashboard/users` | Searchable, filterable user table |
| Projects | `/dashboard/tables` | Rich, responsive table with avatars, ratings, and progress |
| Kanban Board | `/dashboard/kanban` | Static drag-free board across four stages |
| Invoices | `/dashboard/invoices` | Billing table with a detail drawer |
| Forms | `/dashboard/forms` | Basic, advanced fields, and a multi-step wizard |
| Pricing | `/dashboard/pricing` | Plan cards, comparison table, and a selection modal |
| Chat | `/dashboard/chat` | Contacts, requests, resizable panels, mobile navigation |
| Help Center | `/dashboard/faq` | Searchable FAQ with categories and a contact form |
| Profile | `/dashboard/profile` | Cover banner, stats, skills, activity, and an edit form |
| Settings | `/dashboard/settings` | General, appearance, security, and notification tabs |
| Blank Page | `/dashboard/blank` | Starting point for new pages |
| Error Pages | `/dashboard/errors/{400,403,404,500}` | Ready-made error states |
| Auth Pages | `/signin`, `/signup`, `/forgot-password` | Full-page auth screens |

## Project Structure

```
src/
├── assets/
│   └── logo/              # ViteDash logo assets (icon, horizontal lockups, light/dark)
├── components/
│   └── SectionLabel.jsx   # Quiet uppercase section heading used across dashboard pages
├── config/
│   └── appInfo.js         # App version, sourced from VITE_APP_VERSION
├── context/                # App-wide context (theme mode / ConfigProvider)
│   ├── ThemeModeContext.jsx   # Light/dark ConfigProvider setup + sidebar design tokens
│   ├── theme-mode-context.js  # Context object, font, and the sidebar geometry constants
│   └── useThemeMode.js        # Hook to read/toggle theme mode
├── layout/                # Layout components
│   ├── MainLayout.jsx      # Shell: responsive state, collapse persistence, open-key ownership
│   ├── AuthLayout.jsx      # Split-screen layout for sign in / sign up / forgot password
│   ├── LayoutHeader.jsx    # Top navigation header + quick actions
│   ├── LayoutSidebar.jsx   # Sider on desktop/tablet, Drawer on mobile
│   ├── navConfig.jsx       # Navigation tree, route matching, active-group derivation
│   ├── LayoutMenu.jsx      # Renders the nav tree, incl. collapsed flyout panels
│   ├── LayoutLogo.jsx      # ViteDash mark + wordmark, immobile during collapse
│   ├── LayoutUserCard.jsx  # Account card; logout stays reachable when collapsed
│   └── LayoutFooter.jsx    # Footer component
├── pages/                 # Page components
│   ├── auth/               # SignIn, SignUp, ForgotPassword
│   ├── home/                # Dashboard home page
│   ├── analytics/           # Analytics page
│   ├── calendar/            # Calendar page
│   ├── users/                # User management table
│   ├── tables/               # Projects table example
│   ├── kanban/               # Kanban board example
│   ├── invoices/             # Invoices with detail drawer
│   ├── forms/                 # Basic, advanced, and wizard form examples
│   ├── pricing/               # Pricing plans and comparison table
│   ├── chat/                  # Messaging UI
│   ├── faq/                    # Help Center
│   ├── profile/                # Profile overview and edit tabs
│   ├── settings/               # Settings tabs
│   ├── blank/                   # Blank page template
│   ├── errors/                  # Shared ErrorPage used for 400/403/404/500
│   └── not-found/               # Catch-all 404 shown outside the dashboard shell
├── Utils/                 # Utility functions
│   └── Auth/
│       ├── SignIn.jsx      # Sign in logic
│       └── Logout.jsx      # Logout logic
├── App.jsx                # Root component with routes
├── ProtectedRoute.jsx      # Route protection HOC
├── main.jsx                # Application entry point
├── App.css                 # Global app styles
└── index.css                # Base styles + the sidebar design system
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shehari007/antd-vite-react-admin-dashboard-template.git
   cd antd-vite-react-admin-dashboard-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Authentication

The template includes a full front-end authentication flow:

- **Sign In** - `/signin`
- **Sign Up** - `/signup`
- **Forgot Password** - `/forgot-password`
- **Protected Routes** - Dashboard routes can require authentication
- **Auth Storage** - Uses localStorage for demo purposes

By default `REQUIRE_AUTH` in `src/ProtectedRoute.jsx` is set to `false` so the dashboard loads directly, which is useful when sharing a public preview. Set it to `true` to gate every `/dashboard` route behind sign in.

To customize authentication:
1. Modify `src/Utils/Auth/SignIn.jsx` for login logic
2. Modify `src/Utils/Auth/Logout.jsx` for logout logic
3. Update `src/ProtectedRoute.jsx` for route protection
4. Edit `src/layout/AuthLayout.jsx` to change the shared branding panel for all auth screens

## Light/Dark Theme System

Theming is handled entirely through Ant Design's `ConfigProvider`. There are no dark-mode CSS classes or overrides. `src/context/ThemeModeContext.jsx` swaps between `theme.defaultAlgorithm` and `theme.darkAlgorithm` based on the current mode, so every Ant Design component re-themes itself automatically. The mode is stored in `localStorage` and initialized from the OS `prefers-color-scheme` on first visit.

- Toggle from the header switch, or from **Settings > Appearance**
- Read or update the mode anywhere with the `useThemeMode()` hook:
  ```jsx
  import { useThemeMode } from './context/useThemeMode';

  const { mode, isDark, toggleMode, setMode } = useThemeMode();
  ```
- Card elevation (`boxShadowTertiary`), the global font (`Inter`), the sidebar geometry and colors (`siderBg`, `darkItemBg`, `darkPopupBg`, `itemMarginInline`, `iconSize`), and other design tokens are also configured here. Extend the `token` / `components` objects to customize further.
- `token.motion` is bound to the user's `prefers-reduced-motion` setting, which disables Ant Design's JavaScript-driven animations. CSS alone cannot stop those.

The sidebar deliberately stays dark in both light and dark mode. Its colors come from `Menu.dark*` tokens rather than the active algorithm, so re-theming the app does not re-theme the rail. Note that `darkItemBg`, `darkSubMenuItemBg`, and `darkPopupBg` are three independent tokens: the last one paints the collapsed hover flyouts, and leaving it unset is what makes flyouts render in Ant Design's stock navy instead of your rail color.

## Sidebar Navigation

The navigation tree lives in `src/layout/navConfig.jsx`, separately from the `LayoutMenu.jsx` component that renders it. Six groups (Overview, Management, Templates, Auth Pages, Error Pages, Account) sit under three uppercase section labels. Only one group stays open at a time, accordion-style, and the open group syncs to whichever page is active.

**To add a page**, add an entry to the relevant group's `children` array in `navConfig.jsx`. Keys are full pathnames, which is what drives selection:

```jsx
nav('/dashboard/reports', 'Reports')
```

### The 40px axis

The rail's geometry is built on one number: the horizontal centre of every icon, identical whether the sidebar is 248px or 80px wide. Collapsing therefore clips the labels away instead of re-laying out the menu.

Ant Design positions menu icons by two unrelated formulas:

```text
expanded  = itemMarginInline + inlineIndent + iconSize / 2
collapsed = collapsedWidth / 2
```

The constants in `src/context/theme-mode-context.js` are solved so both equal 40:

```text
8 + 24 + 8  ===  80 / 2  ===  40
```

Change any one of them and the icons will jump on collapse unless you re-solve the identity. Two things to know if you do:

- `inlineIndent` is a Menu **prop**, not a theme token. rc-menu writes `padding-left` as an inline style attribute, which beats every class rule, so `itemPaddingInline` cannot move the expanded icon.
- Keep `collapsedIconSize >= iconSize`. Ant Design's collapsed rule overrides the icon's `font-size` but not its `min-width`, so a larger `iconSize` would widen the glyph box past what the centring calculation assumes.

### Collapsed behaviour

Groups become titled hover flyouts, styled through `Menu.darkPopupBg` — a separate token from `darkItemBg`, and the reason an unstyled flyout renders in Ant Design's stock navy rather than your rail colour. The group owning the current route keeps its accent bar and tinted pill, marked by a class derived in `navConfig.jsx` rather than Ant Design's `ant-menu-submenu-selected`, since a collapsed group's children are portaled out of the rail entirely.

The collapse state persists to `localStorage` under `dashboard-sider-collapsed`, and the expanded tree's open group is remembered independently of the collapsed rail's hover state.

## App Version

The version shown in the footer comes from the `VITE_APP_VERSION` variable in `.env`:

```bash
VITE_APP_VERSION=2.1.0
```

Update that single value to bump the displayed version, no code changes required. If the variable is missing, `src/config/appInfo.js` falls back to the version in `package.json`.

## Logo & Branding

ViteDash's logo assets live in `src/assets/logo/`:

| File | Use |
|------|-----|
| `logo-icon.png` | Transparent mark used in the sidebar, header, and auth branding panel |
| `logo-icon-tile-light.png` / `logo-icon-tile-dark.png` | Square app-icon tiles |
| `logo-horizontal-light.png` / `logo-horizontal-dark.png` | Full lockup (icon + wordmark) for docs/marketing |

Favicons generated from the mark are in `public/` (`favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`) and wired up in `index.html`. Swap these files to rebrand, no code changes required.

## Customization

### Theming

The color, radius, font, and shadow tokens live in `src/context/ThemeModeContext.jsx`:

```jsx
<ConfigProvider
  card={{ variant: 'borderless' }}
  theme={{
    algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#1677ff',
      borderRadius: 8,
    },
  }}
>
  {/* Your app */}
</ConfigProvider>
```

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Add a menu item in `src/layout/navConfig.jsx`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Muhammad Sheharyar Butt

- GitHub: [@shehari007](https://github.com/shehari007)
- Email: [shehariyar@gmail.com](mailto:shehariyar@gmail.com)

## Acknowledgments

- [Ant Design](https://ant.design/) - Amazing UI components
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [React](https://react.dev/) - The library for web and native user interfaces

<p align="center">
  Made with care by <a href="https://github.com/shehari007">Muhammad Sheharyar Butt</a>
</p>

<p align="center">
  Star this repo if you find it helpful.
</p>
