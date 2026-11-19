import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
const calculate='[data-workbench-form] button[type=submit]';
test.beforeEach(async({page})=>{await page.context().addCookies([{name:'site_language',value:'en',url:process.env.BROWSER_BASE_URL||'http://127.0.0.1:4321'}]);await page.route(/google-analytics\.com|googletagmanager\.com/,route=>route.abort());});
test('default submit survives, inputs invalidate results and reset restores the example',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('/');
 await page.locator(calculate).click();await expect(page.locator('.metric-grid')).toContainText('15.070563 V');await expect(page.locator('#wb-error')).toBeHidden();
 await expect(page.locator('[data-wave-output]')).not.toHaveAttribute('d','');
 await page.locator('#wb-current').fill('0.2');await expect(page.locator('.metric-grid')).toContainText('Inputs changed');
 await page.locator(calculate).click();await expect(page.locator('.metric-grid')).toContainText('14.570563 V');
 await page.locator('button[type=reset]').click();await expect(page.locator('.metric-grid')).toContainText('15.070563 V');expect(errors).toEqual([]);
});
test('all rectifier paths, ideal averages and resistance filter run in the browser',async({page})=>{
 await page.goto('/');await page.locator('#wb-mode').selectOption('basic');await page.locator('#wb-diode').fill('0');
 for(const [topology,average]of [['bridge','10.803796 V'],['center-tapped','10.803796 V'],['half-wave','5.4018979 V']]){
  await page.locator('#wb-topology').selectOption(topology);await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeHidden();await expect(page.locator('.metric-grid')).toContainText(average);await expect(page.locator(`[data-circuit="${topology}"]`)).toBeVisible();
 }
 await page.locator('#wb-topology').selectOption('center-tapped');await expect(page.locator('[data-rms-label]')).toContainText('per half-secondary');
 await page.locator('#wb-mode').selectOption('filtered');await page.locator('#wb-load-mode').selectOption('resistance');await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeHidden();await expect(page.locator('.metric-grid')).toContainText('Average load current');
});
test('linear and switching stages distinguish DC input and reject insufficient headroom',async({page})=>{
 await page.goto('/');await page.locator('#wb-mode').selectOption('regulated');await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeHidden();await expect(page.locator('[data-circuit="regulated"]')).toBeVisible();await expect(page.locator('[data-circuit-filter]')).toBeHidden();
 await expect(page.locator('[data-waveform]')).toHaveAttribute('aria-label','Minimum input and conditional regulated DC output levels');
 await page.locator('#wb-regulator').selectOption('switching');await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeHidden();await expect(page.locator('[data-wave-caption]')).toContainText('not modeled');
 await page.locator('#wb-input').fill('6');await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeVisible();await expect(page.locator('.metric-grid')).not.toContainText('15.070563');
});
test('invalid numbers are rejected without stale results',async({page})=>{
 await page.goto('/');for(const value of ['-1','','1001']){await page.locator('#wb-rms').fill(value);await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeVisible();await expect(page.locator('#wb-rms')).toHaveAttribute('aria-invalid','true');await expect(page.locator('[data-wave-output]')).toHaveAttribute('d','');}
});
for(const width of [390,768,1365])test(`responsive homepage, navigation and accessibility at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/');await expect(page.locator('h1')).toHaveText('AC to DC Converter & Calculator');await expect(page.locator('.header .brand')).toHaveText('AC to DC Converter');
 await expect(page).toHaveTitle('AC to DC Converter Calculator – Convert AC Voltage to DC');await expect(page.locator('.header nav a').first()).toHaveAttribute('href','#calculator');
 const form=await page.locator('[data-workbench-form]').boundingBox(),diagram=await page.locator('.interactive-circuit').boundingBox();expect(form).not.toBeNull();expect(diagram).not.toBeNull();expect(form!.y).toBeLessThan(650);if(width<851)expect(form!.y).toBeLessThan(diagram!.y);else expect(Math.abs(form!.y-diagram!.y)).toBeLessThan(4);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('.language-switcher').scrollIntoViewIfNeeded();const accessibility=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(accessibility.violations).toEqual([]);await page.evaluate(()=>scrollTo(0,0));
 await mkdir('artifacts',{recursive:true});await page.screenshot({path:`artifacts/master-home-${width}.png`,fullPage:false});
});
test('all languages retain their own canonical, brand and functional calculator',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const lang of ['en','hi','es','ru','fr','de','it','pt','bn','ja','ko','ms','pl','id','ar','bg','tr','sv']){
  const path=lang==='en'?'/':`/${lang}/`;await page.goto(path);await expect(page.locator('html')).toHaveAttribute('lang',lang);await expect(page.locator('.header .brand')).toHaveText('AC to DC Converter');await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',`https://actodcconverter.org${path}`);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeHidden();await expect(page.locator('[data-wave-output]')).not.toHaveAttribute('d','');
  await page.locator('#wb-mode').selectOption('regulated');await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeHidden();await expect(page.locator('[data-waveform]')).toHaveAttribute('aria-label',await page.locator('[data-wave-label-dc]').textContent()||'');
 }
});
test('without JavaScript the explanatory default and crawlable alternatives remain',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const base=process.env.BROWSER_BASE_URL||'http://127.0.0.1:4321';await context.addCookies([{name:'site_language',value:'en',url:base}]);const page=await context.newPage();await page.goto(base);await expect(page.locator('noscript .notice')).toBeVisible();await expect(page.locator('noscript .notice')).toContainText('JavaScript is required');await expect(page.locator('.metric-grid')).toContainText('15.070563 V');await expect(page.locator('.language-switcher a')).toHaveCount(18);await context.close();
});
