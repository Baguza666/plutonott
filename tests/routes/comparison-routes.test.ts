import { describe, it, expect } from 'vitest';
import { getComparisonStaticPaths } from '../../src/content/route-groups';
import { resolveServerBrand } from '../../src/content/comparison/server-aliases';

describe('Routes Comparatives', () => {
  it('Renvoie exactement 33 slugs pour les comparatifs (sans index, sans doublons)', () => {
    const paths = getComparisonStaticPaths();
    
    // Le manifeste a 34 routes en tout pour /comparatif/, dont 1 index et 33 pages enfants.
    expect(paths.length).toBe(33);
    
    // Assurer qu'il n'y a pas l'index exact '/' ou '/comparatif/'
    expect(paths).not.toContain('/comparatif/');
    expect(paths).not.toContain('/');
    
    // Assurer l'absence de doublons
    const uniquePaths = new Set(paths);
    expect(uniquePaths.size).toBe(33);
  });

  it('Résout les alias serveur correctement', () => {
    expect(resolveServerBrand('iron-iptv')).toBe('Iron IPTV');
    expect(resolveServerBrand('iptv-iron')).toBe('Iron IPTV');
    expect(resolveServerBrand('atlas-iptv')).toBe('Atlas Pro IPTV');
    expect(resolveServerBrand('inconnu')).toBeUndefined();
  });
});
