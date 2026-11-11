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
