# SEO implementation changelog

Source baseline: `63b9c43`; owner-supplied CSV: 147 zero-click queries. Existing query metrics are not new measurements. No calculator math, physical constants, formulas or engine numeric results are changed.

## Phase 1 — HTTP

Live HTTP and www requests already return single-hop permanent redirects to HTTPS non-www, including directory slashes and queries. Added a repeatable curl-based production audit and `seo-http-audit.md`; preserved working redirects, real 404s, search noindex and one-year HSTS without includeSubDomains/preload.

## Phase 2 — ownership

`seo-keyword-map.md` assigns every supplied query to one existing primary URL, correcting misleading CSV suggestions. The map keeps broad conversion information on `/`, calculation intent on `/ac-to-dc-calculator/`, ideal full-wave calculation on its existing tool, and specific topology/ripple/RMS/current/power-supply questions on matching guides. Priority C phrases are retained only where meaningful; garbled query strings are not inserted verbatim.

## Phase 3 — priority answers

- Four guides now expose their existing, accurate page summaries immediately under H1 as **Answer in brief**, with the matching existing ideal formula: bridge rectifier, half/full-wave comparison, phase comparison, and average-versus-RMS. Their full explanations and numerical examples remain intact.
- The ideal full-wave calculator has its existing waveform context and formula in the same quick-answer treatment.
- The half/full-wave guide adds a direct identification answer: one versus two pulses per source cycle, interpreted with the source frequency rather than diode count alone. Its actual `updatedDate` moves from 17 to 19 November 2026; publication date is unchanged. Formatting-only changes to other guides do not refresh dates.
- The dedicated calculator clarifies the fields' 0–1,000 V RMS / 1–1,000 Hz software bounds, model-specific rejection and the difference from equipment input ratings. It links to the existing supply-input-range explanation.
- Existing titles/metas on these guides and the dedicated calculator already promise specific, relevant answers within the requested budgets; they are retained rather than mechanically rewritten.
- The new short copy is supplied in all 18 existing JSON dictionaries. This is an editorial update, not a claim that legacy translated articles have received native expert certification.

The per-page old/new title, description and H1 table and final verification results are appended after all phases are built. All established URLs remain present. No DC-to-AC calculator or Phase 8 widget is introduced.
