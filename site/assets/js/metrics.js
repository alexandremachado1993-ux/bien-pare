// Calcul des indicateurs du tableau de bord à partir d'événements exportés (CSV).
// Seuls les événements traffic_mode = "visitor" alimentent les indicateurs de décision.

export const SMALL_SAMPLE = 30;

export function parseCsv(text) {
  const rows = [];
  let field = '';
  let row = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  const nonEmpty = rows.filter((r) => r.some((v) => v !== ''));
  if (!nonEmpty.length) return [];
  const [header, ...data] = nonEmpty;
  return data.map((r) => Object.fromEntries(header.map((h, idx) => [h.trim(), r[idx] ?? ''])));
}

export function toCsv(records) {
  if (!records.length) return '';
  const cols = Object.keys(records[0]);
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...records.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}

const count = (list, pred) => list.filter(pred).length;

function groupCount(list, key) {
  const out = {};
  for (const e of list) {
    const k = e[key] || '(non renseigné)';
    out[k] = (out[k] || 0) + 1;
  }
  return out;
}

export function pct(part, total) {
  if (!total) return null;
  return Math.round((part / total) * 1000) / 10;
}

export function computeMetrics(events) {
  const byMode = groupCount(events, 'traffic_mode');
  const visitors = events.filter((e) => e.traffic_mode === 'visitor');
  const sessions = new Set(visitors.map((e) => e.session_id).filter(Boolean));
  const ofType = (name) => visitors.filter((e) => e.event === name);

  const productViews = groupCount(ofType('product_view'), 'product_id');
  const interest = groupCount(ofType('interest_click'), 'product_id');
  const carts = groupCount(ofType('add_to_cart'), 'product_id');

  const byDay = {};
  for (const e of visitors) {
    const day = (e.occurred_at || '').slice(0, 10) || '(sans date)';
    byDay[day] = (byDay[day] || 0) + 1;
  }

  const distinctSessions = sessions.size;
  return {
    excludedByMode: byMode,
    distinctSessions,
    smallSample: distinctSessions < SMALL_SAMPLE,
    pageViews: count(visitors, (e) => e.event === 'page_view'),
    productViews,
    interestClicks: interest,
    addToCart: carts,
    removeFromCart: count(visitors, (e) => e.event === 'remove_from_cart'),
    checkoutStartedSimulated: count(visitors, (e) => e.event === 'checkout_started'),
    feedbackSubmitted: count(visitors, (e) => e.event === 'feedback_submitted'),
    digitalDownloads: count(visitors, (e) => e.event === 'digital_download'),
    byUniverse: groupCount(visitors.filter((e) => e.universe), 'universe'),
    byProductType: groupCount(visitors.filter((e) => e.product_type), 'product_type'),
    byVariant: groupCount(visitors.filter((e) => e.variant), 'variant'),
    byDay,
    // Garde-fou : un panier simulé n'est jamais une vente.
    paidOrders: 0,
  };
}
