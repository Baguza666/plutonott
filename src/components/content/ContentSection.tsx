import React from 'react';
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

export default function ContentSection({ section, issues, whatsapp, sourcePath }: Props) {
  const validParagraphs = section.paragraphs.filter(p => {
    if (hasErrorRule(p)) return false;
    if (isUnverifiedReview(p, issues)) return false;
    return true;
  });

  const validBullets = section.bullets.filter(b => {
    if (hasErrorRule(b)) return false;
    if (isUnverifiedReview(b, issues)) return false;
    return true;
  });

  const isHeadingBlocked = section.heading ? hasErrorRule(section.heading) : false;

  const hadContent = section.paragraphs.length > 0 || section.bullets.length > 0;
  const hasContentNow = validParagraphs.length > 0 || validBullets.length > 0;
  const isCompletelyBlocked = isHeadingBlocked || (hadContent && !hasContentNow);

  if (isCompletelyBlocked) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        {section.heading && !isHeadingBlocked && (
          <Heading level={section.headingLevel} text={section.heading} />
        )}
        {section.heading && isHeadingBlocked && (
          <Heading level={section.headingLevel} text="Section en attente de validation" />
        )}
        <div className="bg-paper border border-paper-2 rounded-xl p-6 mt-4 text-center">
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

  if (!section.heading && validParagraphs.length === 0 && validBullets.length === 0) {
    return null;
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-6 scrolly-section">
      {section.heading && <Heading level={section.headingLevel} text={section.heading} />}

      {validParagraphs.length > 0 && (
        <div className="space-y-4 mt-4">
          {validParagraphs.map((p, idx) => (
            <p key={idx} className="text-on-paper leading-[1.75] text-base md:text-[17px]">
              {renderText(p)}
            </p>
          ))}
        </div>
      )}

      {validBullets.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {validBullets.map((b, idx) => (
            <li key={idx} className="flex gap-3 text-on-paper text-base md:text-[17px] leading-[1.7]">
              <span className="mt-[0.35em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-signal" aria-hidden="true" />
              <span>{renderText(b)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function renderText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-on-paper">{part.slice(2, -2)}</strong>
      : part
  );
}

function Heading({ level, text }: { level: 2 | 3 | 4 | null; text: string }) {
  const content = renderText(text);
  if (level === 2) return <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4 text-on-paper leading-snug">{content}</h2>;
  if (level === 3) return <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-on-paper leading-snug">{content}</h3>;
  if (level === 4) return <h4 className="text-lg md:text-xl font-semibold mt-6 mb-2 text-on-paper">{content}</h4>;
  return <h2 className="text-2xl font-bold mt-8 mb-4 text-on-paper leading-snug">{content}</h2>;
}
