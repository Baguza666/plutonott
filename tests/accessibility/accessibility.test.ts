import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import axe from 'axe-core';

// Paths to test (as output by Next.js static export)
const routes = [
  { path: '/', file: 'index.html' },
  { path: '/tarifs-grossiste/', file: 'tarifs-grossiste/index.html' },
  { path: '/comparatif/iron-iptv/', file: 'comparatif/iron-iptv/index.html' },
  { path: '/iptv-france/support/', file: 'iptv-france/support/index.html' }
];

describe('Accessibilité & Sémantique (A11y)', () => {
  // Check if out/ exists, otherwise skip
  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) {
    console.warn("Le dossier out/ n'existe pas. Veuillez lancer npm run build d'abord.");
    return;
  }

  for (const route of routes) {
    describe(`Page: ${route.path}`, () => {
      let dom: JSDOM;
      let window: any;
      let document: Document;

      beforeAll(async () => {
        const filePath = path.join(outDir, route.file);
        const html = fs.readFileSync(filePath, 'utf-8');
        
        dom = new JSDOM(html, { runScripts: "dangerously" });
        window = dom.window;
        document = window.document;

        // Inject axe-core into the jsdom window
        const axePath = require.resolve('axe-core/axe.min.js');
        const axeCode = fs.readFileSync(axePath, 'utf8');
        const script = document.createElement('script');
        script.textContent = axeCode;
        document.head.appendChild(script);
        
        // Wait for script to be evaluated
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      it('Possède un et un seul H1', () => {
        const h1s = document.querySelectorAll('h1');
        expect(h1s.length).toBe(1);
      });

      it('Possède un lien d\'évitement valide vers le contenu principal', () => {
        const skipLink = document.querySelector('a[href="#contenu-principal"]');
        expect(skipLink).not.toBeNull();
        
        // Le href "#contenu-principal" doit correspondre à un ID sur la page
        const main = document.getElementById('contenu-principal');
        expect(main).not.toBeNull();
      });

      it('Les liens wa.me n\'ont pas de role="button" et sont correctement nommés', () => {
        const waLinks = document.querySelectorAll('a[href*="wa.me"]');
        waLinks.forEach(link => {
          expect(link.getAttribute('role')).not.toBe('button');
          
          const text = link.textContent?.trim() || '';
          const ariaLabel = link.getAttribute('aria-label') || '';
          // Il faut au moins un texte visible ou un aria-label
          expect(text.length > 0 || ariaLabel.length > 0).toBe(true);
        });
      });

      it('Passe l\'audit Axe-core sans violation critique ou sérieuse (color-contrast ignoré dans JSDOM)', async () => {
        // Exécuter Axe dans le contexte jsdom
        const results = await window.axe.run(document.documentElement, {
          rules: {
            'color-contrast': { enabled: false }, // JSDOM ne calcule pas le CSS rendu
          }
        });

        const criticalOrSerious = results.violations.filter(
          (v: any) => v.impact === 'critical' || v.impact === 'serious'
        );

        if (criticalOrSerious.length > 0) {
          console.error(`Violations d'accessibilité sur ${route.path} :`);
          console.error(JSON.stringify(criticalOrSerious, null, 2));
        }

        expect(criticalOrSerious.length).toBe(0);
      });
    });
  }
});
