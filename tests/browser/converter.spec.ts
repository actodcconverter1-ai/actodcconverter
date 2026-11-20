import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
const calculate='[data-workbench-form] button[type=submit]';
test('rendered diode threshold, ripple boundary and zero-power regulator cases are explicit',async({page})=>{await page.goto('/ac-to-dc-calculator/');await page.locator('#wb-mode').selectOption('basic');await page.locator('#wb-rms').fill('0.1');await page.locator(calculate).click();await expect(page.locator('.metric-grid dd').first()).toHaveText('0 V');await page.locator('#wb-rms').fill('12');await page.locator('#wb-mode').selectOption('filtered');const boundary=.2*(12*Math.SQRT2-1.4)*100*.001;await page.locator('#wb-current').fill(String(boundary));await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeHidden();await page.locator('#wb-current').fill(String(boundary*1.00001));await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeVisible();await page.locator('#wb-mode').selectOption('regulated');await page.locator('#wb-output-current').fill('0');await page.locator('#wb-quiescent').fill('0');await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeHidden();await expect(page.locator('.metric-grid')).toContainText('Stage efficiency at minimum DC input');await expect(page.locator('.metric-grid')).toContainText('Not defined');});
test('60 Hz result, ripple guardrail and valid recovery render correctly',async({page})=>{await page.goto('/ac-to-dc-calculator/');await page.locator('#wb-frequency').fill('60');await page.locator(calculate).click();await expect(page.locator('.metric-grid')).toContainText('15.154 V');await expect(page.locator('.metric-grid')).toContainText('0.833 V');await page.locator('#wb-capacitance').fill('1');await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeVisible();await expect(page.locator('[data-wave-output]')).toHaveAttribute('d','');await page.locator('#wb-capacitance').fill('1000');await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeHidden();await expect(page.locator('.metric-grid')).toContainText('15.154 V');});
for(const lang of['fr','de','ar'])test(`localized decimal entry, minimum-input labels and mobile layout: ${lang}`,async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto(`/${lang}/ac-to-dc-calculator/`);await page.locator('#wb-rms').fill(lang==='ar'?'١٢٫٥':'12,5');await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeHidden();const expected=new Intl.NumberFormat(lang+'-u-nu-latn',{maximumFractionDigits:3}).format(12.5*Math.SQRT2-1.4-.5);await expect(page.locator('.metric-grid dd').first()).toContainText(expected);await page.locator('#wb-mode').selectOption('regulated');await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeHidden();const accessibility=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(accessibility.violations).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);if(lang==='ar'){await expect(page.locator('html')).toHaveAttribute('dir','rtl');await page.screenshot({path:'artifacts/focused-ar-mobile.png',fullPage:false});}});
test('language switcher retains the calculator and published guide routes',async({page})=>{for(const path of['/ac-to-dc-calculator/','/blog/rectifier-ripple-frequency/']){await page.goto(path);await page.locator('.language-switcher a[data-language=fr]').click();await expect(page).toHaveURL(new RegExp('/fr'+path+'$'));await page.locator('.language-switcher a[data-language=de]').click();await expect(page).toHaveURL(new RegExp('/de'+path+'$'));}});
test.beforeEach(async({page})=>{await page.context().addCookies([{name:'site_language',value:'en',url:process.env.BROWSER_BASE_URL||'http://127.0.0.1:4321'}]);await page.route(/google-analytics\.com|googletagmanager\.com/,route=>route.abort());});
test('default submit survives, inputs invalidate results and reset restores the example',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('/');
 await page.locator(calculate).click();await expect(page.locator('.metric-grid')).toContainText('15.071 V');await expect(page.locator('#wb-error')).toBeHidden();
 await expect(page.locator('[data-wave-output]')).not.toHaveAttribute('d','');
 await page.locator('#wb-current').fill('0.2');await expect(page.locator('.metric-grid')).toContainText('Inputs changed');
 await page.locator(calculate).click();await expect(page.locator('.metric-grid')).toContainText('14.571 V');
 await page.locator('button[type=reset]').click();await expect(page.locator('.metric-grid')).toContainText('15.071 V');expect(errors).toEqual([]);
});
test('all rectifier paths, ideal averages and resistance filter run in the browser',async({page})=>{
 await page.goto('/');await page.locator('#wb-mode').selectOption('basic');await page.locator('#wb-diode').fill('0');
 for(const [topology,average]of [['bridge','10.804 V'],['center-tapped','10.804 V'],['half-wave','5.402 V']]){
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
 await page.setViewportSize({width,height:900});await page.goto('/');await expect(page.locator('h1')).toHaveText('AC to DC Converter: Calculator, Circuits and How It Works');await expect(page.locator('.header .brand')).toHaveText('AC to DC Converter');
 await expect(page).toHaveTitle('AC to DC Converter: How It Works, Circuits & Formulas');await expect(page.locator('.header nav a').first()).toHaveAttribute('href','/calculators/');
 const form=await page.locator('[data-workbench-form]').boundingBox(),diagram=await page.locator('.interactive-circuit').boundingBox();expect(form).not.toBeNull();expect(diagram).not.toBeNull();if(width>=851)expect(form!.y).toBeLessThan(850);if(width<851)expect(form!.y).toBeLessThan(diagram!.y);else expect(Math.abs(form!.y-diagram!.y)).toBeLessThan(4);
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
for(const width of[390,768,1365])test(`dedicated calculator remains functional and accessible at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/ac-to-dc-calculator/');await page.locator(calculate).click();await expect(page.locator('#wb-error')).toBeHidden();await expect(page.locator('.metric-grid')).toContainText('15.071 V');await page.locator('.validation-source').scrollIntoViewIfNeeded();
 const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(results.violations).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('without JavaScript the explanatory default and crawlable alternatives remain',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const base=process.env.BROWSER_BASE_URL||'http://127.0.0.1:4321';await context.addCookies([{name:'site_language',value:'en',url:base}]);const page=await context.newPage();await page.goto(base);await expect(page.locator('noscript .notice')).toBeVisible();await expect(page.locator('noscript .notice')).toContainText('JavaScript is required');await expect(page.locator('.metric-grid')).toContainText('15.071 V');await expect(page.locator('.language-switcher a')).toHaveCount(18);await context.close();
});

for(const mode of['full-wave','half-wave'])test(`ideal ${mode} tool has useful examples and preserves calculation and invalid recovery`,async({page})=>{
 await page.goto(`/${mode}-rectifier-calculator/`);await expect(page.locator('[data-money-guide]')).toBeVisible();await expect(page.locator('[data-money-guide] table tbody tr')).toHaveCount(3);
 await expect(page.locator('[data-result]')).toHaveText(mode==='full-wave'?'10.804':'5.402');await page.locator('#ac-rms').fill('24');await page.locator('[data-form] button[type=submit]').click();await expect(page.locator('[data-result]')).toHaveText(mode==='full-wave'?'21.608':'10.804');
 await page.locator('#ac-rms').fill('-1');await page.locator('[data-form] button[type=submit]').click();await expect(page.locator('#calc-error')).toBeVisible();await expect(page.locator('[data-result]')).toHaveText('—');await page.locator('#ac-rms').fill('12');await page.locator('[data-form] button[type=submit]').click();await expect(page.locator('#calc-error')).toBeHidden();
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);const accessibility=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(accessibility.violations).toEqual([]);
 await page.screenshot({path:`artifacts/money-${mode}-mobile.png`});await page.locator('[data-money-guide] a[href="/ac-to-dc-calculator/"]').first().click();await expect(page.locator('[data-converter]')).toBeVisible();
});

test('money-page guidance and directory navigation are present without changing translated content',async({page})=>{
 await page.goto('/ac-to-dc-calculator/');await expect(page.locator('[data-money-guide=main]')).toContainText('15.071 V');await expect(page.locator('[data-money-guide=main]')).toContainText('100 mA is 0.1 A');await page.locator('.header nav a').first().click();await expect(page).toHaveURL(/\/calculators\/$/);await expect(page.locator('[data-money-guide=directory]')).toBeVisible();
 await page.goto('/de/full-wave-rectifier-calculator/');await expect(page.locator('[data-money-guide]')).toHaveCount(0);await expect(page.locator('html')).toHaveAttribute('lang','de');await expect(page.locator('[data-calculator]')).toBeVisible();await expect(page.locator('.language-switcher a')).toHaveCount(18);
});
