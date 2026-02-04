-- Update FAQ for mozza-burger recipe
UPDATE recipes
SET faq = $JSON$[
  {
    "question_fr": "Quels sont les ingrédients typiques d'un mozza burger?",
    "answer_fr": "Un mozza burger comprend généralement une galette de bœuf, du fromage mozzarella, un pain à burger, de la laitue, de la tomate, de l'oignon, des cornichons et des condiments comme la mayonnaise, le ketchup ou une sauce burger.",
    "question_en": "What are the typical ingredients in a popular mozza burger?",
    "answer_en": "A popular mozza burger typically includes a beef patty, mozzarella cheese, burger bun, lettuce, tomato, onion, pickles, and condiments such as mayonnaise, ketchup, or burger sauce."
  },
  {
    "question_fr": "Valeurs nutritionnelles d'un mozza burger standard?",
    "answer_fr": "Un mozza burger standard contient environ 500 à 650 calories, 25 à 30 g de protéines, 35 à 45 g de glucides et 30 à 40 g de lipides, selon la taille de la portion et les garnitures.",
    "question_en": "Mozza burger nutrition facts for a standard serving?",
    "answer_en": "A standard mozza burger contains approximately 500–650 calories, 25–30 g of protein, 35–45 g of carbohydrates, and 30–40 g of fat, depending on portion size and toppings."
  },
  {
    "question_fr": "Quels accompagnements sont recommandés avec un mozza burger?",
    "answer_fr": "Les accompagnements populaires incluent les frites, les frites de patates douces, la salade de chou, les rondelles d'oignon, la salade verte ou les légumes grillés. Les options plus légères équilibrent la richesse du burger.",
    "question_en": "What sides are recommended with a mozza burger meal?",
    "answer_en": "Common sides include French fries, sweet potato fries, coleslaw, onion rings, green salad, or grilled vegetables. Lighter options balance the richness of the burger."
  },
  {
    "question_fr": "Comment faire un mozza burger maison facilement?",
    "answer_fr": "Assaisonnez le bœuf haché, formez des galettes et faites griller ou cuire à la poêle. Ajoutez le fromage mozzarella pendant la dernière minute pour le faire fondre. Assemblez sur des pains grillés avec laitue, tomate, oignon et sauce.",
    "question_en": "How to make a mozza burger at home with easy ingredients?",
    "answer_en": "Season ground beef, form patties, and grill or pan-cook. Add mozzarella cheese during the last minute to melt. Assemble on toasted buns with lettuce, tomato, onion, and sauce."
  }
]$JSON$,
updated_at = NOW()
WHERE slug = 'mozza-burger';

-- Also update the English translation if it exists
UPDATE recipe_translations
SET faq = $JSON$[
  {
    "question_fr": "Quels sont les ingrédients typiques d'un mozza burger?",
    "answer_fr": "Un mozza burger comprend généralement une galette de bœuf, du fromage mozzarella, un pain à burger, de la laitue, de la tomate, de l'oignon, des cornichons et des condiments comme la mayonnaise, le ketchup ou une sauce burger.",
    "question_en": "What are the typical ingredients in a popular mozza burger?",
    "answer_en": "A popular mozza burger typically includes a beef patty, mozzarella cheese, burger bun, lettuce, tomato, onion, pickles, and condiments such as mayonnaise, ketchup, or burger sauce."
  },
  {
    "question_fr": "Valeurs nutritionnelles d'un mozza burger standard?",
    "answer_fr": "Un mozza burger standard contient environ 500 à 650 calories, 25 à 30 g de protéines, 35 à 45 g de glucides et 30 à 40 g de lipides, selon la taille de la portion et les garnitures.",
    "question_en": "Mozza burger nutrition facts for a standard serving?",
    "answer_en": "A standard mozza burger contains approximately 500–650 calories, 25–30 g of protein, 35–45 g of carbohydrates, and 30–40 g of fat, depending on portion size and toppings."
  },
  {
    "question_fr": "Quels accompagnements sont recommandés avec un mozza burger?",
    "answer_fr": "Les accompagnements populaires incluent les frites, les frites de patates douces, la salade de chou, les rondelles d'oignon, la salade verte ou les légumes grillés. Les options plus légères équilibrent la richesse du burger.",
    "question_en": "What sides are recommended with a mozza burger meal?",
    "answer_en": "Common sides include French fries, sweet potato fries, coleslaw, onion rings, green salad, or grilled vegetables. Lighter options balance the richness of the burger."
  },
  {
    "question_fr": "Comment faire un mozza burger maison facilement?",
    "answer_fr": "Assaisonnez le bœuf haché, formez des galettes et faites griller ou cuire à la poêle. Ajoutez le fromage mozzarella pendant la dernière minute pour le faire fondre. Assemblez sur des pains grillés avec laitue, tomate, oignon et sauce.",
    "question_en": "How to make a mozza burger at home with easy ingredients?",
    "answer_en": "Season ground beef, form patties, and grill or pan-cook. Add mozzarella cheese during the last minute to melt. Assemble on toasted buns with lettuce, tomato, onion, and sauce."
  }
]$JSON$
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'mozza-burger');
