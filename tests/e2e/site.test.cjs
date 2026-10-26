// Tests de bout en bout : navigateur réel (Chromium via Playwright) sur le site servi localement.
// Ils vérifient les parcours, les événements (une seule fois, marqués "test"),
// l'absence de vente, le formulaire (avec un faux stockage intercepté) et l'affichage mobile.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('playwright');

let server;
let browser;
let base;
const SHOTS = path.resolve(__dirname, '../../reports/screenshots');

before(async () => {
  const { startServer } = await import('../../scripts/serve.mjs');
  server = await startServer(0);
  base = `http://127.0.0.1:${server.address().port}/`;
  browser = await chromium.launch();
  fs.mkdirSync(SHOTS, { recursive: true });
});

after(async () => {
  await browser?.close();
  server?.close();
});

async function open(url, { viewport = { width: 1280, height: 800 }, setup } = {}) {
  const context = await browser.newContext({ viewport, acceptDownloads: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  // Les tests n'écrivent jamais dans la vraie base : toute requête Supabase est interceptée.
  await page.route('https://*.supabase.co/**', (route) => route.fulfill({ status: 201, body: '' }));
  if (setup) await setup(page);
  await page.goto(base + url);
  await page.waitForLoadState('networkidle');
  return { page, context, errors };
}

const events = (page) => page.evaluate(() => window.__bpEvents);

const PAGES = ['index.html', 'automobile.html', 'equitation.html', 'produit.html?id=equi-pack-concours',
  'pack-concours.html', 'retours.html', 'a-propos.html', 'confidentialite.html', 'mentions-legales.html',
  'tableau-de-bord.html'];

test('toutes les pages se chargent sans erreur console, avec un titre et un h1', async () => {
  for (const url of PAGES) {
    const { page, context, errors } = await open(url);
    assert.deepEqual(errors, [], `${url} : erreurs console`);
    assert.ok((await page.title()).length > 5, `${url} : titre`);
    assert.equal(await page.locator('h1').count(), 1, `${url} : un seul h1`);
    await context.close();
  }
});

test('tous les liens internes répondent (pas de lien cassé)', async () => {
  const seen = new Set();
  for (const url of PAGES) {
    const { page, context } = await open(url);
    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.href));
    for (const href of hrefs) {
      if (!href.startsWith(base)) continue;
      const clean = href.split('#')[0];
      if (seen.has(clean)) continue;
      seen.add(clean);
      const res = await page.request.get(clean);
      assert.equal(res.status(), 200, `lien cassé : ${clean} (depuis ${url})`);
    }
    await context.close();
  }
  assert.ok(seen.size >= 12, `au moins 12 liens internes vérifiés (${seen.size})`);
});

test('les deux univers affichent leurs produits et un collection_view unique', async () => {
  for (const [url, universe] of [['automobile.html', 'automobile'], ['equitation.html', 'equitation']]) {
    const { page, context } = await open(url);
    assert.equal(await page.locator('.product-card').count(), 2);
    const evts = await events(page);
    assert.equal(evts.filter((e) => e.event === 'collection_view').length, 1);
    assert.equal(evts.find((e) => e.event === 'collection_view').universe, universe);
    assert.ok(evts.every((e) => e.traffic_mode === 'test'), 'navigateur automatisé => mode test');
    await context.close();
  }
});

test('fiche produit physique : intérêt une seule fois, sélection simulée, aucune vente', async () => {
  const { page, context } = await open('produit.html?id=auto-sac-cable-ve');
  await page.getByRole('heading', { level: 1 }).waitFor();
  assert.match(await page.locator('h1').innerText(), /câble de recharge/);
  assert.match(await page.locator('.status').first().innerText(), /non disponible/);
  assert.equal(await page.getByRole('button', { name: /acheter/i }).count(), 0, 'aucun bouton Acheter');
  assert.equal(await page.getByRole('link', { name: /acheter/i }).count(), 0, 'aucun lien Acheter');

  await page.getByRole('button', { name: 'Ce produit m’intéresse' }).click();
  await page.getByRole('button', { name: 'Ce produit m’intéresse' }).click();
  await page.getByRole('button', { name: 'Ajouter à ma sélection' }).click();
  await page.getByRole('button', { name: 'Ajouter à ma sélection' }).click();
  assert.equal(await page.locator('[data-cart-count]').innerText(), '1');

  await page.getByRole('button', { name: /Ma sélection/ }).click();
  await page.getByRole('button', { name: 'Passer commande (simulation)' }).click();
  assert.match(await page.locator('[data-checkout-msg]').innerText(), /aucune commande/);
  await page.getByRole('button', { name: 'Retirer' }).click();
  assert.equal(await page.locator('[data-cart-count]').innerText(), '0');
  assert.equal(await page.getByRole('button', { name: 'Passer commande (simulation)' }).isDisabled(), true);

  const evts = await events(page);
  const n = (name) => evts.filter((e) => e.event === name).length;
  assert.equal(n('page_view'), 1);
  assert.equal(n('product_view'), 1);
  assert.equal(n('interest_click'), 1, 'clic d’intérêt dédoublonné');
  assert.equal(n('add_to_cart'), 1, 'pas de second ajout');
  assert.equal(n('checkout_started'), 1);
  assert.equal(n('remove_from_cart'), 1);
  assert.equal(n('purchase_completed'), 0);
  for (const e of evts.filter((x) => ['add_to_cart', 'checkout_started', 'remove_from_cart'].includes(x.event))) {
    assert.equal(e.is_simulated, true);
  }
  await context.close();
});

