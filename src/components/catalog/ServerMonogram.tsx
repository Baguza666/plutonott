export default function ServerMonogram({ brand }: { readonly brand: string }) {
  const letters = brand.substring(0, 2).toUpperCase();

  return (
    <div
      className="w-full aspect-video bg-ink flex flex-col items-center justify-center select-none relative overflow-hidden"
      style={{
        backgroundImage: [
          "linear-gradient(rgba(79,70,229,0.06) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(79,70,229,0.06) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "24px 24px",
      }}
    >
      <span className="text-5xl font-black tracking-tight text-on-ink/25 leading-none">
        {letters}
      </span>
      <span className="text-[0.5rem] font-mono tracking-[0.2em] uppercase text-signal/50 mt-2">
        Infrastructure
      </span>
    </div>
  );
}
