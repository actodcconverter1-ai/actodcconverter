# SEO research and implementation plan

Research date: **5 November 2026**. This is a planning and audit specification for the existing Astro + TypeScript website, not a claim that the changes or launch checks below have already passed. The supplied master prompt is the brief. No separate keyword-volume export or Search Console property data was available for this research. Keyword grouping is qualitative and based on the supplied terms, the site's actual content and sampled search results; no volumes, difficulty scores or ranking positions are invented.

## 1. Findings and decisions before implementation

The existing site has 20 substantive published articles, a static educational calculator, related tools and a tested editorial dashboard. Its strongest material explains RMS/peak/average distinctions and filtered rectifier assumptions. The expansion should broaden the homepage and fill architectural/application gaps without replacing the established stack, deleting useful URLs or creating near-identical articles for every keyword variation.

The homepage owns the broad **AC to DC converter** topic and offers both a working calculator and an accessible educational route. `/ac-to-dc-calculator/` owns the task of entering numbers. The same tool may appear on the homepage because the surrounding pages serve different purposes; each needs a descriptive title, self-canonical and substantial distinct context. The blog owns narrower explanations and worked questions. `KEYWORD-MAP.csv` records 29 target URLs: four homepage/tool entries and 25 article entries. Its status column distinguishes existing material from proposed additions, rather than claiming publication.

Retain the first site's proven components and dashboard. This work is not permission to extract a generic master or start a second site before the first site's production gate.

### Sampled search-result comparison

Queries sampled: “AC to DC converter calculator”, “AC to DC converter circuit working principle”, and related rectifier/ripple variations. These are a current research sample, not a verified universal top-ranking list. Results vary with geography and time. Pages were read for visible information architecture; their JavaScript calculations, speed, mobile layout and technical claims were not independently benchmarked here.

