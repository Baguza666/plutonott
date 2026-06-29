import type { WhatsAppIntent } from "@/lib/whatsapp/whatsapp.types";

export interface WhatsAppCtaProps {
  readonly label: string;
  readonly intent: WhatsAppIntent;
  readonly sourcePath: string;
  readonly pageContext: string;
  readonly serverBrand?: string;
  readonly placement:
    | "hero"
    | "sticky-mobile"
    | "server-card"
    | "section"
    | "footer";
  readonly className?: string;
  readonly ariaLabel?: string;
}
