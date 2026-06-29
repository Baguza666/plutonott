import Image from 'next/image';
import Link from 'next/link';
import { PageContent } from '../../content/page.types';
import { PublicationStatus } from '../../content/policy/content-policy.types';

interface ComparisonIndexProps {
  readonly pages: readonly PageContent[];
  readonly statuses: readonly PublicationStatus[];
}

const UPPERCASE_WORDS = new Set(['iptv', 'ott', 'tv', 'vod', 'api', 'hd']);

function brandName(path: string): string {
  const slug = path.replace(/^\/comparatif\//, '').replace(/\/$/, '');
  return slug
    .split('-')
    .map(w => UPPERCASE_WORDS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function ComparisonIndex({ pages, statuses }: ComparisonIndexProps) {
  const validPages = pages
    .filter(p => {
      const status = statuses.find(s => s.path === p.path);
      return status && status.status !== 'blocked';
    })
    .slice()
    .sort((a, b) => brandName(a.path).localeCompare(brandName(b.path), 'fr'));

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero */}
      <div className="px-4 pt-12 pb-10 md:pt-16 md:pb-12 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-on-paper mb-4 leading-[1.1]">
          Comparatifs IPTV B2B
        </h1>
        <p className="text-lg md:text-xl text-dim-paper leading-relaxed max-w-2xl mx-auto">
          Analyses détaillées pour vous aider à choisir la meilleure infrastructure pour votre activité de revendeur.
        </p>
        <p className="mt-3 text-sm text-dim-paper mb-10">
          <span className="font-semibold text-signal">{validPages.length}</span> fournisseurs analysés
        </p>
      </div>

      {/* Grid */}
      <div className="px-4 pb-16 max-w-4xl mx-auto">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {validPages.map(p => {
            const brand = brandName(p.path);
            return (
              <li key={p.path}>
                <Link
                  href={p.path}
                  className="group flex flex-col h-full p-5 border border-paper-2 rounded-2xl bg-paper-2 hover:border-signal hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-lg font-bold text-on-paper group-hover:text-signal transition-colors leading-tight">
                      {brand}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0 mt-0.5 text-paper-2 group-hover:text-signal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      aria-hidden="true"
                    >
                      <path d="M3 13L13 3M13 3H7M13 3v6" />
                    </svg>
                  </div>
                  {p.h2 && (
                    <p className="text-sm text-dim-paper leading-relaxed line-clamp-2 mt-auto pt-1">
                      {p.h2}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
