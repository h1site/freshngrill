import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock des variables d'environnement pour les tests
process.env.NEXT_PUBLIC_AMAZON_ASSOC_TAG = 'test-tag-20';
process.env.NEXT_PUBLIC_AMAZON_DOMAIN = 'www.amazon.ca';

// Mock de navigator.sendBeacon
Object.defineProperty(navigator, 'sendBeacon', {
  writable: true,
  value: vi.fn(() => true),
});

// Mock de fetch global
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ ok: true }),
  } as Response)
);

// Mock de window.location
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    pathname: '/test-page',
    href: 'http://localhost:3000/test-page',
  },
});
