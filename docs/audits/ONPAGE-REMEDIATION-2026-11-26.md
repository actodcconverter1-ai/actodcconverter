# On-page audit remediation — 26 November 2026

- Homepage and main calculator English meta descriptions are 155 characters, using the existing locale-specific SEO override system. Other language descriptions retain their translations.
- The main calculator explicitly names the AC to DC Converter Calculator in its opening paragraph. The homepage already names and emphasizes AC to DC converter in its first 100 visible words.
- Explicit FAQ details on the homepage and calculator content generate FAQPage markup from the final localized HTML. This happens after language-specific content removal and translation, so answers match the published page. Calculator help and assumptions are excluded.
- This replaces the older intentional no-FAQPage contract in response to the owner's new request for content-matching semantic FAQ markup. Google discontinued FAQ rich results in May 2026; this change does not claim a Google FAQ enhancement or ranking benefit. See https://developers.google.com/search/updates.
- Guides already emit Article/TechArticle/BlogPosting, visible publication/update times, and visible breadcrumbs with BreadcrumbList. Those checks remain in the build audits. The homepage is a calculator and guide hub; it must not be mislabeled BlogPosting or gain a meaningless Home-only breadcrumb.
- Existing URLs stay in place. The root domain is a valid homepage URL; a keyword-slug audit flag does not justify moving it. Calculator and guide slugs already describe their topics.
- Do not force years, brackets, numbers or “Best” into every title. Keep descriptive titles unless the content supports a specific change. Existing 146-character descriptions were not Google errors; the two edited descriptions now also fit the owner's requested audit range.
- Unit tests cover localized FAQ answers, exclusion of non-FAQ controls, empty pairs and repeated builds. The full site contract checks FAQ presence and exact answer matching across generated locales.

Validation output: `artifacts/onpage-remediation-verify.log`. This report records local validation; GitHub push was subsequently authorized by the owner. Deployment status is tracked separately.

## Completed validation

- Full `npm run verify`: passed; lint passed and Astro diagnostics reported zero errors, warnings and hints.
- 165 unit tests passed; content validation passed.
- Build: 990 public pages in 18 languages, including 972 indexable URLs.
- Site, topic graph, localization, on-page and SEO contract audits: zero errors. FAQ markup matches visible answers on 21 generated pages. Existing BlogPosting and breadcrumb checks passed on 450 localized article pages.
- All 23 browser tests passed, including calculator results and invalid-input recovery, 390/768/1365 px layouts and accessibility, language switching, no-JavaScript content, and keyboard-accessible localized FAQ answers.
- Final lint of the changed audit/FAQ modules and browser tests passed. Browser log: `artifacts/onpage-remediation-browser.log`.

## Follow-up audit

The owner requested the remaining title-format flags again. The English homepage SEO title now reads `AC to DC Converter: Calculator & Guide (2026)`. It describes the existing tool and reviewed 2026 guide, and includes a modifier, a year, a number and parentheses without changing the URL or article classification. This is an editorial title choice, not a claim that those elements are mandatory ranking factors.

Before this adjustment, live HTTP checks confirmed the previous release `db9ed7f` was deployed: homepage and calculator returned English HTTP 200 without a redirect; their opening content included the primary phrase. The sampled full-wave guide returned HTTP 200 with Article/TechArticle/BlogPosting, BreadcrumbList and visible breadcrumbs. A generic blog-only audit applied to the homepage must not cause it to be falsely marked BlogPosting. Exact page/keyword settings for the third-party report were not provided.

Follow-up validation: `artifacts/onpage-title-followup-verify.log`.

An additional live crawl checked all 25 English guides plus the homepage and main calculator (27 URLs): zero HTTP, canonical, article-schema or article-breadcrumb errors. Evidence: `artifacts/live-article-schema-followup.json`.

## Title length correction

The owner subsequently requested a 50–60-character title. The earlier 45-character decoded title did not satisfy that preference. The final English homepage title is `AC to DC Converter Calculator and Circuit Guide (2026)` (54 characters). It avoids an ampersand entity, so raw and decoded title text have the same length. No change to primary keyword, canonical URL, H1, calculator logic or schema classification is needed for this adjustment.

Validation: `artifacts/onpage-title-length-verify.log`. Exact SemanticsX page/keyword settings remain unconfirmed; the available browser runtime failed to initialize with `failed to write kernel assets`. No third-party audit pass is claimed.

Direct live evidence before this correction: the old homepage `<title>` measured 49 characters as raw HTML (`&amp;`) and 45 as decoded text (`&`). The first 100 body words, excluding scripts/styles, contained `AC to DC converter` in the brand, H1 and definition. Root HTTP status was 200 with no redirect. Evidence: `artifacts/live-homepage-keyword-proof.json`.
