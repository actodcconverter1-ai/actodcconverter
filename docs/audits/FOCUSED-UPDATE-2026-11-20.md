# Focused metadata and calculator update — 20 November 2026

## Release checkpoint

Changes are prepared and tested locally. No GitHub push or production deployment has been made for this update; the user requested notification before these actions. Baseline commit: `6d23b2b909467b916c0c0c7318848cf54b0986a1`. Production HTTP evidence below describes the existing deployment, not these unpublished changes.

## Selection and search intent

The ten English guides are the ten English `/blog/` landing pages with the most impressions in the supplied latest 24-hour Search Console export (19–20 November, UTC+05). Impressions respectively: 61, 41, 38, 37, 31, 30, 19, 17, 15 and 12, in the order below. The three near-page-one guides are included. This small window is a prioritization signal; it does not prove a persistent CTR problem.

The homepage explains conversion, circuits and formulas. The dedicated calculator prioritizes model selection, inputs, results and methodology. Titles and descriptions reflect each page; no unsupported best/accuracy claims or artificial year refresh were added. Google may choose a different search snippet.

## Before/after titles

| Route | Before | After |
|---|---|---|
| / | AC to DC Converter Calculator: Voltage, Ripple & Circuits | AC to DC Converter: How It Works, Circuits & Formulas |
| /ac-to-dc-calculator/ | AC to DC Converter Calculator: Voltage & Ripple | AC to DC Converter Calculator: Voltage & Ripple |
| /blog/rectifier-ripple-frequency/ | Ripple Frequency Formula: Half-Wave, Full-Wave & 50/60 Hz | Rectifier Ripple Frequency: Half-Wave vs Full-Wave |
| /blog/rms-peak-average-voltage/ | RMS vs Peak vs Average Voltage: Formulas & Examples | RMS vs Peak vs Average Voltage: Formulas & 12 V Example |
| /blog/full-wave-bridge-rectifier-explained/ | Full-Wave Bridge Rectifier: Circuit, Working & DC Output | Full-Wave Bridge Rectifier: Circuit, Formula & Example |
| /blog/half-wave-vs-full-wave-rectifier/ | Half-Wave vs Full-Wave Rectifier: Differences & Advantages | Half-Wave vs Full-Wave Rectifier: Voltage & Ripple |
| /blog/power-supply-stages-explained/ | AC to DC Power Supply: 5 Stages & Block Diagram | AC to DC Power Supply: 5 Stages & Block Diagram |
| /blog/capacitor-ripple-explained/ | Capacitor Ripple Voltage: Formula & Worked Example | Capacitor Ripple Voltage: Formula & 12 V Example |
| /blog/single-phase-vs-three-phase-rectifiers/ | Single-Phase vs Three-Phase Rectifiers: Voltage & Ripple | Single-Phase vs Three-Phase Rectifiers: Output & Ripple |
| /blog/bridge-rectifier-diode-losses/ | Bridge Rectifier Diode Losses & the 2Vf Estimate | Bridge Rectifier Diode Losses: Why Subtract 2Vf? |
| /blog/capacitor-esr-and-ripple-current/ | Capacitor ESR vs Ripple Current in Rectifier Filters | Capacitor ESR vs Ripple Current: Voltage, Heat & Limits |
| /blog/rectifier-average-vs-rms-output/ | Rectifier Average Output Voltage vs RMS: Formulas | Average vs RMS Rectifier Voltage: Formulas & Example |

Full before/after descriptions are in [the metadata CSV](METADATA-UPDATE-2026-11-20.csv). All twelve rendered titles are at most 60 characters and descriptions at most 155; these are editorial bounds, not Google ranking thresholds. Each has exactly one title inside head. Open Graph and WebPage names follow the rendered title.

## Calculator and localization changes

- Kept the existing calculator engine and mathematical precision unchanged. Replaced the incomplete public validation table with analytical 50/60 Hz checks, showing inputs, independent formula expectation, actual result and three-decimal display rounding.
- Clarified regulator input power, loss and efficiency as estimates at minimum DC input. Headroom still uses minimum input; this is not whole-supply efficiency. Center-tapped RMS remains per winding half.
- Added strict dot/comma decimal input, Arabic/Persian digits and locale-aware result formatting. Thousands separators remain unsupported and documented. Out-of-range, missing and invalid input clears stale output.
- Added Arabic paragraph overrides with equivalent localized links; repaired French/German calculator copy and metadata. Existing localized metadata for the seven additional English guides is preserved through explicit dictionary mappings. Eighteen-language canonical/hreflang clusters and equivalent calculator/guide switcher paths remain intact.
- Corrected article isPartOf references to the actual locale Website entity and made the scrollable validation table keyboard-focusable.
- Only homepage and dedicated calculator meaningful-content dates were updated. All ten guide bodies and publication/update dates were checked against the baseline and preserved. No physical measurements, reviewer identities or accreditations were invented.

## Calculator regression evidence

Values below are unrounded engine values shown to six decimals in this report. Displayed calculator output uses up to three decimal places. Full inputs and assumptions are retained locally in `artifacts/focused-regressions.json`.

