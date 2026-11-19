# Localized search titles

## Section headings and card labels

`src/i18n/primary-section-headings.json` provides contextual first-H2 wording by complete pathname. It distinguishes shared calculator components and category reading paths, with separate native-language labels. The build retains the original heading's attributes. When a category's first H2 is an article-card link, it inserts a category heading before the grid instead of changing the meaning of that article link.

The locale audit checks configured first-H2 text and duplicate primary headings across public routes as an editorial convention. Repeated secondary labels such as FAQ headings are not globally renamed. Reusing an H2 across pages is not by itself proof of a Google indexing or ranking problem.

`src/i18n/section-headings.json` maps existing localized H2 text to concise, technically reviewed wording. The build applies these edits after translation and preserves heading elements, their IDs and linked-card destinations. It rejects unsupported nested markup instead of silently removing it.

Linked H2/H3 card labels also reuse the corresponding destination override in `page-headings.json` where one exists. This keeps article-card labels aligned with the reviewed destination heading without changing URLs, document titles or article schema headlines. The locale audit enforces the site's 70-character editorial budget for H2 headings across all public pages. This budget is an audit convention, not a Google ranking requirement.

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
