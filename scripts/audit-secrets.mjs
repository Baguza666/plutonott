import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const FORBIDDEN_PATTERNS = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
  'DATABASE_URL',
  'STRIPE_',
  'PAYPAL_',
  'PRIVATE_KEY',
];

const DIRECTORIES_TO_SCAN = [
  path.join(rootDir, 'src'),
  path.join(rootDir, 'out'),
  path.join(rootDir, '.next'),
  path.join(rootDir, 'scripts')
];

// On inclut les .env* de la racine
const ENV_FILES = fs.readdirSync(rootDir).filter(f => f.startsWith('.env') && !f.endsWith('.example'));
const filesToScan = ENV_FILES.map(f => path.join(rootDir, f));

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'cache' || entry.name === 'dev') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else {
      // Éviter de scanner les gros fichiers binaires
      if (entry.name.match(/\.(png|jpg|jpeg|webp|avif|ico|svg|woff2?|map)$/i)) continue;
      filesToScan.push(fullPath);
    }
  }
}

DIRECTORIES_TO_SCAN.forEach(scanDirectory);

let foundSecrets = false;

for (const file of filesToScan) {
  // Ignorer ce script lui-même
  if (file === __filename) continue;
  // Ignorer le dossier test qui référence les mots clés (pour les asserts)
  if (file.includes('tests/security/headers.test.ts')) continue;
  if (file.includes('audit-secrets.mjs')) continue;

  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Exception spéciale pour docs/ (histoire de décision)
    // "Ne pas considérer la documentation de décision historique comme secret, mais la scanner pour valeurs réelles."
    if (file.includes('docs/')) {
      // Dans la doc, on autorise l'expression "SUPABASE_URL" mais pas "SUPABASE_URL=https://..."
      for (const pattern of FORBIDDEN_PATTERNS) {
        const regex = new RegExp(`${pattern}\\s*=\\s*["']?https?:`, 'i');
        const regexVal = new RegExp(`${pattern}\\s*=\\s*["']?[a-zA-Z0-9_-]{10,}`, 'i');
        if (regex.test(content) || regexVal.test(content)) {
          console.error(`❌ Secret RÉEL détecté dans la documentation : ${file} (${pattern}=...)`);
          foundSecrets = true;
        }
      }
      continue;
    }

    for (const pattern of FORBIDDEN_PATTERNS) {
      if (content.includes(pattern)) {
        console.error(`❌ Secret potentiel détecté : '${pattern}' trouvé dans ${file}`);
        foundSecrets = true;
      }
    }
  } catch (err) {
    // Fichier probablement illisible / binaire
  }
}

if (foundSecrets) {
  console.error('🚨 AUDIT ÉCHOUÉ : Des secrets ou patterns interdits ont été trouvés dans le build.');
  process.exit(1);
} else {
  console.log('✅ AUDIT RÉUSSI : Aucun secret détecté dans le code et les artefacts statiques.');
}
