import { Metadata } from 'next';
import {
  AmazonSearchAffiliateLink,
  AmazonSearchAffiliateButton,
} from '@/components/affiliate/AmazonSearchAffiliateLink';

export const metadata: Metadata = {
  title: 'Démo Liens Affiliés Amazon | Menucochon',
  description: 'Page de démonstration des liens affiliés Amazon avec tracking',
  robots: 'noindex, nofollow', // Page démo, ne pas indexer
};

// Exemples de liens affiliés pour la démo
const DEMO_LINKS = [
  {
    query: 'Meilleurs casques bluetooth',
    title: 'Casques Bluetooth',
    description: 'Découvrez les meilleurs casques sans fil pour une qualité audio exceptionnelle.',
    category: 'Électronique',
  },
  {
    query: 'Imprimante 3D filament PLA',
    title: 'Imprimantes 3D',
    description: 'Explorez les imprimantes 3D avec filament PLA pour vos projets créatifs.',
    category: 'Fournitures',
    extraParams: { i: 'industrial' },
  },
  {
    query: 'Batterie externe 20000mAh',
    title: 'Batteries Externes',
    description: 'Gardez vos appareils chargés avec ces batteries haute capacité.',
    category: 'Électronique',
  },
  {
    query: 'Souris ergonomique',
    title: 'Souris Ergonomiques',
    description: 'Travaillez confortablement avec une souris conçue pour réduire la fatigue.',
    category: 'Informatique',
    extraParams: { i: 'computers' },
  },
  {
    query: 'Air fryer',
    title: 'Friteuses à Air',
    description: 'Cuisinez sainement avec une friteuse à air chaud sans huile.',
    category: 'Cuisine',
    extraParams: { i: 'kitchen' },
  },
];

export default function AmazonAffiliateDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Démo Liens Affiliés Amazon
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Page de démonstration du composant{' '}
            <code className="bg-gray-200 px-2 py-1 rounded text-sm">
              AmazonSearchAffiliateLink
            </code>
            . Chaque lien pointe directement vers Amazon avec votre tag affilié.
          </p>
        </header>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-blue-800 mb-2">ℹ️ Fonctionnalités</h2>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>✓ Liens <code>&lt;a&gt;</code> directs (pas de redirection JS)</li>
            <li>✓ <code>target="_blank"</code> pour ouvrir dans un nouvel onglet</li>
            <li>✓ <code>rel="nofollow noopener sponsored"</code> (bonnes pratiques SEO)</li>
            <li>✓ Tracking non-bloquant via <code>sendBeacon</code></li>
            <li>✓ Tag affilié automatique depuis <code>NEXT_PUBLIC_AMAZON_ASSOC_TAG</code></li>
          </ul>
        </div>

        {/* Grille de produits */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DEMO_LINKS.map((item, index) => (
            <article
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Badge catégorie */}
                <span className="inline-block bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded mb-3">
                  {item.category}
                </span>

                {/* Titre */}
                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                {/* Lien texte */}
                <div className="space-y-3">
                  <AmazonSearchAffiliateLink
                    query={item.query}
                    extraParams={item.extraParams}
                    className="text-orange-600 hover:text-orange-700 underline text-sm font-medium"
                    title={`Rechercher "${item.query}" sur Amazon`}
                  >
                    Voir sur Amazon →
                  </AmazonSearchAffiliateLink>

                  {/* Bouton stylisé */}
                  <AmazonSearchAffiliateButton
                    query={item.query}
                    extraParams={item.extraParams}
                    className="w-full justify-center text-sm"
                  >
                    Comparer les prix
                  </AmazonSearchAffiliateButton>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Section Code Example */}
        <section className="mt-12 bg-gray-900 rounded-xl p-6 text-white">
          <h2 className="font-bold text-xl mb-4">💻 Exemple de code</h2>
          <pre className="overflow-x-auto text-sm">
            <code>{`import { AmazonSearchAffiliateLink } from '@/components/affiliate/AmazonSearchAffiliateLink';

// Lien texte simple
<AmazonSearchAffiliateLink query="casque bluetooth">
  Voir sur Amazon
</AmazonSearchAffiliateLink>

// Avec paramètres supplémentaires
<AmazonSearchAffiliateLink
  query="imprimante 3D"
  extraParams={{ i: 'industrial' }}
  className="text-blue-600 underline"
  onTracked={(data) => console.log('Clic:', data)}
>
  Comparer les prix
</AmazonSearchAffiliateLink>

// Bouton stylisé (variante)
import { AmazonSearchAffiliateButton } from '@/components/affiliate/AmazonSearchAffiliateLink';

<AmazonSearchAffiliateButton query="air fryer">
  Acheter sur Amazon
</AmazonSearchAffiliateButton>`}</code>
          </pre>
        </section>

        {/* Section Configuration */}
        <section className="mt-8 bg-gray-100 rounded-xl p-6">
          <h2 className="font-bold text-xl mb-4 text-gray-900">⚙️ Configuration</h2>
          <p className="text-gray-700 mb-4">
            Ajoutez ces variables dans votre fichier <code>.env.local</code> :
          </p>
          <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm border">
            <code>{`# Tag affilié Amazon
NEXT_PUBLIC_AMAZON_ASSOC_TAG=votre-tag-20

# Domaine Amazon (optionnel, défaut: www.amazon.ca)
NEXT_PUBLIC_AMAZON_DOMAIN=www.amazon.ca

# Activer le log fichier des clics (optionnel)
AFFILIATE_FILE_LOG=true`}</code>
          </pre>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Page de démonstration •{' '}
            <a href="/" className="text-orange-600 hover:underline">
              Retour à l'accueil
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
