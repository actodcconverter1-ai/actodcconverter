# Handoff — updated 5 November 2026

Project: `C:\Users\PC\Downloads\ac-to-dc-converter`.
Intended domain: `https://actodcconverter.online`.

## Runtime token access check — 5 November 2026

Owner deployed GITHUB_TOKEN as an encrypted runtime Secret; all four required secret names now exist. Live signed-in dashboard accepts the session and reaches the GitHub adapter, but Git tree reads return 404 with that token. Confirmed active public coordinates are actodcconverter1-ai/actodcconverter, branch main. Independently reading the same git/trees/main endpoint using the existing Git sign-in returned 200 and 154 entries, so the branch and endpoint are valid. Owner reports difficulty enabling Contents write permission and is configuring a fine-grained token using an official prefilled form. No token value was read or copied into source/chat.

Improved the masked-404 error to mention selected repository and Contents permission as well as branch name. Full verification passes with 74 tests. Live save/commit/deployment round trip remains pending corrected runtime token access; do not claim success until a real dashboard save, reload and matching live build commit are observed.

## Dashboard connection fix — 5 November 2026

Owner reported an endless Connecting screen after login. Active runtime inspection confirmed ADMIN_PASSWORD_HASH is configured but GITHUB_TOKEN is absent (only ADMIN_EMAILS, ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET exist). Owner is generating a repository-scoped token and must deploy it as a runtime Worker Secret, rather than a build variable.

Startup errors previously appeared only in a six-second toast and left the loading screen indefinitely. The client now shows a persistent actionable error and Retry connection button, disables navigation until data is ready, handles non-JSON service failures and bounded connection timeouts, and marks GitHub connected only after all initial data loads. The Worker explains missing runtime token configuration. GitHub upstream requests have timeouts and explicit permission/expiry errors. Verification passed: 73 tests, lint, typecheck, content audit, 43-page build, output audit. Live positive login/save checks remain pending usable browser access and owner token configuration; no successful live save is claimed.

## Current authentication update — 5 November 2026

The owner declined Zero Trust and prohibits storing the original password in `.env` or Cloudflare Secrets. Access authentication has been replaced with a browser-generated salted PBKDF2 verifier, secure signed session cookies, CSRF checks and a native Cloudflare rate-limit binding. No original password, API token or private email is tracked. `/admin/password-setup/` generates the verifier locally without uploading the password; only the owner can place that verifier in `ADMIN_PASSWORD_HASH` through Cloudflare. No public registration/reset API exists.

Already provisioned encrypted secrets: `ADMIN_EMAILS`, `ADMIN_SESSION_SECRET`. Last inspected missing: `ADMIN_PASSWORD_HASH`, `GITHUB_TOKEN`. The owner must configure those directly, without sending their values in chat. The GitHub token must be repository-scoped Contents read/write. No `.env` or `.dev.vars` setup is needed or encouraged; the old example has been removed.

Verification: 72 tests passed, lint passed, TypeScript reported zero errors/warnings, all 20 articles passed the content audit, build produced 43 HTML pages and 39 sitemap entries, public JavaScript 5,933 bytes, output audit zero errors. Live successful login and post saving remain pending owner setup. Automatic deployment is now verified: pushed commit `483cf8aa2cee25135320887b0e3b8a355a17ada4` passed GitHub Verify run 41954077566 and Cloudflare Workers Build `fc81a2d3-315c-4d98-af91-937c86804d25` (version `ebc42f15-bc49-4062-a164-3cbb0475e99a`), and the live `/build-info.json` returned that exact commit. No manual deployment was used for this test. Live checks: 72/72 public assets matched the tested build; no private email in public HTML; unknown route 404; `/admin/` redirects 302 to login; login/setup pages 200; auth status ready=false; protected API 503; private responses no-store. The older Access-specific notes below are historical and superseded by this section and ADMIN_GUIDE.md.

## Latest deployment update — 4 November 2026

Review site is deployed at `https://ac-to-dc-converter.actodcconverter1.workers.dev` in the owner-authorized account `0863917d131e2a06192ec0ce3748952a`, Worker `ac-to-dc-converter`. Initial deployed version was `30cc7415-35df-43ac-ba22-118d21f039e2`; storing the admin-email secret creates a subsequent deployment. Canonical origin remains the intended domain and indexing is deliberately disabled. The owner will attach the custom domain later; no domain/zone was present in this account and none was created.

