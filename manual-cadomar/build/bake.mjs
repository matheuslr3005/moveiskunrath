// Gera imagens achatadas dos blocos marcados com data-bake (modo build.py --bake-prep).
// Esconde tudo na página menos o bloco e o que fica atrás dele, e tira um screenshot do bloco.
//   node bake.mjs <index.html em modo bake-prep> <pasta-assets>
import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const [index, outDir] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(resolve(index)).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const names = await page.$$eval('[data-bake]', (els) => els.map((e) => e.dataset.bake));
for (const name of names) {
  await page.evaluate((n) => {
    const el = document.querySelector(`[data-bake="${n}"]`);
    const section = el.closest('section.page');
    let cur = el;
    while (cur !== section) {
      for (const sib of cur.parentElement.children) if (sib !== cur) sib.style.visibility = 'hidden';
      cur = cur.parentElement;
    }
    section.scrollIntoView();
  }, name);
  const el = await page.$(`[data-bake="${name}"]`);
  await el.screenshot({ path: `${outDir}/bake-${name}.jpg`, type: 'jpeg', quality: 92 });
  console.log('ok', name);
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}
await browser.close();
