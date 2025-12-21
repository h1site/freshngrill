import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapping des aliments vers les catégories used_with
const FOOD_MAPPINGS = {
  meat: [
    'viande', 'viandes', 'bœuf', 'boeuf', 'poulet', 'porc', 'agneau', 'canard',
    'gibier', 'veau', 'lapin', 'dinde', 'volaille', 'saucisse', 'saucisses',
    'charcuterie', 'rôti', 'steak', 'côtelettes', 'brochettes'
  ],
  fish: [
    'poisson', 'poissons', 'fruits de mer', 'crevettes', 'crevette', 'saumon',
    'thon', 'morue', 'cabillaud', 'crustacés', 'homard', 'coquillages',
    'huîtres', 'moules', 'calamars', 'poulpe', 'poisson blanc', 'truite',
    'dorade', 'bar', 'sole', 'sardines', 'maquereau', 'anchois'
  ],
  vegetables: [
    'légume', 'légumes', 'légumineuses', 'lentilles', 'pois chiches',
    'haricots', 'tomate', 'tomates', 'aubergine', 'aubergines', 'courgette',
    'courgettes', 'poivron', 'poivrons', 'oignon', 'oignons', 'ail',
    'carotte', 'carottes', 'pomme de terre', 'pommes de terre', 'patate',
    'patates', 'champignon', 'champignons', 'épinards', 'chou', 'brocoli',
    'asperges', 'artichaut', 'céleri', 'concombre', 'courge', 'courges',
    'salade', 'salades', 'radis', 'betterave', 'fenouil', 'poireau'
  ],
  grains: [
    'riz', 'pâtes', 'nouilles', 'blé', 'quinoa', 'couscous', 'céréales',
    'orge', 'millet', 'sarrasin', 'polenta', 'risotto', 'paella',
    'semoule', 'boulgour'
  ],
  desserts: [
    'dessert', 'desserts', 'pâtisserie', 'pâtisseries', 'gâteau', 'gâteaux',
    'biscuit', 'biscuits', 'tarte', 'tartes', 'crème', 'crèmes', 'glace',
    'glaces', 'chocolat', 'fruits', 'compote', 'confiture', 'pudding',
    'flan', 'mousse', 'sorbet'
  ],
  soups: [
    'soupe', 'soupes', 'bouillon', 'bouillons', 'potage', 'potages',
    'ragoût', 'ragoûts', 'tajine', 'tajines', 'curry', 'currys',
    'mijoté', 'mijotés', 'chili', 'stew'
  ],
  bread: [
    'pain', 'pains', 'pizza', 'focaccia', 'naan', 'galette', 'crêpe',
    'crêpes', 'baguette', 'brioche', 'croissant'
  ],
  cheese: [
    'fromage', 'fromages', 'yaourt', 'yogourt', 'labneh', 'feta',
    'mozzarella', 'parmesan', 'ricotta', 'chèvre'
  ],
  eggs: [
    'œuf', 'œufs', 'oeufs', 'oeuf', 'omelette', 'frittata'
  ],
  sauces: [
    'sauce', 'sauces', 'marinade', 'marinades', 'vinaigrette',
    'assaisonnement', 'condiment'
  ],
  drinks: [
    'boisson', 'boissons', 'thé', 'café', 'infusion', 'tisane',
    'cocktail', 'vin chaud', 'punch', 'lait'
  ]
};

