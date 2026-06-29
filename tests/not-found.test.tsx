import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";

describe("NotFound (404)", () => {
  it("affiche un message en français", () => {
    render(<NotFound />);
    // Doit contenir du texte en français, pas de texte anglais
    expect(screen.getByText(/page introuvable/i)).toBeInTheDocument();
  });

  it("ne contient aucun texte de bouton en anglais", () => {
    const { container } = render(<NotFound />);
    const allText = container.textContent ?? "";
    // Vérifie l'absence de termes anglais courants dans les boutons/liens
    const englishTerms = [
      "go back",
      "go home",
      "not found",
      "return",
      "click here",
      "back to home",
    ];
    for (const term of englishTerms) {
      expect(allText.toLowerCase()).not.toContain(term);
    }
  });
});
