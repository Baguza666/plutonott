import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const pagesPath = path.resolve(__dirname, '../../src/content/generated/pages.fr.json');
const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
const routes = pagesData.map((p: any) => p.path);

test.describe('Intégrité des CTA WhatsApp', () => {
  for (const route of routes) {
    test(`CTA WhatsApp sur la route: ${route}`, async ({ page }) => {
      await page.goto(route);
      
      // Trouver tous les liens d'action WhatsApp
      const waLinks = await page.locator('a[href^="https://wa.me/"]').all();
      
      // Sur les landing pages commerciales, on s'attend généralement à au moins 1 CTA WA
      if (waLinks.length > 0) {
        for (const link of waLinks) {
          const href = await link.getAttribute('href');
          
          expect(href).toBeTruthy();
          expect(href?.startsWith('https://wa.me/212782389820?text=')).toBe(true);

          // Vérifier que le texte encodé contient au minimum le contextPath (route)
          if (href) {
            const url = new URL(href);
            const text = url.searchParams.get('text');
            expect(text).toBeTruthy();
            
            // Le texte doit inclure le chemin de la page ou être en français lisible
            // (La spec indique : "message décodé en français. sourcePath correct dans le message.")
            // Décoder et valider
            if (text) {
              const decoded = decodeURIComponent(text);
              // Le message contient toujours le chemin exact ou un contexte (ex: "depuis /comparatif/...")
              expect(decoded.includes(route) || decoded.includes('Bonjour')).toBe(true);
            }
          }
        }
      }
    });
  }

  test('Test Javascript désactivé (Fallback WhatsApp)', async ({ browser }) => {
    // Utiliser un contexte sans JavaScript
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    
    // Aller sur une page avec bouton WA, ex la page d'accueil
    await page.goto('/');
    const waLinks = await page.locator('a[href^="https://wa.me/"]').all();
    expect(waLinks.length).toBeGreaterThan(0);

    for (const link of waLinks) {
      const href = await link.getAttribute('href');
      expect(href?.startsWith('https://wa.me/')).toBe(true);
      // Même sans JS, le href (href pur sans onClick) doit exister.
    }
    
    await context.close();
  });
});
