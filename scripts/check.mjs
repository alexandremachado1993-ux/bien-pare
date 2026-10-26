// Vérifications statiques sans dépendance : secrets, garde-fous commerciaux, syntaxe JS.
// Usage : npm run check   (code de sortie 1 si un problème bloquant est trouvé)
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SKIP = new Set(['.git', 'node_modules', 'product-private', 'reports', 'test-results']);
const problems = [];
const warnings = [];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

const files = await walk(ROOT);
const textFiles = files.filter((f) => ['.js', '.mjs', '.cjs', '.html', '.css', '.json', '.md', '.sql', '.yml', '.example'].includes(extname(f)) || f.endsWith('.env.example'));

const SECRET_PATTERNS = [
  [/sb_secret_[A-Za-z0-9_-]{10,}/, 'clé secrète Supabase'],
  [/service_role/i, 'mention de la clé service_role (vérifier qu’aucune valeur n’est présente)'],
  [/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/, 'jeton JWT'],
  [/sk_(live|test)_[A-Za-z0-9]{10,}/, 'clé secrète Stripe'],
  [/gh[pousr]_[A-Za-z0-9]{30,}/, 'jeton GitHub'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'clé privée'],
];

for (const file of textFiles) {
  const rel = relative(ROOT, file);
  const text = await readFile(file, 'utf8');
  for (const [re, label] of SECRET_PATTERNS) {
    if (!re.test(text)) continue;
    // Les docs et ce script peuvent citer le nom service_role sans valeur.
    if (label.startsWith('mention') && (rel.endsWith('.md') || rel.startsWith('scripts/') || rel.endsWith('.sql') || rel === '.env.example')) continue;
    problems.push(`${rel} : ${label}`);
  }
  if (rel.startsWith('site/') && /purchase_completed/.test(text) && !rel.endsWith('analytics.js')) {
    problems.push(`${rel} : référence à purchase_completed hors du garde-fou`);
  }
  if (rel.startsWith('site/') && rel.endsWith('.html') && /(acheter|payer)\s+maintenant/i.test(text)) {
    problems.push(`${rel} : appel à l’achat alors que rien n’est en vente`);
  }
  if (rel.startsWith('site/') && /\b\d+\s+(ventes|clients satisfaits|avis clients)\b/i.test(text)) {
    problems.push(`${rel} : compteur de ventes ou d’avis (interdit sans données réelles)`);
  }
}

const envExample = await readFile(join(ROOT, '.env.example'), 'utf8').catch(() => '');
for (const line of envExample.split('\n')) {
  if (/^[A-Z_]+=.+/.test(line.trim())) problems.push(`.env.example : valeur renseignée (${line.split('=')[0]}) — ce fichier ne doit contenir que des noms`);
}
if (files.some((f) => /(^|\/)\.env$/.test(f))) problems.push('.env présent dans le dépôt (doit rester hors Git)');

const legal = await readFile(join(ROOT, 'site/mentions-legales.html'), 'utf8');
if (legal.includes('À COMPLÉTER')) warnings.push('mentions-legales.html contient encore « À COMPLÉTER » : à remplir avant toute publication.');

const config = await readFile(join(ROOT, 'site/assets/js/config.js'), 'utf8');
if (/supabaseUrl:\s*''/.test(config)) warnings.push('Stockage non configuré : formulaire et mesure d’audience inactifs (comportement attendu tant que Supabase n’est pas branché).');

for (const file of files.filter((f) => ['.js', '.mjs', '.cjs'].includes(extname(f)))) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (err) {
    problems.push(`${relative(ROOT, file)} : erreur de syntaxe\n${err.stderr}`);
  }
}

for (const w of warnings) console.log(`AVERTISSEMENT  ${w}`);
for (const p of problems) console.log(`PROBLÈME       ${p}`);
console.log(`\n${textFiles.length} fichiers analysés — ${problems.length} problème(s), ${warnings.length} avertissement(s).`);
process.exit(problems.length ? 1 : 0);
