import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import WhatsAppCta from "@/components/whatsapp/WhatsAppCta";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-whatsapp-url";

describe("WhatsAppCta Component", () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    label: "Contactez-nous",
    intent: "commercial" as const,
    sourcePath: "/offres",
    pageContext: "Test context",
    placement: "hero" as const,
  };

  it("rend un élément <a> et non un <button>", () => {
    const { container } = render(<WhatsAppCta {...defaultProps} />);
    const linkElement = screen.getByRole("link", { name: /Contactez-nous/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName.toLowerCase()).toBe("a");
    
    // S'assure qu'aucun bouton n'est généré
    const buttonElements = container.querySelectorAll("button");
    expect(buttonElements.length).toBe(0);
  });

  it("génère le href exact avec le module central", () => {
    render(<WhatsAppCta {...defaultProps} />);
    const linkElement = screen.getByRole("link");
    const expectedUrl = buildWhatsAppUrl({
      intent: defaultProps.intent,
      sourcePath: defaultProps.sourcePath,
      pageContext: defaultProps.pageContext,
    });
    expect(linkElement).toHaveAttribute("href", expectedUrl);
  });

  it("possède les bons attributs de sécurité et de tracking local", () => {
    render(<WhatsAppCta {...defaultProps} />);
    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("target", "_blank");
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
    expect(linkElement).toHaveAttribute("data-whatsapp-placement", "hero");
    expect(linkElement).toHaveAttribute("data-testid", "whatsapp-cta-hero");
  });

  it("ne possède aucun handler d'événement (onClick) côté DOM", () => {
    // Les tests vitest simulent le DOM. Sur un vrai SSR, on ne devrait pas avoir d'event.
    // L'essentiel est que le composant ne transmette pas onClick.
    render(<WhatsAppCta {...defaultProps} />);
    const linkElement = screen.getByRole("link");
    
    // @ts-ignore - vérifie qu'il n'y a pas d'attribut onClick brut
    expect(linkElement.onclick).toBeNull();
  });

  it("possède les classes requises pour l'accessibilité et la zone tactile", () => {
    render(<WhatsAppCta {...defaultProps} className="custom-class" />);
    const linkElement = screen.getByRole("link");
    
    // Doit avoir une zone tactile minimale de 44x44
    expect(linkElement.className).toMatch(/min-h-\[44px\]/);
    expect(linkElement.className).toMatch(/min-w-\[44px\]/);
    
    // Doit avoir un focus visible clair
    expect(linkElement.className).toMatch(/focus-visible:ring/);

    // Et contenir la classe custom
    expect(linkElement.className).toMatch(/custom-class/);
  });

  it("accepte et utilise ariaLabel correctement s'il est fourni", () => {
    render(<WhatsAppCta {...defaultProps} ariaLabel="Custom aria label" />);
    const linkElement = screen.getByRole("link", { name: "Custom aria label" });
    expect(linkElement).toBeInTheDocument();
  });

  it("lève une erreur si le label est vide", () => {
    const consoleError = console.error;
    console.error = () => {}; // Mute pour ce test
    expect(() => render(<WhatsAppCta {...defaultProps} label="" />)).toThrow("Le label du WhatsAppCta ne peut pas être vide.");
    expect(() => render(<WhatsAppCta {...defaultProps} label="   " />)).toThrow("Le label du WhatsAppCta ne peut pas être vide.");
    console.error = consoleError;
  });
});
