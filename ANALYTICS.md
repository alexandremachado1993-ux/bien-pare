# Mesure et indicateurs

## Événements (site/assets/js/analytics.js)
| Événement | Déclencheur | Dédoublonnage |
|---|---|---|
| `page_view` | chargement de page | 1 par page chargée |
| `collection_view` | page Automobile ou Équitation | 1 par page |
| `product_view` | fiche produit ou page du pack | 1 par page |
| `interest_click` | bouton « Ce produit m'intéresse » | 1 par produit et par page |
| `add_to_cart` / `remove_from_cart` | sélection de test (**simulée**, `is_simulated = true`) | ajout refusé si déjà présent |
| `checkout_started` | « Passer commande (simulation) » (**simulé**) | — |
| `feedback_submitted` | avis **réellement enregistré** (réponse HTTP OK) | — |
| `digital_download` | téléchargement de l'aperçu gratuit (`variant = apercu`) | — |
| `purchase_completed` | **jamais émis** : refusé par le code (test unitaire) | — |

Champs : `event`, `occurred_at`, `session_id` (aléatoire, propre à l'onglet), `traffic_mode` (`test` / `demo` / `visitor`), `period`, `page`, `product_id`, `universe`, `product_type`, `variant`, `referrer_domain` (domaine seul), `utm_source`, `is_simulated`. **Aucune donnée personnelle, aucun texte libre.**

## Séparer tests et visiteurs
- Navigateur automatisé (Playwright, `navigator.webdriver`) → `test` automatiquement.
- Vos visites : ouvrir le site une fois avec `?mode=test` (ou `?mode=demo` pour une présentation). Le mode est conservé pour la session.
- Par défaut → `visitor`. Le tableau de bord ne compte que `visitor` et affiche les autres à part.
- Les commandes payées valent toujours 0 tant qu'aucune vente réelle n'existe.

## Indicateurs (tableau-de-bord.html, à partir d'un export CSV de `events`)
| Indicateur | Source | Limite |
|---|---|---|
| Sessions visiteurs distinctes | `session_id` distincts | Une session = un onglet, pas une personne |
| Pages vues / vues produit | `page_view` / `product_view` | — |
| Clics d'intérêt, ajouts simulés | `interest_click`, `add_to_cart` | **Pas des ventes** |
| Commandes simulées | `checkout_started` | **Pas des ventes** |
| Avis | `feedback_submitted` (+ table `feedback`) | Auto-sélection des répondants |
| Aperçus téléchargés | `digital_download` | — |
| Répartitions univers, type, variante, jour | champs correspondants | — |

Pas de taux de conversion affiché : les visiteurs ne sont pas identifiables de façon fiable. Sous 30 sessions, le tableau de bord signale « échantillon faible ».

## Limites
- Les bloqueurs de requêtes peuvent empêcher l'envoi : le total est un minimum.
- Pas de géolocalisation ni d'appareil. La source de trafic n'est connue que par le référent ou `utm_source`.
- Export : Supabase → Table editor → `events` → Export to CSV (compte propriétaire), puis chargement dans `tableau-de-bord.html`.
