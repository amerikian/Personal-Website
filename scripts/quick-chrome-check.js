/**
 * Quick Chrome-specific visual check
 */
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  console.log('\n=== EXPERTISE CARDS CHECK ===');
  await page.locator('#expertise').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  const expertiseCards = await page.$$('.expertise-card');
  console.log(`Expertise cards: ${expertiseCards.length}`);
  
  for (let i = 0; i < expertiseCards.length; i++) {
    const card = expertiseCards[i];
    const box = await card.boundingBox();
    const visible = await card.isVisible();
    const title = await card.$eval('h3', el => el.textContent).catch(() => 'N/A');
    console.log(`  ${i+1}. "${title.trim()}" - visible: ${visible}, size: ${box ? `${Math.round(box.width)}x${Math.round(box.height)}` : 'null'}`);
  }

  console.log('\n=== TECH ICONS CHECK ===');
  await page.locator('.tech-stack-section').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  const techIcons = await page.$$('#tech-orbit .tech-icon');
  console.log(`Tech icons: ${techIcons.length}`);
  
  if (techIcons.length > 0) {
    for (let i = 0; i < Math.min(5, techIcons.length); i++) {
      const icon = techIcons[i];
      const box = await icon.boundingBox();
      const label = await icon.$eval('.tech-label', el => el.textContent).catch(() => 'N/A');
      console.log(`  ${i+1}. "${label}" - size: ${box ? `${Math.round(box.width)}x${Math.round(box.height)}` : 'null'}`);
    }
  }

  console.log('\n=== COMPUTED STYLES CHECK ===');
  const cssIssues = await page.evaluate(() => {
    const issues = [];
    
    // Check expertise cards
    document.querySelectorAll('.expertise-card').forEach((card, i) => {
      const style = window.getComputedStyle(card);
      if (style.display === 'none') issues.push(`expertise-card ${i+1}: display none`);
      if (style.visibility === 'hidden') issues.push(`expertise-card ${i+1}: visibility hidden`);
      if (parseFloat(style.opacity) < 0.1) issues.push(`expertise-card ${i+1}: opacity ${style.opacity}`);
    });
    
    // Check tech icons
    document.querySelectorAll('#tech-orbit .tech-icon').forEach((icon, i) => {
      const style = window.getComputedStyle(icon);
      if (style.display === 'none') issues.push(`tech-icon ${i+1}: display none`);
    });
    
    // Check expertise grid
    const grid = document.querySelector('.expertise-grid');
    if (grid) {
      const gridStyle = window.getComputedStyle(grid);
      issues.push(`expertise-grid: display=${gridStyle.display}, grid-template-columns=${gridStyle.gridTemplateColumns}`);
    }
    
    // Check tech orbit
    const orbit = document.querySelector('#tech-orbit');
    if (orbit) {
      const orbitStyle = window.getComputedStyle(orbit);
      issues.push(`tech-orbit: display=${orbitStyle.display}, children=${orbit.children.length}`);
    }
    
    return issues;
  });
  
  cssIssues.forEach(issue => console.log(`  ${issue}`));

  // Take screenshots
  const fs = require('fs');
  const path = require('path');
  const outDir = path.join(process.cwd(), 'artifacts', 'chrome-check');
  fs.mkdirSync(outDir, { recursive: true });
  
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(outDir, 'full.png'), fullPage: true });
  console.log(`\nScreenshot saved to ${outDir}/full.png`);

  await browser.close();
})();
