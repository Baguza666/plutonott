import Link from 'next/link';
import PageContentRenderer from '../content/PageContentRenderer';
import { PageContent } from '../../content/page.types';
import { PublicationStatus } from '../../content/policy/content-policy.types';
import { WhatsAppIntent } from '@/lib/whatsapp/whatsapp.types';

interface ComparisonPageProps {
  readonly page: PageContent;
  readonly publicationStatus: PublicationStatus;
  readonly whatsapp: {
    readonly intent: WhatsAppIntent;
    readonly pageContext: string;
    readonly serverBrand?: string;
  };
}

export default function ComparisonPage({ page, publicationStatus, whatsapp }: ComparisonPageProps) {
  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto px-4 py-4 mt-4">
        <Link
          href="/comparatif/"
          className="text-signal hover:text-signal-2 font-medium inline-flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retourner à l&rsquo;index des comparatifs
        </Link>
      </div>

      <div className="bg-paper border-y border-paper-2 py-3 text-center px-4 mt-2">
        <p className="text-xs text-dim-paper max-w-4xl mx-auto">
          <strong>Avertissement :</strong> Les noms tiers mentionnés appartiennent à leurs propriétaires respectifs. Vérifiez les droits, la disponibilité et les conditions applicables avant toute décision commerciale.
        </p>
      </div>

      <PageContentRenderer
        page={page}
        publicationStatus={publicationStatus}
        whatsapp={whatsapp}
      />
    </div>
  );
}
