'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ArrowLeft, PartyPopper } from 'lucide-react';
import BbqCircularProgress from './BbqCircularProgress';
import { useBbqSound } from './useBbqSound';
import { type CookingStep, type CookingResult, formatTime } from '@/lib/bbq-cooking-data';

interface Props {
  result: CookingResult;
  meatName: string;
  meatEmoji: string;
  onBack: () => void;
  onReset: () => void;
}

export default function BbqTimerDisplay({ result, meatName, meatEmoji, onBack, onReset }: Props) {
  const { steps } = result;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(steps[0].durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [flashAlert, setFlashAlert] = useState<string | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const { initAudio, playFlipSound, playDoneSound, playCheckSound, setMuted } = useBbqSound();

  const currentStep = steps[currentStepIndex];
  const stepDuration = currentStep?.durationSeconds || 1;
  const progress = 1 - timeRemaining / stepDuration;

  // Initialize audio on first play
  const handlePlay = useCallback(() => {
    initAudio();
    setIsRunning(true);
  }, [initAudio]);

  // Wake lock
  useEffect(() => {
    async function acquireWakeLock() {
      if (isRunning && 'wakeLock' in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch {
          // Wake lock not supported or denied
        }
      }
    }
    if (isRunning) {
      acquireWakeLock();
    }
    return () => {
      wakeLockRef.current?.release();
      wakeLockRef.current = null;
    };
  }, [isRunning]);

  // Handle step completion
  const advanceStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1;

    if (nextIndex >= steps.length) {
      // All done!
      setIsRunning(false);
      setIsComplete(true);
      playDoneSound();
      setFlashAlert('Done! 🎉');
      return;
    }

    const nextStep = steps[nextIndex];

    // Play appropriate sound
    if (nextStep.alertSound === 'flip') {
      playFlipSound();
      setFlashAlert(nextStep.label.toUpperCase() + '!');
    } else if (nextStep.alertSound === 'done') {
      playDoneSound();
      setFlashAlert('Done! 🎉');
    } else if (nextStep.alertSound === 'check') {
      playCheckSound();
      setFlashAlert('Check Temperature!');
    }

    // Clear flash after 2 seconds
    setTimeout(() => setFlashAlert(null), 2500);

    setCurrentStepIndex(nextIndex);
    setTimeRemaining(nextStep.durationSeconds);
  }, [currentStepIndex, steps, playFlipSound, playDoneSound, playCheckSound]);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || isComplete) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          advanceStep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isComplete, advanceStep]);

  // Mute toggle
  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    setMuted(newMuted);
  }, [isMuted, setMuted]);

  // Get step progress color
  const getStepColor = (step: CookingStep) => {
    if (step.type === 'rest') return '#3b82f6';
    if (step.type === 'flip') return '#f59e0b';
    return '#00bf63';
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-neutral-950 rounded-2xl p-8 text-center"
      >
        <div className="text-6xl mb-4"><PartyPopper className="w-16 h-16 mx-auto text-[#00bf63]" /></div>
        <h2 className="font-display text-3xl md:text-4xl tracking-wide text-white mb-2">
          Ready to Serve!
        </h2>
        <p className="text-neutral-400 text-lg mb-2">
          Your {meatName.toLowerCase()} is perfectly cooked {meatEmoji}
        </p>
        <p className="text-neutral-500 text-sm mb-8">
          Target internal temperature: {result.targetInternalTemp}°F
        </p>

        {result.tips.length > 0 && (
          <div className="text-left bg-white/5 rounded-xl p-5 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#00bf63] mb-3">Pro Tips</h3>
            <ul className="space-y-2">
              {result.tips.map((tip, i) => (
                <li key={i} className="text-neutral-300 text-sm flex gap-2">
                  <span className="text-[#00bf63] shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onReset}
          className="px-8 py-3 bg-[#00bf63] hover:bg-[#00a855] text-white font-bold uppercase tracking-wider rounded-xl transition-colors"
        >
          Cook Something Else
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
    >
      <button
        onClick={() => { setIsRunning(false); onBack(); }}
        className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-sm mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Settings
      </button>

      <div className="bg-neutral-950 rounded-2xl p-6 md:p-10">
        {/* Flash alert overlay */}
        <AnimatePresence>
          {flashAlert && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 pointer-events-none"
            >
              <div className="text-center">
                <p className="font-display text-5xl md:text-7xl text-[#00bf63] tracking-wider animate-pulse">
                  {flashAlert}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current step label */}
        <div className="text-center mb-6" aria-live="polite">
          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
            Step {currentStepIndex + 1} of {steps.length}
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-wide text-white">
            {currentStep.label}
          </h2>
        </div>

        {/* Circular progress + timer */}
        <div className="flex justify-center mb-6">
          <BbqCircularProgress
            progress={progress}
            size={220}
            strokeWidth={10}
            color={getStepColor(currentStep)}
          >
            <div className="text-center">
              <p className="text-white font-mono text-4xl md:text-5xl font-bold tracking-tight">
                {formatTime(timeRemaining)}
              </p>
              <p className="text-neutral-500 text-xs uppercase tracking-wider mt-1">
                {currentStep.type === 'rest' ? 'resting' : 'cooking'}
              </p>
            </div>
          </BbqCircularProgress>
        </div>

        {/* Step description */}
        <p className="text-neutral-400 text-center text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
          {currentStep.description}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={toggleMute}
            className="p-3 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={isRunning ? () => setIsRunning(false) : handlePlay}
            className="p-5 rounded-full bg-[#00bf63] hover:bg-[#00a855] text-white transition-colors shadow-lg shadow-[#00bf63]/30"
            aria-label={isRunning ? 'Pause' : 'Play'}
          >
            {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setCurrentStepIndex(0);
              setTimeRemaining(steps[0].durationSeconds);
              setIsComplete(false);
            }}
            className="p-3 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Step timeline */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, i) => {
            const isActive = i === currentStepIndex;
            const isPast = i < currentStepIndex;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : isPast
                      ? 'bg-[#00bf63]/20 text-[#00bf63]'
                      : 'bg-white/5 text-neutral-600'
                }`}
              >
                {isPast && <span>✓</span>}
                {step.label}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
