// BBQ Party Calculator — Data & Calculation Logic

export type AppetiteLevel = 'light' | 'average' | 'hearty';
export type Unit = 'kg' | 'lbs';

export interface MeatOption {
  id: string;
  name: string;
  emoji: string;
  category: 'beef' | 'pork' | 'poultry' | 'seafood' | 'other';
  // Grams per person (raw weight, average appetite)
  gramsPerPerson: number;
  description: string;
  tip: string;
}

export interface SideOption {
  id: string;
  name: string;
  emoji: string;
  // Grams per person (average appetite)
  gramsPerPerson: number;
  unit: string; // display unit: "g", "ears", "buns", etc.
  isCountable: boolean; // true = ears of corn, buns, etc.
  countPerPerson?: number; // if countable
}

export interface DrinkOption {
  id: string;
  name: string;
  emoji: string;
  mlPerPerson: number; // ml per person for a 3-4 hour party
  unit: string; // "cans", "bottles", "L"
  containerMl: number; // size of one unit (330ml can, 750ml bottle, etc.)
}

export interface PartyResult {
  guests: number;
  appetiteLevel: AppetiteLevel;
  meats: { option: MeatOption; totalGrams: number; totalKg: number; totalLbs: number }[];
  sides: { option: SideOption; totalGrams: number; totalKg: number; totalLbs: number; totalCount?: number }[];
  drinks: { option: DrinkOption; totalMl: number; totalUnits: number }[];
  totalMeatPerPersonGrams: number;
  totalMeatPerPersonKg: number;
  totalMeatPerPersonLbs: number;
}

// --- Appetite multipliers ---
const APPETITE_MULTIPLIER: Record<AppetiteLevel, number> = {
  light: 0.7,   // kids party, light eaters, lots of sides
  average: 1.0, // standard BBQ
  hearty: 1.4,  // big eaters, meat-heavy, game day
};

export const APPETITE_LABELS: Record<AppetiteLevel, { label: string; description: string }> = {
  light:   { label: 'Light', description: 'Kids, light eaters, lots of sides' },
  average: { label: 'Average', description: 'Standard BBQ with good variety' },
  hearty:  { label: 'Hearty', description: 'Big eaters, meat lovers, game day' },
};

// --- Meat Options ---
// Based on standard catering guidelines: 200-250g (1/2 lb) raw meat per person average

export const MEAT_OPTIONS: MeatOption[] = [
  {
    id: 'burgers',
    name: 'Burger Patties',
    emoji: '🍔',
    category: 'beef',
    gramsPerPerson: 230, // ~2 patties per person (115g each)
    description: '2 quarter-pound patties per person',
    tip: 'Use 80/20 ground beef for the juiciest burgers. Make patties slightly larger than the bun — they shrink 25% on the grill.',
  },
  {
    id: 'steaks',
    name: 'Steaks',
    emoji: '🥩',
    category: 'beef',
    gramsPerPerson: 280, // ~10 oz steak per person
    description: 'Ribeye, NY Strip, or Sirloin',
    tip: 'Buy 1 steak per person (10-12 oz). Let steaks reach room temperature 30 min before grilling.',
  },
  {
    id: 'ribs',
    name: 'Ribs',
    emoji: '🍖',
    category: 'pork',
    gramsPerPerson: 450, // ribs have a lot of bone weight
    description: 'Baby back or spare ribs (bone-in)',
    tip: 'Plan ½ rack of baby back ribs or ⅓ rack of spare ribs per person. The bone accounts for ~50% of the weight.',
  },
  {
    id: 'hot-dogs',
    name: 'Hot Dogs / Sausages',
    emoji: '🌭',
    category: 'pork',
    gramsPerPerson: 200, // ~2 sausages
    description: '2 sausages or hot dogs per person',
    tip: 'Always have hot dogs available — they\'re a crowd-pleaser for kids and adults alike.',
  },
  {
    id: 'pulled-pork',
    name: 'Pulled Pork',
    emoji: '🐷',
    category: 'pork',
    gramsPerPerson: 340, // raw pork shoulder loses ~40% weight
    description: 'Pork shoulder/butt (raw weight)',
    tip: 'Pork shoulder loses about 40% of its weight during cooking. Plan for ~150g (⅓ lb) cooked per person.',
  },
  {
    id: 'chicken-breast',
    name: 'Chicken Breasts',
    emoji: '🍗',
    category: 'poultry',
    gramsPerPerson: 200, // 1 large breast
    description: '1 large breast per person',
    tip: 'Pound thick breasts to even thickness or butterfly them for even cooking.',
  },
  {
    id: 'chicken-wings',
    name: 'Chicken Wings',
    emoji: '🍗',
    category: 'poultry',
    gramsPerPerson: 340, // ~6-8 wings
    description: '6-8 wings per person',
    tip: 'Wings are addictive — if they\'re the main protein, plan 10-12 per person.',
  },
  {
    id: 'chicken-thighs',
    name: 'Chicken Thighs',
    emoji: '🍗',
    category: 'poultry',
    gramsPerPerson: 250, // 2-3 thighs
    description: '2-3 thighs per person (bone-in)',
    tip: 'Bone-in, skin-on thighs are the most forgiving chicken cut on the grill.',
  },
  {
    id: 'salmon',
    name: 'Salmon Fillets',
    emoji: '🐟',
    category: 'seafood',
    gramsPerPerson: 200, // ~7 oz fillet
    description: '1 fillet per person (6-8 oz)',
    tip: 'Keep the skin on for grilling — it prevents sticking and adds flavor.',
  },
  {
    id: 'shrimp',
    name: 'Shrimp',
    emoji: '🦐',
    category: 'seafood',
    gramsPerPerson: 170, // ~6 oz
    description: '6 oz per person (peeled weight)',
    tip: 'Use large or jumbo shrimp (16-20 count) for easy grilling. Skewer them!',
  },
];

