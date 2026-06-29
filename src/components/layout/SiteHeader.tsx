import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteNavigation } from "./SiteNavigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full h-16 flex items-center bg-ink/70 backdrop-blur-lg supports-[backdrop-filter]:bg-ink/60 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      <a
        href="#contenu-principal"
        className="absolute -top-40 left-0 bg-ink text-on-ink px-4 py-2 z-50 focus:top-4 focus:outline-none focus:ring-2 focus:ring-signal font-medium rounded-r-md transition-all"
      >
        Aller au contenu principal
      </a>

      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-full">
        <Link
          href="/"
          className="flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded"
          aria-label="Pluton OTT — Retour à l'accueil"
        >
          <Image src="/pluton-ott.png" alt="Pluton OTT" width={120} height={32} style={{ height: '32px', width: 'auto', objectFit: 'contain' }} priority />
        </Link>

        <SiteNavigation />
      </div>
    </header>
  );
}
