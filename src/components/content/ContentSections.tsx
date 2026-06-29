import React from 'react';
import { PageContent } from '../../content/page.types';
import { PublicationIssue } from '../../content/policy/content-policy.types';
import ContentSection from './ContentSection';
import FaqSection from './FaqSection';
import { WhatsAppIntent } from '@/lib/whatsapp/whatsapp.types';

interface Props {
  readonly sections: PageContent['sections'];
  readonly issues: readonly PublicationIssue[];
  readonly whatsapp: {
    readonly intent: WhatsAppIntent;
    readonly pageContext: string;
    readonly serverBrand?: string;
  };
  readonly sourcePath: string;
}

export default function ContentSections({ sections, issues, whatsapp, sourcePath }: Props) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      {sections.map((section, index) => {
        // Simple heuristic to decide if this is a FAQ section
        const isFaq = section.heading && (
          section.heading.toLowerCase().includes('faq') || 
          section.heading.toLowerCase().includes('questions fréquentes')
        );

        if (isFaq) {
          return (
            <FaqSection 
              key={index} 
              section={section} 
              issues={issues} 
              whatsapp={whatsapp} 
              sourcePath={sourcePath} 
            />
          );
        }

        return (
          <ContentSection 
            key={index} 
            section={section} 
            issues={issues} 
            whatsapp={whatsapp} 
            sourcePath={sourcePath} 
          />
        );
      })}
    </div>
  );
}
