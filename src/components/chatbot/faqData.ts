import type { FAQItem } from './types';

export const faqData: FAQItem[] = [
  // PUBLICITÉ
  {
    id: 'adv-1',
    keywords: ['publicite', 'advertising', 'annonce', 'banner', 'banniere', 'sponsor', 'partenariat', 'annoncer', 'promote', 'pub'],
    question: {
      fr: 'Comment faire de la publicité sur Menucochon?',
      en: 'How can I advertise on Menucochon?'
    },
    answer: {
      fr: 'Nous offrons deux options: bannières publicitaires à 100$/mois ou Guest Post avec lien dofollow permanent à 150$.',
      en: 'We offer two options: banner ads at $100/month or Guest Post with permanent dofollow link at $150.'
    },
    action: {
      type: 'link',
      url: { fr: '/publicite', en: '/en/advertising' },
      label: { fr: 'Voir nos offres', en: 'View our offers' }
    }
  },
  {
    id: 'adv-2',
    keywords: ['tarif', 'prix', 'price', 'cost', 'rate', 'cout', 'tarif publicitaire', 'advertising rates'],
    question: {
      fr: 'Quels sont vos tarifs publicitaires?',
      en: 'What are your advertising rates?'
    },
    answer: {
      fr: 'Bannières: 100$/mois sur chaque fiche recette. Guest Post avec lien dofollow: 150$ (permanent).',
      en: 'Banners: $100/month on every recipe page. Guest Post with dofollow link: $150 (permanent).'
    },
    action: {
      type: 'link',
      url: { fr: '/publicite', en: '/en/advertising' },
      label: { fr: 'Plus de détails', en: 'More details' }
    }
  },

  // SOUMETTRE RECETTE
  {
    id: 'rec-submit',
    keywords: ['soumettre', 'submit', 'proposer', 'suggest', 'partager', 'share', 'envoyer', 'send', 'nouvelle recette', 'new recipe', 'ajouter recette'],
    question: {
      fr: 'Comment proposer une recette?',
      en: 'How can I submit a recipe?'
    },
    answer: {
      fr: 'Vous pouvez nous soumettre vos recettes via le formulaire de contact. Décrivez votre recette avec les ingrédients et étapes. Nous les examinerons avec plaisir!',
      en: 'You can submit your recipes through our contact form. Describe your recipe with ingredients and steps. We will be happy to review them!'
    },
    action: {
      type: 'contact-form',
      label: { fr: 'Proposer une recette', en: 'Submit a recipe' }
    }
  },

  // MODE CUISINE
  {
    id: 'feat-cooking-mode',
    keywords: ['mode cuisine', 'cooking mode', 'voix', 'voice', 'mains libres', 'hands-free', 'etape', 'step', 'instruction vocale'],
    question: {
      fr: "Comment utiliser le mode cuisine?",
      en: 'How do I use cooking mode?'
    },
    answer: {
      fr: "Le Mode Cuisine lit les étapes à voix haute! Cliquez sur le bouton \"Mode Cuisine\" sur une recette, puis naviguez avec \"Suivant\" et \"Précédent\". Parfait quand vous avez les mains dans la pâte!",
      en: 'Cooking Mode reads steps aloud! Click the "Cooking Mode" button on a recipe, then navigate with "Next" and "Previous". Perfect when your hands are in the dough!'
    }
  },
  {
    id: 'feat-cooking-mode-2',
    keywords: ['mode cuisine fonctionne', 'how cooking mode works', 'lire recette', 'read recipe', 'vocal'],
    question: {
      fr: "Le mode cuisine peut-il lire la recette?",
      en: 'Can cooking mode read the recipe?'
    },
    answer: {
      fr: "Oui! Le Mode Cuisine utilise la synthèse vocale pour lire chaque étape. Vous pouvez aussi contrôler avec des commandes vocales comme \"suivant\" ou \"répète\"!",
      en: 'Yes! Cooking Mode uses speech synthesis to read each step. You can also control with voice commands like "next" or "repeat"!'
    }
  },

  // COMPTE GRATUIT
  {
    id: 'account-create',
    keywords: ['compte', 'account', 'inscription', 'register', 'sign up', 'inscrire', 'creer compte', 'create account', 'gratuit', 'free'],
    question: {
      fr: 'Comment créer un compte gratuit?',
      en: 'How do I create a free account?'
    },
    answer: {
      fr: "Cliquez sur l'icône profil dans l'en-tête et choisissez \"Créer un compte\". C'est 100% gratuit et vous permet de sauvegarder vos favoris, laisser des commentaires et plus!",
      en: 'Click the profile icon in the header and choose "Create account". It\'s 100% free and lets you save favorites, leave comments and more!'
    }
  },

  // FAVORIS / LIKE
  {
    id: 'feat-favorites',
    keywords: ['favoris', 'favorites', 'sauvegarder', 'save', 'coeur', 'heart', 'like', 'aimer', 'garder'],
    question: {
      fr: 'Comment sauvegarder mes recettes favorites?',
      en: 'How do I save my favorite recipes?'
    },
    answer: {
      fr: "Cliquez sur l'icône coeur sur n'importe quelle recette. Créez un compte gratuit pour retrouver vos favoris sur tous vos appareils!",
      en: 'Click the heart icon on any recipe. Create a free account to access your favorites on all your devices!'
    },
    action: {
      type: 'link',
      url: { fr: '/admin', en: '/en/admin' },
      label: { fr: 'Créer un compte', en: 'Create account' }
    }
  },

  // COMMENTAIRES
  {
    id: 'feat-comments',
    keywords: ['commentaire', 'comment', 'avis', 'review', 'ecrire', 'write', 'question recette'],
    question: {
      fr: 'Comment laisser un commentaire sur une recette?',
      en: 'How do I leave a comment on a recipe?'
    },
    answer: {
      fr: "Descendez en bas de la page recette pour trouver la section commentaires. Connectez-vous à votre compte gratuit pour partager votre avis ou poser une question!",
      en: 'Scroll to the bottom of the recipe page to find the comments section. Log in to your free account to share your opinion or ask a question!'
    }
  },

  // INSTRUCTIONS RECETTE
  {
    id: 'rec-instructions',
    keywords: ['instruction', 'etape', 'step', 'comment faire', 'how to', 'preparation', 'methode'],
    question: {
      fr: 'Comment suivre les instructions d\'une recette?',
      en: 'How do I follow recipe instructions?'
    },
    answer: {
      fr: "Chaque recette affiche les étapes numérotées. Utilisez le \"Mode Cuisine\" pour une lecture vocale étape par étape, parfait quand vous avez les mains occupées!",
      en: 'Each recipe displays numbered steps. Use "Cooking Mode" for step-by-step voice reading, perfect when your hands are busy!'
    }
  },

  // LEXIQUE / SAVIEZ-VOUS QUE
  {
    id: 'feat-lexicon',
    keywords: ['lexique', 'lexicon', 'terme', 'term', 'definition', 'saviez-vous', 'did you know', 'vocabulaire', 'vocabulary', 'glossaire'],
    question: {
      fr: "Qu'est-ce que le lexique culinaire?",
      en: 'What is the culinary lexicon?'
    },
    answer: {
      fr: "Notre lexique explique les termes culinaires avec des définitions claires et des \"Saviez-vous que?\" intéressants. Parfait pour apprendre en cuisinant!",
      en: 'Our lexicon explains culinary terms with clear definitions and interesting "Did you know?" facts. Perfect for learning while cooking!'
    },
    action: {
      type: 'link',
      url: { fr: '/lexique', en: '/en/lexicon' },
      label: { fr: 'Voir le lexique', en: 'View lexicon' }
    }
  },

  // ROUTE DES ÉPICES
  {
    id: 'feat-spices',
    keywords: ['epice', 'spice', 'route', 'assaisonnement', 'seasoning', 'herbe', 'herb', 'aromate'],
    question: {
      fr: "Qu'est-ce que la Route des épices?",
      en: 'What is the Spice Route?'
    },
    answer: {
      fr: "Découvrez notre guide complet des épices! Origines, utilisations, associations recommandées et conseils de conservation pour chaque épice.",
      en: 'Discover our complete spice guide! Origins, uses, recommended pairings and storage tips for each spice.'
    },
    action: {
      type: 'link',
      url: { fr: '/epices', en: '/en/spices' },
      label: { fr: 'Explorer les épices', en: 'Explore spices' }
    }
  },

  // GUIDE D'ACHAT / OUTILS
  {
    id: 'feat-tools',
    keywords: ['outil', 'tool', 'equipement', 'equipment', 'ustensile', 'utensil', 'guide achat', 'buying guide', 'cuisine', 'kitchen', 'accessoire'],
    question: {
      fr: 'Où trouver des recommandations d\'équipement?',
      en: 'Where can I find equipment recommendations?'
    },
    answer: {
      fr: "Notre guide d'achat recommande les meilleurs outils de cuisine: poêles, couteaux, thermomètres et plus. Testés et approuvés par notre équipe!",
      en: 'Our buying guide recommends the best kitchen tools: pans, knives, thermometers and more. Tested and approved by our team!'
    },
    action: {
      type: 'link',
      url: { fr: '/guide-achat', en: '/en/buying-guide' },
      label: { fr: "Voir le guide d'achat", en: 'View buying guide' }
    }
  },

  // BLOG
  {
    id: 'feat-blog',
    keywords: ['blog', 'article', 'conseil', 'tip', 'astuce', 'trick', 'actualite', 'news'],
    question: {
      fr: 'Qu\'est-ce qu\'on trouve sur le blog?',
      en: 'What can I find on the blog?'
    },
    answer: {
      fr: "Notre blog partage des articles sur les tendances culinaires, astuces de cuisine, guides saisonniers et bien plus. Nouveau contenu chaque semaine!",
      en: 'Our blog shares articles about culinary trends, cooking tips, seasonal guides and much more. New content every week!'
    },
    action: {
      type: 'link',
      url: { fr: '/blog', en: '/en/blog' },
      label: { fr: 'Lire le blog', en: 'Read the blog' }
    }
  },

  // FRIGO MAGIQUE
  {
    id: 'feat-fridge',
    keywords: ['frigo', 'fridge', 'ingredients', 'recherche', 'search', 'trouver', 'find', 'reste', 'leftover', 'inventaire'],
    question: {
      fr: 'Comment trouver des recettes avec mes ingrédients?',
      en: 'How do I find recipes with my ingredients?'
    },
    answer: {
      fr: "Utilisez notre \"Frigo Magique\"! Entrez les ingrédients que vous avez et trouvez des recettes correspondantes. Fini le gaspillage!",
      en: 'Use our "Magic Fridge"! Enter the ingredients you have and find matching recipes. No more waste!'
    },
    action: {
      type: 'link',
      url: { fr: '/frigo', en: '/en/frigo' },
      label: { fr: 'Essayer', en: 'Try it' }
    }
  },

  // RADIO
  {
    id: 'feat-radio',
    keywords: ['radio', 'musique', 'music', 'kracradio', 'ecouter', 'listen', 'station'],
    question: {
      fr: 'Comment écouter la radio en cuisinant?',
      en: 'How do I listen to the radio while cooking?'
    },
    answer: {
      fr: "Cliquez sur le bouton radio flottant en bas à gauche! 7 stations: Pop, Rock, Jazz, Classique, Lounge, Latino et Hip-Hop. La musique continue même en changeant de page!",
      en: 'Click the floating radio button at the bottom left! 7 stations: Pop, Rock, Jazz, Classical, Lounge, Latino and Hip-Hop. Music continues even when changing pages!'
    }
  },
  {
    id: 'feat-radio-2',
    keywords: ['station radio', 'radio station', 'changer station', 'change station', 'krac'],
    question: {
      fr: 'Quelles stations de radio sont disponibles?',
      en: 'What radio stations are available?'
    },
    answer: {
      fr: "KracRadio offre 7 stations: KracPop, KracRock, KracJazz, KracClassique, KracLounge, KracLatino et KracHipHop. Chaque station a sa propre ambiance!",
      en: 'KracRadio offers 7 stations: KracPop, KracRock, KracJazz, KracClassical, KracLounge, KracLatino and KracHipHop. Each station has its own vibe!'
    }
  },
  {
    id: 'feat-radio-3',
    keywords: ['radio gratuit', 'free radio', 'radio background', 'fond musical'],
    question: {
      fr: 'La radio est-elle gratuite?',
      en: 'Is the radio free?'
    },
    answer: {
      fr: "Oui, 100% gratuite! Écoutez de la musique en continu pendant que vous cuisinez. Aucun compte requis, pas de publicités audio.",
      en: 'Yes, 100% free! Listen to continuous music while you cook. No account required, no audio ads.'
    }
  },

  // LANGUE
  {
    id: 'gen-language',
    keywords: ['langue', 'language', 'francais', 'french', 'anglais', 'english', 'bilingue', 'traduire', 'translate'],
    question: {
      fr: 'Le site est-il disponible en anglais?',
      en: 'Is the site available in French?'
    },
    answer: {
      fr: "Oui! Toutes nos recettes et fonctionnalités sont en français et anglais. Utilisez le sélecteur de langue (FR/EN) dans l'en-tête.",
      en: 'Yes! All our recipes and features are in French and English. Use the language selector (FR/EN) in the header.'
    }
  },

  // NEWSLETTER
  {
    id: 'gen-newsletter',
    keywords: ['newsletter', 'email', 'inscription', 'subscribe', 'abonnement', 'infolettre', 'courriel'],
    question: {
      fr: "Comment m'inscrire à la newsletter?",
      en: 'How do I subscribe to the newsletter?'
    },
    answer: {
      fr: "Descendez en bas de n'importe quelle page et entrez votre email dans la section newsletter. Recevez nos meilleures recettes chaque semaine!",
      en: 'Scroll to the bottom of any page and enter your email in the newsletter section. Receive our best recipes every week!'
    }
  },

  // VIDÉOS YOUTUBE
  {
    id: 'feat-videos',
    keywords: ['video', 'youtube', 'regarder', 'watch', 'tutoriel', 'tutorial'],
    question: {
      fr: 'Y a-t-il des vidéos de recettes?',
      en: 'Are there recipe videos?'
    },
    answer: {
      fr: "Oui! Nous publions des vidéos sur notre chaîne YouTube. Certaines recettes incluent aussi des vidéos intégrées directement sur la page.",
      en: 'Yes! We publish videos on our YouTube channel. Some recipes also include videos embedded directly on the page.'
    },
    action: {
      type: 'link',
      url: { fr: '/videos', en: '/en/videos' },
      label: { fr: 'Voir les vidéos', en: 'Watch videos' }
    }
  },

  // CONVERTISSEUR
  {
    id: 'feat-converter',
    keywords: ['convertir', 'convert', 'mesure', 'measurement', 'tasse', 'cup', 'gramme', 'gram', 'calculer', 'calculate'],
    question: {
      fr: 'Comment convertir les mesures?',
      en: 'How do I convert measurements?'
    },
    answer: {
      fr: "Utilisez notre convertisseur de mesures! Tasses en grammes, Fahrenheit en Celsius, et plus. Pratique pour adapter les recettes internationales.",
      en: 'Use our measurement converter! Cups to grams, Fahrenheit to Celsius, and more. Handy for adapting international recipes.'
    },
    action: {
      type: 'link',
      url: { fr: '/convertisseur', en: '/en/converter' },
      label: { fr: 'Convertisseur', en: 'Converter' }
    }
  },

  // IMPRIMER
  {
    id: 'feat-print',
    keywords: ['imprimer', 'print', 'pdf', 'papier', 'paper'],
    question: {
      fr: 'Comment imprimer une recette?',
      en: 'How do I print a recipe?'
    },
    answer: {
      fr: "Cliquez sur le bouton \"Imprimer\" sur n'importe quelle page recette. La mise en page est optimisée pour l'impression!",
      en: 'Click the "Print" button on any recipe page. The layout is optimized for printing!'
    }
  },

  // CONTACT GÉNÉRAL
  {
    id: 'gen-contact',
    keywords: ['contact', 'joindre', 'reach', 'email', 'message', 'question', 'aide', 'help', 'probleme', 'problem'],
    question: {
      fr: 'Comment vous contacter?',
      en: 'How do I contact you?'
    },
    answer: {
      fr: "Vous pouvez nous contacter via le formulaire de contact. Nous répondons généralement dans les 24 à 48 heures!",
      en: 'You can contact us through the contact form. We usually respond within 24 to 48 hours!'
    },
    action: {
      type: 'contact-form',
      label: { fr: 'Nous contacter', en: 'Contact us' }
    }
  },

  // TOUR DES FEATURES
  {
    id: 'feat-all',
    keywords: ['fonctionnalite', 'feature', 'quoi faire', 'what can', 'possibilite', 'options', 'tout', 'all'],
    question: {
      fr: 'Quelles sont les fonctionnalités du site?',
      en: 'What features does the site have?'
    },
    answer: {
      fr: "Menucochon offre: Mode Cuisine vocal, Radio KracRadio (7 stations), Frigo Magique, Lexique culinaire, Route des épices, Guide d'achat, Convertisseur, Favoris, Commentaires et plus!",
      en: 'Menucochon offers: Voice Cooking Mode, KracRadio (7 stations), Magic Fridge, Culinary Lexicon, Spice Route, Buying Guide, Converter, Favorites, Comments and more!'
    }
  },

  // RECETTES
  {
    id: 'rec-count',
    keywords: ['combien', 'recette', 'recettes', 'how many', 'recipes', 'nombre', 'count', 'disponibles', 'available', 'quantite'],
    question: {
      fr: 'Combien de recettes avez-vous?',
      en: 'How many recipes do you have?'
    },
    answer: {
      fr: "Plus de 500 recettes québécoises et internationales! Nouveautés ajoutées régulièrement. Plats principaux, desserts, soupes, salades et plus.",
      en: 'Over 500 Quebec and international recipes! New additions regularly. Main dishes, desserts, soups, salads and more.'
    },
    action: {
      type: 'link',
      url: { fr: '/recettes', en: '/en/recipes' },
      label: { fr: 'Voir les recettes', en: 'View recipes' }
    }
  },
  {
    id: 'rec-categories',
    keywords: ['categorie', 'category', 'type recette', 'recipe type', 'plat principal', 'dessert', 'soupe'],
    question: {
      fr: 'Quelles catégories de recettes avez-vous?',
      en: 'What recipe categories do you have?'
    },
    answer: {
      fr: "Plats principaux, Soupes & potages, Salades, Desserts, Déjeuners, Accompagnements, Boissons, et plus! Filtrez aussi par difficulté, temps de préparation ou origine.",
      en: 'Main dishes, Soups, Salads, Desserts, Breakfasts, Side dishes, Beverages, and more! Also filter by difficulty, prep time or origin.'
    }
  },

  // NUTRITION
  {
    id: 'feat-nutrition',
    keywords: ['nutrition', 'calorie', 'nutritionnel', 'nutritional', 'proteine', 'protein', 'glucide', 'carb'],
    question: {
      fr: 'Y a-t-il des informations nutritionnelles?',
      en: 'Is there nutritional information?'
    },
    answer: {
      fr: "Oui! Chaque recette affiche les calories, protéines, glucides et lipides par portion. Trouvez ces infos dans la sidebar de chaque recette.",
      en: 'Yes! Each recipe displays calories, protein, carbs and fat per serving. Find this info in the sidebar of each recipe.'
    }
  },

  // PORTIONS
  {
    id: 'feat-portions',
    keywords: ['portion', 'serving', 'ajuster', 'adjust', 'multiplier', 'multiply', 'personne', 'people'],
    question: {
      fr: 'Puis-je ajuster le nombre de portions?',
      en: 'Can I adjust the number of servings?'
    },
    answer: {
      fr: "Oui! Utilisez les boutons +/- à côté du nombre de portions sur chaque recette. Les quantités d'ingrédients s'ajustent automatiquement!",
      en: 'Yes! Use the +/- buttons next to the serving count on each recipe. Ingredient quantities adjust automatically!'
    }
  },

  // DIFFICULTÉ
  {
    id: 'rec-difficulty',
    keywords: ['difficulte', 'difficulty', 'facile', 'easy', 'debutant', 'beginner', 'niveau', 'level'],
    question: {
      fr: 'Comment savoir si une recette est facile?',
      en: 'How do I know if a recipe is easy?'
    },
    answer: {
      fr: "Chaque recette indique son niveau: Facile, Moyen ou Difficile. Vous pouvez aussi filtrer les recettes par difficulté dans la recherche!",
      en: 'Each recipe shows its level: Easy, Medium or Difficult. You can also filter recipes by difficulty in the search!'
    }
  },

  // TEMPS
  {
    id: 'rec-time',
    keywords: ['temps', 'time', 'duree', 'duration', 'preparation', 'cuisson', 'cooking', 'rapide', 'quick'],
    question: {
      fr: 'Les temps de préparation sont-ils indiqués?',
      en: 'Are preparation times listed?'
    },
    answer: {
      fr: "Oui! Chaque recette affiche le temps de préparation et de cuisson séparément. Cherchez des recettes rapides avec le filtre \"30 min ou moins\"!",
      en: 'Yes! Each recipe shows prep time and cooking time separately. Search for quick recipes with the "30 min or less" filter!'
    }
  },

  // BOUTIQUE
  {
    id: 'feat-shop',
    keywords: ['boutique', 'shop', 'acheter', 'buy', 'produit', 'product', 'amazon'],
    question: {
      fr: 'Avez-vous une boutique?',
      en: 'Do you have a shop?'
    },
    answer: {
      fr: "Oui! Notre boutique recommande des produits de cuisine testés: ustensiles, épices, livres de recettes. Liens affiliés Amazon pour un achat facile.",
      en: 'Yes! Our shop recommends tested kitchen products: utensils, spices, cookbooks. Amazon affiliate links for easy purchasing.'
    },
    action: {
      type: 'link',
      url: { fr: '/boutique', en: '/en/shop' },
      label: { fr: 'Voir la boutique', en: 'View shop' }
    }
  },

  // MOBILE
  {
    id: 'gen-mobile',
    keywords: ['mobile', 'telephone', 'phone', 'tablette', 'tablet', 'app', 'application'],
    question: {
      fr: 'Le site fonctionne-t-il sur mobile?',
      en: 'Does the site work on mobile?'
    },
    answer: {
      fr: "Oui! Menucochon est entièrement responsive. Utilisez-le sur votre téléphone ou tablette en cuisine. Ajoutez-le à votre écran d'accueil comme une app!",
      en: 'Yes! Menucochon is fully responsive. Use it on your phone or tablet in the kitchen. Add it to your home screen like an app!'
    }
  },

  // GRATUIT
  {
    id: 'gen-free',
    keywords: ['gratuit', 'free', 'payer', 'pay', 'cout', 'cost', 'abonnement', 'subscription'],
    question: {
      fr: 'Menucochon est-il gratuit?',
      en: 'Is Menucochon free?'
    },
    answer: {
      fr: "Oui, 100% gratuit! Toutes les recettes, le Mode Cuisine, la radio, le convertisseur... tout est accessible sans payer. Créez un compte gratuit pour sauvegarder vos favoris!",
      en: 'Yes, 100% free! All recipes, Cooking Mode, radio, converter... everything is accessible without paying. Create a free account to save your favorites!'
    }
  }
];