// Mapping des régions/origines
const ORIGIN_MAPPINGS: Record<string, string[]> = {
  'Inde': ['indien', 'inde', 'indienne', 'curry', 'garam', 'masala', 'tandoori'],
  'Méditerranée': ['méditerranéen', 'mediterraneen', 'méditerranée', 'grec', 'grecque', 'italien', 'italienne', 'espagnol', 'espagnole', 'provençal', 'provence'],
  'Asie': ['asiatique', 'asie', 'chinois', 'chinoise', 'chine', 'japonais', 'japonaise', 'coréen', 'coréenne', 'thaï', 'thaïlande', 'vietnam', 'vietnamien'],
  'Asie du Sud-Est': ['thaï', 'thaïlande', 'vietnam', 'vietnamien', 'cambodge', 'laos', 'indonésie', 'malaisie', 'singapour'],
  'Moyen-Orient': ['moyen-orient', 'arabe', 'libanais', 'libanaise', 'turc', 'turque', 'perse', 'persan', 'iranien', 'syrien', 'palestinien', 'jordanie'],
  'Afrique': ['africain', 'afrique', 'maghreb', 'marocain', 'marocaine', 'tunisien', 'algérien', 'éthiopien', 'sénégalais'],
  'Amérique': ['americain', 'amérique', 'mexicain', 'mexique', 'cajun', 'créole', 'caribéen', 'caraïbes', 'brésilien', 'péruvien', 'argentin'],
  'Amérique centrale': ['mexicain', 'mexique', 'guatémaltèque', 'hondurien', 'costaricain'],
  'Caraïbes': ['caraibes', 'caraïbes', 'jamaïcain', 'cubain', 'haïtien', 'antillais', 'antilles'],
  'Europe du Nord': ['nordique', 'scandinave', 'suédois', 'norvégien', 'danois', 'finlandais'],
  'France': ['français', 'française', 'provençal', 'alsacien', 'breton'],
  'Espagne': ['espagnol', 'espagnole', 'catalan', 'basque'],
  'Hongrie': ['hongrois', 'hongroise', 'paprika']
};

// Mapping des goûts
const TASTE_CATEGORIES = ['doux', 'piquant', 'fume', 'fumé', 'sucré', 'amer', 'acide'];

interface UsedWith {
  meat: string[];
  fish: string[];
  vegetables: string[];
  grains: string[];
  desserts: string[];
  soups: string[];
  bread: string[];
  cheese: string[];
  eggs: string[];
  sauces: string[];
  drinks: string[];
}

interface Spice {
  id: number;
  name_fr: string;
  categories: string[] | null;
  utilisation_aliments_fr: string[] | null;
  origine_histoire_fr: string | null;
  origin: string[] | null;
  used_with: UsedWith | null;
}

function extractUsedWith(aliments: string[]): UsedWith {
  const usedWith: UsedWith = {
    meat: [],
    fish: [],
    vegetables: [],
    grains: [],
    desserts: [],
    soups: [],
    bread: [],
    cheese: [],
    eggs: [],
    sauces: [],
    drinks: []
  };

  for (const aliment of aliments) {
    const lowerAliment = aliment.toLowerCase();

    for (const [category, keywords] of Object.entries(FOOD_MAPPINGS)) {
      for (const keyword of keywords) {
        if (lowerAliment.includes(keyword) || keyword.includes(lowerAliment)) {
          // Ajouter l'aliment original, pas le keyword
          const catKey = category as keyof UsedWith;
          if (!usedWith[catKey].includes(aliment)) {
            usedWith[catKey].push(aliment);
          }
          break;
        }
      }
    }
  }

  return usedWith;
}

function extractOrigins(categories: string[], origineHistoire: string | null): string[] {
  const origins: Set<string> = new Set();

  // Chercher dans les catégories
  for (const cat of categories) {
    const lowerCat = cat.toLowerCase();

    for (const [origin, keywords] of Object.entries(ORIGIN_MAPPINGS)) {
      for (const keyword of keywords) {
        if (lowerCat === keyword || lowerCat.includes(keyword)) {
          origins.add(origin);
          break;
        }
      }
    }
  }

  // Chercher dans origine_histoire_fr
  if (origineHistoire) {
    const lowerHistoire = origineHistoire.toLowerCase();

    for (const [origin, keywords] of Object.entries(ORIGIN_MAPPINGS)) {
      for (const keyword of keywords) {
        if (lowerHistoire.includes(keyword)) {
          origins.add(origin);
          break;
        }
      }
    }

    // Chercher des pays spécifiques dans le texte
    const countryPatterns = [
      { pattern: /\binde\b/i, origin: 'Inde' },
      { pattern: /\bindonésie\b/i, origin: 'Indonésie' },
      { pattern: /\bchine\b/i, origin: 'Chine' },
      { pattern: /\bjapon\b/i, origin: 'Asie' },
      { pattern: /\bmaroc\b/i, origin: 'Afrique' },
      { pattern: /\bégypte\b/i, origin: 'Afrique' },
      { pattern: /\bmexique\b/i, origin: 'Amérique centrale' },
      { pattern: /\bespagne\b/i, origin: 'Espagne' },
      { pattern: /\bhongrie\b/i, origin: 'Hongrie' },
      { pattern: /\bpays basque\b/i, origin: 'France' },
      { pattern: /\bprovence\b/i, origin: 'France' },
      { pattern: /\bfrançais\b/i, origin: 'France' },
      { pattern: /\bliban\b/i, origin: 'Moyen-Orient' },
      { pattern: /\bpalestine\b/i, origin: 'Moyen-Orient' },
      { pattern: /\bturquie\b/i, origin: 'Moyen-Orient' },
      { pattern: /\biran\b/i, origin: 'Moyen-Orient' },
      { pattern: /\bafrique\b/i, origin: 'Afrique' },
      { pattern: /\basie\b/i, origin: 'Asie' },
      { pattern: /\bsri lanka\b/i, origin: 'Sri Lanka' },
      { pattern: /\bthaïlande\b/i, origin: 'Asie du Sud-Est' },
      { pattern: /\bvietnam\b/i, origin: 'Asie du Sud-Est' },
      { pattern: /\bjamaïque\b/i, origin: 'Caraïbes' },
      { pattern: /\bantilles\b/i, origin: 'Caraïbes' },
      { pattern: /\bbrésil\b/i, origin: 'Amérique' },
      { pattern: /\bpérou\b/i, origin: 'Amérique' },
      { pattern: /\béthiopie\b/i, origin: 'Afrique' }
    ];

    for (const { pattern, origin } of countryPatterns) {
      if (pattern.test(origineHistoire)) {
        origins.add(origin);
      }
    }
  }

  return Array.from(origins);
}

