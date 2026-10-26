# Économie, canaux de vente et classement des produits

Vérifié le 26/10/2026, par recherche web. Les tarifs proviennent surtout de guides tiers : **revérifiez dans l'espace vendeur avant de vous inscrire.**

## 1. Canaux de vente pour les produits physiques (France)

| Canal | Coût fixe | Commission (sources tierces) | Dropshipping | Compatible 0 € ? |
|---|---|---|---|---|
| **eBay.fr pro** | 0 € sans boutique | ~9 % en accessoires auto (une source dit ~12 %) + ~0,30-0,35 € par annonce et ~0,35 € par commande ; refonte des frais annoncée en juillet 2026 | **Autorisé seulement via un grossiste ou fabricant**, interdit depuis un autre détaillant ; limites de vente pour les nouveaux comptes | **Oui** (après SIRET, REP et fournisseur) |
| **Amazon.fr** | Offre Individuel : 0 € / mois + 0,99 € HT par article. Offre Pro : 39 € HT / mois | 8-15 % le plus souvent | Autorisé si **vous êtes le seul vendeur identifié** (bordereaux, factures, emballage) ; interdit d'acheter chez un autre détaillant | Offre Individuel : oui. Offre Pro : **non** (abonnement) |
| **Cdiscount** | ~39,99 € HT / mois | ~6-15 % | Non vérifié | **Non** (abonnement) |
| **Leboncoin pro** | Abonnement sur devis | 3-7 % via le paiement sécurisé | Non vérifié | Incertain |
| Boutique indépendante (Shopify, etc.) | Abonnement | — | — | **Non** au départ |

## 2. Plateformes pour le produit numérique (sans abonnement)

| Plateforme | Frais (sources tierces) | Gestion de la TVA | Trafic propre | Remarques |
|---|---|---|---|---|
| **Payhip (offre gratuite)** | **5 %** + frais Stripe / PayPal (~1,5 à 2,9 % + 0,25-0,30 €) | Calcule et collecte la TVA UE et UK ; n'est pas « commerçant de référence » | Faible | Le plus économique. Des avis signalent des fermetures de boutique inattendues |
| Gumroad | 10 % + 0,50 $ par vente directe ; **30 %** via sa vitrine « Discover » | Commerçant de référence (TVA mondiale) depuis le 01/01/2025 | Faible à moyen | Le 0,50 $ fixe pèse lourd sur un produit à 7 € |
| Lemon Squeezy | 5 % + 0,50 $ | Commerçant de référence | Nul | Pensé pour les logiciels |
| Etsy | 0,20 $ par annonce + 6,5 % + frais de paiement | Collecte la TVA UE pour l'acheteur (à confirmer) | **Fort** (recherche interne) | 0,20 $ par annonce = **coût, à autoriser**. Bon canal d'acquisition gratuit ensuite |

**Recommandation :** Payhip gratuit comme lien de paiement depuis le site, puis Etsy en option, avec votre accord, pour le trafic. Gumroad reste l'alternative si vous voulez qu'une plateforme porte entièrement la TVA.

## 3. Marge contributive (script `npm run margins`)

Hypothèses : micro-entrepreneur en franchise de TVA ; cotisations de 12,3 % (marchandises) ou 21,2 % (numérique, à confirmer) ; provision pour retours de 2 à 12 % ; **prix fournisseurs supposés**, pas de devis. **Ce n'est pas un bénéfice net** : les coûts fixes (REP ~110 €/an à confirmer, échantillons, temps passé) ne sont pas déduits.

| Produit / scénario | Prudent | Intermédiaire | Optimiste |
|---|---|---|---|
| Sac câble VE, **entrepôt UE**, eBay (24,90 à 27,90 €) | 0,76 € | 4,50 € | 9,71 € |
| Sac câble VE, **expédié de Chine**, eBay (+3 € de droit + 2 € de frais + TVA import) | **−4,94 €** | **−2,04 €** | 2,98 € |
| Housse de selle, fournisseur UE, eBay (34,90 à 39,90 €) | **−3,72 €** | 2,32 € | 9,16 € |
| Pack Concours Serein, Payhip (4,90 / 6,90 / 8,90 €) | 2,93 € | 4,46 € | 6,80 € |

**Ventes mensuelles nécessaires pour 500 € de marge contributive :**
- Sac câble VE (entrepôt UE) : 52 à 662.
- Housse de selle : 55 ventes au mieux, impossible dans le scénario prudent.
- Pack numérique : **74 à 171**.

L'objectif de 500 €/mois n'est **pas atteignable avec un seul produit à court terme** : il faudra une gamme et du trafic. Rien ne garantit qu'il soit atteint.

