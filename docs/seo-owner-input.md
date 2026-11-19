# Needs owner input and manual Search Console steps

## Owner input

- Real public author name, biography and verifiable credentials: not supplied. Organization editorial byline is retained; no Person schema or fictional reviewer is added.
- Independent reviewer identity and review evidence: not supplied; no peer-review claim.
- LTspice or physical bench comparisons: **Needs owner input**. Supply circuit, input/load conditions, instrument/simulation settings and actual results. Analytical and browser tests are not laboratory measurements.
- AI-use/editorial statement: **Needs owner confirmation**. No new public AI-use claim is published without confirmation.
- Native technical review of legacy translations: **Needs owner input** for Hindi, Spanish, Russian, French, German, Italian, Portuguese, Bengali, Japanese, Korean, Malay, Polish, Indonesian, Arabic, Bulgarian, Turkish and Swedish. Their live existence, canonical and hreflang can be tested; that does not certify prose quality. Existing English-labelled illustrations also need a localization review. Recommend noindex/follow for translated routes until native review is documented; this recommendation is not silently applied because it would change indexability across the site.

## Phase 8 proposals — approval required, not built

1. RMS/peak/peak-to-peak widget on the two existing RMS guides: sinusoidal input only, clear quantity selection, same math library, unit tests for inverse conversions and invalid inputs. No new competing URL.
2. Capacitance-for-target-ripple widget in the existing smoothing guide: reuse the existing charge/discharge model and topology recharge frequency, state source/ESR limitations and test against the existing forward model. No inverter or DC-to-AC calculator.

## Manual Google Search Console steps

1. Select the **Domain property** `actodcconverter.org`. Confirm ownership; a Domain property covers HTTP/HTTPS and www/non-www.
2. In Sitemaps, submit `https://actodcconverter.org/sitemap.xml` and check processing status. Submission is a discovery signal, not a guarantee of indexing.
3. Inspect `http://actodcconverter.org/` and confirm its redirect destination. Request indexing for the canonical `https://actodcconverter.org/` and substantively updated HTTPS pages, not redirect-source URLs. Inspect `/ac-to-dc-calculator/` and the half/full-wave comparison first; check Google-selected canonical versus declared canonical. Use live inspection to confirm current fetch behavior; historical reports can lag.
4. Validate structured data with Google's Rich Results Test where supported and Schema.org Validator for general graph validity. No rich-result appearance is promised and FAQPage is intentionally omitted.
5. Two and four weeks after deployment, export queries, pages, countries and devices for comparable windows. Compare impressions, clicks, CTR and position for each mapped primary page; separate branded queries and changes in country/device mix. Do not interpret tiny impression counts as stable ranking evidence.

No Search Console submission or indexing request is performed by this task.

Official references for the manual steps: [Google URL Inspection documentation](https://support.google.com/webmasters/answer/9012289?hl=en) distinguishes indexed information from live tests; [Google recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) explains inspection requests and sitemap discovery. These steps do not guarantee indexing.
