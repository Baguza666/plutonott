import Image from 'next/image';
import { getLandingServerCatalogItems } from '../../content/catalog/get-server-catalog';
import ServerCatalogGrid from '../../components/catalog/ServerCatalogGrid';
import { Metadata } from 'next';
import { generatePageMetadata } from '../../lib/seo/generate-page-metadata';
import { getPageByPath } from '../../content/get-page-content';
import { getPublicationStatus } from '../../content/get-publication-status';
import { resolveWhatsAppContext } from '../../content/resolve-whatsapp-context';
import ContentSections from '../../components/content/ContentSections';
import TrustStrip from '../../components/content/TrustStrip';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateMetadata(): Metadata {
  const page = getPageByPath('/tarifs-grossiste/');
  const status = getPublicationStatus('/tarifs-grossiste/');
  if (!page || !status) return {};

  return generatePageMetadata({
    title: page.h1,
    description: page.h2 || (page.sections[0]?.paragraphs[0] ?? ""),
    path: '/tarifs-grossiste/',
    status: status.status,
  });
}

const TARIF_STEPS = [
  { label: "Choisissez une infrastructure." },
  { label: "Consultez les informations disponibles." },
  { label: "Contactez l'équipe sur WhatsApp." },
  { label: "Confirmez directement vos besoins et les conditions applicables." },
] as const;

export default function TarifsGrossistePage() {
  const servers = getLandingServerCatalogItems();
  const page = getPageByPath('/tarifs-grossiste/');
  const status = getPublicationStatus('/tarifs-grossiste/');

  if (!page || !status) {
    notFound();
  }

  const whatsappContext = resolveWhatsAppContext(page);
  const whatsapp = {
    intent: whatsappContext.intent,
    pageContext: whatsappContext.pageContext,
    ...(whatsappContext.serverBrand ? { serverBrand: whatsappContext.serverBrand } : {})
  };

  return (
    <div className="min-h-screen bg-paper py-16 px-4">
      <div className="max-w-6xl mx-auto">

        <header className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-on-paper tracking-tight mb-6">
            {page.h1}
          </h1>
          {page.h2 && (
            <p className="text-xl text-dim-paper leading-relaxed mb-8">
              {page.h2}
            </p>
          )}

          <TrustStrip items={page.trustItems} />
        </header>

        <section className="scrolly-section mb-12">
          <ContentSections
            sections={page.sections}
            issues={status.issues}
            whatsapp={whatsapp}
            sourcePath={page.path}
          />
        </section>

        <section className="scrolly-section mb-20">
          <ServerCatalogGrid items={servers} />
        </section>

        {/* How it works — tarifs-specific copy */}
        <section className="scrolly-section bg-paper-2 rounded-2xl p-8 md:p-12 border border-paper-2 shadow-sm max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-on-paper mb-10 text-center">
            Comment ça marche ?
          </h2>

          <div className="relative">
            <div
              className="absolute top-[5px] left-[12.5%] right-[12.5%] h-px bg-paper-2 hidden lg:block"
              aria-hidden="true"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {TARIF_STEPS.map((step, i) => (
                <div key={i} className="flex flex-col lg:items-center">
                  <div className="relative z-10 flex flex-col lg:items-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-signal mb-2.5" aria-hidden="true" />
                    <span className="font-mono text-[0.6rem] text-signal/50 tracking-[0.12em]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-on-paper text-sm lg:text-center">
                    {step.label}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
