import { parseCsv, toCsv, computeMetrics, pct } from './metrics.js';
import { PRODUCTS } from './products.js';

const out = document.querySelector('[data-output]');
const status = document.querySelector('[data-status]');
const names = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.shortName]));

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

function table(title, counts, total, label = (k) => k) {
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!rows.length) return `<h2>${title}</h2><p class="empty">Aucune donnée.</p>`;
  return `<h2>${title}</h2><div class="table-wrap"><table>
    <thead><tr><th>Élément</th><th>Effectif</th><th>Part</th></tr></thead>
    <tbody>${rows.map(([k, v]) => `<tr><td>${esc(label(k))}</td><td>${v}</td><td>${pct(v, total) ?? '—'} %</td></tr>`).join('')}</tbody>
  </table></div>`;
}

const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);

function render(events) {
  const m = computeMetrics(events);
  const kpi = (label, value) => `<div class="kpi"><span class="muted">${label}</span><b>${value}</b></div>`;
  out.innerHTML = `
    ${m.smallSample ? `<p class="notice" data-tone="warning">Échantillon faible (${m.distinctSessions} sessions visiteurs, moins de 30) : les résultats ne sont pas concluants.</p>` : ''}
    <div class="kpis">
      ${kpi('Sessions visiteurs distinctes', m.distinctSessions)}
      ${kpi('Pages vues', m.pageViews)}
      ${kpi('Vues produit', sum(m.productViews))}
      ${kpi('Clics d’intérêt', sum(m.interestClicks))}
      ${kpi('Ajouts sélection (simulés)', sum(m.addToCart))}
      ${kpi('Commandes simulées', m.checkoutStartedSimulated)}
      ${kpi('Avis envoyés', m.feedbackSubmitted)}
      ${kpi('Aperçus téléchargés', m.digitalDownloads)}
      ${kpi('Commandes payées', m.paidOrders)}
    </div>
    <p class="muted">Sessions = onglets distincts (identifiant de session), pas des personnes : une même personne peut compter plusieurs fois. Aucun taux de conversion n’est affiché pour cette raison.</p>
    ${table('Vues par produit', m.productViews, sum(m.productViews), (k) => names[k] || k)}
    ${table('Clics d’intérêt par produit', m.interestClicks, sum(m.interestClicks), (k) => names[k] || k)}
    ${table('Ajouts à la sélection par produit (simulés)', m.addToCart, sum(m.addToCart), (k) => names[k] || k)}
    ${table('Répartition par univers (événements)', m.byUniverse, sum(m.byUniverse))}
    ${table('Répartition physique / numérique (événements)', m.byProductType, sum(m.byProductType))}
    ${table('Variantes', m.byVariant, sum(m.byVariant))}
    ${table('Événements visiteurs par jour', m.byDay, sum(m.byDay))}
    ${table('Événements exclus ou inclus par mode de trafic', m.excludedByMode, events.length)}
    <p><button type="button" class="btn btn-secondary" data-export>Exporter les événements visiteurs (CSV)</button></p>`;
  out.querySelector('[data-export]').addEventListener('click', () => {
    const blob = new Blob([toCsv(events.filter((e) => e.traffic_mode === 'visitor'))], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'evenements-visiteurs.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

document.querySelector('[data-csv]').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const events = parseCsv(await file.text());
  status.hidden = false;
  if (!events.length || !('event' in events[0]) || !('traffic_mode' in events[0])) {
    status.dataset.tone = 'error';
    status.textContent = 'Fichier non reconnu : colonnes « event » et « traffic_mode » attendues.';
    out.innerHTML = '';
    return;
  }
  status.dataset.tone = 'success';
  status.textContent = `${events.length} événements chargés.`;
  render(events);
});
