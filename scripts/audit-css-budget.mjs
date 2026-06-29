import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import zlib from 'zlib';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const gzip = promisify(zlib.gzip);

const CSS_BUDGET_BYTES = 51200; // 50 KB

export async function calculateTotalCssGzipSize(dirPath) {
  const files = await readAllFiles(dirPath);
  const cssFiles = files.filter(f => f.endsWith('.css'));
  
  if (cssFiles.length === 0) return 0;

  let totalRawCss = Buffer.from('');
  for (const file of cssFiles) {
    const content = fs.readFileSync(file);
    totalRawCss = Buffer.concat([totalRawCss, content]);
  }

  const gzipped = await gzip(totalRawCss);
  return gzipped.length;
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
  const outDir = path.join(process.cwd(), 'out', '_next', 'static');
  const nextDir = path.join(process.cwd(), '.next', 'static');
  
  let targetDir = fs.existsSync(outDir) ? outDir : null;
  if (!targetDir) {
    targetDir = fs.existsSync(nextDir) ? nextDir : null;
  }

  if (targetDir) {
    calculateTotalCssGzipSize(targetDir).then(size => {
      console.log(`Taille totale du CSS gzippé : ${(size / 1024).toFixed(2)} KB`);
      if (size > CSS_BUDGET_BYTES) {
        console.error(`Le CSS dépasse le budget autorisé de 50 KB !`);
        process.exit(1);
      } else {
        console.log(`Audit CSS passé avec succès.`);
        process.exit(0);
      }
    });
  } else {
    console.warn(`Aucun dossier CSS statique trouvé. Vous devez run 'npm run build' avant.`);
    process.exit(0);
  }
}
