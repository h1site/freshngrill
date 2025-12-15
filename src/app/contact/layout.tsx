import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Menucochon',
  description: 'Contactez-nous pour toute question, suggestion ou partenariat. Nous sommes là pour vous aider.',
  alternates: {
    canonical: '/contact/',
    languages: {
      'fr-CA': '/contact/',
      'en-CA': '/en/contact/',
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
