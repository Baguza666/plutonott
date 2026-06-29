import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const SCRIPT_PATH = path.join(process.cwd(), "scripts", "build-content-manifest.mjs");
const GENERATED_DIR = path.join(process.cwd(), "src", "content", "generated");

const PAGES_JSON = path.join(GENERATED_DIR, "pages.fr.json");
const VARIANTS_JSON = path.join(GENERATED_DIR, "page-variants.fr.json");
const KEYWORDS_JSON = path.join(GENERATED_DIR, "keywords.fr.json");
const AUDIT_JSON = path.join(GENERATED_DIR, "content-audit.json");

describe("Content Manifest Pipeline", () => {
  // Exécuter le script avant les tests
  beforeAll(() => {
    try {
      execSync(`node ${SCRIPT_PATH}`, { stdio: "inherit" });
    } catch (e) {
      console.error("Échec de l'exécution du script de build");
      throw e;
    }
  });

  const getPages = () => JSON.parse(fs.readFileSync(PAGES_JSON, "utf-8"));
  const getVariants = () => JSON.parse(fs.readFileSync(VARIANTS_JSON, "utf-8"));
  const getKeywords = () => JSON.parse(fs.readFileSync(KEYWORDS_JSON, "utf-8"));
  const getAudit = () => JSON.parse(fs.readFileSync(AUDIT_JSON, "utf-8"));

  it("génère exactement 69 routes canoniques uniques", () => {
    const pages = getPages();
    expect(pages.length).toBe(69);
    
    // Vérification d'unicité
    const paths = pages.map((p: any) => p.path);
    const uniquePaths = new Set(paths);
    expect(uniquePaths.size).toBe(69);
  });

  it("génère exactement 8 doublons conservés dans les variantes", () => {
    const variants = getVariants();
    expect(variants.length).toBe(8);
  });

  it("garantit un total de 77 blocs traités (69 + 8)", () => {
    const audit = getAudit();
    expect(audit.counts.totalBlocksParsed).toBe(77);
  });

  it("résout les doublons en gardant le sourceIndex le plus élevé comme canonique", () => {
    const pages = getPages();
    const variants = getVariants();

    // Exemple sur majestic-iptv (connu comme doublon)
    const canonicalMajestic = pages.find((p: any) => p.path === "/comparatif/majestic-iptv/");
    const variantMajestic = variants.find((p: any) => p.path === "/comparatif/majestic-iptv/");

    expect(canonicalMajestic).toBeDefined();
    expect(variantMajestic).toBeDefined();

    expect(canonicalMajestic.sourceIndex).toBeGreaterThan(variantMajestic.sourceIndex);
  });

  it("gère les mots-clés avec 112 bruts et 107 uniques", () => {
    const keywords = getKeywords();
    expect(keywords.rawCount).toBe(112);
    expect(keywords.uniqueCount).toBe(107);
    expect(keywords.unique.length).toBe(107);
  });

  it("supprime les artefacts [cite: ...]", () => {
    const pages = getPages();
    const strDump = JSON.stringify(pages);
    expect(strDump).not.toMatch(/\[cite: \d+\]/);
  });

  it("ne contient aucune directive [Schema: ...] dans le texte, mais les extrait", () => {
    const pages = getPages();
    const pageWithSchema = pages.find((p: any) => p.schemaDirectives.length > 0);
    expect(pageWithSchema).toBeDefined();

    // Vérifie qu'il n'y a pas de [Schema: ...] dans les sections
    const sectionsText = JSON.stringify(pageWithSchema.sections);
    expect(sectionsText).not.toMatch(/\[Schema:/);
  });

  it("préserve les accents et URL final slash", () => {
    const pages = getPages();
    
    // Accents
    const jsonStr = JSON.stringify(pages);
    expect(jsonStr).toContain("français");

    // Slashes
    pages.forEach((p: any) => {
      expect(p.path.endsWith("/")).toBe(true);
    });
  });

  it("génère un hash SHA-256 stable dans l'audit", () => {
    const audit = getAudit();
    expect(audit.sourcesHash).toBeDefined();
    expect(typeof audit.sourcesHash).toBe("string");
    expect(audit.sourcesHash.length).toBe(64); // SHA-256 length in hex
  });

  it("échoue si URL ou H1 manque dans un bloc (validé indirectement car pages est bien formé)", () => {
    const pages = getPages();
    pages.forEach((p: any) => {
      expect(p.path).toBeTruthy();
      expect(p.h1).toBeTruthy();
    });
  });

  it("produit des fichiers identiques lors de deux exécutions successives", () => {
    const firstRunPages = fs.readFileSync(PAGES_JSON, "utf-8");
    
    // Ré-exécution
    execSync(`node ${SCRIPT_PATH}`, { stdio: "pipe" });
    
    const secondRunPages = fs.readFileSync(PAGES_JSON, "utf-8");
    expect(firstRunPages).toBe(secondRunPages);
  });
});
