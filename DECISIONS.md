# Décisions

| Date | Décision | Raison | Retour arrière |
|---|---|---|---|
| 2026-10-26 | Site statique sans framework ni dépendance | Code court et vérifiable, hébergement gratuit, aucune mise à jour de dépendances | — |
| 2026-10-26 | Une seule infrastructure, deux univers visuels (bleu auto / vert-cognac équitation) | Pas de double maintenance tant que la demande n'est pas prouvée | Séparer plus tard en deux sites à partir du même code |
| 2026-10-26 | Nom de travail « Bien Paré » | Neutre pour les deux univers. **Disponibilité de la marque non vérifiée (INPI)** | Renommage : `CONFIG.siteName` et les textes |
| 2026-10-26 | Aucune vente physique au 1er novembre | Pas de SIRET, de REP/IDU, de fournisseur vérifié ni de CGV ; expédition depuis la Chine non rentable (droit de 3 € + frais de 2 € + TVA) | — |
| 2026-10-26 | Produit numérique prioritaire : Pack Concours Serein (équitation) | Communauté facile à atteindre gratuitement, offre française rare, aucun stock | — |
| 2026-10-26 | Paiement envisagé : Payhip gratuit (5 %) | Pas d'abonnement, gère la TVA UE | Gumroad (10 % + 0,50 $, commerçant de référence) |
| 2026-10-26 | Mesure sans cookie, identifiant de session aléatoire, `traffic_mode` sur chaque événement | Minimiser les données (RGPD), séparer tests et visiteurs | — |
| 2026-10-26 | Formulaire désactivé tant qu'aucun stockage n'est branché | Ne jamais laisser croire qu'une réponse est enregistrée | — |
| 2026-10-26 | Source du produit payant hors du dépôt public | Le dépôt public (GitHub Pages gratuit) exposerait le produit | Dépôt privé séparé |
| 2026-10-26 | Création du projet Supabase refusée par le garde-fou de permissions | Ressource du compte : accord explicite requis | — |
| 2026-10-26 | Accord reçu : projet Supabase `bien-pare` (isyukotihbribamfshtc, eu-west-3) créé, schéma appliqué, clé publishable branchée | Stockage réel des avis et événements | Mettre `supabaseUrl` à '' dans config.js (le site redevient inactif) ou mettre le projet en pause |
| 2026-10-26 | Vente du pack conditionnée à une règle de décision chiffrée (EXPERIMENT_LOG.md) | Choix de l'utilisateur : voir la demande avant de vendre | — |
| 2026-10-26 | Mentions légales : éditeur particulier non professionnel (LCEN art. 6-III-2), nom et e-mail dédié à fournir | Le RGPD impose d'identifier le responsable du traitement ; l'adresse personnelle n'est pas publiée | Passage aux mentions complètes de vendeur professionnel avant toute vente |
| 2026-10-26 | Nom « Bien Paré » conservé comme nom de travail, **non vérifié à l'INPI** | Décision de l'utilisateur | À vérifier avant tout dépôt de marque ou ouverture de la vente |
