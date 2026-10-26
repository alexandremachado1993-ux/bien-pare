// Génère le PDF complet du Pack Concours Serein (privé, hors site public)
// et l'aperçu gratuit (pages marquées data-preview) publié dans site/downloads.
// Usage : npm run build:pdf
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'product-private', 'pack-concours-serein.html');
const FULL = path.join(ROOT, 'product-private', 'dist', 'pack-concours-serein.pdf');
const PREVIEW = path.join(ROOT, 'site', 'downloads', 'apercu-pack-concours-serein.pdf');

(async () => {
  if (!fs.existsSync(SOURCE)) {
    console.log('Source privée absente : PDF non régénérés (l’aperçu publié reste inchangé).');
    return;
  }
  fs.mkdirSync(path.dirname(FULL), { recursive: true });
  fs.mkdirSync(path.dirname(PREVIEW), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${SOURCE}`);
  const pdfOptions = { format: 'A4', printBackground: true, preferCSSPageSize: true };
  await page.pdf({ ...pdfOptions, path: FULL });
  await page.evaluate(() => document.body.classList.add('preview'));
  await page.pdf({ ...pdfOptions, path: PREVIEW });
  await browser.close();
  console.log(`PDF complet : ${path.relative(ROOT, FULL)}`);
  console.log(`Aperçu public : ${path.relative(ROOT, PREVIEW)}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
