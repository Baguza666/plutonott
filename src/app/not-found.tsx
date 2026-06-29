import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* Ghost number — behind content */}
      <span
        className="text-[8rem] md:text-[11rem] font-black leading-none text-on-paper/[0.04] select-none"
        aria-hidden="true"
      >
        404
      </span>

      <div className="-mt-8 md:-mt-12 flex flex-col items-center">
        <span
          className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-signal mb-3"
          aria-hidden="true"
        >
          Signal perdu
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-on-paper mb-3">
          Page introuvable
        </h1>
        <p className="text-dim-paper mb-8 max-w-xs leading-relaxed text-sm">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-signal hover:bg-signal-2 text-white font-bold py-3 px-6 rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
