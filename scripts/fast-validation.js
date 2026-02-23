/**
 * Fast Visual Validation - Section by Section
 * Comprehensive Playwright test for Chrome rendering (no screenshots)
 */

const { chromium } = require('playwright');

async function runValidation() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    const issues = [];
    const optimizations = [];

    // Capture console messages  
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        if (type === 'error' || type === 'warning') {
            if (!text.includes('favicon') && !text.includes('DevTools')) {
                issues.push(`Console ${type}: ${text}`);
            }
        }
    });

    page.on('pageerror', err => {
        issues.push(`Page error: ${err.message}`);
    });

    console.log('='.repeat(60));
    console.log('FINAL VISUAL VALIDATION - Section by Section');
    console.log('='.repeat(60));

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const results = {};

    // 1. NAVIGATION
    console.log('\n[1/9] NAVIGATION');
    console.log('-'.repeat(40));
    results.navigation = await validateNavigation(page);

    // 2. HERO SECTION
    console.log('\n[2/9] HERO SECTION');
    console.log('-'.repeat(40));
    results.hero = await validateHeroSection(page);

    // 3. JOURNEY TIMELINE
    console.log('\n[3/9] JOURNEY TIMELINE');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#journey')?.scrollIntoView());
    await page.waitForTimeout(200);
    results.journey = await validateJourneySection(page);

    // 4. EXPERTISE SECTION
    console.log('\n[4/9] EXPERTISE SECTION');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#expertise')?.scrollIntoView());
    await page.waitForTimeout(200);
    results.expertise = await validateExpertiseSection(page);

    // 5. PRODUCTS SECTION
    console.log('\n[5/9] PRODUCTS SECTION');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#products')?.scrollIntoView());
    await page.waitForTimeout(200);
    results.products = await validateProductsSection(page);

    // 6. ASSESSMENT SECTION
    console.log('\n[6/9] ASSESSMENT SECTION');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#assessment')?.scrollIntoView());
    await page.waitForTimeout(200);
    results.assessment = await validateAssessmentSection(page);

    // 7. GLOBAL IMPACT SECTION
    console.log('\n[7/9] GLOBAL IMPACT SECTION');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#global')?.scrollIntoView());
    await page.waitForTimeout(200);
    results.global = await validateGlobalSection(page);

    // 8. TECH MASTERY SECTION
    console.log('\n[8/9] TECHNICAL MASTERY SECTION');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#tech-orbit')?.scrollIntoView());
    await page.waitForTimeout(200);
    results.techMastery = await validateTechMasterySection(page);

    // 9. CONTACT SECTION
    console.log('\n[9/9] CONTACT SECTION');
    console.log('-'.repeat(40));
    await page.evaluate(() => document.querySelector('#contact')?.scrollIntoView());
    await page.waitForTimeout(200);
    results.contact = await validateContactSection(page);

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

    // Analyze optimizations
    console.log('\n[OPTIMIZATION ANALYSIS]');
    console.log('-'.repeat(40));
    await analyzeOptimizations(page, optimizations);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('VALIDATION SUMMARY');
    console.log('='.repeat(60));

    let totalPassed = 0;
    let totalFailed = 0;

    for (const [section, data] of Object.entries(results)) {
        const status = data.issues.length === 0 ? '✓' : '✗';
        console.log(`${status} ${section}: ${data.passed} passed, ${data.issues.length} issues`);
        totalPassed += data.passed;
        totalFailed += data.issues.length;
        
        if (data.issues.length > 0) {
            data.issues.forEach(issue => console.log(`    ⚠ ${issue}`));
        }
    }

    if (issues.length > 0) {
        console.log('\n[CONSOLE ISSUES]');
        issues.forEach(i => console.log(`  ⚠ ${i}`));
    } else {
        console.log('\n✓ NO CONSOLE ERRORS OR WARNINGS');
    }

    if (optimizations.length > 0) {
        console.log('\n[OPTIMIZATION SUGGESTIONS]');
        optimizations.forEach(o => console.log(`  → ${o}`));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`TOTAL: ${totalPassed} passed, ${totalFailed} issues`);
    console.log('='.repeat(60));

    await browser.close();
}

async function validateNavigation(page) {
    const data = { passed: 0, issues: [] };
    
    const navLinks = await page.locator('.nav-link').count();
    console.log(`  Nav links: ${navLinks}`);
    if (navLinks === 7) data.passed++; 
    else data.issues.push(`Expected 7 nav links, found ${navLinks}`);

    const logo = await page.locator('.nav-logo').isVisible();
    console.log(`  Logo: ${logo ? '✓' : '✗'} visible`);
    if (logo) data.passed++;
    else data.issues.push('Logo not visible');

    return data;
}

