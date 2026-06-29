import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

// On duplique la denylist ici pour le script mjs standalone si on ne peut pas importer le TS facilement
const ENGLISH_DENYLIST = [
  'Buy now',
  'Checkout',
  'Learn more',
  'Contact us',
  'Read more',
  'Submit',
  'Loading',
  'Error',
  'Login',
  'Sign in',
  'Cart',
  'Add to cart',
  'Purchase',
  'Get started'
];

export async function checkFrenchUI(dirPath) {
  const files = await readAllFiles(dirPath);
  const errors = [];
  
  for (const file of files) {
    if (!file.match(/\.(ts|tsx|json)$/)) continue;
    if (file.includes('node_modules') || file.includes('.next')) continue;
    if (file.includes('french-allowlist.ts')) continue;
    if (file.endsWith('error.tsx')) continue;
    
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Ignorer les commentaires et lignes de code courantes contenant "error" pour éviter les faux positifs
      if (line.trim().startsWith('//')) continue;
      if (line.includes('console.error') || line.includes('new Error') || line.includes('function Error') || line.includes(' error:') || line.includes(' error ') || line.match(/error\s*=/)) continue;
      // JSON / Type logs
      if (line.includes('"error"')) continue;
      if (line.includes("'error'")) continue;
      
      for (const term of ENGLISH_DENYLIST) {
        const regex = new RegExp(`\\b${term}\\b`, 'i');
        if (regex.test(line)) {
          // Exception spécifique pour le mot Error qui est un mot clé TS/JS
          if (term.toLowerCase() === 'error') {
            if (line.includes('throw') || line.includes('catch') || line.includes('Error &') || line.includes('Error {') || line.includes('<Error') || line.includes('import ') || line.includes('export ') || line.includes('Error(')) continue;
          }
          errors.push(`Terme anglais non autorisé "${term}" trouvé dans : ${file} (ligne ${i + 1})`);
        }
      }
    }
  }

  return errors;
}

async function readAllFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  
  let results = [];
  const list = await readdir(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);
    if (stats.isDirectory()) {
      results = results.concat(await readAllFiles(filePath));
    } else {
      results.push(filePath);
    }
  }
  return results;
}

// Exécution standalone
if (process.argv[1] && process.argv[1] === new URL(import.meta.url).pathname) {
  const srcDir = path.join(process.cwd(), 'src');
  
  checkFrenchUI(srcDir).then(errors => {
    if (errors.length > 0) {
      console.error(`Audit de Langue (Français UI) échoué :`);
      errors.forEach(e => console.error(`- ${e}`));
      process.exit(1);
    } else {
      console.log(`Audit de Langue passé avec succès. Aucune expression UI anglaise interdite détectée.`);
      process.exit(0);
    }
  });
}
