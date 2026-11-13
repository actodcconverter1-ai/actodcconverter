import {canonical} from '../config/seo.config.ts';
import {calculatorSpokes} from './topic-graph.ts';
export interface BreadcrumbItem {label:string;href?:string;}
export function breadcrumbsForPath(path:string,title:string):BreadcrumbItem[] {
  if(path==='/')return [];
  const home:BreadcrumbItem={label:'Home',href:'/'};
  if(path==='/blog/')return [home,{label:'Guides'}];
  if(path.startsWith('/blog/')||path.startsWith('/category/'))return [home,{label:'Guides',href:'/blog/'},{label:title}];
  if(path==='/calculators/')return [home,{label:'Calculators'}];
  if(calculatorSpokes.some(spoke=>spoke.href===path))return [home,{label:'Calculators',href:'/calculators/'},{label:title}];
  const labels:Record<string,string>={'/about/':'About','/editorial/':'Editorial standards','/contact/':'Contact','/privacy/':'Privacy','/terms/':'Terms','/disclaimer/':'Disclaimer'};
  return [home,{label:labels[path]??title}];
}
export function breadcrumbSchema(items:BreadcrumbItem[],path:string) {
  return {'@type':'BreadcrumbList','@id':canonical(path)+'#breadcrumbs',itemListElement:items.map((item,index)=>({
    '@type':'ListItem',position:index+1,name:item.label,item:canonical(item.href??path),
  }))};
}