## 4. Classement sur 100 (grille demandée)

Pondération : demande 20 · marge 20 · fournisseur 15 · acquisition 15 · budget 0 € 10 · logistique 10 · conformité 10. Une donnée absente **abaisse la confiance** ; elle n'est pas remplacée par une note inventée.

### Automobile
| # | Produit | Dem. | Marge | Fourn. | Acq. | 0 € | Log. | Conf. | **Total** | Confiance |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Sac de rangement pour câble de recharge** | 10 | 9 | 6 | 9 | 5 | 8 | 9 | **56** | Faible (pas de volume, fournisseur non vérifié) |
| 2 | Organiseur de coffre pliable | 16 | 5 | 6 | 5 | 5 | 4 | 9 | **50** | Moyenne (beaucoup d'avis, saturé) |
| 3 | Organiseur de dossier de siège | 12 | 2 | 6 | 6 | 5 | 7 | 7 | **45** | Moyenne |
| — | Support de téléphone | — | — | — | — | — | — | — | Écarté | Sécurité de conduite et saturation |

### Équitation
| # | Produit | Dem. | Marge | Fourn. | Acq. | 0 € | Log. | Conf. | **Total** | Confiance |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Housse de transport pour selle** | 10 | 8 | 3 | 11 | 2 | 5 | 9 | **48** | Faible (aucun fournisseur à l'unité trouvé) |
| 2 | Sac de pansage | 12 | 4 | 3 | 11 | 2 | 6 | 9 | **47** | Moyenne (Decathlon à 25 € pèse sur le prix) |
| 3 | Sac à foin en toile (transport) | 10 | 7 | 3 | 10 | 2 | 5 | 6 | **43** | Faible (risque d'accroche si filet) |

### Produits numériques (comparés à part : pas de fournisseur)
| Produit | Atout | Choix |
|---|---|---|
| **Pack Concours Serein (équitation)** | Communauté soudée et facile à atteindre gratuitement (clubs, groupes, réseaux), offre française rare, aucun stock, conformité simple | **Prioritaire, terminé** |
| Carnet d'entretien & dépenses auto | Public très large, mais nombreuses applications gratuites concurrentes | En préparation (test d'intérêt) |

## 5. Recommandation pour le test initial
- **Automobile, produit physique :** sac de rangement pour câble de recharge. **Test d'intérêt uniquement.** Ensuite, avec votre accord, vérifier dans le catalogue CJdropshipping la disponibilité en entrepôt France ou UE et les informations RPSG.
- **Équitation, produit physique :** housse de transport pour selle. **Test d'intérêt uniquement.** Aucun fournisseur livrant à l'unité n'est identifié à ce stade.
- **Numérique :** le **Pack Concours Serein** peut être vendu dès que vous disposez d'un SIRET et d'un compte Payhip, et que les conditions de vente sont publiées.

## Sources
[salehoo — eBay](https://www.salehoo.com/learn/ebay-dropshipping) · [Amazon Seller Forums — dropshipping](https://sellercentral.amazon.com/forums/t/important-drop-shipping-policy-update/777439) · [sellersprite](https://www.sellersprite.com/en/blog/amazon-dropshipping-policy) · [repricer — frais Amazon](https://www.repricer.com/fr/blog/amazon-seller-fees/) · [leptidigital](https://www.leptidigital.fr/e-commerce/frais-amazon-25072/) · [legalplace — eBay](https://www.legalplace.fr/guides/vendre-ebay/) · [margeo — eBay](https://margeoapp.com/blog/commission-ebay-2026) · [beancount — refonte eBay](https://beancount.io/fr/blog/2026/07/28/ebay-seller-fee-overhaul-flat-rate-refurbished-guide) · [margeo — Cdiscount](https://margeoapp.com/blog/vendre-sur-cdiscount-marketplace-revendeur) · [ChannelEngine — Cdiscount](https://support.channelengine.com/hc/en-us/articles/21087078328861) · [margeo — Leboncoin](https://margeoapp.com/blog/frais-leboncoin-2026-vendeur-particulier-pro) · [wearefounders — comparatif](https://www.wearefounders.uk/best-platforms-for-selling-digital-products-in-2026/) · [dodopayments — Payhip](https://dodopayments.com/blogs/payhip-review) · [cartmango — Payhip](https://cartmango.com/payhip-review/) · [checkoutpage — Gumroad](https://checkoutpage.com/blog/gumroad-fees) · [schoolmaker — Gumroad](https://schoolmaker.com/blog/gumroad-pricing)
