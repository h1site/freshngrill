'use client';

import { useRef, useCallback } from 'react';

export function useBbqSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isMutedRef = useRef(false);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }
    // Resume if suspended (browser autoplay policy)
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  const playBeep = useCallback((frequency: number, durationMs: number) => {
    const ctx = audioContextRef.current;
    if (!ctx || isMutedRef.current) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationMs / 1000);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + durationMs / 1000);
  }, []);

  const playFlipSound = useCallback(() => {
    // Two quick beeps — "time to flip!"
    playBeep(600, 200);
    setTimeout(() => playBeep(600, 200), 300);
    // Vibrate on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [playBeep]);

  const playDoneSound = useCallback(() => {
    // Three descending beeps — "all done!"
    playBeep(800, 250);
    setTimeout(() => playBeep(600, 250), 350);
    setTimeout(() => playBeep(400, 400), 700);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
  }, [playBeep]);

  const playCheckSound = useCallback(() => {
    // Single beep — "check temperature"
    playBeep(500, 300);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(200);
    }
  }, [playBeep]);

  const setMuted = useCallback((muted: boolean) => {
    isMutedRef.current = muted;
  }, []);

  const isMuted = useCallback(() => isMutedRef.current, []);

  return { initAudio, playFlipSound, playDoneSound, playCheckSound, setMuted, isMuted };
}
