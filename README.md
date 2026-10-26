# Bien Paré — prototype d'étude Automobile & Équitation

Site statique (HTML/CSS/JS, **aucune dépendance**) pour tester l'intérêt de 4 produits, sans vente ni paiement :

| Univers | Physique (étude) | Numérique |
|---|---|---|
| Automobile | Sac de rangement pour câble de recharge | Carnet d'entretien & dépenses (en préparation) |
| Équitation | Housse de transport pour selle | **Pack Concours Serein** (terminé, vente non ouverte) |

## Lancer
```bash
npm run serve          # http://127.0.0.1:4173/
npm run verify         # vérifications statiques + tests unitaires + tests navigateur
npm run margins        # scénarios de marge (hypothèses)
npm run build:pdf      # régénère les PDF (nécessite product-private/, hors Git)
```
Node ≥ 20. Les tests navigateur utilisent Playwright (déjà installé dans l'environnement cloud ; en local : `npm i -D playwright && npx playwright install chromium`).

## Structure
- `site/` : le site publié (pages, `assets/js/*`, aperçu PDF gratuit dans `downloads/`)
- `site/assets/js/config.js` : configuration **publique** (URL et clé anon Supabase, lien de paiement). Vide = rien n'est enregistré, et le site l'affiche.
- `supabase/migrations/` : schéma de base (insertion seule pour les visiteurs)
- `tests/unit`, `tests/e2e` : tests ; `scripts/` : serveur local, vérifications, PDF, marges
- `research/` : étude de marché, conformité, économie et classement
- `product-private/` : **source du produit payant, exclue de Git** (à conserver dans un dépôt privé)

## Activer le stockage (après accord)
1. Créer un projet Supabase dédié en région UE (jamais `ac-sat-campagne`).
2. Appliquer `supabase/migrations/0001_events_feedback.sql`.
3. Renseigner `supabaseUrl` et `supabaseAnonKey` (clé publique « anon/publishable », jamais la clé `service_role`) dans `site/assets/js/config.js`.
4. `npm run verify`, puis tester le formulaire avec `?mode=test`.

## Retour arrière
Chaque étape est un commit Git : `git log`, puis `git revert <commit>`.
