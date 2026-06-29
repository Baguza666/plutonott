import { describe, it, expect, vi, afterEach } from 'vitest';
import { getSiteUrl } from '../../src/lib/seo/site-url';
import { generatePageMetadata } from '../../src/lib/seo/generate-page-metadata';

describe('SEO Metadata & Site URL', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('getSiteUrl autorise localhost en dev', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(getSiteUrl()).toBe('http://localhost:3000');
  });

  it('getSiteUrl utilise NEXT_PUBLIC_SITE_URL en production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://pluton-ott.com');
    expect(getSiteUrl()).toBe('https://pluton-ott.com');
  });

  it('getSiteUrl échoue en production si NEXT_PUBLIC_SITE_URL manque', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    expect(() => getSiteUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it('generatePageMetadata génère le bon titre avec suffixe et fallback description', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://pluton-ott.com');
    
    const meta = generatePageMetadata({
      title: 'Comparatif Iron IPTV',
      path: '/comparatif/iron-iptv/',
      status: 'approved'
    });

    expect(meta.title).toBe('Comparatif Iron IPTV | Pluton OTT');
    expect(meta.description).toBeDefined();
    
    // Le canonical doit être absolu avec le trailing slash
    expect(meta.alternates?.canonical).toBe('https://pluton-ott.com/comparatif/iron-iptv/');
    
    // x-default et fr
    expect(meta.alternates?.languages?.['fr']).toBe('https://pluton-ott.com/comparatif/iron-iptv/');
    expect(meta.alternates?.languages?.['x-default']).toBe('https://pluton-ott.com/comparatif/iron-iptv/');
    
    // OG config
    expect(meta.openGraph?.locale).toBe('fr_FR');
    expect(meta.openGraph?.siteName).toBe('Pluton OTT');
    
    // La page approved doit être indexable (undefined ou robots absent ou index: true)
    // Next.js autorise l'indexation par défaut si `robots` n'est pas spécifié avec index: false
    const isNoIndex = meta.robots && typeof meta.robots === 'object' && meta.robots.index === false;
    expect(isNoIndex).toBeFalsy();
  });

  it('generatePageMetadata applique noindex pour les pages bloquées ou en review', () => {
    const metaBlocked = generatePageMetadata({
      title: 'Danger',
      path: '/danger/',
      status: 'blocked'
    });
    
    expect((metaBlocked.robots as any)?.index).toBe(false);

    const metaReview = generatePageMetadata({
      title: 'Review',
      path: '/review/',
      status: 'review_required'
    });
    
    expect((metaReview.robots as any)?.index).toBe(false);
  });
});
