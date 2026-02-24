const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false }); // visible browser
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Navigate to globe section
    await page.evaluate(() => document.querySelector('#global-impact')?.scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(1000);
    
    // Check globe container and canvas
    const globeInfo = await page.evaluate(() => {
        const container = document.getElementById('globe-container');
        const canvas = container?.querySelector('canvas');
        const instructions = document.querySelector('.globe-instructions');
        
        return {
            containerExists: !!container,
            containerSize: container ? { w: container.clientWidth, h: container.clientHeight } : null,
            canvasExists: !!canvas,
            canvasSize: canvas ? { w: canvas.width, h: canvas.height } : null,
            canvasStyle: canvas ? {
                pointerEvents: getComputedStyle(canvas).pointerEvents,
                zIndex: getComputedStyle(canvas).zIndex,
                position: getComputedStyle(canvas).position
            } : null,
            instructionsStyle: instructions ? {
                pointerEvents: getComputedStyle(instructions).pointerEvents
            } : null,
            containerStyle: container ? {
                touchAction: getComputedStyle(container).touchAction,
                cursor: getComputedStyle(container).cursor
            } : null
        };
    });
    
    console.log('Globe diagnostic:', JSON.stringify(globeInfo, null, 2));
    
    // Check for any JS errors
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
    });
    
    // Try to simulate drag
    const canvas = page.locator('#globe-container canvas');
    const box = await canvas.boundingBox();
    
    if (box) {
        console.log('Canvas box:', box);
        
        // Perform drag
        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;
        
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.waitForTimeout(100);
        await page.mouse.move(startX + 100, startY, { steps: 10 });
        await page.waitForTimeout(100);
        await page.mouse.up();
        
        console.log('Drag simulation complete');
    }
    
    await page.waitForTimeout(3000);
    await browser.close();
})();
