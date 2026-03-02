'use client';

import { motion } from 'framer-motion';
import { MEAT_OPTIONS, type MeatType } from '@/lib/bbq-cooking-data';
import { Check } from 'lucide-react';

interface Props {
  selected: MeatType | null;
  onSelect: (meat: MeatType) => void;
}

export default function BbqMeatSelector({ selected, onSelect }: Props) {
  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl tracking-wide text-neutral-900 mb-2">
        Choose Your Meat
      </h2>
      <p className="text-neutral-500 mb-8">Select what you&apos;re grilling today</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {MEAT_OPTIONS.map((meat, i) => {
          const isSelected = selected === meat.id;
          return (
            <motion.button
              key={meat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect(meat.id)}
              className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.03] hover:shadow-lg ${
                isSelected
                  ? 'border-[#00bf63] bg-[#00bf63]/5 shadow-md'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#00bf63] flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-3xl block mb-2">{meat.emoji}</span>
              <span className="font-bold text-neutral-900 block text-sm">{meat.name}</span>
              <span className="text-neutral-400 text-xs block mt-0.5 leading-tight">{meat.description}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
