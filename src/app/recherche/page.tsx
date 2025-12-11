import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchResults from './SearchResults';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Recherche: ${q} | Menu Cochon` : 'Recherche | Menu Cochon',
    description: 'Recherchez parmi toutes nos recettes et articles de blog.',
    alternates: {
      canonical: '/recherche/',
    },
    robots: {
      index: false, // Pages de recherche ne devraient pas être indexées
      follow: true,
    },
  };
}

export default async function RecherchePage({ searchParams }: Props) {
  const { q } = await searchParams;

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults query={q || ''} />
        </Suspense>
      </div>
    </main>
  );
}

function SearchSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded-full max-w-2xl mx-auto mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl h-80" />
        ))}
      </div>
    </div>
  );
}
