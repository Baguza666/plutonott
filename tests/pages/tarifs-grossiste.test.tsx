import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ServerCard from '../../src/components/catalog/ServerCard';
import ServerCatalogGrid from '../../src/components/catalog/ServerCatalogGrid';
import TarifsPage from '../../src/app/tarifs-grossiste/page';
import { ServerCatalogItem } from '../../src/content/catalog/server-catalog.types';

describe('Composants Tarifs Grossiste', () => {
  afterEach(() => {
    cleanup();
  });

  const mockItem: ServerCatalogItem = {
    slug: 'test-server',
    serverBrand: 'Test Server',
    shortDescriptionFr: 'Description de test',
    targetAudienceFr: 'Public de test',
    marketingFeaturesFr: ['Carac 1', 'Carac 2'],
    whatsappContextFr: 'crédits Test Server',
    imagePath: null,
    imageAltFr: null,
    displayOrder: 10,
    isActive: true,
    legalStatus: 'pending'
  };

  it('Affiche une carte serveur sans prix ni checkout', () => {
    render(<ServerCard item={mockItem} />);
    
    // Titre h2
    expect(screen.getByRole('heading', { level: 2, name: 'Test Server' })).toBeDefined();
    
    // Description présente
    expect(screen.getByText('Description de test')).toBeDefined();
    
    // Pas de prix ou termes ecommerce
    const html = document.body.innerHTML.toLowerCase();
    expect(html).not.toContain('€');
    expect(html).not.toContain('prix');
    expect(html).not.toContain('panier');
    expect(html).not.toContain('checkout');
    
    // Fallback texte tarif
    expect(screen.getByText('Tarif communiqué sur WhatsApp')).toBeDefined();
    
    // Le CTA est présent
    const link = screen.getByRole('link', { name: /Test Server/i });
    expect(link.getAttribute('href')).toContain('wa.me');
  });

  it('La page rend le bon H1', () => {
    render(<TarifsPage />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toBe('Packs de Crédits IPTV : Maximisez Vos Marges de Revendeur');
  });

  it('La page rend les 5 cartes initiales issues du catalogue', () => {
    render(<TarifsPage />);
    const cards = screen.getAllByRole('article');
    expect(cards.length).toBeGreaterThanOrEqual(5); // Au moins les 5 initiaux
  });
});
