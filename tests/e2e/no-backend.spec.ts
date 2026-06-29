import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const pagesPath = path.resolve(__dirname, '../../src/content/generated/pages.fr.json');
const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
// On peut se limiter à quelques routes représentatives pour ce test de backend
// afin d'optimiser, ou toutes les faire. L'énoncé dit "vérifiant les 69 routes".
const routes = pagesData.map((p: any) => p.path);

test.describe('Aucun backend ni tracking externe', () => {
  for (const route of routes) {
    test(`Interception stricte sur la route: ${route}`, async ({ page }) => {
      let illegalRequestFound = false;
      let illegalRequestUrl = '';

      // Intercepter TOUTES les requêtes réseau
      await page.route('**/*', (route) => {
        const url = route.request().url();
        const hostname = new URL(url).hostname;
        const pathname = new URL(url).pathname;

        // Domaines interdits
        const forbiddenDomains = [
          'supabase', 
          'firebase', 
          'google-analytics', 
          'analytics.google', 
          'segment', 
          'mixpanel', 
          'hotjar'
        ];

        // Vérification du domaine
        const hasForbiddenDomain = forbiddenDomains.some(d => hostname.includes(d));
        // Vérification des appels internes API (Next.js)
        const isApiCall = pathname.startsWith('/api/');

        if (hasForbiddenDomain || isApiCall) {
          illegalRequestFound = true;
          illegalRequestUrl = url;
          // Bloquer la requête immédiatement
          return route.abort();
        }

        // On autorise la requête locale ou CDN classique
        route.continue();
      });

      await page.goto(route);

      // On s'attend à ce qu'aucune requête illégale n'ait été interceptée
      expect(illegalRequestFound, `Une requête illégale a été émise vers : ${illegalRequestUrl}`).toBe(false);

      // Vérifier l'absence de JSON-LD non autorisé (Product, Offer)
      const jsonLdElements = await page.locator('script[type="application/ld+json"]').all();
      for (const el of jsonLdElements) {
        const content = await el.textContent();
        if (content) {
          const json = JSON.parse(content);
          // Si le JSON-LD est un tableau (Graph) ou un objet unique
          const types = Array.isArray(json) 
            ? json.map(j => j['@type']) 
            : json['@graph'] 
              ? json['@graph'].map((j:any) => j['@type'])
              : [json['@type']];
          
          expect(types).not.toContain('Product');
          expect(types).not.toContain('Offer');
          expect(types).not.toContain('AggregateOffer');
          expect(types).not.toContain('Review');
          expect(types).not.toContain('AggregateRating');
          expect(types).not.toContain('LocalBusiness');
        }
      }
    });
  }
});
