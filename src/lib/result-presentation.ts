/** Display-only rounding. Calculator engines retain their original precision. */
import{parseNumber}from'../calculators/rectifier.ts';
export function formatResult(value:number,locale='en-US'):string {
 if(value!==0&&Math.abs(value)<0.0005)return (value>0?'<':'>-')+new Intl.NumberFormat(locale+'-u-nu-latn',{maximumFractionDigits:3}).format(0.001);
 return new Intl.NumberFormat(locale+'-u-nu-latn',{maximumFractionDigits:3}).format(Object.is(value,-0)?0:value);
}
export function readDecimalInput(raw:string,min:number,max:number):number{
 const normalized=raw.trim().replace(/[\u0660-\u0669]/g,c=>String(c.charCodeAt(0)-0x660)).replace(/[\u06f0-\u06f9]/g,c=>String(c.charCodeAt(0)-0x6f0)).replace('٫','.').replace(',','.');
 const n=parseNumber(normalized,'Input');if(n<min||n>max)throw Error('range');return n;
}
export function metricLabel(label:string,mode:string):string{
 if(mode!=='regulated')return label;
 return ({'Input power':'Input power at minimum DC input','Estimated stage loss':'Stage loss at minimum DC input','Stage efficiency':'Stage efficiency at minimum DC input'} as Record<string,string>)[label]??label;
}
