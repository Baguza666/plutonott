import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { checkFrenchUI } from '../../scripts/audit-french-ui.mjs';

const TEMP_DIR = path.join(process.cwd(), 'tests', 'temp_french_dir');

describe('Audit Langue (French UI)', () => {
  beforeEach(() => {
    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  });

  it('Audit échoue sur "Buy now"', async () => {
    fs.writeFileSync(path.join(TEMP_DIR, 'component.tsx'), '<button>Buy now</button>');
    const errors = await checkFrenchUI(TEMP_DIR);
    expect(errors.some(e => e.includes('Buy now'))).toBe(true);
  });

  it('Audit accepte Smart TV et WhatsApp (ils ne sont pas dans la denylist)', async () => {
    fs.writeFileSync(path.join(TEMP_DIR, 'component.tsx'), '<button>WhatsApp CTA on Smart TV</button>');
    const errors = await checkFrenchUI(TEMP_DIR);
    expect(errors).toHaveLength(0);
  });

  it('Audit échoue peu importe la casse (ex: "checkOut")', async () => {
    fs.writeFileSync(path.join(TEMP_DIR, 'file.ts'), 'const x = "Proceed to checkOut";');
    const errors = await checkFrenchUI(TEMP_DIR);
    expect(errors.some(e => e.includes('Checkout'))).toBe(true);
  });
});