async function validateHeroSection(page) {
    const data = { passed: 0, issues: [] };

    const title = await page.locator('.hero-title').isVisible();
    console.log(`  Hero title: ${title ? '✓' : '✗'} visible`);
    if (title) data.passed++;
    else data.issues.push('Hero title not visible');

    const subtitle = await page.locator('.hero-subtitle').isVisible();
    console.log(`  Hero subtitle: ${subtitle ? '✓' : '✗'} visible`);
    if (subtitle) data.passed++;
    else data.issues.push('Hero subtitle not visible');

    const ctaButtons = await page.locator('.hero-cta .btn').count();
    console.log(`  CTA buttons: ${ctaButtons}`);
    if (ctaButtons >= 2) data.passed++;
    else data.issues.push(`Expected 2+ CTA buttons, found ${ctaButtons}`);

    const particles = await page.locator('#particle-canvas').count();
    console.log(`  Particles canvas: ${particles > 0 ? '✓' : '✗'} present`);
    if (particles > 0) data.passed++;
    else data.issues.push('Particles canvas missing');

    return data;
}

async function validateJourneySection(page) {
    const data = { passed: 0, issues: [] };

    const header = await page.locator('#journey .section-header').isVisible();
    console.log(`  Section header: ${header ? '✓' : '✗'} visible`);
    if (header) data.passed++;
    else data.issues.push('Section header not visible');

    const timelineItems = await page.locator('.timeline-item').count();
    console.log(`  Timeline items: ${timelineItems}`);
    if (timelineItems >= 4) data.passed++;
    else data.issues.push(`Expected 4+ timeline items, found ${timelineItems}`);

    return data;
}

async function validateExpertiseSection(page) {
    const data = { passed: 0, issues: [] };

    const header = await page.locator('#expertise .section-header').isVisible();
    console.log(`  Section header: ${header ? '✓' : '✗'} visible`);
    if (header) data.passed++;
    else data.issues.push('Section header not visible');

    const cards = await page.locator('.expertise-card').count();
    console.log(`  Expertise cards: ${cards}`);
    if (cards === 8) data.passed++;
    else data.issues.push(`Expected 8 expertise cards, found ${cards}`);

    // Check card dimensions
    const firstCard = page.locator('.expertise-card').first();
    const box = await firstCard.boundingBox();
    if (box && box.width > 200 && box.height > 100) {
        console.log(`  Card dimensions: ✓ ${Math.round(box.width)}x${Math.round(box.height)}`);
        data.passed++;
    } else {
        data.issues.push('Card dimensions invalid');
    }

    return data;
}

async function validateProductsSection(page) {
    const data = { passed: 0, issues: [] };

    const header = await page.locator('#products .section-header').isVisible();
    console.log(`  Section header: ${header ? '✓' : '✗'} visible`);
    if (header) data.passed++;
    else data.issues.push('Section header not visible');

    const cards = await page.locator('.product-card').count();
    console.log(`  Product cards: ${cards}`);
    if (cards >= 3) data.passed++;
    else data.issues.push(`Expected 3+ product cards, found ${cards}`);

    // Check if cards have content
    const firstCardTitle = await page.locator('.product-card h3').first().isVisible();
    console.log(`  Card content: ${firstCardTitle ? '✓' : '✗'} visible`);
    if (firstCardTitle) data.passed++;
    else data.issues.push('Product card content missing');

    return data;
}

async function validateAssessmentSection(page) {
    const data = { passed: 0, issues: [] };

    const section = await page.locator('#assessment').isVisible();
    console.log(`  Section: ${section ? '✓' : '✗'} visible`);
    if (section) data.passed++;
    else data.issues.push('Assessment section not visible');

    // Chat widget (floating - may be hidden initially)
    const chatWidget = await page.locator('#chat-widget').count();
    console.log(`  Chat widget: ${chatWidget > 0 ? '✓' : '✗'} present`);
    if (chatWidget > 0) data.passed++;
    else data.issues.push('Chat widget missing');

    return data;
}

async function validateGlobalSection(page) {
    const data = { passed: 0, issues: [] };

    const header = await page.locator('#global .section-header').isVisible();
    console.log(`  Section header: ${header ? '✓' : '✗'} visible`);
    if (header) data.passed++;
    else data.issues.push('Section header not visible');

    // Wait for Three.js to render the globe
    await page.waitForTimeout(500);
    const globeCanvas = await page.locator('#globe-container canvas').count();
    console.log(`  Globe canvas: ${globeCanvas > 0 ? '✓' : '✗'} present`);
    if (globeCanvas > 0) data.passed++;
    else data.issues.push('Globe canvas missing (Three.js may need more time)');

    const locationCards = await page.locator('.location-card').count();
    console.log(`  Location cards: ${locationCards}`);
    if (locationCards >= 3) data.passed++;
    else data.issues.push(`Expected 3+ location cards, found ${locationCards}`);

    const stats = await page.locator('.stat-number').count();
    console.log(`  Stats: ${stats}`);
    if (stats >= 3) data.passed++;
    else data.issues.push(`Expected 3+ stats, found ${stats}`);

    return data;
}

