import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, Heart, Users, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Menu Cochon',
  description:
    'Discover Menu Cochon, your source for delicious and easy-to-make recipes. Our mission: to make cooking accessible to everyone.',
  alternates: {
    canonical: '/en/about/',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide mb-6">
              About Menu Cochon
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
              Delicious, simple and tasty recipes for everyday life.
              Welcome to our culinary world!
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-black mb-6">
                Our Story
              </h2>
              <div className="prose prose-lg text-neutral-600">
                <p>
                  Menu Cochon was born from a simple passion: sharing the joy of cooking
                  with as many people as possible. Since our beginnings, we believe that good
                  food doesn&apos;t have to be complicated.
                </p>
                <p>
                  Each recipe is tested and approved to guarantee you delicious results
                  every time. Whether you&apos;re a beginner or an experienced cook,
                  you&apos;ll find ideas here to delight your family and friends.
                </p>
                <p>
                  Based in Quebec, we are committed to offering recipes
                  that celebrate our culinary heritage while exploring flavors
                  from around the world.
                </p>
              </div>
            </div>
            <div className="relative aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                alt="Cooking"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-black mb-4">
              Our Values
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              What guides us every day in creating our recipes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Simplicity</h3>
              <p className="text-neutral-600 text-sm">
                Accessible recipes with ingredients you already have.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Passion</h3>
              <p className="text-neutral-600 text-sm">
                Each recipe is created with love and tested with care.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Sharing</h3>
              <p className="text-neutral-600 text-sm">
                Food is better when we share it together.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Authenticity</h3>
              <p className="text-neutral-600 text-sm">
                Honest recipes, without artifice, that have proven themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-black text-white p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl mb-4">
              Want to cook with us?
            </h2>
            <p className="text-neutral-400 mb-8">
              Explore our recipes and find your next culinary inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/en/recipe"
                className="inline-flex items-center justify-center gap-2 bg-[#F77313] text-white px-6 py-3 font-medium hover:bg-[#e56610] transition-colors"
              >
                View recipes
              </Link>
              <Link
                href="/en/contact"
                className="inline-flex items-center justify-center gap-2 border border-white text-white px-6 py-3 font-medium hover:bg-white hover:text-black transition-colors"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
