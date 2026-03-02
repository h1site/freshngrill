'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MEAT_OPTIONS, SIDE_OPTIONS, DRINK_OPTIONS, APPETITE_LABELS,
  calculateParty,
  type AppetiteLevel, type Unit,
} from '@/lib/bbq-party-data';
import {
  Users, Minus, Plus, Check, ShoppingCart, ArrowLeft, Printer,
  Scale, Beef, Drumstick, Fish, UtensilsCrossed,
} from 'lucide-react';

type Step = 'setup' | 'results';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  beef: <Beef className="w-4 h-4" />,
  pork: <UtensilsCrossed className="w-4 h-4" />,
  poultry: <Drumstick className="w-4 h-4" />,
  seafood: <Fish className="w-4 h-4" />,
};

export default function BbqPartyCalculator() {
  const [step, setStep] = useState<Step>('setup');
  const [guests, setGuests] = useState(10);
  const [appetite, setAppetite] = useState<AppetiteLevel>('average');
  const [selectedMeats, setSelectedMeats] = useState<string[]>(['burgers', 'hot-dogs']);
  const [selectedSides, setSelectedSides] = useState<string[]>(['buns', 'corn', 'coleslaw', 'chips']);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>(['beer', 'soda', 'water']);
  const [unit, setUnit] = useState<Unit>('lbs');

  const toggleItem = useCallback((list: string[], setList: (v: string[]) => void, id: string) => {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  }, []);

  const result = useMemo(
    () => calculateParty(guests, appetite, selectedMeats, selectedSides, selectedDrinks),
    [guests, appetite, selectedMeats, selectedSides, selectedDrinks],
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (step === 'results') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <button
          onClick={() => setStep('setup')}
          className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-sm mb-6 transition-colors print:hidden"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Settings
        </button>

        {/* Summary header */}
        <div className="bg-neutral-950 text-white rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl tracking-wide">Your BBQ Shopping List</h2>
              <p className="text-neutral-400 mt-1">
                {guests} guests • {APPETITE_LABELS[appetite].label} appetite
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors print:hidden"
              aria-label="Print shopping list"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider mb-1">Meat Per Person</p>
              <p className="text-2xl font-bold text-[#00bf63]">
                {unit === 'kg' ? `${result.totalMeatPerPersonKg} kg` : `${result.totalMeatPerPersonLbs} lbs`}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider mb-1">Total Meat</p>
              <p className="text-2xl font-bold">
                {unit === 'kg'
                  ? `${result.meats.reduce((s, m) => s + m.totalKg, 0).toFixed(1)} kg`
                  : `${result.meats.reduce((s, m) => s + m.totalLbs, 0).toFixed(1)} lbs`
                }
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center col-span-2 md:col-span-1">
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider mb-1">Unit</p>
              <div className="flex gap-2 justify-center mt-1">
                <button
                  onClick={() => setUnit('lbs')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${unit === 'lbs' ? 'bg-[#00bf63] text-white' : 'bg-white/10 text-neutral-400'}`}
                >
                  lbs
                </button>
                <button
                  onClick={() => setUnit('kg')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${unit === 'kg' ? 'bg-[#00bf63] text-white' : 'bg-white/10 text-neutral-400'}`}
                >
                  kg
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Meats */}
        {result.meats.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4" /> Meats
            </h3>
            <div className="space-y-3">
              {result.meats.map(({ option, totalKg, totalLbs }) => (
                <div key={option.id} className="flex items-center justify-between bg-neutral-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <div>
                      <p className="font-bold text-neutral-900 text-sm">{option.name}</p>
                      <p className="text-neutral-400 text-xs">{option.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-neutral-900">
                      {unit === 'kg' ? `${totalKg} kg` : `${totalLbs} lbs`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sides */}
        {result.sides.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">Sides & Extras</h3>
            <div className="space-y-3">
              {result.sides.map(({ option, totalKg, totalLbs, totalCount }) => (
                <div key={option.id} className="flex items-center justify-between bg-neutral-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <p className="font-bold text-neutral-900 text-sm">{option.name}</p>
                  </div>
                  <p className="font-bold text-lg text-neutral-900">
                    {option.isCountable
                      ? `${totalCount} ${option.unit}`
                      : unit === 'kg' ? `${totalKg} kg` : `${totalLbs} lbs`
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drinks */}
        {result.drinks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">Drinks</h3>
            <div className="space-y-3">
              {result.drinks.map(({ option, totalUnits }) => (
                <div key={option.id} className="flex items-center justify-between bg-neutral-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <p className="font-bold text-neutral-900 text-sm">{option.name}</p>
                  </div>
                  <p className="font-bold text-lg text-neutral-900">
                    {totalUnits} {option.unit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {result.meats.length > 0 && (
          <div className="bg-[#00bf63]/5 border border-[#00bf63]/20 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-neutral-900 mb-3">Pro Tips for Your BBQ</h3>
            <ul className="space-y-2">
              {result.meats.map(({ option }) => (
                <li key={option.id} className="text-neutral-600 text-sm flex gap-2">
                  <span className="text-[#00bf63] shrink-0">•</span>
                  <span><strong>{option.name}:</strong> {option.tip}</span>
                </li>
              ))}
              <li className="text-neutral-600 text-sm flex gap-2">
                <span className="text-[#00bf63] shrink-0">•</span>
                <span><strong>General rule:</strong> Buy 10-15% extra to account for big eaters and second helpings.</span>
              </li>
            </ul>
          </div>
        )}

        <div className="text-center print:hidden">
          <button
            onClick={() => setStep('setup')}
            className="px-8 py-3 bg-[#00bf63] hover:bg-[#00a855] text-white font-bold uppercase tracking-wider rounded-xl transition-colors"
          >
            Recalculate
          </button>
        </div>
      </motion.div>
    );
  }

  // --- Setup Step ---
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Guest count */}
      <div>
        <h2 className="font-display text-2xl md:text-3xl tracking-wide text-neutral-900 mb-2">
          How many guests?
        </h2>
        <p className="text-neutral-500 text-sm mb-5">Including yourself</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setGuests(Math.max(1, guests - 1))}
            className="p-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 bg-neutral-50 rounded-xl px-6 py-3 min-w-[120px] justify-center">
            <Users className="w-5 h-5 text-[#00bf63]" />
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
              className="w-16 text-center text-3xl font-bold text-neutral-900 bg-transparent outline-none"
              min={1}
              max={200}
            />
          </div>
          <button
            onClick={() => setGuests(Math.min(200, guests + 1))}
            className="p-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
          {/* Quick presets */}
          <div className="hidden sm:flex gap-2 ml-4">
            {[5, 10, 20, 50].map(n => (
              <button
                key={n}
                onClick={() => setGuests(n)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  guests === n ? 'bg-[#00bf63] text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appetite level */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Appetite Level</h3>
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(APPETITE_LABELS) as [AppetiteLevel, { label: string; description: string }][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setAppetite(key)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                appetite === key
                  ? 'border-[#00bf63] bg-[#00bf63]/5'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <p className="font-bold text-sm text-neutral-900">{val.label}</p>
              <p className="text-neutral-400 text-xs mt-0.5">{val.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Meat selection */}
      <div>
        <h2 className="font-display text-2xl tracking-wide text-neutral-900 mb-2">
          What&apos;s on the menu?
        </h2>
        <p className="text-neutral-500 text-sm mb-5">Select all meats you plan to serve</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MEAT_OPTIONS.map((meat) => {
            const isSelected = selectedMeats.includes(meat.id);
            return (
              <button
                key={meat.id}
                onClick={() => toggleItem(selectedMeats, setSelectedMeats, meat.id)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-[#00bf63] bg-[#00bf63]/5'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#00bf63] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <span className="text-2xl block mb-1">{meat.emoji}</span>
                <span className="font-bold text-neutral-900 text-sm block">{meat.name}</span>
                <span className="text-neutral-400 text-[11px] block mt-0.5">{meat.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sides */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Sides & Extras</h3>
        <div className="flex flex-wrap gap-2">
          {SIDE_OPTIONS.map((side) => {
            const isSelected = selectedSides.includes(side.id);
            return (
              <button
                key={side.id}
                onClick={() => toggleItem(selectedSides, setSelectedSides, side.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-[#00bf63] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <span>{side.emoji}</span>
                {side.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drinks */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Drinks</h3>
        <div className="flex flex-wrap gap-2">
          {DRINK_OPTIONS.map((drink) => {
            const isSelected = selectedDrinks.includes(drink.id);
            return (
              <button
                key={drink.id}
                onClick={() => toggleItem(selectedDrinks, setSelectedDrinks, drink.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-[#00bf63] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <span>{drink.emoji}</span>
                {drink.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live preview + CTA */}
      <div className="bg-neutral-950 text-white rounded-2xl p-6 sticky bottom-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-400 text-xs uppercase tracking-wider">
              {guests} guests • {selectedMeats.length} meats • {selectedSides.length} sides
            </p>
            <p className="text-lg font-bold mt-0.5">
              Meat per person: <span className="text-[#00bf63]">{result.totalMeatPerPersonLbs} lbs</span>
              <span className="text-neutral-500 text-sm ml-2">({result.totalMeatPerPersonKg} kg)</span>
            </p>
          </div>
          <button
            onClick={() => { setStep('results'); window.scrollTo(0, 0); }}
            disabled={selectedMeats.length === 0}
            className="px-6 py-3 bg-[#00bf63] hover:bg-[#00a855] disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Get Shopping List</span>
            <span className="sm:hidden">Go</span>
          </button>
        </div>
      </div>
    </div>
  );
}
