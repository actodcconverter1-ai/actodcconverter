import type { CollectionEntry } from 'astro:content';

export interface Spoke {
  href: string;
  title: string;
  description: string;
  kind: 'calculator' | 'guide';
  topics: string[];
}

export const architectureUpdated = '2026-11-13';
export const calculatorSpokes: Spoke[] = [
  {href:'/ac-to-dc-calculator/', title:'AC to DC calculator', description:'Compare diode-drop rectification, capacitor ripple and downstream regulator models.', kind:'calculator', topics:['rectifier-basics','worked-examples','filtering','regulation']},
  {href:'/full-wave-rectifier-calculator/', title:'Full-wave rectifier calculator', description:'Calculate an ideal unfiltered full-wave sine average, peak and pulse frequency.', kind:'calculator', topics:['rectifier-basics','full-wave','average']},
  {href:'/half-wave-rectifier-calculator/', title:'Half-wave rectifier calculator', description:'Calculate an ideal half-wave average over the complete AC cycle.', kind:'calculator', topics:['rectifier-basics','half-wave','average']},
];

export function buildSpokes(entries: CollectionEntry<'blog'>[]): Spoke[] {
  return [...calculatorSpokes, ...entries.filter(entry=>entry.data.status==='published').map(entry=>({
    href:`/blog/${entry.data.slug}/`, title:entry.data.title, description:entry.data.description,
    kind:'guide' as const, topics:[...entry.data.categories,...entry.data.tags],
  }))];
}

export function isSpokeRoute(path:string): boolean {
  return calculatorSpokes.some(spoke=>spoke.href===path) || /^\/blog\/[^/]+\/$/.test(path);
}

export function relatedSpokes(path:string, spokes:Spoke[], limit=6): Spoke[] {
  const current=spokes.find(spoke=>spoke.href===path);
  if(!current)return [];
  const terms=(text:string)=>new Set(text.toLowerCase().match(/[a-z0-9]+/g)?.filter(word=>word.length>3)??[]);
  const currentTerms=terms(current.title+' '+current.topics.join(' '));
  const score=(spoke:Spoke)=>spoke.topics.filter(topic=>current.topics.includes(topic)).length*4
    + [...terms(spoke.title+' '+spoke.topics.join(' '))].filter(word=>currentTerms.has(word)).length;
  const candidates=spokes.filter(spoke=>spoke.href!==path);
  const ranked=(kind:Spoke['kind'])=>candidates.filter(spoke=>spoke.kind===kind).sort((a,b)=>score(b)-score(a)||a.href.localeCompare(b.href));
  const tools=ranked('calculator').slice(0,2);
  return [...tools,...ranked('guide').slice(0,Math.max(0,limit-tools.length))].slice(0,limit);
}
