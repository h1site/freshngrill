// BBQ Cooking Calculator — Data Model & Calculation Logic

export type MeatType =
  | 'steak' | 'ribs-baby-back' | 'ribs-spare'
  | 'chicken-breast' | 'chicken-thigh' | 'chicken-whole'
  | 'pork-chops' | 'burgers' | 'sausages'
  | 'salmon' | 'pork-tenderloin' | 'lamb-chops' | 'shrimp';

export type Doneness = 'rare' | 'medium-rare' | 'medium' | 'medium-well' | 'well-done';

export type GrillTemp = 'low' | 'medium' | 'high' | 'searing';

export interface ThicknessOption {
  label: string;
  valueInches: number;
}

export interface CookingStep {
  id: string;
  label: string;
  durationSeconds: number;
  type: 'cook' | 'flip' | 'rest' | 'check';
  alertSound: 'flip' | 'done' | 'check' | null;
  description: string;
}

export interface CookingResult {
  totalCookTimeSeconds: number;
  totalRestTimeSeconds: number;
  totalTimeSeconds: number;
  targetInternalTemp: number;
  steps: CookingStep[];
  tips: string[];
}

export interface MeatConfig {
  id: MeatType;
  name: string;
  emoji: string;
  supportsDoneness: boolean;
  availableDoneness: Doneness[];
  thicknessOptions: ThicknessOption[];
  recommendedGrillTemp: GrillTemp;
  description: string;
}

// --- Constants ---

export const GRILL_TEMPS: Record<GrillTemp, { min: number; max: number; label: string }> = {
  low:     { min: 250, max: 300, label: 'Low Heat (250–300°F)' },
  medium:  { min: 350, max: 400, label: 'Medium (350–400°F)' },
  high:    { min: 450, max: 500, label: 'High (450–500°F)' },
  searing: { min: 500, max: 600, label: 'Searing (500–600°F)' },
};

export const INTERNAL_TEMPS: Record<Doneness, number> = {
  'rare':        125,
  'medium-rare': 135,
  'medium':      145,
  'medium-well': 155,
  'well-done':   165,
};

export const DONENESS_LABELS: Record<Doneness, string> = {
  'rare':        'Rare',
  'medium-rare': 'Medium Rare',
  'medium':      'Medium',
  'medium-well': 'Medium Well',
  'well-done':   'Well Done',
};

export const DONENESS_COLORS: Record<Doneness, string> = {
  'rare':        '#dc2626',
  'medium-rare': '#ef4444',
  'medium':      '#f97316',
  'medium-well': '#a16207',
  'well-done':   '#78350f',
};

// --- Meat Configurations ---

