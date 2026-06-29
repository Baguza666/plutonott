import { BuildWhatsAppUrlInput } from "./whatsapp.types";

/**
 * Construit le texte brut (non encodé) du message WhatsApp selon les règles métier.
 * Applique les limites de caractères aux attributs dynamiques pour éviter le spam ou l'engorgement.
 */
export function buildWhatsAppMessage(input: BuildWhatsAppUrlInput): string {
  // Les limites fixées par le contexte : pageContext = 160, serverBrand = 100
  const cleanContext = input.pageContext.slice(0, 160);
  const cleanBrand = input.serverBrand ? input.serverBrand.slice(0, 100) : undefined;

  switch (input.intent) {
    case "commercial":
      if (cleanBrand) {
        return `Bonjour, je souhaite obtenir des informations sur les crédits ${cleanBrand}. Source : ${input.sourcePath}`;
      }
      return `Bonjour, je souhaite obtenir des informations sur les offres Pluton OTT. Source : ${input.sourcePath}`;

    case "essai":
      return `Bonjour, je souhaite connaître les conditions d’une ligne de test de 24 h. Source : ${input.sourcePath}`;

    case "support":
      return `Bonjour, j’ai besoin d’aide concernant ${cleanContext}. Source : ${input.sourcePath}`;

    case "juridique":
      return `Bonjour, j’ai une question concernant ${cleanContext}. Source : ${input.sourcePath}`;

    case "information":
    default:
      return `Bonjour, je souhaite obtenir des informations concernant ${cleanContext}. Source : ${input.sourcePath}`;
  }
}
