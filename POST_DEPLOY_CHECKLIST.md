# Post-deployment checklist

- Confirm production build-info commit equals the released branch/merge commit.
- Rerun all browser tests against production with GA/GTM requests blocked.
- GET every XML sitemap URL; confirm HTTP 200, self-canonical and indexability, and verify hreflang equivalents.
- Recheck HTTP/www/slash/query redirects; keep one 301 hop to the preferred HTTPS origin.
- In Search Console, check the existing submitted sitemap; resubmit the updated https://actodcconverter.org/sitemap.xml if needed.
- Inspect homepage, main calculator, half-wave calculator and full-wave calculator; compare declared and Google-selected canonicals. Request indexing for meaningfully updated pages as quota permits.
- Run the Rich Results Test on a calculator and guide; distinguish supported rich-result eligibility from valid generic WebApplication/Article schema.
- Recheck Pages/indexing reports after 7–14 days. Intentional HTTP redirect exclusions do not require indexing the HTTP URL.
- Compare matched complete weekly performance windows by exact query and landing URL; retain country/device filters and annotate release date.
