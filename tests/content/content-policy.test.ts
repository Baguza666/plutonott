import { describe, it, expect } from 'vitest';
import { auditPage } from '../../src/content/policy/content-policy';
import { PageContent } from '../../src/content/page.types';
import fs from 'fs';
import path from 'path';

const mockPage = (overrides: Partial<PageContent> = {}): PageContent => ({
  path: '/test/',
  intent: 'Test',
  h1: 'Test H1',
  h2: null,
  trustItems: [],
  sections: [],
  ctaLabels: [],
  schemaDirectives: [],
  sourceIndex: 0,
  ...overrides
});

describe('Content Policy Static Audit', () => {
  it('Détection de 100% uptime', () => {
    const page = mockPage({ h1: 'Serveur avec 100% uptime garanti' });
    const result = auditPage(page);
    expect(result.issues).toContainEqual(expect.objectContaining({ code: 'UNVERIFIED_UPTIME', severity: 'error' }));
    expect(result.status).toBe('blocked');
    expect(result.noindex).toBe(true);
  });

  it('Détection de tous les matchs', () => {
    const page = mockPage({ sections: [{ headingLevel: null, heading: null, paragraphs: ['Regardez tous les matchs en direct'], bullets: [] }] });
    const result = auditPage(page);
    expect(result.issues).toContainEqual(expect.objectContaining({ code: 'ALL_MATCHES_CLAIM' }));
  });

  it('Détection de compatibilité universelle', () => {
    const page = mockPage({ trustItems: ['Compatibilité universelle'] });
    const result = auditPage(page);
    expect(result.issues).toContainEqual(expect.objectContaining({ code: 'UNIVERSAL_COMPATIBILITY' }));
  });

  it('Détection de contournement FAI', () => {
    const page = mockPage({ h2: 'Tutoriel de contournement FAI' });
    const result = auditPage(page);
    expect(result.issues).toContainEqual(expect.objectContaining({ code: 'ISP_BYPASS_INSTRUCTION' }));
  });

  it('Détection de sideloading', () => {
    const page = mockPage({ sections: [{ headingLevel: 2, heading: 'Sideloading', paragraphs: [], bullets: [] }] });
    const result = auditPage(page);
    expect(result.issues).toContainEqual(expect.objectContaining({ code: 'SIDELOADING_INSTRUCTION' }));
  });

  it('Détection d’avis non vérifié', () => {
    const page = mockPage({ sections: [{ headingLevel: null, heading: null, paragraphs: ['"Excellent service" - *Jean, Client*'], bullets: [] }] });
    const result = auditPage(page);
    expect(result.issues).toContainEqual(expect.objectContaining({ code: 'UNVERIFIED_REVIEW' }));
  });

  it('Détection d’une affirmation factuelle sur un concurrent', () => {
    const page = mockPage({ paragraphs: [], sections: [{ headingLevel: null, heading: null, paragraphs: ['Notre service est meilleur que les autres, ce sont tous une arnaque'], bullets: [] }] });
    const result = auditPage(page);
    expect(result.issues).toContainEqual(expect.objectContaining({ code: 'COMPETITOR_FACT_UNVERIFIED' }));
  });

  it('HLS seul ne déclenche pas d’erreur', () => {
    const page = mockPage({ paragraphs: [], sections: [{ headingLevel: null, heading: null, paragraphs: ['Utilisation du format HLS pour le flux.'], bullets: [] }] });
    const result = auditPage(page);
    expect(result.issues).not.toContainEqual(expect.objectContaining({ code: 'ENGLISH_VISIBLE_COPY' }));
    expect(result.status).toBe('approved');
  });

  it('EPG seul ne déclenche pas d’erreur', () => {
    const page = mockPage({ paragraphs: [], sections: [{ headingLevel: null, heading: null, paragraphs: ['Guide EPG inclus.'], bullets: [] }] });
    const result = auditPage(page);
    expect(result.issues.length).toBe(0);
    expect(result.status).toBe('approved');
  });

  it('Une page blocked est noindex', () => {
    const page = mockPage({ path: '/iptv-france/securite-anti-blocage/' });
    const result = auditPage(page);
    expect(result.status).toBe('blocked');
    expect(result.noindex).toBe(true);
  });
});

describe('Audit Script Integration', () => {
  it('Les 69 routes obtiennent un statut et le manifeste source n\'est pas modifié', () => {
    // We execute the script and check output
    const scriptPath = path.join(process.cwd(), 'scripts', 'audit-content.mjs');
    const { execSync } = require('child_process');
    
    // Check initial pages.fr.json stat
    const pagesPath = path.join(process.cwd(), 'src', 'content', 'generated', 'pages.fr.json');
    const statBefore = fs.statSync(pagesPath);
    const contentBefore = fs.readFileSync(pagesPath, 'utf-8');

    // Run script
    execSync(`node ${scriptPath}`);

    const statAfter = fs.statSync(pagesPath);
    const contentAfter = fs.readFileSync(pagesPath, 'utf-8');

    // Le manifeste source n'est pas modifié
    expect(contentBefore).toBe(contentAfter);

    // Les 69 routes obtiennent un statut
    const statusPath = path.join(process.cwd(), 'src', 'content', 'generated', 'publication-status.fr.json');
    const statusData = JSON.parse(fs.readFileSync(statusPath, 'utf-8'));
    
    expect(statusData.length).toBe(69);
    statusData.forEach((s: any) => {
      expect(s.path).toBeDefined();
      expect(['approved', 'review_required', 'blocked']).toContain(s.status);
      if (s.status === 'blocked') {
        expect(s.noindex).toBe(true);
      }
    });
  });
});
