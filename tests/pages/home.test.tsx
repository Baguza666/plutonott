import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import HomePage from '../../src/app/page';
import HomeTrustStrip from '../../src/components/home/HomeTrustStrip';

describe('Composants de la Page d\'Accueil', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
  });

  it('Affiche le H1 et le sous-titre exacts', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('TV en direct sur Smart TV, Fire TV et mobile');
    expect(screen.getAllByText('Vérifiez les chaînes disponibles dans votre pays').length).toBeGreaterThan(0);
  });

  it('Affiche un CTA vers WhatsApp dans le Hero', () => {
    render(<HomePage />);
    const ctas = screen.getAllByRole('link');
    // Le premier CTA doit être le Hero CTA (wa.me)
    expect(ctas[0].getAttribute('href')).toContain('wa.me');
  });

  it('N\'affiche pas les lignes de test 24 h par défaut', () => {
    render(<HomeTrustStrip trustItems={['Panel 100% en français', 'Support WhatsApp dédié']} test24hApproved={false} />);
    const html = document.body.innerHTML;
    expect(html).not.toContain('Lignes de test 24 h');
    expect(html).toContain('Panel 100% en français');
    expect(html).toContain('Support WhatsApp dédié');
  });

  it('Affiche les lignes de test 24 h si le flag est activé', () => {
    render(<HomeTrustStrip trustItems={[]} test24hApproved={true} />);
    const html = document.body.innerHTML;
    expect(html).toContain('Lignes de test 24 h');
  });

  it('Affiche au maximum 5 cartes serveur dans l\'aperçu', () => {
    render(<HomePage />);
    // Les articles correspondent aux cartes de serveurs de ServerPreview
    const cards = screen.getAllByRole('article');
    expect(cards.length).toBeLessThanOrEqual(5);
  });

  it('Ne contient aucun formulaire ni élément ecommerce ou affirmations non vérifiées', () => {
    render(<HomePage />);
    const html = document.body.innerHTML.toLowerCase();
    
    // Contraintes techniques
    expect(html).not.toContain('<form');
    expect(html).not.toContain('<input');
    expect(html).not.toContain('€');
    expect(html).not.toContain('prix');
  });
});
