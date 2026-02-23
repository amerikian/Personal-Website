/**
 * Deep Visual Assessment Script
 * Comprehensive check of all sections and elements
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const issues = [];

function log(msg) {
  console.log(msg);
}

function issue(severity, section, description) {
  issues.push({ severity, section, description });
  console.log(`[${severity.toUpperCase()}] ${section}: ${description}`);
}

(async () => {
  const outDir = path.join(process.cwd(), 'artifacts', 'visual-assessment');
  fs.mkdirSync(outDir, { recursive: true });

  log('Starting deep visual assessment...\n');

  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ 
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  // Enable console logging from page
  page.on('console', msg => {
    if (msg.type() === 'error') {
      issue('error', 'Console', msg.text());
    }
  });

  page.on('pageerror', err => {
    issue('error', 'JavaScript', err.message);
  });

  try {
    log('Loading page...');
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000); // Let animations settle

    // =====================
    // SECTION 1: NAVIGATION
    // =====================
    log('\n=== NAVIGATION ===');
    const navItems = await page.locator('.nav-link').all();
    log(`Nav items found: ${navItems.length}`);
    for (const item of navItems) {
      const text = await item.textContent();
      const isVisible = await item.isVisible();
      if (!isVisible) issue('warning', 'Navigation', `Nav item "${text}" not visible`);
    }
    await page.screenshot({ path: path.join(outDir, '01-navigation.png') });

    // =====================
    // SECTION 2: HERO
    // =====================
    log('\n=== HERO SECTION ===');
    const heroTitle = await page.locator('.hero-title').first();
    if (await heroTitle.count() === 0) {
      issue('error', 'Hero', 'Hero title not found');
    } else {
      const heroText = await heroTitle.textContent();
      log(`Hero title: ${heroText}`);
    }
    
    const heroStats = await page.locator('.hero-stats .stat-item').all();
    log(`Hero stats found: ${heroStats.length}`);
    for (const stat of heroStats) {
      const number = await stat.locator('.stat-number').textContent();
      const label = await stat.locator('.stat-label').textContent();
      log(`  - ${number} ${label}`);
    }
    await page.screenshot({ path: path.join(outDir, '02-hero.png') });

    // =====================
    // SECTION 3: JOURNEY/TIMELINE
    // =====================
    log('\n=== JOURNEY SECTION ===');
    await page.locator('#journey').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const timelineItems = await page.locator('.timeline-item').all();
    log(`Timeline items found: ${timelineItems.length}`);
    if (timelineItems.length === 0) {
      issue('error', 'Journey', 'No timeline items rendered');
    }
    for (let i = 0; i < timelineItems.length; i++) {
      const item = timelineItems[i];
      const isVisible = await item.isVisible();
      const title = await item.locator('.timeline-title').first().textContent().catch(() => 'N/A');
      if (!isVisible) {
        issue('warning', 'Journey', `Timeline item ${i + 1} "${title}" not visible`);
      } else {
        log(`  - ${title}`);
      }
    }
    await page.screenshot({ path: path.join(outDir, '03-journey.png') });

    // =====================
    // SECTION 4: EXPERTISE
    // =====================
    log('\n=== EXPERTISE SECTION ===');
    await page.locator('#expertise').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const expertiseCards = await page.locator('.expertise-card').all();
    log(`Expertise cards found: ${expertiseCards.length}`);
    if (expertiseCards.length === 0) {
      issue('error', 'Expertise', 'No expertise cards rendered');
    }
    
    for (let i = 0; i < expertiseCards.length; i++) {
      const card = expertiseCards[i];
      const isVisible = await card.isVisible();
      const boundingBox = await card.boundingBox();
      const title = await card.locator('h3').first().textContent().catch(() => 'N/A');
      
      if (!isVisible) {
        issue('error', 'Expertise', `Card ${i + 1} "${title}" not visible`);
      } else if (!boundingBox || boundingBox.width < 50 || boundingBox.height < 50) {
        issue('error', 'Expertise', `Card ${i + 1} "${title}" has invalid size: ${JSON.stringify(boundingBox)}`);
      } else {
        log(`  - ${title} (${Math.round(boundingBox.width)}x${Math.round(boundingBox.height)})`);
      }

      // Check for icon
      const icon = await card.locator('.card-icon i').first();
      if (await icon.count() === 0) {
        issue('warning', 'Expertise', `Card "${title}" missing icon`);
      }
      
      // Check skill bar
      const skillBar = await card.locator('.skill-bar').first();
      if (await skillBar.count() > 0) {
        const skillValue = await skillBar.getAttribute('data-skill');
        log(`    Skill level: ${skillValue}%`);
      }
    }
    await page.screenshot({ path: path.join(outDir, '04-expertise.png') });

    // =====================
    // SECTION 5: PRODUCTS
    // =====================
    log('\n=== PRODUCTS SECTION ===');
    await page.locator('#products').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const productCards = await page.locator('.product-card').all();
    log(`Product cards found: ${productCards.length}`);
    if (productCards.length === 0) {
      issue('error', 'Products', 'No product cards rendered');
    }
    
    for (let i = 0; i < productCards.length; i++) {
      const card = productCards[i];
      const isVisible = await card.isVisible();
      const title = await card.locator('.product-title').first().textContent().catch(() => 'N/A');
      const boundingBox = await card.boundingBox();
      
      if (!isVisible) {
        issue('error', 'Products', `Product "${title}" not visible`);
      } else if (!boundingBox || boundingBox.width < 100) {
        issue('error', 'Products', `Product "${title}" has invalid width`);
      } else {
        log(`  - ${title}`);
      }
    }
    await page.screenshot({ path: path.join(outDir, '05-products.png') });

    // =====================
    // SECTION 6: ASSESSMENT
    // =====================
    log('\n=== ASSESSMENT SECTION ===');
    await page.locator('#assessment').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const assessmentCards = await page.locator('.assessment-card').all();
    log(`Assessment cards found: ${assessmentCards.length}`);
    if (assessmentCards.length === 0) {
      issue('error', 'Assessment', 'No assessment cards rendered');
    }
    
    for (let i = 0; i < assessmentCards.length; i++) {
      const card = assessmentCards[i];
      const isVisible = await card.isVisible();
      const boundingBox = await card.boundingBox();
      
      // Try to get card title
      const titleEl = await card.locator('h4, .assessment-title, h3').first();
      const title = await titleEl.textContent().catch(() => `Card ${i + 1}`);
      
      if (!isVisible) {
        issue('error', 'Assessment', `Card "${title}" not visible`);
      } else if (!boundingBox || boundingBox.height < 20) {
        issue('error', 'Assessment', `Card "${title}" has collapsed height: ${boundingBox?.height}px`);
      } else {
        log(`  - ${title.trim()} (height: ${Math.round(boundingBox.height)}px)`);
      }
    }
    await page.screenshot({ path: path.join(outDir, '06-assessment.png') });

    // =====================
    // SECTION 7: GLOBAL/GLOBE
    // =====================
    log('\n=== GLOBAL SECTION ===');
    await page.locator('#global').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Globe needs time to render
    
    const globeContainer = await page.locator('#globe-container').first();
    if (await globeContainer.count() === 0) {
      issue('error', 'Global', 'Globe container not found');
    } else {
      const globeBox = await globeContainer.boundingBox();
      const canvas = await globeContainer.locator('canvas').first();
      if (await canvas.count() === 0) {
        issue('error', 'Global', 'Globe canvas not rendered');
      } else {
        log(`Globe rendered (${globeBox?.width}x${globeBox?.height})`);
      }
    }
    
    const locationCards = await page.locator('.location-card').all();
    log(`Location cards found: ${locationCards.length}`);
    await page.screenshot({ path: path.join(outDir, '07-global.png') });

    // =====================
    // SECTION 8: TECH UNIVERSE
    // =====================
    log('\n=== TECH UNIVERSE SECTION ===');
    await page.locator('.tech-stack-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const techOrbit = await page.locator('#tech-orbit').first();
    const techIcons = await techOrbit.locator('.tech-icon').all();
    log(`Tech icons found: ${techIcons.length}`);
    
    if (techIcons.length === 0) {
      issue('error', 'Tech Universe', 'No tech icons rendered');
    } else {
      for (let i = 0; i < Math.min(techIcons.length, 5); i++) {
        const icon = techIcons[i];
        const label = await icon.locator('.tech-label').textContent().catch(() => 'N/A');
        const boundingBox = await icon.boundingBox();
        if (!boundingBox || boundingBox.width < 50) {
          issue('warning', 'Tech Universe', `Icon "${label}" has small width`);
        }
        log(`  - ${label}`);
      }
      if (techIcons.length > 5) {
        log(`  ... and ${techIcons.length - 5} more`);
      }
    }
    await page.screenshot({ path: path.join(outDir, '08-tech-universe.png') });

    // =====================
    // SECTION 9: CONTACT
    // =====================
    log('\n=== CONTACT SECTION ===');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const contactItems = await page.locator('.contact-item').all();
    log(`Contact items found: ${contactItems.length}`);
    
    const contactForm = await page.locator('.contact-form, form').first();
    if (await contactForm.count() === 0) {
      issue('warning', 'Contact', 'Contact form not found');
    }
    await page.screenshot({ path: path.join(outDir, '09-contact.png') });

    // =====================
    // FULL PAGE SCREENSHOT
    // =====================
    log('\n=== FULL PAGE SCREENSHOT ===');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '00-full-page.png'), fullPage: true });

    // =====================
    // CSS COMPUTED STYLES CHECK
    // =====================
    log('\n=== CSS VALIDATION ===');
    
    // Check if any elements have display:none or visibility:hidden unexpectedly
    const hiddenElements = await page.evaluate(() => {
      const sections = ['#journey', '#expertise', '#products', '#assessment', '#global', '.tech-stack-section', '#contact'];
      const hidden = [];
      
      sections.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
          const style = window.getComputedStyle(el);
          if (style.display === 'none') {
            hidden.push({ selector, issue: 'display: none' });
          }
          if (style.visibility === 'hidden') {
            hidden.push({ selector, issue: 'visibility: hidden' });
          }
          if (parseFloat(style.opacity) === 0) {
            hidden.push({ selector, issue: 'opacity: 0' });
          }
          if (parseFloat(style.height) === 0 && style.overflow === 'hidden') {
            hidden.push({ selector, issue: 'height: 0 with overflow: hidden' });
          }
        }
      });
      
      return hidden;
    });
    
    hiddenElements.forEach(h => {
      issue('error', 'CSS', `${h.selector} has ${h.issue}`);
    });

    // Check Font Awesome loading
    const fontAwesomeLoaded = await page.evaluate(() => {
      const testIcon = document.querySelector('.fas, .fab, .fa');
      if (!testIcon) return 'no-icons-found';
      const style = window.getComputedStyle(testIcon, '::before');
      return style.fontFamily.includes('Font Awesome') || style.fontFamily.includes('FontAwesome') ? 'loaded' : 'not-loaded';
    });
    log(`Font Awesome: ${fontAwesomeLoaded}`);
    if (fontAwesomeLoaded === 'not-loaded') {
      issue('error', 'Fonts', 'Font Awesome not loading properly');
    }

    // =====================
    // SUMMARY
    // =====================
    log('\n' + '='.repeat(50));
    log('VISUAL ASSESSMENT SUMMARY');
    log('='.repeat(50));
    
    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');
    
    log(`Total issues: ${issues.length}`);
    log(`  Errors: ${errors.length}`);
    log(`  Warnings: ${warnings.length}`);
    
    if (errors.length > 0) {
      log('\nERRORS:');
      errors.forEach((e, i) => log(`  ${i + 1}. [${e.section}] ${e.description}`));
    }
    
    if (warnings.length > 0) {
      log('\nWARNINGS:');
      warnings.forEach((w, i) => log(`  ${i + 1}. [${w.section}] ${w.description}`));
    }
    
    log(`\nScreenshots saved to: ${outDir}`);

  } catch (err) {
    console.error('Assessment failed:', err);
    issue('error', 'Script', err.message);
  } finally {
    await browser.close();
  }

  // Exit with error code if issues found
  process.exit(issues.filter(i => i.severity === 'error').length > 0 ? 1 : 0);
})();
