import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SERVERS_LIST, getServerByUrlSlug } from '../../../content/servers/servers.data';
import WhatsAppCta from '../../../components/whatsapp/WhatsAppCta';
import { getSiteUrl } from '../../../lib/seo/site-url';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SERVERS_LIST.map((server) => ({
    slug: server.urlSlug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const server = getServerByUrlSlug(resolvedParams.slug);
  
  if (!server) {
    return {
      title: 'Serveur Introuvable',
    };
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/serveurs/${server.urlSlug}/`;

  return {
    title: { absolute: server.seoTitle },
    description: server.seoDescription,
    keywords: server.keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: server.seoTitle,
      description: server.seoDescription,
      url: canonicalUrl,
      siteName: 'Pluton OTT',
      locale: 'fr_FR',
      type: 'website',
    },
  };
}

export default async function ServerPage({ params }: PageProps) {
  const resolvedParams = await params;
  const server = getServerByUrlSlug(resolvedParams.slug);

  if (!server) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-paper text-on-paper pb-20">
      {/* Hero Section */}
      <section className="relative bg-paper-2 border-b border-ink-3 pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-signal/5 opacity-5 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-dim-paper hover:text-signal mb-8 transition-colors">
            ← Retour au catalogue
          </Link>
          
          <div className="flex justify-center mb-8">
            <div className="bg-ink-2/80 rounded-3xl p-8 border border-ink-3 shadow-2xl relative">
              {server.badge && (
                <div className={`absolute -top-4 -right-4 border backdrop-blur-md px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-xl ${server.badge.color} z-20`}>
                  {server.badge.label}
                </div>
              )}
              <Image
                src={`/servers/${server.slug}.webp`}
                alt={`Logo ${server.name}`}
                width={280}
                height={140}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            {server.content.h1}
          </h1>
          <p className="text-xl text-dim-paper leading-relaxed max-w-3xl mx-auto">
            {server.description}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="bg-ink-2 border border-ink-3 px-8 py-4 rounded-full shadow-inner">
              <span className="text-sm uppercase tracking-widest text-dim-paper font-bold block mb-1">Tarif B2B Grossiste</span>
              <span className="text-3xl font-black text-signal">{server.startingPrice} <span className="text-lg text-on-paper font-normal">/ crédit</span></span>
            </div>
            <WhatsAppCta
              intent="commercial"
              sourcePath={`/serveurs/${server.urlSlug}`}
              pageContext={`Devenir revendeur ${server.name}`}
              placement="hero"
              label={`Commander ${server.name}`}
              className="px-8 py-5 flex items-center justify-center rounded-full bg-wa text-ink hover:bg-wa-2 transition-all duration-300 text-lg font-black shadow-[0_0_30px_rgba(37,211,102,0.3)] hover:shadow-[0_0_40px_rgba(37,211,102,0.5)] hover:-translate-y-1 w-full sm:w-auto"
            />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl leading-loose text-on-paper font-medium mb-12">
            {server.content.intro}
          </p>

          <h2 className="text-3xl font-black mb-8 border-b border-ink-3 pb-4">Pourquoi choisir {server.name} ?</h2>
          <ul className="space-y-6 mb-16 list-none pl-0">
            {server.content.features.map((feature, idx) => {
              // Parse basic bold markdown
              const parts = feature.split('**');
              return (
                <li key={idx} className="flex items-start gap-4 bg-paper-2 p-6 rounded-2xl border border-ink-3/30">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-signal/20 flex items-center justify-center text-signal font-bold mt-1">
                    ✓
                  </div>
                  <div className="text-dim-paper leading-relaxed">
                    {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-on-paper">{part}</strong> : part)}
                  </div>
                </li>
              );
            })}
          </ul>

          <h2 className="text-3xl font-black mb-8 border-b border-ink-3 pb-4">Questions Fréquentes</h2>
          <div className="space-y-8">
            {server.content.faq.map((item, idx) => (
              <div key={idx} className="bg-ink-2/30 p-8 rounded-3xl border border-ink-3/50">
                <h3 className="text-xl font-bold mb-4 text-signal">{item.q}</h3>
                <p className="text-dim-paper leading-relaxed m-0">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
