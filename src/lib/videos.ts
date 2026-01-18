// YouTube Videos Data for Menucochon

export interface Video {
  id: string;
  slug: string;
  slugEn: string;
  youtubeId: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  thumbnail: string;
  duration: string; // Format: "MM:SS"
  publishedAt: string;
  tags: string[];
  tagsEn: string[];
}

// Extract YouTube ID from URL
export function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : '';
}

// Get YouTube thumbnail URL
export function getYouTubeThumbnail(youtubeId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault',
  };
  return `https://img.youtube.com/vi/${youtubeId}/${qualityMap[quality]}.jpg`;
}

// Videos collection
export const VIDEOS: Video[] = [
  {
    id: '1',
    slug: 'poulet-mole-chocolat',
    slugEn: 'chicken-mole-chocolate',
    youtubeId: 'Tx-XYqw8RsU',
    title: 'Poulet Mole au Chocolat',
    titleEn: 'Chicken Mole with Chocolate',
    description: 'Découvrez cette recette traditionnelle mexicaine de poulet mole au chocolat. Une sauce riche et complexe aux saveurs uniques qui marie le cacao, les épices et les piments.',
    descriptionEn: 'Discover this traditional Mexican chicken mole recipe with chocolate. A rich and complex sauce with unique flavors combining cocoa, spices and chilies.',
    thumbnail: getYouTubeThumbnail('Tx-XYqw8RsU'),
    duration: '8:45',
    publishedAt: '2024-12-01',
    tags: ['poulet', 'mole', 'chocolat', 'mexicain', 'recette'],
    tagsEn: ['chicken', 'mole', 'chocolate', 'mexican', 'recipe'],
  },
  {
    id: '2',
    slug: 'poulet-chorizo-cremeux',
    slugEn: 'creamy-chicken-chorizo',
    youtubeId: 'Ou9gajYfXgw',
    title: 'Poulet Chorizo Crémeux',
    titleEn: 'Creamy Chicken Chorizo',
    description: 'Une recette facile et savoureuse de poulet au chorizo dans une sauce crémeuse. Parfait pour un repas réconfortant en semaine!',
    descriptionEn: 'An easy and flavorful creamy chicken and chorizo recipe. Perfect for a comforting weeknight meal!',
    thumbnail: getYouTubeThumbnail('Ou9gajYfXgw'),
    duration: '6:30',
    publishedAt: '2024-12-15',
    tags: ['poulet', 'chorizo', 'crémeux', 'sauce', 'recette facile'],
    tagsEn: ['chicken', 'chorizo', 'creamy', 'sauce', 'easy recipe'],
  },
  {
    id: '3',
    slug: 'pub-menucochon',
    slugEn: 'menucochon-ad',
    youtubeId: 'Rk6w5P6RJtM',
    title: 'Pub Menucochon',
    titleEn: 'Menucochon Ad',
    description: 'La publicité officielle de Menucochon! Découvrez notre univers gourmand et nos recettes québécoises.',
    descriptionEn: 'The official Menucochon advertisement! Discover our gourmet world and Quebec recipes.',
    thumbnail: getYouTubeThumbnail('Rk6w5P6RJtM'),
    duration: '0:30',
    publishedAt: '2025-01-10',
    tags: ['pub', 'publicité', 'menucochon', 'québec'],
    tagsEn: ['ad', 'advertisement', 'menucochon', 'quebec'],
  },
  {
    id: '4',
    slug: 'bloopers-poulet-mole-poblano',
    slugEn: 'bloopers-chicken-mole-poblano',
    youtubeId: 'iPQu7HUkQNU',
    title: 'Bloopers – Recette Poulet Mole Poblano | Fous rires en cuisine !',
    titleEn: 'Bloopers – Chicken Mole Poblano Recipe | Kitchen Laughs!',
    description: 'Les meilleurs moments drôles du tournage de notre recette de poulet mole poblano. Fous rires garantis!',
    descriptionEn: 'The funniest moments from filming our chicken mole poblano recipe. Guaranteed laughs!',
    thumbnail: getYouTubeThumbnail('iPQu7HUkQNU'),
    duration: '3:00',
    publishedAt: '2025-01-15',
    tags: ['bloopers', 'fous rires', 'poulet', 'mole', 'cuisine'],
    tagsEn: ['bloopers', 'laughs', 'chicken', 'mole', 'cooking'],
  },
];

// Get all videos
export function getAllVideos(): Video[] {
  return VIDEOS.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Get video by slug (supports both FR and EN slugs)
export function getVideoBySlug(slug: string, locale: 'fr' | 'en' = 'fr'): Video | null {
  return VIDEOS.find(v =>
    locale === 'en' ? v.slugEn === slug : v.slug === slug
  ) || VIDEOS.find(v => v.slug === slug || v.slugEn === slug) || null;
}

// Get video by ID
export function getVideoById(id: string): Video | null {
  return VIDEOS.find(v => v.id === id) || null;
}

// Get recent videos
export function getRecentVideos(limit: number = 4): Video[] {
  return getAllVideos().slice(0, limit);
}

// YouTube channel info
export const YOUTUBE_CHANNEL = {
  url: 'https://www.youtube.com/@menucochon',
  name: 'Menucochon',
  subscriberCount: '1K+', // Update as needed
};