async function validateTechMasterySection(page) {
    const data = { passed: 0, issues: [] };

    const section = await page.locator('#tech-orbit').isVisible();
    console.log(`  Section: ${section ? '✓' : '✗'} visible`);
    if (section) data.passed++;
    else data.issues.push('Tech Mastery section not visible');

    const techIcons = await page.locator('.tech-icon').count();
    console.log(`  Tech icons: ${techIcons}`);
    if (techIcons >= 20) data.passed++;
    else data.issues.push(`Expected 20+ tech icons, found ${techIcons}`);

    const skillBars = await page.locator('.skill-bar').count();
    console.log(`  Skill bars: ${skillBars}`);
    if (skillBars >= 4) data.passed++;
    else data.issues.push(`Expected 4+ skill bars, found ${skillBars}`);

    return data;
}

async function validateContactSection(page) {
    const data = { passed: 0, issues: [] };

    const header = await page.locator('#contact .section-header').isVisible();
    console.log(`  Section header: ${header ? '✓' : '✗'} visible`);
    if (header) data.passed++;
    else data.issues.push('Section header not visible');

    const form = await page.locator('.contact-form').isVisible();
    console.log(`  Contact form: ${form ? '✓' : '✗'} visible`);
    if (form) data.passed++;
    else data.issues.push('Contact form not visible');

    const inputs = await page.locator('#contact input, #contact textarea').count();
    console.log(`  Form inputs: ${inputs}`);
    if (inputs >= 3) data.passed++;
    else data.issues.push(`Expected 3+ form inputs, found ${inputs}`);

    const submitBtn = await page.locator('#contact button[type="submit"]').isVisible();
    console.log(`  Submit button: ${submitBtn ? '✓' : '✗'} visible`);
    if (submitBtn) data.passed++;
    else data.issues.push('Submit button not visible');

    const contactItems = await page.locator('.contact-item').count();
    console.log(`  Contact items: ${contactItems}`);
    if (contactItems >= 2) data.passed++;
    else data.issues.push(`Expected 2+ contact items, found ${contactItems}`);

    return data;
}

async function analyzeOptimizations(page, optimizations) {
    // Image optimization
    const images = await page.evaluate(() => {
        return Array.from(document.images).map(img => ({
            src: img.src.split('/').pop(),
            natural: img.naturalWidth,
            display: img.width,
            loading: img.loading
        }));
    });

    const oversized = images.filter(img => img.natural > img.display * 2 && img.display > 0);
    if (oversized.length > 0) {
        console.log(`  Oversized images: ${oversized.length}`);
        optimizations.push(`${oversized.length} images could be resized (serving larger than displayed)`);
    } else {
        console.log(`  Image sizes: ✓ optimized`);
    }

    const noLazy = images.filter(img => img.loading !== 'lazy');
    if (noLazy.length > 5) {
        console.log(`  Non-lazy images: ${noLazy.length}`);
        optimizations.push(`Consider lazy loading for ${noLazy.length} images`);
    }

    // Script analysis
    const scripts = await page.evaluate(() => {
        return Array.from(document.scripts)
            .filter(s => s.src)
            .map(s => ({
                src: s.src.split('/').pop(),
                async: s.async,
                defer: s.defer
            }));
    });

    const blocking = scripts.filter(s => !s.async && !s.defer);
    if (blocking.length > 2) {
        console.log(`  Blocking scripts: ${blocking.length}`);
        optimizations.push(`${blocking.length} render-blocking scripts could use async/defer`);
    } else {
        console.log(`  Script loading: ✓ optimized`);
    }

    // CSS analysis
    const inlineStyles = await page.evaluate(() => {
        return document.querySelectorAll('[style]').length;
    });
    if (inlineStyles > 100) {
        console.log(`  Inline styles: ${inlineStyles}`);
        optimizations.push(`${inlineStyles} inline styles - consider consolidating to CSS`);
    } else {
        console.log(`  Inline styles: ✓ minimal (${inlineStyles})`);
    }

    // Animation check
    const animatedElements = await page.evaluate(() => {
        return document.querySelectorAll('.gsap-animated, [style*="transform"]').length;
    });
    console.log(`  Animated elements: ${animatedElements}`);

    // Resource count
    const resourceCount = await page.evaluate(() => {
        return performance.getEntriesByType('resource').length;
    });
    console.log(`  Total resources: ${resourceCount}`);
    if (resourceCount > 50) {
        optimizations.push(`High resource count (${resourceCount}) - consider bundling/reducing`);
    }
}

runValidation().catch(console.error);
