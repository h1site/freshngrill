import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Fresh N' Grill | BBQ Recipes & Grilling Tips",
  description: 'Discover our collection of BBQ recipes, grilling tips, and outdoor cooking ideas. Fire up the grill!',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-5xl md:text-7xl tracking-wide text-neutral-900 mb-4">
          Fresh N&apos; Grill
        </h1>
        <p className="text-xl text-neutral-500 max-w-xl mx-auto">
          BBQ recipes, grilling tips, and outdoor cooking ideas. Coming soon.
        </p>
      </div>
    </main>
  );
}
