# Tasks — 3 November 2026

## Strategy gates
- [ ] Phase 1: deploy the first AC to DC website to its dedicated GitHub repository, Cloudflare account, and actodcconverter.online; verify production.
- [ ] Phase 2: only after Phase 1 passes, extract the proven reusable master into a separate repository.
- [ ] Phase 3: build a second independent demo from that extracted master and verify brand, calculator logic, content, SEO, and deployment independence.
- [ ] Phase 4: use fresh copies of the validated master for future separate websites/accounts/domains.

## First website implementation
- [x] Isolated Git repository and current stable Astro/TypeScript/Tailwind/Workers dependencies with lockfile.
- [x] Site/calculator/SEO configuration, mathematical separation, responsive layouts, reusable first-site components.
- [x] Main calculator and meaningful full-wave/half-wave tools with validation, reset, result clearing, formulas, assumptions, references, examples and FAQs.
- [x] Homepage, blog listing/posts, category archives, About, Contact/report, Privacy, Terms, Disclaimer and 404.
- [x] Canonical, Open Graph, Twitter, qualified schema, sitemap, robots, internal links, local images, dimensions and lazy loading.
- [x] Security/cache headers, strict executable script CSP, minimal public JS, keyboard labels/focus and live results.
- [x] 20 original educational articles; each 1,500–1,800 words by both counters; 20 individual original diagram images and source manifest.
- [x] WordPress-style dashboard: posts list/search/status filters, Markdown editor/tools/safe preview, drafts/publication, slug changes, trash and restore.
- [x] Persistent media upload/search/selection, repository image previews, reference-protected soft trash and restore.
- [x] Persistent SEO and advanced settings consumed by the actual public build.
- [x] Banner ads manager: placements, copy/images, HTTPS destination, enable/disable, preview, removal and build-time date windows.
- [x] Loopback local repository API and working in-dashboard public-site build command.
- [x] Production Worker API with signature/issuer/audience/email checks and GitHub content transactions; no dummy persistence.
- [x] GitHub verification workflow and documented Workers Builds deployment integration.
- [x] 58 calculator/admin/security/repository tests passed; TypeScript/content checks reported zero errors/warnings/hints.
- [x] Browser tested draft save/reload, post trash/restore, media search/upload presence, ads edit/preview/save, SEO save and local rebuild.
- [x] Disposable banner verified in actual static output after source change/build; disposable test data removed from final source.
- [x] Final local verification after integration: 58 tests, lint, TypeScript, 20-article audit, 41-page build, 39-entry sitemap and generated-output audit passed. Workers dry-run and fail-closed routing were also checked locally.
- [x] Dedicated GitHub account authenticated and empty target repository verified: https://github.com/actodcconverter1-ai/actodcconverter.
- [x] Complete source pushed to main in https://github.com/actodcconverter1-ai/actodcconverter on 4 November 2026 (initial implementation commit c52006a).
- [x] Review deployment published to the owner-specified Cloudflare account at https://ac-to-dc-converter.actodcconverter1.workers.dev. All 70 checked public pages/assets returned 200 and matched the tested build; unknown routes returned 404; the private dashboard email was absent from public pages.
- [x] Private dashboard email stored as encrypted ADMIN_EMAILS Worker secret; it remains absent from public contact settings and GitHub source.
- [ ] Live password login/GitHub editing round trip, automatic deployment, custom domain/HTTPS and production tests.

## Deferred by owner / limits
- Owner supplied and authorized the dedicated GitHub repository and Cloudflare account on 4 November 2026. The owner asked to test the workers.dev deployment first and will add the custom domain personally later.
- Workers Builds configuration API returns 403 for the current Wrangler OAuth login. Password auth replaces Access; the owner must set only ADMIN_PASSWORD_HASH and the repository-scoped GITHUB_TOKEN directly as encrypted Worker secrets. Live positive login, saving and automatic deployment remain unverified. No credentials should be pasted into chat.
- Operator contact and final policy review remain needed; indexing intentionally remains disabled.
- Editor is Markdown with safe preview and formatting controls, not WordPress/Gutenberg runtime.
- Ads manager is for sponsored banner content, not an ad-network account/auction/tracking platform. Dates change public output on builds.
- No live production, search indexing/ranking, real account integration, field performance, or full accessibility certification is claimed.
- Template extraction and the second demo remain deliberately gated.

## Milestone log
- Requirements inspected and isolated draft created; initial voltage-unit proof superseded when owner selected AC to DC.
- AC/DC models implemented using referenced formulas and independent integration tests; floating-point boundary issue found and fixed.
- Initial local site passed 41 calculator tests, build, metadata/link/image audit and static Workers dry-run; real local 404/header behavior checked.
- Owner expanded scope to a persistent WordPress-style dashboard and twenty long educational articles; backend/auth requirements added for that real use case.
- Dashboard API/UI and original article/diagram collection implemented, reviewed and tested; deployment deferred to the owner-provided accounts.

- [x] Free password-verifier login implementation: 72 tests, lint, typecheck, content/build/output audits passed. Original password never stored in env files or Worker secrets.
