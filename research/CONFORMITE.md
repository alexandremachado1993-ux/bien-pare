# Conformité, fiscalité et douane — points à valider

**Vérifié le 26/10/2026 par recherche web.** Les sites officiels (douane.gouv.fr, legifrance, eur-lex, economie.gouv.fr, cnil.fr) sont **inaccessibles depuis l'environnement de travail**. Plusieurs points s'appuient donc sur des sources secondaires et sont marqués **à confirmer**. Ceci n'est pas un avis juridique : un échange avec la CCI, un expert-comptable ou le service des douanes est recommandé avant de vendre des produits physiques importés.

## Changements douaniers 2026 (importations hors UE, colis ≤ 150 €)

| Date | Mesure | Statut |
|---|---|---|
| 1er mars au 30 juin 2026 | Taxe française de 2 € par article sur les petits colis (loi de finances 2026, art. 82) | Suspendue depuis le 1er juillet selon economie.gouv.fr (via des résumés) |
| **Depuis le 1er juillet 2026** | **Droit de douane forfaitaire UE de 3 € par catégorie d'article** ; fin de l'exonération sous 150 € ; mesure temporaire jusqu'au 1er juillet 2028 (Règlement du Conseil (UE) 2026/382) | Source Commission européenne ; le mode de comptage (article, catégorie, ligne de déclaration) **diverge selon les sources** |
| **1er novembre 2026** | **Frais de traitement UE de 2 € par catégorie d'article** sur les ventes à distance venant de pays tiers, à la charge de la plateforme, du vendeur ou de son intermédiaire | Plusieurs sources concordantes (ecommerce-nation, Orange/L'Express, nShift, Baker Tilly) ; **à confirmer sur le texte officiel** |
| Toujours | TVA à l'importation de 20 % en France | — |

**Conséquence :** un colis d'une seule catégorie expédié de Chine supporte environ **5 € de frais fixes, plus la TVA**. Pour un produit vendu 25 €, la marge disparaît (voir `ECONOMIE.md`). **L'expédition directe depuis la Chine n'est pas retenue pour le lancement.**

Point juridique **non résolu** : quand un vendeur français fait expédier depuis la Chine vers son client, qui est importateur et redevable de la TVA ? L'IOSS est réservé aux vendeurs hors UE et aux plateformes. Ce point doit être **confirmé avec les douanes**. C'est une raison de plus de privilégier un stock déjà dédouané dans l'UE.

## Sécurité des produits — RPSG / GPSR (Règlement (UE) 2023/988, applicable depuis le 13/12/2024)
- Un produit vendu dans l'UE doit avoir un **opérateur économique responsable établi dans l'UE** : fabricant, importateur ou mandataire.
- Doivent figurer **sur le produit, son emballage ou un document joint, et dans l'annonce en ligne** : le fabricant, la personne responsable dans l'UE (nom, adresse postale, e-mail), l'identification du produit et les avertissements de sécurité.
- Les marketplaces retirent les annonces incomplètes.
- **Un vendeur français qui fait importer devient importateur**, avec les obligations de traçabilité, de vérification de la conformité et de gestion des rappels qui en découlent.
- Un produit vendu sur Alibaba **n'est pas présumé conforme**.
- Marquage CE : **non requis** pour un sac ou une housse textile sans électronique. Il le serait pour un appareil électrique (exclu au départ).

## Emballages — REP et identifiant unique (IDU)
- Toute personne qui met des produits emballés sur le marché français doit adhérer à un éco-organisme (Citeo, Léko…) et obtenir un IDU, **sans seuil minimal** selon les sources consultées.
- Coût cité par une seule source : environ **110 € HT par an** (forfait sous 10 000 unités). **À confirmer.** C'est un **coût fixe**, donc **interdit sans votre accord**.
- Les marketplaces vérifient l'IDU, sinon elles déclarent à votre place et refacturent.
- Les produits **numériques ne génèrent pas d'emballage**.

## Statut de vendeur
- Vendre de façon régulière est une activité professionnelle. Le statut de **micro-entrepreneur** s'obtient gratuitement sur le guichet unique de l'INPI (formalites.entreprise.gouv.fr). Délai d'obtention du SIRET : **à confirmer**, souvent plusieurs jours.
- Franchise en base de TVA : pas de TVA collectée sous les seuils, mais **la TVA payée sur les achats n'est pas récupérable**.
- Cotisations sociales : environ 12,3 % du chiffre d'affaires pour la vente de marchandises et 21,2 % pour les prestations. **Taux et classement du produit numérique à confirmer sur urssaf.fr.**
- Produits numériques vendus à des particuliers d'autres pays de l'UE : TVA du pays du client au-delà de 10 000 € de ventes UE par an (guichet OSS). **En dessous, règles françaises.** Une plateforme « commerçant de référence » (Gumroad, Lemon Squeezy) gère cette TVA à votre place.

