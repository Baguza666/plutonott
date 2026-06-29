import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SiteShell } from "@/components/layout/SiteShell";

vi.mock("next/link", () => {
  return {
    default: ({ href, children, ...rest }: any) => {
      return <a href={href} {...rest}>{children}</a>;
    },
  };
});

describe("SiteShell Component", () => {
  afterEach(() => {
    cleanup();
  });

  const renderShell = () =>
    render(
      <SiteShell sourcePath="/test-page/">
        <div>Test Content</div>
      </SiteShell>
    );

  it("rend le lien d'évitement correctement", () => {
    renderShell();
    const skipLink = screen.getByRole("link", { name: /Aller au contenu principal/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#contenu-principal");
  });

  it("rend le conteneur principal avec l'id attendu", () => {
    renderShell();
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "contenu-principal");
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("contient tous les liens de navigation principale avec slash final", () => {
    renderShell();
    const navLinks = [
      { name: "Accueil", href: "/" },
      { name: "Tarifs grossiste", href: "/tarifs-grossiste/" },
      { name: "Fonctionnement du panel", href: "/fonctionnement-panel/" },
      { name: "Comparatifs", href: "/comparatif/" },
      { name: "Guides d’installation", href: "/iptv-france/installation/" },
      { name: "Support revendeur", href: "/iptv-france/support/" },
    ];

    navLinks.forEach(({ name, href }) => {
      // getAllByRole car il peut y avoir version desktop/mobile
      const links = screen.getAllByRole("link", { name: new RegExp(name, "i") });
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveAttribute("href", href);
    });
  });

  it("contient tous les liens du footer avec slash final", () => {
    renderShell();
    const footerLinks = [
      { name: "À propos", href: "/qui-sommes-nous/" },
      { name: "Devenir revendeur", href: "/devenir-revendeur-iptv/" },
      { name: "Programme Master Reseller", href: "/programme-master-reseller/" },
      { name: "Politique de remboursement", href: "/politique-de-remboursement-b2b/" },
      { name: "Conditions générales", href: "/conditions-generales-b2b/" },
      { name: "Contact commercial", href: "/revendeur/contact-commercial/" },
    ];

    footerLinks.forEach(({ name, href }) => {
      const link = screen.getByRole("link", { name: new RegExp(name, "i") });
      expect(link).toHaveAttribute("href", href);
    });
  });

  it("le menu <details> est utilisé sans bibliothèque client externe", () => {
    const { container } = renderShell();
    const details = container.querySelector("details");
    expect(details).toBeInTheDocument();
    const summary = container.querySelector("summary");
    expect(summary).toBeInTheDocument();
  });

  it("le CTA mobile est bien un lien wa.me généré dynamiquement statiquement", () => {
    renderShell();
    const cta = screen.getByRole("link", { name: /Contacter un expert sur WhatsApp/i });
    expect(cta).toHaveAttribute("href");
    expect(cta.getAttribute("href")).toContain("wa.me/212782389820");
    // Vérifie que le sourcePath transmis est encodé dans le lien
    expect(cta.getAttribute("href")).toContain("Source+%3A+%2Ftest-page");
  });

  it("ne rend aucun bouton de checkout ou de panier", () => {
    const { container } = renderShell();
    const html = container.innerHTML.toLowerCase();
    expect(html).not.toContain("checkout");
    expect(html).not.toContain("panier");
    expect(html).not.toContain("cart");
  });
});
