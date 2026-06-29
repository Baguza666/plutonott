import { readFileSync } from "fs";
import { join } from "path";

const catalogPath = join(process.cwd(), "src/content/catalog/server-catalog.fr.ts");

try {
  const fileContent = readFileSync(catalogPath, "utf-8");

  // 1. Vérification des mots interdits
  const forbiddenWords = [
    "prix",
    "officiel",
    "sans coupure",
    "toutes les chaînes",
    "tous les matchs",
    "instantanée",
    "uptime",
    "marge",
  ];

  let hasError = false;

  for (const word of forbiddenWords) {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(fileContent)) {
      console.error(`❌ ERREUR AUDIT : Mot interdit détecté ("${word}") dans le catalogue.`);
      hasError = true;
    }
  }

  // 2. Vérification des extensions d'images
  if (/\.(jpg|jpeg|png)['"]/i.test(fileContent)) {
    console.error(`❌ ERREUR AUDIT : Extension d'image invalide (.jpg ou .png) détectée. Utilisez .webp ou .svg.`);
    hasError = true;
  }

  // 3. Vérification de l'unicité des slugs
  const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
  const slugs = [];
  let match;
  while ((match = slugRegex.exec(fileContent)) !== null) {
    slugs.push(match[1]);
  }

  const uniqueSlugs = new Set(slugs);
  if (uniqueSlugs.size !== slugs.length) {
    console.error(`❌ ERREUR AUDIT : Slugs dupliqués détectés.`);
    hasError = true;
  }

  // 4. Vérification de l'unicité des displayOrder
  const orderRegex = /displayOrder:\s*(\d+)/g;
  const orders = [];
  while ((match = orderRegex.exec(fileContent)) !== null) {
    orders.push(match[1]);
  }

  const uniqueOrders = new Set(orders);
  if (uniqueOrders.size !== orders.length) {
    console.error(`❌ ERREUR AUDIT : displayOrder dupliqués détectés.`);
    hasError = true;
  }

  if (hasError) {
    console.error("=== ÉCHEC DE L'AUDIT DU CATALOGUE ===");
    process.exit(1);
  } else {
    console.log("✅ Audit du catalogue : OK");
  }

} catch (e) {
  console.error("Erreur lors de l'audit :", e);
  process.exit(1);
}