test('produit numérique : vente fermée, aperçu PDF téléchargeable et mesuré', async () => {
  const { page, context } = await open('pack-concours.html');
  assert.equal(await page.getByRole('button', { name: 'Vente pas encore ouverte' }).isDisabled(), true);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: /aperçu gratuit/ }).click(),
  ]);
  const file = await download.path();
  assert.equal(fs.readFileSync(file).subarray(0, 4).toString(), '%PDF');
  const evts = await events(page);
  assert.equal(evts.filter((e) => e.event === 'digital_download').length, 1);
  await context.close();
});

test('produit inexistant : état vide propre', async () => {
  const { page, context, errors } = await open('produit.html?id=nexiste-pas');
  assert.match(await page.locator('h1').innerText(), /introuvable/);
  assert.deepEqual(errors, []);
  assert.equal((await events(page)).filter((e) => e.event === 'product_view').length, 0);
  await context.close();
});

test('formulaire sans stockage configuré : envoi désactivé et message honnête', async () => {
  const { page, context } = await open('retours.html', {
    setup: (p) => p.route('**/assets/js/config.js', (route) => route.fulfill({
      contentType: 'text/javascript',
      body: `export const CONFIG = { siteName: 'Bien Paré', supabaseUrl: '', supabaseAnonKey: '', digitalCheckoutUrl: '', experimentPeriod: 'TEST' };
             export const isStorageConfigured = () => false;`,
    })),
  });
  assert.equal(await page.getByRole('button', { name: 'Envoyer mon avis' }).isDisabled(), true);
  assert.match(await page.locator('[data-form-status]').innerText(), /pas encore relié/);
  assert.match(await page.locator('[data-storage-status]').innerText(), /non active/);
  await context.close();
});

// Faux stockage : config.js remplacé par une URL fictive, requêtes interceptées.
async function withFakeStorage(page, received, { fail = false } = {}) {
  await page.route('**/assets/js/config.js', (route) => route.fulfill({
    contentType: 'text/javascript',
    body: `export const CONFIG = { siteName: 'Bien Paré', supabaseUrl: 'https://fake.supabase.test', supabaseAnonKey: 'public-test-key', digitalCheckoutUrl: '', experimentPeriod: 'TEST' };
           export const isStorageConfigured = () => true;`,
  }));
  await page.route('https://fake.supabase.test/rest/v1/**', (route) => {
    const req = route.request();
    received.push({ table: new URL(req.url()).pathname.split('/').pop(), body: req.postDataJSON(), headers: req.headers() });
    return route.fulfill({ status: fail ? 500 : 201, body: '' });
  });
}

