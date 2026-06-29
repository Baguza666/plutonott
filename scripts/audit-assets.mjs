import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import sizeOf from 'image-size';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const MAX_HERO_SIZE = 204800; // 200 KB

export async function checkAssetsDirectory(dirPath) {
  const errors = [];
  const files = await readAllFiles(dirPath);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    // Règle 1: Aucun JPG/PNG
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      errors.push(`Format interdit détecté: ${file}. Seuls WebP, AVIF et SVG sont autorisés.`);
      continue; // Pas besoin de tester les dimensions si rejeté
    }

    if (ext === '.webp' || ext === '.avif') {
      const stats = await stat(file);
      
      // Règle 2: Hero <= 200KB
      if (file.includes('hero') && stats.size > MAX_HERO_SIZE) {
        errors.push(`L'image hero dépasse 200KB: ${file} (${stats.size} octets)`);
      }

      // Règle 3: Dimensions présentes
      try {
        const dimensions = sizeOf(file);
        if (!dimensions.width || !dimensions.height) {
          errors.push(`Image sans dimensions valides: ${file}`);
        }
      } catch (e) {
        errors.push(`Impossible de lire les dimensions de l'image: ${file}`);
      }
    }
  }

  return errors;
}

async function readAllFiles(dir) {
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
  const publicDir = path.join(process.cwd(), 'public');
  if (fs.existsSync(publicDir)) {
    checkAssetsDirectory(publicDir).then(errors => {
      if (errors.length > 0) {
        console.error('Audit d\'assets échoué:');
        errors.forEach(e => console.error(`- ${e}`));
        process.exit(1);
      } else {
        console.log('Audit d\'assets passé avec succès.');
        process.exit(0);
      }
    });
  } else {
    console.log('Aucun dossier public/ trouvé. Passé avec succès.');
  }
}
