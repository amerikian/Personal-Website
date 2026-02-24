const { chromium, devices } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({...devices['iPhone 12']});
    const page = await context.newPage();
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    
    // Scroll to expertise
    await page.evaluate(() => document.querySelector('#expertise')?.scrollIntoView());
    await page.waitForTimeout(300);
    
    // Get card info
    const cards = await page.locator('.expertise-card').count();
    const firstCard = page.locator('.expertise-card').first();
    const isVisible = await firstCard.isVisible();
    const box = await firstCard.boundingBox();
    
    // Get computed styles
    const styles = await page.evaluate(() => {
        const card = document.querySelector('.expertise-card');
        if (!card) return null;
        const cs = getComputedStyle(card);
        return {
            opacity: cs.opacity,
            visibility: cs.visibility,
            display: cs.display,
            transform: cs.transform
        };
    });
    
    console.log('Cards found:', cards);
    console.log('First card visible:', isVisible);
    console.log('Bounding box:', box);
    console.log('Computed styles:', styles);
    
    await browser.close();
})();
