# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: all-routes.spec.ts >> Exhaustive Routes Tests >> Test intégrité route: /comparatif/mario-iptv/
- Location: tests/e2e/all-routes.spec.ts:18:9

# Error details

```
Error: page.goto: Could not connect to the server.
Call log:
  - navigating to "http://localhost:8923/comparatif/mario-iptv/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import * as fs from 'fs';
  3  | import * as path from 'path';
  4  | 
  5  | // Charger le manifeste statique généré
  6  | const pagesPath = path.resolve(__dirname, '../../src/content/generated/pages.fr.json');
  7  | const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
  8  | const routes = pagesData.map((p: any) => p.path);
  9  | 
  10 | test.describe('Exhaustive Routes Tests', () => {
  11 |   test('Doit contenir exactement 69 routes uniques', () => {
  12 |     expect(routes.length).toBe(69);
  13 |     const uniqueRoutes = new Set(routes);
  14 |     expect(uniqueRoutes.size).toBe(69);
  15 |   });
  16 | 
  17 |   for (const route of routes) {
  18 |     test(`Test intégrité route: ${route}`, async ({ page }) => {
> 19 |       const response = await page.goto(route);
     |                                   ^ Error: page.goto: Could not connect to the server.
  20 |       
  21 |       // 1. HTTP 200 (puisque Next.js export statique / serve va répondre 200 pour le HTML)
  22 |       expect(response?.status()).toBe(200);
  23 | 
  24 |       // 2. lang="fr"
  25 |       const htmlLang = await page.getAttribute('html', 'lang');
  26 |       expect(htmlLang).toBe('fr');
  27 | 
  28 |       // 3. H1 conforme (il doit y en avoir exactement un, non vide)
  29 |       const h1Count = await page.locator('h1').count();
  30 |       expect(h1Count).toBe(1);
  31 |       const h1Text = await page.locator('h1').textContent();
  32 |       expect(h1Text?.trim().length).toBeGreaterThan(0);
  33 | 
  34 |       // 4. Balise canonical présente
  35 |       const canonicalHref = await page.getAttribute('link[rel="canonical"]', 'href');
  36 |       expect(canonicalHref).toBeTruthy();
  37 | 
  38 |       // 5. Assertions SEO de base : Le titre ne doit pas contenir undefined ou être vide
  39 |       const title = await page.title();
  40 |       expect(title.length).toBeGreaterThan(0);
  41 |       expect(title).not.toContain('undefined');
  42 |     });
  43 |   }
  44 | });
  45 | 
```