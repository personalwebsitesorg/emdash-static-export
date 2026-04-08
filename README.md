# emdash-static-export

One-click export of emdash site data to R2. Adds a `/_emdash/export` page with a button that exports the full site snapshot as JSON.

## Install

```bash
npm install github:personalwebsitesorg/emdash-static-export
```

## Usage

Add to your `astro.config.mjs`:

```js
import { staticExport } from "emdash-static-export";

export default defineConfig({
  integrations: [
    emdash({ ... }),
    staticExport(),  // add after emdash()
  ],
});
```

Then visit `/_emdash/export` (must be logged into admin).

## What it exports

The full site snapshot to R2 at `exports/site-export.json`:

- All published posts and pages (ec_* tables)
- Media with URLs
- Menus and menu items
- Taxonomies and content associations
- Widget areas and widgets
- SEO metadata
- Bylines
- Site settings

## How it works

1. Astro integration injects a page at `/_emdash/export`
2. Page checks admin auth via `locals.user`
3. On button click, runs `generateSnapshot()` logic against D1
4. Filters out tables not needed by the frontend (revisions, migrations, CMS internals)
5. Uploads JSON to R2 via `emdash.storage.upload()`
6. No plugins, no sandbox, no API tokens needed

## Vite alias: `emdash-snapshot`

This integration imports `generateSnapshot` from emdash's internal source via a Vite alias:

```
emdash-snapshot → {emdash-root}/src/api/handlers/snapshot.ts
```

This works because emdash currently ships `src/` in its npm package. **If you upgrade emdash, verify that:**

- `src/api/handlers/snapshot.ts` still exists at that path
- The `generateSnapshot` function signature hasn't changed
- emdash still includes `src/` in the published package

Long-term, this should be replaced with a public export from emdash (e.g. `import { generateSnapshot } from "emdash"`).
