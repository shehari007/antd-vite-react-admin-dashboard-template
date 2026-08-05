/**
 * Regenerates every screenshot in this folder.
 *
 * Playwright is deliberately NOT in package.json. It is a large install that
 * nobody building a dashboard needs, so it is added on demand:
 *
 *   npm run build
 *   npx vite preview --port 4190
 *   npm i -D playwright        # in another terminal
 *   node docs/screenshots/capture.mjs
 *   npm uninstall playwright
 *
 * `channel: 'chrome'` uses the Chrome already installed on the machine rather
 * than downloading a separate Chromium, which saves a few hundred megabytes.
 * Swap it for `channel: 'msedge'`, or drop the option entirely and run
 * `npx playwright install chromium` first.
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4190';
const OUT = process.env.OUT || 'docs/screenshots';

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 414, height: 896 };

/** Seed localStorage before the app boots so it starts in the right state. */
const seed = (mode, language) => `
  try {
    localStorage.setItem('dashboard-theme-mode', '${mode}');
    localStorage.setItem('dashboard-language', '${language}');
    localStorage.setItem('dashboard-sider-collapsed', 'false');
  } catch (e) {}
`;

const settle = async (page, ms = 900) => {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(ms);
};

const newPage = async (browser, { mode = 'light', language = 'en', viewport = DESKTOP } = {}) => {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  await context.addInitScript(seed(mode, language));
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (error) => errors.push(String(error)));
  page.errors = errors;
  return page;
};

const shoot = async (page, name) => {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`  saved ${name}.png`);
};

const run = async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const allErrors = [];

  // The dashboard, light and dark. Same route both times so the pair lines up.
  for (const mode of ['light', 'dark']) {
    const page = await newPage(browser, { mode });
    await page.goto(`${BASE}/dashboard/home`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('nav[aria-label="Main navigation"]', { timeout: 20000 });
    await page.waitForSelector('text=Recent Activity', { timeout: 20000 });
    await settle(page);
    await shoot(page, `dashboard-${mode}`);
    allErrors.push(...page.errors);
    await page.context().close();
  }

  // Charts. Dark mode shows the themed tooltip and grid best.
  {
    const page = await newPage(browser, { mode: 'dark' });
    await page.goto(`${BASE}/dashboard/charts`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=Revenue and expenses', { timeout: 20000 });
    await page.waitForSelector('.recharts-surface', { timeout: 20000 });
    await settle(page, 1600);
    await shoot(page, 'charts');
    allErrors.push(...page.errors);
    await page.context().close();
  }

  // Command palette, opened with the real shortcut rather than by clicking.
  {
    const page = await newPage(browser, { mode: 'dark' });
    await page.goto(`${BASE}/dashboard/home`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('nav[aria-label="Main navigation"]', { timeout: 20000 });
    await settle(page);
    await page.keyboard.press('Control+k');
    await page.waitForSelector('[role="listbox"]', { timeout: 10000 });
    await page.keyboard.type('ro', { delay: 60 });
    await settle(page, 600);
    await shoot(page, 'command-palette');
    allErrors.push(...page.errors);
    await page.context().close();
  }

  // Products, the page wired through the service layer.
  {
    const page = await newPage(browser, { mode: 'light' });
    await page.goto(`${BASE}/dashboard/products`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=Studio Wireless Headphones', { timeout: 20000 });
    await settle(page);
    await shoot(page, 'products');
    allErrors.push(...page.errors);
    await page.context().close();
  }

  // Theme customizer drawer.
  {
    const page = await newPage(browser, { mode: 'light' });
    await page.goto(`${BASE}/dashboard/home`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('nav[aria-label="Main navigation"]', { timeout: 20000 });
    await settle(page);
    await page.click('button[aria-label="Customize theme"]');
    await page.waitForSelector('text=Corner radius', { timeout: 10000 });
    await settle(page, 700);
    await shoot(page, 'customizer');
    allErrors.push(...page.errors);
    await page.context().close();
  }

  // Right to left. The aria-label is translated too, hence the loose selector.
  {
    const page = await newPage(browser, { mode: 'light', language: 'ar' });
    await page.goto(`${BASE}/dashboard/home`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('nav[aria-label]', { timeout: 20000 });
    await settle(page, 1400);
    const dir = await page.evaluate(() => document.documentElement.dir);
    if (dir !== 'rtl') throw new Error(`expected <html dir="rtl">, got "${dir}"`);
    await shoot(page, 'rtl');
    allErrors.push(...page.errors);
    await page.context().close();
  }

  // Mobile, with the navigation drawer open.
  {
    const page = await newPage(browser, { mode: 'dark', viewport: MOBILE });
    await page.goto(`${BASE}/dashboard/home`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('button[aria-controls="app-sidebar"]', { timeout: 20000 });
    await settle(page);
    await page.click('button[aria-controls="app-sidebar"]');
    await page.waitForSelector('.app-drawer', { timeout: 10000 });
    await settle(page, 900);
    await shoot(page, 'mobile');
    allErrors.push(...page.errors);
    await page.context().close();
  }

  await browser.close();

  // The Chat page loads avatars from an external service, so a machine without
  // network reports those as errors. Everything else is worth failing over.
  const real = allErrors.filter((e) => !/favicon|pravatar|net::ERR/i.test(e));
  console.log(`\nconsole errors: ${real.length}`);
  real.slice(0, 10).forEach((e) => console.log('  ' + e.slice(0, 200)));
  if (real.length > 0) process.exitCode = 1;
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
