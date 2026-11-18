import type {CollectionEntry} from 'astro:content';
import {calculatorSpokes} from './topic-graph.ts';
export function siteDirectory(entries:CollectionEntry<'blog'>[]) {
 entries=entries.filter(p=>p.data.status==='published');
 const pages=[
  {href:'/',title:'AC to DC converter hub',description:'Circuit overview, formulas and calculator models.'},
  {href:'/calculators/',title:'Calculator directory',description:'Choose a rectifier, filter or regulator model.'},
  ...calculatorSpokes,
  {href:'/blog/',title:'Technical guides',description:'Browse explanations and worked examples.'},
  ...entries.filter(p=>p.data.status==='published').map(p=>({href:'/blog/'+p.data.slug+'/',title:p.data.title,description:p.data.description})),
  ...[...new Set(entries.flatMap(p=>p.data.categories))].sort().map(c=>({href:'/category/'+c+'/',title:c.replaceAll('-',' '),description:'Topic reading paths and related technical guides.'})),
  ...[
   ['about','About us','Purpose, project history and publishing identity.'],
   ['authors','Authors and editorial team','Who publishes the content and what review is claimed.'],
   ['editorial','Editorial standards','Sources, validation, assistance and correction policy.'],
   ['contact','Contact','Send a private question or reproducible correction.'],
   ['privacy','Privacy','How this website handles information.'],
   ['terms','Terms','Terms for using the educational tools.'],
   ['disclaimer','Disclaimer','Model scope and limitations.'],
   ['sitemap','HTML sitemap','Find every public section of the website.'],
   ['search','Site search','Search calculators, articles and information pages.'],
  ].map(([slug,title,description])=>({href:'/'+slug+'/',title,description})),
 ];
 return pages;
}
