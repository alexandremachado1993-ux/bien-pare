// Panier SIMULÉ : aucune commande, aucun paiement, aucune transmission à un fournisseur.
// Conservé en sessionStorage uniquement (effacé à la fermeture de l'onglet).

const KEY = 'bp_cart';

export function readCart() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeCart(ids) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // stockage indisponible : le panier simulé reste vide
  }
}

export function addToCart(id) {
  const ids = readCart();
  if (ids.includes(id)) return false;
  writeCart([...ids, id]);
  return true;
}

export function removeFromCart(id) {
  const ids = readCart();
  if (!ids.includes(id)) return false;
  writeCart(ids.filter((x) => x !== id));
  return true;
}
