# SEO and money-page quality fixes — 20 November 2026

## Scope and repository findings

This pass follows the selected focused strategy: improve high-intent existing pages and verify canonical HTTP behavior. The site is Astro static output with a Cloudflare Worker, Markdown guides, JSON translation dictionaries and post-build locale generation. `src/layouts/Base.astro` generates head metadata and JSON-LD; `src/lib/sitemap.ts` supplies the English sitemap and `scripts/build-locales.mjs` expands locale clusters. Existing calculator engines are in `src/calculators/`.

Branch: `seo/money-page-quality-2026-11-20`. The preceding metadata/validation changes are preserved in commit `64a5a6d`. No changes have been pushed or deployed during this pass.

## Necessary changes implemented

- Expanded the two ideal rectifier tool pages, which previously had a short formula/example/scope explanation: input interpretation, 6/12/24 V comparison tables, 47 Vpp worked examples, frequency behavior, RMS versus average, bridge/center-tap conventions and model-specific questions. Examples use existing engines at build time where applicable.
- Added actionable model-selection guidance to the main calculator: compare the same 12 V RMS under ideal, clipped-sine diode-drop and filtered models; explain units, meter readings, current limitations and invalid-ripple recovery. Existing workbench, formulas, default values and result logic are unchanged.
- Improved ideal-tool metadata. Existing homepage and top-ten guide metadata improvements from the previous task are retained.
- Made the global Calculators link point to `/calculators/` and strengthened that directory with matching use cases and guide links.
- Prepared the new editorial sections for English URLs only. A tested locale-scoping marker prevents automatic copying of unprepared English prose into translated pages. Existing translated pages, their metadata, indexability, equivalent switcher routes and hreflang remain available. This is URL-language scoping, not user-agent or bot-specific rendering.
- Updated meaningful English content lastmod values. The unchanged translated half/full-wave tool bodies and directory retain their previous content dates. The main calculator keeps its already updated 20 November content date.

## Before and after: rendered main-content size

Counts exclude scripts, styles, SVG and noscript text, and include visible model controls and related links. They document the change; they are not a Google ranking threshold. The already detailed homepage did not need additional copy.

| Route | Before words | After words |
|---|---:|---:|
| / | 3050 | 3050 |
| /ac-to-dc-calculator/ | 1393 | 1986 |
| /full-wave-rectifier-calculator/ | 447 | 886 |
| /half-wave-rectifier-calculator/ | 402 | 885 |
| /calculators/ | 445 | 609 |

## Metadata before and after

| Route | Before title | After title |
|---|---|---|
| / | AC to DC Converter: How It Works, Circuits & Formulas | AC to DC Converter: How It Works, Circuits & Formulas |
| /ac-to-dc-calculator/ | AC to DC Converter Calculator: Voltage & Ripple | AC to DC Converter Calculator: Voltage & Ripple |
| /full-wave-rectifier-calculator/ | Full-wave rectifier calculator \| AC to DC Converter | Full-Wave Rectifier Calculator: Average DC Voltage |
| /half-wave-rectifier-calculator/ | Half-wave rectifier calculator \| AC to DC Converter | Half-Wave Rectifier Calculator: Average DC Voltage |
| /calculators/ | AC to DC Calculators: Rectifier, Ripple & Regulation | AC to DC Calculators: Rectifier, Ripple & Regulation |

### Ideal-tool descriptions

