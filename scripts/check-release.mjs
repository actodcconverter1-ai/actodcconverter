import { site } from '../src/config/site.config.ts';
const issues = [];
const domain = new URL(site.domain);
if (domain.protocol !== 'https:' || /(^|\.)example\.(com|org|net)$/.test(domain.hostname) || domain.hostname === 'localhost') issues.push('Configure the real HTTPS domain in site.config.ts.');
if (!site.indexable) issues.push('Review the site and set indexable=true for public production.');
if (!site.contactEmail && !site.issueUrl) issues.push('Configure a working operator email or issue URL.');
if (issues.length) { console.error(issues.join('\n')); process.exit(1); }
console.log('Release configuration checks passed.');
