import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Minuterie en Ligne Gratuite | Menucochon',
  description:
    'Minuterie en ligne gratuite pour la cuisine. Chronométrez vos cuissons avec précision. Interface simple, alerte sonore automatique, temps prédéfinis.',
  alternates: {
    canonical: '/convertisseur/minuterie/',
  },
  openGraph: {
    title: 'Minuterie en Ligne',
    description: 'Minuterie gratuite pour chronométrer vos cuissons',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
