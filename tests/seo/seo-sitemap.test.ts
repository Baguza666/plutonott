import { describe, it, expect, vi } from 'vitest';
import sitemap from '../../src/app/sitemap';

// Mocking dependencies to avoid reading real files if we want to isolate
vi.mock('../../src/content/route-groups', () => ({
  getNonComparisonStaticPaths: () => ['/page1/', '/blocked-page/']
}));

vi.mock('../../src/content/get-publication-status', () => ({
  getPublicationStatus: (path: string) => {
    if (path === '/blocked-page/') return { status: 'blocked' };
    return { status: 'approved' };
  }
}));

describe('Générateur Sitemap', () => {
  it('exclut les pages bloquées ou non validées', async () => {
    // on a besoin que getSiteUrl ne throw pas
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://pluton-ott.com');
    vi.stubEnv('NODE_ENV', 'production');

    const urls = await sitemap();
    
    // On s'attend à ce que /page1/ y soit, mais pas /blocked-page/
    const page1 = urls.find(u => u.url.includes('/page1/'));
    const blockedPage = urls.find(u => u.url.includes('/blocked-page/'));
    
    expect(page1).toBeDefined();
    expect(blockedPage).toBeUndefined();
  });
});
