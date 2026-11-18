# Localized search titles

## Concise descriptions

`src/i18n/seo-descriptions.json` supplies independently edited descriptions by complete pathname. The build applies them to the meta description, Open Graph description, Twitter description, WebPage description and other top-level schema descriptions that matched the original meta description. It preserves unrelated schema text, article bodies, dates and formulas.

Descriptions summarize the actual page in its language. They are not mechanically cut at a character boundary. The project uses a 155-character editorial budget to match the audit tool; search snippets may vary by query and display width. Build validation rejects unknown routes, empty values and values over the budget. The locale audit checks this budget across all indexable pages, along with social-description and configured WebPage-description consistency.

`src/i18n/seo-titles.json` contains editorial overrides keyed by the complete public pathname, including the language prefix and trailing slash. These concise titles are separate from the full translated article headings in the language dictionaries.

During `npm run build`, `scripts/build-locales.mjs` applies each override after translation to the document title, Open Graph title, Twitter title and WebPage schema name. It preserves article headlines, visible headings, breadcrumbs, descriptions, canonical URLs and hreflang links. Article schema headlines continue to match the visible article headings.

Write descriptive titles in the page's language, retain the primary subject, and avoid repetitive site-name suffixes. Do not truncate text automatically or add unsupported claims. The project's editorial budget is 60 JavaScript string characters; this matches the current audit tool, but is not a Google ranking requirement or a guarantee against display truncation. See [Google's title guidance](https://developers.google.com/search/docs/appearance/title-link).

The build rejects unknown routes and empty or oversized overrides. `npm run audit:locales`, included in `npm run verify`, checks the title budget and social-title consistency across every indexable page, plus configured title and WebPage-name consistency. Existing checks enforce unique titles within each language and article headline/heading agreement.

The locale audit also checks title uniqueness across all public languages, comparing normalized text without case differences. Use accurate native-language titles to distinguish translated pages; do not append arbitrary keywords or language codes just to make a repeated title unique.