export function matchFAQ(message: string, locale: 'fr' | 'en'): FAQItem | null {
  const normalized = message.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  let bestMatch: FAQItem | null = null;
  let bestScore = 0;

  for (const item of faqData) {
    let score = 0;
    for (const keyword of item.keywords) {
      const normalizedKeyword = keyword.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      if (normalized.includes(normalizedKeyword)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestScore >= 1 ? bestMatch : null;
}

export function getWelcomeSuggestions(locale: 'fr' | 'en' = 'fr'): FAQItem[] {
  return [
    faqData.find(f => f.id === 'feat-cooking-mode')!,
    faqData.find(f => f.id === 'feat-radio')!,
    faqData.find(f => f.id === 'feat-fridge')!,
    faqData.find(f => f.id === 'feat-favorites')!,
    faqData.find(f => f.id === 'feat-converter')!,
    faqData.find(f => f.id === 'rec-count')!,
  ];
}

export function getMoreSuggestions(excludeId: string, locale: 'fr' | 'en' = 'fr', count: number = 3): FAQItem[] {
  // Get all popular FAQ items
  const popularItems = [
    faqData.find(f => f.id === 'feat-cooking-mode')!,
    faqData.find(f => f.id === 'feat-radio')!,
    faqData.find(f => f.id === 'feat-fridge')!,
    faqData.find(f => f.id === 'feat-favorites')!,
    faqData.find(f => f.id === 'feat-converter')!,
    faqData.find(f => f.id === 'rec-count')!,
    faqData.find(f => f.id === 'feat-lexicon')!,
    faqData.find(f => f.id === 'feat-spices')!,
    faqData.find(f => f.id === 'feat-tools')!,
  ];

  // Filter out the one that was just asked
  return popularItems
    .filter(item => item && item.id !== excludeId)
    .slice(0, count);
}
