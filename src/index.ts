/**
 * emdash-static-export
 *
 * Astro integration that adds a /_emdash/export page to any emdash site.
 * The page has a button that exports the full site snapshot to R2.
 *
 * Install:
 *   npm install github:personalwebsitesorg/emdash-static-export
 *
 * Usage in astro.config.mjs:
 *   import { staticExport } from "emdash-static-export";
 *   export default defineConfig({
 *     integrations: [
 *       emdash({ ... }),
 *       staticExport(),
 *     ],
 *   });
 *
 * Then visit /_emdash/export (must be logged into admin).
 */

import { createRequire } from "node:module";
import path from "node:path";
import type { AstroIntegration } from "astro";

export function staticExport(): AstroIntegration {
	return {
		name: "emdash-static-export",
		hooks: {
			"astro:config:setup": ({ injectRoute, updateConfig }) => {
				// Resolve the emdash snapshot handler source path so the page
				// can import generateSnapshot without relying on private #api/* imports.
				// Resolve from the project root (where emdash is installed), not from
				// this integration's location which may be symlinked.
				const require = createRequire(path.join(process.cwd(), "package.json"));
				const emdashEntry = require.resolve("emdash");
				// emdash entry resolves to node_modules/emdash/dist/index.mjs — walk up to package root
				const emdashRoot = emdashEntry.replace(/[/\\]dist[/\\].*$/, "");
				const snapshotHandler = path.join(emdashRoot, "src/api/handlers/snapshot.ts");

				updateConfig({
					vite: {
						resolve: {
							alias: {
								"emdash-snapshot": snapshotHandler,
							},
						},
					},
				});

				injectRoute({
					pattern: "/_emdash/export",
					entrypoint: new URL("./page.astro", import.meta.url).pathname,
					prerender: false,
				});
			},
		},
	};
}
