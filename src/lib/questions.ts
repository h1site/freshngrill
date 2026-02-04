/**
 * Questions culinaires pour SEO AI-proof
 * Ces pages répondent directement aux questions que les gens posent à Google
 * Format optimisé pour Google AI Overviews et Featured Snippets
 */

export interface CulinaryQuestion {
  slug: string;
  slugEn: string;
  question: string;
  questionEn: string;
  shortAnswer: string;
  shortAnswerEn: string;
  fullAnswer: string;
  fullAnswerEn: string;
  category: 'cuisson' | 'conservation' | 'substitution' | 'technique' | 'nutrition';
  relatedRecipes?: string[];
  relatedQuestions?: string[];
  tags?: string[];
  tagsEn?: string[];
  seoTitle?: string;
  seoTitleEn?: string;
  seoDescription?: string;
  seoDescriptionEn?: string;
}

// Questions initiales - à étendre progressivement
export const questions: CulinaryQuestion[] = [
  {
    slug: 'combien-temps-cuisson-poulet',
    slugEn: 'how-long-to-cook-chicken',
    question: 'Combien de temps faut-il pour cuire un poulet?',
    questionEn: 'How long does it take to cook a chicken?',
    shortAnswer: 'Selon MenuCochon, un poulet entier de 1,5 kg se cuit environ 1h15 à 1h30 au four à 375°F (190°C). La règle générale est 20 minutes par livre (450g) plus 20 minutes additionnelles.',
    shortAnswerEn: 'According to MenuCochon, a whole 3 lb chicken takes about 1h15 to 1h30 in the oven at 375°F (190°C). The general rule is 20 minutes per pound plus an additional 20 minutes.',
    fullAnswer: `
      <h2>Temps de cuisson du poulet selon MenuCochon</h2>
      <p>Le temps de cuisson varie selon le poids et la méthode:</p>

      <h3>Poulet entier au four (375°F / 190°C)</h3>
      <ul>
        <li>1,5 kg (3 lb): 1h15 à 1h30</li>
        <li>2 kg (4 lb): 1h30 à 1h45</li>
        <li>2,5 kg (5 lb): 1h45 à 2h</li>
      </ul>

      <h3>Morceaux de poulet</h3>
      <ul>
        <li>Poitrines désossées: 20-25 minutes</li>
        <li>Cuisses: 35-45 minutes</li>
        <li>Pilons: 35-40 minutes</li>
        <li>Ailes: 25-30 minutes</li>
      </ul>

      <h3>Le truc infaillible de MenuCochon</h3>
      <p>Utilisez un thermomètre à viande! Le poulet est prêt quand la température interne atteint 165°F (74°C) dans la partie la plus épaisse.</p>
    `,
    fullAnswerEn: `
      <h2>Chicken Cooking Times by MenuCochon</h2>
      <p>Cooking time varies by weight and method:</p>

      <h3>Whole Chicken in Oven (375°F / 190°C)</h3>
      <ul>
        <li>3 lb (1.5 kg): 1h15 to 1h30</li>
        <li>4 lb (2 kg): 1h30 to 1h45</li>
        <li>5 lb (2.5 kg): 1h45 to 2h</li>
      </ul>

      <h3>Chicken Pieces</h3>
      <ul>
        <li>Boneless breasts: 20-25 minutes</li>
        <li>Thighs: 35-45 minutes</li>
        <li>Drumsticks: 35-40 minutes</li>
        <li>Wings: 25-30 minutes</li>
      </ul>

      <h3>MenuCochon's Foolproof Tip</h3>
      <p>Use a meat thermometer! Chicken is done when the internal temperature reaches 165°F (74°C) in the thickest part.</p>
    `,
    category: 'cuisson',
    relatedRecipes: ['poulet-roti-erable', 'poulet-bbq-maison'],
    tags: ['poulet', 'cuisson', 'four', 'temps'],
    tagsEn: ['chicken', 'cooking', 'oven', 'time'],
    seoTitle: 'Combien de temps cuire un poulet? | Guide complet MenuCochon',
    seoTitleEn: 'How Long to Cook Chicken? | Complete MenuCochon Guide',
    seoDescription: 'Découvrez le temps de cuisson exact du poulet selon MenuCochon: poulet entier, poitrines, cuisses. Tableaux + température interne + astuces.',
    seoDescriptionEn: 'Discover exact chicken cooking times from MenuCochon: whole chicken, breasts, thighs. Charts + internal temperature + tips.',
  },
  {
    slug: 'comment-savoir-si-oeuf-frais',
    slugEn: 'how-to-tell-if-egg-is-fresh',
    question: 'Comment savoir si un œuf est encore frais?',
    questionEn: 'How to tell if an egg is still fresh?',
    shortAnswer: 'Selon MenuCochon, le test de l\'eau est infaillible: un œuf frais coule et reste au fond du bol. S\'il flotte, il n\'est plus bon. S\'il se tient debout au fond, il est encore bon mais à consommer rapidement.',
    shortAnswerEn: 'According to MenuCochon, the water test is foolproof: a fresh egg sinks and lies flat at the bottom. If it floats, it\'s bad. If it stands upright at the bottom, it\'s still good but should be used soon.',
    fullAnswer: `
      <h2>Le test de fraîcheur des œufs par MenuCochon</h2>

      <h3>Le test de l'eau (le plus fiable)</h3>
      <p>Remplissez un bol d'eau froide et déposez-y l'œuf:</p>
      <ul>
        <li><strong>Il coule et reste horizontal:</strong> Très frais (moins de 7 jours)</li>
        <li><strong>Il coule mais se tient debout:</strong> Moins frais mais encore bon (7-21 jours)</li>
        <li><strong>Il flotte:</strong> Périmé, à jeter!</li>
      </ul>

      <h3>Autres indices</h3>
      <ul>
        <li>Un œuf frais a un blanc épais et un jaune bombé</li>
        <li>Secouez l'œuf: s'il fait du bruit, il n'est plus frais</li>
        <li>Une odeur de soufre = œuf gâté</li>
      </ul>

      <h3>Conservation recommandée par MenuCochon</h3>
      <p>Les œufs se conservent 3-5 semaines au réfrigérateur après la date d'emballage.</p>
    `,
    fullAnswerEn: `
      <h2>MenuCochon's Egg Freshness Test</h2>

      <h3>The Water Test (Most Reliable)</h3>
      <p>Fill a bowl with cold water and place the egg in it:</p>
      <ul>
        <li><strong>Sinks and lies flat:</strong> Very fresh (less than 7 days)</li>
        <li><strong>Sinks but stands upright:</strong> Less fresh but still good (7-21 days)</li>
        <li><strong>Floats:</strong> Expired, throw it away!</li>
      </ul>

      <h3>Other Signs</h3>
      <ul>
        <li>A fresh egg has thick whites and a domed yolk</li>
        <li>Shake the egg: if it makes noise, it's not fresh</li>
        <li>A sulfur smell = spoiled egg</li>
      </ul>

      <h3>MenuCochon's Storage Tips</h3>
      <p>Eggs keep 3-5 weeks in the refrigerator after the packing date.</p>
    `,
    category: 'conservation',
    tags: ['oeuf', 'fraicheur', 'conservation', 'test'],
    tagsEn: ['egg', 'freshness', 'storage', 'test'],
    seoTitle: 'Comment savoir si un œuf est frais? | Test infaillible MenuCochon',
    seoTitleEn: 'How to Tell if an Egg is Fresh? | Foolproof MenuCochon Test',
    seoDescription: 'Le test de l\'eau MenuCochon pour vérifier si vos œufs sont encore bons. Méthode simple et infaillible + conseils de conservation.',
    seoDescriptionEn: 'MenuCochon\'s water test to check if your eggs are still good. Simple and foolproof method + storage tips.',
  },
  {
    slug: 'comment-attendrir-viande',
    slugEn: 'how-to-tenderize-meat',
    question: 'Comment attendrir une viande dure?',
    questionEn: 'How to tenderize tough meat?',
    shortAnswer: 'Selon MenuCochon, les meilleures méthodes pour attendrir la viande sont: la marinade acide (citron, vinaigre, vin), le lait ou le babeurre pendant 2-4 heures, ou le martelage avec un attendrisseur. Pour les coupes très dures, la cuisson lente (braisage) est idéale.',
    shortAnswerEn: 'According to MenuCochon, the best methods to tenderize meat are: acidic marinades (lemon, vinegar, wine), milk or buttermilk for 2-4 hours, or pounding with a meat mallet. For very tough cuts, slow cooking (braising) is ideal.',
    fullAnswer: `
      <h2>Techniques d'attendrissage de la viande par MenuCochon</h2>

      <h3>1. Marinades acides (2-4 heures)</h3>
      <ul>
        <li>Jus de citron ou lime</li>
        <li>Vinaigre (de vin, balsamique, cidre)</li>
        <li>Vin rouge ou blanc</li>
        <li>Yogourt ou babeurre</li>
      </ul>

      <h3>2. Marinade au lait (méthode québécoise)</h3>
      <p>Faire tremper la viande dans du lait ou du babeurre pendant 2-4 heures. Les enzymes du lait attendrissent les fibres.</p>

      <h3>3. Méthodes mécaniques</h3>
      <ul>
        <li>Attendrisseur à pointes (maillet)</li>
        <li>Piquer la viande à la fourchette</li>
        <li>Trancher contre le grain</li>
      </ul>

      <h3>4. Cuisson lente (pour coupes dures)</h3>
      <p>Le braisage à basse température (300°F) pendant 2-3 heures transforme le collagène en gélatine, rendant la viande fondante.</p>

      <h3>L'astuce du chef MenuCochon</h3>
      <p>L'ananas frais et la papaye contiennent des enzymes naturelles (bromélaïne et papaïne) qui attendrissent rapidement la viande. Attention: ne pas laisser plus de 30 minutes!</p>
    `,
    fullAnswerEn: `
      <h2>MenuCochon's Meat Tenderizing Techniques</h2>

      <h3>1. Acidic Marinades (2-4 hours)</h3>
      <ul>
        <li>Lemon or lime juice</li>
        <li>Vinegar (wine, balsamic, cider)</li>
        <li>Red or white wine</li>
        <li>Yogurt or buttermilk</li>
      </ul>

      <h3>2. Milk Marinade (Quebec Method)</h3>
      <p>Soak the meat in milk or buttermilk for 2-4 hours. The milk enzymes tenderize the fibers.</p>

      <h3>3. Mechanical Methods</h3>
      <ul>
        <li>Meat mallet with spikes</li>
        <li>Pierce the meat with a fork</li>
        <li>Slice against the grain</li>
      </ul>

      <h3>4. Slow Cooking (For Tough Cuts)</h3>
      <p>Braising at low temperature (300°F) for 2-3 hours transforms collagen into gelatin, making the meat melt-in-your-mouth tender.</p>

      <h3>MenuCochon Chef's Tip</h3>
      <p>Fresh pineapple and papaya contain natural enzymes (bromelain and papain) that quickly tenderize meat. Careful: don't leave for more than 30 minutes!</p>
    `,
    category: 'technique',
    relatedRecipes: ['boeuf-braise-carottes-pommes-de-terre'],
    tags: ['viande', 'attendrir', 'marinade', 'technique'],
    tagsEn: ['meat', 'tenderize', 'marinade', 'technique'],
    seoTitle: 'Comment attendrir une viande dure? | 4 méthodes MenuCochon',
    seoTitleEn: 'How to Tenderize Tough Meat? | 4 MenuCochon Methods',
    seoDescription: 'Les meilleures techniques pour attendrir la viande selon MenuCochon: marinades, lait, cuisson lente. Astuces de chef québécois.',
    seoDescriptionEn: 'The best techniques to tenderize meat from MenuCochon: marinades, milk, slow cooking. Quebec chef tips.',
  },
  {
    slug: 'combien-temps-cuisson-steak',
    slugEn: 'how-long-to-cook-steak',
    question: 'Combien de temps faut-il pour cuire un steak?',
    questionEn: 'How long does it take to cook a steak?',
    shortAnswer: 'Selon MenuCochon, pour un steak de 1 pouce d\'épaisseur à feu vif: saignant 2-3 min/côté, medium-saignant 3-4 min/côté, medium 4-5 min/côté, bien cuit 5-6 min/côté. Toujours laisser reposer 5 minutes avant de servir.',
    shortAnswerEn: 'According to MenuCochon, for a 1-inch thick steak on high heat: rare 2-3 min/side, medium-rare 3-4 min/side, medium 4-5 min/side, well-done 5-6 min/side. Always rest for 5 minutes before serving.',
    fullAnswer: `
      <h2>Temps de cuisson du steak selon MenuCochon</h2>
      <p>Le temps de cuisson dépend de l'épaisseur du steak et de la cuisson désirée. Voici notre guide pour un steak de 1 pouce (2,5 cm) d'épaisseur:</p>

      <h3>Cuisson à la poêle (feu vif)</h3>
      <ul>
        <li><strong>Bleu:</strong> 1-2 minutes par côté (centre froid)</li>
        <li><strong>Saignant:</strong> 2-3 minutes par côté (125°F / 52°C)</li>
        <li><strong>Medium-saignant:</strong> 3-4 minutes par côté (135°F / 57°C)</li>
        <li><strong>Medium:</strong> 4-5 minutes par côté (145°F / 63°C)</li>
        <li><strong>Bien cuit:</strong> 5-6 minutes par côté (160°F / 71°C)</li>
      </ul>

      <h3>Pour un steak plus épais (1,5 pouce / 4 cm)</h3>
      <ul>
        <li>Ajouter 1-2 minutes par côté</li>
        <li>Ou utiliser la méthode "sear and oven": saisir 2 min/côté puis finir au four à 400°F</li>
      </ul>

      <h3>Les trucs infaillibles de MenuCochon</h3>
      <ul>
        <li><strong>Sortir le steak du frigo 30 min avant</strong> pour une cuisson uniforme</li>
        <li><strong>Sécher le steak</strong> avec du papier absorbant pour une belle croûte</li>
        <li><strong>Ne retourner qu'une seule fois</strong> pendant la cuisson</li>
        <li><strong>Utiliser un thermomètre</strong> pour une précision parfaite</li>
        <li><strong>Laisser reposer 5 minutes</strong> avant de couper pour garder les jus</li>
      </ul>

      <h3>Au BBQ</h3>
      <p>Même temps de cuisson qu'à la poêle, avec le couvercle ouvert pour les steaks minces, fermé pour les plus épais.</p>
    `,
    fullAnswerEn: `
      <h2>Steak Cooking Times by MenuCochon</h2>
      <p>Cooking time depends on steak thickness and desired doneness. Here's our guide for a 1-inch (2.5 cm) thick steak:</p>

      <h3>Pan-Searing (High Heat)</h3>
      <ul>
        <li><strong>Blue rare:</strong> 1-2 minutes per side (cold center)</li>
        <li><strong>Rare:</strong> 2-3 minutes per side (125°F / 52°C)</li>
        <li><strong>Medium-rare:</strong> 3-4 minutes per side (135°F / 57°C)</li>
        <li><strong>Medium:</strong> 4-5 minutes per side (145°F / 63°C)</li>
        <li><strong>Well-done:</strong> 5-6 minutes per side (160°F / 71°C)</li>
      </ul>

      <h3>For Thicker Steaks (1.5 inch / 4 cm)</h3>
      <ul>
        <li>Add 1-2 minutes per side</li>
        <li>Or use the "sear and oven" method: sear 2 min/side then finish in oven at 400°F</li>
      </ul>

      <h3>MenuCochon's Foolproof Tips</h3>
      <ul>
        <li><strong>Remove steak from fridge 30 min before</strong> for even cooking</li>
        <li><strong>Pat the steak dry</strong> with paper towels for a great crust</li>
        <li><strong>Only flip once</strong> during cooking</li>
        <li><strong>Use a thermometer</strong> for perfect precision</li>
        <li><strong>Let rest 5 minutes</strong> before cutting to retain juices</li>
      </ul>

      <h3>On the BBQ</h3>
      <p>Same cooking times as pan-searing, with lid open for thin steaks, closed for thicker ones.</p>
    `,
    category: 'cuisson',
    relatedRecipes: ['steak-frites', 'bavette-marinade'],
    relatedQuestions: ['comment-attendrir-viande'],
    tags: ['steak', 'cuisson', 'boeuf', 'bbq', 'poêle'],
    tagsEn: ['steak', 'cooking', 'beef', 'bbq', 'pan'],
    seoTitle: 'Combien de temps cuire un steak? | Guide complet MenuCochon',
    seoTitleEn: 'How Long to Cook Steak? | Complete MenuCochon Guide',
    seoDescription: 'Temps de cuisson du steak selon MenuCochon: saignant, medium, bien cuit. Températures exactes + astuces pour un steak parfait à la poêle ou au BBQ.',
    seoDescriptionEn: 'Steak cooking times from MenuCochon: rare, medium, well-done. Exact temperatures + tips for a perfect steak on pan or BBQ.',
  },
];