function extractTasteCategories(categories: string[]): string[] {
  return categories.filter(cat =>
    TASTE_CATEGORIES.includes(cat.toLowerCase()) ||
    cat.toLowerCase() === 'melange'
  );
}

async function enrichSpiceFilters() {
  console.log('🌶️ Enrichissement des filtres d\'épices...\n');

  const { data: spices, error } = await supabase
    .from('spices')
    .select('id, name_fr, categories, utilisation_aliments_fr, origine_histoire_fr, origin, used_with')
    .eq('is_published', true);

  if (error) {
    console.error('Erreur:', error);
    return;
  }

  const typedSpices = spices as Spice[];
  console.log(`📊 ${typedSpices.length} épices trouvées\n`);

  let updatedCount = 0;
  let errorCount = 0;

  for (const spice of typedSpices) {
    const updates: {
      used_with?: UsedWith;
      origin?: string[];
      categories?: string[];
    } = {};

    // Enrichir used_with à partir de utilisation_aliments_fr
    if (spice.utilisation_aliments_fr && spice.utilisation_aliments_fr.length > 0) {
      const usedWith = extractUsedWith(spice.utilisation_aliments_fr);
      const hasData = Object.values(usedWith).some(arr => arr.length > 0);

      if (hasData) {
        updates.used_with = usedWith;
      }
    }

    // Enrichir origin à partir de categories et origine_histoire_fr
    const categories = spice.categories || [];
    const origins = extractOrigins(categories, spice.origine_histoire_fr);

    if (origins.length > 0) {
      updates.origin = origins;
    }

    // Nettoyer categories pour ne garder que les goûts
    const tasteCategories = extractTasteCategories(categories);
    if (tasteCategories.length > 0 && tasteCategories.length !== categories.length) {
      // Garder les categories de goût + melange
      updates.categories = tasteCategories;
    }

    // Mettre à jour si nécessaire
    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('spices')
        .update(updates)
        .eq('id', spice.id);

      if (updateError) {
        console.error(`❌ Erreur pour ${spice.name_fr}:`, updateError.message);
        errorCount++;
      } else {
        console.log(`✅ ${spice.name_fr}`);
        if (updates.origin) console.log(`   Origin: ${updates.origin.join(', ')}`);
        if (updates.used_with) {
          const foods = Object.entries(updates.used_with)
            .filter(([_, arr]) => arr.length > 0)
            .map(([key, arr]) => `${key}(${arr.length})`)
            .join(', ');
          if (foods) console.log(`   Used with: ${foods}`);
        }
        updatedCount++;
      }
    }
  }

  console.log(`\n📊 Résumé:`);
  console.log(`   - ${updatedCount} épices mises à jour`);
  console.log(`   - ${errorCount} erreurs`);
}

enrichSpiceFilters().catch(console.error);
