# Contributing to ViteDash

Thanks for taking the time. Bug reports, new pages, translations, and
documentation fixes are all welcome, and small pull requests get merged fastest.

## Getting set up

You need Node 20.19 or newer. If you use `nvm`, the version is pinned in
`.nvmrc`.

```bash
git clone https://github.com/shehari007/vitedash-vite-antd-dashboard-template.git
cd vitedash-vite-antd-dashboard-template
npm install
cp .env.example .env
npm run dev
```

## Before you open a pull request

Run the same three checks the project uses:

```bash
npm run check
```

That is lint, format check, and tests together, and `npm install` already wired
it into a `pre-push` git hook, so it runs before anything reaches the remote.
Use `git push --no-verify` to skip it on a work in progress branch.

To run the checks one at a time:

| Command              | What it does                                                      |
| -------------------- | ----------------------------------------------------------------- |
| `npm run lint`       | ESLint, including the accessibility rules. Warnings fail the run. |
| `npm run format`     | Rewrites files with Prettier                                      |
| `npm test`           | Vitest, once                                                      |
| `npm run test:watch` | Vitest, watching                                                  |
| `npm run build`      | Production build, catches import mistakes lint cannot             |
| `npm run analyze`    | Build plus a bundle treemap in `stats.html`                       |

## House style

- **JavaScript, not TypeScript.** The template stays plain JSX so a beginner can
  read every file. Please do not introduce `.ts` or `.tsx` files.
- **Ant Design components first.** Reach for a custom component only when antd
  genuinely has no answer. Theme through `ConfigProvider` tokens rather than
  overriding antd's CSS classes.
- **Import with the `@/` alias**, not `../../..`.
- **Comment the surprising parts.** Most of the code here does not need a
  comment. The parts that do are the ones where the obvious approach is wrong,
  and those comments are the most valuable thing in the repository. Explain why,
  not what.
- **Keep new dependencies rare.** Each one is weight in every user's bundle and
  a decision they inherit. If a feature can be twenty lines of local code, prefer
  that.

## Adding a page

1. Create the component under `src/pages/your-page/YourPage.jsx`
2. Add a lazy import and a `<Route>` in `src/App.jsx`
3. Add an entry to the right group in `src/layout/navConfig.jsx`
4. Add the label to `nav.items` in **every** file under `src/i18n/locales/`

Start the page with `<PageHeader>` so the breadcrumb and spacing match the rest
of the app.

## Adding a language

1. Copy `src/i18n/locales/en.json` to `src/i18n/locales/<code>.json` and
   translate the values, leaving every key exactly as it is
2. Import it in `src/i18n/index.js`, add it to `resources`, and add a row to
   `LANGUAGES` with the correct `dir`

If the language is right to left, set `dir: 'rtl'` and check the sidebar, the
mobile drawer, and the charts before opening the pull request.

## Commit messages

Plain and descriptive is fine. Conventional Commit prefixes (`fix:`, `feat:`,
`docs:`) are appreciated but not required.

## Reporting a bug

Open an issue with the version, the browser, the steps to reproduce, and what
you expected instead. A link to a minimal reproduction gets a fix much faster
than a description.
