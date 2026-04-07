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

import type { AstroIntegration } from "astro";

export function staticExport(): AstroIntegration {
	return {
		name: "emdash-static-export",
		hooks: {
			"astro:config:setup": ({ injectRoute }) => {
				injectRoute({
					pattern: "/_emdash/export",
					entrypoint: new URL("./page.astro", import.meta.url).pathname,
					prerender: false,
				});
			},
		},
	};
}
