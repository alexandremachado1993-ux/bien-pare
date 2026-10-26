// Configuration publique du site. Aucune valeur secrète ici :
// la clé "anon"/"publishable" Supabase est conçue pour être publique,
// la sécurité repose sur les règles RLS (insertion seule, aucune lecture).
// Tant que supabaseUrl est vide, aucune donnée n'est envoyée nulle part
// et le site l'indique clairement aux visiteurs.
export const CONFIG = {
  siteName: 'Bien Paré',
  supabaseUrl: 'https://isyukotihbribamfshtc.supabase.co',
  // Clé « publishable » : publique par conception (insertion seule, voir supabase/migrations).
  supabaseAnonKey: 'sb_publishable_eEGZ0b8IM3eL8I4H5tA52w_PQrmeslb',
  // Lien de paiement de l'offre numérique (ex. page Payhip). Vide = vente non active.
  digitalCheckoutUrl: '',
  // Identifiant de la période de test, à changer à chaque modification d'offre (voir EXPERIMENT_LOG.md).
  experimentPeriod: 'P1-2026-11',
};

export const isStorageConfigured = () => Boolean(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey);
