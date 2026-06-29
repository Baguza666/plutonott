import { describe, it, expect } from 'vitest';
import { getNonComparisonStaticPaths } from '../../src/content/route-groups';
import { getPageByPath } from '../../src/content/get-page-content';
import { getPublicationStatus } from '../../src/content/get-publication-status';
import { resolveWhatsAppContext } from '../../src/content/resolve-whatsapp-context';
import { PageContent } from '../../src/content/page.types';

describe('Static Content Routes Helpers', () => {
  it('Exclut les routes /, /tarifs-grossiste/, et /comparatif/*', () => {
    const paths = getNonComparisonStaticPaths();
    expect(paths).not.toContain('/');
    expect(paths).not.toContain('/tarifs-grossiste/');
    expect(paths.some(p => p.startsWith('/comparatif/'))).toBe(false);
    expect(paths.length).toBeGreaterThan(0);
    // All paths should end with a slash
    paths.forEach(p => {
      expect(p.endsWith('/')).toBe(true);
    });
  });

  it('Retourne une page valide pour un path existant', () => {
    const page = getPageByPath('/iptv-france/installation/');
    expect(page).toBeDefined();
    expect(page?.h1).toBeDefined();
  });

  it('Retourne un status valide pour un path existant', () => {
    const status = getPublicationStatus('/iptv-france/installation/');
    expect(status).toBeDefined();
    expect(status?.status).toBeDefined();
  });

  it('Retourne undefined pour une route inconnue', () => {
    expect(getPageByPath('/route-inconnue/')).toBeUndefined();
    expect(getPublicationStatus('/route-inconnue/')).toBeUndefined();
  });
});

describe('WhatsApp Context Resolver', () => {
  const mockPage = (intent: string): PageContent => ({
    path: '/test/',
    intent,
    h1: 'Test',
    h2: null,
    trustItems: [],
    sections: [],
    ctaLabels: [],
    schemaDirectives: [],
    sourceIndex: 0
  });

  it('Mappe correctement l\'intent support', () => {
    const result = resolveWhatsAppContext(mockPage('support'));
    expect(result.intent).toBe('support');
    
    const result2 = resolveWhatsAppContext(mockPage('contact-support'));
    expect(result2.intent).toBe('support');
  });

  it('Mappe correctement l\'intent test-gratuit', () => {
    const result = resolveWhatsAppContext(mockPage('test-gratuit'));
    expect(result.intent).toBe('essai');
  });

  it('Mappe correctement l\'intent juridique', () => {
    const result = resolveWhatsAppContext(mockPage('politique'));
    expect(result.intent).toBe('juridique');
    
    const result2 = resolveWhatsAppContext(mockPage('juridique'));
    expect(result2.intent).toBe('juridique');
  });

  it('Mappe correctement l\'intent commercial', () => {
    const result = resolveWhatsAppContext(mockPage('commercial'));
    expect(result.intent).toBe('commercial');
    
    const result2 = resolveWhatsAppContext(mockPage('transactional'));
    expect(result2.intent).toBe('commercial');
  });

  it('Mappe les autres intents en information', () => {
    const result = resolveWhatsAppContext(mockPage('autre-chose'));
    expect(result.intent).toBe('information');
  });
});
