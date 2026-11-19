# Existing-site optimization audit — 19 November 2026

## Baseline and scope

The project uses Astro static pages, a Cloudflare Worker wrapper, repository-backed administration and private contact storage. It has 18 languages, 882 public pages, 864 indexable sitemap URLs, 25 published articles and three dedicated calculator spokes. Existing route names, admin authentication, content persistence and language preferences are retained.

The existing engineering suite covers ideal half/full-wave rectification, fixed-drop clipped-sine integration, bridge versus center-tapped conduction, current/resistance capacitor discharge, regulator headroom, power balance and invalid inputs. These checks establish mathematical model behavior, not measured circuit performance.

## Verified implementation gaps

1. The browser client still selects `#wb-wave-title`, an SVG title removed by an earlier accessibility edit. After form submission, writing to this missing node throws and the error handler clears the calculated output. Browser interaction regression coverage is required in addition to formula tests.
2. The homepage's title and H1 differ from the newly requested keyword mapping. Its introductory block precedes the workbench instead of placing the functional calculator in the hero.
3. Header branding has the right configured name, but includes a decorative trailing dot and is not protected from translation. The required exact visible brand needs a stable, accessible treatment.
4. Header navigation points to the dedicated calculator even on the homepage. It should reach the existing homepage workbench while preserving access to the calculator directory and established methodology route.
5. The calculator has a dynamic waveform but no adjacent input-aware circuit view. A new explanatory diagram must distinguish rectifier paths, filtering and the separate regulator-stage model.
6. Existing audits require a year and “Guide” in the homepage title. That older editorial rule conflicts with the current explicit title requirement and must be updated.

## Search observations

Live searches returned mixed commercial/informational converter results and dedicated rectifier calculators. These are search-tool observations, not a verified Google ranking report, keyword-volume estimate or traffic analysis.

