import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'La Route des Épices | Quelle Épice avec Quelle Viande?',
  description:
    'La route des épices: trouvez les meilleures épices pour le bœuf, poulet, porc, agneau, poisson et légumes. Accords épices-aliments parfaits.',
  alternates: {
    canonical: '/epices/route-des-epices/',
    languages: {
      'fr-CA': '/epices/route-des-epices/',
      'en-CA': '/en/spices/spice-pairing/',
      'x-default': '/epices/route-des-epices/',
    },
  },
  openGraph: {
    title: 'La Route des Épices | Accords Parfaits',
    description:
      'Sélectionnez une viande ou un aliment et découvrez les meilleures épices à utiliser.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'La Route des Épices',
    description: 'Trouvez les épices parfaites pour chaque viande et aliment.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