export const MEAT_OPTIONS: MeatConfig[] = [
  {
    id: 'steak',
    name: 'Steak',
    emoji: '🥩',
    supportsDoneness: true,
    availableDoneness: ['rare', 'medium-rare', 'medium', 'medium-well', 'well-done'],
    thicknessOptions: [
      { label: '¾ inch', valueInches: 0.75 },
      { label: '1 inch', valueInches: 1.0 },
      { label: '1¼ inches', valueInches: 1.25 },
      { label: '1½ inches', valueInches: 1.5 },
      { label: '2 inches', valueInches: 2.0 },
    ],
    recommendedGrillTemp: 'high',
    description: 'Ribeye, NY Strip, Filet Mignon, T-Bone',
  },
  {
    id: 'burgers',
    name: 'Burgers',
    emoji: '🍔',
    supportsDoneness: true,
    availableDoneness: ['medium-rare', 'medium', 'medium-well', 'well-done'],
    thicknessOptions: [
      { label: '½ inch', valueInches: 0.5 },
      { label: '¾ inch', valueInches: 0.75 },
      { label: '1 inch', valueInches: 1.0 },
    ],
    recommendedGrillTemp: 'high',
    description: 'Beef patties, smash burgers',
  },
  {
    id: 'ribs-baby-back',
    name: 'Baby Back Ribs',
    emoji: '🍖',
    supportsDoneness: false,
    availableDoneness: ['well-done'],
    thicknessOptions: [
      { label: 'Standard rack', valueInches: 1.0 },
    ],
    recommendedGrillTemp: 'low',
    description: 'Low & slow, fall-off-the-bone',
  },
  {
    id: 'ribs-spare',
    name: 'Spare Ribs',
    emoji: '🍖',
    supportsDoneness: false,
    availableDoneness: ['well-done'],
    thicknessOptions: [
      { label: 'Standard rack', valueInches: 1.0 },
    ],
    recommendedGrillTemp: 'low',
    description: 'Meaty, rich flavor',
  },
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    emoji: '🍗',
    supportsDoneness: false,
    availableDoneness: ['well-done'],
    thicknessOptions: [
      { label: '½ inch (pounded)', valueInches: 0.5 },
      { label: '¾ inch', valueInches: 0.75 },
      { label: '1 inch', valueInches: 1.0 },
      { label: '1½ inches', valueInches: 1.5 },
    ],
    recommendedGrillTemp: 'medium',
    description: 'Boneless, skinless',
  },
  {
    id: 'chicken-thigh',
    name: 'Chicken Thighs',
    emoji: '🍗',
    supportsDoneness: false,
    availableDoneness: ['well-done'],
    thicknessOptions: [
      { label: 'Boneless', valueInches: 0.75 },
      { label: 'Bone-in', valueInches: 1.25 },
    ],
    recommendedGrillTemp: 'medium',
    description: 'Bone-in or boneless, juicy dark meat',
  },
  {
    id: 'chicken-whole',
    name: 'Whole Chicken',
    emoji: '🐔',
    supportsDoneness: false,
    availableDoneness: ['well-done'],
    thicknessOptions: [
      { label: '3–4 lbs', valueInches: 1.0 },
      { label: '4–5 lbs', valueInches: 1.25 },
      { label: '5–6 lbs', valueInches: 1.5 },
    ],
    recommendedGrillTemp: 'medium',
    description: 'Beer can, spatchcock, rotisserie',
  },
  {
    id: 'pork-chops',
    name: 'Pork Chops',
    emoji: '🥓',
    supportsDoneness: true,
    availableDoneness: ['medium', 'medium-well', 'well-done'],
    thicknessOptions: [
      { label: '¾ inch', valueInches: 0.75 },
      { label: '1 inch', valueInches: 1.0 },
      { label: '1½ inches', valueInches: 1.5 },
    ],
    recommendedGrillTemp: 'medium',
    description: 'Bone-in or boneless',
  },
  {
    id: 'pork-tenderloin',
    name: 'Pork Tenderloin',
    emoji: '🥓',
    supportsDoneness: true,
    availableDoneness: ['medium', 'medium-well', 'well-done'],
    thicknessOptions: [
      { label: '1½ inches (small)', valueInches: 1.5 },
      { label: '2 inches (medium)', valueInches: 2.0 },
      { label: '2½ inches (large)', valueInches: 2.5 },
    ],
    recommendedGrillTemp: 'medium',
    description: 'Whole tenderloin, indirect heat',
  },
  {
    id: 'sausages',
    name: 'Sausages',
    emoji: '🌭',
    supportsDoneness: false,
    availableDoneness: ['well-done'],
    thicknessOptions: [
      { label: 'Thin links', valueInches: 0.75 },
      { label: 'Bratwurst', valueInches: 1.0 },
      { label: 'Italian (thick)', valueInches: 1.25 },
    ],
    recommendedGrillTemp: 'medium',
    description: 'Bratwurst, Italian, hot dogs',
  },
  {
    id: 'salmon',
    name: 'Salmon',
    emoji: '🐟',
    supportsDoneness: true,
    availableDoneness: ['medium-rare', 'medium', 'medium-well', 'well-done'],
    thicknessOptions: [
      { label: '½ inch', valueInches: 0.5 },
      { label: '¾ inch', valueInches: 0.75 },
      { label: '1 inch', valueInches: 1.0 },
      { label: '1½ inches', valueInches: 1.5 },
    ],
    recommendedGrillTemp: 'medium',
    description: 'Fillets, skin-on or skinless',
  },
  {
    id: 'lamb-chops',
    name: 'Lamb Chops',
    emoji: '🍖',
    supportsDoneness: true,
    availableDoneness: ['rare', 'medium-rare', 'medium', 'medium-well', 'well-done'],
    thicknessOptions: [
      { label: '¾ inch', valueInches: 0.75 },
      { label: '1 inch', valueInches: 1.0 },
      { label: '1½ inches', valueInches: 1.5 },
    ],
    recommendedGrillTemp: 'high',
    description: 'Rib chops, loin chops',
  },
  {
    id: 'shrimp',
    name: 'Shrimp',
    emoji: '🦐',
    supportsDoneness: false,
    availableDoneness: ['well-done'],
    thicknessOptions: [
      { label: 'Medium (31-40)', valueInches: 0.5 },
      { label: 'Large (21-30)', valueInches: 0.75 },
      { label: 'Jumbo (16-20)', valueInches: 1.0 },
    ],
    recommendedGrillTemp: 'high',
    description: 'Skewered or in a basket',
  },
];

