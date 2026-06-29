import fs from 'fs';
import path from 'path';
import { PageContent } from './page.types';

export function getNonComparisonStaticPaths(): string[] {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'generated', 'pages.fr.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const pages: PageContent[] = JSON.parse(rawData);
    
    // Filtrer les chemins : ni /, ni /tarifs-grossiste/, ni /comparatif/
    return pages
      .map(p => p.path)
      .filter(p => {
        if (p === '/') return false;
        if (p === '/tarifs-grossiste/') return false;
        if (p.startsWith('/comparatif/')) return false;
        return true;
      });
  } catch (error) {
    console.error('Erreur dans getNonComparisonStaticPaths', error);
    return [];
  }
}

export function getComparisonStaticPaths(): string[] {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'generated', 'pages.fr.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const pages: PageContent[] = JSON.parse(rawData);
    
    // Filtrer les chemins : uniquement /comparatif/... (exclut /comparatif/ lui-même)
    return pages
      .map(p => p.path)
      .filter(p => {
        if (p === '/comparatif/') return false; // L'index exact
        if (p.startsWith('/comparatif/')) return true;
        return false;
      });
  } catch (error) {
    console.error('Erreur dans getComparisonStaticPaths', error);
    return [];
  }
}

