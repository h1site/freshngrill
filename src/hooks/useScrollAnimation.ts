'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            setHasAnimated(true);
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView: triggerOnce ? isInView || hasAnimated : isInView };
}

// Stagger animation for lists
export function useStaggerAnimation<T extends HTMLElement = HTMLDivElement>(
  itemCount: number,
  options: UseScrollAnimationOptions & { staggerDelay?: number } = {}
) {
  const { staggerDelay = 0.1, ...scrollOptions } = options;
  const { ref, isInView } = useScrollAnimation<T>(scrollOptions);

  const getDelayForIndex = (index: number) => ({
    transitionDelay: isInView ? `${index * staggerDelay}s` : '0s',
  });

  return { ref, isInView, getDelayForIndex };
}
