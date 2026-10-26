// Formulaire de retours : validation pure (testée) + envoi vers le stockage configuré.

export const PRICE_OPINIONS = ['acceptable', 'trop_cher', 'tres_abordable', 'ne_sait_pas'];
export const LIMITS = { problem: 500, hesitation: 500, wish: 200, email: 254 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateFeedback(input, knownProductIds) {
  const errors = {};
  const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

  const productInterest = input.productInterest || '';
  if (!productInterest) {
    errors.productInterest = 'Choisissez un produit, ou « Aucun pour l’instant ».';
  } else if (productInterest !== 'aucun' && !knownProductIds.includes(productInterest)) {
    errors.productInterest = 'Produit inconnu.';
  }

  const priceOpinion = input.priceOpinion || '';
  if (!PRICE_OPINIONS.includes(priceOpinion)) {
    errors.priceOpinion = 'Indiquez votre avis sur le prix.';
  }

  const contactOk = input.contactOk === true;
  const email = clean(input.email, LIMITS.email);
  if (contactOk && !EMAIL.test(email)) {
    errors.email = 'Adresse e-mail invalide.';
  }

  const payload = {
    product_interest: productInterest,
    problem: clean(input.problem, LIMITS.problem) || null,
    price_opinion: priceOpinion,
    hesitation: clean(input.hesitation, LIMITS.hesitation) || null,
    wish: clean(input.wish, LIMITS.wish) || null,
    contact_ok: contactOk,
    // L'e-mail n'est conservé que si la personne a coché le consentement.
    email: contactOk ? email : null,
  };
  return { ok: Object.keys(errors).length === 0, errors, payload };
}

export async function submitFeedback(payload, { config, isStorageConfigured, trafficMode, period }) {
  if (!isStorageConfigured()) return { stored: false, reason: 'not_configured' };
  try {
    const res = await fetch(`${config.supabaseUrl}/rest/v1/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${config.supabaseAnonKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ ...payload, traffic_mode: trafficMode, period }),
    });
    return res.ok ? { stored: true } : { stored: false, reason: `http_${res.status}` };
  } catch {
    return { stored: false, reason: 'network' };
  }
}
