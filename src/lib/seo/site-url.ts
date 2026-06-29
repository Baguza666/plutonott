/**
 * Résout l'URL de base du site pour la génération statique SEO.
 */
export function getSiteUrl(): string {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return 'http://localhost:3000';
  }

  let url = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  
  if (!url) {
    url = 'https://plutonott.vercel.app'; // Fallback de sécurité
  }

  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }

  // Remove trailing slash if present to keep it clean before joining
  return url.replace(/\/$/, '');
}
