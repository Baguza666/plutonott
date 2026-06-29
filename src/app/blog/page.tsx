import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { PageContent } from '../../content/page.types';
import { PublicationStatus } from '../../content/policy/content-policy.types';
import { generatePageMetadata } from '../../lib/seo/generate-page-metadata';

export const dynamic = 'force-static';

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Blog IPTV Revendeur — Guides, Stratégies et Conseils',
    description: 'Guides pratiques pour revendeurs IPTV : tests gratuits, meilleurs lecteurs, IPTV France, OTT vs IPTV, premium 4K, diaspora Maroc et Tunisie.',
    path: '/blog/',
    status: 'approved',
  });
}

function getAllPages(): PageContent[] {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'generated', 'pages.fr.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

function getAllStatuses(): PublicationStatus[] {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'generated', 'publication-status.fr.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

export default function BlogIndex() {
  const pages = getAllPages();
  const statuses = getAllStatuses();

  const articles = pages
    .filter(p => {
      if (!p.path.startsWith('/blog/')) return false;
      const status = statuses.find(s => s.path === p.path);
      return status && status.status !== 'blocked';
    })
    .sort((a, b) => a.sourceIndex - b.sourceIndex);

  return (
    <div className="min-h-screen bg-paper">
      <div className="px-4 pt-12 pb-10 md:pt-16 md:pb-12 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-on-paper mb-4 leading-[1.1]">
          Blog Revendeur IPTV
        </h1>
        <p className="text-lg md:text-xl text-dim-paper leading-relaxed max-w-2xl mx-auto mb-10">
          Guides pratiques, stratégies commerciales et analyses techniques pour développer votre activité de revendeur IPTV.
        </p>
      </div>

      <div className="px-4 pb-16 max-w-3xl mx-auto">
        <ul className="flex flex-col gap-5">
          {articles.map((article) => (
            <li key={article.path}>
              <Link
                href={article.path}
                className="group flex flex-col gap-2 p-6 border border-paper-2 rounded-2xl bg-paper-2 hover:border-signal hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                <h2 className="text-lg md:text-xl font-bold text-on-paper group-hover:text-signal transition-colors leading-snug">
                  {article.h1}
                </h2>
                {article.h2 && (
                  <p className="text-sm text-dim-paper leading-relaxed line-clamp-2">
                    {article.h2}
                  </p>
                )}
                <span className="mt-1 text-xs font-medium text-signal">
                  Lire l&apos;article →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
