/** Display-only rounding. Calculator engines retain their original precision. */
export function formatResult(value:number):string {
 if(value!==0&&Math.abs(value)<0.0005)return value>0?'<0.001':'>-0.001';
 return new Intl.NumberFormat('en-US',{maximumFractionDigits:3}).format(Object.is(value,-0)?0:value);
}
