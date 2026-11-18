# Localized search titles

## Visible page headings

`src/i18n/page-headings.json` contains separately edited visible H1 headings by complete pathname. Most values are plain text. A `{ "lead": "…", "detail": "…" }` value preserves the homepage's existing subtitle span and its styling. The build requires a single H1 and updates the corresponding TechArticle/BlogPosting headline to match its visible text. It leaves document titles, descriptions, breadcrumb labels, article bodies and publication dates unchanged.

Keep headings technically accurate and concise, retaining the subject and useful context. The project uses a 70-character editorial budget to match its audit tool; this is not a Google ranking requirement. Build validation rejects unknown routes, invalid headings and headings over budget. The locale audit checks all indexable H1 lengths, configured text and article-headline agreement.

## Concise descriptions

`src/i18n/seo-descriptions.json` supplies independently edited descriptions by complete pathname. The build applies them to the meta description, Open Graph description, Twitter description, WebPage description and other top-level schema descriptions that matched the original meta description. It preserves unrelated schema text, article bodies, dates and formulas.

Descriptions summarize the actual page in its language. They are not mechanically cut at a character boundary. The project uses a 155-character editorial budget to match the audit tool; search snippets may vary by query and display width. Build validation rejects unknown routes, empty values and values over the budget. The locale audit checks this budget across all indexable pages, along with social-description and configured WebPage-description consistency.

`src/i18n/seo-titles.json` contains editorial overrides keyed by the complete public pathname, including the language prefix and trailing slash. These concise titles are separate from the full translated article headings in the language dictionaries.

During `npm run build`, `scripts/build-locales.mjs` applies each title override after translation to the document title, Open Graph title, Twitter title and WebPage schema name. Title overrides do not change article headlines, visible headings, breadcrumbs, descriptions, canonical URLs or hreflang links. Separate page-heading overrides described above update visible headings and their matching article schema headlines.

Write descriptive titles in the page's language, retain the primary subject, and avoid repetitive site-name suffixes. Do not truncate text automatically or add unsupported claims. The project's editorial target is 30–60 JavaScript string characters; this matches the current audit tool, but is not a Google ranking requirement or a guarantee against display truncation. Japanese and Korean can express more information in fewer characters; add relevant subject detail rather than padding their titles merely to increase the count. See [Google's title guidance](https://developers.google.com/search/docs/appearance/title-link).

The build rejects unknown routes and empty or oversized overrides. `npm run audit:locales`, included in `npm run verify`, checks the title budget and social-title consistency across every indexable page, plus configured title and WebPage-name consistency. Existing checks enforce unique titles within each language and article headline/heading agreement.

The locale audit also checks title uniqueness across all public languages, comparing normalized text without case differences. Use accurate native-language titles to distinguish translated pages; do not append arbitrary keywords or language codes just to make a repeated title unique.