Live HTTPS verification: 70 public pages/assets returned 200 and matched the local tested build byte-for-byte; unknown URL returned 404. Public HTML contained no Gmail address. Artifact: `artifacts/live-verification.json`. Public core calculator/blog/contact/policy routes and security headers responded correctly. Live interactive browser inspection timed out, so no new live browser-interaction success or remote screenshot is claimed; the published JavaScript exactly matches the build already tested locally.

The owner supplied a private dashboard login email and explicitly forbade using it on the public contact page. It was stored only as encrypted Cloudflare secret `ADMIN_EMAILS`; no email value was added to tracked source, public settings, docs or pages. `contactEmail` remains empty.

Remaining integrations: `/admin/` and `/api/admin/session` return 503/no-store because Cloudflare Access settings and repository write secret are not configured yet. The project-specific Wrangler OAuth login can deploy Workers, but both account Access organization and Workers Builds configuration reads return 403 (authentication/permission error). Git auto-deployment is therefore not fixed/connected or claimed working. The correct configuration is existing Worker `ac-to-dc-converter`, GitHub repo `actodcconverter1-ai/actodcconverter`, branch main, root `/`, Node 24.16.0, build `npm run verify`, deploy `npx wrangler deploy`. The owner must authorize the necessary GitHub App/Cloudflare management access or configure these settings through the dashboard. Do not reuse a Git push credential silently as the Worker write secret.

Deployment login is isolated through child-process `XDG_CONFIG_HOME` at the ignored `.wrangler/account-auth` directory. Do not read, print or commit its token values. Other projects' default Wrangler login was not changed. Account ID and public GitHub variables are tracked in wrangler.jsonc; the private email is not. Next: push this deployment configuration/status, complete Access + GitHub build/write authorization when available, test the real editing/deploy round trip, and preserve the template-extraction gate.

## Owner decisions and scope
First site is AC to DC Converter with its own separate GitHub and Cloudflare accounts. On 4 November the owner authorized the GitHub repository and the Cloudflare account recorded in the latest deployment update. The owner requested a workers.dev review deployment first and will attach the custom domain personally later. Build/deploy/test the real first website before extracting any master; then validate the extracted master with an independent second demo. No master or second demo has been created or claimed ready.

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

GitHub remote is https://github.com/actodcconverter1-ai/actodcconverter.git. The intended GitHub account was authenticated through Git Credential Manager, and the remote was confirmed empty before the first push. Initial implementation commit c52006a was pushed to main with all 122 source files. The public workers.dev review deployment is now live and verified as described above. Canonical origin is the future custom domain and public indexing stays disabled. Public contact/operator policy review, Cloudflare Access login, live dashboard-to-GitHub writes, automatic deployment, custom domain HTTPS, external-link reachability, field performance and full WCAG certification remain unverified. The owner's private login email must not be used as a public contact address.

The editor uses Markdown and safe preview, not WordPress itself. Ad manager supports repository image/text campaigns, not arbitrary ad-network scripts, auctions, account management or tracking analytics. Ad date ranges are evaluated at build time and do not themselves schedule rebuilds.

## Exact next steps
1. GitHub source push is complete; retain main as the production branch. On 4 November npm run verify passed: 58 tests, lint, zero-error/warning/hint TypeScript check, 20 articles/32,377 lexical words, 41 HTML pages, 39 sitemap entries, 5,933 bytes of public JS and zero output-audit errors. A source scan found no credential patterns among the 122 intended source files. The GitHub Actions workflow is included; its remote run status has not been claimed successful.
2. Local browser checks already verified mobile/tablet/desktop admin navigation, no document overflow, labeled controls, clean dashboard totals (20 published/0 drafts/24 media/0 ads), and the working report-preparation feedback. Screenshot: artifacts/dashboard-preview.png. Local Workers returned 200 for public pages, 404 for unknown routes and 503/no-store for unconfigured admin/API routes. No QA fixtures remain in source/public output.
3. Obtain the additional Access/Workers Builds management authorization or have the owner configure those integrations in Cloudflare. Then configure Access and the repository-scoped write secret, connect Workers Builds, and test authorized/unauthorized editor flows and the commit-to-public-site cycle. The owner will attach the custom domain later.
4. Configure public operator contact/review policies, deliberately enable indexing, and verify live HTTPS/status/metadata/crawlers/calculator/admin/mobile/security behavior.
5. Only then finish strategic Phase 1. Extract a separate master afterward, and prove that extracted master with an independent second website before reuse.
