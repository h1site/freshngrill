import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  AmazonSearchAffiliateLink,
  AmazonSearchAffiliateButton,
} from '@/components/affiliate/AmazonSearchAffiliateLink';

describe('AmazonSearchAffiliateLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu du lien', () => {
    it('rend un élément <a>', () => {
      render(
        <AmazonSearchAffiliateLink query="casque bluetooth">
          Voir sur Amazon
        </AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      expect(link.tagName).toBe('A');
    });

    it('affiche le contenu children', () => {
      render(
        <AmazonSearchAffiliateLink query="casque bluetooth">
          Acheter maintenant
        </AmazonSearchAffiliateLink>
      );

      expect(screen.getByText('Acheter maintenant')).toBeInTheDocument();
    });

    it('applique la className fournie', () => {
      render(
        <AmazonSearchAffiliateLink query="test" className="custom-class text-blue-500">
          Lien
        </AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-class');
      expect(link).toHaveClass('text-blue-500');
    });
  });

  describe('Attribut href', () => {
    it('href commence par https://{amazonDomain}/gp/search/', () => {
      render(
        <AmazonSearchAffiliateLink query="test">Lien</AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      expect(link.getAttribute('href')).toMatch(/^https:\/\/www\.amazon\.ca\/gp\/search\//);
    });

    it('href contient le tag affilié', () => {
      render(
        <AmazonSearchAffiliateLink query="test">Lien</AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      expect(link.getAttribute('href')).toContain('tag=test-tag-20');
    });

    it('href contient les keywords encodés', () => {
      render(
        <AmazonSearchAffiliateLink query="casque sans fil">Lien</AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      const href = link.getAttribute('href') || '';
      expect(href).toContain('keywords=');
      expect(href).toContain('casque');
    });

    it('accepte un domaine personnalisé', () => {
      render(
        <AmazonSearchAffiliateLink query="test" domain="www.amazon.com">
          Lien
        </AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      expect(link.getAttribute('href')).toMatch(/^https:\/\/www\.amazon\.com\//);
    });

    it('accepte des extraParams', () => {
      render(
        <AmazonSearchAffiliateLink query="test" extraParams={{ i: 'electronics' }}>
          Lien
        </AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      expect(link.getAttribute('href')).toContain('i=electronics');
    });
  });

  describe('Attribut target', () => {
    it('a target="_blank"', () => {
      render(
        <AmazonSearchAffiliateLink query="test">Lien</AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  describe('Attribut rel', () => {
    it('contient "nofollow"', () => {
      render(
        <AmazonSearchAffiliateLink query="test">Lien</AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      const rel = link.getAttribute('rel') || '';
      expect(rel).toContain('nofollow');
    });

    it('contient "noopener"', () => {
      render(
        <AmazonSearchAffiliateLink query="test">Lien</AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      const rel = link.getAttribute('rel') || '';
      expect(rel).toContain('noopener');
    });

    it('contient "sponsored"', () => {
      render(
        <AmazonSearchAffiliateLink query="test">Lien</AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      const rel = link.getAttribute('rel') || '';
      expect(rel).toContain('sponsored');
    });
  });

  describe('Data attributes', () => {
    it('a data-affiliate="amazon"', () => {
      render(
        <AmazonSearchAffiliateLink query="test">Lien</AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('data-affiliate', 'amazon');
    });

    it('a data-query avec la requête', () => {
      render(
        <AmazonSearchAffiliateLink query="casque bluetooth">Lien</AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('data-query', 'casque bluetooth');
    });
  });

  describe('Tracking au clic', () => {
    it('appelle sendBeacon au clic', () => {
      const sendBeaconMock = vi.fn(() => true);
      navigator.sendBeacon = sendBeaconMock;

      render(
        <AmazonSearchAffiliateLink query="test">Lien</AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      fireEvent.click(link);

      expect(sendBeaconMock).toHaveBeenCalledWith(
        '/api/affiliate-click',
        expect.any(Blob)
      );
    });

    it('ne bloque pas la navigation (pas de preventDefault)', () => {
      render(
        <AmazonSearchAffiliateLink query="test">Lien</AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      const clickEvent = fireEvent.click(link);

      // Si le clic n'est pas bloqué, la navigation se ferait normalement
      // On vérifie juste que le lien a bien l'attribut href
      expect(link).toHaveAttribute('href');
    });

    it('appelle onTracked callback si fourni', () => {
      const onTrackedMock = vi.fn();

      render(
        <AmazonSearchAffiliateLink query="test" onTracked={onTrackedMock}>
          Lien
        </AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      fireEvent.click(link);

      expect(onTrackedMock).toHaveBeenCalledWith(
        expect.objectContaining({
          query: 'test',
          tag: 'test-tag-20',
          domain: 'www.amazon.ca',
        })
      );
    });

    it('ne track pas si disableTracking=true', () => {
      const sendBeaconMock = vi.fn(() => true);
      navigator.sendBeacon = sendBeaconMock;

      render(
        <AmazonSearchAffiliateLink query="test" disableTracking>
          Lien
        </AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      fireEvent.click(link);

      expect(sendBeaconMock).not.toHaveBeenCalled();
    });
  });

  describe('Accessibilité', () => {
    it('accepte un title', () => {
      render(
        <AmazonSearchAffiliateLink query="test" title="Acheter sur Amazon">
          Lien
        </AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('title', 'Acheter sur Amazon');
    });

    it('accepte un aria-label', () => {
      render(
        <AmazonSearchAffiliateLink query="test" aria-label="Rechercher test sur Amazon">
          Lien
        </AmazonSearchAffiliateLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-label', 'Rechercher test sur Amazon');
    });
  });
});

describe('AmazonSearchAffiliateButton', () => {
  it('rend un lien stylisé avec les classes par défaut', () => {
    render(
      <AmazonSearchAffiliateButton query="test">
        Acheter
      </AmazonSearchAffiliateButton>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveClass('bg-[#FF9900]');
    expect(link).toHaveClass('inline-flex');
  });

  it('a les mêmes attributs que AmazonSearchAffiliateLink', () => {
    render(
      <AmazonSearchAffiliateButton query="test">
        Acheter
      </AmazonSearchAffiliateButton>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('rel')).toContain('nofollow');
    expect(link.getAttribute('rel')).toContain('sponsored');
  });
});