- [AllMath](https://www.allmath.com/ac-to-dc-converter.php) puts a converter before explanatory formulas and examples.
- [GetZenQuery](https://www.getzenquery.com/tools/ac-to-dc-converter/) exposes RMS, topology, diode, load and filtering inputs with output estimates.
- [KKJTech](https://tools.kkjtech.com/ac-to-dc-converter-calculator.html) presents input controls, waveform and several analysis modes.
- [Calqro](https://calqro.com/electrical-calculators/ac-dc-converter-calculator/) combines voltage and inverter-power tasks. Competitor formulas are not accepted as engineering authority or copied into this implementation.

The homepage remains the combined converter/calculator hub. `/ac-to-dc-calculator/` remains an established detailed workbench/methodology URL; the ideal half-wave and full-wave tools retain distinct reference models. No new competing calculator route or redirect is justified by these observations.

## Verification limits at audit time

Both the in-app browser preview and the installed desktop computer-use runtime failed to initialize with a kernel-assets path error. No visual inspection, field Core Web Vitals or Google ranking measurement is claimed on that basis. Repository browser tests and lab performance measurements will be reported separately if executable.

The existing translation dictionaries include awkward technical wording. New copy has been authored directly in the existing language JSON files, without a bulk translation service. A nonempty dictionary is not a native-language quality certification; a native technical editor should still review the legacy article translations.

## Implemented changes

- Fixed the reproduced live Calculate failure. The client now updates the waveform's accessible label through an existing SVG, using localized hidden label text. No extra document or SVG title tag was introduced.
- Set the English homepage title to **AC to DC Converter Calculator – Convert AC Voltage to DC**, H1 to **AC to DC Converter & Calculator**, and the requested description. Updated localized homepage metadata and headings for all 18 languages.
- Moved the working calculator into the hero. Inputs precede diagrams in source order and mobile layout; desktop shows the form and explanatory circuit side by side. Results, waveform, assumptions and safety notices remain present.
- Added selection-aware bridge, center-tapped and half-wave circuit views, a capacitor/load diagram for filtered mode and a separate DC regulator-stage flow. Existing original SVG illustrations are reused; diagrams are explanations, not wiring instructions or measured simulations.
- Added an expandable usage guide and links to the established calculator directory and detailed methodology. Existing educational sections, worked calculations, references, FAQs, guides and hub/spoke links are retained.
- Made the visible header brand exactly **AC to DC Converter**, protected it from translation, removed its decorative punctuation and retained the electrical icon. Calculator navigation reaches the homepage section; Guides, About, Search and Contact remain accessible.
- Updated the homepage's visible/schema review date and sitemap lastmod together. Unrelated article review dates were not refreshed.
- Replaced the obsolete homepage title audit rule requiring a year and “Guide” with checks for the specifically requested title, H1 and exact header brand.
- Added browser interaction, mobile, accessibility and multilingual regression tests, and included browser tests in GitHub verification. Formula functions were preserved because independent numerical tests already establish their behavior.
- Preserved the existing offscreen education-section rendering optimization and the small static client bundle. An additional directory/footer containment experiment was removed because measurements did not establish an improvement. No hydration framework, external font, image library or runtime translation API was added.
- Fixed the language-switcher accessible names to include their visible EN/HI/etc. codes as well as each language's native name, supporting voice-control label matching.

## Keyword-to-URL mapping

The accompanying [CSV](keyword-url-map-2026-11-19.csv) maps the homepage and all 28 existing spokes. The homepage serves both primary converter/calculator queries; `/ac-to-dc-calculator/` preserves the detailed calculation-methodology resource and existing workbench. Ideal half/full-wave pages retain their explicitly different zero-drop reference scope. Informational articles retain their circuit, component, measurement or application questions. No new overlapping calculator page was created.

## Engineering verification

The 127-test Node suite passes. Independent midpoint integration checks the clipped diode waveform's mean and RMS; independent exponential-discharge integration checks resistance-load mean and power. Tests cover zero-drop half/full-wave values, per-half center-tapped voltage, bridge diode paths, current/resistance filters, ripple frequency, zero/nonfinite/invalid inputs, regulator headroom, quiescent loss and supplied switching efficiency.

The default 12 V RMS, 50 Hz, 0.7 V/diode bridge at 0.1 A and 1,000 µF yields 15.5705627 V crest, 1 V p-p ripple, 15.0705627 V average and 14.5705627 V valley. Ideal full-wave mean is 10.8037958 V; ideal half-wave mean is 5.4018979 V. These are model outputs, not physical test measurements.

The browser suite checks actual submission, edited values, stale-result removal, reset, all three rectifier paths, current/resistance loads, linear/switching modes, insufficient headroom, invalid numbers, meaningful waveform labels, desktop/mobile source order, horizontal overflow, exact branding, navigation, all language canonicals and a JavaScript-off fallback. Axe runs WCAG A/AA checks at 390, 768 and 1365 px; this is automated coverage, not a complete manual accessibility certification.

## Technical SEO verification

The full-locale audit covers 882 public pages: 864 indexable sitemap URLs and 18 noindex/follow search pages. It checks one title in the document head, self-canonicals, reciprocal language alternatives, x-default, localized internal destinations, metadata limits/uniqueness, heading rules, structured-data consistency, breadcrumbs and indexability. The topic-graph audit covers 28 spokes and 12 visible homepage FAQs. No utility search URL is added to the indexable sitemap. Existing geographic selection and explicit language preferences are retained.

Home schema remains a truthful graph of WebApplication, TechArticle and matching FAQ content, alongside WebSite/WebPage/Organization/navigation nodes. Articles retain their article/breadcrumb schema. No ratings, reviews, engineer credentials or parent-company claims were invented. No SemanticsX recrawl, Search Console submission or ranking gain is claimed.

## Reproducing checks

Use the supported Node version in `package.json`. Run `npm ci`, `npm run verify` and `npm run deploy:check`. For browser tests, run `npx playwright install chromium`, then `npm run test:browser`. `BROWSER_EXECUTABLE` can point to an installed Chrome binary; it uses an isolated temporary browser profile. `BROWSER_BASE_URL` selects an already running local or deployed site. Without it the test configuration starts a local Astro preview. Browser screenshots/results and Lighthouse JSON are written under ignored `artifacts/`; failure traces are under ignored `test-results/`.

## Lab performance results

Lighthouse 13.6.0 audited the local static preview in isolated Chrome. The final simulated-mobile run scored performance **98**, accessibility **100**, best practices **100** and SEO **100**; LCP was **1.2 s**, CLS **0**, and total blocking time **180 ms**. The desktop run scored **100** in all four categories, with LCP **0.4 s**, CLS **0**, and TBT **70 ms**. The desktop measurement preceded the final language-label-only accessibility edit.

Runs varied substantially on this laptop: earlier mobile readings had TBT between 960 and 1,800 ms, with layout and Google Analytics tasks contributing. The final numbers are a recorded lab sample, not a guaranteed improvement percentage or a substitute for field INP. TBT is not INP. Client JavaScript remains approximately 20.2 KB against the existing 50 KB build budget. Images retain explicit dimensions; system fonts and static rendering are preserved.

The complete `npm run verify` pipeline passed, and the final label edit is additionally covered by another build, type/lint checks, full static SEO audits and the browser suite. The Worker dry-run packaging passed. The audit did not require any change to authentication, secrets or storage bindings.

## Modified files

- `src/pages/index.astro`, `src/components/ConverterWorkbench.astro`, `src/components/LanguageSwitcher.astro`, `src/scripts/converter-client.ts`, `src/layouts/Base.astro`, `src/styles/global.css`, `src/config/site.config.ts`.
- New `src/config/content-dates.ts`; `src/lib/sitemap.ts` shares its homepage update date.
- All 18 `src/i18n/{language}.json` dictionaries and the `seo-titles.json`, `seo-descriptions.json`, `page-headings.json` override files.
- `scripts/audit-onpage.mjs`, new `playwright.config.ts` and `tests/browser/converter.spec.ts`.
- `package.json`, `package-lock.json`, `.github/workflows/verify.yml`, `.gitignore`, this report and the keyword mapping CSV.

## Remaining limits

Field Core Web Vitals, especially 75th-percentile INP, require real-user data. Lighthouse results are individual controlled lab runs and do not establish field compliance. Existing technical illustrations contain English notation inside SVG assets. Legacy translated article prose still needs native technical editing; no certification of all 25 articles in 17 translated languages is claimed. Rankings and traffic depend on crawling, competition and audience response, and cannot be guaranteed by this implementation.

Admin authentication, repository persistence and private inbox implementation were retained and their existing unit tests pass. No new credentialed dashboard login/write test was performed in this optimization task. The private login email remains unpublished.
