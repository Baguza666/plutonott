import Image from 'next/image';
import WhatsAppCta from '../whatsapp/WhatsAppCta';

const SERVERS_COL_1 = [
  'Amigo8k', 'FOSTO', 'IPTV-Diamond', 'IRON-IPTV', 'Mega-Ott', 'Sansat-iptv',
  'b1g', 'crystal-iptv', 'dino-iptv', 'dream-4k', 'eagle-IPTV', 'lion-ott'
];

const SERVERS_COL_2 = [
  'magnum-ott', 'max-ott', 'ministra', 'neo-iptv', 'nettv', 'pro-max',
  'pure-iptv', 'pureott', 'strong8k', 'tivione', 'trex-iptv'
];

const STATS = [
  '40+ chaînes internationales',
  '24 serveurs B2B',
  'Panel 100% français',
];

interface HomeHeroProps {
  h1: string;
  h2: string | null;
  ctaLabel?: string | undefined;
}

export default function HomeHero({ h1, h2, ctaLabel = "Contacter un expert sur WhatsApp" }: HomeHeroProps) {
  return (
    <section
      className="bg-paper text-on-paper pt-20 pb-14 px-4 relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle, #1E293B 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* Orbes de lumière (Neon Glow) animées en pur CSS */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none " aria-hidden="true" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none " style={{ animationDelay: '2s' }} aria-hidden="true" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-10 xl:gap-16">

          {/* Text column */}
          <div className="flex flex-col items-start flex-1 min-w-0">
            <span
              className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-signal mb-5"
              aria-hidden="true"
            >
              Infrastructure B2B · Revendeurs IPTV
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-[clamp(2.75rem,5.5vw,4.5rem)] font-black tracking-[-0.025em] leading-[1.08] text-gradient-dark mb-6 max-w-2xl animate-fade-up">
              {h1}
            </h1>

            {h2 && (
              <p className="text-lg text-dim-ink mb-8 max-w-xl leading-relaxed">
                {h2}
              </p>
            )}

            {/* Stats chips */}
            <div className="flex flex-wrap gap-2.5 mb-10" aria-label="Points clés">
              {STATS.map((stat) => (
                <span
                  key={stat}
                  className="inline-flex items-center gap-1.5 text-[0.7rem] font-mono text-dim-ink border border-ink-3 rounded-full px-3 py-1"
                >
                  <span className="w-1 h-1 rounded-full bg-signal shrink-0" aria-hidden="true" />
                  {stat}
                </span>
              ))}
            </div>

            <WhatsAppCta
              label={ctaLabel}
              intent="commercial"
              sourcePath="/"
              pageContext="Contact depuis l'accueil"
              placement="hero"
              className="bg-wa hover:bg-wa-2 text-ink font-bold py-4 px-8 rounded-full text-base shadow-lg transition-colors focus-visible:ring-2 focus-visible:ring-wa focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            />
          </div>

          {/* Server ticker — desktop only */}
          <div
            className="hidden lg:flex shrink-0 gap-4 w-[340px] xl:w-[360px]"
            aria-hidden="true"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
              height: '340px',
              overflow: 'hidden',
            }}
          >
            {/* Colonne 1: Marquee Up */}
            <div className="animate-marquee-up flex flex-col gap-4 flex-1">
              {[...SERVERS_COL_1, ...SERVERS_COL_1].map((slug, i) => (
                <div
                  key={`col1-${slug}-${i}`}
                  className="shrink-0 bg-ink-2 border border-ink-3 rounded-2xl h-[84px] flex items-center justify-center px-4"
                >
                  <Image
                    src={`/servers/${slug}.webp`}
                    alt={slug}
                    width={140}
                    height={48}
                    className="object-contain max-h-[44px] w-auto"
                  />
                </div>
              ))}
            </div>

            {/* Colonne 2: Marquee Down */}
            <div className="animate-marquee-down flex flex-col gap-4 flex-1">
              {[...SERVERS_COL_2, ...SERVERS_COL_2].map((slug, i) => (
                <div
                  key={`col2-${slug}-${i}`}
                  className="shrink-0 bg-ink-2 border border-ink-3 rounded-2xl h-[84px] flex items-center justify-center px-4"
                >
                  <Image
                    src={`/servers/${slug}.webp`}
                    alt={slug}
                    width={140}
                    height={48}
                    className="object-contain max-h-[44px] w-auto"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
