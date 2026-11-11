import {analyticsCommands, analyticsPage, consentKey} from '../lib/analytics';

declare global {
  interface Window {dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean | undefined;}
}
const analyticsWindow = window;
const root = document.querySelector<HTMLElement>('[data-analytics-id]');
if (root) {
  const id = root.dataset.analyticsId!;
  const page = analyticsPage(location.href);
  if (page && /^G-[A-Z0-9]+$/.test(id)) {
    // No consent banner: the tag loads on every public page. A stored
    // choice from the old banner (including a past rejection) must not
    // keep disabling collection for returning visitors.
    try { localStorage.removeItem(consentKey); } catch { /* Analytics still loads below without persistent storage. */ }
    analyticsWindow[`ga-disable-${id}`] = false;
    const dataLayer = analyticsWindow.dataLayer ??= [];
    // Google's queue uses an arguments object, so commands retain the supported shape.
    // eslint-disable-next-line prefer-rest-params -- Preserve Google's documented arguments queue.
    const gtag: (...args: unknown[]) => void = function () { dataLayer.push(arguments); };
    analyticsWindow.gtag = gtag;
    for (const command of analyticsCommands(id, location.href, document.referrer, document.title)) gtag(...command);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.append(script);
  }
}
