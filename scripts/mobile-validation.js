/**
 * Mobile Visual Validation - Playwright
 * Tests responsive design on multiple mobile viewports
 */

const { chromium, devices } = require('playwright');

const MOBILE_DEVICES = [
    { name: 'iPhone 12', device: devices['iPhone 12'] },
    { name: 'iPhone SE', device: devices['iPhone SE'] },
    { name: 'Pixel 5', device: devices['Pixel 5'] },
    { name: 'iPad', device: devices['iPad (gen 7)'] },
    { name: 'Galaxy S9', device: devices['Galaxy S9+'] }
];

async function runMobileValidation() {
    const browser = await chromium.launch({ headless: true });
    
    console.log('='.repeat(60));
    console.log('MOBILE VISUAL VALIDATION');
    console.log('='.repeat(60));

    const allResults = {};

    for (const { name, device } of MOBILE_DEVICES) {
        console.log(`\n${'─'.repeat(60)}`);
        console.log(`📱 ${name} (${device.viewport.width}x${device.viewport.height})`);
        console.log('─'.repeat(60));

        const context = await browser.newContext({ ...device });
        const page = await context.newPage();

        const issues = [];

        page.on('console', msg => {
            if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('WebGL')) {
                issues.push(`Console error: ${msg.text()}`);
            }
        });

        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        const results = { passed: 0, failed: 0, issues: [] };

        // Navigation (mobile menu)
        const navToggle = await page.locator('.nav-toggle, #nav-toggle').isVisible();
        console.log(`  Nav toggle: ${navToggle ? '✓' : '✗'} visible`);
        if (navToggle) results.passed++; else results.failed++;

        const logo = await page.locator('.nav-logo').isVisible();
        console.log(`  Logo: ${logo ? '✓' : '✗'} visible`);
        if (logo) results.passed++; else results.failed++;

        // Hero Section
        const heroTitle = await page.locator('.hero-title').isVisible();
        console.log(`  Hero title: ${heroTitle ? '✓' : '✗'} visible`);
        if (heroTitle) results.passed++; else results.failed++;

        // Check hero title doesn't overflow
        const heroTitleBox = await page.locator('.hero-title').boundingBox();
        if (heroTitleBox && heroTitleBox.width <= device.viewport.width) {
            console.log(`  Hero title fit: ✓ ${Math.round(heroTitleBox.width)}px`);
            results.passed++;
        } else {
            console.log(`  Hero title fit: ✗ overflows viewport`);
            results.issues.push('Hero title overflows viewport');
            results.failed++;
        }

        // Scroll and check sections
        await page.evaluate(() => document.querySelector('#expertise')?.scrollIntoView());
        await page.waitForTimeout(200);
        
        const expertiseCards = await page.locator('.expertise-card').count();
        console.log(`  Expertise cards: ${expertiseCards}`);
        if (expertiseCards === 8) results.passed++; else results.failed++;

        // Check card width on mobile (should stack)
        const cardBox = await page.locator('.expertise-card').first().boundingBox();
        if (cardBox) {
            const cardFitsScreen = cardBox.width <= device.viewport.width - 20;
            console.log(`  Card responsive: ${cardFitsScreen ? '✓' : '✗'} ${Math.round(cardBox.width)}px`);
            if (cardFitsScreen) results.passed++; else {
                results.failed++;
                results.issues.push(`Card too wide: ${Math.round(cardBox.width)}px`);
            }
        }

        // Products section
        await page.evaluate(() => document.querySelector('#products')?.scrollIntoView());
        await page.waitForTimeout(200);
        
        const productCards = await page.locator('.product-card').count();
        console.log(`  Product cards: ${productCards}`);
        if (productCards >= 3) results.passed++; else results.failed++;

        // Tech icons
        await page.evaluate(() => document.querySelector('#tech-orbit')?.scrollIntoView());
        await page.waitForTimeout(200);
        
        const techIcons = await page.locator('.tech-icon').count();
        console.log(`  Tech icons: ${techIcons}`);
        if (techIcons >= 20) results.passed++; else results.failed++;

        // Contact form
        await page.evaluate(() => document.querySelector('#contact')?.scrollIntoView());
        await page.waitForTimeout(200);
        
        const contactForm = await page.locator('.contact-form').isVisible();
        console.log(`  Contact form: ${contactForm ? '✓' : '✗'} visible`);
        if (contactForm) results.passed++; else results.failed++;

        // Check form inputs are tappable size (min 44px)
        const submitBtn = await page.locator('#contact button[type="submit"]').boundingBox();
        if (submitBtn && submitBtn.height >= 44) {
            console.log(`  Submit btn size: ✓ ${Math.round(submitBtn.height)}px`);
            results.passed++;
        } else {
            console.log(`  Submit btn size: ✗ too small for touch`);
            results.issues.push('Submit button too small for touch');
            results.failed++;
        }

        // Check horizontal scroll (bad on mobile)
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        if (!hasHorizontalScroll) {
            console.log(`  No h-scroll: ✓`);
            results.passed++;
        } else {
            console.log(`  No h-scroll: ✗ page has horizontal scroll`);
            results.issues.push('Page has unwanted horizontal scroll');
            results.failed++;
        }

        results.issues = [...results.issues, ...issues];
        allResults[name] = results;

        await context.close();
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('MOBILE VALIDATION SUMMARY');
    console.log('='.repeat(60));

    let totalPassed = 0;
    let totalFailed = 0;

    for (const [device, results] of Object.entries(allResults)) {
        const status = results.failed === 0 ? '✓' : '✗';
        console.log(`${status} ${device}: ${results.passed} passed, ${results.failed} failed`);
        totalPassed += results.passed;
        totalFailed += results.failed;

        if (results.issues.length > 0) {
            results.issues.forEach(issue => console.log(`    ⚠ ${issue}`));
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`TOTAL: ${totalPassed} passed, ${totalFailed} failed across ${MOBILE_DEVICES.length} devices`);
    console.log('='.repeat(60));

    await browser.close();
}

runMobileValidation().catch(console.error);