// --- Base cooking times (seconds per side) at 1 inch, high heat (450-500F) ---
// For meats without sides (ribs, whole chicken), this is total cook time segments

type BaseTimeTable = Partial<Record<Doneness, number>>;

const BASE_TIMES: Record<MeatType, BaseTimeTable> = {
  'steak':           { 'rare': 120, 'medium-rare': 150, 'medium': 180, 'medium-well': 210, 'well-done': 240 },
  'burgers':         { 'medium-rare': 150, 'medium': 180, 'medium-well': 210, 'well-done': 240 },
  'ribs-baby-back':  { 'well-done': 10800 }, // 3 hours total (low & slow)
  'ribs-spare':      { 'well-done': 14400 }, // 4 hours total
  'chicken-breast':  { 'well-done': 360 },   // per side
  'chicken-thigh':   { 'well-done': 420 },   // per side
  'chicken-whole':   { 'well-done': 5400 },  // 90 min total
  'pork-chops':      { 'medium': 210, 'medium-well': 240, 'well-done': 270 },
  'pork-tenderloin': { 'medium': 900, 'medium-well': 1080, 'well-done': 1200 }, // total (rolled/indirect)
  'sausages':        { 'well-done': 300 },   // per side
  'salmon':          { 'medium-rare': 150, 'medium': 180, 'medium-well': 210, 'well-done': 240 },
  'lamb-chops':      { 'rare': 120, 'medium-rare': 150, 'medium': 180, 'medium-well': 210, 'well-done': 240 },
  'shrimp':          { 'well-done': 90 },    // per side
};

// Meats that use total time (no flip pattern)
const TOTAL_TIME_MEATS: MeatType[] = ['ribs-baby-back', 'ribs-spare', 'chicken-whole', 'pork-tenderloin'];

// Reference thickness for base times (inches)
const REFERENCE_THICKNESS = 1.0;

// Reference grill temp midpoint
const REFERENCE_TEMP = 475; // midpoint of high

// --- Calculation ---

function getGrillTempMidpoint(temp: GrillTemp): number {
  const t = GRILL_TEMPS[temp];
  return (t.min + t.max) / 2;
}

function scaleByThickness(baseSeconds: number, actualInches: number): number {
  const ratio = actualInches / REFERENCE_THICKNESS;
  return Math.round(baseSeconds * Math.pow(ratio, 1.4));
}

function scaleByTemp(seconds: number, grillTemp: GrillTemp): number {
  const actual = getGrillTempMidpoint(grillTemp);
  const factor = REFERENCE_TEMP / actual;
  return Math.round(seconds * factor);
}

function getRestTime(meatType: MeatType, thickness: number): number {
  if (['shrimp', 'sausages'].includes(meatType)) return 0;
  if (TOTAL_TIME_MEATS.includes(meatType)) return 600; // 10 min for large cuts
  if (thickness >= 1.5) return 600; // 10 min
  if (thickness >= 1.0) return 300; // 5 min
  return 180; // 3 min
}

