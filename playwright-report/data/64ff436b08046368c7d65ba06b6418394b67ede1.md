# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: whatsapp-links.spec.ts >> Intégrité des CTA WhatsApp >> CTA WhatsApp sur la route: /iptv-france/securite-anti-blocage/
- Location: tests/e2e/whatsapp-links.spec.ts:11:9

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8923/iptv-france/securite-anti-blocage/
Call log:
  - navigating to "http://localhost:8923/iptv-france/securite-anti-blocage/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import * as fs from 'fs';
  3  | import * as path from 'path';
  4  | 
  5  | const pagesPath = path.resolve(__dirname, '../../src/content/generated/pages.fr.json');
  6  | const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
  7  | const routes = pagesData.map((p: any) => p.path);
  8  | 
  9  | test.describe('Intégrité des CTA WhatsApp', () => {
  10 |   for (const route of routes) {
  11 |     test(`CTA WhatsApp sur la route: ${route}`, async ({ page }) => {
> 12 |       await page.goto(route);
     |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8923/iptv-france/securite-anti-blocage/
  13 |       
  14 |       // Trouver tous les liens d'action WhatsApp
  15 |       const waLinks = await page.locator('a[href^="https://wa.me/"]').all();
  16 |       
  17 |       // Sur les landing pages commerciales, on s'attend généralement à au moins 1 CTA WA
  18 |       if (waLinks.length > 0) {
  19 |         for (const link of waLinks) {
  20 |           const href = await link.getAttribute('href');
  21 |           
  22 |           expect(href).toBeTruthy();
  23 |           expect(href?.startsWith('https://wa.me/212782389820?text=')).toBe(true);
  24 | 
  25 |           // Vérifier que le texte encodé contient au minimum le contextPath (route)
  26 |           if (href) {
  27 |             const url = new URL(href);
  28 |             const text = url.searchParams.get('text');
  29 |             expect(text).toBeTruthy();
  30 |             
  31 |             // Le texte doit inclure le chemin de la page ou être en français lisible
  32 |             // (La spec indique : "message décodé en français. sourcePath correct dans le message.")
  33 |             // Décoder et valider
  34 |             if (text) {
  35 |               const decoded = decodeURIComponent(text);
  36 |               // Le message contient toujours le chemin exact ou un contexte (ex: "depuis /comparatif/...")
  37 |               expect(decoded.includes(route) || decoded.includes('Bonjour')).toBe(true);
  38 |             }
  39 |           }
  40 |         }
  41 |       }
  42 |     });
  43 |   }
  44 | 
  45 |   test('Test Javascript désactivé (Fallback WhatsApp)', async ({ browser }) => {
  46 |     // Utiliser un contexte sans JavaScript
  47 |     const context = await browser.newContext({ javaScriptEnabled: false });
  48 |     const page = await context.newPage();
  49 |     
  50 |     // Aller sur une page avec bouton WA, ex la page d'accueil
  51 |     await page.goto('/');
  52 |     const waLinks = await page.locator('a[href^="https://wa.me/"]').all();
  53 |     expect(waLinks.length).toBeGreaterThan(0);
  54 | 
  55 |     for (const link of waLinks) {
  56 |       const href = await link.getAttribute('href');
  57 |       expect(href?.startsWith('https://wa.me/')).toBe(true);
  58 |       // Même sans JS, le href (href pur sans onClick) doit exister.
  59 |     }
  60 |     
  61 |     await context.close();
  62 |   });
  63 | });
  64 | 
```