# Public-site localization

`src/config/languages.json` is the catalogue for 18 public languages. English URLs retain their current paths. The other languages use `/hi/`, `/es/`, `/ru/`, `/fr/`, `/de/`, `/it/`, `/pt/`, `/bn/`, `/ja/`, `/ko/`, `/ms/`, `/pl/`, `/id/`, `/ar/`, `/bg/`, `/tr/`, and `/sv/` prefixes. Arabic uses RTL direction; numerical inputs and formulas retain LTR isolation.

## Translation content

Concise search and social metadata has separate, route-specific editorial overrides in `src/i18n/seo-titles.json` and `src/i18n/seo-descriptions.json`. See [localized SEO metadata](LOCALIZED-SEO-TITLES.md) for the build behavior, validation and editing rules.

Visible H1 overrides in `src/i18n/page-headings.json` keep article schema headlines aligned and preserve the homepage subtitle layout. They are independent of search-title overrides.

`src/i18n/en.json` contains source strings; each other language has its own JSON dictionary keyed by the exact normalized English text. Content includes the homepage, calculators, all published guides, category/directory pages, public contact information and legal pages. Private administration, private API data and credentials are excluded. Fixed public contact-form errors are localized in the browser; visitor-submitted text is not translated. Brand names, formula-only text and numerical values are preserved separately from prose.

The initial text is machine-translated, not a claim of native professional or engineering review. Native-language editors can revise dictionary values directly. Keep keys unchanged. Original diagrams remain shared assets, with localized accessible descriptions and captions. Calculator formulas and numerical inputs are shared across languages; localization changes presentation rather than the calculation engine.

## Build and publication

1. Build the English Astro output with `node node_modules/astro/bin/astro.mjs build` when preparing a content update.
2. Run `npm run translate:extract` to refresh the source dictionary, then `npm run translate:generate -- es` (or other language codes; omit codes for all languages) to generate missing text locally. The offline helper uses CTranslate2 and the quantized [M2M100 model](https://huggingface.co/gn64/M2M100_418M_CTranslate2), derived from [Meta's M2M100](https://huggingface.co/facebook/m2m100_418M). Install `ctranslate2==4.9.0` and `sentencepiece==0.2.3` into `.tools/translation-python` and place the model's four data files in `.tools/m2m100-int8`. These ignored local tools are not needed by CI or visitors; only the resulting JSON dictionaries are committed. No API key is required.
   The optional `translate:fetch` helper can obtain public text translations from a public Google endpoint. This is not an official Cloud Translation API integration or availability guarantee. It stops on rate-limit/access-denied responses and never bypasses restrictions. The initial translation generation reached this service's rate limit; saved content can be completed offline. Neither helper sends private administration data.
   Arabic was additionally refined with the local [Helsinki-NLP OPUS-MT English/Arabic model](https://huggingface.co/Helsinki-NLP/opus-mt-en-ar) (Apache-2.0), using the required `>>ara<<` source prefix, sentence-level translation, and reviewed calculator terminology. Its optional data files live in `.tools/opus-en-ar`; `scripts/refine-arabic.py` is an explicit regeneration utility that replaces Arabic values and records uncertain entries for manual review. Back up editorial changes before using it. The checked model pack came from `Second-Dawn-Lab/owll-language-packs` at revision `d024a4c5340ae7a4d73d28482579b43afc0fc238`, with SHA-256 `a0b38601ba7e8ae3534db0776e64337ff9ead2cfa0dbced2fc1883703c767c4f`.

3. Review any entries recorded in `artifacts/translation-review.json`. Numeric formatting, digit shapes and grammatical reordering can produce conservative validation flags. Correct text and save it in the corresponding dictionary; do not suppress missing-entry build checks.
4. Run `npm run verify` and `npm run deploy:check`, then commit dictionaries and source together. `npm run build` performs the English build followed by offline locale generation.

The offline build fails on missing entries; it does not publish English fallback text under a translated indexable URL. New or edited English content therefore requires its translation update before automatic deployment can succeed. A failed build retains the previous live release. Do not manually publish incomplete locale output.

Each localized page has a self-canonical, reciprocal language alternates and an English `x-default`. JSON-LD URLs, article headlines, breadcrumb labels, image descriptions and metadata are localized. Internal page links stay within the current locale. All public language URLs are included in the sitemap. English-only topic-graph checks and a separate full-locale audit cover both structures.

## Language selection

The footer links always open explicit language URLs and save a `site_language` preference cookie for one year. This cookie contains only a supported language code. A manual choice wins over inferred country. Country inference is approximate and can be wrong for travellers, VPN users or multilingual countries; the footer remains available to change it.

Cloudflare's trusted `request.cf.country` selects the language for a first visit to `/`. Redirects are temporary (302), private and not cached. Explicit locale URLs, deep links, query-bearing URLs, API/private routes, assets and unsafe methods are not redirected by geography. Client-supplied country/IP headers are not trusted. English remains the fallback for unknown countries. No raw IP is stored or sent to a translation provider. The same country/preference rules apply to crawlers and users.

Existing English URLs remain canonical and stable. Regional selection is not a guarantee that Google will index every language or rank it highly. `hreflang` identifies equivalent language pages; it does not guarantee a country-specific rank.