function generateSteps(
  meatType: MeatType,
  perSideSeconds: number,
  restSeconds: number,
): CookingStep[] {
  // Ribs — 3-2-1 method for baby back, 3-2-1.5 for spare
  if (meatType === 'ribs-baby-back') {
    const phase1 = Math.round(perSideSeconds * 0.5);  // smoke unwrapped
    const phase2 = Math.round(perSideSeconds * 0.33); // wrapped
    const phase3 = perSideSeconds - phase1 - phase2;   // unwrapped glaze
    return [
      { id: 'smoke', label: 'Smoke Unwrapped', durationSeconds: phase1, type: 'cook', alertSound: null, description: 'Place ribs bone-side down on indirect heat. Close the lid and let the smoke do its magic.' },
      { id: 'wrap', label: 'Wrap in Foil', durationSeconds: phase2, type: 'flip', alertSound: 'flip', description: 'Wrap ribs tightly in aluminum foil with a splash of apple juice. Return to grill.' },
      { id: 'glaze', label: 'Unwrap & Glaze', durationSeconds: phase3, type: 'cook', alertSound: 'flip', description: 'Remove foil, brush with BBQ sauce. Cook until sticky and caramelized.' },
      { id: 'rest', label: 'Rest', durationSeconds: restSeconds, type: 'rest', alertSound: 'done', description: 'Let ribs rest loosely tented with foil. The juices will redistribute.' },
    ];
  }

  if (meatType === 'ribs-spare') {
    const phase1 = Math.round(perSideSeconds * 0.5);
    const phase2 = Math.round(perSideSeconds * 0.33);
    const phase3 = perSideSeconds - phase1 - phase2;
    return [
      { id: 'smoke', label: 'Smoke Unwrapped', durationSeconds: phase1, type: 'cook', alertSound: null, description: 'Place spare ribs bone-side down on indirect heat. Keep temp steady at 250°F.' },
      { id: 'wrap', label: 'Wrap in Foil', durationSeconds: phase2, type: 'flip', alertSound: 'flip', description: 'Wrap tightly in foil with butter and brown sugar. Return to grill.' },
      { id: 'glaze', label: 'Unwrap & Glaze', durationSeconds: phase3, type: 'cook', alertSound: 'flip', description: 'Remove foil, apply BBQ sauce generously. Let it set for a tacky finish.' },
      { id: 'rest', label: 'Rest', durationSeconds: restSeconds, type: 'rest', alertSound: 'done', description: 'Rest loosely tented with foil for 10 minutes before slicing.' },
    ];
  }

  // Whole chicken — indirect, no flipping
  if (meatType === 'chicken-whole') {
    const phase1 = Math.round(perSideSeconds * 0.7);
    const phase2 = perSideSeconds - phase1;
    return [
      { id: 'cook', label: 'Cook (Indirect)', durationSeconds: phase1, type: 'cook', alertSound: null, description: 'Place chicken on indirect heat, breast side up. Close lid and maintain steady temperature.' },
      { id: 'check', label: 'Check & Baste', durationSeconds: phase2, type: 'cook', alertSound: 'check', description: 'Baste with juices or butter. Continue cooking until internal temp reaches 165°F at the thickest part.' },
      { id: 'rest', label: 'Rest', durationSeconds: restSeconds, type: 'rest', alertSound: 'done', description: 'Tent with foil and rest 10 minutes. Juices will redistribute for perfect moisture.' },
    ];
  }

  // Pork tenderloin — sear then indirect
  if (meatType === 'pork-tenderloin') {
    const sear = 120; // 2 min sear
    const indirect = perSideSeconds - sear;
    return [
      { id: 'sear', label: 'Sear All Sides', durationSeconds: sear, type: 'cook', alertSound: null, description: 'Sear the tenderloin on all sides over direct high heat for a golden crust.' },
      { id: 'indirect', label: 'Cook (Indirect)', durationSeconds: indirect, type: 'flip', alertSound: 'flip', description: 'Move to indirect heat. Close lid and cook until internal temp reaches target.' },
      { id: 'rest', label: 'Rest', durationSeconds: restSeconds, type: 'rest', alertSound: 'done', description: 'Tent with foil and rest. Internal temp will rise 5–10°F during rest.' },
    ];
  }

  // Shrimp — quick cook, both sides
  if (meatType === 'shrimp') {
    return [
      { id: 'side1', label: 'Cook Side 1', durationSeconds: perSideSeconds, type: 'cook', alertSound: null, description: 'Place shrimp on hot grill. They\'ll turn pink from the bottom up.' },
      { id: 'flip', label: 'Flip & Cook Side 2', durationSeconds: perSideSeconds, type: 'flip', alertSound: 'flip', description: 'Flip each shrimp. Cook until fully pink and opaque. Don\'t overcook!' },
    ];
  }

  // Sausages — roll on multiple sides
  if (meatType === 'sausages') {
    const perTurn = Math.round(perSideSeconds / 2);
    return [
      { id: 'side1', label: 'Cook Side 1', durationSeconds: perTurn, type: 'cook', alertSound: null, description: 'Place sausages on the grill. Don\'t prick them — keep the juices in!' },
      { id: 'turn1', label: 'Quarter Turn', durationSeconds: perTurn, type: 'flip', alertSound: 'flip', description: 'Roll sausages a quarter turn for even browning.' },
      { id: 'turn2', label: 'Half Turn', durationSeconds: perTurn, type: 'flip', alertSound: 'flip', description: 'Roll again. Looking for golden-brown color all around.' },
      { id: 'turn3', label: 'Final Turn', durationSeconds: perTurn, type: 'flip', alertSound: 'flip', description: 'Last turn. Internal temp should reach 160°F for pork sausages, 165°F for chicken.' },
    ];
  }

  // Salmon — mostly skin side down
  if (meatType === 'salmon') {
    const skinSide = Math.round(perSideSeconds * 1.4);
    const fleshSide = Math.round(perSideSeconds * 0.6);
    return [
      { id: 'skin', label: 'Skin Side Down', durationSeconds: skinSide, type: 'cook', alertSound: null, description: 'Place skin-side down on oiled grates. Don\'t touch it — let the skin crisp up.' },
      { id: 'flip', label: 'Flip (Flesh Side)', durationSeconds: fleshSide, type: 'flip', alertSound: 'flip', description: 'Gently flip. Cook briefly until desired doneness. The center should be slightly translucent for medium.' },
      ...(restSeconds > 0 ? [{
        id: 'rest', label: 'Rest', durationSeconds: restSeconds, type: 'rest' as const, alertSound: 'done' as const, description: 'Let rest for a few minutes. Squeeze fresh lemon on top.',
      }] : []),
    ];
  }

  // Default: two-sided cook (steak, burgers, pork chops, chicken breast/thigh, lamb chops)
  const steps: CookingStep[] = [
    { id: 'side1', label: 'Cook Side 1', durationSeconds: perSideSeconds, type: 'cook', alertSound: null, description: getFirstSideDescription(meatType) },
    { id: 'flip', label: 'Flip & Cook Side 2', durationSeconds: perSideSeconds, type: 'flip', alertSound: 'flip', description: getSecondSideDescription(meatType) },
  ];

  if (restSeconds > 0) {
    steps.push({
      id: 'rest', label: 'Rest', durationSeconds: restSeconds, type: 'rest', alertSound: 'done',
      description: 'Remove from grill and let rest. The internal temperature will continue to rise 5°F while resting.',
    });
  }

  return steps;
}

