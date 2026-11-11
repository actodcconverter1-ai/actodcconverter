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

/** Set privacy defaults before the SDK can initialize an automatic page view. */
export function analyticsCommands(id: string, url: string, referrer: string, title: string, now = new Date()): unknown[][] {
  const page = analyticsPage(url);
  if (!page || !/^G-[A-Z0-9]+$/.test(id)) return [];
  const context = {page_location:page, page_referrer:analyticsReferrer(referrer), page_title:title};
  const options = {...context, send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false, cookie_expires:15552000, cookie_update:false};
  const denied = {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'};
  return [
    ['set', options],
    ['consent', 'default', denied],
    ['js', now],
    ['config', id, options],
    ['consent', 'update', {...denied, analytics_storage:'granted'}],
    ['event', 'page_view', {...context, send_to:id}],
  ];
}
