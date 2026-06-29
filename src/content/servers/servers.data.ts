export type BadgeInfo = { label: string; color: string; };

export interface ServerData {
  slug: string;
  urlSlug: string;
  name: string;
  badge?: BadgeInfo;
  startingPrice: string;
  description: string;
  keywords: string[];
  seoTitle: string;
  seoDescription: string;
  content: {
    h1: string;
    intro: string;
    features: string[];
    faq: { q: string; a: string; }[];
  };
}

export const SERVER_PRICES: Record<string, string> = {
  'Amigo8k': '18€',
  'FOSTO': '18€',
  'IPTV-Diamond': '23€',
  'IRON-IPTV': '20€',
  'Mega-Ott': '17€',
  'Sansat-iptv': '17€',
  'b1g': '20€',
  'crystal-iptv': '20€',
  'dino-iptv': '14€',
  'dream-4k': '20€',
  'eagle-IPTV': '17€',
  'lion-ott': '14€',
  'magnum-ott': '20€',
  'max-ott': '14€',
  'ministra': '17€',
  'neo-iptv': '18€',
  'nettv': '18€',
  'pro-max': '27€',
  'pure-iptv': '40€',
  'strong8k': '28€',
  'tivione': '27€',
  'trex-iptv': '27€',
};

const keywordsMap: Record<string, string[]> = {
  'pro-max': ['iptv pro max'],
  'lion-ott': ['lion ott'],
  'pure-iptv': ['pure iptv', 'iptv pure'],
  'trex-iptv': ['trex iptv'],
  'Amigo8k': ['Amigo 8k'],
  'FOSTO': ['fosto iptv', 'fosto tv', 'fosto pro', 'fosto'],
  'dino-iptv': ['dino iptv'],
  'crystal-iptv': ['crystal iptv', 'crystal ott'],
  'strong8k': ['strong8k', 'strong 8k', 'strong 8k iptv', 'strong iptv 8k', 'strong iptv', 'iptv strong'],
  'tivione': ['tivion'],
  'IPTV-Diamond': ['diamond iptv'],
  'b1g': ['b1g', 'b1g one'],
  'ministra': ['ministra'],
  'dream-4k': ['dream player iptv', 'dream tv iptv', 'iptv dream', 'dream iptv'],
  'nettv': ['live nettv apk', 'nettv plus', 'net iptv'],
  'neo-iptv': ['iptv neo', 'neo iptv'],
  'Sansat-iptv': ['sansat iptv', 'sansat'],
  'IRON-IPTV': ['iron iptv', 'iron iptv pro', 'abonnement iptv iron', 'iron max iptv', 'iron pro iptv', 'iptv iron pro', 'iptv iron max', 'iptv iron tv pro', 'iron iptv eu', 'ironiptv'],
  'eagle-IPTV': ['eagle 4k', 'eagle iptv apk', 'iptv eagle', 'eagle iptv'],
  'Mega-Ott': ['mega ott', 'mega ott iptv'],
  'max-ott': ['max ott', 'max ott iptv'],
  'magnum-ott': ['magnum ott', 'magnum ott iptv'],
};

// Génération dynamique des données complètes des serveurs
export const SERVERS_LIST: ServerData[] = Object.keys(SERVER_PRICES).map(slug => {
  let name = slug.replace(/-/g, ' ').toUpperCase();
  let badge: BadgeInfo | undefined;
  
  if (slug === 'pure-iptv') {
    name = 'PURE OTT';
    badge = { label: 'Top 1 - Le Meilleur', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
  } else if (slug === 'lion-ott') {
    badge = { label: 'Meilleur Qualité/Prix', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
  } else if (slug === 'trex-iptv') {
    badge = { label: 'Très Populaire', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
  } else if (slug === 'pro-max') {
    badge = { label: 'Le Plus Stable', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  }

  const kws = keywordsMap[slug] || [name.toLowerCase()];
  const mainKw = kws[0] ?? name.toLowerCase();

  return {
    slug,
    urlSlug: slug.toLowerCase(),
    name,
    ...(badge !== undefined && { badge }),
    startingPrice: SERVER_PRICES[slug] ?? '0€',
    description: `Découvrez les performances exceptionnelles du serveur ${name}, optimisé pour les revendeurs B2B exigeants.`,
    keywords: kws,
    seoTitle: `Devenir Revendeur ${name} | Grossiste ${mainKw.toUpperCase()}`,
    seoDescription: `Rejoignez notre panel pour revendre ${name}. Obtenez vos crédits ${mainKw} au meilleur prix B2B : ${SERVER_PRICES[slug]}/crédit. Infrastructure ultra-stable.`,
    content: {
      h1: `Infrastructure Grossiste : ${name}`,
      intro: `Le serveur **${name}** s'impose comme une référence incontournable pour les revendeurs IPTV B2B. Si vous recherchez un service associant haute disponibilité et tarifs compétitifs, vous êtes au bon endroit. Nos revendeurs cherchant des solutions liées à "${mainKw}" trouvent dans cette infrastructure une stabilité à toute épreuve. Profitez de nos tarifs grossistes à partir de ${SERVER_PRICES[slug]} le crédit.`,
      features: [
        `**Stabilité optimale** : Une infrastructure réseau conçue pour encaisser les pics d'audience (événements sportifs). Le choix parfait pour ceux qui demandent ${kws[1] ? `du ${kws[1]}` : `du ${mainKw}`}.`,
        `**Panel 100% Français** : Gérez vos abonnements ${name} sans barrière linguistique, depuis une interface moderne.`,
        `**Qualité d'image garantie** : Fournissez à vos clients une diffusion en haute définition, sans buffering constant.`,
        `**Compatible multi-écrans** : Les accès générés via ${name} fonctionnent sur Smart TV, boîtiers Android, Firestick et smartphones.`
      ],
      faq: [
        {
          q: `Pourquoi choisir ${name} en tant que revendeur ?`,
          a: `Les recherches pour "${mainKw}" explosent. En proposant ${name}, vous répondez à une demande très forte de clients finaux recherchant une solution sans coupure. Le tarif grossiste à ${SERVER_PRICES[slug]}/crédit vous garantit d'excellentes marges.`
        },
        {
          q: `Comment générer un accès ${name} pour mon client ?`,
          a: `Une fois inscrit sur notre panel B2B, il vous suffit de sélectionner le serveur ${name}, de déduire 1 crédit de votre solde, et le lien (ou code) M3U/Xtream est instantanément généré.`
        }
      ]
    }
  };
});

// Tri pour mettre les serveurs mis en avant en premier
export const SORTED_SERVERS = [...SERVERS_LIST].sort((a, b) => {
  if (a.badge && !b.badge) return -1;
  if (!a.badge && b.badge) return 1;
  return 0; 
});

// Helper pour récupérer un serveur par son urlSlug
export function getServerByUrlSlug(urlSlug: string): ServerData | undefined {
  return SERVERS_LIST.find(s => s.urlSlug === urlSlug);
}
