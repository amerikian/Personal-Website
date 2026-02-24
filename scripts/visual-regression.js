const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatchModule = require('pixelmatch');
const pixelmatch = pixelmatchModule.default || pixelmatchModule;

const mode = process.argv[2] || 'compare';
const baseUrl = process.argv[3] || 'http://127.0.0.1:3000';

const root = process.cwd();
const runDir = path.join(root, 'artifacts', 'screenshots');
const baselineDir = path.join(root, 'artifacts', 'visual-baseline');
const diffDir = path.join(root, 'artifacts', 'visual-diff');

const targets = [
  { name: 'desktop-full.png', device: 'desktop', fullPage: true, maxDiffRatio: 0.005 },
  { name: 'desktop-assessment.png', device: 'desktop', selector: '#assessment', maxDiffRatio: 0.03 },
  { name: 'mobile-full.png', device: 'mobile', fullPage: true, maxDiffRatio: 0.005 },
  { name: 'mobile-assessment.png', device: 'mobile', selector: '#assessment', maxDiffRatio: 0.035 },
];

function ensureDirs() {
  fs.mkdirSync(runDir, { recursive: true });
  fs.mkdirSync(baselineDir, { recursive: true });
  fs.mkdirSync(diffDir, { recursive: true });
}

function clearDiffDir() {
  if (!fs.existsSync(diffDir)) return;
  for (const file of fs.readdirSync(diffDir)) {
    fs.rmSync(path.join(diffDir, file), { force: true });
  }
}

async function captureAll() {
  const browser = await chromium.launch({ headless: true });

  const prepareStableView = async (page) => {
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          transition: none !important;
          animation: none !important;
          caret-color: transparent !important;
        }
        #particle-canvas,
        #hero-3d,
        #globe-container canvas {
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `,
    });

    await page.evaluate(() => {
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach((node) => {
        const target = node.getAttribute('data-target');
        if (target) node.textContent = target;
      });
    });
  };

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 2200 } });
  const desktopPage = await desktop.newPage();
  await desktopPage.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
  await desktopPage.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await desktopPage.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (_) {}
    }
  });
  await prepareStableView(desktopPage);
  await desktopPage.waitForSelector('#hero', { timeout: 15000 });
  await desktopPage.waitForSelector('#assessment', { timeout: 15000 });
  await desktopPage.waitForSelector('#global', { timeout: 15000 });

  const mobile = await browser.newContext({ ...devices['iPhone 14'], colorScheme: 'dark', reducedMotion: 'reduce' });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
  await mobilePage.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (_) {}
    }
  });
  await prepareStableView(mobilePage);
  await mobilePage.waitForSelector('#assessment', { timeout: 15000 });

  for (const target of targets) {
    const page = target.device === 'mobile' ? mobilePage : desktopPage;
    const outPath = path.join(runDir, target.name);

    if (target.selector) {
      await page.locator(target.selector).screenshot({ path: outPath, animations: 'disabled', scale: 'css' });
    } else {
      await page.screenshot({ path: outPath, fullPage: !!target.fullPage, animations: 'disabled', scale: 'css' });
    }
  }

  await mobile.close();
  await desktop.close();
  await browser.close();
}

function copyToBaseline() {
  for (const target of targets) {
    const src = path.join(runDir, target.name);
    const dst = path.join(baselineDir, target.name);
    fs.copyFileSync(src, dst);
  }
}

function compareAgainstBaseline() {
  let hardFailures = 0;

  for (const target of targets) {
    const currentPath = path.join(runDir, target.name);
    const baselinePath = path.join(baselineDir, target.name);

    if (!fs.existsSync(baselinePath)) {
      throw new Error(`Missing baseline image: ${baselinePath}. Run: node scripts/visual-regression.js baseline ${baseUrl}`);
    }

    const current = PNG.sync.read(fs.readFileSync(currentPath));
    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));

    if (current.width !== baseline.width || current.height !== baseline.height) {
      throw new Error(`Dimension mismatch for ${target.name}: current ${current.width}x${current.height}, baseline ${baseline.width}x${baseline.height}`);
    }

    const diff = new PNG({ width: current.width, height: current.height });
    const diffPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      current.width,
      current.height,
      { threshold: 0.15 }
    );

    const totalPixels = current.width * current.height;
    const diffRatio = diffPixels / totalPixels;
    const maxDiffRatio = target.maxDiffRatio ?? 0;

    if (diffPixels > 0) {
      const diffPath = path.join(diffDir, target.name);
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
      console.log(`DIFF: ${target.name} -> ${diffPixels} pixels (${(diffRatio * 100).toFixed(3)}%)`);

      if (diffRatio > maxDiffRatio) {
        hardFailures += 1;
        console.log(`FAIL_THRESHOLD: ${target.name} exceeds ${(maxDiffRatio * 100).toFixed(2)}% max diff`);
      }
    } else {
      console.log(`OK: ${target.name}`);
    }
  }

  if (hardFailures > 0) {
    throw new Error(`Visual regression failed on ${hardFailures} screenshot(s). See ${diffDir}`);
  }
}

(async () => {
  ensureDirs();
  if (mode === 'compare') clearDiffDir();
  await captureAll();

  if (mode === 'baseline') {
    copyToBaseline();
    console.log(`BASELINE_UPDATED at ${baselineDir}`);
    return;
  }

  if (mode === 'compare') {
    compareAgainstBaseline();
    console.log('VISUAL_REGRESSION_OK');
    return;
  }

  throw new Error(`Unknown mode: ${mode}. Use 'baseline' or 'compare'.`);
})().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
