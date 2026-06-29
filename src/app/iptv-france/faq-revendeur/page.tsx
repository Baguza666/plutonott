import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '../../../components/seo/JsonLd';
import { generateFaqSchema, generateBreadcrumbSchema } from '../../../lib/seo/json-ld';
import { generatePageMetadata } from '../../../lib/seo/generate-page-metadata';

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'FAQ Revendeur IPTV | Installation, Serveurs & Questions Fréquentes',
    description: "Réponses aux questions fréquentes de vos clients : comment installer IPTV sur TV Samsung, box Free ou Bouygues, gestion des codes et abonnements.",
    path: '/iptv-france/faq-revendeur/',
    status: 'approved',
  });
}

const FAQ_ITEMS = [
  {
    question: "Comment installer IPTV ?",
    answer: "En tant que revendeur, vous devez accompagner vos clients dans l'installation. La procédure standard consiste à leur faire télécharger une application compatible (comme IBO Player, Smarters, etc.) sur leur appareil, puis à leur fournir leurs identifiants (lien m3u ou codes Xtream) générés directement depuis votre panel grossiste Pluton OTT. L'installation prend généralement moins de 3 minutes."
  },
  {
    question: "Comment avoir les codes IPTV gratuit forum ?",
    answer: "Rechercher des codes gratuits sur des forums est une pratique très risquée (coupures constantes, bannissement des IP, fuites de données) et n'est pas viable pour une activité sérieuse. Pour bâtir une activité rentable et professionnelle, la seule solution est de s'associer avec un fournisseur premium. Chez Pluton OTT, nous offrons à nos partenaires revendeurs des codes de test 24h gratuits et 100% stables pour convaincre vos propres clients sans aucun risque."
  },
  {
    question: "Comment changer le code IPTV ?",
    answer: "Si un de vos clients souhaite changer son code (pour des raisons de sécurité ou de renouvellement), vous avez la main totale depuis votre panel d'administration revendeur Pluton OTT. Il vous suffit de sélectionner la ligne du client, de modifier ou réinitialiser le mot de passe, et de lui envoyer les nouveaux identifiants générés en un clic."
  },
  {
    question: "Comment télécharger IPTV Smarters Pro sur TV Samsung ?",
    answer: "Pour les clients équipés de Smart TV Samsung, l'application peut parfois être trouvée directement dans le Smart Hub (selon la région). Si elle n'est pas disponible, orientez-les vers d'excellentes alternatives natives comme IBO Player, ou conseillez l'ajout d'une clé Amazon Firestick ou d'une box Android. Nos serveurs B2B sont nativement compatibles avec toutes ces solutions."
  },
  {
    question: "Comment avoir IPTV avec Free ?",
    answer: "Les box opérateurs comme celles de Free (Freebox) imposent souvent des restrictions sur l'installation d'applications tierces non officielles. La solution la plus professionnelle à conseiller à vos clients est d'utiliser un appareil externe (comme une Apple TV, si fournie par Free, ou une box Android TV indépendante) connecté sur leur réseau Freebox. Cela garantit la meilleure fluidité pour vos flux HD et 4K."
  },
  {
    question: "Comment installer IPTV sur box Bouygues ?",
    answer: "Les box récentes de Bouygues Telecom (Bbox Must et Ultym) tournent sous Android TV, ce qui facilite énormément la tâche ! Vos clients n'ont qu'à se rendre sur le Google Play Store intégré à la Bbox, installer l'application de leur choix (par exemple une application compatible Xtream) et y entrer les accès que vous leur aurez créés depuis votre panel Pluton OTT."
  }
];

export default function FaqRevendeurPage() {
  const faqSchema = generateFaqSchema(FAQ_ITEMS);
  const breadcrumbSchema = generateBreadcrumbSchema('/iptv-france/faq-revendeur');

  return (
    <main className="flex-1 w-full flex flex-col items-center">
      <JsonLd data={[faqSchema, breadcrumbSchema]} />
      
      {/* Hero Section */}
      <section className="w-full bg-ink pt-20 pb-16 px-4 border-b border-ink-3">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-signal text-sm font-bold uppercase tracking-widest">Support Revendeur B2B</p>
          <h1 className="text-4xl md:text-5xl font-black text-on-ink tracking-tight">
            Foire Aux Questions <span className="text-signal">IPTV</span>
          </h1>
          <p className="text-lg text-dim-ink max-w-2xl mx-auto leading-relaxed">
            Les réponses aux questions les plus fréquentes posées par les clients finaux, pour vous aider à mieux les accompagner.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-paper py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <details 
              key={index} 
              className="group border border-paper-2 bg-paper-2 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg text-on-paper select-none">
                <span className="pr-4">{item.question}</span>
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-signal/10 text-signal group-open:rotate-180 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-dim-paper leading-relaxed text-sm md:text-base border-t border-paper/10 pt-4">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto mt-16 p-8 bg-ink rounded-3xl text-center shadow-xl border border-ink-3">
          <h3 className="text-2xl font-bold text-on-ink mb-4">Gérez facilement tous vos clients</h3>
          <p className="text-dim-ink mb-8 max-w-lg mx-auto">
            Devenez partenaire Pluton OTT et bénéficiez d'un panel complet pour générer, modifier et dépanner les accès de vos clients en un seul clic.
          </p>
          <Link 
            href="/devenir-revendeur-iptv/"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold bg-signal text-white rounded-xl hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            Découvrir le panel revendeur
          </Link>
        </div>
      </section>
    </main>
  );
}
