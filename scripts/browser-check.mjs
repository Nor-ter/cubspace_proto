import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://localhost:3000';
const out = '.workflow/browser';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE
    ? { executablePath: process.env.BROWSER_EXECUTABLE }
    : {}),
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
});
const cases = [];
try {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({
      viewport,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const paths = [
      '/?admin=1#home',
      '/?admin=1#mission',
      '/?admin=1#anatomy',
      '/?admin=1#model',
      '/?admin=1#made',
      '/?admin=1#prolog',
      '/?admin=1#handoff',
      '/admin',
      ...Array.from({ length: 7 }, (_, i) => `/learn/0${i + 1}`),
    ];
    for (const route of paths) {
      const start = performance.now();
      const before = errors.length;
      const response = await page.goto(base + route, {
        waitUntil: 'networkidle',
        timeout: 60000,
      });
      await page.waitForTimeout(350);
      if (route.includes('#'))
        await page
          .locator(`#${route.split('#')[1]}.active`)
          .waitFor({ state: 'visible' });
      for (const image of await page.locator('img:visible').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((img) => img.decode().catch(() => {}));
      }
      await page.evaluate(() => scrollTo(0, 0));
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 2,
      );
      const broken = await page
        .locator('img')
        .evaluateAll((images) =>
          images
            .filter(
              (i) => i.offsetWidth > 0 && (!i.complete || i.naturalWidth === 0),
            )
            .map((i) => i.getAttribute('src')),
        );
      const screenshot = `${viewport.width}-${route.replace(/[^a-z0-9]/gi, '_')}.png`;
      await page.screenshot({ path: `${out}/${screenshot}`, fullPage: true });
      cases.push({
        route,
        width: viewport.width,
        status: response?.status() ?? null,
        overflow,
        broken,
        errors: errors.slice(before),
        duration_ms: Math.round(performance.now() - start),
        screenshot,
      });
    }
    await page.goto(base + '/admin', { waitUntil: 'networkidle' });
    const adminLinks = await page
      .locator('.admin-card')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    cases.push({
      route: 'admin links target interactive pages',
      width: viewport.width,
      passed:
        adminLinks.length === 7 &&
        adminLinks.every((h) => h.startsWith('/?admin=1#')),
    });
    await page.goto(base + '/?admin=1#anatomy', { waitUntil: 'networkidle' });
    const figuresBelow = await page.evaluate(() => {
      const model = document
        .querySelector('.model-panel')
        ?.getBoundingClientRect();
      const explanation = document
        .querySelector('.inspector')
        ?.getBoundingClientRect();
      return !!model && !!explanation && explanation.top >= model.bottom - 2;
    });
    cases.push({
      route: 'anatomy explanation below model',
      width: viewport.width,
      passed: figuresBelow,
    });
    await context.close();
  }
} finally {
  await browser.close();
}
const failed = cases.filter(
  (c) =>
    c.passed === false ||
    c.status >= 400 ||
    c.overflow ||
    c.broken?.length ||
    c.errors?.length,
);
fs.writeFileSync(
  `${out}/results.json`,
  JSON.stringify({ base, cases, failed: failed.length }, null, 2) + '\n',
);
console.log(
  `${cases.length} browser checks; ${failed.length} failures. ${out}/results.json`,
);
if (failed.length) process.exitCode = 1;
