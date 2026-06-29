import { describe, it, expect } from 'vitest';
import { generateOrganizationSchema, generateBreadcrumbSchema, generateFaqSchema } from '../../src/lib/seo/json-ld';

describe('Générateurs JSON-LD', () => {
  it('OrganizationSchema contient les informations minimales sans LocalBusiness ni contactPoint', () => {
    const org = generateOrganizationSchema();
    expect(org['@type']).toBe('Organization');
    expect(org.name).toBe('Pluton OTT');
    expect(org.url).toBeDefined();
    expect(org.contactPoint).toBeUndefined();
    expect(org.address).toBeUndefined();
    
    // Validation stricte contre LocalBusiness
    expect(org['@type']).not.toBe('LocalBusiness');
  });

  it('BreadcrumbList utilise correctement les chemins', () => {
    const breadcrumb = generateBreadcrumbSchema('/comparatif/iron-iptv/');
    expect(breadcrumb['@type']).toBe('BreadcrumbList');
    expect(breadcrumb.itemListElement).toBeDefined();
    
    const elements = breadcrumb.itemListElement as any[];
    // Pour /comparatif/iron-iptv/ -> accueil (/) -> comparatif (/comparatif/) -> iron-iptv (/comparatif/iron-iptv/)
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[elements.length - 1].item).toMatch(/iron-iptv\/$/);
  });

  it('FAQPage correspond exactement au contenu', () => {
    const items = [
      { question: 'Q1?', answer: 'R1' },
      { question: 'Q2?', answer: 'R2' }
    ];
    const faq = generateFaqSchema(items);
    
    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity.length).toBe(2);
    expect(faq.mainEntity[0].name).toBe('Q1?');
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe('R1');
  });

  it('Aucun JSON-LD ne génère de type e-commerce interdit', () => {
    const jsonString = JSON.stringify(generateOrganizationSchema()) + 
                       JSON.stringify(generateBreadcrumbSchema('/')) + 
                       JSON.stringify(generateFaqSchema([{question: 'A?', answer: 'B'}]));
                       
    expect(jsonString).not.toContain('"@type":"Product"');
    expect(jsonString).not.toContain('"@type":"Offer"');
    expect(jsonString).not.toContain('"@type":"AggregateOffer"');
    expect(jsonString).not.toContain('"@type":"Review"');
    expect(jsonString).not.toContain('"@type":"AggregateRating"');
  });
});
