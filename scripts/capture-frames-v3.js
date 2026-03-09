const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1584, height: 396 } });
  
  const htmlPath = path.resolve('artifacts/linkedin-background-v3-animated.html');
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  
  // Wait for animations to start
  await page.waitForTimeout(500);
  
  // Capture 40 frames over 4 seconds
  const frameCount = 40;
  const frameDelay = 100;
  
  console.log('Capturing ' + frameCount + ' frames...');
  
  for (let i = 0; i < frameCount; i++) {
    const framePath = path.resolve('artifacts/frames-v3/frame_' + String(i).padStart(3, '0') + '.png');
    await page.screenshot({ path: framePath, type: 'png' });
    await page.waitForTimeout(frameDelay);
    process.stdout.write('.');
  }
  
  console.log('\nFrames captured!');
  await browser.close();
})();
