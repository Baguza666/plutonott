import { Metadata } from 'next';
import HomeHero from '../components/home/HomeHero';
import ChannelShowcase from '../components/home/ChannelShowcase';
import HomeTrustStrip from '../components/home/HomeTrustStrip';
import HowItWorks from '../components/home/HowItWorks';
import WhatsAppCta from '../components/whatsapp/WhatsAppCta';
import { COMMERCIAL_FLAGS } from '../content/config/commercial-flags';
import { getLandingServerCatalogItems } from '../content/catalog/get-server-catalog';
import { generatePageMetadata } from '../lib/seo/generate-page-metadata';
import { getPageByPath } from '../content/get-page-content';
import { getPublicationStatus } from '../content/get-publication-status';
import { resolveWhatsAppContext } from '../content/resolve-whatsapp-context';
import HomeSections from '../components/home/HomeSections';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateMetadata(): Metadata {
  const page = getPageByPath('/');
  const status = getPublicationStatus('/');
  if (!page || !status) return {};

  return generatePageMetadata({
    title: page.h1,
    description: page.h2 || (page.sections[0]?.paragraphs[0] ?? ""),
    path: '/',
    status: status.status,
  });
}

export default function HomePage() {
  const servers = getLandingServerCatalogItems();
  const page = getPageByPath('/');
  const status = getPublicationStatus('/');

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
    <div className="min-h-screen">
      <HomeHero h1={page.h1} h2={page.h2} ctaLabel={page.ctaLabels[0]} />
      <ChannelShowcase />
      <HomeTrustStrip trustItems={page.trustItems} test24hApproved={COMMERCIAL_FLAGS.TEST_24H_APPROVED} />

      <HomeSections
        sections={page.sections}
        issues={status.issues}
        whatsapp={whatsapp}
      />

      <HowItWorks />

      <section className="scrolly-section py-16 px-4 bg-ink text-on-ink text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Prêt à structurer votre réseau ?
          </h2>
          <p className="text-dim-ink mb-10">
            Notre équipe vous accompagne sur WhatsApp pour évaluer la meilleure infrastructure selon votre portefeuille client actuel.
          </p>
          <div className="inline-block">
            <WhatsAppCta
              label={page.ctaLabels[1] || page.ctaLabels[0] || "Contacter l'équipe commerciale"}
              intent="commercial"
              sourcePath="/"
              pageContext="Contact final accueil"
              placement="footer"
              className="bg-wa hover:bg-wa-2 text-white font-bold py-4 px-8 rounded-full text-base shadow-lg transition-colors focus-visible:ring-2 focus-visible:ring-wa focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
