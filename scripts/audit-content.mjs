import fs from 'fs';
import path from 'path';

const GENERATED_DIR = path.join(process.cwd(), 'src', 'content', 'generated');
const PAGES_JSON_PATH = path.join(GENERATED_DIR, 'pages.fr.json');
const OUTPUT_JSON_PATH = path.join(GENERATED_DIR, 'publication-status.fr.json');

const RULES = [
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

function extractVisibleText(page) {
  const texts = [];
  if (page.h1) texts.push(page.h1);
  if (page.h2) texts.push(page.h2);
  if (page.trustItems) texts.push(...page.trustItems);
  
  if (page.sections) {
    for (const section of page.sections) {
      if (section.heading) texts.push(section.heading);
      if (section.paragraphs) texts.push(...section.paragraphs);
      if (section.bullets) texts.push(...section.bullets);
    }
  }
  
  if (page.ctaLabels) texts.push(...page.ctaLabels);
  return texts;
}

function auditPage(page) {
  const issues = [];
  const texts = extractVisibleText(page);

  for (const text of texts) {
    for (const rule of RULES) {
      const match = text.match(rule.regex);
      if (match) {
        if (!issues.some(i => i.code === rule.code)) {
          issues.push({
            code: rule.code,
            severity: rule.severity,
            excerpt: text.substring(0, 150)
          });
        }
      }
    }
  }

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
    const describesCredentials = texts.some(t => 
      t.match(/\b(création|remise)\b.*\b(credentials|identifiants|lignes)\b/i) ||
      t.match(/\b(credentials|identifiants|lignes)\b.*\b(création|remise)\b/i)
    );
    issues.push({
      code: 'CREDENTIAL_DELIVERY_AUTOMATION',
      severity: 'warning',
      excerpt: `Page API nécessitant une vérification des claims de création d'identifiants`
    });
  }

  if (['/mentions-legales/', '/cgu/', '/confidentialite/', '/remboursement/'].includes(page.path)) {
    issues.push({
      code: 'LEGAL_COPY_UNAPPROVED',
      severity: 'warning',
      excerpt: `Page juridique en attente de validation`
    });
  }

  let status = 'approved';
  let noindex = false;

  if (issues.length > 0) {
    status = 'review_required';
    noindex = true;
    
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

function runAudit() {
  if (!fs.existsSync(PAGES_JSON_PATH)) {
    console.error(`Erreur: Le fichier ${PAGES_JSON_PATH} n'existe pas.`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(PAGES_JSON_PATH, 'utf-8');
  const pages = JSON.parse(rawData);

  const statuses = pages.map(page => auditPage(page));

  // "Le script échoue si une page blocked est déclarée indexable."
  for (const status of statuses) {
    if (status.status === 'blocked' && status.noindex === false) {
      console.error(`FATAL ERROR: La page ${status.path} est blocked mais déclarée indexable (noindex=false).`);
      process.exit(1);
    }
  }

  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(statuses, null, 2));
  console.log(`Audit généré pour ${statuses.length} routes.`);
}

runAudit();
