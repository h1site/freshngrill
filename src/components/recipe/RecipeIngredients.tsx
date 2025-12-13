'use client';

import { useState } from 'react';
import { IngredientGroup } from '@/types/recipe';
import { Minus, Plus, Check } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface Props {
  ingredients: IngredientGroup[];
  servings: number;
  servingsUnit?: string;
  locale?: Locale;
}

export default function RecipeIngredients({
  ingredients,
  servings: initialServings,
  servingsUnit,
  locale = 'fr',
}: Props) {
  const isEN = locale === 'en';
  const defaultServingsUnit = isEN ? 'servings' : 'portions';
  const ingredientsTitle = isEN ? 'Ingredients' : 'Ingrédients';
  const servingsLabel = isEN ? 'Servings' : 'Portions';
  const [servings, setServings] = useState(initialServings);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const multiplier = servings / initialServings;

  const adjustQuantity = (quantity: string | undefined): string => {
    if (!quantity) return '';

    // Essayer de parser la quantité
    const match = quantity.match(/^([\d.,/]+)\s*(.*)$/);
    if (!match) return quantity;

    let num = match[1];
    const rest = match[2];

    // Gérer les fractions
    if (num.includes('/')) {
      const [numerator, denominator] = num.split('/').map(Number);
      num = String(numerator / denominator);
    }

    const value = parseFloat(num.replace(',', '.')) * multiplier;
    const formatted =
      value % 1 === 0 ? value.toString() : value.toFixed(1).replace('.0', '');

    return `${formatted}${rest ? ' ' + rest : ''}`;
  };

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="bg-neutral-50 p-8 rounded-t-[5px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl tracking-wide text-black">{ingredientsTitle}</h2>
        <div className="w-12 h-0.5 bg-[#F77313]" />
      </div>

      {/* Ajustement des portions */}
      <div className="flex items-center justify-between border border-neutral-200 bg-white p-4 mb-8">
        <span className="text-neutral-500 text-sm uppercase tracking-wider">{servingsLabel}</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setServings(Math.max(1, servings - 1))}
            className="w-10 h-10 border border-neutral-300 hover:border-[#F77313] hover:text-[#F77313] text-neutral-700 flex items-center justify-center transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-2xl font-display text-black w-10 text-center">
            {servings}
          </span>
          <button
            onClick={() => setServings(servings + 1)}
            className="w-10 h-10 border border-neutral-300 hover:border-[#F77313] hover:text-[#F77313] text-neutral-700 flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Liste des ingrédients */}
      <div className="space-y-6">
        {ingredients.map((group, groupIndex) => {
          // Support both "title" and "group" field names
          const groupTitle = group.title || (group as any).group;

          return (
            <div key={groupIndex}>
              {groupTitle && (
                <h3 className="text-xs font-medium text-[#F77313] uppercase tracking-widest mb-4 pb-2 border-b border-neutral-200">
                  {groupTitle}
                </h3>
              )}

              <ul className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  const id = `${groupIndex}-${itemIndex}`;
                  const isChecked = checkedItems.has(id);

                  // Support both object format and string format
                  const isStringItem = typeof item === 'string';
                  const itemText = isStringItem ? item : null;
                  const itemObj = isStringItem ? null : item;

                  return (
                    <li key={id}>
                      <button
                        onClick={() => toggleCheck(id)}
                        className={`w-full flex items-start gap-3 py-3 px-2 transition-all text-left border-b border-neutral-200 hover:bg-white ${
                          isChecked ? 'opacity-40' : ''
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                            isChecked
                              ? 'bg-[#F77313] text-white'
                              : 'border border-neutral-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </span>

                        <span className={`flex-1 ${isChecked ? 'line-through' : ''}`}>
                          {isStringItem ? (
                            // String format: "250 g de farine tout usage"
                            <span className="text-neutral-800">{itemText}</span>
                          ) : (
                            // Object format: { name, quantity, unit, note }
                            <>
                              {itemObj?.quantity && (
                                <span className="font-bold text-[#F77313] mr-2">
                                  {adjustQuantity(itemObj.quantity)}
                                </span>
                              )}
                              {itemObj?.unit && (
                                <span className="text-neutral-500 mr-1">{itemObj.unit}</span>
                              )}
                              <span className="text-neutral-800">
                                {itemObj?.name}
                              </span>
                              {itemObj?.note && (
                                <span className="text-sm text-neutral-400 ml-2">
                                  ({itemObj.note})
                                </span>
                              )}
                            </>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