## Droit de la consommation (vente à distance)
- **Rétractation de 14 jours** pour les biens physiques.
- **Fonction de rétractation en ligne** obligatoire depuis le **19 juin 2026** (ordonnance 2026-2, décret 2026-3) pour les contrats conclus via une interface en ligne.
- **Contenu numérique** (art. L221-28, 13° du Code de la consommation) : pas de rétractation seulement si le client a donné son **accord préalable exprès** pour une exécution immédiate et **renoncé expressément** à son droit. **La case doit figurer dans le parcours d'achat.**
- Garantie légale de conformité de 2 ans et garantie des vices cachés pour les biens physiques.
- Informations précontractuelles : identité du vendeur, prix TTC, frais de livraison, délais, modalités de rétractation, garanties, médiateur de la consommation (obligatoire pour un vendeur professionnel).
- Si l'information sur la rétractation manque, le délai peut être **prolongé de 12 mois**.

## Données personnelles et cookies (prototype)
- Mesure d'audience **sans cookie ni traceur tiers**, avec un identifiant de session aléatoire. L'objectif est l'exemption de consentement prévue par la CNIL pour la mesure d'audience strictement nécessaire. **À confirmer sur cnil.fr.**
- Le formulaire ne recueille un e-mail **qu'avec une case cochée**, pour une finalité expliquée. La durée de conservation est indiquée sur la page Confidentialité.

## Ce qui empêche une vente physique au 1er novembre
1. Pas de statut de vendeur (SIRET).
2. Pas d'adhésion REP ni d'IDU (coût annuel à autoriser).
3. Aucun fournisseur vérifié : conformité RPSG, fabricant identifié, stock dans l'UE, retours.
4. Pas de conditions générales de vente ni de médiateur.
5. Aucun échantillon contrôlé (coût à autoriser).

**→ Au 1er novembre, aucune vente physique ne peut être ouverte honnêtement.** Seul un test d'intérêt est possible.

## Sources
- [Commission européenne — droit de 3 €](https://commission.europa.eu/news-and-media/news/ensuring-fairness-and-safety-eur3-customs-duty-low-value-parcels-2026-06-29_en) · [TAXUD — guide et texte](https://taxation-customs.ec.europa.eu/news/guidance-and-legal-text-temporary-flat-fee-low-value-imports-which-will-apply-until-1-july-2028-2026-06-08_en) · [nShift](https://nshift.com/blog/eu-customs-changes-ecommerce-2026) · [Baker Tilly](https://bakertillysee.com/insights/major-eu-customs-update-e3-duty-on-low-value-e-commerce-imports-starting-july-2026/) · [Vatai](https://www.vatai.com/blog/eu-3-euro-customs-duty-small-parcels-2026) · [EAS](https://help.easproject.com/hc/en-gb/articles/5276913150495-EU-Customs-VAT-Overhaul-Small-Parcel-Duty-2026) · [Global VAT Compliance](https://www.globalvatcompliance.com/globalvatnews/eu-low-value-customs-duty/)
- [economie.gouv.fr — taxe petits colis](https://www.economie.gouv.fr/particuliers/mes-droits-conso/bien-consommer/tout-savoir-sur-la-taxe-sur-les-petits-colis) · [info.gouv.fr](https://www.info.gouv.fr/actualite/taxe-sur-les-petits-colis-comment-ca-marche) · [ecommerce-nation — 2 € au 1er novembre](https://www.ecommerce-nation.fr/taxe-petits-colis-2-euros-novembre-2026/) · [Orange/L'Express](https://actu.orange.fr/france/taxe-sur-les-petits-colis-ce-qui-va-changer-des-le-1er-novembre-pour-vos-achats-en-ligne-l-express-via-6medias-CNT000002toq4a.html) · [observatoire-ecom](https://observatoire-ecom.com/donnees/taxe-petits-colis-france-2026)
- [Baker McKenzie — RPSG](https://www.bakermckenzie.com/en/insight/publications/resources/product-risk-radar-articles/general-product-safety-regulation) · [koksal.av.tr](https://koksal.av.tr/en/legislation/eu-general-product-safety-regulation-gpsr/) · [Eurofins](https://eurofins.com/consumer-product-testing/media-centre/news/know-the-obligations-for-providers-of-online-marketplaces-under-the-gpsr)
- [Adelphe — IDU marketplace](https://cdn.adelphe.fr/IDENTIFIANT_UNIQUE/ADELPHE_FICHE_REFLEXE_ID_UNIQUE_MARKETPLACE.pdf) · [lamicrobyflo — REP micro-entreprise](https://lamicrobyflo.fr/rep-emballages-micro-entreprise/) · [projetcelsius](https://projetcelsius.com/blog/identifiant-unique-rep.md)
- [francenum — rétractation en 1 clic](https://www.francenum.gouv.fr/guides-et-conseils/developpement-commercial/gestion-de-la-relation-client/la-retractation-en-1-clic) · [CCI Paris IDF](https://www.entreprises.cci-paris-idf.fr/actualites/e-commerce-et-droit-de-retractation-une-nouvelle-obligation-pour-les-professionnels) · [donneespersonnelles.fr — L221-28](https://donneespersonnelles.fr/vente-en-ligne-7-manieres-deviter-le-delai-de-retractation-de-14-jours) · [copeps](https://copeps.fr/actualites/abus-de-droit-en-tva-vente-a-distance/) · [Stripe — TVA numérique](https://stripe.com/fr/resources/more/selling-digital-products-online-in-the-netherlands) · [Shopify — TVA e-commerce](https://www.shopify.com/fr/blog/tva-ecommerce-europe)
