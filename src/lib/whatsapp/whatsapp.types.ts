export type WhatsAppIntent =
  | "commercial"
  | "essai"
  | "support"
  | "juridique"
  | "information";

export interface BuildWhatsAppUrlInput {
  readonly intent: WhatsAppIntent;
  readonly sourcePath: string;
  readonly pageContext: string;
  readonly serverBrand?: string;
}

export const WHATSAPP_PHONE_E164 = "212782389820";
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_PHONE_E164}`;
