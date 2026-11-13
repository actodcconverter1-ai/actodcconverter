# Hub-and-spoke implementation — 13 November 2026

## Repository discovery

Scanned the maintained project recursively with rg (186 files before this change, excluding dependencies, generated builds, artifacts and local deployment helpers). Astro 7 static routes live under src/pages; the shared public layout is src/layouts/Base.astro. Homepage: src/pages/index.astro. Calculator spokes: ac-to-dc-calculator.astro and dynamic [tool].astro. Guide spokes: content-backed blog/[slug].astro, with 25 published Markdown articles. Existing source calculators and formulas are unchanged.

## Result

- Homepage is the hub for 28 existing spokes: three calculators and 25 guides. A bottom directory links all 28 plus the new calculator directory. Contextual links in the hero, circuit headings, topology table, component headings and explanatory paragraphs point to relevant existing spokes.
- All 28 spokes receive an opening-paragraph hub backlink and six related calculator/guide links. Related-link ranking uses shared categories/tags and topic terms, excludes the current route, and runs at build time. Publishing a guide automatically adds it to the hub catalog, related-link candidates and sitemap. No browser JavaScript or dependencies were added.
- Breadcrumbs are generated automatically by Base, with a real /calculators/ section parent and a /blog/ guide parent. Existing per-page breadcrumb instances were removed to prevent duplication. The visible list and head BreadcrumbList use the same items.
- Base emits one escaped JSON-LD @graph in the head. It connects Organization, WebSite, WebPage and BreadcrumbList IDs. Homepage adds WebApplication, TechArticle and FAQPage. Calculator spokes add WebApplication; guides add TechArticle with the visible author, image and publication/update dates. No invented ratings, reviews or measured accuracy claims.
- The 12 homepage FAQ questions and answers are shared between visible details and JSON-LD. JSON serialization prevents HTML script termination while preserving the original text.
- Self-referencing canonical tags are checked on every indexable route. Sitemap now covers 46 canonical URLs, with hierarchical priorities (hub 1.0, calculators 0.9, guides 0.8, categories 0.6, informational 0.3, legal 0.2). Lastmod reflects known content/architecture changes rather than every build's clock. The indexing-off setting continues to suppress sitemap publication.

Google ignores sitemap priority/changefreq values; these values express relative site organization, not a ranking promise: [Google sitemap documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). Structured data matches visible content and does not guarantee rich results: [Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). FAQ markup is semantic markup here; no FAQ rich-result eligibility is claimed.

## Created files

| File | Purpose |
|---|---|
| src/lib/topic-graph.ts | Published-spoke catalog and related-link selection |
| src/lib/breadcrumbs.ts | Shared visible/schema breadcrumb model |
| src/lib/structured-data.ts | Application, technical article, FAQ and safe JSON-LD helpers |
| src/lib/sitemap.ts | Canonical sitemap entries, priorities and stable lastmod |
| src/config/homepage-faq.ts | Single source for the 12 visible FAQs |
| src/components/RelatedSpokes.astro | Homepage directory and spoke-related links |
| src/pages/calculators.astro | Real calculator section/index page |
| scripts/audit-topic-graph.mjs | Independent rendered graph/link/canonical/sitemap audit |
| tests/topic-graph.test.ts | Catalog, ranking, breadcrumbs, schema safety and sitemap regression tests |
| docs/audits/HUB-SPOKE-IMPLEMENTATION.md | Implementation inventory and verification record |

## Modified files

| Files | Change |
|---|---|
| src/layouts/Base.astro | Automatic breadcrumbs, shared head @graph, related section |
| src/components/Breadcrumbs.astro | Visual-only reusable breadcrumb; schema moved to head |
| src/components/EducationOverview.astro | Contextual circuit/model/component links; shared FAQ data |
| src/config/seo.config.ts | Explicit TS import for tested canonical helper |
| src/pages/index.astro | Hub schemas, contextual introduction and complete directory |
| src/pages/ac-to-dc-calculator.astro | Opening hub backlink and WebApplication schema |
| src/pages/[tool].astro | Tool backlinks, application schema and real calculator fragment |
| src/pages/blog/[slug].astro | TechArticle, contextual hub backlink, automatic related links |
| src/pages/blog/index.astro | Descriptive H1 and hub context |
| src/pages/category/[category].astro | Shared breadcrumb title and hub context |
| src/pages/about.astro, contact.astro, disclaimer.astro, editorial.astro, privacy.astro, terms.astro | Removed manual breadcrumbs; Base now supplies them consistently |
| src/pages/sitemap.xml.ts | Uses canonical sitemap builder |
| src/styles/global.css | Responsive directories, calculator index, breadcrumbs and visible link styling |
| package.json | Adds audit:graph to the complete verify pipeline |
| docs/audits/METADATA-AUDIT.csv, METADATA-AUDIT.md | Regenerated rendered metadata inventory |
| HANDOFF.md | Links this implementation record |

## Completed validation

- Full npm run verify passed: ESLint; Astro check (76 files, zero errors/warnings/hints); all 116 tests; content audit; production build; site audit; graph audit.
- Final production build generates 50 HTML pages. 46 indexable public pages are represented in the sitemap; private admin pages and 404 are excluded. Public first-party client JavaScript remains 17,392 bytes.
- Rendered graph audit: all 28 spokes are linked from the homepage directory, all have hub introductions and valid related links, every visible breadcrumb matches its head graph, all canonicals self-reference, all 12 FAQs match visible text, no duplicate schema IDs and no sitemap coverage errors.
- Metadata audit: 47 public HTML documents including 404; zero duplicate/missing metadata and zero title-width review flags. Width checks are editorial heuristics, not Google display guarantees.
- In-app browser: actual 375×812 and 1440×1000 viewports; no horizontal page overflow on tested homepage, calculator index, tool and guide. Verified hub directory → calculators index → full-wave calculator → related bridge guide → contextual hub backlink. The full-wave calculator with 6 V RMS returned 5.4018979 V average. Formula source is unchanged.
- A final CSS-only link-affordance adjustment was followed by a fresh build and rendered audits. Release CI repeats the complete verify pipeline. Deployment status is confirmed separately from local build results in the delivery summary.

Local logs and screenshots are in ignored artifacts/. The implementation preserves the owner's full wordmark, automatic GA4, primary .org domain, existing article URLs and private dashboard authentication. Previous mobile performance limitations remain documented in SEO-OPTIMIZATION-2026-11-13.md; this change does not claim an improved Lighthouse performance score or verified field Core Web Vitals.
