import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Charger le manifeste statique généré
const pagesPath = path.resolve(__dirname, '../../src/content/generated/pages.fr.json');
const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
const routes = pagesData.map((p: any) => p.path);

test.describe('Exhaustive Routes Tests', () => {
  test('Doit contenir exactement 69 routes uniques', () => {
    expect(routes.length).toBe(69);
    const uniqueRoutes = new Set(routes);
    expect(uniqueRoutes.size).toBe(69);
  });

  for (const route of routes) {
    test(`Test intégrité route: ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      
      // 1. HTTP 200 (puisque Next.js export statique / serve va répondre 200 pour le HTML)
      expect(response?.status()).toBe(200);

      // 2. lang="fr"
      const htmlLang = await page.getAttribute('html', 'lang');
      expect(htmlLang).toBe('fr');

      // 3. H1 conforme (il doit y en avoir exactement un, non vide)
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      const h1Text = await page.locator('h1').textContent();
      expect(h1Text?.trim().length).toBeGreaterThan(0);

      // 4. Balise canonical présente
      const canonicalHref = await page.getAttribute('link[rel="canonical"]', 'href');
      expect(canonicalHref).toBeTruthy();

      // 5. Assertions SEO de base : Le titre ne doit pas contenir undefined ou être vide
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).not.toContain('undefined');
    });
  }
});
