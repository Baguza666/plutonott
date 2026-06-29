export interface ContentSection {
  readonly headingLevel: 2 | 3 | 4 | null;
  readonly heading: string | null;
  readonly paragraphs: readonly string[];
  readonly bullets: readonly string[];
}

export interface PageContent {
  readonly path: string;
  readonly intent: string;
  readonly h1: string;
  readonly h2: string | null;
  readonly trustItems: readonly string[];
  readonly sections: readonly ContentSection[];
  readonly ctaLabels: readonly string[];
  readonly schemaDirectives: readonly string[];
  readonly sourceIndex: number;
}
