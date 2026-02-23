const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
  
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  
  console.log('\n=== NAV LINKS ===');
  const navLinks = await page.$$('.nav-link');
  console.log('Count:', navLinks.length);
  
  for (const link of navLinks) {
    const text = await link.textContent();
    const visible = await link.isVisible();
    const box = await link.boundingBox();
    console.log(`  "${text.trim()}" | visible: ${visible} | box: ${box ? 'yes' : 'null'}`);
  }
  
  console.log('\n=== EXPERTISE CARDS ===');
  const expertiseCards = await page.$$('.expertise-card');
  console.log('Count:', expertiseCards.length);
  for (let i = 0; i < expertiseCards.length; i++) {
    const card = expertiseCards[i];
    const visible = await card.isVisible();
    const box = await card.boundingBox();
    const title = await card.$eval('h3', el => el.textContent).catch(() => 'N/A');
    console.log(`  ${i+1}. "${title}" | visible: ${visible} | size: ${box ? Math.round(box.width) + 'x' + Math.round(box.height) : 'null'}`);
  }
  
  console.log('\n=== TECH ICONS ===');
  const techIcons = await page.$$('#tech-orbit .tech-icon');
  console.log('Count:', techIcons.length);
  for (let i = 0; i < Math.min(5, techIcons.length); i++) {
    const icon = techIcons[i];
    const visible = await icon.isVisible();
    const label = await icon.$eval('.tech-label', el => el.textContent).catch(() => 'N/A');
    console.log(`  ${i+1}. "${label}" | visible: ${visible}`);
  }
  
  console.log('\n=== PAGE SCREENSHOT ===');
  const fs = require('fs');
  const path = require('path');
  const outDir = path.join(process.cwd(), 'artifacts', 'chrome-test');
  fs.mkdirSync(outDir, { recursive: true });
  await page.screenshot({ path: path.join(outDir, 'chrome-full.png'), fullPage: true });
  console.log('Saved to:', path.join(outDir, 'chrome-full.png'));
  
  await browser.close();
})();
