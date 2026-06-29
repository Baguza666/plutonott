import { describe, it, expect } from "vitest";
import { SERVER_CATALOG } from "@/content/catalog/server-catalog.fr";
import {
  getAllServerCatalogItems,
  getPublicServerCatalogItems,
  getLandingServerCatalogItems,
  getServerCatalogItemBySlug,
  getServerCatalogItemByBrand,
} from "@/content/catalog/get-server-catalog";

describe("Static Server Catalog", () => {
  it("contient exactement cinq entrées initiales", () => {
    expect(SERVER_CATALOG.length).toBe(5);
  });

  it("les cinq slugs attendus existent", () => {
    const slugs = SERVER_CATALOG.map((i) => i.slug);
    expect(slugs).toContain("atlas-pro-iptv");
    expect(slugs).toContain("iron-iptv");
    expect(slugs).toContain("trex-iptv");
    expect(slugs).toContain("crystal-ott");
    expect(slugs).toContain("lynx-iptv");
  });

  it("les slugs sont uniques", () => {
    const slugs = SERVER_CATALOG.map((i) => i.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("les displayOrder sont uniques", () => {
    const orders = SERVER_CATALOG.map((i) => i.displayOrder);
    const uniqueOrders = new Set(orders);
    expect(uniqueOrders.size).toBe(orders.length);
  });

  it("getServerCatalogItemBySlug retourne la bonne entrée", () => {
    const item = getServerCatalogItemBySlug("atlas-pro-iptv");
    expect(item).not.toBeNull();
    expect(item?.slug).toBe("atlas-pro-iptv");
    expect(item?.serverBrand).toBe("Atlas Pro IPTV");
  });

  it("getServerCatalogItemByBrand retourne la bonne entrée", () => {
    const item = getServerCatalogItemByBrand("Atlas Pro IPTV");
    expect(item).not.toBeNull();
    expect(item?.slug).toBe("atlas-pro-iptv");
  });

  it("getPublicServerCatalogItems filtre correctement", () => {
    // Par défaut tous sont 'pending', donc getPublicServerCatalogItems() doit retourner 0
    const publicItems = getPublicServerCatalogItems();
    // Test initial : tout est pending donc length === 0
    // Si on ajoute une entrée fictive avec push (non autorisé sur const, on teste la logique)
    expect(publicItems.every(i => i.isActive && i.legalStatus === "approved")).toBe(true);
  });

  it("getLandingServerCatalogItems filtre correctement et trie par displayOrder", () => {
    const landingItems = getLandingServerCatalogItems();
    // Par défaut tous sont pending et isActive=true, donc 5
    expect(landingItems.length).toBe(5);
    expect(landingItems.every(i => i.isActive && (i.legalStatus === "approved" || i.legalStatus === "pending"))).toBe(true);
    
    // Vérifier le tri
    const isSorted = landingItems.every((item, i) => i === 0 || landingItems[i - 1].displayOrder <= item.displayOrder);
    expect(isSorted).toBe(true);
  });

  it("aucun champ tarifaire n'existe dans les types ou les données", () => {
    const firstItem = SERVER_CATALOG[0] as any;
    expect(firstItem.price).toBeUndefined();
    expect(firstItem.credits).toBeUndefined();
    expect(firstItem.currency).toBeUndefined();
  });
});
