# Google Search Console and GA4 — 11 November 2026

## Search Console

The owner completed domain verification in the dedicated Google account. The domain property sc-domain:actodcconverter.org was opened successfully. Submitted https://actodcconverter.org/sitemap.xml through Search Console. Google initially displayed a temporary Couldn't fetch state, then the detail page reported **Sitemap processed successfully**, last read 11 November 2026, **45 discovered pages** and zero videos. This is sitemap processing, not a claim that all pages are indexed or ranked. Evidence: ignored artifacts/gsc-sitemap-45-success.jpg.

## Analytics property and implementation

- Account: AC to DC Converter (415767388).
- GA4 property: actodcconverter.org (563771103).
- Web stream: https://actodcconverter.org/, stream 16317596132.
- Measurement ID: G-FCMW7WN9P3. It is a public routing identifier, not a password/API secret; it lives in src/config/analytics.json rather than .env. No Measurement Protocol secret is created.
- The owner accepted Google's Analytics/Data Processing agreement personally. Setup selected Pakistan reporting timezone, USD reporting currency, Science and the small-business category. Optional account sharing was off during the prepared setup.
- Native enhanced measurement was disabled for the web stream. The site supplies page_view and standard consented engagement, without automatic form/search/outbound event measurement.
- A single direct Google tag loads after an explicit Allow analytics choice. No tag request before a choice or after rejection. All advertising consent remains denied; Google signals/ad-personalization parameters are disabled. The unused GTM snippet shown during onboarding is not also installed, avoiding double tagging.
- Only public page layouts include the integration; admin/login/API and the noindex 404 do not activate it. Page context strips query strings and fragments. Referrers contain only the origin; no calculator input values or contact fields are read by the analytics module.
- Consent choice lasts up to 180 days in local storage. The footer privacy control permits changing it. Withdrawal disables the tag, clears this site's standard GA cookies and reloads to stop active tag timers/listeners; other open tabs react to withdrawal. Analytics cookies are configured for a maximum of 180 days without sliding updates.
- Strict script CSP remains without unsafe-inline/eval. Only the required Google tag/collection origins are allowed. Privacy policy updated to describe actual optional analytics and provider processing.

## Verification

Full verify passed: lint, zero-error Astro check, 108 tests, content audit, 49-page build and generated-output checks. Public executable JavaScript before the optional external Google tag is 18,939 bytes. New tests cover consent expiry/tampering, private path exclusion, query/fragment stripping and origin-only referrers.

Local browser checks: zero Google script elements before a choice; rejection persists over reload with zero Google scripts; footer preference reopens and supports keyboard rejection. No localhost test hit was sent. Production grant/revoke testing, exact-commit automatic deployment and GA4 receipt verification follow the source push and must be reported separately.

Official references: https://developers.google.com/analytics/devguides/collection/ga4/web ; https://developers.google.com/tag-platform/security/guides/consent ; https://developers.google.com/tag-platform/security/guides/csp . This is implementation evidence, not a legal-compliance certification.

## Initial production test and initialization hardening

Commit d468cdef2a5156fd73823e698e3683dd781678c4 passed Verify/Workers Builds and matched live build-info. Production public verification matched 97 routes/assets. Live browser confirmed zero Google script elements before a choice/after persistent rejection; allowing created exactly one Google loader with this property's measurement ID and navigation retained consent. Revocation reloaded with zero Google loaders.

Realtime received one test user and page_view/engagement events. Inspection of received page_location values exposed an SDK initialization race: an automatic view preceded the per-target privacy configuration, giving duplicate counts and one raw synthetic qa_tracking URL. No real personal field was used in the probe. The follow-up queues clean URL/referrer context and send_page_view=false globally before SDK initialization or consent grant, applies target settings, then sends one explicit page_view. A regression test enforces the order, private-route rejection and a single explicit page event. This version passes 109 tests. Final live single-count and sanitized-location retest remains required below. Early synthetic QA views are test data in this new property, not organic traffic; no irreversible Analytics history deletion was performed.

## Final live result

Initialization-order fix b97177b2d5fcc1becff1e9e5acb2988f2af3b973 passed GitHub Verify and Workers Builds; production build-info matched that exact revision. Cloudflare build 077166bf-ad1d-4579-9f02-4b9689de993a, version d4b67c51-2a07-4d7d-81cc-9e38cfc53c0a.

Retested a previously unvisited About page using a synthetic qa_tracking query and hash. After explicit consent, the Realtime page_location drilldown reported exactly **https://actodcconverter.org/about/ — 1 event**, with no corresponding raw-query About URL. This verifies single counting and sanitization in the real receiving service, beyond testing the local helper. The earlier synthetic root/blog probe rows remain test history, not organic traffic.

Live browser checks also passed saved rejection, grant persistence across navigation, withdrawal, and cross-tab withdrawal: a second consented tab had one Google loader; withdrawing in the first tab reloaded both tabs with zero Google loaders. The private /admin/login/ page had no Analytics controls or Google loader. Test browser consent was left rejected after cleanup. Realtime recorded the QA user and standard page_view/session/engagement events in the correct dedicated property.

Search Console: **completed**, sitemap processed successfully with 45 pages discovered. GA4: **completed**, public consent-based tag deployed and data receipt verified. Search indexing/ranking and future report aggregation remain Google's processing outcomes, not guaranteed by setup. The owner can use the property directly at https://analytics.google.com/analytics/web/?authuser=1#/a415767388p563771103/realtime/overview .
