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
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4190';
const OUT = process.env.OUT || 'docs/screenshots';
const OG_OUT = process.env.OG_OUT || 'public/og-image.png';
const LOGO = process.env.LOGO || 'src/assets/logo/logo-icon.png';

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 414, height: 896 };
/** The size every social network expects for a link preview card. */
const OG_CARD = { width: 1200, height: 630 };

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

const dataUri = (path) => `data:image/png;base64,${readFileSync(path).toString('base64')}`;

/**
 * The 1200x630 card social networks show when someone shares the demo link.
 *
 * Images are inlined as data URIs rather than linked, because the page is fed
 * to the browser with setContent and has no base URL to resolve a relative
 * src against.
 */
const ogCardHtml = () => `
<!doctype html>
<meta charset="utf-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${OG_CARD.width}px;
    height: ${OG_CARD.height}px;
    display: flex;
    align-items: center;
    overflow: hidden;
    background: radial-gradient(120% 120% at 0% 0%, #1b2a49 0%, #101b34 55%, #0b1226 100%);
    color: #fff;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
  }
  .left { width: 560px; flex-shrink: 0; padding: 0 0 0 68px; }
  .brand { display: flex; align-items: center; gap: 14px; margin-bottom: 34px; }
  .brand img { width: 46px; height: 46px; display: block; }
  .brand span { font-size: 32px; letter-spacing: -0.02em; }
  .brand b { font-weight: 700; }
  .brand i { font-style: normal; font-weight: 400; color: rgba(255, 255, 255, 0.66); }
  h1 {
    font-size: 50px;
    line-height: 1.12;
    font-weight: 700;
    letter-spacing: -0.025em;
    margin-bottom: 18px;
    /* Every line break is explicit below, so nothing is left to the wrapping
       algorithm and "React 19" can never orphan its number onto a line alone. */
    white-space: nowrap;
  }
  h1 em { font-style: normal; color: #6aa8ff; }
  p { font-size: 21px; line-height: 1.45; color: rgba(255, 255, 255, 0.62); margin-bottom: 32px; }
  .pills { display: flex; flex-wrap: wrap; gap: 10px; }
  .pills span {
    font-size: 15px;
    font-weight: 600;
    padding: 9px 15px;
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.86);
    background: rgba(106, 168, 255, 0.13);
    border: 1px solid rgba(106, 168, 255, 0.28);
  }
  .right { flex: 1; height: 100%; position: relative; }
  .right img {
    position: absolute;
    top: 92px;
    left: 40px;
    width: 900px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 40px 90px -30px rgba(0, 0, 0, 0.85);
  }
</style>
<div class="left">
  <div class="brand">
    <img src="${dataUri(LOGO)}" alt="" />
    <span><b>Vite</b><i>Dash</i></span>
  </div>
  <h1>Admin dashboard<br />template for<br /><em>React 19</em></h1>
  <p>Vite 8 and Ant Design 6.<br />Free, open source, MIT licensed.</p>
  <div class="pills">
    <span>324 kB first load</span>
    <span>Roles built in</span>
    <span>Light, dark, and RTL</span>
  </div>
</div>
<div class="right">
  <img src="${dataUri(`${OUT}/dashboard-dark.png`)}" alt="" />
</div>
`;

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

  // The social card. Built from the dark screenshot that was just taken, so it
  // can never advertise a version of the app that no longer exists.
  {
    const page = await newPage(browser, { viewport: OG_CARD });
    await page.setContent(ogCardHtml(), { waitUntil: 'load' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: OG_OUT });
    console.log(`  saved ${OG_OUT}`);
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
