import { ServerCatalogItem } from "./server-catalog.types";

export const SERVER_CATALOG: ServerCatalogItem[] = [
  {
    slug: "atlas-pro-iptv",
    serverBrand: "Atlas Pro IPTV",
    shortDescriptionFr: "Infrastructure destinée aux revendeurs qui souhaitent structurer leur offre B2B.",
    targetAudienceFr: "Revendeurs recherchant une gestion centralisée et un accompagnement en français.",
    marketingFeaturesFr: [
      "Gestion centralisée",
      "Accompagnement revendeur en français",
      "Conditions communiquées sur WhatsApp"
    ],
    whatsappContextFr: "les crédits Atlas Pro IPTV",
    imagePath: null,
    imageAltFr: null,
    displayOrder: 10,
    isActive: true,
    legalStatus: "pending"
  },
  {
    slug: "iron-iptv",
    serverBrand: "Iron IPTV",
    shortDescriptionFr: "Offre destinée aux revendeurs qui souhaitent discuter de leurs besoins de stabilité et de support.",
    targetAudienceFr: "Revendeurs cherchant à mieux encadrer les demandes techniques de leurs clients.",
    marketingFeaturesFr: [
      "Échange commercial direct",
      "Support en français",
      "Catalogue à confirmer avant engagement"
    ],
    whatsappContextFr: "les crédits Iron IPTV",
    imagePath: null,
    imageAltFr: null,
    displayOrder: 20,
    isActive: true,
    legalStatus: "pending"
  },
  {
    slug: "trex-iptv",
    serverBrand: "Trex IPTV",
    shortDescriptionFr: "Infrastructure B2B destinée aux grossistes qui recherchent une organisation avancée du catalogue.",
    targetAudienceFr: "Grossistes et Master Resellers souhaitant discuter de la gestion des catégories et de l’EPG.",
    marketingFeaturesFr: [
      "Organisation du catalogue",
      "Gestion des catégories",
      "Accompagnement B2B"
    ],
    whatsappContextFr: "les crédits Trex IPTV",
    imagePath: null,
    imageAltFr: null,
    displayOrder: 30,
    isActive: true,
    legalStatus: "pending"
  },
  {
    slug: "crystal-ott",
    serverBrand: "Crystal OTT",
    shortDescriptionFr: "Offre OTT présentée aux agences qui souhaitent discuter de volumes flexibles.",
    targetAudienceFr: "Agences et grossistes recherchant des conditions adaptées à leur activité.",
    marketingFeaturesFr: [
      "Échange direct sur les volumes",
      "Support francophone",
      "Conditions sur demande"
    ],
    whatsappContextFr: "les crédits Crystal OTT",
    imagePath: null,
    imageAltFr: null,
    displayOrder: 40,
    isActive: true,
    legalStatus: "pending"
  },
  {
    slug: "lynx-iptv",
    serverBrand: "Lynx IPTV",
    shortDescriptionFr: "Offre destinée aux revendeurs qui préparent une migration progressive de leur portefeuille.",
    targetAudienceFr: "Revendeurs recherchant une gestion centralisée de leurs demandes de migration.",
    marketingFeaturesFr: [
      "Migration progressive",
      "Gestion centralisée",
      "Support de configuration"
    ],
    whatsappContextFr: "les crédits Lynx IPTV",
    imagePath: null,
    imageAltFr: null,
    displayOrder: 50,
    isActive: true,
    legalStatus: "pending"
  }
] satisfies readonly ServerCatalogItem[];
