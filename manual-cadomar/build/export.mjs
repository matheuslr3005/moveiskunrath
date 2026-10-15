// Exporta o PDF (texto vetorial) e, opcionalmente, um PNG por página.
//   node export.mjs <index.html> <saida.pdf> [pasta-de-screenshots]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const [index, pdf, shots] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
page.on('console', (m) => ['error', 'warning'].includes(m.type()) && console.log('[page]', m.text()));
page.on('requestfailed', (r) => console.log('[falhou]', r.url()));
await page.goto(pathToFileURL(resolve(index)).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);

const pages = await page.$$('section.page');
console.log('páginas:', pages.length);

if (shots) {
  mkdirSync(shots, { recursive: true });
  for (const [i, el] of pages.entries()) {
    await el.scrollIntoViewIfNeeded();
    await el.screenshot({ path: `${shots}/${String(i + 1).padStart(2, '0')}.png` });
  }
}

// itens cortados: algum filho ultrapassando a página (overflow hidden esconde no PDF)
const clipped = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('section.page').forEach((sec, i) => {
    const r = sec.getBoundingClientRect();
    sec.querySelectorAll('*').forEach((el) => {
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) return;
      if (el.closest('[style*="skewX"]') || getComputedStyle(el).position === 'absolute') return;
      if (b.right > r.right + 1 || b.bottom > r.bottom + 1 || b.left < r.left - 1 || b.top < r.top - 1)
        out.push(`p${i + 1} <${el.tagName.toLowerCase()}> ${(el.textContent || '').trim().slice(0, 40)}`);
    });
  });
  return out;
});
console.log('fora da página:', clipped.length ? clipped.slice(0, 20) : 'nenhum');

await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
console.log('pdf ok', pdf);
await browser.close();
