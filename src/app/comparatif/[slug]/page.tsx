import { notFound } from 'next/navigation';
import { getComparisonStaticPaths } from '../../../content/route-groups';
import { getPageByPath } from '../../../content/get-page-content';
import { getPublicationStatus } from '../../../content/get-publication-status';
import { resolveWhatsAppContext } from '../../../content/resolve-whatsapp-context';
import { resolveServerBrand } from '../../../content/comparison/server-aliases';
import ComparisonPage from '../../../components/comparison/ComparisonPage';
import { Metadata } from 'next';
import { generatePageMetadata } from '../../../lib/seo/generate-page-metadata';

export const dynamic = 'force-static';
export const dynamicParams = false;

type PageProps = {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const paths = getComparisonStaticPaths(); // ex: ['/comparatif/iron-iptv/']
  
  return paths.map(p => {
    // Transformer "/comparatif/iron-iptv/" en "iron-iptv"
    const parts = p.split('/').filter(Boolean);
    const slug = parts[1]; 
    return { slug };
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) return {};

  const path = `/comparatif/${slug}/`;
  const page = getPageByPath(path);
  const status = getPublicationStatus(path);

  if (!page || !status) return {};

  return generatePageMetadata({
    title: page.h1,
    description: page.h2 || (page.sections[0]?.paragraphs[0] ?? ""),
    path: page.path,
    status: status.status,
  });
}

export default async function ComparatifPageRoute({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  // Reconstruire le path exact
  const path = `/comparatif/${slug}/`;

  const page = getPageByPath(path);
  const status = getPublicationStatus(path);

  if (!page || !status) {
    notFound();
  }

  const baseWhatsappContext = resolveWhatsAppContext(page);
  
  // Utiliser le serverBrand si l'alias existe, sinon null,
  // Le composant WhatsAppCta utilisera le nom du serveur s'il existe.
  const serverBrand = resolveServerBrand(slug);

  return (
    <ComparisonPage 
      page={page} 
      publicationStatus={status} 
      whatsapp={{
        intent: baseWhatsappContext.intent,
        pageContext: baseWhatsappContext.pageContext,
        ...(serverBrand ? { serverBrand } : {})
      }} 
    />
  );
}
