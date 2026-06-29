export const SERVER_ALIASES: Record<string, string> = {
  'iron-iptv': 'Iron IPTV',
  'iptv-iron': 'Iron IPTV',
  'atlas-iptv': 'Atlas Pro IPTV',
  'iptv-atlas-pro': 'Atlas Pro IPTV',
  'trex-iptv': 'Trex IPTV',
  'crystal-ott': 'Crystal OTT',
  'lynx-iptv': 'Lynx IPTV',
  'max-ott': 'Max OTT',
  'lion-ott': 'Lion OTT'
};

/**
 * Returns the formal server brand name if the slug matches a known alias.
 * Fallbacks to undefined if not a known server comparative.
 */
export function resolveServerBrand(slug: string): string | undefined {
  return SERVER_ALIASES[slug.toLowerCase()];
}