function getFirstSideDescription(meat: MeatType): string {
  switch (meat) {
    case 'steak': return 'Place steak on the hot grill. Don\'t touch it — let the sear develop. You\'ll hear a satisfying sizzle.';
    case 'burgers': return 'Place patties on the grill. Press down gently once, then leave them alone. Don\'t press the juices out!';
    case 'pork-chops': return 'Place chops on the grill over direct heat. Let them sear undisturbed for a golden crust.';
    case 'chicken-breast': return 'Place chicken on oiled grates over medium heat. Close the lid for even cooking.';
    case 'chicken-thigh': return 'Place thighs skin-side down on medium heat. The skin will crisp up beautifully.';
    case 'lamb-chops': return 'Place lamb chops on the hot grill. The high heat will create a beautiful crust on the outside.';
    default: return 'Place on the hot grill and cook undisturbed.';
  }
}

function getSecondSideDescription(meat: MeatType): string {
  switch (meat) {
    case 'steak': return 'Flip once! Cook the second side. For crosshatch marks, rotate 45° halfway through.';
    case 'burgers': return 'Flip once. Add cheese now if you want it melted. Close the lid for 30 seconds to melt.';
    case 'pork-chops': return 'Flip and cook the other side. Brush with glaze if desired.';
    case 'chicken-breast': return 'Flip and cook until internal temperature reaches 165°F. No pink remaining.';
    case 'chicken-thigh': return 'Flip and cook until internal temp reaches 175°F. Thighs are best at higher temps.';
    case 'lamb-chops': return 'Flip and cook the second side. Lamb is best at medium-rare to medium (135–145°F).';
    default: return 'Flip and cook the other side until done.';
  }
}

