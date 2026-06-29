import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const pagesPath = path.resolve(__dirname, '../../src/content/generated/pages.fr.json');
const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
const routes = pagesData.map((p: any) => p.path);

test.describe('Agencement Mobile et Scroll Horizontal', () => {
  // On ne le lance que sur les projets mobiles configurés (ex: mobile-320, mobile-375)
  // On peut s'assurer de l'exécuter globalement et la configuration filtrera,
  // ou on vérifie le viewport courant.

  for (const route of routes) {
    test(`Vérification du layout sur la route: ${route}`, async ({ page }) => {
      await page.goto(route);
      
      // La page ne doit pas avoir de scroll horizontal
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      
      expect(hasHorizontalScroll, 'Scroll horizontal détecté sur la page').toBe(false);

      // Vérifier le Footer et le Sticky CTA Mobile (qui ne doit pas masquer le footer)
      // La règle : "Le padding-bottom (pb-24 md:pb-0) réserve l'espace pour la MobileWhatsAppBar"
      
      // On teste uniquement si on est sur petit écran (largeur < 768)
      const viewportSize = page.viewportSize();
      if (viewportSize && viewportSize.width < 768) {
        // Le Main a-t-il la classe pb-24 ou pb-32 ? (via l'implémentation, on sait que SiteShell ajoute pb-24)
        // Vérifions directement si le Main a la place réservée
        const main = page.locator('main#main, main#contenu-principal');
        if (await main.count() > 0) {
          const classList = await main.first().getAttribute('class');
          // s'assurer qu'on prévoit bien l'espace en bas
          expect(classList).toMatch(/pb-\d+/);
        }
      }
    });
  }
});
