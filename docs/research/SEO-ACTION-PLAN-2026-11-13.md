# SEO and homepage action plan — 13 November 2026

Scope: actodcconverter.org. Planning only; no public site changes are made by this document. Recommendations are based on the current public homepage and repository content, not a new authenticated Search Console query export. No search-volume, keyword-difficulty, backlink, ranking or conversion figures are invented.

## Interpret the first two days

Two days is too little to diagnose sustained organic performance. Search Console impressions and clicks are different from GA4 users, sessions and views. The reported 29 must be identified by its metric and channel; it may include direct traffic and setup/QA visits. The new GA4 property contains documented synthetic test events, including early duplicate probes fixed during setup. Do not count these as organic acquisition. Sitemap processing/discovery is not equivalent to every URL being indexed.

Review Search Console by query plus landing page, country and device. Use comparable periods. Low positions suggest a relevance/visibility opportunity; repeated impressions near visible positions with few clicks justify evaluating the actual search result, title and intent. Do not diagnose a title problem from sitewide zero clicks or repeatedly rewrite a new site's title every day. A weekly review and a 28-day planning window are useful operational choices, not Google's ranking timetable.

## Domain and intent

The exact-match name communicates the subject but does not provide automatic ranking entitlement. Google explicitly has an exact-match-domain system to avoid giving excessive credit to query-matching domains. The homepage should own the broad AC-to-DC conversion topic with a usable tool. The existing /ac-to-dc-calculator/ should own the deeper calculation workflow/methodology. Both may contain the calculator when the surrounding purposes remain distinct. Do not consolidate URLs or change canonicals solely because two pages share a tool.

Current live title: AC to DC Converter: Calculator, Circuits & Types.
Current H1: AC to DC converter. Clarity at every stage.
Live status: 200; robots index, follow. The homepage already includes calculator, definition, working principle, rectifier types, diagrams, components, formulas/examples, output levels, applications, inverter comparison, performance, FAQs, sources and guides. Most major topic coverage exists.

Suggested title experiment: AC to DC Converter: Calculator, Circuits & Formulas.
Suggested H1: AC to DC Converter: Calculate Output and Understand the Circuit.
Suggested introductory text: Estimate rectifier output from sinusoidal AC RMS voltage, compare peak, average and ripple, and understand how diodes, capacitors and regulators affect the result. Choose a circuit model before calculating.
These are proposed tests, not a claim that the present title causes zero clicks. Keep the current URL.

## Homepage order and content brief

| Order | Section | Specific editorial action |
|---|---|---|
| 1 | Clear H1, short explanation and two routes | State the tool's purpose directly. Calculator should be easy to reach on phones; reduce decorative hero space where needed. Keep an education shortcut. |
| 2 | Calculator | Retain explicit models, units, validation, assumptions and useful results. Prioritize the complete input/result journey over more keyword paragraphs. |
| 3 | Worked example | Show the existing 12 V RMS bridge example immediately after results: 50 Hz, 0.7 V/diode, 0.1 A, 1000 µF gives approximately 15.071 V mean, 14.571 V valley and 1 V p-p ripple under the stated approximation. |
| 4 | What changes the answer? | Concise AC/DC explanation plus the difference between pulsating, filtered and regulated DC. State that there is no universal multiplier. |
| 5 | Working principle | Use the original stage diagram; explain that isolated switching and conventional linear supplies place isolation differently. |
| 6 | Rectifier comparison | Keep the half-wave, center-tapped and bridge table; link each relevant specialist guide/tool. |
| 7 | Circuit diagrams | Keep readable original SVGs, accurate labels and explanatory captions. Preserve phone scrolling/open-full-diagram links. |
| 8 | Formulas and model limits | Summarize appropriate average/peak/ripple quantities. Link full derivations and uncertainty details instead of duplicating each article. |
| 9 | Common questions about output rails | Explain that 5/9/12/24/48 V are regulated design targets, not fixed conversions. Use model-based examples rather than thin exact-voltage landing pages. |
| 10 | Practical applications and selection | Distinguish power supply, charger and LED driver; point to the current selection guide. Keep examples relevant to user decisions. |
| 11 | Trust and FAQs | Cite real manufacturer references, show actual software validation and honest reviewer identity. No invented engineer, lab claim, certification or review. Answer short practical questions. |
| 12 | Curated next steps | Link 6–8 distinct high-value guides, not every keyword variant. Keep the full blog/categories accessible. |

