import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildEvent, resolveTrafficMode, referrerDomain, utmSource, EVENT_NAMES,
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
