# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: no-checkout.spec.ts >> Absence de Checkout et de Paiement >> Aucun formulaire de paiement sur: /comparatif/cover-iptv/
- Location: tests/e2e/no-checkout.spec.ts:11:9

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8923/comparatif/cover-iptv/
Call log:
  - navigating to "http://localhost:8923/comparatif/cover-iptv/", waiting until "load"

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
  9  | test.describe('Absence de Checkout et de Paiement', () => {
  10 |   for (const route of routes) {
  11 |     test(`Aucun formulaire de paiement sur: ${route}`, async ({ page }) => {
> 12 |       await page.goto(route);
     |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8923/comparatif/cover-iptv/
  13 |       
  14 |       // Les pages ne doivent contenir AUCUN <form>
  15 |       const formCount = await page.locator('form').count();
  16 |       expect(formCount).toBe(0);
  17 | 
  18 |       // Les pages ne doivent pas contenir de panier ("cart")
  19 |       const cartCount = await page.locator('[id*="cart"], [class*="cart"], [id*="panier"], [class*="panier"]').count();
  20 |       // On s'attend à ce qu'il n'y ait aucun composant explicitement nommé cart/panier
  21 |       // (Attention: il peut y avoir des faux positifs si un mot contient "cart", 
  22 |       //  on vérifie plutôt l'absence d'input bancaire)
  23 |       
  24 |       // Absence stricte d'input liés au paiement
  25 |       const creditCardInputCount = await page.locator('input[type="number"], input[name*="card"], input[name*="cc-number"], input[autocomplete="cc-number"]').count();
  26 |       expect(creditCardInputCount).toBe(0);
  27 |     });
  28 |   }
  29 | 
  30 |   test('Page /tarifs-grossiste/ respecte les contraintes strictes', async ({ page }) => {
  31 |     await page.goto('/tarifs-grossiste/');
  32 |     
  33 |     // 5 cartes serveurs minimum
  34 |     // Sur tarifs-grossiste, les cartes sont souvent définies par un tag particulier
  35 |     // On s'attend à 5 serveurs initiaux (Atlas Pro, Iron, Trex, Crystal, Lynx)
  36 |     const serverCards = await page.locator('article, .server-card, [data-server-card]').count();
  37 |     // Le test peut être ajusté en fonction du DOM réel, on teste >= 5
  38 |     expect(serverCards).toBeGreaterThanOrEqual(5);
  39 | 
  40 |     // Aucun prix fictif avec les symboles "€", "$" seuls (sauf s'il s'agit d'exemples de marge).
  41 |     // "Le mot « tarifs » désigne une prise de contact commerciale".
  42 |     // La règle exacte : "aucun prix inventé". 
  43 |     // On vérifie que la page affiche bien le CTA commercial.
  44 |     const ctas = await page.locator('a:has-text("WhatsApp")').count();
  45 |     expect(ctas).toBeGreaterThanOrEqual(1);
  46 | 
  47 |     // On vérifie à nouveau l'absence totale de <form> (checkout)
  48 |     expect(await page.locator('form').count()).toBe(0);
  49 |   });
  50 | });
  51 | 
```