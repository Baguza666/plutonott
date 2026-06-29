import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { PageContent } from '../../content/page.types';
import { PublicationStatus } from '../../content/policy/content-policy.types';
import ComparisonIndex from '../../components/comparison/ComparisonIndex';
import { Metadata } from 'next';
import { generatePageMetadata } from '../../lib/seo/generate-page-metadata';

export const dynamic = 'force-static';
export const dynamicParams = false;

// Helper pour lire toutes les pages
function getAllPages(): PageContent[] {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'generated', 'pages.fr.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch {
    return [];
  }
}

// Helper pour lire tous les statuts
function getAllStatuses(): PublicationStatus[] {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'generated', 'publication-status.fr.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch {
    return [];
  }
}

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Comparatifs d\'infrastructures IPTV et offres B2B',
    description: 'Sélectionnez une marque pour voir les différences d\'infrastructure, de stabilité et d\'offres B2B pour les revendeurs.',
    path: '/comparatif/',
    status: 'approved',
  });
}

export default function ComparatifIndexRoute() {
  const allPages = getAllPages();
  const allStatuses = getAllStatuses();
  
  const indexPageStatus = allStatuses.find(s => s.path === '/comparatif/');
  if (indexPageStatus && indexPageStatus.status === 'blocked') {
    notFound();
  }
  
  const comparativePages = allPages.filter(p => p.path.startsWith('/comparatif/') && p.path !== '/comparatif/');

  return (
    <ComparisonIndex pages={comparativePages} statuses={allStatuses} />
  );
}