**/full-wave-rectifier-calculator/**

Before: Calculate the average of an ideal unfiltered full-wave rectified sine wave.

After: Calculate ideal full-wave DC average, peak and ripple frequency from AC RMS voltage. Includes 12 V and 47 Vpp examples, formulas and model limits.

**/half-wave-rectifier-calculator/**

Before: Calculate the complete-cycle average of an ideal unfiltered half-wave rectifier.

After: Calculate ideal half-wave average DC voltage, peak and ripple frequency from AC RMS input. See 12 V examples and how the blocked half-cycle affects output.

The full earlier homepage/main-tool/top-ten-guide title and description changes are recorded in [the metadata CSV](docs/audits/METADATA-UPDATE-2026-11-20.csv).

## Article review

All 25 existing articles already exceed 1,200 words. This does not certify their quality. No articles were added or mass-lengthened in this pass. Existing numerical content and publication dates remain intact. The immediate gap was specific tool-page usefulness, not a site-wide word-count quota.

| Article | Existing topic / query focus | Body words | Overlap / action |
|---|---|---:|---|
| RMS to Peak Voltage: Sine-Wave Formulas and Examples | ac rms to peak voltage calculation | 1714 | Voltage cluster: preserve waveform definitions, conversion, rectified mean, transformer convention, measurement and formula selection as separate intents; reassess with matched query/URL data before merging. |
| AC to DC calculator worked examples: average, peak, and ripple | ac to dc calculator worked examples | 1774 | Keep distinct topic; no merge in this pass. |
| AC to DC Formulas: Choose the Right Circuit Model | ac to dc formulas | 1728 | Voltage cluster: preserve waveform definitions, conversion, rectified mean, transformer convention, measurement and formula selection as separate intents; reassess with matched query/URL data before merging. |
| Why AC voltage alone cannot tell you the available DC current | ac voltage does not determine dc current | 1690 | Keep distinct topic; no merge in this pass. |
| Bridge rectifiers at 50 Hz and 60 Hz: what changes? | bridge rectifier at 50hz and 60hz | 1661 | Keep distinct topic; no merge in this pass. |
| Bridge rectifier diode losses: what a two-drop estimate means | bridge rectifier diode losses | 1592 | Keep distinct topic; no merge in this pass. |
| Capacitor ESR and ripple current: two different limits | capacitor esr and ripple current | 1615 | Keep distinct topic; no merge in this pass. |
| Capacitor Ripple Voltage: Formula, Example and Limits | capacitor ripple explained | 1613 | Keep distinct topic; no merge in this pass. |
| How to Choose an AC to DC Power Supply for a Defined Load | choosing ac to dc power supply | 1445 | Keep distinct topic; no merge in this pass. |
| Diode Forward Voltage Drop: Why the Calculator Needs an Assumption | diode forward voltage drop | 1616 | Keep distinct topic; no merge in this pass. |
| Full-Wave Bridge Rectifier: Circuit, Working and DC Output | full wave bridge rectifier explained | 1752 | Keep distinct topic; no merge in this pass. |
| Half-Wave vs Full-Wave Rectifier: Differences and Advantages | half wave vs full wave rectifier | 1753 | Keep distinct topic; no merge in this pass. |
| The limits of a simple AC to DC calculator | limits of simple ac to dc calculators | 1624 | Keep distinct topic; no merge in this pass. |
| Linear vs Switching AC to DC Power Supplies: Compare the Whole System | linear vs switching power supplies | 1289 | Keep distinct topic; no merge in this pass. |
| Measuring rectifier output: know which voltage you mean | measuring rectifier output voltage | 1609 | Voltage cluster: preserve waveform definitions, conversion, rectified mean, transformer convention, measurement and formula selection as separate intents; reassess with matched query/URL data before merging. |
| AC to DC Power Supply Stages: From AC Input to DC Output | power supply stages explained | 1309 | Keep distinct topic; no merge in this pass. |
| Power Supply vs Battery Charger vs LED Driver | power supply vs battery charger and led driver | 1273 | Keep distinct topic; no merge in this pass. |
| Rectifier Average vs RMS Output Voltage | rectifier average vs rms output | 1716 | Voltage cluster: preserve waveform definitions, conversion, rectified mean, transformer convention, measurement and formula selection as separate intents; reassess with matched query/URL data before merging. |
| Rectifier Ripple Frequency: Formula and 50/60 Hz Examples | rectifier ripple frequency | 1677 | Keep distinct topic; no merge in this pass. |
| RMS vs Peak vs Average Voltage: Formulas and Examples | rms peak average voltage | 1649 | Voltage cluster: preserve waveform definitions, conversion, rectified mean, transformer convention, measurement and formula selection as separate intents; reassess with matched query/URL data before merging. |
| Single-Phase vs Three-Phase Rectifiers: Voltage and Ripple | single phase vs three phase rectifiers | 1306 | Keep distinct topic; no merge in this pass. |
| Smoothing capacitor calculation: from load current to ripple | smoothing capacitor calculation | 1667 | Keep distinct topic; no merge in this pass. |
| Transformer RMS voltage and rectifiers: use the right input | transformer rms voltage and rectifiers | 1631 | Voltage cluster: preserve waveform definitions, conversion, rectified mean, transformer convention, measurement and formula selection as separate intents; reassess with matched query/URL data before merging. |
| Unregulated vs regulated DC supplies: where the rectifier model ends | unregulated vs regulated dc supplies | 1634 | Keep distinct topic; no merge in this pass. |
| Why AC to DC output voltage varies with line, load, and components | why ac to dc output voltage varies | 1597 | Keep distinct topic; no merge in this pass. |

## HTTP / HTTPS evidence

The existing Worker already implements direct permanent redirects before locale routing and asset serving. Live verification checked at 2026-11-20T11:06:57.613Z:

| Requested URL | Status chain | Location |
|---|---|---|
| http://actodcconverter.org/ | 301 → 200 | https://actodcconverter.org/ |
| http://actodcconverter.org/blog/full-wave-bridge-rectifier-explained/ | 301 → 200 | https://actodcconverter.org/blog/full-wave-bridge-rectifier-explained/ |
| http://actodcconverter.org/ac-to-dc-calculator?audit=canonical&x=1&x=2 | 301 → 200 | https://actodcconverter.org/ac-to-dc-calculator/?audit=canonical&x=1&x=2 |
| http://www.actodcconverter.org/ | 301 → 200 | https://actodcconverter.org/ |
| http://www.actodcconverter.org/blog/full-wave-bridge-rectifier-explained/ | 301 → 200 | https://actodcconverter.org/blog/full-wave-bridge-rectifier-explained/ |
| http://www.actodcconverter.org/ac-to-dc-calculator?audit=canonical&x=1&x=2 | 301 → 200 | https://actodcconverter.org/ac-to-dc-calculator/?audit=canonical&x=1&x=2 |
| https://www.actodcconverter.org/ | 301 → 200 | https://actodcconverter.org/ |
| https://www.actodcconverter.org/blog/full-wave-bridge-rectifier-explained/ | 301 → 200 | https://actodcconverter.org/blog/full-wave-bridge-rectifier-explained/ |
| https://www.actodcconverter.org/ac-to-dc-calculator?audit=canonical&x=1&x=2 | 301 → 200 | https://actodcconverter.org/ac-to-dc-calculator/?audit=canonical&x=1&x=2 |

All nine cases passed, including repeated query parameters and slash normalization. Missing paths return 404; search stays noindex/follow; HSTS is present. No duplicate redirect layer was added. Old HTTP URLs may remain in Search Console as intentional redirect exclusions; their desired indexed destination is HTTPS.

## Verification evidence

- `npm run verify`: lint, Astro/TypeScript check, unit tests, content audit, production build and site/graph/localization/on-page/SEO-contract audits. See `artifacts/money-verify.log`.
- Browser suite includes new ideal-tool interaction/recovery, mobile accessibility, English guidance, calculator-directory navigation and preservation of translated tool pages. Analytics requests are blocked. See `artifacts/money-browser.log`.
- Independent full sitemap audit checks self-canonicals, indexability, reciprocal hreflang, page metadata/JSON-LD consistency and valid calculator fragments. See `artifacts/money-local-crawl.log`.
- Worker dry run only; deployment not performed. See `artifacts/money-worker-dry-run.log`.
- Existing engine files have no changes in this pass. The previous default filtered bridge result (15.0706 V), ideal full-wave result (10.8038 V) and half-wave result (5.4019 V) remain covered by regression tests.

## Deliberately deferred and owner inputs

- No blanket noindex for 17 languages, no mass deletion/301 consolidation, no five-tool expansion, no arbitrary 20–30% article trimming and no artificial author/reviewer identities. These were not justified by this focused pass.
- Homepage content and its functional calculator are retained. No duplicate new content was added there.
- TODO(OWNER): provide real author/reviewer identity and relevant evidence before credential claims or Person schema are published.
- TODO(OWNER): run LTspice (12 Vrms, 50 Hz, Vf 0.7, 0.1 A, 1000 µF) and publish screenshot plus .asc if measured/simulated comparisons are desired. Existing validation is analytical, not a physical test.
- TODO(OWNER): arrange equivalent native-language editorial review before releasing these new English sections in other locales. Existing translation disclosures are retained.
- Google-selected canonical and current URL Inspection remain unverified because signed-in Search Console browser access was unavailable in the previous pass. GSC metrics quoted in prompts are not independently refreshed here.
- Push/deploy checkpoint is preserved: this is a tested local branch, not a claim that the changed content is already live. Follow `POST_DEPLOY_CHECKLIST.md` after a separately notified release.

Rankings and CTR should be assessed using complete matched weekly Search Console windows, recording this release date, exact query, landing page, clicks, impressions, CTR and average position. No ranking gain is asserted from code or word counts alone.

## Final recorded results

- Full verify succeeded: 0 type-check errors/warnings, 133/133 unit tests, production build, and all five static SEO audits passed.
- Browser suite: 21/21 passed, including mobile axe checks, ideal-tool invalid-input recovery and preserved translated tool pages.
- Independent local sitemap crawl: 864/864 canonical indexable URLs checked, zero exceptions.
- Live HTTP redirect audit: 9/9 redirect chains passed. Missing-page 404, search noindex and HSTS checks passed.
- Completed-build Worker dry run passed. No production publish was run.
- Mobile full-wave/main guidance and desktop half-wave examples were visually inspected. Tables remain horizontally scrollable within the page on narrow screens and keyboard-focusable.
- Local commits: `4632fa7` (authored-language editorial scoping), `22a65af` (money-page improvements), in addition to the preserved `64a5a6d` metadata/validation baseline.
