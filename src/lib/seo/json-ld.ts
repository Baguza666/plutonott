import { getSiteUrl } from './site-url';

// --- Type definitions pour schémas autorisés ---

interface BaseSchema {
  readonly '@context': 'https://schema.org';
  readonly '@type': string;
}

interface WebSiteSchema extends BaseSchema {
  readonly '@type': 'WebSite';
  readonly name: string;
  readonly url: string;
}

interface OrganizationSchema extends BaseSchema {
  readonly '@type': 'Organization';
  readonly name: string;
  readonly url: string;
  readonly contactPoint?: undefined; // Strictement interdit
  readonly address?: undefined; // Strictement interdit
}

interface BreadcrumbSchema extends BaseSchema {
  readonly '@type': 'BreadcrumbList';
  readonly itemListElement: readonly {
    readonly '@type': 'ListItem';
    readonly position: number;
    readonly name: string;
    readonly item: string;
  }[];
}

interface FaqSchema extends BaseSchema {
  readonly '@type': 'FAQPage';
  readonly mainEntity: readonly {
    readonly '@type': 'Question';
    readonly name: string;
    readonly acceptedAnswer: {
      readonly '@type': 'Answer';
      readonly text: string;
    };
  }[];
}

export function generateWebSiteSchema(): WebSiteSchema {
  // on appelle pas getSiteUrl car on veut un appel safe qui fail au runtime mais on le build ici
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pluton OTT',
    url: getSiteUrl(),
  };
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pluton OTT',
    url: getSiteUrl(),
  };
}

export function generateBreadcrumbSchema(path: string): BreadcrumbSchema {
  const siteUrl = getSiteUrl();
  const segments = path.split('/').filter(Boolean);
  
  const itemListElement = [{
    '@type': 'ListItem' as const,
    position: 1,
    name: 'Accueil',
    item: `${siteUrl}/`
  }];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    itemListElement.push({
      '@type': 'ListItem' as const,
      position: index + 2,
      name: segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      item: `${siteUrl}${currentPath}/`
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

export function generateFaqSchema(items: readonly { readonly question: string; readonly answer: string }[]): FaqSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer,
      }
    }))
  };
}
