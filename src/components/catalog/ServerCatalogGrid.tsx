import React from 'react';
import { ServerCatalogItem } from '../../content/catalog/server-catalog.types';
import ServerCard from './ServerCard';

interface ServerCatalogGridProps {
  readonly items: readonly ServerCatalogItem[];
}

export default function ServerCatalogGrid({ items }: ServerCatalogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <ServerCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
