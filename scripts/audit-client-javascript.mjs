import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const EXEMPT_FILES = [
  'error.tsx',
  'error.jsx'
];

export async function checkClientComponents(dirPath) {
  const files = await readAllFiles(dirPath);
  const clientFiles = [];
  
  for (const file of files) {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts') && !file.endsWith('.jsx') && !file.endsWith('.js')) {
      continue;
    }
    
    const fileName = path.basename(file);
    if (EXEMPT_FILES.includes(fileName)) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf-8');
    // Vérification basique de la directive 'use client'
    if (content.match(/^['"]use client['"]/m)) {
      clientFiles.push(file);
    }
  }

  return clientFiles;
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
  
  checkClientComponents(srcDir).then(clientFiles => {
    // Si aucun composant métier n'est autorisé en "use client", on échoue dès le premier
    if (clientFiles.length > 0) {
      console.error(`Erreur: Composants client ("use client") non autorisés trouvés :`);
      clientFiles.forEach(f => console.error(`- ${f}`));
      process.exit(1);
    } else {
      console.log(`Audit JS Client passé avec succès. Aucun composant client trouvé (hors exemptions système).`);
      process.exit(0);
    }
  });
}
