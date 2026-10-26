// Calcul de marge contributive par vente, en 3 scénarios. TOUTES les valeurs
// d'entrée sont des hypothèses à remplacer par des devis/tarifs vérifiés
// (voir research/ECONOMICS.md). Ce n'est pas un bénéfice net : les coûts fixes
// (REP emballages, comptabilité, temps passé, échantillons) ne sont pas inclus.
// Usage : npm run margins

export function contributionMargin(s) {
  const platform = s.price * s.platformPct + s.platformFixed;
  const payment = s.price * s.paymentPct + s.paymentFixed;
  const returns = s.price * s.returnRate;
  const social = s.price * s.socialRate; // cotisations micro-entrepreneur, proportionnelles au CA
  const costs = s.supplier + s.shipping + s.importFees + platform + payment + returns + social;
  const margin = s.price - costs;
  return {
    price: s.price,
    costs: round(costs),
    margin: round(margin),
    marginPct: round((margin / s.price) * 100),
    salesFor500: margin > 0 ? Math.ceil(500 / margin) : Infinity,
  };
}

const round = (n) => Math.round(n * 100) / 100;

// Micro-entrepreneur en franchise de TVA : pas de TVA collectée, TVA payée non récupérable.
// Taux de cotisations : 12,3 % (vente de marchandises) / 21,2 % (prestations) — À CONFIRMER sur urssaf.fr.
export const SCENARIOS = {
  'Sac câble de recharge (physique, entrepôt UE, eBay)': {
    prudent: { price: 24.9, supplier: 11, shipping: 5, importFees: 0, platformPct: 0.09, platformFixed: 0.35, paymentPct: 0, paymentFixed: 0, returnRate: 0.1, socialRate: 0.123 },
    intermediaire: { price: 24.9, supplier: 9, shipping: 4, importFees: 0, platformPct: 0.09, platformFixed: 0.35, paymentPct: 0, paymentFixed: 0, returnRate: 0.07, socialRate: 0.123 },
    optimiste: { price: 27.9, supplier: 7, shipping: 3.5, importFees: 0, platformPct: 0.09, platformFixed: 0.35, paymentPct: 0, paymentFixed: 0, returnRate: 0.05, socialRate: 0.123 },
  },
  'Sac câble de recharge (physique, expédié de Chine, eBay)': {
    // 3 € de droit forfaitaire + 2 € de frais de traitement UE (1 catégorie d'article) + TVA import 20 % sur (valeur + transport + droit).
    prudent: { price: 24.9, supplier: 7, shipping: 6, importFees: 8.2, platformPct: 0.09, platformFixed: 0.35, paymentPct: 0, paymentFixed: 0, returnRate: 0.12, socialRate: 0.123 },
    intermediaire: { price: 24.9, supplier: 6, shipping: 5, importFees: 7.8, platformPct: 0.09, platformFixed: 0.35, paymentPct: 0, paymentFixed: 0, returnRate: 0.1, socialRate: 0.123 },
    optimiste: { price: 27.9, supplier: 5, shipping: 4, importFees: 7.4, platformPct: 0.09, platformFixed: 0.35, paymentPct: 0, paymentFixed: 0, returnRate: 0.08, socialRate: 0.123 },
  },
  'Housse de selle (physique, fournisseur UE à trouver, eBay)': {
    prudent: { price: 34.9, supplier: 20, shipping: 7, importFees: 0, platformPct: 0.1, platformFixed: 0.35, paymentPct: 0, paymentFixed: 0, returnRate: 0.1, socialRate: 0.123 },
    intermediaire: { price: 34.9, supplier: 16, shipping: 6, importFees: 0, platformPct: 0.1, platformFixed: 0.35, paymentPct: 0, paymentFixed: 0, returnRate: 0.07, socialRate: 0.123 },
    optimiste: { price: 39.9, supplier: 14, shipping: 5.5, importFees: 0, platformPct: 0.1, platformFixed: 0.35, paymentPct: 0, paymentFixed: 0, returnRate: 0.05, socialRate: 0.123 },
  },
  'Pack Concours Serein (numérique, Payhip gratuit)': {
    // Payhip 5 % + frais Stripe/PayPal estimés ; remboursements rares mais possibles.
    prudent: { price: 4.9, supplier: 0, shipping: 0, importFees: 0, platformPct: 0.05, platformFixed: 0, paymentPct: 0.029, paymentFixed: 0.3, returnRate: 0.05, socialRate: 0.212 },
    intermediaire: { price: 6.9, supplier: 0, shipping: 0, importFees: 0, platformPct: 0.05, platformFixed: 0, paymentPct: 0.025, paymentFixed: 0.25, returnRate: 0.03, socialRate: 0.212 },
    optimiste: { price: 8.9, supplier: 0, shipping: 0, importFees: 0, platformPct: 0.05, platformFixed: 0, paymentPct: 0.015, paymentFixed: 0.25, returnRate: 0.02, socialRate: 0.123 },
  },
};

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  for (const [product, scenarios] of Object.entries(SCENARIOS)) {
    console.log(`\n${product}`);
    for (const [name, s] of Object.entries(scenarios)) {
      const r = contributionMargin(s);
      const sales = Number.isFinite(r.salesFor500) ? `${r.salesFor500} ventes/mois pour 500 € de marge` : 'marge négative';
      console.log(`  ${name.padEnd(14)} prix ${r.price.toFixed(2)} € | coûts variables ${r.costs.toFixed(2)} € | marge ${r.margin.toFixed(2)} € (${r.marginPct} %) | ${sales}`);
    }
  }
  console.log('\nRappel : hypothèses non vérifiées auprès de fournisseurs. Coûts fixes non inclus.');
}
