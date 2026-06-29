import { ContentSection as SectionType } from '../../content/page.types';
import { PublicationIssue } from '../../content/policy/content-policy.types';
import { hasErrorRule, isUnverifiedReview } from '../../content/policy/content-policy';
import WhatsAppCta from '../whatsapp/WhatsAppCta';
import { WhatsAppIntent } from '@/lib/whatsapp/whatsapp.types';

interface Props {
  readonly section: SectionType;
  readonly issues: readonly PublicationIssue[];
  readonly whatsapp: {
    readonly intent: WhatsAppIntent;
    readonly pageContext: string;
    readonly serverBrand?: string;
  };
  readonly sourcePath: string;
}

export default function FaqSection({ section, issues, whatsapp, sourcePath }: Props) {
  const validParagraphs = section.paragraphs.filter(p => {
    if (hasErrorRule(p)) return false;
    if (isUnverifiedReview(p, issues)) return false;
    return true;
  });

  const isHeadingBlocked = section.heading ? hasErrorRule(section.heading) : false;
  const hadContent = section.paragraphs.length > 0;
  const hasContentNow = validParagraphs.length > 0;
  const isCompletelyBlocked = isHeadingBlocked || (hadContent && !hasContentNow);

  if (isCompletelyBlocked) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        {section.heading && !isHeadingBlocked && (
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-on-paper">{section.heading.replace(/\*\*/g, '')}</h2>
        )}
        <div className="bg-paper border border-paper-2 rounded-xl p-6 text-center">
          <p className="text-dim-paper mb-4">
            Les détails de cette section sont en cours de validation.
          </p>
          <WhatsAppCta
            label="Contactez notre équipe sur WhatsApp pour obtenir les informations à jour."
            intent={whatsapp.intent}
            sourcePath={sourcePath}
            pageContext={whatsapp.pageContext}
            {...(whatsapp.serverBrand ? { serverBrand: whatsapp.serverBrand } : {})}
            placement="section"
            className="bg-wa hover:bg-wa-2 text-ink px-6 py-3 rounded-full font-medium transition-colors focus-visible:ring-2 focus-visible:ring-wa"
          />
        </div>
      </section>
    );
  }

  const faqItems: { question: string; answer: string }[] = [];

  validParagraphs.forEach(p => {
    const matches = Array.from(p.matchAll(/\*\*(.+?)\*\*(.*?)(?=\*\*|$)/g));
    if (matches.length > 0) {
      matches.forEach(match => {
        const q = match[1]?.trim() || '';
        const a = match[2]?.trim() || '';
        if (q.toLowerCase().includes('questions fréquentes')) {
          if (a) {
            faqItems.push({ question: 'Information', answer: a });
          }
        } else if (q && a) {
          faqItems.push({ question: q, answer: a });
        }
      });
    } else {
      if (p.includes('?')) {
        const parts = p.split('?');
        faqItems.push({ question: (parts[0] || '').replace(/\*\*/g, '') + '?', answer: parts.slice(1).join('?').trim() });
      } else {
        faqItems.push({ question: 'Information supplémentaire', answer: p.replace(/\*\*/g, '') });
      }
    }
  });

  if (faqItems.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 scrolly-section">
      {section.heading && (
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-on-paper">{section.heading.replace(/\*\*/g, '')}</h2>
      )}
      <div className="space-y-3">
        {faqItems.map((item, idx) => (
          <details key={idx} className="group border border-paper-2 rounded-xl bg-paper-2 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-medium text-on-paper hover:bg-paper transition-colors">
              {item.question}
              <svg className="w-4 h-4 text-dim-paper group-open:rotate-180 transition-transform shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-5 pt-1 text-dim-paper leading-relaxed text-sm">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
