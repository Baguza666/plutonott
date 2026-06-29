import { describe, it, expect } from "vitest";
// import removed
import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("rend un élément <html> avec lang=\"fr\"", () => {
    const element = RootLayout({ children: <p>contenu</p> });
    expect(element.type).toBe("html");
    expect(element.props.lang).toBe("fr");
  });

  it("contient « Pluton OTT » dans le titre par défaut exporté", async () => {
    // Le titre est exporté via la constante metadata, pas rendu dans le DOM
    const layoutModule = await import("@/app/layout");
    const metadata = layoutModule.metadata;
    expect(metadata).toBeDefined();
    const { title } = metadata;
    let titleText = "";
    if (typeof title === "string") {
      titleText = title;
    } else if (title !== null && title !== undefined && typeof title === "object" && "default" in title) {
      titleText = title.default;
    }
    expect(titleText).toContain("Pluton OTT");
  });
});
