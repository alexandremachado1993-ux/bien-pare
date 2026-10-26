import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, toCsv, computeMetrics, pct } from '../../site/assets/js/metrics.js';
import { validateFeedback } from '../../site/assets/js/feedback.js';
import { PRODUCTS, getProduct } from '../../site/assets/js/products.js';

const ev = (event, extra = {}) => ({
  event, traffic_mode: 'visitor', session_id: 's1', occurred_at: '2026-11-02T10:00:00Z', ...extra,
});

test('CSV : aller-retour avec virgules, guillemets et retours à la ligne', () => {
  const rows = [{ a: 'x,y', b: 'il a dit "ok"', c: 'ligne1\nligne2' }];
  assert.deepEqual(parseCsv(toCsv(rows)), rows);
  assert.deepEqual(parseCsv(''), []);
});

test('les tests et démos sont exclus des indicateurs', () => {
  const m = computeMetrics([
    ev('page_view'),
    ev('page_view', { traffic_mode: 'test', session_id: 't' }),
    ev('product_view', { traffic_mode: 'demo', session_id: 'd', product_id: 'auto-sac-cable-ve' }),
    ev('product_view', { product_id: 'auto-sac-cable-ve' }),
  ]);
  assert.equal(m.pageViews, 1);
  assert.equal(m.distinctSessions, 1);
  assert.deepEqual(m.productViews, { 'auto-sac-cable-ve': 1 });
  assert.deepEqual(m.excludedByMode, { visitor: 2, test: 1, demo: 1 });
});

test('un panier simulé ne crée jamais de commande payée', () => {
  const m = computeMetrics([ev('add_to_cart', { product_id: 'x' }), ev('checkout_started')]);
  assert.equal(m.paidOrders, 0);
  assert.equal(m.checkoutStartedSimulated, 1);
});

test('petit échantillon signalé', () => {
  assert.equal(computeMetrics([ev('page_view')]).smallSample, true);
  assert.equal(pct(1, 0), null);
  assert.equal(pct(1, 3), 33.3);
});

const ids = PRODUCTS.map((p) => p.id);

test('formulaire : champs obligatoires', () => {
  const r = validateFeedback({}, ids);
  assert.equal(r.ok, false);
  assert.ok(r.errors.productInterest);
  assert.ok(r.errors.priceOpinion);
});

test('formulaire : e-mail ignoré sans consentement', () => {
  const r = validateFeedback({ productInterest: 'aucun', priceOpinion: 'acceptable', email: 'a@b.fr', contactOk: false }, ids);
  assert.equal(r.ok, true);
  assert.equal(r.payload.email, null);
});

test('formulaire : e-mail exigé et validé avec consentement', () => {
  const bad = validateFeedback({ productInterest: 'aucun', priceOpinion: 'acceptable', contactOk: true, email: 'pas-un-mail' }, ids);
  assert.equal(bad.ok, false);
  const good = validateFeedback({ productInterest: ids[0], priceOpinion: 'trop_cher', contactOk: true, email: ' a@b.fr ' }, ids);
  assert.equal(good.ok, true);
  assert.equal(good.payload.email, 'a@b.fr');
});

test('formulaire : textes tronqués aux limites et produit inconnu refusé', () => {
  const r = validateFeedback({ productInterest: ids[0], priceOpinion: 'acceptable', problem: 'x'.repeat(900) }, ids);
  assert.equal(r.payload.problem.length, 500);
  assert.equal(validateFeedback({ productInterest: 'faux', priceOpinion: 'acceptable' }, ids).ok, false);
});

test('catalogue : 4 produits, 2 par univers, 1 physique et 1 numérique chacun', () => {
  assert.equal(PRODUCTS.length, 4);
  for (const u of ['automobile', 'equitation']) {
    const list = PRODUCTS.filter((p) => p.universe === u);
    assert.deepEqual(list.map((p) => p.type).sort(), ['numerique', 'physique']);
  }
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getProduct('inexistant'), null);
});

test('catalogue : aucun produit physique présenté comme disponible', () => {
  for (const p of PRODUCTS.filter((x) => x.type === 'physique')) {
    assert.equal(p.availability, 'etude', p.id);
    assert.ok(p.specs.some((s) => s.status === 'hypothese'), `${p.id} doit signaler ses hypothèses`);
  }
});
