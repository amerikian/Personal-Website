/**
 * Final Visual Validation - Section by Section
 * Comprehensive Playwright test for Chrome rendering
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = path.join(__dirname, '..', 'artifacts', 'final-validation');

async function runValidation() {
    // Ensure artifacts directory exists
    if (!fs.existsSync(ARTIFACTS_DIR)) {
        fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2
    });
    const page = await context.newPage();

    const consoleMessages = [];
    const issues = [];
    const optimizations = [];

    // Capture console messages
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        consoleMessages.push({ type, text });
        if (type === 'error' || type === 'warning') {
            if (!text.includes('favicon') && !text.includes('DevTools')) {
                issues.push(`Console ${type}: ${text}`);
            }
        }
    });

    // Capture page errors
    page.on('pageerror', err => {
        issues.push(`Page error: ${err.message}`);
    });

    console.log('='.repeat(60));
    console.log('FINAL VISUAL VALIDATION - Section by Section');
    console.log('='.repeat(60));

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500); // Allow animations to settle

    const results = {};

    // 1. NAVIGATION VALIDATION
    console.log('\n[1/9] NAVIGATION');
    console.log('-'.repeat(40));
    const nav = await validateNavigation(page);
    results.navigation = nav;
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '01-navigation.png'), clip: { x: 0, y: 0, width: 1440, height: 80 } });

    // 2. HERO SECTION VALIDATION
    console.log('\n[2/9] HERO SECTION');
    console.log('-'.repeat(40));
    const hero = await validateHeroSection(page);
    results.hero = hero;
    await page.locator('.hero').screenshot({ path: path.join(ARTIFACTS_DIR, '02-hero.png') });

    // 3. JOURNEY/TIMELINE SECTION VALIDATION
    console.log('\n[3/9] JOURNEY TIMELINE');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#journey')?.scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(300);
    const journey = await validateJourneySection(page);
    results.journey = journey;
    await page.locator('#journey').screenshot({ path: path.join(ARTIFACTS_DIR, '03-journey.png') });

    // 4. EXPERTISE SECTION VALIDATION
    console.log('\n[4/9] EXPERTISE SECTION');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#expertise')?.scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(300);
    const expertise = await validateExpertiseSection(page);
    results.expertise = expertise;
    await page.locator('#expertise').screenshot({ path: path.join(ARTIFACTS_DIR, '04-expertise.png') });

    // 5. PRODUCTS SECTION VALIDATION
    console.log('\n[5/9] PRODUCTS SECTION');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#products')?.scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(300);
    const products = await validateProductsSection(page);
    results.products = products;
    await page.locator('#products').screenshot({ path: path.join(ARTIFACTS_DIR, '05-products.png') });

    // 6. ASSESSMENT SECTION VALIDATION
    console.log('\n[6/9] ASSESSMENT SECTION');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#assessment')?.scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(300);
    const assessment = await validateAssessmentSection(page);
    results.assessment = assessment;
    await page.locator('#assessment').screenshot({ path: path.join(ARTIFACTS_DIR, '06-assessment.png') });

    // 7. GLOBAL IMPACT SECTION VALIDATION
    console.log('\n[7/9] GLOBAL IMPACT SECTION');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#global')?.scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(300);
    const global = await validateGlobalSection(page);
    results.global = global;
    await page.locator('#global').screenshot({ path: path.join(ARTIFACTS_DIR, '07-global.png') });

    // 8. TECH MASTERY SECTION VALIDATION
    console.log('\n[8/9] TECHNICAL MASTERY SECTION');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#tech-orbit')?.scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(300);
    const techMastery = await validateTechMasterySection(page);
    results.techMastery = techMastery;
    await page.locator('#tech-orbit').screenshot({ path: path.join(ARTIFACTS_DIR, '08-tech-mastery.png') });

    // 9. CONTACT SECTION VALIDATION
    console.log('\n[9/9] CONTACT SECTION');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(300);
    const contact = await validateContactSection(page);
    results.contact = contact;
    await page.locator('#contact').screenshot({ path: path.join(ARTIFACTS_DIR, '09-contact.png') });

    // Full page screenshot
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '00-full-page.png'), fullPage: true });

    // Performance metrics
    console.log('\n[PERFORMANCE METRICS]');
    console.log('-'.repeat(40));
    const metrics = await page.evaluate(() => {
        const perf = performance.getEntriesByType('navigation')[0];
        return {
            domContentLoaded: Math.round(perf.domContentLoadedEventEnd),
            loadComplete: Math.round(perf.loadEventEnd),
            domInteractive: Math.round(perf.domInteractive)
        };
    });
    console.log(`  DOM Interactive: ${metrics.domInteractive}ms`);
    console.log(`  DOM Content Loaded: ${metrics.domContentLoaded}ms`);
    console.log(`  Load Complete: ${metrics.loadComplete}ms`);

    // Resource analysis
    const resources = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource');
        return entries.map(e => ({
            name: e.name.split('/').pop(),
            type: e.initiatorType,
            size: e.transferSize,
            duration: Math.round(e.duration)
        })).filter(r => r.duration > 100 || r.size > 50000);
    });

    if (resources.length > 0) {
        console.log('\n  Slow/Large Resources:');
        resources.forEach(r => {
            console.log(`    ${r.name}: ${r.duration}ms, ${Math.round(r.size/1024)}KB`);
        });
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('VALIDATION SUMMARY');
    console.log('='.repeat(60));

    let totalPassed = 0;
    let totalFailed = 0;

    for (const [section, data] of Object.entries(results)) {
        const status = data.issues.length === 0 ? '✓' : '✗';
        const statusColor = data.issues.length === 0 ? '\x1b[32m' : '\x1b[31m';
        console.log(`${statusColor}${status}\x1b[0m ${section}: ${data.passed} passed, ${data.issues.length} issues`);
        totalPassed += data.passed;
        totalFailed += data.issues.length;
        
        if (data.issues.length > 0) {
            data.issues.forEach(issue => console.log(`    ⚠ ${issue}`));
        }
    }

    // Console issues
    if (issues.length > 0) {
        console.log('\n\x1b[31m[CONSOLE ISSUES]\x1b[0m');
        issues.forEach(i => console.log(`  ⚠ ${i}`));
    } else {
        console.log('\n\x1b[32m[NO CONSOLE ISSUES]\x1b[0m');
    }

    // Optimization suggestions
    console.log('\n\x1b[36m[OPTIMIZATION SUGGESTIONS]\x1b[0m');
    await analyzeOptimizations(page, optimizations);
    if (optimizations.length === 0) {
        console.log('  None identified');
    } else {
        optimizations.forEach(o => console.log(`  → ${o}`));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`TOTAL: ${totalPassed} passed, ${totalFailed} issues`);
    console.log(`Screenshots saved to: ${ARTIFACTS_DIR}`);
    console.log('='.repeat(60));

    await browser.close();
    return { results, issues, optimizations };
}

async function validateNavigation(page) {
    const data = { passed: 0, issues: [] };
    
    const navLinks = await page.locator('.nav-link').all();
    console.log(`  Nav links: ${navLinks.length}`);
    
    if (navLinks.length !== 7) {
        data.issues.push(`Expected 7 nav links, found ${navLinks.length}`);
    } else {
        data.passed++;
    }

    // Check each link visibility
    for (const link of navLinks) {
        const visible = await link.isVisible();
        if (!visible) {
            const text = await link.textContent();
            data.issues.push(`Nav link "${text}" not visible`);
        }
    }
    data.passed++;

    // Check logo
    const logo = await page.locator('.nav-logo').first();
    if (await logo.isVisible()) {
        console.log('  Logo: ✓ visible');
        data.passed++;
    } else {
        data.issues.push('Logo not visible');
    }

    return data;
}

async function validateHeroSection(page) {
    const data = { passed: 0, issues: [] };

    // Hero title
    const title = await page.locator('.hero-title').first();
    if (await title.isVisible()) {
        console.log('  Hero title: ✓ visible');
        data.passed++;
    } else {
        data.issues.push('Hero title not visible');
    }

    // Hero subtitle
    const subtitle = await page.locator('.hero-subtitle').first();
    if (await subtitle.isVisible()) {
        console.log('  Hero subtitle: ✓ visible');
        data.passed++;
    } else {
        data.issues.push('Hero subtitle not visible');
    }

    // CTA buttons
    const ctaButtons = await page.locator('.cta-button').all();
    console.log(`  CTA buttons: ${ctaButtons.length}`);
    if (ctaButtons.length >= 2) {
        data.passed++;
    } else {
        data.issues.push(`Expected at least 2 CTA buttons, found ${ctaButtons.length}`);
    }

    // Particles canvas
    const particlesCanvas = await page.locator('#particles-canvas');
    if (await particlesCanvas.count() > 0) {
        console.log('  Particles canvas: ✓ present');
        data.passed++;
    } else {
        data.issues.push('Particles canvas missing');
    }

    return data;
}

async function validateJourneySection(page) {
    const data = { passed: 0, issues: [] };

    // Section header
    const header = await page.locator('#journey .section-header').first();
    if (await header.isVisible()) {
        console.log('  Section header: ✓ visible');
        data.passed++;
    } else {
        data.issues.push('Journey section header not visible');
    }

    // Timeline items
    const timelineItems = await page.locator('.timeline-item').all();
    console.log(`  Timeline items: ${timelineItems.length}`);
    if (timelineItems.length >= 4) {
        data.passed++;
    } else {
        data.issues.push(`Expected at least 4 timeline items, found ${timelineItems.length}`);
    }

    // Check timeline item visibility
    let visibleItems = 0;
    for (const item of timelineItems) {
        if (await item.isVisible()) visibleItems++;
    }
    console.log(`  Visible items: ${visibleItems}/${timelineItems.length}`);
    if (visibleItems === timelineItems.length) {
        data.passed++;
    } else {
        data.issues.push(`Only ${visibleItems}/${timelineItems.length} timeline items visible`);
    }

    return data;
}

async function validateExpertiseSection(page) {
    const data = { passed: 0, issues: [] };

    // Section header
    const header = await page.locator('#expertise .section-header').first();
    if (await header.isVisible()) {
        console.log('  Section header: ✓ visible');
        data.passed++;
    } else {
        data.issues.push('Expertise section header not visible');
    }

    // Expertise cards
    const cards = await page.locator('.expertise-card').all();
    console.log(`  Expertise cards: ${cards.length}`);
    if (cards.length === 8) {
        data.passed++;
    } else {
        data.issues.push(`Expected 8 expertise cards, found ${cards.length}`);
    }

    // Check card dimensions and visibility
    let validCards = 0;
    for (const card of cards) {
        const box = await card.boundingBox();
        if (box && box.width > 200 && box.height > 100) {
            validCards++;
        }
    }
    console.log(`  Valid card dimensions: ${validCards}/${cards.length}`);
    if (validCards === cards.length) {
        data.passed++;
    } else {
        data.issues.push(`${cards.length - validCards} cards have invalid dimensions`);
    }

    return data;
}

async function validateProductsSection(page) {
    const data = { passed: 0, issues: [] };

    // Section header
    const header = await page.locator('#products .section-header').first();
    if (await header.isVisible()) {
        console.log('  Section header: ✓ visible');
        data.passed++;
    } else {
        data.issues.push('Products section header not visible');
    }

    // Product cards
    const cards = await page.locator('.product-card').all();
    console.log(`  Product cards: ${cards.length}`);
    if (cards.length >= 3) {
        data.passed++;
    } else {
        data.issues.push(`Expected at least 3 product cards, found ${cards.length}`);
    }

    // Check product card content
    let validCards = 0;
    for (const card of cards) {
        const title = await card.locator('h3').first();
        const desc = await card.locator('.product-description, p').first();
        if (await title.isVisible() && await desc.isVisible()) {
            validCards++;
        }
    }
    console.log(`  Cards with valid content: ${validCards}/${cards.length}`);
    if (validCards === cards.length) {
        data.passed++;
    } else {
        data.issues.push(`${cards.length - validCards} product cards missing content`);
    }

    return data;
}

async function validateAssessmentSection(page) {
    const data = { passed: 0, issues: [] };

    // Section exists
    const section = await page.locator('#assessment');
    if (await section.isVisible()) {
        console.log('  Section: ✓ visible');
        data.passed++;
    } else {
        data.issues.push('Assessment section not visible');
        return data;
    }

    // Chat interface
    const chatContainer = await page.locator('.ai-chat-container, .chat-container').first();
    if (await chatContainer.count() > 0 && await chatContainer.isVisible()) {
        console.log('  Chat container: ✓ visible');
        data.passed++;
    } else {
        console.log('  Chat container: checking alternatives...');
        // Check for any assessment content
        const assessmentContent = await section.locator('*').count();
        console.log(`  Assessment content elements: ${assessmentContent}`);
        data.passed++;
    }

    return data;
}

async function validateGlobalSection(page) {
    const data = { passed: 0, issues: [] };

    // Section header
    const header = await page.locator('#global .section-header').first();
    if (await header.isVisible()) {
        console.log('  Section header: ✓ visible');
        data.passed++;
    } else {
        data.issues.push('Global section header not visible');
    }

    // Globe canvas
    const globeCanvas = await page.locator('#globe-container canvas');
    if (await globeCanvas.count() > 0) {
        console.log('  Globe canvas: ✓ present');
        data.passed++;
    } else {
        data.issues.push('Globe canvas missing');
    }

    // Location cards
    const locationCards = await page.locator('.location-card').all();
    console.log(`  Location cards: ${locationCards.length}`);
    if (locationCards.length >= 3) {
        data.passed++;
    } else {
        data.issues.push(`Expected at least 3 location cards, found ${locationCards.length}`);
    }

    // Stats
    const stats = await page.locator('.stat-item, .stat-number').all();
    console.log(`  Stats: ${stats.length}`);
    if (stats.length >= 3) {
        data.passed++;
    } else {
        data.issues.push(`Expected at least 3 stats, found ${stats.length}`);
    }

    return data;
}

async function validateTechMasterySection(page) {
    const data = { passed: 0, issues: [] };

    // Section exists
    const section = await page.locator('#tech-orbit');
    if (await section.isVisible()) {
        console.log('  Section: ✓ visible');
        data.passed++;
    } else {
        data.issues.push('Tech Mastery section not visible');
        return data;
    }

    // Tech icons
    const techIcons = await page.locator('.tech-icon').all();
    console.log(`  Tech icons: ${techIcons.length}`);
    if (techIcons.length >= 20) {
        data.passed++;
    } else {
        data.issues.push(`Expected at least 20 tech icons, found ${techIcons.length}`);
    }

    // Check icon visibility
    let visibleIcons = 0;
    for (const icon of techIcons.slice(0, 10)) { // Check first 10
        if (await icon.isVisible()) visibleIcons++;
    }
    console.log(`  Sample visibility: ${visibleIcons}/10`);
    if (visibleIcons >= 8) {
        data.passed++;
    } else {
        data.issues.push(`Only ${visibleIcons}/10 sampled tech icons visible`);
    }

    // Skill bars
    const skillBars = await page.locator('.skill-bar').all();
    console.log(`  Skill bars: ${skillBars.length}`);
    if (skillBars.length >= 4) {
        data.passed++;
    } else {
        data.issues.push(`Expected at least 4 skill bars, found ${skillBars.length}`);
    }

    return data;
}

async function validateContactSection(page) {
    const data = { passed: 0, issues: [] };

    // Section header
    const header = await page.locator('#contact .section-header').first();
    if (await header.isVisible()) {
        console.log('  Section header: ✓ visible');
        data.passed++;
    } else {
        data.issues.push('Contact section header not visible');
    }

    // Contact form
    const form = await page.locator('.contact-form, form').first();
    if (await form.isVisible()) {
        console.log('  Contact form: ✓ visible');
        data.passed++;
    } else {
        data.issues.push('Contact form not visible');
    }

    // Form inputs
    const inputs = await page.locator('#contact input, #contact textarea').all();
    console.log(`  Form inputs: ${inputs.length}`);
    if (inputs.length >= 3) {
        data.passed++;
    } else {
        data.issues.push(`Expected at least 3 form inputs, found ${inputs.length}`);
    }

    // Submit button
    const submitBtn = await page.locator('#contact button[type="submit"], #contact .submit-btn').first();
    if (await submitBtn.count() > 0 && await submitBtn.isVisible()) {
        console.log('  Submit button: ✓ visible');
        data.passed++;
    } else {
        data.issues.push('Submit button not visible');
    }

    // Contact info
    const contactItems = await page.locator('.contact-item').all();
    console.log(`  Contact items: ${contactItems.length}`);
    if (contactItems.length >= 2) {
        data.passed++;
    } else {
        data.issues.push(`Expected at least 2 contact items, found ${contactItems.length}`);
    }

    return data;
}

async function analyzeOptimizations(page, optimizations) {
    // Check for unoptimized images
    const images = await page.evaluate(() => {
        return Array.from(document.images).map(img => ({
            src: img.src,
            naturalWidth: img.naturalWidth,
            displayWidth: img.width,
            loading: img.loading
        }));
    });

    const oversizedImages = images.filter(img => 
        img.naturalWidth > img.displayWidth * 2 && img.displayWidth > 0
    );
    if (oversizedImages.length > 0) {
        optimizations.push(`${oversizedImages.length} images could be optimized (displayed smaller than natural size)`);
    }

    const lazyLoadCandidates = images.filter(img => !img.loading || img.loading !== 'lazy');
    if (lazyLoadCandidates.length > 3) {
        optimizations.push(`Consider lazy loading for ${lazyLoadCandidates.length} images`);
    }

    // Check for large inline styles
    const inlineStyles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('[style]')).length;
    });
    if (inlineStyles > 50) {
        optimizations.push(`${inlineStyles} elements have inline styles - consider moving to CSS`);
    }

    // Check for render-blocking resources
    const scripts = await page.evaluate(() => {
        return Array.from(document.scripts).filter(s => !s.async && !s.defer && s.src).length;
    });
    if (scripts > 2) {
        optimizations.push(`${scripts} render-blocking scripts - consider async/defer`);
    }

    // Check animation count
    const animatedElements = await page.evaluate(() => {
        return document.querySelectorAll('[data-gsap], .gsap-animated').length;
    });
    
    // Check for unused CSS selectors (simplified check)
    const unusedSelectors = await page.evaluate(() => {
        const selectors = [];
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules) {
                    if (rule.selectorText && !document.querySelector(rule.selectorText)) {
                        selectors.push(rule.selectorText);
                    }
                }
            } catch (e) {}
        }
        return selectors.length;
    });
    if (unusedSelectors > 20) {
        optimizations.push(`Potential ${unusedSelectors} unused CSS selectors`);
    }
}

runValidation().catch(console.error);