function getTips(meatType: MeatType, doneness: Doneness): string[] {
  const tips: string[] = ['Always use a meat thermometer to verify doneness. Times are estimates based on typical conditions.'];

  switch (meatType) {
    case 'steak':
      tips.push('Let the steak come to room temperature 30 minutes before grilling.');
      tips.push('Pat dry with paper towels and season generously with salt and pepper.');
      if (doneness === 'rare' || doneness === 'medium-rare') {
        tips.push('For the best sear, make sure your grill is screaming hot before placing the steak.');
      }
      break;
    case 'burgers':
      tips.push('Use 80/20 ground beef for the juiciest burgers.');
      tips.push('Make an indent in the center of each patty to prevent puffing.');
      break;
    case 'ribs-baby-back':
    case 'ribs-spare':
      tips.push('Remove the membrane from the back of the ribs for better flavor penetration.');
      tips.push('The bend test: pick up the rack with tongs. When done, it should bend and crack slightly.');
      break;
    case 'chicken-breast':
      tips.push('Butterfly or pound thick breasts to even thickness for uniform cooking.');
      tips.push('Brine for 30 minutes in salt water for extra juiciness.');
      break;
    case 'chicken-thigh':
      tips.push('Chicken thighs are very forgiving — they stay juicy even slightly overcooked.');
      break;
    case 'chicken-whole':
      tips.push('Spatchcocking (removing the backbone) reduces cooking time by 30%.');
      tips.push('Use a two-zone fire: sear over direct, finish over indirect.');
      break;
    case 'pork-chops':
      tips.push('Brine pork chops for 1 hour for maximum juiciness.');
      tips.push('USDA now recommends 145°F for pork — slightly pink in the center is safe and delicious.');
      break;
    case 'salmon':
      tips.push('Oil the grates well to prevent sticking. Skin acts as a natural barrier.');
      tips.push('Use a cedar plank for smoky flavor — soak the plank for 1 hour first.');
      break;
    case 'lamb-chops':
      tips.push('Lamb pairs beautifully with rosemary, garlic, and mint.');
      tips.push('Let chops rest for 5 minutes — they go from good to incredible.');
      break;
    case 'sausages':
      tips.push('Never prick sausages — the casing keeps the juices sealed inside.');
      tips.push('Pre-cook thick sausages by simmering in beer for 10 minutes, then finish on the grill.');
      break;
    case 'shrimp':
      tips.push('Use skewers or a grill basket to prevent shrimp from falling through the grates.');
      tips.push('Shrimp cook incredibly fast — 2-3 minutes per side is all you need.');
      break;
  }

  return tips;
}

// --- Main calculation function ---

export function calculateCookingTime(
  meatType: MeatType,
  thickness: number,
  doneness: Doneness,
  grillTemp: GrillTemp,
): CookingResult {
  const meat = MEAT_OPTIONS.find(m => m.id === meatType)!;
  const effectiveDoneness = meat.availableDoneness.includes(doneness)
    ? doneness
    : meat.availableDoneness[meat.availableDoneness.length - 1];

  const baseTime = BASE_TIMES[meatType][effectiveDoneness] || 180;
  const isTotalTime = TOTAL_TIME_MEATS.includes(meatType);

  let adjustedTime: number;

  if (isTotalTime) {
    // For ribs, whole chicken, tenderloin — scale total time
    adjustedTime = scaleByThickness(baseTime, thickness);
    adjustedTime = scaleByTemp(adjustedTime, grillTemp);
  } else {
    // Per-side time — scale by thickness and temp
    adjustedTime = scaleByThickness(baseTime, thickness);
    adjustedTime = scaleByTemp(adjustedTime, grillTemp);
  }

  const restTime = getRestTime(meatType, thickness);
  const steps = generateSteps(meatType, adjustedTime, restTime);

  const totalCookTimeSeconds = steps
    .filter(s => s.type !== 'rest')
    .reduce((sum, s) => sum + s.durationSeconds, 0);
  const totalRestTimeSeconds = steps
    .filter(s => s.type === 'rest')
    .reduce((sum, s) => sum + s.durationSeconds, 0);

  return {
    totalCookTimeSeconds,
    totalRestTimeSeconds,
    totalTimeSeconds: totalCookTimeSeconds + totalRestTimeSeconds,
    targetInternalTemp: INTERNAL_TEMPS[effectiveDoneness],
    steps,
    tips: getTips(meatType, effectiveDoneness),
  };
}

export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `0:${seconds.toString().padStart(2, '0')}`;
}
