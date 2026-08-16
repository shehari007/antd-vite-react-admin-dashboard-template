---
title: 'ViteDash 2.2: I halved my dashboard bundle, right after doubling it'
description: 'My free React 19 and Ant Design 6 admin template got roles, a real data layer, charts, and right to left support. It also taught me that the vendor chunking advice everyone repeats can make your first load twice as slow.'
date: '2026-08-05'
author: 'Muhammad Sheharyar Butt'
tags:
  - react
  - vite
  - ant-design
  - performance
  - open-source
  - dashboard
slug: 'vitedash-2-2-halving-the-first-load'
readingTime: '10 min'
image: '/blog/vitedash-2-2/dashboard-dark.png'
imageAlt: 'The ViteDash admin dashboard in dark mode'
draft: false
---

I maintain [ViteDash](https://github.com/shehari007/vitedash-vite-antd-dashboard-template), a free admin dashboard template built with React 19, Vite 8, and Ant Design 6. It has a clean sidebar I am genuinely proud of, twenty something pages, and a light and dark mode that runs entirely through Ant Design's theme algorithm rather than a pile of CSS overrides.

It also shipped a single 1.6 MB JavaScript file and had a dependency it never declared.

Version 2.2 is out. Here is what was broken, what I added, and the one performance lesson that surprised me enough to write about.

## 🐛 The bug that made the template unusable for some people

`@ant-design/icons` was imported in 22 files. It was not in `package.json`.

It worked fine on my machine. It works fine for anyone using npm, because npm flattens `node_modules` and antd depends on the icons package, so the import resolves through a copy that happens to be sitting at the top level.

It does not work with pnpm. pnpm keeps a strict `node_modules` where a package can only import what it actually declared. Same story with Yarn PnP. Those users cloned the repo, ran install, ran dev, and got:

```
Failed to resolve import "@ant-design/icons"
```

My README told people to use pnpm. I had been shipping a template that a chunk of my audience could not start.

The fix is one line in `package.json`. The lesson is not. If you maintain anything that other people install, test the install with pnpm at least once. A transitive dependency you never asked for is not a dependency you have.

## 📦 The bundle: 1.6 MB in one file

The production build was one chunk:

```
dist/assets/index-BkAqHA3M.js   1,620,471 bytes
```

Everything. The sign in screen waited on the Kanban board, the invoice drawer, and all twenty something other pages before it painted.

The fix is the boring, correct one. Every route becomes a lazy import:

```jsx
const Charts = lazy(() => import('@/pages/charts/Charts'));
const Products = lazy(() => import('@/pages/products/Products'));
```

with a Suspense boundary inside the shell rather than around it, so the sidebar and header stay on screen while the next page downloads:

```jsx
<MainLayout>
  <ErrorBoundary resetKey={location.pathname}>
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </ErrorBoundary>
</MainLayout>
```

That part went exactly how you would expect. The next part did not.

## ⚠️ The chunking advice that made it worse

Search for "Vite bundle too large" and you will find the same answer over and over: split your vendor code by library with `manualChunks`. Group React here, antd there, charts somewhere else. Long term caching, smaller chunks, everyone wins.

So I wrote it:

```js
manualChunks(id) {
  if (/node_modules\/(recharts|d3-)/.test(id)) return 'charts';
  if (id.includes('node_modules/@ant-design/icons')) return 'icons';
  if (/node_modules\/(antd|rc-|@rc-component)/.test(id)) return 'antd';
  if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
  return 'vendor';
}
```

It looks tidy. It builds. The chunk list looks like a job well done.

Then I measured what the browser actually downloads before first paint, by reading the modulepreload tags out of the built `index.html` and adding up the files:

```
eager raw   : 2,057 kB
eager gzip  : 627 kB
```

Worse than shipping nothing at all. My route splitting had done its job, and my chunking config had undone it.

Here is why. `manualChunks` is a hard instruction, not a hint. When you say "every antd module goes in the antd chunk", the bundler obeys, including for the antd components that only the Kanban board imports. And a chunk is eager if _any_ module in it is reachable from the entry. The app shell uses `Layout`, `Menu`, and `Button`, so the antd chunk is eager, so `Table`, `Splitter`, `Calendar` and everything else rides along.

Same story with Recharts. Only the Charts page imports it. Naming it as a chunk pulled it into the entry graph anyway, and 427 kB of chart library was downloading for people who never opened a chart.

I deleted the whole thing and let the bundler decide:

```
eager raw   : 1,011 kB across 36 files
eager gzip  : 336 kB
```

Nearly half. From deleting configuration.

Automatic code splitting already knows what it is doing. A module reachable from the entry lands in the entry chunk. A module used by two lazy routes lands in a shared chunk that loads when either one does. A module used by one lazy route lands in that route's chunk. That is the behaviour you want, and `manualChunks` overrides it with your guess.

There are still good reasons to reach for it. If the analyzer shows one library genuinely duplicated across many chunks, group that library. But group it because you measured, not because a blog post said vendor splitting is good practice. I left this comment in `vite.config.js` so future me does not repeat it:

> The obvious move is to group node_modules by library ("all of antd in one chunk"), and it is a trap. Measured on this app that grouping costs 627 kB gzipped on first load. Letting the bundler decide brings it down to 336 kB.

Final numbers:

|                          | Before 2.2            | After 2.2                   |
| ------------------------ | --------------------- | --------------------------- |
| First load, uncompressed | 1,620 kB in one file  | 1,011 kB across 36 files    |
| First load, gzipped      | one chunk, everything | **336 kB**                  |
| Chart library            | n/a                   | only on `/dashboard/charts` |
| Total JavaScript         | 1,620 kB              | 2,205 kB across 109 chunks  |

The total went up because the template gained charts, three locales, and seven pages. That is fine. What matters is that none of it loads until someone asks for it.

## 🔐 Roles, because a template without them teaches the wrong habit

Most free dashboard templates give you pages. Then you add your second user type and discover there is nowhere obvious to put that logic.

2.2 has role based access control in three layers.

The navigation tree declares who can see what:

```jsx
{ to: '/dashboard/roles', labelKey: 'nav.items.roles', roles: [ROLES.ADMIN] },
```

The router enforces it for anyone who types the URL:

```jsx
<Route element={<RequireRole roles={[ROLES.ADMIN]} />}>
  <Route path="roles" element={<Roles />} />
</Route>
```

And there is a Roles and Permissions page showing the matrix, so the concept is visible rather than buried in a config file.

One thing I made sure to write down in both the code and the security policy: **none of this is security**. It runs on the user's machine. It stops honest people from wandering into the wrong screen, and it stops nobody with the developer tools open. The same rules have to exist on your server. A template that implies otherwise is doing real damage to whoever learns from it.

Sign in with `admin@vitedash.dev` or `editor@vitedash.dev` on the demo and watch the sidebar change.

## 🔌 A data layer you can actually replace

Every page used to hardcode its data in an array at the top of the file. Nobody ships that, so the template was teaching a pattern that gets deleted on day one.

Now everything that touches data lives in `src/services/`, and each function returns mock data in the shape a real endpoint would:

```js
export const getProducts = async ({ search, category, page, pageSize }) => {
  await delay(500);
  // filtering, sorting, and paging happen here, the way a backend does them
  return { items, total, page, pageSize };
};
```

Swapping in a real API changes this file and nothing else:

```js
export const getProducts = (params) => apiClient.get(`/products?${new URLSearchParams(params)}`);
```

The pages consume it through a small `useAsync` hook, so loading, error, and empty states are the default rather than something you bolt on later. The hook has one detail worth stealing:

```js
const run = useCallback(async () => {
  const id = requestId.current + 1;
  requestId.current = id;
  // ...
  const result = await asyncFunction();
  if (id === requestId.current) setData(result);
}, [asyncFunction]);
```

That guard is why searching does not glitch. Without it, a slow response for "sh" can land after a fast one for "shoes" and quietly replace the newer results with the older ones. It is a two line fix for a bug that is miserable to reproduce.

The Products page has a switch that makes the request fail on purpose, so you can see the error path without unplugging your network.

## 🌍 Three languages, one of them right to left

English, Spanish, and Arabic, with the whole layout mirroring for Arabic.

The good news is that Ant Design does most of the work. Its `ConfigProvider` takes a `direction` prop and flips every component. The interesting part is everything that is not a component:

- The layout had `marginLeft` pushing content past the sidebar. That becomes `marginInlineStart`, which follows the document direction.
- The sidebar's box shadow points left. Physical, not logical, so it needs an explicit `[dir='rtl']` override.
- The active indicator's border radius is `0 3px 3px 0`. Also physical. Also needs mirroring.
- The mobile drawer's `placement` prop is physical. It has to be flipped by hand.
- Recharts does not mirror at all. It lays axes out in document order, so inheriting RTL puts labels on the wrong side of a plot whose bars did not move. Every chart container is pinned to `dir="ltr"`.

Adding a language is now one JSON file and one row in an array. If it is right to left, you set `dir: 'rtl'` and everything above already handles it.

## 📏 The 40px axis, which I still like best

This one is from the previous release, but it is the piece of the template I am fondest of, and it now has a test guarding it.

The sidebar collapses from 248px to 80px. In most dashboards the icons visibly jump sideways when that happens, because Ant Design positions menu icons with two unrelated formulas:

```
expanded  = itemMarginInline + inlineIndent + iconSize / 2
collapsed = collapsedWidth / 2
```

Nothing makes those equal. Unless you solve for it:

```
8 + 24 + 8  ===  80 / 2  ===  40
```

Every icon centre sits at exactly 40px in both states, so collapsing is pure clipping with no re-layout and no drift. There is now a test that fails if anyone breaks the identity, which felt like the right way to protect a number that looks arbitrary until you know why it is not.

Two traps if you ever tune it. `inlineIndent` is a Menu **prop**, not a theme token, because rc-menu writes `padding-left` as an inline style that beats every class rule. And `collapsedIconSize` must stay greater than or equal to `iconSize`, because Ant Design's collapsed rule overrides the icon's `font-size` but not its `min-width`.

## ✨ Everything else

- **Command palette** on Ctrl+K, indexed from the navigation tree and filtered by role, so new pages are searchable with nothing to register
- **Theme customizer** for primary colour, corner radius, and density, all through `ConfigProvider` tokens
- **Charts** with a `useChartTheme` hook and a custom tooltip, because Recharts ships a white tooltip with a hardcoded border that looks broken the moment you switch to dark mode
- **Error boundaries**, one global and one per route keyed on the pathname, so a page that throws leaves the shell usable and navigating away recovers
- **Seven new pages**: Charts, Products, Roles, Notifications, Activity Log, Lock Screen, Maintenance
- **51 tests** with Vitest, and `npm run check` runs lint, format, and tests together
- **Self hosted Inter** instead of a Google Fonts link, which unblocks first paint, works offline, and stops sending visitor IPs to a third party
- **Deploy configs** for Vercel, Netlify, and Docker with nginx

## 🙅 What I left out on purpose

The most common feedback on a template like this is "add TypeScript". I did not, and I want to say why.

ViteDash is a lot of people's first React project. Plain JSX means every file can be read top to bottom without also knowing generics, utility types, and how to type a component that takes children. I added a `jsconfig.json` so you still get autocomplete and path aliases in your editor, and left the type layer to whoever wants it.

Same reasoning for TanStack Query, MSW, Storybook, and a state management library. Each one is a good tool and each one is another concept between a beginner and a working dashboard. The `useAsync` hook is 45 lines and teaches the same lesson with zero dependencies.

Small on purpose is a feature. It is also the thing most likely to get me argued with, and I am fine with that.

## 🚀 Try it

- **Demo**: [vitedash.msyb.dev](https://vitedash.msyb.dev)
- **Source**: [github.com/shehari007/vitedash-vite-antd-dashboard-template](https://github.com/shehari007/vitedash-vite-antd-dashboard-template)

```bash
npx degit shehari007/vitedash-vite-antd-dashboard-template my-dashboard
cd my-dashboard
npm install
npm run dev
```

MIT licensed. Issues and pull requests welcome, and beginner questions are explicitly welcome too. That is who it is for.

If you take one thing from this post, make it the boring one: measure what the browser downloads before first paint, not what the build log prints. Those are different numbers, and I had been reading the wrong one for a year.