test('formulaire avec stockage : validation, envoi, e-mail seulement avec consentement', async () => {
  const received = [];
  const { page, context, errors } = await open('retours.html?produit=equi-pack-concours', { setup: (p) => withFakeStorage(p, received) });
  const submit = page.getByRole('button', { name: 'Envoyer mon avis' });
  assert.equal(await page.locator('#productInterest').inputValue(), 'equi-pack-concours');

  await page.selectOption('#productInterest', '');
  await submit.click();
  assert.match(await page.locator('[data-error-for="productInterest"]').innerText(), /Choisissez/);
  assert.match(await page.locator('[data-error-for="priceOpinion"]').innerText(), /prix/);
  assert.equal(received.filter((r) => r.table === 'feedback').length, 0);

  await page.selectOption('#productInterest', 'equi-pack-concours');
  await page.getByLabel('Acceptable').check();
  await page.fill('#problem', 'J’oublie toujours quelque chose');
  // la personne coche, saisit un e-mail, puis se ravise et décoche
  await page.getByLabel(/être prévenu/).check();
  await page.fill('#email', 'ne-doit-pas-partir@example.com');
  await page.getByLabel(/être prévenu/).uncheck();
  assert.equal(await page.locator('#email').isVisible(), false);
  await submit.click();
  await page.locator('[data-form-status][data-tone="success"]').waitFor();

  const fb = received.filter((r) => r.table === 'feedback');
  assert.equal(fb.length, 1);
  assert.equal(fb[0].body.product_interest, 'equi-pack-concours');
  assert.equal(fb[0].body.email, null, 'pas d’e-mail sans consentement');
  assert.equal(fb[0].body.traffic_mode, 'test');
  assert.equal(fb[0].headers.apikey, 'public-test-key');

  await page.getByLabel(/être prévenu/).check();
  await page.selectOption('#productInterest', 'aucun');
  await page.getByLabel('Trop cher').check();
  await page.fill('#email', 'pas-valide');
  await submit.click();
  assert.match(await page.locator('[data-error-for="email"]').innerText(), /invalide/);
  await page.fill('#email', 'contact@example.com');
  await submit.click();
  await page.waitForFunction(() => document.querySelector('[data-form-status]').textContent.includes('Merci'));
  const fb2 = received.filter((r) => r.table === 'feedback');
  assert.equal(fb2.length, 2);
  assert.equal(fb2[1].body.email, 'contact@example.com');
  assert.equal(fb2[1].body.contact_ok, true);

  const evts = received.filter((r) => r.table === 'events').map((r) => r.body);
  assert.equal(evts.filter((e) => e.event === 'feedback_submitted').length, 2);
  assert.ok(evts.every((e) => !JSON.stringify(e).includes('@')), 'aucun e-mail dans les événements');
  assert.deepEqual(errors, []);
  await context.close();
});

test('formulaire : échec du stockage signalé sans faux succès', async () => {
  const received = [];
  const { page, context } = await open('retours.html', { setup: (p) => withFakeStorage(p, received, { fail: true }) });
  await page.selectOption('#productInterest', 'aucun');
  await page.getByLabel('Je ne sais pas').check();
  await page.getByRole('button', { name: 'Envoyer mon avis' }).click();
  await page.locator('[data-form-status][data-tone="error"]').waitFor();
  assert.match(await page.locator('[data-form-status]').innerText(), /n’a pas pu être enregistré/);
  await context.close();
});

test('affichage mobile (375 px) et ordinateur : pas de défilement horizontal, captures', async () => {
  for (const [name, viewport] of [['mobile', { width: 375, height: 812 }], ['desktop', { width: 1280, height: 800 }]]) {
    for (const url of ['index.html', 'equitation.html', 'produit.html?id=equi-pack-concours', 'retours.html']) {
      const { page, context } = await open(url, { viewport });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert.ok(overflow <= 0, `${name} ${url} : débordement horizontal de ${overflow}px`);
      const slug = url.replace(/[^a-z0-9]+/gi, '-').replace(/-html.*|-$/, '');
      await page.screenshot({ path: path.join(SHOTS, `${name}-${slug || 'index'}.png`), fullPage: true });
      await context.close();
    }
  }
});

test('le tableau de bord exclut les tests et ne montre aucune commande payée', async () => {
  const { page, context, errors } = await open('tableau-de-bord.html');
  const csv = [
    'event,traffic_mode,session_id,occurred_at,product_id,universe,product_type,variant',
    'page_view,visitor,a,2026-11-01T10:00:00Z,,,,',
    'product_view,visitor,a,2026-11-01T10:01:00Z,equi-pack-concours,equitation,numerique,',
    'add_to_cart,visitor,a,2026-11-01T10:02:00Z,equi-pack-concours,equitation,numerique,',
    'page_view,test,t,2026-11-01T10:00:00Z,,,,',
  ].join('\n');
  await page.setInputFiles('[data-csv]', { name: 'events.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await page.locator('.kpis').waitFor();
  const kpis = await page.locator('.kpi').allInnerTexts();
  const value = (label) => kpis.find((k) => k.startsWith(label)).split('\n').pop().trim();
  assert.equal(value('Sessions visiteurs distinctes'), '1');
  assert.equal(value('Pages vues'), '1');
  assert.equal(value('Commandes payées'), '0');
  assert.match(await page.locator('.notice[data-tone="warning"]').innerText(), /Échantillon faible/);
  assert.deepEqual(errors, []);
  await context.close();
});
