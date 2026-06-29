import { PublicationIssue, PublicationStatus, PolicyIssueCode } from './content-policy.types';
import type { PageContent } from '../page.types';

const RULES: Array<{ code: PolicyIssueCode; regex: RegExp; severity: 'warning' | 'error' }> = [
  { code: 'UNVERIFIED_UPTIME', regex: /100%\s*uptime/i, severity: 'error' },
  { code: 'UNVERIFIED_MARGIN', regex: /marges\s*de\s*30%\s*à\s*60%/i, severity: 'warning' },
  { code: 'UNVERIFIED_PRICE', regex: /crédits\s*sans\s*(date\s*d')?expiration/i, severity: 'warning' },
  { code: 'UNVERIFIED_TRIAL', regex: /essais?\s*gratuits?\s*garantis?/i, severity: 'warning' },
  { code: 'UNVERIFIED_INSTANT_ACTIVATION', regex: /activation\s*instantanée/i, severity: 'warning' },
  { code: 'UNIVERSAL_COMPATIBILITY', regex: /compatibilité\s*universelle/i, severity: 'error' },
  { code: 'ALL_CHANNELS_CLAIM', regex: /toutes\s*les\s*cha[iî]nes/i, severity: 'error' },
  { code: 'ALL_MATCHES_CLAIM', regex: /tous\s*les\s*matchs/i, severity: 'error' },
  { code: 'ISP_BYPASS_INSTRUCTION', regex: /contournement\s*fai/i, severity: 'error' },
  { code: 'SIDELOADING_INSTRUCTION', regex: /sideloading/i, severity: 'error' },
  { code: 'CREDENTIAL_DELIVERY_AUTOMATION', regex: /automatisation\s*(de\s*)?création\s*(de\s*)?lignes?/i, severity: 'warning' },
  { code: 'UNVERIFIED_REVIEW', regex: /"\s*\\?-\s*\*.+?\*/i, severity: 'warning' },
  { code: 'ENGLISH_VISIBLE_COPY', regex: /\b(streaming|buffering|freeze|anti-freeze|uptime|reseller|dashboard|setup)\b/i, severity: 'warning' },
  { code: 'COMPETITOR_FACT_UNVERIFIED', regex: /\b(pire\s*que|moins\s*stable|arnaque|meilleur\s*que|sans\s*coupure\s*contrairement)\b/i, severity: 'warning' }
];

function extractVisibleText(page: PageContent): string[] {
  const texts: string[] = [];
  if (page.h1) texts.push(page.h1);
  if (page.h2) texts.push(page.h2);
  texts.push(...page.trustItems);
  
  for (const section of page.sections) {
    if (section.heading) texts.push(section.heading);
    texts.push(...section.paragraphs);
    texts.push(...section.bullets);
  }
  
  texts.push(...page.ctaLabels);
  return texts;
}

export function auditPage(page: PageContent): PublicationStatus {
  const issues: PublicationIssue[] = [];
  const texts = extractVisibleText(page);

  // Apply regex rules
  for (const text of texts) {
    for (const rule of RULES) {
      const match = text.match(rule.regex);
      if (match) {
        // Prevent duplicate issues for the same code on the same page
        if (!issues.some(i => i.code === rule.code)) {
          issues.push({
            code: rule.code,
            severity: rule.severity,
            excerpt: text.substring(0, 150) // Store context
          });
        }
      }
    }
  }

  // Path-based rules
  if (page.path.startsWith('/comparatif/')) {
    if (!issues.some(i => i.code === 'THIRD_PARTY_TRADEMARK_REVIEW')) {
      issues.push({
        code: 'THIRD_PARTY_TRADEMARK_REVIEW',
        severity: 'warning',
        excerpt: `Route ${page.path} contient potentiellement des marques tierces`
      });
    }
  }

  if (page.path === '/iptv-france/securite-anti-blocage/') {
    issues.push({
      code: 'ISP_BYPASS_INSTRUCTION',
      severity: 'error',
      excerpt: `Route explicitement bloquée par la policy`
    });
  }

  if (['/integration-api-revendeur/', '/iptv-france/api-developpement/', '/revendeur/api-xtream-codes/'].includes(page.path)) {
    issues.push({
      code: 'CREDENTIAL_DELIVERY_AUTOMATION',
      severity: 'warning',
      excerpt: `Page API nécessitant une vérification des claims de création d'identifiants`
    });
  }

  // Legal pages
  if (['/mentions-legales/', '/cgu/', '/confidentialite/', '/remboursement/'].includes(page.path)) {
    issues.push({
      code: 'LEGAL_COPY_UNAPPROVED',
      severity: 'warning',
      excerpt: `Page juridique en attente de validation`
    });
  }

  // Determine status
  let status: 'approved' | 'review_required' | 'blocked' = 'approved';
  let noindex = false;

  if (issues.length > 0) {
    status = 'review_required';
    noindex = true; // Any issue means it shouldn't be indexed yet
    
    if (issues.some(i => i.severity === 'error')) {
      status = 'blocked';
    }
  }

  return {
    path: page.path,
    status,
    noindex,
    issues
  };
}

export function hasErrorRule(text: string): boolean {
  return RULES.filter(r => r.severity === 'error').some(rule => rule.regex.test(text));
}

export function isUnverifiedReview(text: string, issues: readonly PublicationIssue[]): boolean {
  if (!issues.some(i => i.code === 'UNVERIFIED_REVIEW')) return false;
  const rule = RULES.find(r => r.code === 'UNVERIFIED_REVIEW');
  return rule ? rule.regex.test(text) : false;
}

