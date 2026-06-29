# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: no-backend.spec.ts >> Aucun backend ni tracking externe >> Interception stricte sur la route: /comparatif/iplay-iptv/
- Location: tests/e2e/no-backend.spec.ts:13:9

# Error details

```
Error: page.goto: Could not connect to the server.
Call log:
  - navigating to "http://localhost:8923/comparatif/iplay-iptv/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import * as fs from 'fs';
  3  | import * as path from 'path';
  4  | 
  5  | const pagesPath = path.resolve(__dirname, '../../src/content/generated/pages.fr.json');
  6  | const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
  7  | // On peut se limiter à quelques routes représentatives pour ce test de backend
  8  | // afin d'optimiser, ou toutes les faire. L'énoncé dit "vérifiant les 69 routes".
  9  | const routes = pagesData.map((p: any) => p.path);
  10 | 
  11 | test.describe('Aucun backend ni tracking externe', () => {
  12 |   for (const route of routes) {
  13 |     test(`Interception stricte sur la route: ${route}`, async ({ page }) => {
  14 |       let illegalRequestFound = false;
  15 |       let illegalRequestUrl = '';
  16 | 
  17 |       // Intercepter TOUTES les requêtes réseau
  18 |       await page.route('**/*', (route) => {
  19 |         const url = route.request().url();
  20 |         const hostname = new URL(url).hostname;
  21 |         const pathname = new URL(url).pathname;
  22 | 
  23 |         // Domaines interdits
  24 |         const forbiddenDomains = [
  25 |           'supabase', 
  26 |           'firebase', 
  27 |           'google-analytics', 
  28 |           'analytics.google', 
  29 |           'segment', 
  30 |           'mixpanel', 
  31 |           'hotjar'
  32 |         ];
  33 | 
  34 |         // Vérification du domaine
  35 |         const hasForbiddenDomain = forbiddenDomains.some(d => hostname.includes(d));
  36 |         // Vérification des appels internes API (Next.js)
  37 |         const isApiCall = pathname.startsWith('/api/');
  38 | 
  39 |         if (hasForbiddenDomain || isApiCall) {
  40 |           illegalRequestFound = true;
  41 |           illegalRequestUrl = url;
  42 |           // Bloquer la requête immédiatement
  43 |           return route.abort();
  44 |         }
  45 | 
  46 |         // On autorise la requête locale ou CDN classique
  47 |         route.continue();
  48 |       });
  49 | 
> 50 |       await page.goto(route);
     |                  ^ Error: page.goto: Could not connect to the server.
  51 | 
  52 |       // On s'attend à ce qu'aucune requête illégale n'ait été interceptée
  53 |       expect(illegalRequestFound, `Une requête illégale a été émise vers : ${illegalRequestUrl}`).toBe(false);
  54 | 
  55 |       // Vérifier l'absence de JSON-LD non autorisé (Product, Offer)
  56 |       const jsonLdElements = await page.locator('script[type="application/ld+json"]').all();
  57 |       for (const el of jsonLdElements) {
  58 |         const content = await el.textContent();
  59 |         if (content) {
  60 |           const json = JSON.parse(content);
  61 |           // Si le JSON-LD est un tableau (Graph) ou un objet unique
  62 |           const types = Array.isArray(json) 
  63 |             ? json.map(j => j['@type']) 
  64 |             : json['@graph'] 
  65 |               ? json['@graph'].map((j:any) => j['@type'])
  66 |               : [json['@type']];
  67 |           
  68 |           expect(types).not.toContain('Product');
  69 |           expect(types).not.toContain('Offer');
  70 |           expect(types).not.toContain('AggregateOffer');
  71 |           expect(types).not.toContain('Review');
  72 |           expect(types).not.toContain('AggregateRating');
  73 |           expect(types).not.toContain('LocalBusiness');
  74 |         }
  75 |       }
  76 |     });
  77 |   }
  78 | });
  79 | 
```