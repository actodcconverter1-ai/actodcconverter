export const consentKey = 'acdc-analytics-consent-v1';
export const consentLifetime = 180 * 86400000;
export type AnalyticsConsent = 'granted' | 'denied';

export function readConsent(raw: string | null, now = Date.now()): AnalyticsConsent | null {
  try {
    const value = JSON.parse(raw ?? 'null');
    if (!value || !['granted', 'denied'].includes(value.choice) || !Number.isFinite(value.updatedAt)) return null;
    const age = now - value.updatedAt;
    return age >= 0 && age < consentLifetime ? value.choice : null;
  } catch { return null; }
}

/** Analytics never receives query strings, fragments, forms or calculator values. */
export function analyticsPage(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol) || /^\/(?:admin|api)(?:\/|$)/.test(parsed.pathname)) return null;
    return parsed.origin + parsed.pathname;
  } catch { return null; }
}

export function analyticsReferrer(url: string): string {
  try { const parsed = new URL(url); return ['https:', 'http:'].includes(parsed.protocol) ? parsed.origin + '/' : ''; }
  catch { return ''; }
}
