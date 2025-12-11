import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { siteConfig } from '@/lib/config';
import { headers } from 'next/headers';
import { getDictionary } from '@/i18n/getDictionary';
import { LocaleProvider } from '@/i18n/LocaleContext';
import type { Locale } from '@/i18n/config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Menu Cochon | Recettes gourmandes',
    template: '%s | Menu Cochon',
  },
  description: siteConfig.description,
  keywords: ['recettes', 'cuisine', 'repas', 'plats', 'desserts', 'québec'],
  authors: [{ name: siteConfig.author }],
  icons: {
    icon: '/images/logos/favicon.ico',
    shortcut: '/images/logos/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect locale from URL path
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';
  const locale: Locale = pathname.startsWith('/en') ? 'en' : 'fr';

  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale}>
      <head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0LPPK37F5M"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0LPPK37F5M');
            `,
          }}
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8781698761921917"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} ${bebasNeue.variable} font-sans antialiased`}>
        <LocaleProvider locale={locale} dictionary={dictionary}>
          <ScrollToTop />
          <Header locale={locale} dictionary={dictionary} />
          {children}
          <Footer locale={locale} dictionary={dictionary} />
        </LocaleProvider>
      </body>
    </html>
  );
}
