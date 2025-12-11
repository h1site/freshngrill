import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conversion Centimètre en Pieds - Outil Gratuit | Menu Cochon',
  description:
    'Convertissez facilement les centimètres en pieds. 1 pied = 30,48 cm. Tableau de tailles humaines et outil interactif gratuit.',
  alternates: {
    canonical: '/convertisseur/centimetre-pied/',
  },
  openGraph: {
    title: 'Conversion Centimètre en Pieds',
    description: 'Outil gratuit pour convertir les centimètres en pieds',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
