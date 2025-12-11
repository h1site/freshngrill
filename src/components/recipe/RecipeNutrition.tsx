import { NutritionInfo } from '@/types/recipe';
import type { Locale } from '@/i18n/config';

interface Props {
  nutrition: NutritionInfo;
  locale?: Locale;
}

export default function RecipeNutrition({ nutrition, locale = 'fr' }: Props) {
  const isEN = locale === 'en';

  const items = isEN ? [
    { key: 'calories', label: 'Calories', unit: 'kcal' },
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Carbs', unit: 'g' },
    { key: 'fat', label: 'Fat', unit: 'g' },
    { key: 'fiber', label: 'Fiber', unit: 'g' },
    { key: 'sugar', label: 'Sugar', unit: 'g' },
    { key: 'sodium', label: 'Sodium', unit: 'mg' },
  ] : [
    { key: 'calories', label: 'Calories', unit: 'kcal' },
    { key: 'protein', label: 'Protéines', unit: 'g' },
    { key: 'carbs', label: 'Glucides', unit: 'g' },
    { key: 'fat', label: 'Lipides', unit: 'g' },
    { key: 'fiber', label: 'Fibres', unit: 'g' },
    { key: 'sugar', label: 'Sucres', unit: 'g' },
    { key: 'sodium', label: 'Sodium', unit: 'mg' },
  ];

  const perServing = isEN ? 'Per serving' : 'Par portion';

  const hasNutrition = items.some(
    (item) => nutrition[item.key as keyof NutritionInfo] !== undefined
  );

  if (!hasNutrition) {
    return null;
  }

  return (
    <div className="bg-black p-8 rounded-b-[5px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl tracking-wide text-white">
          Nutrition
        </h2>
        <div className="w-8 h-0.5 bg-[#F77313]" />
      </div>
      <p className="text-xs text-white/50 uppercase tracking-wider mb-6">{perServing}</p>

      <div className="space-y-3">
        {items.map((item) => {
          const value = nutrition[item.key as keyof NutritionInfo];
          if (value === undefined) return null;

          const isCalories = item.key === 'calories';

          return (
            <div
              key={item.key}
              className={`flex items-center justify-between py-3 ${
                isCalories
                  ? 'bg-[#F77313] text-white px-4 -mx-4'
                  : 'border-b border-white/20'
              }`}
            >
              <span className={`text-sm ${isCalories ? 'text-white' : 'text-white/70'}`}>
                {item.label}
              </span>
              <span className={`font-bold ${isCalories ? 'text-white text-xl' : 'text-white'}`}>
                {value}
                <span className={`text-xs font-normal ml-1 ${isCalories ? 'text-white/80' : 'text-white/50'}`}>
                  {item.unit}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
