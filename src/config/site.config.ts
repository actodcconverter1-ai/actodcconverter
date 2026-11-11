import settings from './editorial.json' with { type: 'json' };
export const site = {
  ...settings,
  colors: { primary: settings.primaryColor, accent: settings.accentColor },
  social: { image: settings.socialImage, imageAlt: settings.socialImageAlt, twitterHandle: settings.twitterHandle },
  nav: [{ label: 'Calculator', href: '/ac-to-dc-calculator/' }, { label: 'Guides', href: '/blog/' }, { label: 'About', href: '/about/' }],
  relatedTools: [
    { title: 'Full-wave rectifier', href: '/full-wave-rectifier-calculator/', description: 'Find the average of an ideal unfiltered rectified sine.' },
    { title: 'Half-wave rectifier', href: '/half-wave-rectifier-calculator/', description: 'Compare the average when only one half-cycle conducts.' },
  ],
} as const;
