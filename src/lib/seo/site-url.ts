/**
 * Résout l'URL de base du site pour la génération statique SEO.
 */
export function getSiteUrl(): string {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return 'http://localhost:3000';
  }

  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url || !url.startsWith('https://')) {
    throw new Error('NEXT_PUBLIC_SITE_URL is required in production and must start with https://');
  }

  // Remove trailing slash if present to keep it clean before joining
  return url.replace(/\/$/, '');
}
