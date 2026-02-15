import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'BBQ tips, grilling techniques, and outdoor cooking articles.',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-5xl md:text-7xl tracking-wide text-neutral-900 mb-4">
          Blog
        </h1>
        <p className="text-xl text-neutral-500 max-w-xl mx-auto">
          Articles and grilling tips coming soon.
        </p>
      </div>
    </main>
  );
}
