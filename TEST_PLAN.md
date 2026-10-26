# Plan de test

`npm run verify` = `check` (secrets, garde-fous, syntaxe) + `test` (unitaires) + `test:e2e` (Chromium réel).

## Unitaires (17)
Événements : `purchase_completed` interdit, événements inconnus refusés, paniers marqués simulés, aucun texte libre ni e-mail dans les événements, mode de trafic, référent réduit au domaine, filtrage de `utm_source`. Indicateurs : CSV aller-retour, exclusion test/démo, commandes payées = 0, échantillon faible. Formulaire : champs obligatoires, e-mail seulement avec consentement, limites de longueur, produit inconnu. Catalogue : 4 produits (1 physique et 1 numérique par univers), aucun produit physique présenté comme disponible.

## Navigateur (11)
1. 10 pages chargées sans erreur console, titre et un seul h1.
2. Aucun lien interne cassé.
3. Univers : 2 produits chacun, un seul `collection_view`, tout marqué `test`.
4. Fiche physique : aucun bouton ni lien « Acheter », intérêt et ajout dédoublonnés, commande simulée avec message honnête, retrait de la sélection.
5. Pack numérique : vente fermée, aperçu PDF téléchargé (vrai PDF), `digital_download` émis une fois.
6. Produit inexistant : état vide propre.
7. Formulaire sans stockage : bouton désactivé, message explicite.
8. Formulaire avec faux stockage intercepté : erreurs de validation, e-mail non envoyé sans consentement (y compris après avoir coché puis décoché), envoi avec consentement, aucun « @ » dans les événements.
9. Échec du stockage : message d'erreur, pas de faux succès.
10. Mobile 375 px et ordinateur 1280 px : pas de défilement horizontal, captures dans `reports/screenshots/`.
11. Tableau de bord : tests exclus, commandes payées à 0, avertissement « échantillon faible ».

## Résultats
| Date | check | unitaires | navigateur | Remarques |
|---|---|---|---|---|
| 2026-10-26 | 0 problème, 2 avertissements attendus (mentions à compléter, stockage non branché) | 17/17 | 11/11 | 1 échec initial dû au test (champ e-mail masqué), test corrigé |

## Contrôles manuels avant publication
- [ ] Mentions légales complétées (éditeur)
- [ ] Stockage branché, avis de test envoyé avec `?mode=test` et visible dans Supabase
- [ ] Vérification sur un vrai téléphone
- [ ] Aperçu PDF relu et imprimé
