import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import MobileRadioBar from '@/components/KracRadio/MobileRadioBar';
import { siteConfig } from '@/lib/config';
import { headers } from 'next/headers';
import { getDictionary } from '@/i18n/getDictionary';
import { LocaleProvider } from '@/i18n/LocaleContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
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
    default: 'Menucochon | Recettes gourmandes',
    template: '%s | Menucochon',
  },
  description: siteConfig.description,
  keywords: ['recettes', 'cuisine', 'repas', 'plats', 'desserts', 'québec'],
  authors: [{ name: siteConfig.author }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [
      {
        url: '/images/og-default.svg',
        width: 1200,
        height: 630,
        alt: 'Menucochon - Recettes gourmandes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menucochon | Recettes gourmandes',
    description: siteConfig.description,
    images: ['/images/og-default.svg'],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [
        { url: '/rss/recettes', title: 'Menucochon - Recettes RSS' },
        { url: '/rss/blog', title: 'Menucochon - Blog RSS' },
      ],
    },
  },
};

// Force dynamic rendering to ensure headers() returns fresh values on each request
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect locale from header (set by middleware)
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';

  // Detect locale from pathname
  const locale: Locale = pathname.startsWith('/en') ? 'en' : 'fr';

  // Transparent header for homepage only
  // Check for root or /en with optional trailing slash
  const isHomepage = pathname === '/' || /^\/en\/?$/.test(pathname);

  // Get dictionaries for BOTH locales - we pass FR to server but client components will use the right one
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${bebasNeue.variable} font-sans antialiased`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KSP0R9W4MP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KSP0R9W4MP');
          `}
        </Script>
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8781698761921917"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <LocaleProvider locale={locale} dictionary={dictionary}>
          <LanguageProvider>
            <ScrollToTop />
            <Header locale={locale} dictionary={dictionary} transparent={isHomepage} />
            {/* Spacer for fixed header on non-homepage pages */}
            {!isHomepage && <div className="h-14 md:h-16" />}
            {children}
            <Footer locale={locale} dictionary={dictionary} />
            <MobileRadioBar locale={locale} />
          </LanguageProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
