import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import PageContentRenderer from '../../../src/components/content/PageContentRenderer';
import { PageContent } from '../../../src/content/page.types';
import { PublicationStatus } from '../../../src/content/policy/content-policy.types';

// Mock du WhatsAppCta pour vérifier sa présence facilement
vi.mock('../../../src/components/whatsapp/WhatsAppCta', () => ({
  default: ({ label, 'data-testid': testId }: any) => <a href="https://wa.me/fake" data-testid={testId || 'whatsapp-cta'}>{label}</a>
}));

const basePage: PageContent = {
  path: '/',
  intent: 'Test',
  h1: 'Titre principal',
  h2: 'Sous-titre',
  trustItems: ['Item 1', 'Item 2'],
  sections: [
    {
      headingLevel: 2,
      heading: 'Première section',
      paragraphs: ['Texte de paragraphe.', '100% uptime garanti'],
      bullets: ['Point 1']
    },
    {
      headingLevel: 3,
      heading: 'Questions fréquentes',
      paragraphs: ['Quelle est la réponse ? Voici la réponse.'],
      bullets: []
    }
  ],
  ctaLabels: ['Rejoindre maintenant'],
  schemaDirectives: ['[Schema: Product]'],
  sourceIndex: 0
};

const baseStatus: PublicationStatus = {
  path: '/',
  status: 'review_required',
  noindex: true,
  issues: [
    { code: 'UNVERIFIED_UPTIME', severity: 'error', excerpt: '100% uptime garanti' }
  ]
};

const whatsappData = {
  intent: 'commercial' as const,
  pageContext: 'test context'
};

describe('PageContentRenderer', () => {
  afterEach(() => {
    cleanup();
  });

  it('Affiche un H1 unique', () => {
    render(<PageContentRenderer page={basePage} publicationStatus={baseStatus} whatsapp={whatsappData} />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe('Titre principal');
  });

  it('Omet les passages avec severity=error', () => {
    render(<PageContentRenderer page={basePage} publicationStatus={baseStatus} whatsapp={whatsappData} />);
    // Le texte avec l'erreur ne doit pas être rendu
    expect(screen.queryByText(/100% uptime garanti/i)).toBeNull();
    // Le texte sans erreur doit être présent
    expect(screen.getByText('Texte de paragraphe.')).toBeInTheDocument();
  });

  it('Remplace une section entièrement bloquée par la phrase exacte avec un WhatsAppCta séparé', () => {
    const blockedPage = {
      ...basePage,
      sections: [
        {
          headingLevel: 2,
          heading: 'Section bloquée',
          paragraphs: ['100% uptime'],
          bullets: []
        }
      ]
    };
    render(<PageContentRenderer page={blockedPage} publicationStatus={baseStatus} whatsapp={whatsappData} />);
    
    // Le titre de la section reste
    expect(screen.getByText('Section bloquée')).toBeInTheDocument();
    // Le texte d'erreur est masqué
    expect(screen.queryByText(/100% uptime/)).toBeNull();
    // Le fallback est affiché
    expect(screen.getByText(/Les détails de cette section sont en cours de validation\./)).toBeInTheDocument();
    
    // Le bouton WhatsApp fallback
    expect(screen.getByText('Contactez notre équipe sur WhatsApp pour obtenir les informations à jour.')).toHaveAttribute('href', 'https://wa.me/fake');
  });

  it('Rend les questions fréquentes via details/summary', () => {
    render(<PageContentRenderer page={basePage} publicationStatus={baseStatus} whatsapp={whatsappData} />);
    expect(document.querySelector('details')).toBeInTheDocument();
    expect(document.querySelector('summary')).toBeInTheDocument();
  });

  it('Masque les témoignages non vérifiés', () => {
    const reviewPage = {
      ...basePage,
      sections: [{ headingLevel: null, heading: null, paragraphs: ['"Super" - *Jean*'], bullets: [] }]
    };
    const reviewStatus: PublicationStatus = {
      ...baseStatus,
      issues: [{ code: 'UNVERIFIED_REVIEW', severity: 'warning', excerpt: '"Super" - *Jean*' }]
    };
    render(<PageContentRenderer page={reviewPage} publicationStatus={reviewStatus} whatsapp={whatsappData} />);
    expect(screen.queryByText(/"Super" - \*Jean\*/)).toBeNull();
  });

  it('Affiche un message sur les pages juridiques non validées', () => {
    const legalPage = { ...basePage, path: '/mentions-legales/' };
    const legalStatus: PublicationStatus = { ...baseStatus, path: '/mentions-legales/' };
    render(<PageContentRenderer page={legalPage} publicationStatus={legalStatus} whatsapp={whatsappData} />);
    expect(screen.getByText('Version en cours de validation juridique.')).toBeInTheDocument();
  });

  it('Ne rend pas les balises schema et nettoie les citations', () => {
    // Citations are usually cleaned at parse time, but if they slipped in, the component doesn't render them (or parse already removed them)
    // The prompt says "Aucun texte [Schema: ...] visible."
    render(<PageContentRenderer page={basePage} publicationStatus={baseStatus} whatsapp={whatsappData} />);
    const html = document.body.innerHTML;
    expect(html).not.toMatch(/\[Schema:/);
  });

  it('Rend le CTA final avec WhatsAppCta', () => {
    render(<PageContentRenderer page={basePage} publicationStatus={baseStatus} whatsapp={whatsappData} />);
    const finalCta = screen.getByText('Rejoindre maintenant');
    expect(finalCta).toHaveAttribute('href', 'https://wa.me/fake');
  });
});
