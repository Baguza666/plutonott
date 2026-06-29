import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Charger le statut de publication
const statusPath = path.resolve(__dirname, '../../src/content/generated/publication-status.fr.json');
const statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));

test.describe('Contrôles SEO (Noindex & Publication Status)', () => {
  for (const pageStatus of statusData) {
    // Ne tester que si c'est blocked ou review_required
    if (pageStatus.status === 'blocked' || pageStatus.status === 'review_required') {
      test(`La route ${pageStatus.path} doit être en noindex (${pageStatus.status})`, async ({ page }) => {
        const response = await page.goto(pageStatus.path);
        expect(response?.status()).toBe(200);

        // Vérifier la balise meta robots de manière robuste aux doublons
        const robotsMetaElements = page.locator('meta[name="robots"]');
        const count = await robotsMetaElements.count();
        let hasNoIndex = false;
        for (let i = 0; i < count; i++) {
          const content = await robotsMetaElements.nth(i).getAttribute('content');
          if (content && content.includes('noindex')) {
            hasNoIndex = true;
          }
        }
        expect(hasNoIndex).toBe(true);

        // Vérifier que le contenu spécifique "blocked" ne montre pas les mots interdits
        if (pageStatus.status === 'blocked' && pageStatus.blockedReasons) {
          // On s'attend à ce que le Warning (ValidationNotice) apparaisse
          const warningCount = await page.locator('text="Publication bloquée"').count();
          expect(warningCount).toBeGreaterThan(0);
        }
      });
    } else {
      // Pages en "published"
      test(`La route ${pageStatus.path} doit être indexable (published)`, async ({ page }) => {
        const response = await page.goto(pageStatus.path);
        expect(response?.status()).toBe(200);

        const robotsMetaElements = page.locator('meta[name="robots"]');
        const count = await robotsMetaElements.count();
        for (let i = 0; i < count; i++) {
          const content = await robotsMetaElements.nth(i).getAttribute('content');
          if (content) {
            expect(content).not.toContain('noindex');
          }
        }
      });
    }
  }
});
