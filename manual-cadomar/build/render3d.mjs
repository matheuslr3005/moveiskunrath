// Renderiza os <cdm-3d data-out="..."> do manual (modo --3d keep) e salva cada um como PNG.
//   node render3d.mjs <url-do-index> <pasta-de-saida>
// Precisa de playwright-core e de um Chromium com WebGL (swiftshader serve).
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';

const [url, outDir] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
page.on('console', (m) => ['error', 'warning'].includes(m.type()) && console.log('[page]', m.text()));
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const els = await page.$$('cdm-3d[data-out]');
console.log('mockups:', els.length);
for (const el of els) {
  await el.scrollIntoViewIfNeeded();
  const out = await el.getAttribute('data-out');
  await page.waitForFunction((e) => e.querySelector('img')?.src.startsWith('data:image/png'), el, { timeout: 60000 });
  const dataUrl = await el.evaluate((e) => e.querySelector('img').src);
  const box = await el.boundingBox();
  writeFileSync(`${outDir}/${out}`, Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log('ok', out, Math.round(box.width) + 'x' + Math.round(box.height));
}
await browser.close();
