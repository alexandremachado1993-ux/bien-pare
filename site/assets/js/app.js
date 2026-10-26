import { CONFIG, isStorageConfigured } from './config.js';
import {
  PRODUCTS, UNIVERSES, getProduct, productsByUniverse, formatPrice, AVAILABILITY_LABELS,
} from './products.js';
import { createTracker } from './analytics.js';
import { readCart, addToCart, removeFromCart } from './cart.js';
import { validateFeedback, submitFeedback } from './feedback.js';

const tracker = createTracker({ config: CONFIG, isStorageConfigured });
const page = document.body.dataset.page;

const ICONS = {
  cable: '<path d="M14 18a6 6 0 1 1 6 6h-2v6M18 30h8M22 30v6" /><circle cx="20" cy="18" r="2" />',
  notebook: '<rect x="11" y="8" width="20" height="26" rx="2" /><path d="M16 15h10M16 20h10M16 25h6M11 13h-2M11 21h-2M11 29h-2" />',
  saddle: '<path d="M8 22c4-1 6-6 12-6s8 5 12 6c-2 4-6 6-12 6S10 26 8 22Z" /><path d="M20 28v6M16 34h8" />',
  checklist: '<rect x="10" y="7" width="22" height="28" rx="2" /><path d="m14 15 2 2 3-4M22 15h6M14 23l2 2 3-4M22 23h6M22 30h6" />',
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const icon = (name) => `<svg class="icon" viewBox="0 0 42 42" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;

function announce(el, message, tone = 'info') {
  el.textContent = message;
  el.dataset.tone = tone;
  el.hidden = false;
}

// ---------- En-tête, bandeau d'étude, pied de page, panier simulé ----------

function renderChrome() {
  const current = (p) => (page === p ? ' aria-current="page"' : '');
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="study-banner" role="note">
      Prototype d’étude : aucun produit n’est vendu pour le moment et aucun paiement n’est possible.
      <a href="a-propos.html">En savoir plus</a>
    </div>
    <div class="bar container">
      <a class="brand" href="index.html">${esc(CONFIG.siteName)}<span>Automobile · Équitation</span></a>
      <nav aria-label="Navigation principale">
        <a href="automobile.html" class="nav-auto"${document.body.dataset.universe === 'automobile' ? ' aria-current="page"' : ''}>Automobile</a>
        <a href="equitation.html" class="nav-equi"${document.body.dataset.universe === 'equitation' ? ' aria-current="page"' : ''}>Équitation</a>
        <a href="retours.html"${current('feedback')}>Donner mon avis</a>
      </nav>
      <button type="button" class="cart-button" data-cart-open aria-haspopup="dialog">
        Ma sélection <span class="cart-count" data-cart-count>0</span>
      </button>
    </div>`;
  document.body.prepend(header);

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="container footer-grid">
      <p><strong>${esc(CONFIG.siteName)}</strong> — projet en phase d’étude. Les prix affichés sont des prix de test.</p>
      <nav aria-label="Informations">
        <a href="a-propos.html">Statut du projet</a>
        <a href="confidentialite.html">Confidentialité</a>
        <a href="mentions-legales.html">Mentions légales</a>
      </nav>
      <p class="muted" data-storage-status></p>
      <p class="owner-mode" data-owner-mode hidden></p>
    </div>`;
  document.body.append(footer);
  footer.querySelector('[data-storage-status]').textContent = isStorageConfigured()
    ? 'Mesure d’audience anonyme active, sans cookie.'
    : 'Mesure d’audience non active : aucune donnée n’est enregistrée pour le moment.';

  if (tracker.ownerMode) {
    const el = footer.querySelector('[data-owner-mode]');
    el.hidden = false;
    el.innerHTML = `Mode <strong>${esc(tracker.ownerMode)}</strong> actif sur cet appareil : vos visites ne sont pas comptées comme visiteurs. <a href="?mode=visitor">Désactiver</a>`;
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'cart-dialog';
  dialog.setAttribute('aria-labelledby', 'cart-title');
  dialog.innerHTML = `
    <div class="cart-head">
      <h2 id="cart-title">Ma sélection</h2>
      <button type="button" class="link-button" data-cart-close>Fermer</button>
    </div>
    <p class="muted">Sélection de test : elle nous aide à comprendre ce qui vous intéresse. Rien n’est commandé.</p>
    <ul class="cart-list" data-cart-list></ul>
    <p class="empty" data-cart-empty>Votre sélection est vide. Ajoutez un produit pour indiquer votre intérêt.</p>
    <button type="button" class="btn btn-primary" data-checkout>Passer commande (simulation)</button>
    <p class="notice" data-checkout-msg hidden></p>`;
  document.body.append(dialog);

  document.querySelector('[data-cart-open]').addEventListener('click', () => {
    renderCart();
    dialog.showModal();
  });
  dialog.querySelector('[data-cart-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-checkout]').addEventListener('click', () => {
    const ids = readCart();
    if (!ids.length) return;
    tracker.track('checkout_started', { variant: `items_${ids.length}` });
    announce(
      dialog.querySelector('[data-checkout-msg]'),
      'Merci ! Ce site est une étude : aucune commande n’a été passée et rien ne vous sera facturé. Dites-nous ce que vous en pensez sur la page « Donner mon avis ».',
    );
  });
  dialog.querySelector('[data-cart-list]').addEventListener('click', (e) => {
    const id = e.target.closest('[data-remove]')?.dataset.remove;
    if (!id) return;
    const p = getProduct(id);
    if (removeFromCart(id) && p) {
      tracker.track('remove_from_cart', { productId: p.id, universe: p.universe, productType: p.type });
    }
    renderCart();
  });
  updateCartCount();
}

function updateCartCount() {
  const el = document.querySelector('[data-cart-count]');
  if (el) el.textContent = String(readCart().length);
}

function renderCart() {
  const list = document.querySelector('[data-cart-list]');
  const items = readCart().map(getProduct).filter(Boolean);
  list.innerHTML = items.map((p) => `
    <li>
      <span>${esc(p.name)} <small class="muted">${formatPrice(p.testPrice)} (prix de test)</small></span>
      <button type="button" class="link-button" data-remove="${esc(p.id)}">Retirer</button>
    </li>`).join('');
  document.querySelector('[data-cart-empty]').hidden = items.length > 0;
  document.querySelector('[data-checkout]').disabled = items.length === 0;
  document.querySelector('[data-checkout-msg]').hidden = true;
  updateCartCount();
}

// ---------- Cartes et pages ----------

function productCard(p) {
  return `
    <article class="card product-card accent-${p.accent}">
      <div class="card-visual">${icon(p.icon)}</div>
      <div class="card-body">
        <p class="eyebrow">${p.type === 'numerique' ? 'Produit numérique' : 'Produit physique'} · <span class="status status-${p.availability}">${AVAILABILITY_LABELS[p.availability]}</span></p>
        <h3><a href="produit.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a></h3>
        <p>${esc(p.need)}</p>
        <p class="price">${formatPrice(p.testPrice)} <small>prix de test indicatif</small></p>
      </div>
    </article>`;
}

function renderUniverse() {
  const id = document.body.dataset.universe;
  const target = document.querySelector('[data-products]');
  const list = productsByUniverse(id);
  target.innerHTML = list.length
    ? list.map(productCard).join('')
    : '<p class="empty">Aucun produit dans cet univers pour le moment.</p>';
  tracker.track('collection_view', { universe: id }, { onceKey: `collection:${id}` });
}

function renderHome() {
  for (const el of document.querySelectorAll('[data-universe-products]')) {
    el.innerHTML = productsByUniverse(el.dataset.universeProducts).map(productCard).join('');
  }
}

function productActions(p) {
  const interest = `<button type="button" class="btn btn-primary" data-interest>Ce produit m’intéresse</button>`;
  const select = `<button type="button" class="btn btn-secondary" data-add>Ajouter à ma sélection</button>`;
  if (p.type === 'numerique' && p.availability === 'pret') {
    const buy = /^https:\/\//.test(CONFIG.digitalCheckoutUrl)
      ?`<a class="btn btn-primary" href="${esc(CONFIG.digitalCheckoutUrl)}" rel="noopener">Acheter — ${formatPrice(p.testPrice)}</a>`
      : `<button type="button" class="btn btn-primary" disabled>Vente pas encore ouverte</button>`;
    return `${buy}
      <a class="btn btn-secondary" href="${esc(p.previewUrl)}" data-preview download>Télécharger l’aperçu gratuit (PDF)</a>
      ${interest.replace('btn-primary', 'btn-ghost')}`;
  }
  return `${interest} ${select}`;
}

function renderProduct() {
  const root = document.querySelector('[data-product]');
  const id = new URLSearchParams(location.search).get('id');
  const p = id ? getProduct(id) : null;
  if (!p) {
    root.innerHTML = `
      <div class="empty-state">
        <h1>Produit introuvable</h1>
        <p>Ce produit n’existe pas ou n’est plus étudié.</p>
        <p><a class="btn btn-secondary" href="index.html">Retour à l’accueil</a></p>
      </div>`;
    document.title = `Produit introuvable — ${CONFIG.siteName}`;
    return;
  }
  const u = UNIVERSES[p.universe];
  document.body.dataset.universe = p.universe;
  document.querySelector(`.nav-${p.accent}`)?.setAttribute('aria-current', 'page');
  document.title = `${p.name} — ${CONFIG.siteName}`;
  root.innerHTML = `
    <nav class="breadcrumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › <a href="${u.page}">${u.name}</a> › <span>${esc(p.shortName)}</span></nav>
    <div class="product-layout accent-${p.accent}">
      <div class="product-visual">${icon(p.icon)}<p class="muted">Illustration — pas de photo tant que le produit n’est pas validé.</p></div>
      <div class="product-info">
        <p class="eyebrow">${p.type === 'numerique' ? 'Produit numérique' : 'Produit physique'} · <span class="status status-${p.availability}">${AVAILABILITY_LABELS[p.availability]}</span></p>
        <h1>${esc(p.name)}</h1>
        <p class="lead">${esc(p.need)}</p>
        <p class="price">${formatPrice(p.testPrice)} <small>prix de test indicatif — ${p.availability === 'pret' && CONFIG.digitalCheckoutUrl ? 'prix de vente' : 'non disponible à la vente'}</small></p>
        <div class="actions">${productActions(p)}</div>
        <p class="notice" data-action-msg role="status" hidden></p>
        <h2>Avantages</h2>
        <ul class="benefits">${p.benefits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
        <h2>Caractéristiques</h2>
        <dl class="specs">${p.specs.map((s) => `
          <div><dt>${esc(s.label)}</dt><dd>${esc(s.value)} <span class="tag tag-${s.status}">${s.status === 'verifie' ? 'confirmé' : 'à confirmer'}</span></dd></div>`).join('')}
        </dl>
        <h2>Livraison envisagée</h2>
        <p>${esc(p.delivery)}</p>
        ${p.presentationPage ? `<p><a href="${p.presentationPage}">Voir la présentation détaillée →</a></p>` : ''}
        <p><a href="retours.html?produit=${encodeURIComponent(p.id)}">Donner mon avis sur ce produit →</a></p>
      </div>
    </div>`;

  const props = { productId: p.id, universe: p.universe, productType: p.type };
  tracker.track('product_view', props, { onceKey: `product:${p.id}` });
  const msg = root.querySelector('[data-action-msg]');

  root.querySelector('[data-interest]')?.addEventListener('click', () => {
    tracker.track('interest_click', props, { onceKey: `interest:${p.id}` });
    announce(msg, 'Merci, votre intérêt est noté (de façon anonyme). Pour nous aider davantage, donnez votre avis en 1 minute.');
  });
  root.querySelector('[data-add]')?.addEventListener('click', () => {
    if (addToCart(p.id)) {
      tracker.track('add_to_cart', props);
      announce(msg, 'Ajouté à votre sélection de test. Aucun achat n’est effectué.');
    } else {
      announce(msg, 'Ce produit est déjà dans votre sélection.');
    }
    updateCartCount();
  });
  root.querySelector('[data-preview]')?.addEventListener('click', () => {
    tracker.track('digital_download', { ...props, variant: 'apercu' });
  });
}

function renderPack() {
  const p = getProduct('equi-pack-concours');
  const props = { productId: p.id, universe: p.universe, productType: p.type, variant: 'presentation' };
  tracker.track('product_view', props, { onceKey: 'product:pack-presentation' });
  const actions = document.querySelector('[data-pack-actions]');
  actions.innerHTML = productActions(p);
  const msg = document.querySelector('[data-action-msg]');
  actions.querySelector('[data-preview]')?.addEventListener('click', () => {
    tracker.track('digital_download', { ...props, variant: 'apercu' });
  });
  actions.querySelector('[data-interest]')?.addEventListener('click', () => {
    tracker.track('interest_click', props, { onceKey: `interest:${p.id}` });
    announce(msg, 'Merci, votre intérêt est noté (de façon anonyme).');
  });
  for (const el of document.querySelectorAll('[data-pack-price]')) el.textContent = formatPrice(p.testPrice);
}

function renderFeedback() {
  const form = document.querySelector('[data-feedback-form]');
  const select = form.elements.productInterest;
  select.insertAdjacentHTML('beforeend', PRODUCTS.map((p) => `<option value="${esc(p.id)}">${esc(UNIVERSES[p.universe].name)} — ${esc(p.name)}</option>`).join(''));
  const preset = new URLSearchParams(location.search).get('produit');
  if (preset && getProduct(preset)) select.value = preset;

  const status = document.querySelector('[data-form-status]');
  const submit = form.querySelector('[type=submit]');
  if (!isStorageConfigured()) {
    submit.disabled = true;
    announce(status, 'Le formulaire n’est pas encore relié à un espace de stockage : vos réponses ne pourraient pas être enregistrées. Il sera ouvert très prochainement.', 'warning');
  }

  const emailField = form.querySelector('[data-email-field]');
  if (!CONFIG.collectEmail) form.querySelector('[data-contact-block]').remove();
  form.elements.contactOk?.addEventListener('change', (e) => {
    emailField.hidden = !e.target.checked;
    form.elements.email.required = e.target.checked;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    for (const el of form.querySelectorAll('.field-error')) el.textContent = '';
    const data = {
      productInterest: select.value,
      problem: form.elements.problem.value,
      priceOpinion: form.elements.priceOpinion.value,
      hesitation: form.elements.hesitation.value,
      wish: form.elements.wish.value,
      contactOk: Boolean(CONFIG.collectEmail && form.elements.contactOk?.checked),
      email: CONFIG.collectEmail ? form.elements.email.value : '',
    };
    if (form.elements.website.value) return; // champ piège anti-robots
    const { ok, errors, payload } = validateFeedback(data, PRODUCTS.map((p) => p.id));
    if (!ok) {
      for (const [field, message] of Object.entries(errors)) {
        const target = form.querySelector(`[data-error-for="${field}"]`);
        if (target) target.textContent = message;
      }
      announce(status, 'Merci de corriger les champs signalés.', 'error');
      form.querySelector(`[name="${Object.keys(errors)[0]}"]`)?.focus();
      return;
    }
    submit.disabled = true;
    const result = await submitFeedback(payload, {
      config: CONFIG, isStorageConfigured, trafficMode: tracker.trafficMode, period: CONFIG.experimentPeriod,
    });
    if (result.stored) {
      const p = getProduct(payload.product_interest);
      tracker.track('feedback_submitted', p ? { productId: p.id, universe: p.universe, productType: p.type } : {});
      form.reset();
      if (emailField?.isConnected) emailField.hidden = true;
      announce(status, 'Merci ! Votre avis a bien été enregistré.', 'success');
    } else {
      announce(status, 'Votre avis n’a pas pu être enregistré (problème de connexion ou de service). Vous pouvez réessayer dans quelques instants.', 'error');
    }
    submit.disabled = !isStorageConfigured();
  });
}

renderChrome();
tracker.track('page_view', {}, { onceKey: 'page' });
if (page === 'home') renderHome();
if (page === 'universe') renderUniverse();
if (page === 'product') renderProduct();
if (page === 'pack') renderPack();
if (page === 'feedback') renderFeedback();