// --- Side Dishes ---

export const SIDE_OPTIONS: SideOption[] = [
  { id: 'buns', name: 'Burger/Hot Dog Buns', emoji: '🍞', gramsPerPerson: 0, unit: 'buns', isCountable: true, countPerPerson: 2 },
  { id: 'corn', name: 'Corn on the Cob', emoji: '🌽', gramsPerPerson: 0, unit: 'ears', isCountable: true, countPerPerson: 1 },
  { id: 'coleslaw', name: 'Coleslaw', emoji: '🥗', gramsPerPerson: 120, unit: 'g', isCountable: false },
  { id: 'potato-salad', name: 'Potato Salad', emoji: '🥔', gramsPerPerson: 150, unit: 'g', isCountable: false },
  { id: 'baked-beans', name: 'Baked Beans', emoji: '🫘', gramsPerPerson: 120, unit: 'g', isCountable: false },
  { id: 'green-salad', name: 'Green Salad', emoji: '🥬', gramsPerPerson: 80, unit: 'g', isCountable: false },
  { id: 'mac-cheese', name: 'Mac & Cheese', emoji: '🧀', gramsPerPerson: 150, unit: 'g', isCountable: false },
  { id: 'chips', name: 'Chips / Snacks', emoji: '🍟', gramsPerPerson: 60, unit: 'g', isCountable: false },
  { id: 'bread', name: 'Bread / Rolls', emoji: '🥖', gramsPerPerson: 0, unit: 'rolls', isCountable: true, countPerPerson: 2 },
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', gramsPerPerson: 200, unit: 'g', isCountable: false },
];

// --- Drinks ---

export const DRINK_OPTIONS: DrinkOption[] = [
  { id: 'beer', name: 'Beer', emoji: '🍺', mlPerPerson: 1000, unit: 'cans (12 oz)', containerMl: 355 },
  { id: 'soda', name: 'Soda / Soft Drinks', emoji: '🥤', mlPerPerson: 700, unit: 'cans (12 oz)', containerMl: 355 },
  { id: 'water', name: 'Water Bottles', emoji: '💧', mlPerPerson: 750, unit: 'bottles (500ml)', containerMl: 500 },
  { id: 'juice', name: 'Juice', emoji: '🧃', mlPerPerson: 400, unit: 'cups', containerMl: 250 },
  { id: 'wine', name: 'Wine', emoji: '🍷', mlPerPerson: 375, unit: 'bottles', containerMl: 750 },
  { id: 'lemonade', name: 'Lemonade', emoji: '🍋', mlPerPerson: 500, unit: 'cups', containerMl: 250 },
];

// --- Calculation ---

export function calculateParty(
  guests: number,
  appetite: AppetiteLevel,
  selectedMeatIds: string[],
  selectedSideIds: string[],
  selectedDrinkIds: string[],
): PartyResult {
  const multiplier = APPETITE_MULTIPLIER[appetite];

  // If multiple meats selected, reduce per-person quantity (people eat a bit of each)
  const meatCount = selectedMeatIds.length;
  const meatReduction = meatCount > 1 ? 1 / Math.pow(meatCount, 0.45) : 1;
  // e.g., 2 meats = ~0.73x each, 3 meats = ~0.63x each, 4 meats = ~0.56x each

  const meats = selectedMeatIds.map(id => {
    const option = MEAT_OPTIONS.find(m => m.id === id)!;
    const perPerson = option.gramsPerPerson * multiplier * meatReduction;
    const totalGrams = Math.round(perPerson * guests);
    return {
      option,
      totalGrams,
      totalKg: Math.round(totalGrams / 100) / 10, // round to 1 decimal
      totalLbs: Math.round(totalGrams / 453.6 * 10) / 10,
    };
  });

  const sides = selectedSideIds.map(id => {
    const option = SIDE_OPTIONS.find(s => s.id === id)!;
    if (option.isCountable && option.countPerPerson) {
      const count = Math.ceil(option.countPerPerson * multiplier * guests);
      return {
        option,
        totalGrams: 0,
        totalKg: 0,
        totalLbs: 0,
        totalCount: count,
      };
    }
    const perPerson = option.gramsPerPerson * multiplier;
    const totalGrams = Math.round(perPerson * guests);
    return {
      option,
      totalGrams,
      totalKg: Math.round(totalGrams / 100) / 10,
      totalLbs: Math.round(totalGrams / 453.6 * 10) / 10,
    };
  });

  const drinks = selectedDrinkIds.map(id => {
    const option = DRINK_OPTIONS.find(d => d.id === id)!;
    const totalMl = Math.round(option.mlPerPerson * guests);
    const totalUnits = Math.ceil(totalMl / option.containerMl);
    return { option, totalMl, totalUnits };
  });

  const totalMeatGrams = meats.reduce((sum, m) => sum + m.totalGrams, 0);
  const perPersonGrams = guests > 0 ? Math.round(totalMeatGrams / guests) : 0;

  return {
    guests,
    appetiteLevel: appetite,
    meats,
    sides,
    drinks,
    totalMeatPerPersonGrams: perPersonGrams,
    totalMeatPerPersonKg: Math.round(perPersonGrams / 100) / 10,
    totalMeatPerPersonLbs: Math.round(perPersonGrams / 453.6 * 10) / 10,
  };
}

export function formatWeight(grams: number, unit: Unit): string {
  if (unit === 'kg') {
    const kg = Math.round(grams / 100) / 10;
    return `${kg} kg`;
  }
  const lbs = Math.round(grams / 453.6 * 10) / 10;
  return `${lbs} lbs`;
}
