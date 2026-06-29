import { ServerCatalogItem } from '../../content/catalog/server-catalog.types';
import WhatsAppCta from '../whatsapp/WhatsAppCta';
import ServerMonogram from './ServerMonogram';
import Image from 'next/image';

interface ServerCardProps {
  readonly item: ServerCatalogItem;
}

export default function ServerCard({ item }: ServerCardProps) {
  return (
    <article className="flex flex-col bg-paper-2 border border-paper-2 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="relative">
        {item.imagePath ? (
          <div className="w-full aspect-video relative bg-paper">
            <Image src={item.imagePath} alt={item.imageAltFr || item.serverBrand} fill className="object-cover" />
          </div>
        ) : (
          <ServerMonogram brand={item.serverBrand} />
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* h3 — correct heading level inside a section that already has an h2 */}
        <h3 className="text-xl font-bold text-on-paper mb-2">
          {item.serverBrand}
        </h3>

        <p className="text-dim-paper mb-4 line-clamp-2 text-sm leading-relaxed">
          {item.shortDescriptionFr}
        </p>

        <ul className="mb-6 space-y-2 text-sm text-on-paper flex-grow">
          {item.marketingFeaturesFr.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <svg className="w-4 h-4 text-signal shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-paper-2 mt-auto">
          <p className="text-xs text-dim-paper text-center mb-3 font-mono">
            Tarif communiqué sur WhatsApp
          </p>
          <WhatsAppCta
            label={`Obtenir les conditions ${item.serverBrand}`}
            intent="commercial"
            sourcePath="/tarifs-grossiste/"
            pageContext={`Demande de tarifs pour ${item.whatsappContextFr}`}
            serverBrand={item.serverBrand}
            placement="server-card"
            className="w-full bg-wa hover:bg-wa-2 text-ink font-semibold py-3 px-4 rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:ring-wa"
          />
        </div>
      </div>
    </article>
  );
}
