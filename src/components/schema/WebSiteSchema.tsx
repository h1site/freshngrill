interface Props {
  locale?: 'fr' | 'en';
}

export default function WebSiteSchema({ locale = 'fr' }: Props) {
  const baseUrl = 'https://menucochon.com';
  const searchPath = locale === 'en' ? '/en/search/' : '/recherche/';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: 'Menucochon',
    alternateName: ['Menu Cochon', 'Menucochon.com'],
    description: locale === 'en'
      ? 'Discover hundreds of delicious Quebec recipes. Easy homemade meals from appetizers to desserts.'
      : 'Découvrez des centaines de recettes québécoises gourmandes. Des repas maison faciles des entrées aux desserts.',
    url: baseUrl,
    inLanguage: locale === 'en' ? 'en-CA' : 'fr-CA',
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Menucochon',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logos/menucochon-blanc.svg`,
        width: 200,
        height: 60,
      },
      sameAs: [
        'https://www.facebook.com/menucochon',
        'https://www.instagram.com/menucochon',
        'https://www.pinterest.ca/menucochon',
      ],
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}${searchPath}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
