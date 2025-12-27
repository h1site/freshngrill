import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Menucochon',
  description:
    'Contact us for any questions, suggestions or partnerships. We are here to help.',
  keywords: [
    'contact menucochon',
    'contact us',
    'recipe question',
    'recipe suggestion',
    'culinary partnership',
    'collaboration',
  ],
  alternates: {
    canonical: '/en/contact/',
    languages: {
      'fr-CA': '/contact/',
      'en-CA': '/en/contact/',
    },
  },
  openGraph: {
    title: 'Contact | Menucochon',
    description:
      'Contact us for any questions, suggestions or partnerships. We are here to help.',
    siteName: 'Menucochon',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact | Menucochon',
    description:
      'Contact us for any questions, suggestions or partnerships.',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
