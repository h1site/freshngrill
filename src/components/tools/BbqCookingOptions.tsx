'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MEAT_OPTIONS, GRILL_TEMPS, DONENESS_LABELS, DONENESS_COLORS, INTERNAL_TEMPS,
  calculateCookingTime, formatTime,
  type MeatType, type Doneness, type GrillTemp,
} from '@/lib/bbq-cooking-data';
import { ArrowLeft, Thermometer, Flame, Play } from 'lucide-react';

interface Props {
  meatType: MeatType;
  thickness: number;
  doneness: Doneness;
  grillTemp: GrillTemp;
  onThicknessChange: (v: number) => void;
  onDonenessChange: (v: Doneness) => void;
  onGrillTempChange: (v: GrillTemp) => void;
  onBack: () => void;
  onStart: () => void;
}

const ALL_DONENESS: Doneness[] = ['rare', 'medium-rare', 'medium', 'medium-well', 'well-done'];
const ALL_TEMPS: GrillTemp[] = ['low', 'medium', 'high', 'searing'];

export default function BbqCookingOptions({
  meatType, thickness, doneness, grillTemp,
  onThicknessChange, onDonenessChange, onGrillTempChange,
  onBack, onStart,
}: Props) {
  const meat = MEAT_OPTIONS.find(m => m.id === meatType)!;

  const preview = useMemo(
    () => calculateCookingTime(meatType, thickness, doneness, grillTemp),
    [meatType, thickness, doneness, grillTemp],
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
    >
      {/* Back button + title */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-sm mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">{meat.emoji}</span>
        <div>
          <h2 className="font-display text-2xl md:text-3xl tracking-wide text-neutral-900">
            {meat.name}
          </h2>
          <p className="text-neutral-400 text-sm">{meat.description}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Thickness */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
            Thickness / Size
          </h3>
          <div className="flex flex-wrap gap-2">
            {meat.thicknessOptions.map((opt) => (
              <button
                key={opt.valueInches}
                onClick={() => onThicknessChange(opt.valueInches)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  thickness === opt.valueInches
                    ? 'bg-[#00bf63] text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Doneness */}
        {meat.supportsDoneness && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              <Thermometer className="w-3.5 h-3.5 inline mr-1" />
              Doneness — Target {INTERNAL_TEMPS[doneness]}°F
            </h3>
            <div className="flex flex-wrap gap-2">
              {ALL_DONENESS.map((d) => {
                const available = meat.availableDoneness.includes(d);
                const active = doneness === d;
                return (
                  <button
                    key={d}
                    onClick={() => available && onDonenessChange(d)}
                    disabled={!available}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      !available
                        ? 'bg-neutral-50 text-neutral-300 cursor-not-allowed'
                        : active
                          ? 'text-white shadow-md'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                    style={active ? { backgroundColor: DONENESS_COLORS[d] } : undefined}
                  >
                    {DONENESS_LABELS[d]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Grill Temperature */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
            <Flame className="w-3.5 h-3.5 inline mr-1" />
            Grill Temperature
          </h3>
          <div className="flex flex-wrap gap-2">
            {ALL_TEMPS.map((t) => {
              const active = grillTemp === t;
              const isRecommended = meat.recommendedGrillTemp === t;
              return (
                <button
                  key={t}
                  onClick={() => onGrillTempChange(t)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? 'bg-neutral-900 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {GRILL_TEMPS[t].label}
                  {isRecommended && (
                    <span className={`ml-1.5 text-[10px] font-bold uppercase ${active ? 'text-[#00bf63]' : 'text-[#00bf63]'}`}>
                      ★
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary + Start */}
        <div className="bg-neutral-950 text-white rounded-2xl p-6 mt-6">
          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div>
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider mb-1">Cook Time</p>
              <p className="text-2xl font-bold text-[#00bf63]">{formatTime(preview.totalCookTimeSeconds)}</p>
            </div>
            <div>
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider mb-1">Rest</p>
              <p className="text-2xl font-bold">{formatTime(preview.totalRestTimeSeconds)}</p>
            </div>
            <div>
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider mb-1">Total</p>
              <p className="text-2xl font-bold">{formatTime(preview.totalTimeSeconds)}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {preview.steps.map((step) => (
              <span
                key={step.id}
                className={`text-xs px-3 py-1 rounded-full ${
                  step.type === 'rest' ? 'bg-blue-500/20 text-blue-300' :
                  step.type === 'flip' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-white/10 text-white/70'
                }`}
              >
                {step.label}
              </span>
            ))}
          </div>

          <button
            onClick={onStart}
            className="w-full py-4 bg-[#00bf63] hover:bg-[#00a855] text-white font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
          >
            <Play className="w-5 h-5" />
            Start Cooking
          </button>
        </div>
      </div>
    </motion.div>
  );
}
