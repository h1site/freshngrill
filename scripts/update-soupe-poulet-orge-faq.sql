-- Update FAQ for soupe-poulet-orge recipe
UPDATE recipes
SET faq = $JSON$[
  {
    "question_fr": "Quelles épices rehaussent le goût de la soupe poulet orge?",
    "answer_fr": "Le thym, le laurier, l'ail et le poivre noir sont les épices de base. Le paprika doux et le curcuma ajoutent de la profondeur et une touche réconfortante.",
    "question_en": "What spices enhance the flavor of chicken barley soup?",
    "answer_en": "Thyme, bay leaf, garlic, and black pepper are the base spices. Mild paprika and turmeric add depth and a comforting touch."
  },
  {
    "question_fr": "Ingrédients pour une version végétarienne de la soupe poulet orge?",
    "answer_fr": "Bouillon de légumes, orge perlé ou substitut, oignon, carottes, céleri, champignons, ail, thym, laurier et huile d'olive. Les champignons apportent l'effet umami.",
    "question_en": "Ingredients for a vegetarian version of chicken barley soup?",
    "answer_en": "Vegetable broth, pearl barley or substitute, onion, carrots, celery, mushrooms, garlic, thyme, bay leaf, and olive oil. Mushrooms provide the umami effect."
  },
  {
    "question_fr": "Temps de cuisson idéal pour l'orge dans une soupe mijotée?",
    "answer_fr": "L'orge perlé cuit en 35 à 45 minutes. L'orge entier nécessite 60 à 75 minutes. En mijoteuse, compter 6 à 8 heures à basse température.",
    "question_en": "Ideal cooking time for barley in a slow-cooked soup?",
    "answer_en": "Pearl barley cooks in 35 to 45 minutes. Whole barley requires 60 to 75 minutes. In a slow cooker, allow 6 to 8 hours on low heat."
  },
  {
    "question_fr": "Options sans gluten pour une soupe poulet orge adaptée?",
    "answer_fr": "Le riz blanc, le riz à sushi, le quinoa, le sarrasin et les lentilles corail remplacent l'orge efficacement. Le riz à sushi donne une texture proche de l'orge.",
    "question_en": "Gluten-free options for an adapted chicken barley soup?",
    "answer_en": "White rice, sushi rice, quinoa, buckwheat, and red lentils effectively replace barley. Sushi rice provides a texture similar to barley."
  },
  {
    "question_fr": "Accords mets et boissons pour accompagner une soupe poulet orge?",
    "answer_fr": "Un vin blanc sec, un cidre sec ou une eau citronnée accompagnent bien la soupe. Servir avec pain de campagne ou craquelins nature.",
    "question_en": "Food and drink pairings to accompany chicken barley soup?",
    "answer_en": "A dry white wine, dry cider, or lemon water pairs well with the soup. Serve with country bread or plain crackers."
  }
]$JSON$,
updated_at = NOW()
WHERE slug = 'soupe-poulet-orge';

-- Also update the English translation if it exists
UPDATE recipe_translations
SET faq = $JSON$[
  {
    "question_fr": "Quelles épices rehaussent le goût de la soupe poulet orge?",
    "answer_fr": "Le thym, le laurier, l'ail et le poivre noir sont les épices de base. Le paprika doux et le curcuma ajoutent de la profondeur et une touche réconfortante.",
    "question_en": "What spices enhance the flavor of chicken barley soup?",
    "answer_en": "Thyme, bay leaf, garlic, and black pepper are the base spices. Mild paprika and turmeric add depth and a comforting touch."
  },
  {
    "question_fr": "Ingrédients pour une version végétarienne de la soupe poulet orge?",
    "answer_fr": "Bouillon de légumes, orge perlé ou substitut, oignon, carottes, céleri, champignons, ail, thym, laurier et huile d'olive. Les champignons apportent l'effet umami.",
    "question_en": "Ingredients for a vegetarian version of chicken barley soup?",
    "answer_en": "Vegetable broth, pearl barley or substitute, onion, carrots, celery, mushrooms, garlic, thyme, bay leaf, and olive oil. Mushrooms provide the umami effect."
  },
  {
    "question_fr": "Temps de cuisson idéal pour l'orge dans une soupe mijotée?",
    "answer_fr": "L'orge perlé cuit en 35 à 45 minutes. L'orge entier nécessite 60 à 75 minutes. En mijoteuse, compter 6 à 8 heures à basse température.",
    "question_en": "Ideal cooking time for barley in a slow-cooked soup?",
    "answer_en": "Pearl barley cooks in 35 to 45 minutes. Whole barley requires 60 to 75 minutes. In a slow cooker, allow 6 to 8 hours on low heat."
  },
  {
    "question_fr": "Options sans gluten pour une soupe poulet orge adaptée?",
    "answer_fr": "Le riz blanc, le riz à sushi, le quinoa, le sarrasin et les lentilles corail remplacent l'orge efficacement. Le riz à sushi donne une texture proche de l'orge.",
    "question_en": "Gluten-free options for an adapted chicken barley soup?",
    "answer_en": "White rice, sushi rice, quinoa, buckwheat, and red lentils effectively replace barley. Sushi rice provides a texture similar to barley."
  },
  {
    "question_fr": "Accords mets et boissons pour accompagner une soupe poulet orge?",
    "answer_fr": "Un vin blanc sec, un cidre sec ou une eau citronnée accompagnent bien la soupe. Servir avec pain de campagne ou craquelins nature.",
    "question_en": "Food and drink pairings to accompany chicken barley soup?",
    "answer_en": "A dry white wine, dry cider, or lemon water pairs well with the soup. Serve with country bread or plain crackers."
  }
]$JSON$
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'soupe-poulet-orge');
