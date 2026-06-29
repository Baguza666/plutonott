/**
 * Nettoie et normalise le chemin d'origine pour ne conserver que la route interne,
 * en bloquant les tentatives d'injection (javascript:, data:) et de tracking
 * par query parameters ou hash.
 */
export function normalizeSourcePath(rawPath: string): string {
  // 1. Rejeter/Nettoyer les caractères de contrôle
  const cleanPath = rawPath.replace(/[\x00-\x1F\x7F]/g, "");

  // 2. Si c'est un protocole illégal, on retourne '/'
  if (/^(javascript|data|vbscript):/i.test(cleanPath)) {
    return "/";
  }

  // 3. Parser en tant qu'URL (si c'est absolu) ou juste un chemin (si relatif)
  try {
    let pathname = "";
    if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
      const url = new URL(cleanPath);
      pathname = url.pathname;
    } else {
      // Pour simuler un parsing sur un chemin relatif, on ajoute un domaine factice
      // ou on nettoie manuellement. Le constructeur d'URL est plus robuste.
      const url = new URL(cleanPath, "http://localhost");
      pathname = url.pathname;
    }

    // 4. Supprimer le slash final si ce n'est pas le seul caractère
    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }

    // 5. Garantir que le chemin commence par un slash
    if (!pathname.startsWith("/")) {
      pathname = "/" + pathname;
    }

    return pathname;
  } catch {
    // Si le parsing échoue de manière inattendue, fallback sécurisé
    return "/";
  }
}
