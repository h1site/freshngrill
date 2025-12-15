import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pouce en Pied : La Conversion Facile en 1 Clic | Menucochon',
  description:
    'Convertissez facilement les pouces en pieds. 1 pied = 12 pouces. Calculateur en ligne gratuit pour tailles, meubles et distances.',
  alternates: {
    canonical: '/convertisseur/pouce-pied/',
  },
  openGraph: {
    title: 'Conversion Pouce en Pieds',
    description: 'Outil gratuit pour convertir les pouces en pieds',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
