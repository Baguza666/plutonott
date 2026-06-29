import { Metadata } from 'next';
import { getSiteUrl } from './site-url';

interface GenerateMetadataOptions {
  readonly title: string;
  readonly description?: string;
  readonly path: string;
  readonly status: 'approved' | 'review_required' | 'blocked';
}

/**
 * Génère les métadonnées SEO standards pour toutes les pages statiques.
 */
export function generatePageMetadata(options: GenerateMetadataOptions): Metadata {
  const { title, description, path, status } = options;
  const siteUrl = getSiteUrl();

  // Assurer un trailing slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalPath = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  const absoluteCanonical = `${siteUrl}${canonicalPath === '//' ? '/' : canonicalPath}`;

  const finalTitle = title.endsWith('| Pluton OTT') ? title : `${title} | Pluton OTT`;

  const isIndexable = status === 'approved';

  const finalDescription = description || 'Découvrez nos infrastructures B2B adaptées aux professionnels.';

  return {
    title: { absolute: finalTitle },
    description: finalDescription,
    alternates: {
      canonical: absoluteCanonical,
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: absoluteCanonical,
      siteName: 'Pluton OTT',
      locale: 'fr_FR',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Pluton OTT — Plateforme B2B pour revendeurs IPTV',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [`${siteUrl}/og-image.png`],
    },
    robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}
