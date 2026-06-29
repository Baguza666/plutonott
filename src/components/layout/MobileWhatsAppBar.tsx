import WhatsAppCta from "../whatsapp/WhatsAppCta";

interface MobileWhatsAppBarProps {
  readonly sourcePath: string;
}

export function MobileWhatsAppBar({ sourcePath }: MobileWhatsAppBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 py-3 bg-ink/70 backdrop-blur-xl border-t border-white/5 shadow-[0_-4px_30px_rgba(0,0,0,0.6)] h-20 flex items-center">
      <WhatsAppCta
        label="Contacter un expert sur WhatsApp"
        intent="commercial"
        placement="sticky-mobile"
        sourcePath={sourcePath}
        pageContext="Pluton OTT"
        className="w-full bg-wa hover:bg-wa-2 text-ink font-bold py-3 px-4 rounded-xl shadow-sm text-base transition-colors focus-visible:ring-2 focus-visible:ring-wa focus-visible:ring-offset-2"
      />
    </div>
  );
}
