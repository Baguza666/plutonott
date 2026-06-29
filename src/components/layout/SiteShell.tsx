import React from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { MobileWhatsAppBar } from "./MobileWhatsAppBar";

interface SiteShellProps {
  readonly children: React.ReactNode;
  readonly sourcePath: string;
}

export function SiteShell({ children, sourcePath }: SiteShellProps) {
  return (
    <>

      <div className="flex flex-col min-h-screen">
        <SiteHeader />
      
      {/* 
        Le main occupe l'espace restant. 
        Le padding-bottom (pb-24 md:pb-0) réserve l'espace pour la MobileWhatsAppBar 
        sur les petits écrans afin de ne masquer aucun contenu, y compris le footer.
      */}
      <main id="contenu-principal" tabIndex={-1} className="flex-grow flex flex-col pb-24 md:pb-0">
        {children}
      </main>
      
      <SiteFooter />
      <MobileWhatsAppBar sourcePath={sourcePath} />
    </div>
    </>
  );
}
