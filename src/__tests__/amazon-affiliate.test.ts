import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  buildAmazonSearchUrl,
  getAmazonSearchUrl,
  isValidAmazonDomain,
  normalizeAmazonDomain,
  ALLOWED_AMAZON_DOMAINS,
} from '@/lib/amazon-affiliate';

describe('buildAmazonSearchUrl', () => {
  describe('URL construction basique', () => {
    it('construit une URL avec les paramètres par défaut', () => {
      const result = buildAmazonSearchUrl({ query: 'casque bluetooth' });

      expect(result.url).toContain('https://www.amazon.ca/gp/search/');
      expect(result.url).toContain('keywords=casque+bluetooth');
      expect(result.url).toContain('tag=test-tag-20');
      expect(result.domain).toBe('www.amazon.ca');
      expect(result.tag).toBe('test-tag-20');
      expect(result.query).toBe('casque bluetooth');
    });

    it('encode correctement les caractères spéciaux dans la query', () => {
      const result = buildAmazonSearchUrl({ query: 'écouteurs sans fil & micro' });

      expect(result.url).toContain('keywords=');
      // Vérifie que les caractères spéciaux sont encodés
      expect(result.url).not.toContain(' ');
      expect(result.url).not.toContain('é');
    });

    it('trim les espaces de la query', () => {
      const result = buildAmazonSearchUrl({ query: '  casque  ' });

      expect(result.query).toBe('casque');
    });
  });

  describe('Tag affilié', () => {
    it('inclut le tag affilié par défaut depuis env', () => {
      const result = buildAmazonSearchUrl({ query: 'test' });

      expect(result.url).toContain('tag=test-tag-20');
      expect(result.tag).toBe('test-tag-20');
    });

    it('utilise un tag personnalisé si fourni', () => {
      const result = buildAmazonSearchUrl({
        query: 'test',
        tag: 'custom-tag-21',
      });

      expect(result.url).toContain('tag=custom-tag-21');
      expect(result.tag).toBe('custom-tag-21');
    });
  });

  describe('Domaine Amazon', () => {
    it('utilise le domaine par défaut (www.amazon.ca)', () => {
      const result = buildAmazonSearchUrl({ query: 'test' });

      expect(result.domain).toBe('www.amazon.ca');
      expect(result.url.startsWith('https://www.amazon.ca/')).toBe(true);
    });

    it('accepte un domaine whitelist valide', () => {
      const result = buildAmazonSearchUrl({
        query: 'test',
        domain: 'www.amazon.com',
      });

      expect(result.domain).toBe('www.amazon.com');
      expect(result.url.startsWith('https://www.amazon.com/')).toBe(true);
    });

    it('rejette un domaine non-whitelist et utilise le défaut', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = buildAmazonSearchUrl({
        query: 'test',
        domain: 'www.fake-amazon.com',
      });

      expect(result.domain).toBe('www.amazon.ca');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Domaine non autorisé')
      );

      consoleSpy.mockRestore();
    });

    it('nettoie le protocole du domaine', () => {
      const result = buildAmazonSearchUrl({
        query: 'test',
        domain: 'https://www.amazon.fr/',
      });

      expect(result.domain).toBe('www.amazon.fr');
    });
  });

  describe('Paramètres supplémentaires (extraParams)', () => {
    it('ajoute les extraParams à l\'URL', () => {
      const result = buildAmazonSearchUrl({
        query: 'test',
        extraParams: {
          i: 'electronics',
          rh: 'n:667823011',
        },
      });

      expect(result.url).toContain('i=electronics');
      expect(result.url).toContain('rh=n%3A667823011');
    });

    it('ignore les extraParams vides', () => {
      const result = buildAmazonSearchUrl({
        query: 'test',
        extraParams: {
          i: 'electronics',
          empty: '',
        },
      });

      expect(result.url).toContain('i=electronics');
      expect(result.url).not.toContain('empty=');
    });
  });
});

describe('getAmazonSearchUrl', () => {
  it('retourne une string URL', () => {
    const url = getAmazonSearchUrl('casque');

    expect(typeof url).toBe('string');
    expect(url).toContain('https://');
    expect(url).toContain('amazon');
  });
});

describe('isValidAmazonDomain', () => {
  it('retourne true pour les domaines whitelist', () => {
    expect(isValidAmazonDomain('www.amazon.ca')).toBe(true);
    expect(isValidAmazonDomain('www.amazon.com')).toBe(true);
    expect(isValidAmazonDomain('www.amazon.fr')).toBe(true);
  });

  it('retourne false pour les domaines invalides', () => {
    expect(isValidAmazonDomain('amazon.ca')).toBe(false);
    expect(isValidAmazonDomain('www.amazon.invalid')).toBe(false);
    expect(isValidAmazonDomain('fake-amazon.com')).toBe(false);
  });
});

describe('normalizeAmazonDomain', () => {
  it('retourne le domaine par défaut si aucun fourni', () => {
    const result = normalizeAmazonDomain();

    expect(result).toBe('www.amazon.ca');
  });

  it('nettoie le protocole et trailing slash', () => {
    expect(normalizeAmazonDomain('https://www.amazon.com/')).toBe('www.amazon.com');
    expect(normalizeAmazonDomain('http://www.amazon.fr')).toBe('www.amazon.fr');
  });

  it('convertit en lowercase', () => {
    expect(normalizeAmazonDomain('WWW.AMAZON.CA')).toBe('www.amazon.ca');
  });
});

describe('ALLOWED_AMAZON_DOMAINS', () => {
  it('contient les domaines Amazon principaux', () => {
    expect(ALLOWED_AMAZON_DOMAINS).toContain('www.amazon.ca');
    expect(ALLOWED_AMAZON_DOMAINS).toContain('www.amazon.com');
    expect(ALLOWED_AMAZON_DOMAINS).toContain('www.amazon.fr');
    expect(ALLOWED_AMAZON_DOMAINS).toContain('www.amazon.co.uk');
    expect(ALLOWED_AMAZON_DOMAINS).toContain('www.amazon.de');
  });

  it('ne contient que des domaines commençant par www.amazon', () => {
    ALLOWED_AMAZON_DOMAINS.forEach((domain) => {
      expect(domain).toMatch(/^www\.amazon\.[a-z.]+$/);
    });
  });
});
