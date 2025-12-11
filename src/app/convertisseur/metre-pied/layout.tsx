import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conversion Mètre en Pieds - Outil Gratuit | Menu Cochon',
  description:
    'Convertissez facilement les mètres en pieds et vice-versa. 1 mètre = 3.28084 pieds. Formules, tableaux et outil interactif gratuit.',
  alternates: {
    canonical: '/convertisseur/metre-pied/',
  },
  openGraph: {
    title: 'Conversion Mètre en Pieds',
    description: 'Outil gratuit pour convertir les mètres en pieds',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
