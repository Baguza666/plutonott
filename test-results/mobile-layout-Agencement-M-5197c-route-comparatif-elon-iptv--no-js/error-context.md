# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-layout.spec.ts >> Agencement Mobile et Scroll Horizontal >> Vérification du layout sur la route: /comparatif/elon-iptv/
- Location: tests/e2e/mobile-layout.spec.ts:15:9

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8923/comparatif/elon-iptv/
Call log:
  - navigating to "http://localhost:8923/comparatif/elon-iptv/", waiting until "load"

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
  9  | test.describe('Agencement Mobile et Scroll Horizontal', () => {
  10 |   // On ne le lance que sur les projets mobiles configurés (ex: mobile-320, mobile-375)
  11 |   // On peut s'assurer de l'exécuter globalement et la configuration filtrera,
  12 |   // ou on vérifie le viewport courant.
  13 | 
  14 |   for (const route of routes) {
  15 |     test(`Vérification du layout sur la route: ${route}`, async ({ page }) => {
> 16 |       await page.goto(route);
     |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8923/comparatif/elon-iptv/
  17 |       
  18 |       // La page ne doit pas avoir de scroll horizontal
  19 |       const hasHorizontalScroll = await page.evaluate(() => {
  20 |         return document.documentElement.scrollWidth > window.innerWidth;
  21 |       });
  22 |       
  23 |       expect(hasHorizontalScroll, 'Scroll horizontal détecté sur la page').toBe(false);
  24 | 
  25 |       // Vérifier le Footer et le Sticky CTA Mobile (qui ne doit pas masquer le footer)
  26 |       // La règle : "Le padding-bottom (pb-24 md:pb-0) réserve l'espace pour la MobileWhatsAppBar"
  27 |       
  28 |       // On teste uniquement si on est sur petit écran (largeur < 768)
  29 |       const viewportSize = page.viewportSize();
  30 |       if (viewportSize && viewportSize.width < 768) {
  31 |         // Le Main a-t-il la classe pb-24 ou pb-32 ? (via l'implémentation, on sait que SiteShell ajoute pb-24)
  32 |         // Vérifions directement si le Main a la place réservée
  33 |         const main = page.locator('main#main, main#contenu-principal');
  34 |         if (await main.count() > 0) {
  35 |           const classList = await main.first().getAttribute('class');
  36 |           // s'assurer qu'on prévoit bien l'espace en bas
  37 |           expect(classList).toMatch(/pb-\d+/);
  38 |         }
  39 |       }
  40 |     });
  41 |   }
  42 | });
  43 | 
```