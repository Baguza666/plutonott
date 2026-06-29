import Link from "next/link";

type NavLeaf = { name: string; href: string };
type NavEntry = NavLeaf | { name: string; items: NavLeaf[] };

const NAV: NavEntry[] = [
  {
    name: "Solutions",
    items: [
      { name: "Fonctionnement du panel", href: "/fonctionnement-panel/" },
      { name: "Infrastructure serveurs", href: "/revendeur/infrastructure-serveurs/" },
      { name: "API Xtream Codes", href: "/revendeur/api-xtream-codes/" },
      { name: "Intégration API", href: "/integration-api-revendeur/" },
      { name: "OTT IPTV", href: "/ott-iptv/" },
    ],
  },
  {
    name: "Revendeurs",
    items: [
      { name: "Devenir revendeur", href: "/devenir-revendeur-iptv/" },
      { name: "Programme Master", href: "/programme-master-reseller/" },
      { name: "Tarifs grossiste", href: "/tarifs-grossiste/" },
      { name: "Panel administration", href: "/revendeur/panel-administration/" },
      { name: "Gestion VOD & Séries", href: "/revendeur/gestion-vod-series/" },
      { name: "Sub vs Master", href: "/revendeur/choisir-entre-sub-reseller-et-master/" },
      { name: "Contact commercial", href: "/revendeur/contact-commercial/" },
    ],
  },
  {
    name: "Guides",
    items: [
      { name: "Installation IPTV", href: "/iptv-france/installation/" },
      { name: "Guide Smart TV", href: "/revendeur/guide-configuration-smart-tv/" },
      { name: "Compatibilité FAI", href: "/iptv-france/compatibilite-fai/" },
      { name: "Tutoriels vidéo", href: "/revendeur/tutoriels-video/" },
      { name: "FAQ revendeur", href: "/iptv-france/faq-revendeur/" },
    ],
  },
  { name: "Comparatifs", href: "/comparatif/" },
  { name: "Blog", href: "/blog/" },
];

const CTA = { name: "Devenez revendeur", href: "/devenir-revendeur-iptv/" };

function ChevronDown() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 4l4 4 4-4" />
    </svg>
  );
}

export function SiteNavigation() {
  return (
    <>
      {/* Desktop nav */}
      <div className="hidden lg:flex items-center gap-1">
        <nav className="flex items-center gap-1" aria-label="Navigation principale desktop">
          {NAV.map((entry) =>
            "items" in entry ? (
              <div key={entry.name} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-dim-paper hover:text-signal transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  aria-haspopup="true"
                >
                  {entry.name}
                  <span className="transition-transform duration-150 group-hover:rotate-180 group-focus-within:rotate-180">
                    <ChevronDown />
                  </span>
                </button>
                <div className="absolute left-0 top-full pt-1 z-50 opacity-0 invisible pointer-events-none transition-all duration-150 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto">
                  <div className="bg-paper-2 border border-paper-2 rounded-xl shadow-lg py-1.5 min-w-[210px]">
                    {entry.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-4 py-2 text-sm text-dim-paper hover:text-signal hover:bg-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-inset"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={entry.href}
                href={entry.href}
                className="px-3 py-2 text-sm font-medium text-dim-paper hover:text-signal transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                {entry.name}
              </Link>
            )
          )}
        </nav>

        <Link
          href={CTA.href}
          className="ml-3 px-4 py-2 text-sm font-semibold bg-signal text-white rounded-lg hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 whitespace-nowrap"
        >
          {CTA.name}
        </Link>
      </div>

      {/* Mobile nav (no JS — details/summary) */}
      <details className="lg:hidden group relative">
        <summary
          className="list-none cursor-pointer p-2 flex items-center justify-center text-dim-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded"
          aria-label="Ouvrir le menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="block group-open:hidden"
            aria-hidden="true"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hidden group-open:block"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </summary>
        <nav
          className="absolute top-full right-0 mt-2 bg-paper-2 shadow-lg border border-paper-2 rounded-xl z-50 w-72 max-h-[80vh] overflow-y-auto"
          aria-label="Navigation principale mobile"
        >
          <div className="p-3 flex flex-col gap-0.5">
            {NAV.map((entry) =>
              "items" in entry ? (
                <details key={entry.name} className="rounded-lg">
                  <summary className="list-none flex items-center justify-between cursor-pointer px-3 py-2 text-base font-semibold text-dim-paper hover:text-signal hover:bg-paper rounded-lg transition-colors select-none">
                    {entry.name}
                    <ChevronDown />
                  </summary>
                  <div className="pl-4 pr-2 pb-1 flex flex-col gap-0.5 mt-0.5">
                    {entry.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-3 py-1.5 text-sm text-dim-paper hover:text-signal hover:bg-paper rounded-lg transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="block px-3 py-2 text-base font-medium text-dim-paper hover:text-signal hover:bg-paper rounded-lg transition-colors"
                >
                  {entry.name}
                </Link>
              )
            )}
          </div>
          <div className="p-3 border-t border-paper-2">
            <Link
              href={CTA.href}
              className="block text-center px-4 py-2.5 bg-signal text-white font-semibold rounded-lg hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              {CTA.name}
            </Link>
          </div>
        </nav>
      </details>
    </>
  );
}
