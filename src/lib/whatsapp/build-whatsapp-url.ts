import { WHATSAPP_BASE_URL, BuildWhatsAppUrlInput } from "./whatsapp.types";
import { normalizeSourcePath } from "./normalize-source-path";
import { buildWhatsAppMessage } from "./build-whatsapp-message";

/**
 * Construit l'URL complète et sécurisée pour rediriger l'utilisateur vers WhatsApp.
 * L'URL renvoie systématiquement vers le numéro officiel.
 */
export function buildWhatsAppUrl(input: BuildWhatsAppUrlInput): string {
  const normalizedPath = normalizeSourcePath(input.sourcePath);
  
  const textMessage = buildWhatsAppMessage({
    ...input,
    sourcePath: normalizedPath,
  });

  // URLSearchParams gère l'encodage URI (encodeURIComponent en interne) de façon standard
  const params = new URLSearchParams();
  params.set("text", textMessage);

  return `${WHATSAPP_BASE_URL}?${params.toString()}`;
}
