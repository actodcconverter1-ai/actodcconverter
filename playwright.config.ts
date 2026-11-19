import {defineConfig} from '@playwright/test';
const baseURL=process.env.BROWSER_BASE_URL||'http://127.0.0.1:4321';
export default defineConfig({
 testDir:'./tests/browser',fullyParallel:false,workers:1,timeout:45000,
 reporter:[['list'],['json',{outputFile:'artifacts/browser-results.json'}]],
 use:{baseURL,headless:true,trace:'retain-on-failure',launchOptions:process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{}},
 webServer:process.env.BROWSER_BASE_URL?undefined:{command:'node node_modules/astro/bin/astro.mjs preview --host 127.0.0.1 --port 4321',url:baseURL,reuseExistingServer:!process.env.CI,timeout:90000},
});