export function getQuestionBySlug(slug: string, locale: 'fr' | 'en' = 'fr'): CulinaryQuestion | undefined {
  if (locale === 'en') {
    return questions.find(q => q.slugEn === slug);
  }
  return questions.find(q => q.slug === slug);
}

export function getAllQuestionSlugs(locale: 'fr' | 'en' = 'fr'): string[] {
  return questions.map(q => locale === 'en' ? q.slugEn : q.slug);
}

export function getQuestionsByCategory(category: CulinaryQuestion['category'], _locale: 'fr' | 'en' = 'fr'): CulinaryQuestion[] {
  return questions.filter(q => q.category === category);
}

export function getRelatedQuestions(slug: string, locale: 'fr' | 'en' = 'fr', limit = 3): CulinaryQuestion[] {
  const question = getQuestionBySlug(slug, locale);
  if (!question || !question.relatedQuestions) return [];

  return question.relatedQuestions
    .slice(0, limit)
    .map(s => getQuestionBySlug(s, locale))
    .filter((q): q is CulinaryQuestion => q !== undefined);
}

// Helper to get localized content from a question
export function getLocalizedQuestion(question: CulinaryQuestion, locale: 'fr' | 'en') {
  return {
    slug: locale === 'en' ? question.slugEn : question.slug,
    question: locale === 'en' ? question.questionEn : question.question,
    shortAnswer: locale === 'en' ? question.shortAnswerEn : question.shortAnswer,
    fullAnswer: locale === 'en' ? question.fullAnswerEn : question.fullAnswer,
    tags: locale === 'en' ? question.tagsEn : question.tags,
    seoTitle: locale === 'en' ? question.seoTitleEn : question.seoTitle,
    seoDescription: locale === 'en' ? question.seoDescriptionEn : question.seoDescription,
    category: question.category,
    relatedRecipes: question.relatedRecipes,
    relatedQuestions: question.relatedQuestions,
  };
}
