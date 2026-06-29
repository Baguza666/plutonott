interface HomeTrustStripProps {
  readonly trustItems: readonly string[];
  readonly test24hApproved: boolean;
}

export default function HomeTrustStrip({ trustItems, test24hApproved }: HomeTrustStripProps) {
  const items = test24hApproved
    ? [...trustItems, "Lignes de test 24 h"]
    : [...trustItems];

  return (
    <div className="bg-ink border-b border-ink-3">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-start md:justify-center gap-x-7 gap-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-signal shrink-0" aria-hidden="true" />
            <span className="font-mono text-[0.68rem] text-dim-ink tracking-[0.06em] uppercase">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