| Case | Average/output V | Ripple Vpp | Loss W | Efficiency % | Rejection/result note |
|---|---:|---:|---:|---:|---|
| Default bridge, 50 Hz | 15.070563 | 1 | — | — | Valid modeled result |
| Bridge, 60 Hz | 15.153896 | 0.833333 | — | — | Valid modeled result |
| Ideal full-wave | 10.803796 | 16.970563 | — | — | Valid modeled result |
| Ideal half-wave | 5.401898 | 16.970563 | — | — | Valid modeled result |
| Center-tapped, per half-secondary | 10.112988 | 16.270563 | — | — | Valid modeled result |
| Resistance load | 15.062888 | 1.004193 | — | — | Valid modeled result |
| Below diode threshold | 0 | 0 | — | — | Valid modeled result |
| Ripple boundary | 14.013506 | 3.114113 | — | — | Valid modeled result |
| Above ripple boundary | — | — | — | — | Estimated ripple exceeds 20% of the available crest. Use a fuller circuit model or change the load/filter inputs. |
| Linear at minimum input | 5 | 0 | 7.012 | 41.625042 | Valid modeled result |
| Switching stage | 5 | 0 | 0.555556 | 90 | Valid modeled result |
| Insufficient headroom | — | — | — | — | Minimum DC input is below the desired output plus required headroom. Regulation cannot be assumed. |
| Zero input power | 5 | 0 | 0 | undefined | Efficiency undefined at zero input power |
| Nonfinite RMS | — | — | — | — | AC RMS input (V): enter a value from 0 to 1000. |

The default expected average is 15.070562748 V at 50 Hz and 15.153896082 V at 60 Hz; visible values are 15.071 V and 15.154 V. These are analytical checks under fixed diode drops, constant load and instantaneous recharge, not bench validation.

## Acceptance checks

- Full verify: ESLint, Astro/TypeScript, 132 unit tests, content audit, build and all five static SEO/localization/graph audits.
- Browser suite: 18 tests, covering English entry pages at 390/768/1365 px, Arabic RTL mobile, French/German decimal input, all eighteen language calculator routes, equivalent language switching, no-JavaScript fallback, invalid/recovery states and axe accessibility checks. Analytics requests are blocked in these tests.
- Local sitemap crawl: 864 unique indexable URLs; self-canonicals, index/follow directives, 19 alternate entries (18 locales plus English x-default), equivalent/reciprocal destinations, JSON-LD parsing and calculator fragment targets. All 882 public built pages pass standard audits, including 18 noindex search pages.
- Production baseline HTTP audit: nine HTTP/www/path/query cases returned 301 → 200 to HTTPS canonical destinations, with repeated query parameters preserved. Missing path returns 404; search is noindex/follow; HSTS is present. No redirect rules changed.
- Cloudflare Worker dry run passed; no publish occurred.
- Desktop/mobile home screenshots and Arabic mobile output were visually reviewed. No horizontal page overflow or clipped controls were observed.

## Access gaps and release follow-up

Search Console browser initialization failed with a missing kernel-assets path. Google-selected canonical and live URL Inspection were therefore unavailable; only declared canonical signals were checked. No sitemap submission or indexing request is claimed. No measured circuit comparison or independently verified reviewer evidence was supplied.

After the separately notified release, verify the deployed commit, rerun the browser suite against production with analytics blocked, GET all 864 sitemap URLs for final HTTP/canonical consistency and check the HTTP redirect audit. Production confirmation of this update is pending until then.

For CTR evaluation, record the release date and compare complete matched seven-day Search Console windows, using exact query plus landing-page filters (and consistent country/device/search-type filters): `AC to DC converter` → `/`; `AC to DC converter calculator` → `/ac-to-dc-calculator/`; and each guide’s primary topic → its existing guide URL. Compare clicks, impressions, CTR and average position together. No weekly automation has been created. Do not compare a partial 24-hour window directly with seven-day totals or attribute all changes to metadata.

## Files changed

- `scripts/audit-onpage.mjs`
- `scripts/build-locales.mjs`
- `scripts/translate-content.mjs`
- `src/components/ConverterWorkbench.astro`
- `src/config/content-dates.ts`
- `src/content/blog/bridge-rectifier-diode-losses.md`
- `src/content/blog/capacitor-esr-and-ripple-current.md`
- `src/content/blog/capacitor-ripple-explained.md`
- `src/content/blog/full-wave-bridge-rectifier-explained.md`
- `src/content/blog/half-wave-vs-full-wave-rectifier.md`
- `src/content/blog/power-supply-stages-explained.md`
- `src/content/blog/rectifier-average-vs-rms-output.md`
- `src/content/blog/rectifier-ripple-frequency.md`
- `src/content/blog/rms-peak-average-voltage.md`
- `src/content/blog/single-phase-vs-three-phase-rectifiers.md`
- `src/i18n/ar.json`
- `src/i18n/bg.json`
- `src/i18n/bn.json`
- `src/i18n/de.json`
- `src/i18n/en.json`
- `src/i18n/es.json`
- `src/i18n/fr.json`
- `src/i18n/hi.json`
- `src/i18n/id.json`
- `src/i18n/it.json`
- `src/i18n/ja.json`
- `src/i18n/ko.json`
- `src/i18n/ms.json`
- `src/i18n/page-headings.json`
- `src/i18n/pl.json`
- `src/i18n/pt.json`
- `src/i18n/ru.json`
- `src/i18n/seo-descriptions.json`
- `src/i18n/seo-titles.json`
- `src/i18n/sv.json`
- `src/i18n/tr.json`
- `src/lib/result-presentation.ts`
- `src/pages/ac-to-dc-calculator.astro`
- `src/pages/blog/[slug].astro`
- `src/pages/index.astro`
- `src/scripts/converter-client.ts`
- `src/styles/global.css`
- `tests/browser/converter.spec.ts`
- `tests/converter.test.ts`
- `tests/result-presentation.test.ts`
- `src/i18n/arabic-editorial.json` (new)
- `docs/audits/FOCUSED-UPDATE-2026-11-20.md` (this report)
- `docs/audits/METADATA-UPDATE-2026-11-20.csv` (new)
