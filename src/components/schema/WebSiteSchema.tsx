export default function WebSiteSchema() {
  const baseUrl = 'https://freshngrill.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: "Fresh N' Grill",
    alternateName: ['Fresh N Grill', 'FreshNGrill'],
    description: 'Discover our collection of BBQ recipes, grilling tips, and outdoor cooking ideas. Fire up the grill!',
    url: baseUrl,
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: "Fresh N' Grill",
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
        width: 100,
        height: 100,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/recipe/?q={search_term_string}`,
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
