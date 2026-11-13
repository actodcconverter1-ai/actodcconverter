import { site } from './site.config.ts';
export const seo = { titleSuffix: site.seoTitleSuffix || site.name, locale: 'en_US', language: 'en', defaultDescription: site.description };
export function canonical(path: string) { return new URL(path, site.domain).href; }
