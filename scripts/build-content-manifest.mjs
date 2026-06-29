import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const GENERATED_DIR = path.join(process.cwd(), 'src', 'content', 'generated');
// Path to the new source file
const PAGE_COPY_FILE = path.join(process.cwd(), 'pluton_ott_all_77_page_blocks_agent_spec.md');
// Original keywords file path, keeping it if it's there
const KEYWORDS_FILE = path.join(process.cwd(), 'docs', 'source', 'combined_keywords.txt');

const generateHash = (str) => crypto.createHash('sha256').update(str).digest('hex');

function parseYamlString(yamlStr) {
  const data = {};
  const lines = yamlStr.split('\n');
  let currentArrayKey = null;

  for (const line of lines) {
    if (line.trim() === '' || line.trim() === '---') continue;
    
    if (line.trim().startsWith('- ')) {
      if (currentArrayKey) {
        data[currentArrayKey].push(line.replace(/^\s*-\s*['"]?(.*?)['"]?\s*$/, '$1').trim());
      }
      continue;
    }
    const match = line.match(/^(\s*[a-zA-Z0-9_]+)\s*:\s*(.*)$/);
    if (match) {
      const keyStr = match[1];
      const valStr = match[2].trim();
      const isNested = keyStr.startsWith('  ');
      const key = keyStr.trim();
      
      if (!isNested) {
        if (valStr === '' || valStr === '[]') {
          data[key] = [];
          currentArrayKey = key;
        } else {
          let cleanVal = valStr.replace(/^['"](.*)['"]$/, '$1');
          if (cleanVal === 'true') cleanVal = true;
          if (cleanVal === 'false') cleanVal = false;
          if (!isNaN(Number(cleanVal)) && cleanVal !== '') cleanVal = Number(cleanVal);
          
          data[key] = cleanVal;
          currentArrayKey = null;
        }
      } else {
        if (currentArrayKey === 'seo') {
          if (Array.isArray(data['seo'])) {
            data['seo'] = {};
          }
          let cleanVal = valStr.replace(/^['"](.*)['"]$/, '$1');
          data['seo'][key] = cleanVal;
        }
      }
    }
  }
  return data;
}

function parseBlock(blockStr) {
  const yamlMatch = blockStr.match(/```yaml([\s\S]*?)```/);
  if (!yamlMatch) return null;
  const yamlData = parseYamlString(yamlMatch[1]);
  
  const contentMatch = blockStr.match(/### Exact page content\s+([\s\S]*?)$/);
  if (!contentMatch) return null;
  
  const contentText = contentMatch[1].trim();
  
  const sections = [];
  let currentSection = { headingLevel: null, heading: null, paragraphs: [], bullets: [] };
  sections.push(currentSection);

  const ctaLabels = [];
  const schemaDirectives = [];
  
  if (yamlData.cta_label) {
    ctaLabels.push(yamlData.cta_label);
  }

  const lines = contentText.split('\n');
  for (let line of lines) {
    let trimmed = line.trim();
    if (!trimmed) continue;
    
    const schemaMatch = trimmed.match(/\\?\[Schema:.*?(?:\\?\]|\])/gi);
    if (schemaMatch) {
      schemaDirectives.push(...schemaMatch);
      trimmed = trimmed.replace(/\\?\[Schema:.*?(?:\\?\]|\])/gi, '').trim();
    }
    
    trimmed = trimmed.replace(/\\?\[cite:\s*\d+\\?\]/g, '').trim();
    if (!trimmed) continue;
    
    const cleanTextForPrefix = trimmed.replace(/\*\*/g, '').trim();
    
    const headingMatch = trimmed.match(/^(#{2,4})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      let headingText = headingMatch[2].replace(/\*\*/g, '').trim();
      
      if (headingText.toUpperCase().startsWith('CTA:')) {
        let label = headingText.replace(/^CTA:\s*/i, '').trim();
        if (!ctaLabels.includes(label)) ctaLabels.push(label);
      } else {
        currentSection = { headingLevel: level, heading: headingText, paragraphs: [], bullets: [] };
        sections.push(currentSection);
      }
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const bulletText = trimmed.replace(/^[*|-]\s+/, '').replace(/\*\*/g, '').trim();
      currentSection.bullets.push(bulletText);
    } else if (cleanTextForPrefix.toUpperCase().startsWith('CTA:')) {
      let label = cleanTextForPrefix.replace(/^CTA:\s*/i, '').trim();
      if (!ctaLabels.includes(label)) ctaLabels.push(label);
    } else {
      currentSection.paragraphs.push(trimmed);
    }
  }

  const cleanSections = sections.filter(s => s.heading || s.paragraphs.length > 0 || s.bullets.length > 0);

  const h1 = yamlData.seo && yamlData.seo.h1 ? yamlData.seo.h1 : yamlData.h1 || "";
  const h2 = yamlData.seo && yamlData.seo.h2_summary ? yamlData.seo.h2_summary : null;
  const trustItems = yamlData.trust_strip || [];
  
  let intentStr = "";
  if (Array.isArray(yamlData.intent)) {
    intentStr = yamlData.intent.join(', ');
  } else {
    intentStr = yamlData.intent || "";
  }

  return {
    path: yamlData.route,
    intent: intentStr,
    h1: h1,
    h2: h2,
    trustItems: trustItems,
    sections: cleanSections,
    ctaLabels: ctaLabels,
    schemaDirectives: schemaDirectives,
    sourceIndex: yamlData.source_index,
    routeOccurrence: yamlData.route_occurrence || 1
  };
}

function parsePages() {
  const content = fs.readFileSync(PAGE_COPY_FILE, 'utf-8');
  const blockRegex = /<!-- PAGE_BLOCK_START: (page-block-\d+) -->([\s\S]*?)<!-- PAGE_BLOCK_END: \1 -->/g;
  
  let match;
  const allBlocks = [];
  while ((match = blockRegex.exec(content)) !== null) {
    const blockData = parseBlock(match[2]);
    if (blockData) {
      allBlocks.push(blockData);
    }
  }
  return allBlocks;
}

function processKeywords() {
  if (!fs.existsSync(KEYWORDS_FILE)) {
    return { rawCount: 0, uniqueCount: 0, unique: [] };
  }
  const content = fs.readFileSync(KEYWORDS_FILE, 'utf-8');
  const rawLines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const uniqueKeywords = Array.from(new Set(rawLines));
  return {
    rawCount: rawLines.length,
    uniqueCount: uniqueKeywords.length,
    unique: uniqueKeywords
  };
}

function runPipeline() {
  const blocks = parsePages();
  const keywordsData = processKeywords();
  const totalBlocksParsed = blocks.length;
  
  const pathMap = new Map();
  const variants = [];
  
  for (const block of blocks) {
    if (pathMap.has(block.path)) {
      const existing = pathMap.get(block.path);
      // Keep the one with the higher routeOccurrence (which has better SEO)
      if (block.routeOccurrence > existing.routeOccurrence) {
        variants.push(existing);
        pathMap.set(block.path, block);
      } else {
        variants.push(block);
      }
    } else {
      pathMap.set(block.path, block);
    }
  }
  
  const canonicalPages = Array.from(pathMap.values());
  canonicalPages.sort((a, b) => a.sourceIndex - b.sourceIndex);
  variants.sort((a, b) => a.sourceIndex - b.sourceIndex);

  const pagesHashStr = fs.readFileSync(PAGE_COPY_FILE, 'utf-8');
  const keysHashStr = fs.existsSync(KEYWORDS_FILE) ? fs.readFileSync(KEYWORDS_FILE, 'utf-8') : '';
  const sourcesHash = generateHash(pagesHashStr + keysHashStr);

  const audit = {
    generatedAt: new Date().toISOString(),
    sourcesHash,
    counts: {
      totalBlocksParsed,
      uniqueCanonicalRoutes: canonicalPages.length,
      variantsKept: variants.length
    }
  };

  if (!fs.existsSync(GENERATED_DIR)) fs.mkdirSync(GENERATED_DIR, { recursive: true });

  fs.writeFileSync(path.join(GENERATED_DIR, 'pages.fr.json'), JSON.stringify(canonicalPages, null, 2));
  fs.writeFileSync(path.join(GENERATED_DIR, 'page-variants.fr.json'), JSON.stringify(variants, null, 2));
  fs.writeFileSync(path.join(GENERATED_DIR, 'keywords.fr.json'), JSON.stringify(keywordsData, null, 2));
  fs.writeFileSync(path.join(GENERATED_DIR, 'content-audit.json'), JSON.stringify(audit, null, 2));

  console.log(`Content pipeline finished. Canonical: ${canonicalPages.length}, Variants: ${variants.length}`);
}

runPipeline();
