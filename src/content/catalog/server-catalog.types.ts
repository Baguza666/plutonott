export type ServerLegalStatus = "pending" | "approved" | "rejected";

export interface ServerCatalogItem {
  readonly slug: string;
  readonly serverBrand: string;
  readonly shortDescriptionFr: string;
  readonly targetAudienceFr: string;
  readonly marketingFeaturesFr: readonly string[];
  readonly whatsappContextFr: string;
  readonly imagePath: string | null;
  readonly imageAltFr: string | null;
  readonly displayOrder: number;
  readonly isActive: boolean;
  readonly legalStatus: ServerLegalStatus;
}
