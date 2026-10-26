// Mesure d'audience minimale, sans cookie, sans donnée personnelle.
// - identifiant de session aléatoire, stocké en sessionStorage (effacé à la fermeture de l'onglet)
// - aucune empreinte navigateur, aucune adresse IP stockée par ce code
// - chaque événement porte traffic_mode : "test" | "demo" | "visitor"
// Les fonctions pures (buildEvent, resolveTrafficMode...) sont testées dans tests/unit.

export const EVENT_NAMES = new Set([
  'page_view',
  'collection_view',
  'product_view',
  'interest_click',
  'add_to_cart',
  'remove_from_cart',
  'checkout_started',
  'feedback_submitted',
  'digital_download',
]);

// purchase_completed n'existe pas dans le prototype : aucun paiement n'est possible.
export const FORBIDDEN_EVENTS = new Set(['purchase_completed']);

export const TRAFFIC_MODES = ['test', 'demo', 'visitor'];

const SAFE_TOKEN = /^[a-z0-9_-]{1,40}$/i;

export function resolveTrafficMode({ search = '', webdriver = false, stored = null } = {}) {
  if (webdriver) return 'test';
  const fromUrl = new URLSearchParams(search).get('mode');
  if (fromUrl && TRAFFIC_MODES.includes(fromUrl)) return fromUrl;
  if (stored && TRAFFIC_MODES.includes(stored)) return stored;
  return 'visitor';
}

export function referrerDomain(referrer, ownHost) {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname;
    return host && host !== ownHost ? host : null;
  } catch {
    return null;
  }
}

export function utmSource(search = '') {
  const value = new URLSearchParams(search).get('utm_source');
  return value && SAFE_TOKEN.test(value) ? value.toLowerCase() : null;
}

export function buildEvent(name, props = {}, context = {}) {
  if (FORBIDDEN_EVENTS.has(name)) {
    throw new Error(`Événement interdit dans le prototype : ${name}`);
  }
  if (!EVENT_NAMES.has(name)) {
    throw new Error(`Événement inconnu : ${name}`);
  }
  const pick = (v) => (typeof v === 'string' && SAFE_TOKEN.test(v) ? v : null);
  return {
    event: name,
    occurred_at: (context.now || new Date()).toISOString(),
    session_id: context.sessionId || null,
    traffic_mode: TRAFFIC_MODES.includes(context.trafficMode) ? context.trafficMode : 'visitor',
    period: context.period || null,
    page: typeof context.page === 'string' ? context.page.slice(0, 80) : null,
    product_id: pick(props.productId),
    universe: pick(props.universe),
    product_type: pick(props.productType),
    variant: pick(props.variant),
    referrer_domain: context.referrerDomain || null,
    utm_source: context.utmSource || null,
    // Tous les paniers et commandes du prototype sont simulés.
    is_simulated: name === 'add_to_cart' || name === 'remove_from_cart' || name === 'checkout_started',
  };
}

function randomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function safeSession(key, value) {
  try {
    if (value === undefined) return sessionStorage.getItem(key);
    sessionStorage.setItem(key, value);
  } catch {
    // stockage indisponible (navigation privée stricte) : on continue sans
  }
  return value ?? null;
}

export function createTracker({ config, isStorageConfigured }) {
  const sent = new Set();
  const log = [];
  let sessionId = safeSession('bp_session');
  if (!sessionId) sessionId = safeSession('bp_session', randomId());
  const trafficMode = resolveTrafficMode({
    search: location.search,
    webdriver: navigator.webdriver === true,
    stored: safeSession('bp_mode'),
  });
  safeSession('bp_mode', trafficMode);

  const context = () => ({
    sessionId,
    trafficMode,
    period: config.experimentPeriod,
    page: location.pathname.split('/').pop() || 'index.html',
    referrerDomain: referrerDomain(document.referrer, location.hostname),
    utmSource: utmSource(location.search),
  });

  async function send(evt) {
    if (!isStorageConfigured()) return { stored: false };
    try {
      const res = await fetch(`${config.supabaseUrl}/rest/v1/events`, {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
          apikey: config.supabaseAnonKey,
          Authorization: `Bearer ${config.supabaseAnonKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(evt),
      });
      return { stored: res.ok };
    } catch {
      return { stored: false };
    }
  }

  // onceKey : évite les doublons (ex. product_view déclenché deux fois sur la même page)
  function track(name, props = {}, { onceKey } = {}) {
    if (onceKey) {
      if (sent.has(onceKey)) return null;
      sent.add(onceKey);
    }
    const evt = buildEvent(name, props, context());
    log.push(evt);
    send(evt);
    return evt;
  }

  // Exposé pour les tests automatisés et le débogage (lecture seule).
  Object.defineProperty(window, '__bpEvents', { get: () => log.slice(), configurable: true });

  return { track, trafficMode, sessionId };
}
