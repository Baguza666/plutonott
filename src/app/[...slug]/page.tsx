import { notFound } from 'next/navigation';
import { getNonComparisonStaticPaths } from '../../content/route-groups';
import { getPageByPath } from '../../content/get-page-content';
import { getPublicationStatus } from '../../content/get-publication-status';
import { resolveWhatsAppContext } from '../../content/resolve-whatsapp-context';
import PageContentRenderer from '../../components/content/PageContentRenderer';
import { Metadata } from 'next';
import { generatePageMetadata } from '../../lib/seo/generate-page-metadata';

export const dynamic = 'force-static';
export const dynamicParams = false;

type PageProps = {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams() {
  const paths = getNonComparisonStaticPaths();
  
  return paths.map(p => {
    // Transformer "/a/b/" en ["a", "b"]
    const slug = p.split('/').filter(Boolean);
    return { slug };
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) return {};

  const path = '/' + slug.join('/') + '/';
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

export default async function CatchAllStaticPage({ params }: PageProps) {
  const { slug } = await params;

  // Si aucun slug, c'est la racine "/". On ne gère pas la racine ici.
  if (!slug || slug.length === 0) {
    notFound();
  }

  // Reconstruire le chemin avec le trailing slash pour matcher le JSON
  const path = '/' + slug.join('/') + '/';

  // Sécurité : on rejette explicitement certains paths même s'ils arrivaient là
  if (path === '/' || path === '/tarifs-grossiste/' || path.startsWith('/comparatif/')) {
    notFound();
  }

  const page = getPageByPath(path);
  const status = getPublicationStatus(path);

  if (!page || !status) {
    notFound();
  }

  const whatsappContext = resolveWhatsAppContext(page);

  return (
    <PageContentRenderer 
      page={page} 
      publicationStatus={status} 
      whatsapp={{
        intent: whatsappContext.intent,
        pageContext: whatsappContext.pageContext,
        ...(whatsappContext.serverBrand ? { serverBrand: whatsappContext.serverBrand } : {})
      }} 
    />
  );
}
