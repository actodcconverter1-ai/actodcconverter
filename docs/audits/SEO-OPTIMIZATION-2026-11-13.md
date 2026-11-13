# Homepage and six-guide optimization — 13 November 2026

## Scope and implementation

Implemented the approved SEO action plan on the existing Astro site. No URL, canonical, calculator formula or hosting migration. Preserved the owner's automatic public-page GA4 and full header/footer wordmark from commits 729d1b8 and 5436706.

Homepage: focused calculator/circuit/formula title and description; compact responsive introduction; explicit rectified/filtered/regulated distinction; calculator reached at approximately 464 CSS pixels on the tested 375-pixel phone viewport; engine-generated 12 V bridge example immediately after the workbench; removed the duplicate lower-page bridge example while retaining the separate regulator example and methodology. Eight curated guide links include all six optimized articles, stages and model limitations. Existing diagrams, FAQs, sources and topic anchors remain.

Guides: improved ac-to-dc-formulas, ac-to-dc-calculator-worked-examples, full-wave-bridge-rectifier-explained, smoothing-capacitor-calculation, half-wave-vs-full-wave-rectifier and choosing-ac-to-dc-power-supply. Added intent-specific comparison/checklist tables, reproducible examples, relevant existing original diagrams, contextual internal links and current mode instructions. Preserved publication dates and identifying metadata; marked substantive updates 2026-11-13. No invented measurements or product endorsements. Regenerated editorial manifest and metadata audit.

Mobile: removed the decorative hero waveform in favor of concise model guidance, hidden that supplementary desktop card on phones; shortened hero spacing/type; placed actions on one row; constrained article tables to independently scroll; increase footer links to 44-pixel touch targets. The existing educational-section rendering optimization remains; the experimental new containment on guides/example was removed after the mobile accessibility audit. Calculator live results retain normal rendering for accessibility. No new client dependency; automatic GA4 remains enabled.

## Validation before publication

- ESLint passed. Astro check: 67 files, zero errors/warnings/hints.
- All 110 automated tests passed, no skipped tests.
- Content audit: 25 published guides, lexical 1,251–1,774 words; both lexical and whitespace limits pass.
- Production build: 49 pages. Site audit: 45 sitemap URLs, zero errors, 17,392 bytes public first-party client JavaScript.
- Metadata audit: 46 public HTML pages including 404; zero duplicate/missing metadata or title-width review flags. Width flags are editorial heuristics, not guarantees of Google's displayed titles.
- In-app browser: actual viewports 375×812, 768×1024, 1440×1000; no horizontal document overflow. All six updated articles inspected on phone; wide tables scroll within prose, embedded educational images stay within the column. Eight homepage guide cards verified.
- Browser interaction: filtered default 15.070563 V mean / 14.570563 V valley / 1 V ripple; basic ideal full-wave 10.803796 V mean; linear stage 0.712 W loss; reset restored defaults; 100 µF case correctly rejected excessive ripple. No homepage browser console errors observed.

Windows memory pressure interrupted the aggregate validation process; the same checks were rerun individually with a bounded Node heap. Successful results above come from completed checks, not the interrupted aggregate attempt.

## Performance evidence

Fresh production mobile baseline (Lighthouse 13.6.0, default simulated mobile throttling, headless Chrome, automatic GA4 enabled): performance 67, FCP/LCP 1.9 s, TBT 2,510 ms, CLS 0, speed index 4.2 s. Saved ignored artifacts/seo-mobile-before.report.{json,html}.

Intermediate local diagnostic: performance 70, LCP 1.8 s, TBT 2,350 ms, CLS 0, speed index 2.5 s. This localhost run is not a controlled production before/after comparison. High TBT remains; baseline identifies both layout and the external Google tag as contributors. Final production measurements and deployment evidence are recorded below. These lab results do not establish field Core Web Vitals or ranking improvement.

## Production findings and follow-up fixes

