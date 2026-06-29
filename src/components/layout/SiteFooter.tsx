import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    title: "Solutions",
    links: [
      { name: "Fonctionnement du panel", href: "/fonctionnement-panel/" },
      { name: "Infrastructure serveurs", href: "/revendeur/infrastructure-serveurs/" },
      { name: "API Xtream Codes", href: "/revendeur/api-xtream-codes/" },
      { name: "Tarifs grossiste", href: "/tarifs-grossiste/" },
      { name: "OTT IPTV", href: "/ott-iptv/" },
      { name: "Test gratuit", href: "/iptv-france/test-gratuit/" },
    ],
  },
  {
    title: "Revendeurs",
    links: [
      { name: "Devenir revendeur", href: "/devenir-revendeur-iptv/" },
      { name: "Programme Master", href: "/programme-master-reseller/" },
      { name: "Panel administration", href: "/revendeur/panel-administration/" },
      { name: "Intégration API", href: "/integration-api-revendeur/" },
      { name: "Gestion VOD & Séries", href: "/revendeur/gestion-vod-series/" },
      { name: "Contact commercial", href: "/revendeur/contact-commercial/" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { name: "Blog revendeur", href: "/blog/" },
      { name: "Guides d'installation", href: "/iptv-france/installation/" },
      { name: "Guide Smart TV", href: "/revendeur/guide-configuration-smart-tv/" },
      { name: "Tutoriels vidéo", href: "/revendeur/tutoriels-video/" },
      { name: "FAQ revendeur", href: "/iptv-france/faq-revendeur/" },
      { name: "Comparatifs IPTV", href: "/comparatif/" },
    ],
  },
];

const LEGAL_LINKS = [
  { name: "À propos", href: "/qui-sommes-nous/" },
  { name: "Politique de remboursement", href: "/politique-de-remboursement-b2b/" },
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-ink border-t border-ink-3">
      {/* Main grid */}
      <div className="container mx-auto px-4 md:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <Link
              href="/"
              className="flex items-center gap-1 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded"
              aria-label="Pluton OTT — Retour à l'accueil"
            >
              <Image src="/pluton-ott.png" alt="Pluton OTT" width={150} height={40} style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            </Link>
            <p className="text-sm text-dim-ink leading-relaxed max-w-[240px]">
              La plateforme B2B de référence pour les revendeurs et grossistes IPTV en quête d&rsquo;infrastructures fiables.
            </p>
            <div className="flex flex-col gap-3 mt-1">
              <Link
                href="/devenir-revendeur-iptv/"
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold bg-signal text-white rounded-lg hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal w-fit"
              >
                Devenez revendeur
              </Link>
              <Link
                href="/iptv-france/test-gratuit/"
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium border border-ink-3 text-dim-ink hover:text-on-ink hover:border-on-ink rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal w-fit"
              >
                Test gratuit 24h
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-signal mb-5">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-dim-ink hover:text-on-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-3">
        <div className="container mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dim-ink">
            © {new Date().getFullYear()} Pluton OTT. Tous droits réservés.
          </p>
          <nav aria-label="Liens légaux" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-dim-ink hover:text-on-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
