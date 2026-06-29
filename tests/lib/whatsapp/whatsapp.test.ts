import { describe, it, expect } from "vitest";
import { normalizeSourcePath } from "@/lib/whatsapp/normalize-source-path";
import { buildWhatsAppMessage } from "@/lib/whatsapp/build-whatsapp-message";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-whatsapp-url";
import { WHATSAPP_BASE_URL } from "@/lib/whatsapp/whatsapp.types";

describe("WhatsApp Module", () => {
  describe("normalizeSourcePath", () => {
    it("conserve un chemin propre commençant par /", () => {
      expect(normalizeSourcePath("/offres")).toBe("/offres");
      expect(normalizeSourcePath("/")).toBe("/");
    });

    it("ajoute un / initial s'il manque", () => {
      expect(normalizeSourcePath("offres")).toBe("/offres");
    });

    it("supprime la query string", () => {
      expect(normalizeSourcePath("/offres?test=1")).toBe("/offres");
    });

    it("supprime le fragment", () => {
      expect(normalizeSourcePath("/offres#section")).toBe("/offres");
      expect(normalizeSourcePath("/offres?test=1#section")).toBe("/offres");
    });

    it("supprime le slash final", () => {
      expect(normalizeSourcePath("/offres/")).toBe("/offres");
      expect(normalizeSourcePath("/catalogue/atlas/")).toBe("/catalogue/atlas");
    });

    it("conserve / si c'est la racine absolue", () => {
      expect(normalizeSourcePath("/")).toBe("/");
    });

    it("rejette ou extrait proprement les URLs absolues externes", () => {
      expect(normalizeSourcePath("https://google.com/test")).toBe("/test");
      expect(normalizeSourcePath("http://evil.com/")).toBe("/");
    });

    it("rejette les schémas dangereux (javascript:, data:)", () => {
      expect(normalizeSourcePath("javascript:alert(1)")).toBe("/");
      expect(normalizeSourcePath("data:text/html,<h1>test</h1>")).toBe("/");
    });
    
    it("rejette les caractères de contrôle", () => {
      expect(normalizeSourcePath("/test\n\r/path")).toBe("/test/path");
    });
  });

  describe("buildWhatsAppMessage", () => {
    it("construit le template 'commercial' avec serveur", () => {
      const msg = buildWhatsAppMessage({
        intent: "commercial",
        sourcePath: "/catalogue",
        pageContext: "Catalogue B2B",
        serverBrand: "Atlas Pro IPTV",
      });
      expect(msg).toBe("Bonjour, je souhaite obtenir des informations sur les crédits Atlas Pro IPTV. Source : /catalogue");
    });

    it("construit le template 'commercial' sans serveur", () => {
      const msg = buildWhatsAppMessage({
        intent: "commercial",
        sourcePath: "/",
        pageContext: "Accueil",
      });
      expect(msg).toBe("Bonjour, je souhaite obtenir des informations sur les offres Pluton OTT. Source : /");
    });

    it("construit le template 'essai'", () => {
      const msg = buildWhatsAppMessage({
        intent: "essai",
        sourcePath: "/test",
        pageContext: "Test",
      });
      expect(msg).toBe("Bonjour, je souhaite connaître les conditions d’une ligne de test de 24 h. Source : /test");
    });

    it("construit le template 'support'", () => {
      const msg = buildWhatsAppMessage({
        intent: "support",
        sourcePath: "/contact",
        pageContext: "panne serveur",
      });
      expect(msg).toBe("Bonjour, j’ai besoin d’aide concernant panne serveur. Source : /contact");
    });

    it("construit le template 'juridique'", () => {
      const msg = buildWhatsAppMessage({
        intent: "juridique",
        sourcePath: "/legal",
        pageContext: "les CGV",
      });
      expect(msg).toBe("Bonjour, j’ai une question concernant les CGV. Source : /legal");
    });

    it("construit le template 'information'", () => {
      const msg = buildWhatsAppMessage({
        intent: "information",
        sourcePath: "/about",
        pageContext: "l'entreprise",
      });
      expect(msg).toBe("Bonjour, je souhaite obtenir des informations concernant l'entreprise. Source : /about");
    });

    it("tronque le pageContext à 160 caractères", () => {
      const longContext = "a".repeat(200);
      const msg = buildWhatsAppMessage({
        intent: "information",
        sourcePath: "/about",
        pageContext: longContext,
      });
      expect(msg).toContain("a".repeat(160));
      expect(msg).not.toContain("a".repeat(161));
    });

    it("tronque le serverBrand à 100 caractères", () => {
      const longBrand = "b".repeat(150);
      const msg = buildWhatsAppMessage({
        intent: "commercial",
        sourcePath: "/test",
        pageContext: "Test",
        serverBrand: longBrand,
      });
      expect(msg).toContain("b".repeat(100));
      expect(msg).not.toContain("b".repeat(101));
    });
  });

  describe("buildWhatsAppUrl", () => {
    it("utilise le constructeur d'URL natif de manière sécurisée", () => {
      const urlString = buildWhatsAppUrl({
        intent: "commercial",
        sourcePath: "/test",
        pageContext: "Test Context",
        serverBrand: "Iron IPTV",
      });
      
      expect(urlString.startsWith(WHATSAPP_BASE_URL)).toBe(true);
      
      // On parse l'URL générée pour vérifier qu'elle est bien formée
      const url = new URL(urlString);
      expect(url.origin + url.pathname).toBe(WHATSAPP_BASE_URL);
      
      // On décode le paramètre text
      const text = url.searchParams.get("text");
      expect(text).toBe("Bonjour, je souhaite obtenir des informations sur les crédits Iron IPTV. Source : /test");
    });
  });
});
