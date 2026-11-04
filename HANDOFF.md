# Handoff — updated 4 November 2026

Project: `C:\Users\PC\Downloads\ac-to-dc-converter`.
Intended domain: `https://actodcconverter.online`.

## Owner decisions and scope
First site is AC to DC Converter with its own separate GitHub and Cloudflare accounts. On 4 November the owner supplied and authorized https://github.com/actodcconverter1-ai/actodcconverter for the source push. Cloudflare account details remain pending. Build/deploy/test the real first website before extracting any master; then validate the extracted master with an independent second demo. No master or second demo has been created or claimed ready.

Owner later added a fully functional WordPress-style dashboard (posts/editor/media/advanced SEO/settings/ads) and twenty relevant 1,500–1,800-word articles with proper images. Local repository-backed editing is implemented. Production account integration is implemented in code but cannot be claimed operational before real configuration/testing.

## Current implementation
Astro 7.4.5 static public site, TypeScript, Tailwind 4.3.4, vanilla client interaction. Three explicit models: filtered bridge estimate, ideal unfiltered full-wave and half-wave averages. Source math and tests are separate. Inputs, unit conversion, scope, derivations and manufacturer references are documented. The filtered 20% ripple guardrail is a product modeling limit, not an accuracy guarantee.

Twenty original articles and twenty individual diagram WebPs are integrated. `assets/editorial-manifest.json` lists slugs, source links and counts; original SVGs live in `assets/illustrations`. The actual lexical audit reports 32,377 total words, 1,584–1,662 per article. Whitespace counts also all satisfy 1,500–1,800. Draft/trash content is excluded from public output.

Dashboard routes: local `http://127.0.0.1:4322/admin/`; public preview from the same local server at `/`. Start with `npm run build` and `npm run admin`. The dashboard persists Markdown, media, and JSON settings to disk. Its Rebuild website button invokes the fixed Astro build and updates real public pages. It is loopback-only, not a public unauthenticated editor.

Production Worker routes protect `/admin`, `/admin/*`, `/api/admin/*` using validated Cloudflare Access JWTs and allowed editor emails. GitHub writes use atomic Git tree commits, expected SHA checks, and non-force branch updates. All other routes serve the ASSETS binding. Missing production auth config returns 503 and missing/forged identity returns 401. See ADMIN_GUIDE.md for all environment names and permissions; secrets never belong in client/settings/source.

## Changed files
Package/lock, Astro/TypeScript/ESLint/Wrangler config; `src/config`, calculator engine, content collections, layouts/components, all required pages, admin UI/client/styles, public styles/headers/images; `server/admin.ts`, `server/github.ts`, `worker/index.ts`, loopback admin server; calculator/admin/security tests; content/site/release audit scripts; GitHub verification workflow; original article assets and the required documents plus ADMIN_GUIDE.md.

## Verified evidence so far
- 55 calculator/admin/security unit and API-contract tests passed. They include independent numerical integration, input edges, persistence, draft validation, slug transactions, stale conflicts, media validation/reference protection/trash/restore, settings/ads persistence, cross-origin rejection and production fail-closed behavior.
- Astro TypeScript/content check passed with zero errors, warnings and hints after the dashboard API implementation.
- Integrated build produced 41 HTML pages (including private admin and 404) and 39 sitemap entries; output audit found no internal link/image/heading/meta/schema/coverage errors. Public JS measured 5,933 bytes at that build.
- Browser verified calculator model changes/reset/invalid input/ripple rejection, keyboard FAQ expansion, and public viewport widths 375/768/1440 without document horizontal overflow.
- Browser verified a real draft saved to a Markdown file, then reload/trash/restore; media library displayed an uploaded disposable file; SEO save and ad editor/preview/save worked.
- A disposable enabled ad was built into the actual public HTML, edited through dashboard, and appeared with the changed title after the in-dashboard rebuild. Build endpoint reported complete/exit 0. Fixture post/media/ad were removed from final source afterward.
- Initial static Workers local tests returned 200 for core routes, a real 404 for missing routes, and configured CSP/nosniff headers. Updated admin Worker configuration requires its final dry-run/auth checks after cleanup.
- A contact download test exposed Astro's small-script inlining conflicting with CSP; `assetsInlineLimit: 0` fixes the cause, and the output audit now rejects executable inline scripts. Recheck report feedback after the final build.

## Environment and remaining limits
System Node is 24.14.0, below the current Astro ESLint parser's supported 24.x range. A workspace-only Node 24.16.0 exists in `.tools/node_modules/node/bin`; verification commands use that on PATH. It is ignored and not part of source delivery. CI is pinned to supported Node 24.16.0.

GitHub remote is https://github.com/actodcconverter1-ai/actodcconverter.git. The intended GitHub account was authenticated through Git Credential Manager, and the remote was confirmed empty before the first push. The initial implementation commit c52006a was successfully pushed to main on 4 November 2026, including all 122 source files, dashboard, twenty articles, images, tests and workflow. Cloudflare account details remain pending. No production site was deployed. Canonical origin is correct but public indexing remains disabled; contact channel and operator policy review remain pending. Cloudflare Access login, live dashboard-to-GitHub writes, automatic deployment, custom domain HTTPS, external-link reachability, field performance and full WCAG certification are not verified.

The editor uses Markdown and safe preview, not WordPress itself. Ad manager supports repository image/text campaigns, not arbitrary ad-network scripts, auctions, account management or tracking analytics. Ad date ranges are evaluated at build time and do not themselves schedule rebuilds.

## Exact next steps
1. GitHub source push is complete; retain main as the production branch. On 4 November npm run verify passed: 58 tests, lint, zero-error/warning/hint TypeScript check, 20 articles/32,377 lexical words, 41 HTML pages, 39 sitemap entries, 5,933 bytes of public JS and zero output-audit errors. A source scan found no credential patterns among the 122 intended source files. The GitHub Actions workflow is included; its remote run status has not been claimed successful.
2. Local browser checks already verified mobile/tablet/desktop admin navigation, no document overflow, labeled controls, clean dashboard totals (20 published/0 drafts/24 media/0 ads), and the working report-preparation feedback. Screenshot: artifacts/dashboard-preview.png. Local Workers returned 200 for public pages, 404 for unknown routes and 503/no-store for unconfigured admin/API routes. No QA fixtures remain in source/public output.
3. When owner supplies the Cloudflare account: configure Access, allowed identities, repository variables and token secret; connect Workers Builds, deploy to actodcconverter.online; test real authorized/unauthorized editor flows and commit-to-public-site cycle.
4. Configure public operator contact/review policies, deliberately enable indexing, and verify live HTTPS/status/metadata/crawlers/calculator/admin/mobile/security behavior.
5. Only then finish strategic Phase 1. Extract a separate master afterward, and prove that extracted master with an independent second website before reuse.
