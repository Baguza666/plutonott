import Link from 'next/link';
import { ServerCatalogItem } from '../../content/catalog/server-catalog.types';
import ServerCatalogGrid from '../catalog/ServerCatalogGrid';

interface ServerPreviewProps {
  readonly servers: readonly ServerCatalogItem[];
}

export default function ServerPreview({ servers }: ServerPreviewProps) {
  const previewServers = servers.slice(0, 5);

  return (
    <section className="scrolly-section py-20 px-4 bg-paper">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-on-paper mb-4">
            Infrastructures Serveurs
          </h2>
          <p className="text-lg text-dim-paper max-w-2xl mx-auto">
            Découvrez nos principales offres B2B et discutez avec nous pour définir les volumes adaptés à votre portefeuille client.
          </p>
        </header>

        <ServerCatalogGrid items={previewServers} />

        <div className="mt-12 text-center">
          <Link
            href="/tarifs-grossiste/"
            className="inline-flex items-center justify-center px-6 py-3 border border-paper-2 text-base font-medium rounded-lg text-dim-paper bg-paper-2 hover:text-signal hover:border-signal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            Voir tous les tarifs
          </Link>
        </div>
      </div>
    </section>
  );
}
