import React from 'react';

interface JsonLdProps {
  // unknown car on passe n'importe quel objet JSON sérialisable
  readonly data: unknown;
}

export default function JsonLd({ data }: JsonLdProps) {
  // Sécuriser l'échappement pour prévenir les attaques XSS
  const safeJsonString = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonString }}
    />
  );
}