Release e3452d5109891cb8ef612efa6fe180dc68d6e171 passed GitHub Verify run 43348592382 and Cloudflare build 1aa072b9-0a80-4620-b91c-a6f0837cd26f (Worker version 50d70716-649f-4289-92d2-ffa7b1e9580b); live build-info matched. All 97 public assets matched the local production build. Admin redirected to login, protected API returned 401, auth status was ready, caching was private/no-store, missing page returned 404, no owner Gmail appeared in public HTML. Live browser verified title/canonical/index-follow, eight guide cards, working default calculation and updated guide date; GA4 script was present, no public page URL changes.

Initial production mobile after-run: performance 69, FCP/LCP 1.9 s, TBT 2,640 ms, CLS 0, speed index 3.0 s. This improves visual completeness against the fresh baseline but does not show a TBT improvement. Lighthouse identified undersized footer targets and the existing Cloudflare-injected beacon being blocked by CSP. Follow-up fixes enlarge targets and allow only the documented Cloudflare beacon provider on public pages. Source: https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/ . Private Worker responses instead set a stricter self-only script/connect policy using Headers.set, avoiding case-insensitive header duplication. A regression test checks login, authenticated editor and API policies. Privacy notice now describes public performance measurements. The owner-set GA4 configuration and authentication credentials are unchanged. Lighthouse also attributed back/forward-cache exclusion to critical memory pressure on this Windows machine, not an actionable site reason.

## Final verified release

Code release a28f9c887be64cd42192747328ca321b04146cd8 passed GitHub Verify run 43349898831 and Cloudflare build b563c7c0-af0a-4982-9c7f-111522bc5dc0 (Worker version 5a0d622b-d875-4723-84f3-e346d225f93d). Production build-info matched that exact commit. All 97/97 deployed assets matched the final local build. A transient DNS failure interrupted one verification attempt; the subsequent complete run passed with no asset errors. Private login/API script and connection policies were verified as self-only. Public CSP permits the configured GA4 and Cloudflare performance beacon. HTTP, www and workers.dev redirects returned 301 to the canonical HTTPS domain with the test path/query preserved. Private API returned 401, admin redirected to login, missing route returned 404 and no public owner email was found.

Final mobile Lighthouse run (same default mobile simulation and Chrome headless flags, GA4 active; Cloudflare beacon now works):

| Metric | Fresh production baseline | Final production |
|---|---:|---:|
| Performance | 67 | 67 |
| First contentful paint | 1.9 s | 1.1 s |
| Largest contentful paint | 1.9 s | 1.1 s |
| Total blocking time | 2,510 ms | 3,360 ms |
| Speed index | 4.2 s | 4.8 s |
| Cumulative layout shift | 0 | 0 |
| Accessibility | — | 100 |
| Best practices | — | 100 |
| SEO | — | 100 |

The final run clears the touch-target, console-error and CSP-issue failures. Initial content/LCP improved, but overall performance did not improve and blocking/visual-completion metrics regressed in this run. Do not describe this as a blanket performance-score improvement or claim passing field Core Web Vitals. Windows was under documented critical memory pressure during this session; scores are single-run lab diagnostics, not stable field measurements. High blocking time remains an optimization limitation, with layout and the external Google tag contributing. Analytics were not disabled or artificially delayed to improve the benchmark. Public Cloudflare performance measurements can supply real-visitor evidence as data accumulates.

Artifacts (ignored locally): seo-mobile-before.report.{json,html}, seo-mobile-after.report.{json,html}, seo-mobile-final.report.{json,html}, seo-homepage-live-mobile.png, live-verification.json, seo-check.log, seo-tests.log, seo-lint.log and seo-build.log. All final lint/type checks, 110 tests, content and static audits passed. Local preview server was stopped after production browser verification; the public-site preview tab remains available.

The final documentation-only commit records these measurements; it does not alter rendered site content. See GitHub checks and production build-info for that documentation commit's automatic deployment.