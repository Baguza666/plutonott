import Image from 'next/image';

const ROWS = [
  {
    direction: 'left' as const,
    speed: '120s', // 35s * ~3.5
    channels: [
      { slug: 'tf1',        label: 'TF1' },
      { slug: 'm6',         label: 'M6' },
      { slug: 'france2',    label: 'France 2' },
      { slug: 'beinsports', label: 'beIN Sports' },
      { slug: 'eurosport',  label: 'Eurosport' },
      { slug: 'bbc',        label: 'BBC' },
      { slug: 'cnn',        label: 'CNN' },
      { slug: 'fox',        label: 'FOX' },
      { slug: 'espn',       label: 'ESPN' },
      { slug: 'disney',     label: 'Disney+' },
      { slug: 'hbomax',     label: 'HBO Max' },
      { slug: 'rtl',        label: 'RTL' },
    ],
  },
  {
    direction: 'right' as const,
    speed: '100s', // 28s * ~3.5
    channels: [
      { slug: 'bfmtv',        label: 'BFMTV' },
      { slug: 'discovery',    label: 'Discovery' },
      { slug: 'paramount',    label: 'Paramount+' },
      { slug: 'hulu',         label: 'Hulu' },
      { slug: 'f1',           label: 'F1 TV' },
      { slug: 'ufc',          label: 'UFC' },
      { slug: 'motogp',       label: 'MotoGP' },
      { slug: 'viaplay',      label: 'Viaplay' },
      { slug: 'cmore',        label: 'C More' },
      { slug: 'discoveryplus', label: 'Discovery+' },
      { slug: 'eurosport2',   label: 'Eurosport 2' },
      { slug: 'tlc',          label: 'TLC' },
    ],
  },
  {
    direction: 'left' as const,
    speed: '150s', // 44s * ~3.5
    channels: [
      { slug: 'vrt',        label: 'VRT' },
      { slug: 'vtm',        label: 'VTM' },
      { slug: 'tv4',        label: 'TV4' },
      { slug: 'sbs',        label: 'SBS' },
      { slug: 'ziggo',      label: 'Ziggo' },
      { slug: 'kanaalz',    label: 'Kanaal Z' },
      { slug: 'rtltvi',     label: 'RTL TVI' },
      { slug: 'npoplus',    label: 'NPO Plus' },
      { slug: 'tvl',        label: 'TVL' },
      { slug: 'veronica',   label: 'Veronica' },
      { slug: 'film1',      label: 'Film1' },
      { slug: 'aftonbladet', label: 'Aftonbladet' },
    ],
  },
] as const;

const FADE_MASK = {
  maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
} as const;

function ChannelPill({ slug, label }: { slug: string; label: string }) {
  return (
    <div className="shrink-0 flex items-center justify-center bg-ink-2 border border-ink-3 rounded-xl px-3 py-2 mx-2 select-none w-[60px] h-[40px]">
      <Image
        src={`/channels/${slug}.webp`}
        alt={label}
        width={40}
        height={24}
        className="object-contain max-h-6 w-auto"
      />
    </div>
  );
}

function MarqueeRow({
  channels,
  direction,
  speed,
}: {
  channels: readonly { slug: string; label: string }[];
  direction: 'left' | 'right';
  speed: string;
}) {
  const animClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';
  
  // Répéter 12 fois (144 éléments) pour garantir que 50% de la largeur dépasse largement les écrans 4K, 
  // supprimant ainsi l'espace vide lors du bouclage de l'animation.
  const repeatedChannels = Array(12).fill(channels).flat();

  return (
    <div className="overflow-hidden" style={FADE_MASK}>
      <div className={`flex w-max ${animClass}`} style={{ animationDuration: speed }}>
        {repeatedChannels.map((ch, i) => (
          <ChannelPill key={`${ch.slug}-${i}`} slug={ch.slug} label={ch.label} />
        ))}
      </div>
    </div>
  );
}

export default function ChannelShowcase() {
  return (
    <section className="scrolly-section bg-ink py-14 overflow-hidden border-t border-ink-3">
      <div className="max-w-6xl mx-auto px-4 text-center mb-10">
        <p className="text-[0.65rem] font-mono uppercase tracking-widest text-dim-ink mb-2">
          Catalogue inclus
        </p>
        <h2 className="text-2xl font-bold text-on-ink">
          +20 000 chaînes disponibles
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {ROWS.map((row, i) => (
          <MarqueeRow
            key={i}
            channels={row.channels}
            direction={row.direction}
            speed={row.speed}
          />
        ))}
      </div>
    </section>
  );
}
