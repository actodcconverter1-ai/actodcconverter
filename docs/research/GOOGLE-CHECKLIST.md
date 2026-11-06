# Google Search implementation checklist

Research reviewed on 5 November 2026. **RESEARCHED** means official guidance was consulted and a project decision was written in SEO-PLAN.md. It does not mean the application, live response or external Google tool has passed. Final implementation/test evidence belongs in the production-readiness report.

| Area | Research status | Required implementation/test evidence |
| --- | --- | --- |
| Search Essentials / helpful content | RESEARCHED | Distinct intent, useful original explanation and working tool; no ranking guarantee. |
| Scaled content, link and site-reputation abuse | RESEARCHED | Editorial review of every article, no low-value doorway pages or unrelated hosted SEO content; sponsored links qualified. |
| Title links / snippets | RESEARCHED | Build-derived uniqueness report plus editorial review and documented width estimate; no rigid Google character limits asserted. |
| Canonicals | RESEARCHED | Intended HTTPS origin, unique self-canonical pages, consistent links and trailing slashes; actual domain/redirect tests at launch. |
| Noindex / robots | RESEARCHED | Review public content crawlable with visible noindex; private routes authenticated; do not block the noindex signal with Disallow:/. |
| XML sitemap | RESEARCHED | Review sitemap disabled/unadvertised while no URLs are indexable; do not submit an empty sitemap. At launch include only canonical indexable 200 URLs with meaningful lastmod only. |
| Status codes / redirects | RESEARCHED | Real HTTP 200, 301 where intentionally retired, 404 for unknown routes; no soft errors. |
| JavaScript rendering | RESEARCHED | Static educational text, metadata, schema and anchors; calculator enhancement does not conceal main content. |
| Article / breadcrumbs / organization | RESEARCHED | JSON-LD parses, values match visible content and actual identity; external validation reported separately. |
| SoftwareApplication | RESEARCHED | No fabricated rating/review to obtain a rich result; schema validity distinguished from Google eligibility. |
| Visible FAQs | RESEARCHED | Helpful answers remain visible; no Google FAQ rich-result claim because feature was deprecated in May 2026. |
| Images | RESEARCHED | Original assets, accurate topology, alt/captions/dimensions, responsive readability and appropriate loading behavior. |
| Internal links / architecture | RESEARCHED | Homepage/category/article discovery paths and relevant contextual anchors; no orphan articles or fake links. |
| Mobile-first content | RESEARCHED | Mobile and desktop preserve main content/links/metadata; inputs, tables and diagrams remain usable. |
| Core Web Vitals | RESEARCHED | Measured lab evidence with conditions; real-user p75 LCP/INP/CLS requires adequate field data. |
| Search Console | OWNER / EXTERNAL DEPENDENCY | Custom-domain ownership verification, sitemap submission and URL inspection once owner authorizes launch. |
| Electrical trust | EDITORIAL REVIEW REQUIRED | Sources and examples checked; no invented engineer, physical test or certification; safety/model boundaries visible. |

Sources and specific implementation decisions are linked in [SEO-PLAN.md](SEO-PLAN.md). [KEYWORD-MAP.csv](KEYWORD-MAP.csv) contains URL intent boundaries. [CONTENT-BRIEFS.md](CONTENT-BRIEFS.md) contains 25 page-specific review/drafting briefs.
