# Releasing

A short checklist so nothing drifts between releases. The badges in the README
are hardcoded numbers, and without continuous integration nothing else is going
to notice when they go stale, so updating them is a step here rather than a
hope.

## 1. Get the tree green

```bash
npm run check     # lint, format check, tests
npm run build     # catches import mistakes lint cannot
```

The pre-push hook runs `npm run check` for you, but run the build too. It is the
only thing that resolves every lazy import.

## 2. Update the numbers

| Where              | What                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `package.json`     | Bump `version`. Additive changes are a minor, fixes are a patch.                                                           |
| `CHANGELOG.md`     | New section at the top, and a link at the bottom. Written for someone deciding whether to upgrade, not for the commit log. |
| `README.md` badges | The test count and the first load size. Both are hardcoded.                                                                |
| `SECURITY.md`      | Move the supported versions table along.                                                                                   |

Getting the current numbers:

```bash
npm test                              # the test count for the badge
npm run build && npm run analyze      # bundle sizes, treemap in stats.html
```

## 3. Refresh the screenshots

Only when the interface actually changed, but do not skip it when it did. A
release whose screenshots show the previous version is worse than one with none.

```bash
npm run build
npx vite preview --port 4190

# in a second terminal
npm i -D playwright
node docs/screenshots/capture.mjs
npm uninstall playwright
```

That regenerates all eight images in `docs/screenshots/` and rebuilds
`public/og-image.png` from the fresh dark mode capture. See
[docs/screenshots/README.md](docs/screenshots/README.md).

## 4. Commit, tag, push

```bash
git add -A
git commit -m "v2.2.0"
git tag -a v2.2.0 -m "v2.2.0"
git push origin main --follow-tags
```

The tag matters. Without one there is nothing for a release to hang off, and
nothing for someone to pin to.

## 5. Publish the release

```bash
gh release create v2.2.0 --title "v2.2.0" --notes-file release-notes.md
```

Or paste into the web UI. Either way, write the notes from the CHANGELOG rather
than letting GitHub auto-generate them from commit titles. Releases are what
notify everyone watching the repository, so they are worth ten minutes.

Lead with what was fixed and what it means for the reader. Save the feature list
for further down.

## 6. After

- Redeploy the demo at <https://vitedash.msyb.dev> so it matches the tag
- Check that the social card renders, by pasting the demo link into any chat app
- If the release is a notable one, cross-post the write up in `docs/blog/`
