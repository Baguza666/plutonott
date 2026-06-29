# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: seo-status.spec.ts >> Contrôles SEO (Noindex & Publication Status) >> La route /revendeur/choisir-entre-sub-reseller-et-master/ doit être en noindex (review_required)
- Location: tests/e2e/seo-status.spec.ts:13:11

# Error details

```
Error: page.goto: Could not connect to the server.
Call log:
  - navigating to "http://localhost:8923/revendeur/choisir-entre-sub-reseller-et-master/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import * as fs from 'fs';
  3  | import * as path from 'path';
  4  | 
  5  | // Charger le statut de publication
  6  | const statusPath = path.resolve(__dirname, '../../src/content/generated/publication-status.fr.json');
  7  | const statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
  8  | 
  9  | test.describe('Contrôles SEO (Noindex & Publication Status)', () => {
  10 |   for (const pageStatus of statusData) {
  11 |     // Ne tester que si c'est blocked ou review_required
  12 |     if (pageStatus.status === 'blocked' || pageStatus.status === 'review_required') {
  13 |       test(`La route ${pageStatus.path} doit être en noindex (${pageStatus.status})`, async ({ page }) => {
> 14 |         const response = await page.goto(pageStatus.path);
     |                                     ^ Error: page.goto: Could not connect to the server.
  15 |         expect(response?.status()).toBe(200);
  16 | 
  17 |         // Vérifier la balise meta robots de manière robuste aux doublons
  18 |         const robotsMetaElements = page.locator('meta[name="robots"]');
  19 |         const count = await robotsMetaElements.count();
  20 |         let hasNoIndex = false;
  21 |         for (let i = 0; i < count; i++) {
  22 |           const content = await robotsMetaElements.nth(i).getAttribute('content');
  23 |           if (content && content.includes('noindex')) {
  24 |             hasNoIndex = true;
  25 |           }
  26 |         }
  27 |         expect(hasNoIndex).toBe(true);
  28 | 
  29 |         // Vérifier que le contenu spécifique "blocked" ne montre pas les mots interdits
  30 |         if (pageStatus.status === 'blocked' && pageStatus.blockedReasons) {
  31 |           // On s'attend à ce que le Warning (ValidationNotice) apparaisse
  32 |           const warningCount = await page.locator('text="Publication bloquée"').count();
  33 |           expect(warningCount).toBeGreaterThan(0);
  34 |         }
  35 |       });
  36 |     } else {
  37 |       // Pages en "published"
  38 |       test(`La route ${pageStatus.path} doit être indexable (published)`, async ({ page }) => {
  39 |         const response = await page.goto(pageStatus.path);
  40 |         expect(response?.status()).toBe(200);
  41 | 
  42 |         const robotsMetaElements = page.locator('meta[name="robots"]');
  43 |         const count = await robotsMetaElements.count();
  44 |         for (let i = 0; i < count; i++) {
  45 |           const content = await robotsMetaElements.nth(i).getAttribute('content');
  46 |           if (content) {
  47 |             expect(content).not.toContain('noindex');
  48 |           }
  49 |         }
  50 |       });
  51 |     }
  52 |   }
  53 | });
  54 | 
```