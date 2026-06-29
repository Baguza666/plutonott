import { SERVER_CATALOG } from "./server-catalog.fr";
import { ServerCatalogItem } from "./server-catalog.types";

/**
 * Récupère l'intégralité du catalogue local.
 */
export function getAllServerCatalogItems(): readonly ServerCatalogItem[] {
  return SERVER_CATALOG;
}

/**
 * Récupère uniquement les serveurs actifs ET approuvés publiquement.
 * Cette fonction est destinée à la consommation publique finale (ex: sitemap, API publique).
 */
export function getPublicServerCatalogItems(): ServerCatalogItem[] {
  return SERVER_CATALOG.filter(
    (item) => item.isActive && item.legalStatus === "approved"
  ).sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Récupère les serveurs actifs, qu'ils soient 'approved' ou 'pending'.
 * Cette fonction est destinée aux landing pages (B2B) où un statut neutre
 * peut être affiché pour les entités 'pending'.
 */
export function getLandingServerCatalogItems(): ServerCatalogItem[] {
  return SERVER_CATALOG.filter(
    (item) =>
      item.isActive &&
      (item.legalStatus === "approved" || item.legalStatus === "pending")
  ).sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Récupère un serveur par son slug.
 */
export function getServerCatalogItemBySlug(slug: string): ServerCatalogItem | null {
  const item = SERVER_CATALOG.find((i) => i.slug === slug);
  return item || null;
}

/**
 * Récupère un serveur par son nom commercial exact.
 */
export function getServerCatalogItemByBrand(brand: string): ServerCatalogItem | null {
  const item = SERVER_CATALOG.find((i) => i.serverBrand === brand);
  return item || null;
}
