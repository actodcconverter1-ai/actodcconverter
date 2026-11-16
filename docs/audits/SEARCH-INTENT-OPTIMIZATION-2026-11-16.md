# Search intent improvements — 16 November 2026

The traffic review identified limited search exposure and three promising comparison/explanation guides. This release makes those pages answer their questions sooner and distinguishes the conversion hub from the detailed calculation tool.

| Route | Search intent and change |
| --- | --- |
| `/` | Explain how AC becomes DC; lead with rectification, filtering and regulation, then link to the output calculator. Title emphasizes how it works, circuits and calculator. |
| `/ac-to-dc-calculator/` | Calculate output voltage and capacitor ripple. Opening explains the three modes and why unfiltered average and filtered crest require different formulas. |
| `/blog/half-wave-vs-full-wave-rectifier/` | Compare differences and advantages. Lead with half-cycle use, ideal average factors and 50 Hz ripple timing; retain the comparison table and add a short selection answer. |
| `/blog/full-wave-bridge-rectifier-explained/` | Explain circuit operation and DC output. Lead with four diodes/two conducting, ideal average and the distinction from capacitor filtering. |
| `/blog/single-phase-vs-three-phase-rectifiers/` | Compare voltage and ripple. Lead with two/six pulses and the correct RMS conventions; explicitly keep three-phase calculations outside the single-phase tool's scope. |

Guide descriptions supply a direct answer above the featured image; article bodies supply the assumptions, numerical examples and primary references. Titles, visible headings and schema descriptions describe the same subject. Modified guides carry the real update date. The homepage now features the single/three-phase comparison alongside the other priority guides.

Existing route URLs, self-canonicals, calculator formulas, tracking and private dashboard behavior are preserved. No new client JavaScript or dependencies were added. This is a focused content change, not evidence of a ranking increase or a diagnosis of keyword cannibalization. Preserve this release as a baseline and compare equivalent processed reporting periods after 7–14 days.

Google guidance used: [descriptive title links](https://developers.google.com/search/docs/appearance/title-link) and [Search Essentials](https://developers.google.com/search/docs/essentials). The existing article-linked Hammond and MathWorks references support the rectifier model distinctions.

Validation: `npm run verify` passed lint, Astro diagnostics (zero errors, warnings or hints), 116 tests, the 25-article content audit, the 50-page production build, the 46-URL sitemap audit and the 28-spoke graph audit. Public first-party JavaScript remains 17,392 bytes. Wrangler deployment dry run also passed; its initial sandbox filesystem restriction was resolved by rerunning with the required filesystem access.

Deployment evidence is recorded locally under `artifacts/seo-priority-*`; private analytics observations are not included in this repository document.
