import {analyticsPage, analyticsReferrer, consentKey, readConsent, type AnalyticsConsent} from '../lib/analytics';

declare global {
  interface Window {dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean | undefined;}
}
const analyticsWindow = window;
const root = document.querySelector<HTMLElement>('[data-analytics-id]');
if (root) {
  const id = root.dataset.analyticsId!;
  const page = analyticsPage(location.href);
  const banner = root.querySelector<HTMLElement>('[data-analytics-banner]')!;
  const preferences = root.querySelector<HTMLButtonElement>('[data-analytics-preferences]')!;
  const status = root.querySelector<HTMLElement>('[data-analytics-status]')!;
  let loaded = false;
  let returnFocus = false;

  function loadAnalytics() {
    if (loaded || !page || !/^G-[A-Z0-9]+$/.test(id)) return;
    loaded = true;
    analyticsWindow[`ga-disable-${id}`] = false;
    const dataLayer = analyticsWindow.dataLayer ??= [];
    // Google's queue uses an arguments object, so commands retain the supported shape.
    // eslint-disable-next-line prefer-rest-params -- Preserve Google's documented arguments queue.
    const gtag: (...args: unknown[]) => void = function () { dataLayer.push(arguments); };
    analyticsWindow.gtag = gtag;
    gtag('consent', 'default', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    gtag('consent', 'update', {analytics_storage:'granted', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    gtag('js', new Date());
    const context = {page_location:page, page_referrer:analyticsReferrer(document.referrer), page_title:document.title};
    gtag('config', id, {...context, send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false, cookie_expires:15552000, cookie_update:false});
    gtag('event', 'page_view', {...context, send_to:id});
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    script.addEventListener('error', () => { status.textContent = 'Analytics could not load. The calculator and website remain available.'; });
    document.head.append(script);
  }

  function removeAnalyticsCookies() {
    for (const item of document.cookie.split(';')) {
      const name = item.trim().split('=')[0];
      if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) continue;
      for (const domain of ['', '; Domain=' + location.hostname, '; Domain=.' + location.hostname]) {
        document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax; Secure' + domain;
      }
    }
  }

  function choose(choice: AnalyticsConsent) {
    try { localStorage.setItem(consentKey, JSON.stringify({choice, updatedAt:Date.now()})); }
    catch { status.textContent = 'Your browser cannot remember this preference. You can choose again on your next visit.'; }
    banner.hidden = true;
    if (returnFocus) preferences.focus();
    if (choice === 'granted') loadAnalytics();
    else {
      analyticsWindow[`ga-disable-${id}`] = true;
      removeAnalyticsCookies();
      // A fresh document stops all previously loaded tag timers and listeners.
      if (loaded) location.reload();
    }
  }

  window.addEventListener('storage', event => {
    if (event.key === consentKey && readConsent(event.newValue) !== 'granted' && loaded) {
      analyticsWindow[`ga-disable-${id}`] = true;
      removeAnalyticsCookies();
      location.reload();
    }
  });

  if (page) {
    preferences.hidden = false;
    preferences.addEventListener('click', () => { returnFocus = true; banner.hidden = false; root.querySelector<HTMLButtonElement>('[data-analytics-reject]')!.focus(); });
    root.querySelector('[data-analytics-allow]')!.addEventListener('click', () => choose('granted'));
    root.querySelector('[data-analytics-reject]')!.addEventListener('click', () => choose('denied'));
    let choice: AnalyticsConsent | null = null;
    try { choice = readConsent(localStorage.getItem(consentKey)); } catch { /* A choice remains available without persistent storage. */ }
    if (choice === 'granted') loadAnalytics();
    else {
      analyticsWindow[`ga-disable-${id}`] = true;
      removeAnalyticsCookies();
      banner.hidden = choice === 'denied';
    }
  }
}
