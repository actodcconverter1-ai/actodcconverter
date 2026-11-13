# Homepage and six-guide optimization — 13 November 2026

## Scope and implementation

Implemented the approved SEO action plan on the existing Astro site. No URL, canonical, calculator formula or hosting migration. Preserved the owner's automatic public-page GA4 and full header/footer wordmark from commits 729d1b8 and 5436706.

Homepage: focused calculator/circuit/formula title and description; compact responsive introduction; explicit rectified/filtered/regulated distinction; calculator reached at approximately 464 CSS pixels on the tested 375-pixel phone viewport; engine-generated 12 V bridge example immediately after the workbench; removed the duplicate lower-page bridge example while retaining the separate regulator example and methodology. Eight curated guide links include all six optimized articles, stages and model limitations. Existing diagrams, FAQs, sources and topic anchors remain.

Guides: improved ac-to-dc-formulas, ac-to-dc-calculator-worked-examples, full-wave-bridge-rectifier-explained, smoothing-capacitor-calculation, half-wave-vs-full-wave-rectifier and choosing-ac-to-dc-power-supply. Added intent-specific comparison/checklist tables, reproducible examples, relevant existing original diagrams, contextual internal links and current mode instructions. Preserved publication dates and identifying metadata; marked substantive updates 2026-11-13. No invented measurements or product endorsements. Regenerated editorial manifest and metadata audit.

Mobile: removed the decorative hero waveform in favor of concise model guidance, hidden that supplementary desktop card on phones; shortened hero spacing/type; placed actions on one row; constrained article tables to independently scroll; defer initial layout of the offscreen worked example and guide cards using content-visibility with intrinsic sizes. Calculator live results retain normal rendering for accessibility. No new client dependency; automatic GA4 remains enabled.

## Validation before publication

- ESLint passed. Astro check: 67 files, zero errors/warnings/hints.
- All 109 automated tests passed, no skipped tests.
- Content audit: 25 published guides, lexical 1,251–1,774 words; both lexical and whitespace limits pass.
- Production build: 49 pages. Site audit: 45 sitemap URLs, zero errors, 17,392 bytes public first-party client JavaScript.
- Metadata audit: 46 public HTML pages including 404; zero duplicate/missing metadata or title-width review flags. Width flags are editorial heuristics, not guarantees of Google's displayed titles.
- In-app browser: actual viewports 375×812, 768×1024, 1440×1000; no horizontal document overflow. All six updated articles inspected on phone; wide tables scroll within prose, embedded educational images stay within the column. Eight homepage guide cards verified.
- Browser interaction: filtered default 15.070563 V mean / 14.570563 V valley / 1 V ripple; basic ideal full-wave 10.803796 V mean; linear stage 0.712 W loss; reset restored defaults; 100 µF case correctly rejected excessive ripple. No homepage browser console errors observed.

Windows memory pressure interrupted the aggregate validation process; the same checks were rerun individually with a bounded Node heap. Successful results above come from completed checks, not the interrupted aggregate attempt.

## Performance evidence

Fresh production mobile baseline (Lighthouse 13.6.0, default simulated mobile throttling, headless Chrome, automatic GA4 enabled): performance 67, FCP/LCP 1.9 s, TBT 2,510 ms, CLS 0, speed index 4.2 s. Saved ignored artifacts/seo-mobile-before.report.{json,html}.

Intermediate local diagnostic: performance 70, LCP 1.8 s, TBT 2,350 ms, CLS 0, speed index 2.5 s. This localhost run is not a controlled production before/after comparison. High TBT remains; baseline identifies both layout and the external Google tag as contributors. Final production measurements and deployment evidence are to be recorded after automatic deployment. These lab results do not establish field Core Web Vitals or ranking improvement.