This order reorganizes existing coverage; it is not a brief to write another long homepage or repeat the same definition under many headings. There is no keyword-density or word-count target in this plan.

## Content priorities: improve existing pages first

1. /blog/ac-to-dc-formulas/: formula-selection table, explicit averaging conventions, examples and a link into the right calculator model.
2. /blog/ac-to-dc-calculator-worked-examples/: independent checks, rejected-case explanation and model-specific examples. Optional load-example presets can be an engineering enhancement only when tested.
3. /blog/full-wave-bridge-rectifier-explained/: original conducting-path diagrams plus unfiltered vs filtered output comparison.
4. /blog/smoothing-capacitor-calculation/: a realistic ripple/load example and capacitor voltage/current/ESR limitations; link the existing capacitor ESR article rather than duplicating it.
5. /blog/half-wave-vs-full-wave-rectifier/: concise comparison and correct factor-of-two pulse/ripple explanation, linking the two existing tools.
6. /blog/choosing-ac-to-dc-power-supply/: load/current/polarity/isolation/derating checklist, with rated-device examples only if their sources are actually checked.

These pages already exist. Avoid creating duplicate replacement URLs. Maintain accurate dates: change updated dates for substantive changes, not to simulate freshness. Add new articles only for an identified unanswered need with a distinct intent. Do not bulk-generate near-identical 5/9/12/24/48 V, 50/60 Hz or synonym pages. Unmeasured candidate long-tail needs include loaded 12 V RMS rectifier output, ripple-valley headroom and explaining 0.9 vs 1.414 multipliers; use the existing relevant guide where it already answers that need.

## Distribution and technical priorities

- Recheck actual indexability, Google's selected canonical and indexing status of homepage, main tool and priority guides. Investigate actionable errors, not every excluded URL; private pages and 404s should remain excluded.
- Keep all internal/canonical/schema/sitemap origins on .org and redirects consistent. Existing launch checks are evidence, not a guarantee of current Google indexing.
- Revisit the previously measured mobile main-thread blocking-time issue. Prior audit numbers are historical lab runs, not current field CWV.
- Seek a real independent technical review of formulas and diagrams where practical; publish only the reviewer's actual agreed attribution.
- Share a genuinely useful calculator or explanatory diagram with relevant electronics educators, project documentation and communities. No paid-link packages, PBNs, mass comments or fabricated citations; do not set a backlink quota.
- Clear answer paragraphs, tables and labeled images support readers and machine understanding. Google's AI-search guidance does not prescribe a special schema/file or an entity-density trick for inclusion.

## Four-week execution cadence

Week 1: establish the query/page/country/device baseline; verify priority-page indexing; tighten hero/first-screen journey and worked example.
Week 2: substantively improve the first three existing guides with clear diagrams/examples/internal links; test mobile calculation usability and performance changes.
Week 3: improve the next three guides, pursue qualified review and relevant resource-sharing opportunities.
Week 4: compare appropriate periods and similar query positions; evaluate title/intent changes and organic landing-page engagement. Publish new material only for evidenced gaps.

Measure organic Search Console clicks/impressions by query and page, indexing status of priority URLs and GA4 google/organic engagement. Keep users/sessions/views distinct and account for consent/ad blocking. Numerical traffic/ranking targets require more evidence; none are promised here.

## Sources

- https://developers.google.com/search/docs/appearance/ranking-systems-guide
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/essentials
- https://developers.google.com/search/docs/appearance/ai-features