| Sample | Observed organization | Opportunity for this site |
| --- | --- | --- |
| [KKJTech converter calculator](https://tools.kkjtech.com/ac-to-dc-converter-calculator.html) | Calculator modes, many inputs, waveform area and a long guide with section navigation. | Offer clearly separated, bounded models; explain which inputs apply and why an output can be refused. Keep unrelated utility navigation out of the main learning path. |
| [LCSC converter overview](https://www.lcsc.com/blog/ac-to-dc-converter-basics/) | Broad component/topology discussion, comparison tables and editorial attribution. | Distinguish rectification from regulation; put every numerical efficiency or standards statement under its actual conditions rather than repeating broad percentages. |
| [Altium power-supply design article](https://resources.altium.com/p/ac-dc-power-supply-design) | Authored educational content grouped by isolation, rectification, switching and protection. | Pair explanatory stages with original signal diagrams and a calculator whose output is explicitly limited to the modeled stages. |

No competitor text, design, diagrams or proprietary assets should be copied. Competitor pages are discovery/UX references, not authorities for Google's policies or a replacement for engineering datasheets. Manufacturer/educational primary sources should support electrical claims. No conclusion about competing sites' measured accessibility or Core Web Vitals follows from this sample.

## 2. Keyword classification and intent boundaries

| Class requested in brief | Examples | Placement decision |
| --- | --- | --- |
| Primary | AC to DC converter | Homepage title/H1, definition and overview. |
| Secondary | converter calculator; converter types; circuit; working principle | Relevant homepage sections; dedicated tool or article only when intent differs. |
| Semantic | rectification; smoothing; pulsating DC; regulated output | Use in explanations of relationships, not repeated keyword lists. |
| Entities | diode; capacitor; transformer; regulator; load | Diagram labels, definitions and contextual discussion. |
| Long-tail | calculate filtered bridge DC output with diode drops | Calculator and the matching formula/limitations guide. |
| Questions | why does full-wave ripple occur at twice input frequency? | Ripple-frequency article; concise homepage FAQ answer links deeper. |
| Calculator | AC to DC voltage calculator; half-wave calculator | Existing tool URLs; avoid indexable pages for arbitrary input combinations. |
| Informational | what is an AC to DC converter? | Homepage introduction and stage guide with distinct depth. |
| Technical/engineering | RMS versus peak; capacitor ESR; dropout | Focused existing articles and transparent calculation methodology. |
| Application | choosing 12 V supply; battery charger versus supply | New selection/application guides; output-level table on homepage. |
| Comparison | linear versus switching; single versus three phase | New comparison articles; short homepage summaries. |

Exclude unrelated currency/crypto “AC/DC” abbreviations, entertainment searches, unrelated product model strings and generic electrical keywords that do not help the site's audience. DC-to-AC inverter searches get a concise directional comparison; do not turn this website into an unrelated inverter calculator cluster. Do not create separate thin 5 V, 9 V, 12 V, 24 V and 48 V articles with the same text. Explain output selection once and use differentiated examples where useful.

### Five additions and duplication controls

1. **Power supply stages explained:** whole-system sequence and signal transformations; extends beyond the existing bridge tutorial.
2. **Choosing an AC-to-DC power supply:** interpret ratings and load requirements, not a product-affiliate list or a voltage-to-current promise.
3. **Linear versus switching supplies:** architecture and loss tradeoffs; both can regulate, so this must not duplicate regulated versus unregulated output behavior.
4. **Single-phase versus three-phase rectifiers:** topology, line-to-line versus line-neutral quantities and pulse repetition; unsupported three-phase calculations stay outside the single-phase calculator.
5. **Power supply versus charger versus LED driver:** application-specific control behavior and why similar voltage labels do not imply interchangeability.

Retain all 20 existing published URLs unless evidence warrants consolidation. Three pairs need particular editorial differentiation: known-C ripple explanation versus target-ripple capacitor sizing; input sine RMS-to-peak derivation versus rectified-output RMS/average; and whole-supply architecture versus regulated/unregulated output behavior. The CSV states the separate reader problem for each. Later Search Console query overlap can inform improvement; no cannibalization or ranking outcome has been measured yet.

## 3. Homepage keyword-to-section and semantic outline

One descriptive H1 should state the actual topic, for example **AC to DC Converter: Calculator, Circuits and Working Principle**. Keep calculator and learning routes near the top and equally easy to find. A table of contents/jump navigation prevents the educational resource becoming an undifferentiated wall of text. Important content must remain present on mobile and in static HTML.

| Section / suggested anchor | Reader question and keyword cluster | Essential content / link |
| --- | --- | --- |
| Hero / `#top` | Is this an AC-to-DC learning resource and calculator? | Direct topic definition, two labeled CTAs and an original AC-to-DC waveform. |
| Calculator / `#calculator` | What output does my supported circuit produce? | Basic rectifier, filtered output and regulator-analysis modes; units, formula, validation and assumptions beside results. Link to dedicated calculator. |
| Introduction / `#ac-and-dc` | What differs between AC and DC? | Direction/polarity and time variation; avoid claiming that DC is always ripple-free. |
| Definition / `#what-is-a-converter` | What does a converter include? | Rectification creates unidirectional output; a complete supply may also transform, isolate, filter and regulate. |
| Process / `#working-principle` | How does conversion work? | AC input, optional transformer, rectifier, smoothing, regulator and output; explain different linear/SMPS stage order. Link stage guide. |
| Types / `#rectifier-types` | Half-wave, center-tapped full-wave, bridge or three-phase? | Comparison table with source assumption, conducting devices, pulse timing and scope. |
| Circuits / `#circuit-diagrams` | How are stages connected? | Original readable schematics; current-path annotations and waveform captions. Distinguish conceptual diagrams from construction plans. |
| Components / `#components` | Why is each component present? | Transformer, diode, capacitor, inductor, resistor/load, regulator/IC, heat sink, fuse/protection. Explain purpose and placement. |
| Formulas / `#formulas` | Which quantity and equation apply? | RMS, peak, mean, ripple, ratio and power with model-specific conditions and a worked low-voltage example. Link detailed formula articles. |
| Output levels / `#output-levels` | Why 5/9/12/24/48 V? | System requirements and regulation determine the nominal output; no universal mains-to-output multiplier. |
| Applications / `#applications` | Where is conversion used? | Adapters, charging, LEDs, embedded/industrial equipment, automotive chargers and EV/grid interfaces. Clarify that solar panels and vehicle batteries are DC sources; not every power stage is AC-to-DC. |
| Comparison / `#converter-vs-inverter` | Does an inverter do the reverse? | Direction, switching/control, output waveform and use-case table; keep scope bounded. |
| Performance / `#efficiency-and-ripple` | Why does output vary or heat occur? | Differentiate whole-supply efficiency, DC-component rectification ratio, ripple factor, thermal losses and regulation. |
| Advantages / `#limitations` | When are the tool and circuits unsuitable? | Clear benefits, approximation limits, unsupported models, isolation/component-rating requirements and professional review boundary. |
| FAQ / `#faqs` | What remains unclear? | Twelve direct answers from the prompt, written for readers; link to deeper pages only where helpful. |
| Related guides / `#guides` | What should I learn next? | Original article cards grouped by fundamentals, circuits, calculations, filtering and applications rather than an arbitrary recent-only list. |

Every section must answer a question. Avoid forcing every entity into every heading. Explanation and diagrams should share the same terminology and assumptions as the calculation engine.

## 4. Entity relationship map and coverage checklist

The following is a contextual content-design checklist, not an NLP score. Mark coverage after reviewing actual text and diagrams; mentioning an entity once is not proof that the relationship is explained.

| Relationship to explain | Homepage location | Deeper destination / check |
| --- | --- | --- |
| AC polarity varies; rectifier output is unidirectional but can pulsate | Definition and waveform | RMS/peak/average primer and bridge guide. |
| RMS characterizes a waveform differently from its mean and peak | Formulas and calculator labels | Input sine conversion and rectified-output RMS articles. |
| Transformer changes AC voltage and can provide isolation; ratio is not a DC regulation equation | Process/components | Transformer RMS guide; show isolated boundary accurately. |
| Four bridge diodes conduct in alternating pairs; each path has two forward drops | Types/circuit | Bridge explanation and diode-loss guide; verify arrows/polarities. |
| Center-tapped full-wave uses a different winding reference and conducting path | Types/circuit | Describe per-half secondary RMS explicitly; do not silently reuse bridge inputs. |
| Capacitor supplies charge between peaks; current, C and pulse interval affect ripple | Filtering/formulas | Known-C ripple explanation and inverse capacitor sizing. |
| ESR and RMS capacitor current cause heating separate from storage ripple | Performance/components | ESR/ripple-current guide; avoid treating load current as capacitor RMS current. |
| Inductors resist changes in current; filters are not automatically regulators | Components | Keep capacitor-only model limits visible. |
| Regulator feedback targets an output; dropout, quiescent current and thermal limits constrain a linear model | Calculator/performance | Linear/switching comparison and regulation behavior article. |
| SCR/thyristor firing and controlled rectification add control variables | Types | Contextual explanation only unless a verified controlled model is actually implemented. |
| Three-phase rectification has different source voltage definitions and pulse timing | Types | Single/three-phase comparison; separate supported scope from education. |
| Load resistance/current and power are linked, but voltage alone does not specify available current | Formulas/output | Missing-current-information article and supply-selection guide. |
| Charger and LED-driver control objectives differ from a constant-voltage adapter | Applications | Application-control comparison; no interchangeable-device claim. |
| Fuse, protection and heat sink serve different fault/thermal roles | Components/limitations | No implication that a calculated output proves safe isolation or compliant equipment. |
| Inverter changes DC into AC; modern converter systems can contain several internal conversion stages | Directional comparison/process | Do not confuse internal switching with the external input/output classification. |

## 5. Google documentation decisions

All links below were consulted during this research. They are primary references for Google-specific behavior. They define implementation decisions and verification criteria, not a certification by Google.

| Topic and current source | Project implementation / verification decision |
| --- | --- |
| [Search Essentials](https://developers.google.com/search/docs/essentials) and [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) | Useful first-party content; accessible public pages; descriptive titles, headings and links. No sitemap, structured data or content length guarantees indexing/ranking. |
| [Helpful, reliable content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) | Each page has a distinct reader problem, accurate examples and transparent scope. E-E-A-T is not a plugin score. Do not fabricate qualifications, measurement or independent review. Content length follows explanatory need. |
| [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies) | No keyword stuffing, scraped diagrams, doorway voltage pages, scaled low-value articles, manipulative links or unrelated hosted advertorial content. Label sponsored content and qualify paid links. Apply the site's own editorial checks even when AI assists drafting. |
| [Title links](https://developers.google.com/search/docs/appearance/title-link) | Unique descriptive page titles, consistent visible H1 and concise brand use. Display previews are estimates; Google may generate a different title. |
| [Snippets](https://developers.google.com/search/docs/appearance/snippet) | Unique, accurate descriptions. Character ranges are editorial guidance, not Google's fixed limits. Do not promise that the supplied description appears for every query. |
| [Noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing) and [robots introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro) | Review public pages remain crawlable with intentional noindex, so crawlers can see the rule. Do not use Disallow:/ as the way to enforce noindex. Authentication protects private APIs; robots rules are not access control. |
| [Build a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | Include preferred, indexable, successful public URLs only. While all public pages intentionally have noindex, do not advertise or submit a sitemap of them. Disable the review sitemap endpoint (for example, a deliberate 404 or 204) until there are eligible URLs. Exclude drafts, trash, admin, APIs, redirects and errors. Add lastmod only for meaningful recorded changes. |
| [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) | Use one HTTPS origin and trailing-slash convention, with consistent self-canonicals for distinct pages. Redirect retired URLs appropriately instead of leaving duplicate full pages. Canonicalization is not a replacement for useful architecture. |
| [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) | Astro SSG supplies educational text, metadata, schema and crawlable links without interaction. Client JavaScript enhances calculators/forms. Show a truthful no-JS explanation, not invented calculated outputs. |
| [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [Article](https://developers.google.com/search/docs/appearance/structured-data/article) and [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) | Parse JSON-LD and validate applicable types. Article dates, authors, images and breadcrumb paths match visible content. Markup is not proof that a rich result will appear. |
| [Software app rich results](https://developers.google.com/search/docs/appearance/structured-data/software-app) | Do not fabricate ratings/reviews to satisfy app rich-result requirements. A truthful WebPage/WebSite description is preferable to a misleading rich-result claim. If a plain SoftwareApplication entity is used, distinguish schema validity from Google feature eligibility. |
| [Google documentation updates](https://developers.google.com/search/updates) | **Current change:** FAQ rich results stopped appearing from 7 May 2026, and FAQ feature documentation has been removed. Keep visible useful FAQs, but do not implement/promote FAQPage for an expected Google FAQ enhancement or repeat outdated government/health eligibility guidance. |
| [Image SEO](https://developers.google.com/search/docs/appearance/google-images) | Repository-local original images with relevant filenames, meaningful alt/captions, dimensions and efficient loading. Use the same asset URL when reusing a diagram. Alt text describes the visual, not an entity keyword list. |
| [Mobile-first guidance](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing) | Equivalent main content, metadata, images and links on mobile; responsive layout may change. Verify table/diagram readability, keyboard inputs and navigation instead of hiding educational content. |
| [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) , [Web Vitals measurement](https://web.dev/articles/vitals) and [PageSpeed data interpretation](https://developers.google.com/speed/docs/insights/v5/about) | Measure loading, interaction and layout stability. Current good targets are LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1, assessed at the 75th percentile separately for mobile and desktop. Lab results are diagnostic evidence; insufficient CrUX data must be reported, not replaced by invented field scores. |
| [Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start) | After domain ownership and launch authorization, verify the property, submit the final sitemap, inspect representative URLs and monitor indexing/CWV/security reports. Account access and field data are separate verification dependencies. |

## 6. Metadata and technical audit specification

Create a build-derived CSV/report for every public page: absolute target URL, page type, primary keyword, full title, title count, estimated display width, description and count, intent, uniqueness, canonical, robots, H1, schema types, image alt status and editorial notes. Estimate title width with a documented font/size; it is not Google's renderer. Flag review candidates without truncating all titles to a rigid character count. Verify category archives are useful pages with unique labels/context; do not create empty taxonomy pages.

Automated checks should cover missing/duplicate titles and descriptions, exactly one descriptive H1, logical H2/H3 sequence, broken local links/assets, JSON-LD parsing, expected canonical origin, no executable inline script under CSP, proper 404 status, protected admin/API paths and sitemap/indexing consistency. An automated pass cannot establish technical truth or full accessibility. Keep editorial accuracy review and browser checks separate from static audits.

### Review deployment versus public launch

The intended production origin is `https://actodcconverter.online`. The owner previously chose to attach the domain personally. Keep the workers.dev deployment intentionally non-indexable until that domain and the operator's contact/privacy settings have been reviewed. This intentional gate is not an accidental SEO error. Do not submit the review host to Search Console as the final production property.

The current combination of public noindex plus robots Disallow:/ should be corrected so public crawling is allowed while noindex is readable. A disabled, unadvertised review sitemap is intentional; do not submit an empty sitemap as a successful production sitemap. [Search Console reports empty sitemaps as an error](https://support.google.com/webmasters/answer/7451001), and the [protocol](https://www.sitemaps.org/protocol.html) requires URL entries with loc values. At launch, enable indexing deliberately, regenerate a sitemap of canonical public routes, verify custom-domain HTTPS and any alternate-host behavior, then submit that sitemap. A valid canonical tag does not prove the domain resolves or is owned.

## 7. Internal linking and editorial workflow

Navigation: homepage → calculator and topic clusters → individual guides. Homepage cards should include representative fundamentals, circuit, formula and application guides. Article templates link to the relevant category, a small number of genuinely related guides, the calculator when useful, and a truthful editorial/methodology page. The CSV supplies contextual targets for each article; use ordinary anchor elements with specific natural text. A footer link does not replace a useful contextual explanation.

Publish only articles with original explanations, checked numerical examples, functioning internal links, relevant source references and reviewed diagrams. Preserve original publication dates; update dates only for substantive edits. Existing articles receive review briefs, not a fictitious claim that their briefs preceded their original writing. For new articles, complete the brief before drafting. Keep author attribution honest: an editorial team profile can describe this software/content process, but must not invent a named engineer, qualification, independent sign-off or bench test.

For electrical examples, report input, units, model, intermediate quantities, result, assumptions and the independent numerical check. Distinguish software verification from laboratory measurement. Address mains conversion conceptually and direct readers to qualified design/isolation/component-rating review; do not imply a calculated low output makes an exposed circuit safe.

## 8. Evidence and completion gates

| Gate | Evidence required before claiming complete |
| --- | --- |
| Research/planning | This source-linked plan, keyword map, entity map and article-specific briefs. No invented keyword metrics. |
| Homepage/calculator | All useful educational sections implemented; supported models produce verified values and reject unsuitable inputs. |
| Content | 20–25 distinct published articles; existing 20 retained/reviewed, five additions independently scoped. No arbitrary padding or fabricated reviewer identities. |
| SEO infrastructure | Build audit plus real response checks for canonical/robots/sitemap/status/metadata/schema and mobile content parity. |
| Forms/dashboard | Actual submission/storage/retrieval and error tests; no static success message posing as a working form. Secrets remain server-side. |
| Images/accessibility | Visual review of each original schematic and representative mobile layouts; labels, focus, contrast, image alternatives and live errors checked. |
| Performance | Report the tool/version, URL, device/network conditions and measured lab results. Field CWV remains unverified without adequate real-user data. |
| Production | Correct custom domain/HTTPS, operator privacy/contact review and deliberate indexing choice; owner-dependent actions reported explicitly. |

The final report must separate **COMPLETED**, **PARTIAL**, **UNVERIFIED** and **OUTSTANDING**. Do not convert documentation, unit-test success, or a review deployment into a blanket claim of Google compliance, guaranteed rankings, certified electrical design or production readiness.
