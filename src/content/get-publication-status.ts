import fs from 'fs';
import path from 'path';
import { PublicationStatus } from './policy/content-policy.types';

export function getPublicationStatus(pagePath: string): PublicationStatus | undefined {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'generated', 'publication-status.fr.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const statuses: PublicationStatus[] = JSON.parse(rawData);
    return statuses.find(s => s.path === pagePath);
  } catch (error) {
    console.error('Erreur lors de la lecture de publication-status.fr.json', error);
    return undefined;
  }
}
