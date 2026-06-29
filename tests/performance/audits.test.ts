import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { checkAssetsDirectory } from '../../scripts/audit-assets.mjs';
import { calculateTotalCssGzipSize } from '../../scripts/audit-css-budget.mjs';
import { checkClientComponents } from '../../scripts/audit-client-javascript.mjs';
import { CRITICAL_CSS } from '../../src/styles/critical-css';

vi.mock('image-size', () => {
  return {
    default: (file) => {
      if (file.includes('fake')) throw new Error('Not an image');
      if (file.includes('hero-image')) return { width: 100, height: 100 };
      return { width: 1, height: 1 };
    }
  };
});

const TEMP_DIR = path.join(process.cwd(), 'tests', 'temp_audit_dir');

describe('Audits de Performance et Qualité', () => {
  beforeEach(() => {
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
  });

  describe('audit-assets.mjs', () => {
    it('détecte et rejette les JPG', async () => {
      fs.writeFileSync(path.join(TEMP_DIR, 'test.jpg'), 'fake content');
      const errors = await checkAssetsDirectory(TEMP_DIR);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('Format interdit détecté');
    });

    it('détecte et rejette les PNG', async () => {
      fs.writeFileSync(path.join(TEMP_DIR, 'test.png'), 'fake content');
      const errors = await checkAssetsDirectory(TEMP_DIR);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('Format interdit détecté');
    });

    it('rejette une image hero de plus de 200000 octets', async () => {
      // 200KB = 204800 octets. On crée un buffer plus grand.
      const bigBuffer = Buffer.alloc(205000, 0); 
      fs.writeFileSync(path.join(TEMP_DIR, 'hero-image.webp'), bigBuffer);
      const errors = await checkAssetsDirectory(TEMP_DIR);
      
      expect(errors.some(e => e.includes('L\'image hero dépasse 200KB'))).toBe(true);
    });

    it('accepte les WebP valides sous la limite', async () => {
      fs.writeFileSync(path.join(TEMP_DIR, 'hero.webp'), 'fake image content for mock');
      
      const errors = await checkAssetsDirectory(TEMP_DIR);
      // Taille < 200KB, Dimensions OK, Format OK -> 0 erreur
      expect(errors).toHaveLength(0);
    });
    
    it('rejette une image sans dimensions', async () => {
      // Le mock throw une erreur si "fake" est dans le nom
      fs.writeFileSync(path.join(TEMP_DIR, 'fake.webp'), 'not a real image');
      const errors = await checkAssetsDirectory(TEMP_DIR);
      expect(errors.some(e => e.includes('Impossible de lire les dimensions'))).toBe(true);
    });
  });

  describe('audit-css-budget.mjs', () => {
    it('rejette un CSS total supérieur à 51200 octets gzippé', async () => {
      // Créons un fichier CSS énorme et très dur à compresser
      const hugeRandomStr = Buffer.alloc(300000).map(() => Math.floor(Math.random() * 256)).toString('base64');
      fs.writeFileSync(path.join(TEMP_DIR, 'style.css'), hugeRandomStr);
      
      const size = await calculateTotalCssGzipSize(TEMP_DIR);
      expect(size).toBeGreaterThan(51200);
    });

    it('accepte un CSS total inférieur ou égal à 51200 octets gzippé', async () => {
      fs.writeFileSync(path.join(TEMP_DIR, 'style.css'), '.test { color: red; }');
      
      const size = await calculateTotalCssGzipSize(TEMP_DIR);
      expect(size).toBeLessThanOrEqual(51200);
    });
  });

  describe('audit-client-javascript.mjs', () => {
    it('détecte les composants "use client"', async () => {
      fs.writeFileSync(path.join(TEMP_DIR, 'BadComponent.tsx'), '"use client";\nexport default function Bad() {}');
      fs.writeFileSync(path.join(TEMP_DIR, 'GoodComponent.tsx'), 'export default function Good() {}');
      
      const clientFiles = await checkClientComponents(TEMP_DIR);
      expect(clientFiles).toHaveLength(1);
      expect(clientFiles[0]).toContain('BadComponent.tsx');
    });
  });

  describe('Critical CSS', () => {
    it('est présent et fait moins de 8 KB non compressé', () => {
      expect(CRITICAL_CSS).toBeDefined();
      expect(CRITICAL_CSS.length).toBeLessThan(8192); // 8 KB
      expect(CRITICAL_CSS).toContain('box-sizing');
      expect(CRITICAL_CSS).toContain('.hero-placeholder');
    });
  });
});
