import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WhatsAppCta from '../whatsapp/WhatsAppCta';
import { SORTED_SERVERS } from '../../content/servers/servers.data';

export default function ServerCatalog() {
  return (
    <section className="bg-paper text-on-paper py-24 border-t border-ink-3">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-signal text-sm font-bold uppercase tracking-widest mb-4 block">
            Infrastructure Serveur
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Notre Catalogue de Serveurs B2B
          </h2>
          <p className="text-dim-paper text-lg max-w-3xl mx-auto leading-relaxed">
            Accédez aux meilleures infrastructures du marché. 
            Découvrez nos recommandations pour maximiser la satisfaction de vos clients.
            Plus vous commandez de crédits, plus le prix unitaire baisse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {SORTED_SERVERS.map((server) => (
            <div 
              key={server.slug} 
              className={`relative bg-paper-2 border ${server.badge ? 'border-ink-3/60' : 'border-paper-2'} rounded-[1.5rem] p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-signal/50 hover:-translate-y-2 transition-all duration-300 flex flex-col group`}
            >
              {/* Badge Area */}
              {server.badge && (
                <div className={`absolute -top-3 -right-3 border backdrop-blur-md px-4 py-1.5 rounded-full text-[0.7rem] font-bold tracking-widest uppercase shadow-xl ${server.badge.color} z-10`}>
                  {server.badge.label}
                </div>
              )}

              {/* Logo Area */}
              <div className="bg-ink-2/50 rounded-2xl h-[140px] flex items-center justify-center p-8 mb-8 border border-ink-3/20 group-hover:border-signal/20 transition-colors relative overflow-hidden">
                <Image
                  src={`/servers/${server.slug}.webp`}
                  alt={server.name}
                  width={200}
                  height={100}
                  className="object-contain max-h-full w-auto transition-transform duration-500 group-hover:scale-110 relative z-10"
                />
              </div>

              {/* Info Area */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-on-paper mb-3 tracking-tight">{server.name}</h3>
                <p className="text-base text-dim-paper leading-relaxed mb-8 flex-1">
                  {server.description}
                </p>

                {/* Price & CTA */}
                <div className="border-t border-ink-3/30 pt-6 mt-auto">
                  <div className="flex flex-col 2xl:flex-row 2xl:items-end justify-between gap-4 mb-3">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-dim-paper font-semibold mb-1.5">
                        À partir de
                      </div>
                      <div className="text-signal font-black text-2xl">
                        {server.startingPrice} <span className="text-sm text-dim-paper font-medium">/ crédit</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full 2xl:w-auto">
                      <WhatsAppCta
                        intent="commercial"
                        sourcePath="/"
                        pageContext={`Commande serveur ${server.name}`}
                        placement="server-card"
                        label="Commander"
                        className="px-6 py-3 flex items-center justify-center rounded-full bg-wa text-ink hover:bg-wa-2 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] w-full hover:-translate-y-0.5"
                      />
                      <Link 
                        href={`/serveurs/${server.urlSlug}`} 
                        className="px-6 py-2.5 flex items-center justify-center rounded-full bg-ink-2/30 border border-ink-3/50 text-dim-paper hover:text-on-paper hover:bg-ink-2 hover:border-signal/30 transition-all duration-300 text-sm font-bold w-full text-center"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </div>
                  <div className="text-[0.65rem] text-dim-paper italic text-right mt-1.5">
                    * Prix dégressif selon volume
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
