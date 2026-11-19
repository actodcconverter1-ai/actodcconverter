# Phase 0 and 1: HTTP and indexing audit

Audit date: 19 November 2026. Baseline commit: `63b9c43`.

The existing site uses Astro 7.4.5 with `output: static` and `trailingSlash: always`. `npm run build` runs Astro then `scripts/build-locales.mjs`. Cloudflare Workers serves the assets through `worker/index.ts`; `wrangler.jsonc` binds both non-www and www custom domains and uses automatic trailing-slash HTML handling and real 404-page responses.

`worker/canonical.ts` runs before asset serving, authentication or contact writes. It already normalizes HTTP, www and the established legacy Worker host directly to HTTPS non-www, including directory slashes and query parameters. GET/HEAD use 301; unsafe methods retain their method with 308. No new redirect was needed or added. Historical HTTP impressions in Search Console do not establish that HTTP is currently served as a 200 page.

Live curl observations before edits:

| Request | Status | Location / final result |
|---|---|---|
| `http://actodcconverter.org/` | 301 | `https://actodcconverter.org/` → 200 |
| `http://actodcconverter.org/blog/full-wave-bridge-rectifier-explained/` | 301 | Same path on HTTPS → 200 |
| `http://www.actodcconverter.org/` | 301 | HTTPS non-www → 200 |
| `https://www.actodcconverter.org/` | 301 | HTTPS non-www → 200 |
| `http://www.actodcconverter.org/blog/full-wave-bridge-rectifier-explained/?audit=1` | 301 | HTTPS non-www, path/query preserved |
| `http://actodcconverter.org/ac-to-dc-calculator?audit=1` | 301 | `https://actodcconverter.org/ac-to-dc-calculator/?audit=1` |
| Intentionally missing HTTPS route | 404 | Real HTTP 404 |

`src/config/editorial.json` supplies the HTTPS origin. `src/config/seo.config.ts` builds canonicals/social URLs, `src/lib/sitemap.ts` and `src/pages/sitemap.xml.ts` generate the sitemap, and `src/pages/rss.xml.ts` generates HTTPS feed item URLs. `src/pages/robots.txt.ts` emits the HTTPS sitemap line. Locale canonicals, hreflang and x-default are generated in `scripts/build-locales.mjs`. `/search/` and its 17 localized equivalents are already noindex/follow and excluded from the XML sitemap.

HSTS is already `max-age=31536000`, with neither includeSubDomains nor preload. It is retained after successful HTTPS checks. The source scan's `http://www.w3.org/2000/svg` strings are XML namespaces, not downloaded assets; local admin development uses HTTP loopback. Neither is production mixed content.

The audit found substantive later-phase work: homepage/calculator query ownership overlap, FAQPage markup contrary to this task, an oversized homepage guide directory, and legacy translations that have not had verified native technical review. Existing category pages already contain substantial learning paths and must be assessed before calling them thin. The CSV contains 147 queries (36 A, 33 B, 78 C), including several incorrect suggested clusters that need explicit reassignment.

Run `node scripts/audit-http.mjs` to repeat the nine complete redirect chains and 404/search/HSTS checks. Its timestamped response evidence is written to `artifacts/http-audit.json`. Requests do not use `-k` or bypass certificate validation. Geographic language selection is separate from canonical redirects and remains enabled for eligible first visits; explicit locale paths and manual choices remain stable.
