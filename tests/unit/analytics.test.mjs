import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildEvent, resolveTrafficMode, referrerDomain, utmSource, EVENT_NAMES, rememberOwnerMode,
} from '../../site/assets/js/analytics.js';

test('purchase_completed est refusé dans le prototype', () => {
  assert.throws(() => buildEvent('purchase_completed'), /interdit/);
  assert.equal(EVENT_NAMES.has('purchase_completed'), false);
});

test('un événement inconnu est refusé', () => {
  assert.throws(() => buildEvent('clic_magique'), /inconnu/);
});

test('les paniers et commandes sont toujours marqués simulés', () => {
  for (const name of ['add_to_cart', 'remove_from_cart', 'checkout_started']) {
    assert.equal(buildEvent(name).is_simulated, true, name);
  }
  assert.equal(buildEvent('page_view').is_simulated, false);
});

test('seules des valeurs courtes et sûres sont conservées (pas de texte libre)', () => {
  const evt = buildEvent('product_view', {
    productId: 'equi-pack-concours',
    universe: 'equitation',
    productType: 'numerique',
    variant: 'jean.dupont@example.com',
    email: 'x@y.z',
  });
  assert.equal(evt.product_id, 'equi-pack-concours');
  assert.equal(evt.variant, null);
  assert.equal('email' in evt, false);
});

test('mode de trafic : webdriver => test, URL, stockage, sinon visiteur', () => {
  assert.equal(resolveTrafficMode({ webdriver: true, search: '?mode=visitor' }), 'test');
  assert.equal(resolveTrafficMode({ search: '?mode=demo' }), 'demo');
  assert.equal(resolveTrafficMode({ search: '?mode=admin' }), 'visitor');
  assert.equal(resolveTrafficMode({ stored: 'test' }), 'test');
  assert.equal(resolveTrafficMode({}), 'visitor');
  assert.equal(buildEvent('page_view', {}, { trafficMode: 'nimporte' }).traffic_mode, 'visitor');
});

test('référent : domaine externe seulement, jamais le chemin complet', () => {
  assert.equal(referrerDomain('https://www.facebook.com/groups/123?x=1', 'site.fr'), 'www.facebook.com');
  assert.equal(referrerDomain('https://site.fr/page', 'site.fr'), null);
  assert.equal(referrerDomain('pas une url', 'site.fr'), null);
  assert.equal(referrerDomain('', 'site.fr'), null);
});

test('utm_source filtré', () => {
  assert.equal(utmSource('?utm_source=Facebook_Groupe'), 'facebook_groupe');
  assert.equal(utmSource('?utm_source=<script>'), null);
  assert.equal(utmSource(''), null);
});

test('mode propriétaire : mémorisé seulement via ?mode=test|demo, effacé par ?mode=visitor', () => {
  const mem = new Map();
  const storage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v), removeItem: (k) => mem.delete(k) };
  assert.equal(rememberOwnerMode('', storage), null, 'visiteur ordinaire : rien d’écrit');
  assert.equal(mem.size, 0);
  assert.equal(rememberOwnerMode('?mode=admin', storage), null);
  assert.equal(rememberOwnerMode('?mode=test', storage), 'test');
  assert.equal(rememberOwnerMode('', storage), 'test', 'reste actif sur les pages suivantes');
  assert.equal(resolveTrafficMode({ stored: rememberOwnerMode('', storage) }), 'test');
  assert.equal(rememberOwnerMode('?mode=visitor', storage), null);
  assert.equal(mem.size, 0);
  const broken = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); }, removeItem() {} };
  assert.equal(rememberOwnerMode('?mode=test', broken), null, 'stockage bloqué : pas de plantage');
});
