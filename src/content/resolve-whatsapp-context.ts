import { PageContent } from './page.types';
import { WhatsAppIntent } from '@/lib/whatsapp/whatsapp.types';

export function resolveWhatsAppContext(page: PageContent): {
  intent: WhatsAppIntent;
  pageContext: string;
  serverBrand?: string;
} {
  const rawIntent = (page.intent || '').toLowerCase();
  
  let intent: WhatsAppIntent = 'information';
  
  if (rawIntent.includes('support')) {
    intent = 'support';
  } else if (rawIntent.includes('test-gratuit') || rawIntent.includes('essai')) {
    intent = 'essai';
  } else if (rawIntent.includes('politique') || rawIntent.includes('conditions') || rawIntent.includes('juridique')) {
    intent = 'juridique';
  } else if (rawIntent.includes('commercial') || rawIntent.includes('transactional')) {
    intent = 'commercial';
  }
  
  // Extract serverBrand if this is a server card page?
  // Right now, this is static non-comparative route. Server brand is usually for catalog.
  // But maybe the page intent or title has it? 
  // For now, no serverBrand unless explicitly given.
  
  return {
    intent,
    pageContext: page.h1 || 'Page générique'
  };
}
