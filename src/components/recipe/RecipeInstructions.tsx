'use client';

import { useState } from 'react';
import Image from 'next/image';
import { InstructionStep } from '@/types/recipe';
import { Check, Lightbulb } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface Props {
  instructions: InstructionStep[];
  locale?: Locale;
}

export default function RecipeInstructions({ instructions, locale = 'fr' }: Props) {
  const isEN = locale === 'en';
  const t = isEN ? {
    preparation: 'Preparation',
    instructions: 'Instructions',
    step: 'Step',
  } : {
    preparation: 'Préparation',
    instructions: 'Instructions',
    step: 'Étape',
  };
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (step: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(step)) {
      newCompleted.delete(step);
    } else {
      newCompleted.add(step);
    }
    setCompletedSteps(newCompleted);
  };

  const progress = (completedSteps.size / instructions.length) * 100;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="text-[#F77313] text-xs font-medium uppercase tracking-widest">
            {t.preparation}
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-black mt-1">{t.instructions}</h2>
        </div>

        {/* Barre de progression */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500">
            {completedSteps.size}/{instructions.length}
          </span>
          <div className="w-32 h-1 bg-neutral-200 overflow-hidden">
            <div
              className="h-full bg-[#F77313] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <ol className="space-y-0">
        {instructions.map((instruction, index) => {
          const isCompleted = completedSteps.has(instruction.step);
          const isLast = index === instructions.length - 1;

          return (
            <li
              key={instruction.step}
              className={`relative transition-opacity ${
                isCompleted ? 'opacity-50' : ''
              }`}
            >
              <div className="flex gap-6 md:gap-10">
                {/* Colonne numéro + ligne */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => toggleStep(instruction.step)}
                    className={`w-14 h-14 flex items-center justify-center font-display text-2xl transition-all ${
                      isCompleted
                        ? 'bg-[#F77313] text-white'
                        : 'bg-neutral-100 text-neutral-800 border border-neutral-200 hover:border-[#F77313]'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      instruction.step
                    )}
                  </button>
                  {/* Ligne de connexion */}
                  {!isLast && (
                    <div className="w-px flex-1 bg-neutral-200 min-h-[40px]" />
                  )}
                </div>

                {/* Contenu */}
                <div className={`flex-1 pb-10 ${isLast ? 'pb-0' : ''}`}>
                  {instruction.title && (
                    <h3 className={`font-display text-xl text-black mb-3 ${isCompleted ? 'line-through' : ''}`}>
                      {instruction.title}
                    </h3>
                  )}

                  <p className={`text-neutral-600 leading-relaxed ${isCompleted ? 'line-through' : ''}`}>
                    {instruction.content}
                  </p>

                  {/* Image de l'étape */}
                  {instruction.image && (
                    <div className="relative aspect-video overflow-hidden mt-6">
                      <Image
                        src={instruction.image}
                        alt={`${t.step} ${instruction.step}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Conseil */}
                  {instruction.tip && (
                    <div className="flex items-start gap-3 mt-6 p-5 bg-[#F77313]/5 border-l-2 border-[#F77313]">
                      <Lightbulb className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-neutral-700">{instruction.tip}</p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
