import fs from 'fs';
import path from 'path';
import { PageContent } from './page.types';

// En mode Next.js Server Components, lire au build-time ou runtime (mais on force le statique)
export function getPageByPath(pagePath: string): PageContent | undefined {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'generated', 'pages.fr.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const pages: PageContent[] = JSON.parse(rawData);
    return pages.find(p => p.path === pagePath);
  } catch (error) {
    console.error('Erreur lors de la lecture de pages.fr.json', error);
    return undefined;
  }
}
