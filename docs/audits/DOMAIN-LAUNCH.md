# Production domain and SEO routing — 11 November 2026

The owner selected **https://actodcconverter.org** as the production origin. This replaces the previously planned .online origin and supersedes the earlier workers.dev/noindex review policy.

## Configuration

- Public pages: index, follow; canonical, Open Graph, social-image and JSON-LD URLs use the .org origin.
- Public robots allows crawlers, excludes admin/API paths and advertises https://actodcconverter.org/sitemap.xml.
- Sitemap: 45 canonical public URLs, excluding private routes, drafts/trash and the 404 page. No fabricated lastmod values.
- HTTP, www and the former workers.dev host: 301 to HTTPS non-www for GET/HEAD, preserving path/query. Directory slashes and /index.html aliases normalize in the same hop. POST/other methods use 308 to preserve their method; cross-origin API checks remain enforced. Admin sessions are origin-bound, so sign in afresh at the .org dashboard.
- Unknown paths retain actual 404 after normalization. No blanket redirect of deleted/missing pages to the homepage.
- Wrangler owns both apex and www custom-domain bindings, and enables the legacy workers.dev hostname as a redirect entry point. Cloudflare manages DNS and certificates for those custom domains. Do not add the never-launched .online domain unless the owner separately connects it.
- All requests run through the Worker so existing assets cannot bypass host/HTTPS redirects. This uses Worker request quota; it is a deliberate tradeoff for consistent redirects without a separate zone-rule credential. No new paid service or credential was created.
- HSTS is set for one year without includeSubDomains/preload, so unconfigured subdomains are not implicitly forced to HTTPS.

## Local evidence

104 automated tests pass, including five routing tests covering aliases, HTTP, query preservation, loop prevention, methods, assets/APIs and routing before authentication or writes. Full lint/typecheck/build/content/static audit passed: 49 HTML pages, 45 sitemap URLs and no generated-output audit errors. Metadata audit: 46 public HTML documents (including the noindex 404), no missing/duplicate metadata. Release contact readiness on the new HTTPS domain and Wrangler bundle dry-run passed. The release CLI's JSON import compatibility was repaired and retested.

## Live verification

Before this change, the .org zone was active and bound to ac-to-dc-converter in the dedicated account, apex HTTPS returned 200, HTTP returned 200 without redirect, www did not resolve, and the legacy workers.dev endpoint returned 404. Deployment verification of the new rules follows the source push; do not infer those rules were live from local tests alone.

## Google follow-up

The owner should add/verify the domain property actodcconverter.org in Google Search Console, submit the sitemap URL above, and inspect the homepage and a sample article. No Search Console property access or Google verification token was supplied. Search engines control crawling, indexing and rankings; index/follow and successful tests do not guarantee inclusion. The earlier performance/field-data/independent review limitations remain documented in UPGRADE-VERIFICATION.md.

Primary references: [Google permanent redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects), [Cloudflare custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [Worker-first routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/).

## Verified production results

Commit 2a3bbdecf55372815c799030361cbc7787ee499e passed GitHub Verify and Workers Builds. Live https://actodcconverter.org/build-info.json returned that exact revision. GitHub run: https://github.com/actodcconverter1-ai/actodcconverter/actions/runs/42966647071 ; Cloudflare build 430be71d-8a5a-4554-b8a1-1c2edea80825, deployed version 917e2784-16af-47e7-b45c-a1f3c67e8a64.

Live checks passed: apex HTTP -> HTTPS 301; legacy workers.dev -> matching .org path 301; query preservation; directory/index.html normalization; homepage 200 with self-canonical and index/follow; robots.txt 200 with sitemap advertisement; sitemap.xml 200 with 45 exclusively .org URLs; missing page 404/noindex; admin 302 to the same-origin login; unauthenticated API 401/noindex/private-no-store; contact challenge 200.

Both apex and www custom-domain bindings were confirmed in the dedicated Cloudflare account. Public Cloudflare DNS returned two A records for www. The local resolver retained a negative DNS cache from the initial missing record; using a current public DNS answer with normal TLS certificate validation confirmed both www HTTPS and HTTP return 301 directly to HTTPS non-www, retaining the path/query. No certificate bypass or system DNS setting change was used. Individual resolvers can need time to refresh their cached answers.

The existing login email and password verifier are unchanged. Sessions are origin-bound: use https://actodcconverter.org/admin/ and sign in again there. No secret was added to source, .env or public settings. Search Console verification/submission remains an owner step; Google indexing and rankings are not claimed.
