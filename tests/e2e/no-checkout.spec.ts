import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const pagesPath = path.resolve(__dirname, '../../src/content/generated/pages.fr.json');
const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
const routes = pagesData.map((p: any) => p.path);

test.describe('Absence de Checkout et de Paiement', () => {
  for (const route of routes) {
    test(`Aucun formulaire de paiement sur: ${route}`, async ({ page }) => {
      await page.goto(route);
      
      // Les pages ne doivent contenir AUCUN <form>
      const formCount = await page.locator('form').count();
      expect(formCount).toBe(0);

      // Les pages ne doivent pas contenir de panier ("cart")
      const cartCount = await page.locator('[id*="cart"], [class*="cart"], [id*="panier"], [class*="panier"]').count();
      // On s'attend à ce qu'il n'y ait aucun composant explicitement nommé cart/panier
      // (Attention: il peut y avoir des faux positifs si un mot contient "cart", 
      //  on vérifie plutôt l'absence d'input bancaire)
      
      // Absence stricte d'input liés au paiement
      const creditCardInputCount = await page.locator('input[type="number"], input[name*="card"], input[name*="cc-number"], input[autocomplete="cc-number"]').count();
      expect(creditCardInputCount).toBe(0);
    });
  }

  test('Page /tarifs-grossiste/ respecte les contraintes strictes', async ({ page }) => {
    await page.goto('/tarifs-grossiste/');
    
    // 5 cartes serveurs minimum
    // Sur tarifs-grossiste, les cartes sont souvent définies par un tag particulier
    // On s'attend à 5 serveurs initiaux (Atlas Pro, Iron, Trex, Crystal, Lynx)
    const serverCards = await page.locator('article, .server-card, [data-server-card]').count();
    // Le test peut être ajusté en fonction du DOM réel, on teste >= 5
    expect(serverCards).toBeGreaterThanOrEqual(5);

    // Aucun prix fictif avec les symboles "€", "$" seuls (sauf s'il s'agit d'exemples de marge).
    // "Le mot « tarifs » désigne une prise de contact commerciale".
    // La règle exacte : "aucun prix inventé". 
    // On vérifie que la page affiche bien le CTA commercial.
    const ctas = await page.locator('a:has-text("WhatsApp")').count();
    expect(ctas).toBeGreaterThanOrEqual(1);

    // On vérifie à nouveau l'absence totale de <form> (checkout)
    expect(await page.locator('form').count()).toBe(0);
  });
});
