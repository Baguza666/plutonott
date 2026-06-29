export const dynamic = "force-static";

import { MetadataRoute } from 'next';
import { getSiteUrl } from '../lib/seo/site-url';
import { getNonComparisonStaticPaths, getComparisonStaticPaths } from '../content/route-groups';
import { getPublicationStatus } from '../content/get-publication-status';
import { SERVERS_LIST } from '../content/servers/servers.data';

// Pages à forte intention commerciale : priorité accrue dans le sitemap
const KEY_CONVERSION_PATHS = new Set([
  '/devenir-revendeur-iptv/',
  '/programme-master-reseller/',
  '/fonctionnement-panel/',
  '/integration-api-revendeur/',
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Ajouter la page d'accueil
  sitemapEntries.push({
    url: `${siteUrl}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  });

  // 2. Ajouter la page tarifs (statut public)
  sitemapEntries.push({
    url: `${siteUrl}/tarifs-grossiste/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  });

  // 3. Ajouter l'index comparatif
  sitemapEntries.push({
    url: `${siteUrl}/comparatif/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  });

  // 4. Ajouter les pages comparatives (uniquement celles approuvées)
  const comparisonPaths = getComparisonStaticPaths();
  comparisonPaths.forEach((path) => {
    const statusObj = getPublicationStatus(path);
    if (statusObj?.status === 'approved') {
      sitemapEntries.push({
        url: `${siteUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  });

  // 5. Ajouter les pages serveurs dédiées (Fort SEO)
  SERVERS_LIST.forEach((server) => {
    sitemapEntries.push({
      url: `${siteUrl}/serveurs/${server.urlSlug}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });

  // 6. Ajouter l'index blog
  sitemapEntries.push({
    url: `${siteUrl}/blog/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  });

  // 7. Ajouter les pages éditoriales (qui sont en statut 'approved')
  const contentPaths = getNonComparisonStaticPaths();
  contentPaths.forEach((path) => {
    const statusObj = getPublicationStatus(path);
    if (statusObj?.status !== 'approved') return;

    const isBlogArticle = path.startsWith('/blog/');
    const isKeyConversionPage = KEY_CONVERSION_PATHS.has(path);

    sitemapEntries.push({
      url: `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`,
      lastModified: new Date(),
      changeFrequency: isBlogArticle ? 'weekly' : 'monthly',
      priority: isKeyConversionPage ? 0.8 : isBlogArticle ? 0.65 : 0.6,
    });
  });

  return sitemapEntries;
}
