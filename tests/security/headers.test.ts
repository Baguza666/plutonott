import * as fs from 'fs';
import * as path from 'path';
import { describe, test, expect, beforeAll } from 'vitest';

describe('Configuration de sécurité Vercel & Environnement', () => {
  const vercelPath = path.resolve(__dirname, '../../vercel.json');
  const envExamplePath = path.resolve(__dirname, '../../.env.example');

  let vercelConfig: any = null;

  beforeAll(() => {
    if (fs.existsSync(vercelPath)) {
      vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    }
  });

  test('vercel.json doit exister et contenir des headers', () => {
    expect(fs.existsSync(vercelPath)).toBe(true);
    expect(vercelConfig).toHaveProperty('headers');
    expect(Array.isArray(vercelConfig.headers)).toBe(true);
  });

  test('Les headers doivent cibler toutes les routes (source: /(.*))', () => {
    const globalHeaders = vercelConfig.headers.find((h: any) => h.source === '/(.*)');
    expect(globalHeaders).toBeTruthy();
    expect(Array.isArray(globalHeaders.headers)).toBe(true);
  });

  test('Les headers de sécurité critiques doivent être présents', () => {
    const globalHeaders = vercelConfig.headers.find((h: any) => h.source === '/(.*)').headers;
    const getHeader = (key: string) => globalHeaders.find((h: any) => h.key.toLowerCase() === key.toLowerCase())?.value;

    expect(getHeader('X-Content-Type-Options')).toBe('nosniff');
    expect(getHeader('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(getHeader('Strict-Transport-Security')).toContain('max-age=');
    expect(getHeader('Cross-Origin-Resource-Policy')).toBeTruthy();
  });

  test('La Content-Security-Policy doit être restrictive', () => {
    const globalHeaders = vercelConfig.headers.find((h: any) => h.source === '/(.*)').headers;
    const csp = globalHeaders.find((h: any) => h.key.toLowerCase() === 'content-security-policy')?.value;
    
    expect(csp).toBeTruthy();
    
    // Vérification des directives requises
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("img-src 'self' data:");
    expect(csp).toContain("font-src 'self'");
    expect(csp).toContain("connect-src 'self'"); // Sans domaine externe
    expect(csp).toContain("frame-src 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("upgrade-insecure-requests");

    // "Aucun wildcard externe"
    expect(csp).not.toContain('*');
    expect(csp).not.toMatch(/https:\/\/(?!(wa\.me))/); // pas de domaines externes (sauf si wa.me était explicitement requis, mais "wa.me ne nécessite pas connect-src car il s’agit d’une navigation").
  });

  test('.env.example doit exister et ne contenir que NEXT_PUBLIC_SITE_URL', () => {
    expect(fs.existsSync(envExamplePath)).toBe(true);
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    const lines = envContent.split('\n').filter(l => l.trim().length > 0 && !l.startsWith('#'));
    
    expect(lines.length).toBe(1);
    expect(lines[0]).toMatch(/^NEXT_PUBLIC_SITE_URL=https:\/\//);
    
    // Vérifier l'absence absolue de secrets
    expect(envContent).not.toContain('SUPABASE_');
    expect(envContent).not.toContain('DATABASE_URL');
    expect(envContent).not.toContain('STRIPE_');
    expect(envContent).not.toContain('SECRET');
  });

  test('Aucun endpoint API ne doit être présent dans le dossier app/api', () => {
    const apiPath = path.resolve(__dirname, '../../src/app/api');
    expect(fs.existsSync(apiPath)).toBe(false);
  });
});
