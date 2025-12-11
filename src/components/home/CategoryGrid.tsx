'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Category } from '@/types/recipe';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 md:py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
            Explorer
          </span>
          <h2 className="text-4xl md:text-5xl font-display text-black mt-2">
            Par Catégorie
          </h2>
          <div className="w-16 h-1 bg-[#F77313] mx-auto mt-6" />
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                href={`/recette?categorie=${category.slug}`}
                className="group block relative bg-white border border-neutral-200 p-6 md:p-8 text-center hover:border-[#F77313] transition-all duration-300"
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-[#F77313] transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-[#F77313] transition-colors duration-300" />

                <h3 className="font-display text-xl md:text-2xl text-black group-hover:text-[#F77313] transition-colors">
                  {category.name}
                </h3>

                <ArrowRight className="w-4 h-4 mx-auto mt-3 text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:text-[#F77313] transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
