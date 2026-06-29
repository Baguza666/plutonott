import { PageContent } from '../../content/page.types';
import { PublicationStatus } from '../../content/policy/content-policy.types';
import { WhatsAppIntent } from '@/lib/whatsapp/whatsapp.types';
import ContentHero from './ContentHero';
import TrustStrip from './TrustStrip';
import ContentSections from './ContentSections';
import FinalWhatsAppCta from './FinalWhatsAppCta';
import ValidationNotice from './ValidationNotice';

interface PageContentRendererProps {
  readonly page: PageContent;
  readonly publicationStatus: PublicationStatus;
  readonly whatsapp: {
    readonly intent: WhatsAppIntent;
    readonly pageContext: string;
    readonly serverBrand?: string;
  };
}

export default function PageContentRenderer({
  page,
  publicationStatus,
  whatsapp
}: PageContentRendererProps) {
  
  const legalPages = ['/qui-sommes-nous/', '/politique-de-remboursement-b2b/', '/conditions-generales-b2b/'];
  const isLegal = legalPages.includes(page.path);
  const imagePath = isLegal ? undefined : `/heroes/${page.path.replace(/\//g, '-').replace(/^-|-$/g, '')}.webp`;

  return (
    <div className="min-h-screen bg-paper">
      <ValidationNotice path={page.path} status={publicationStatus.status} />

      <ContentHero h1={page.h1} h2={page.h2} {...(imagePath !== undefined ? { imagePath } : {})} />

      <TrustStrip items={page.trustItems} />

      <div className="py-8 md:py-16">
        <ContentSections
          sections={page.sections}
          issues={publicationStatus.issues}
          whatsapp={whatsapp}
          sourcePath={page.path}
        />
      </div>

      <FinalWhatsAppCta
        ctaLabels={page.ctaLabels}
        whatsapp={whatsapp}
        sourcePath={page.path}
      />
    </div>
  );
}
