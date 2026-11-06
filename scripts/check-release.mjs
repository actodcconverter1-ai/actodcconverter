import { site } from '../src/config/site.config.ts';
const issues = [];
const domain = new URL(site.domain);
if (domain.protocol !== 'https:' || /(^|\.)example\.(com|org|net)$/.test(domain.hostname) || domain.hostname === 'localhost') issues.push('Configure the real HTTPS domain in site.config.ts.');
if (!site.indexable || site.defaultRobots !== 'index, follow') issues.push('Review the site and enable indexing for public launch.');
if (!site.contactEmail && !site.issueUrl) {
  try {
    const response = await fetch(new URL('/api/contact/challenge', domain), {signal:AbortSignal.timeout(10000)});
    const data = await response.json();
    if (!response.ok || typeof data.token !== 'string') issues.push('Verify the private contact form on the intended production domain.');
  } catch { issues.push('Verify the private contact form on the intended production domain.'); }
}
if (issues.length) { console.error(issues.join('\n')); process.exit(1); }
console.log('Release configuration checks passed. Operator policy review and deployment verification are still required.');
