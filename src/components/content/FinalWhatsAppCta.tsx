import WhatsAppCta from '../whatsapp/WhatsAppCta';
import { WhatsAppIntent } from '@/lib/whatsapp/whatsapp.types';

interface Props {
  readonly ctaLabels: readonly string[];
  readonly whatsapp: {
    readonly intent: WhatsAppIntent;
    readonly pageContext: string;
    readonly serverBrand?: string;
  };
}

export default function FinalWhatsAppCta({ ctaLabels, whatsapp, sourcePath }: Props & { sourcePath: string }) {
  const defaultLabel = "Contacter l'équipe Pluton OTT sur WhatsApp";
  const label = ctaLabels[0] || defaultLabel;

  return (
    <section className="py-16 px-4 text-center scrolly-section">
      <WhatsAppCta
        label={label}
        intent={whatsapp.intent}
        sourcePath={sourcePath}
        pageContext={whatsapp.pageContext}
        {...(whatsapp.serverBrand ? { serverBrand: whatsapp.serverBrand } : {})}
        placement="section"
        className="bg-wa hover:bg-wa-2 text-ink font-bold py-4 px-8 rounded-full text-lg shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_40px_rgba(37,211,102,0.8)] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-wa"
      />
    </section>
  );
}
