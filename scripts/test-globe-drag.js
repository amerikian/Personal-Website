const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelector('#global-impact')?.scrollIntoView());
    await page.waitForTimeout(1500);
    
    // Get globe rotation before drag
    const rotationBefore = await page.evaluate(() => {
        if (window.globeVisualization && window.globeVisualization.globe) {
            return { x: window.globeVisualization.globe.rotation.x, y: window.globeVisualization.globe.rotation.y };
        }
        return null;
    });
    console.log('Rotation before:', rotationBefore);
    
    // Take screenshot before
    await page.screenshot({ path: 'artifacts/globe-before.png' });
    
    // Test drag
    const canvas = page.locator('#globe-container canvas');
    const box = await canvas.boundingBox();
    
    if (box) {
        console.log('Canvas box:', box);
        
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;
        
        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        
        // Drag right
        for (let i = 0; i < 20; i++) {
            await page.mouse.move(centerX + (i * 7), centerY, { steps: 1 });
            await page.waitForTimeout(16);
        }
        
        await page.mouse.up();
        await page.waitForTimeout(500);
        
        // Get rotation after
        const rotationAfter = await page.evaluate(() => {
            if (window.globeVisualization && window.globeVisualization.globe) {
                return { x: window.globeVisualization.globe.rotation.x, y: window.globeVisualization.globe.rotation.y };
            }
            return null;
        });
        console.log('Rotation after:', rotationAfter);
        
        // Take screenshot after
        await page.screenshot({ path: 'artifacts/globe-after.png' });
        
        if (rotationBefore && rotationAfter) {
            const deltaY = Math.abs(rotationAfter.y - rotationBefore.y);
            console.log('Rotation delta Y:', deltaY);
            console.log('Drag working:', deltaY > 0.1 ? 'YES' : 'NO');
        }
    }
    
    await browser.close();
})();
