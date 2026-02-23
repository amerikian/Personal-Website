const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.join(process.cwd(), 'artifacts', 'screenshots');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 2200 } });
  const page = await desktop.newPage();
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle', timeout: 60000 });

  await page.waitForSelector('#hero', { timeout: 15000 });
  await page.waitForSelector('#assessment', { timeout: 15000 });
  await page.waitForSelector('#global', { timeout: 15000 });

  const checks = [
    ['Assessment title', await page.locator('#assessment .section-title').first().textContent()],
    ['Verification badge', await page.locator('.assessment-verified').first().textContent()],
    ['Updated stamp', await page.locator('.assessment-updated').first().textContent()],
    ['Hero title', await page.locator('#hero .hero-title').first().textContent()],
  ];

  await page.screenshot({ path: path.join(outDir, 'desktop-full.png'), fullPage: true });
  await page.locator('#assessment').screenshot({ path: path.join(outDir, 'desktop-assessment.png') });

  const mobileCtx = await browser.newContext({ ...devices['iPhone 14'] });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle', timeout: 60000 });
  await mobilePage.waitForSelector('#assessment', { timeout: 15000 });
  await mobilePage.screenshot({ path: path.join(outDir, 'mobile-full.png'), fullPage: true });
  await mobilePage.locator('#assessment').screenshot({ path: path.join(outDir, 'mobile-assessment.png') });

  console.log('VISUAL_CHECK_OK');
  for (const [label, value] of checks) {
    console.log(`${label}: ${(value || '').replace(/\s+/g, ' ').trim()}`);
  }
  console.log(`Screenshots saved in: ${outDir}`);

  await mobileCtx.close();
  await desktop.close();
  await browser.close();
})();
