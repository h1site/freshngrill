'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BbqMeatSelector from './BbqMeatSelector';
import BbqCookingOptions from './BbqCookingOptions';
import BbqTimerDisplay from './BbqTimerDisplay';
import {
  MEAT_OPTIONS, calculateCookingTime,
  type MeatType, type Doneness, type GrillTemp, type CookingResult,
} from '@/lib/bbq-cooking-data';

type WizardStep = 'select-meat' | 'configure' | 'timer';

export default function BbqCalculator() {
  const [wizardStep, setWizardStep] = useState<WizardStep>('select-meat');
  const [selectedMeat, setSelectedMeat] = useState<MeatType | null>(null);
  const [thickness, setThickness] = useState<number>(1.0);
  const [doneness, setDoneness] = useState<Doneness>('medium');
  const [grillTemp, setGrillTemp] = useState<GrillTemp>('high');
  const [cookingResult, setCookingResult] = useState<CookingResult | null>(null);

  const meat = selectedMeat ? MEAT_OPTIONS.find(m => m.id === selectedMeat) : null;

  const handleSelectMeat = useCallback((meatType: MeatType) => {
    setSelectedMeat(meatType);
    const m = MEAT_OPTIONS.find(mm => mm.id === meatType)!;
    // Set defaults for this meat
    setThickness(m.thicknessOptions[Math.floor(m.thicknessOptions.length / 2)].valueInches);
    setDoneness(m.availableDoneness[Math.floor(m.availableDoneness.length / 2)]);
    setGrillTemp(m.recommendedGrillTemp);
    setWizardStep('configure');
  }, []);

  const handleStart = useCallback(() => {
    if (!selectedMeat) return;
    const result = calculateCookingTime(selectedMeat, thickness, doneness, grillTemp);
    setCookingResult(result);
    setWizardStep('timer');
  }, [selectedMeat, thickness, doneness, grillTemp]);

  const handleReset = useCallback(() => {
    setWizardStep('select-meat');
    setSelectedMeat(null);
    setCookingResult(null);
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {wizardStep === 'select-meat' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            <BbqMeatSelector selected={selectedMeat} onSelect={handleSelectMeat} />
          </motion.div>
        )}

        {wizardStep === 'configure' && selectedMeat && (
          <motion.div
            key="configure"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            <BbqCookingOptions
              meatType={selectedMeat}
              thickness={thickness}
              doneness={doneness}
              grillTemp={grillTemp}
              onThicknessChange={setThickness}
              onDonenessChange={setDoneness}
              onGrillTempChange={setGrillTemp}
              onBack={() => setWizardStep('select-meat')}
              onStart={handleStart}
            />
          </motion.div>
        )}

        {wizardStep === 'timer' && cookingResult && meat && (
          <motion.div
            key="timer"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            <BbqTimerDisplay
              result={cookingResult}
              meatName={meat.name}
              meatEmoji={meat.emoji}
              onBack={() => setWizardStep('configure')}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
