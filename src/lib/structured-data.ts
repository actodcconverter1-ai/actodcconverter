import {canonical} from '../config/seo.config.ts';
export function serializeJsonLd(value:unknown):string {
  return JSON.stringify(value).replaceAll('<','\\u003c');
}
export const editorialId=canonical('/editorial/')+'#organization';
export function webApplication(path:string,name:string,description:string,features:string[],fragment='calculator') {
  return {'@type':'WebApplication','@id':canonical(path)+'#application',name,description,url:canonical(path)+'#'+fragment,
    applicationCategory:'UtilitiesApplication',operatingSystem:'Any',browserRequirements:'JavaScript is required for new calculations.',
    isAccessibleForFree:true,featureList:features,isPartOf:{'@id':canonical(path)+'#webpage'},publisher:{'@id':editorialId}};
}
export function techArticle(path:string,title:string,description:string,extra:Record<string,unknown>={}) {
  return {'@type':'TechArticle','@id':canonical(path)+'#article',headline:title,description,
    mainEntityOfPage:{'@id':canonical(path)+'#webpage'},author:{'@id':editorialId},publisher:{'@id':editorialId},
    inLanguage:'en',...extra};
}
export function faqPage(path:string,questions:readonly (readonly [string,string])[]) {
  return {'@type':'FAQPage','@id':canonical(path)+'#faq',url:canonical(path)+'#faq',
    mainEntity:questions.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))};
}
