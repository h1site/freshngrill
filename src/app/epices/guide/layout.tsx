import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quelle Épice avec Quelle Viande? | Guide des Accords',
  description:
    'Guide interactif: trouvez les meilleures épices pour le bœuf, poulet, porc, agneau, poisson et légumes. Accords épices-aliments parfaits.',
  alternates: {
    canonical: '/epices/guide/',
    languages: {
      'fr-CA': '/epices/guide/',
      'en-CA': '/en/spices/guide/',
    },
  },
  openGraph: {
    title: 'Quelle Épice avec Quelle Viande? | Guide Interactif',
    description:
      'Sélectionnez une viande ou un aliment et découvrez les meilleures épices à utiliser. Guide pratique pour cuisiner.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Guide des Accords Épices-Viandes',
    description: 'Trouvez les épices parfaites pour chaque viande et aliment.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
