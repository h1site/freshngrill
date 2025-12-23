import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================
// ARTICLE CONTENT
// ============================================

const articleFR = {
  slug: 'remplacer-vin-blanc-recette',
  title: 'Par quoi remplacer le vin blanc dans une recette ? (Guide complet)',
  excerpt: 'Découvrez les meilleurs substituts au vin blanc en cuisine : bouillon + acidité, verjus, vin sans alcool et plus. Guide complet pour déglacer sans vin et remplacer les vinaigres.',
  seoTitle: 'Par quoi remplacer le vin blanc dans une recette ? Guide complet',
  seoDescription: 'Guide complet pour remplacer le vin blanc en cuisine. Solutions sans alcool : bouillon + citron, verjus, vin sans alcool. Astuces pour déglacer et substituts de vinaigres.',
  readingTime: 8,
  content: `
<p>Le vin blanc est souvent utilisé en cuisine pour trois raisons : apporter de <strong>l'acidité</strong>, développer des <strong>arômes</strong> (fruités, floraux, minéraux) et aider à déccoler les sucs au fond d'une poêle quand on veut <strong>déglacer</strong>. Mais si tu n'en as pas sous la main, si tu cuisines pour des enfants, si tu évites l'alcool ou si tu veux simplement un goût différent, il existe plein d'options efficaces.</p>

<h2>Pourquoi le vin blanc fonctionne si bien en cuisine</h2>

<p>Dans la plupart des plats, le vin blanc apporte surtout :</p>

<ul>
  <li><strong>Acidité</strong> : ça "réveille" les saveurs, coupe le gras, équilibre une sauce crème.</li>
  <li><strong>Liquide</strong> : ça allonge une réduction, hydrate un risotto, une cuisson.</li>
  <li><strong>Arômes</strong> : notes de fruits, de fleurs, parfois une pointe de sucre.</li>
  <li><strong>Déglaçage</strong> : il dissout les sucs caramélisés au fond de la poêle.</li>
</ul>

<p>Donc, pour <strong>remplacer le vin blanc dans une recette</strong>, l'idée est de recréer le duo <em>"liquide + acidité"</em>, puis d'ajuster l'aromatique selon le plat.</p>

<h2>Les meilleurs substituts du vin blanc</h2>

<div class="substitutes-table">
<table>
  <thead>
    <tr>
      <th>Substitut</th>
      <th>Meilleur pour</th>
      <th>Proportion</th>
      <th>Goût</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Bouillon + citron</strong></td>
      <td>Sauces, risottos, volailles</td>
      <td>1:1 + 1 c. à thé citron/250ml</td>
      <td>Neutre, frais</td>
    </tr>
    <tr>
      <td><strong>Verjus</strong></td>
      <td>Poissons, sauces fines</td>
      <td>1:1</td>
      <td>Proche du vin</td>
    </tr>
    <tr>
      <td><strong>Vin blanc sans alcool</strong></td>
      <td>Toutes recettes</td>
      <td>1:1</td>
      <td>Identique</td>
    </tr>
    <tr>
      <td><strong>Jus de raisin + bouillon</strong></td>
      <td>Plats fruités</td>
      <td>50/50</td>
      <td>Fruité, doux</td>
    </tr>
    <tr>
      <td><strong>Vinaigre dilué</strong></td>
      <td>Déglaçage rapide</td>
      <td>1 c. à soupe/250ml bouillon</td>
      <td>Acide, net</td>
    </tr>
  </tbody>
</table>
</div>

<h3>1. Bouillon + acidité (la solution la plus polyvalente)</h3>

<p>C'est souvent le meilleur remplacement, surtout pour les plats salés : risottos, sauces, poêlées, volailles, poissons. Remplace le vin blanc par un bouillon (poulet, légumes, poisson), puis ajoute un petit acidifiant.</p>

<p><strong>Proportion simple</strong> : remplace 1:1 par du bouillon, puis ajoute 1 c. à thé d'acide (citron ou vinaigre doux) pour 250 ml, goûte et ajuste.</p>

<p><strong>Acidifiants possibles</strong> : jus de citron, verjus, un trait de vinaigre doux, ou même un peu de saumure de cornichons si ça colle au plat.</p>

<div class="tip-box">
<p><strong>💡 Astuce</strong> : Commence toujours par une petite dose d'acide. C'est particulièrement utile pour les sauces crème, où l'acidité évite un résultat "plat".</p>
</div>

<h3>2. Verjus (goût proche du vin blanc, sans alcool)</h3>

<p>Le verjus (jus de raisin vert) apporte une acidité douce et des arômes très compatibles avec les recettes au vin blanc. C'est une option premium pour les poissons, volailles, sauces et risottos, et ça marche très bien pour déglacer.</p>

<h3>3. Vin blanc sans alcool</h3>

<p>Si tu veux rester le plus proche possible du profil aromatique, le vin blanc sans alcool est souvent l'un des meilleurs choix. Attention : certains sont plus sucrés, donc pense à réduire un peu plus longtemps.</p>

<h3>4. Jus de raisin blanc ou jus de pomme + bouillon</h3>

<p>Quand la recette bénéficie d'une touche fruitée, mélange 50% bouillon + 50% jus (raisin blanc ou pomme). Si c'est trop doux, ajoute une pointe de citron.</p>

<h3>5. Vinaigre (mais dilué !)</h3>

<p>Le vinaigre pur est trop agressif : il faut le diluer. Exemple : 250 ml de bouillon + 1 c. à soupe de vinaigre doux. Ensuite, laisse réduire. C'est efficace si le vin servait surtout à l'acidité et au déglaçage.</p>

<h2>Comment déglacer sans vin</h2>

<p>Quand tu veux décoller les sucs, le secret n'est pas le vin : c'est <strong>un liquide + un peu d'acidité + chaleur</strong>.</p>

<ol>
  <li>Verse un bouillon chaud dans la poêle</li>
  <li>Gratte le fond avec une spatule pour décoller les sucs</li>
  <li>Ajoute citron/verjus/vinaigre doux une fois les sucs décollés</li>
  <li>Laisse réduire pour concentrer la saveur</li>
</ol>

<p>Tu reproduis l'effet "déglacer au vin" sans alcool, et tu obtiens une sauce aussi savoureuse.</p>

<h2>Et si la recette demandait du vin rouge ?</h2>

<p>Pour remplacer le vin rouge, on cherche plus de profondeur, de fruits noirs et parfois une légère astringence. Deux options très fiables :</p>

<ul>
  <li><strong>Bouillon + jus rouge</strong> (raisin rouge, canneberge, grenade) : excellent pour ragoûts, sauces brunes, bœuf.</li>
  <li><strong>Bouillon + vinaigre de vin rouge</strong> (très dilué) : parfait si le vin rouge servait surtout à équilibrer et à déglacer.</li>
</ul>

<h2>Tableau des équivalences pour les vinaigres</h2>

<p>On confond souvent "remplacer le vin" et "remplacer un vinaigre". Ce n'est pas pareil : le vinaigre est déjà très acide, donc on ajuste surtout la douceur et l'arôme.</p>

<div class="substitutes-table">
<table>
  <thead>
    <tr>
      <th>Vinaigre original</th>
      <th>Substituts possibles</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Vinaigre de vin blanc</td>
      <td>Vinaigre de riz, vinaigre de cidre, citron</td>
      <td>Le riz est plus doux, le cidre plus fruité</td>
    </tr>
    <tr>
      <td>Vinaigre de cidre</td>
      <td>Vinaigre de vin blanc, vinaigre de riz</td>
      <td>Vin blanc plus neutre, riz plus doux</td>
    </tr>
    <tr>
      <td>Vinaigre de riz</td>
      <td>Vinaigre de vin blanc dilué, cidre dilué</td>
      <td>Réduire la dose et goûter</td>
    </tr>
    <tr>
      <td>Vinaigre de vin rouge</td>
      <td>Vinaigre neutre + sucre, balsamique</td>
      <td>Balsamique est plus sucré</td>
    </tr>
    <tr>
      <td>Vinaigre balsamique</td>
      <td>Vinaigre de vin rouge + miel</td>
      <td>Ou réduire un vinaigre doux</td>
    </tr>
  </tbody>
</table>
</div>

<h2>Le cas "vin de cuisson"</h2>

<p>Le vin de cuisson est souvent plus salé et moins agréable. Dans la majorité des cas, tu obtiendras un meilleur résultat en le remplaçant par bouillon + acidité (ou verjus). Tu contrôles le sel et tu gardes une sauce plus nette.</p>

<h2>En résumé</h2>

<p>Que tu fasses un risotto, une sauce pour volaille, des moules ou un déglaçage rapide, la logique reste la même :</p>

<ul>
  <li><strong>Bouillon</strong> pour le volume</li>
  <li><strong>Acidité</strong> (citron, verjus, vinaigre dilué) pour l'équilibre</li>
  <li><strong>Aromatiques</strong> (oignon, ail, herbes, réduction) pour compenser le côté "vin"</li>
</ul>

<p>Avec ces substituts, tu peux cuisiner sans vin tout en gardant des plats savoureux et bien équilibrés!</p>
`
};

const articleEN = {
  slugEn: 'replace-white-wine-recipe',
  title: 'What Can Replace White Wine in a Recipe? (Complete Guide)',
  excerpt: 'Discover the best white wine substitutes for cooking: broth + acidity, verjus, non-alcoholic wine and more. Complete guide to deglazing without wine and replacing vinegars.',
  seoTitle: 'What Can Replace White Wine in a Recipe? Complete Guide',
  seoDescription: 'Complete guide to replacing white wine in cooking. Alcohol-free solutions: broth + lemon, verjus, non-alcoholic wine. Tips for deglazing and vinegar substitutes.',
  content: `
<p>White wine is commonly used in cooking for three main reasons: it brings <strong>acidity</strong>, adds <strong>aroma</strong> (fruity, floral, mineral notes), and helps lift the browned bits from the bottom of a pan when you <strong>deglaze</strong>. But if you don't have any, if you're cooking for kids, avoiding alcohol, or simply want a different flavor profile, there are plenty of reliable alternatives.</p>

<h2>Why white wine works so well in cooking</h2>

<p>In most savory dishes, white wine contributes:</p>

<ul>
  <li><strong>Acidity</strong> to brighten flavors and balance richness (especially cream sauces).</li>
  <li><strong>Liquid</strong> to build a sauce, extend a reduction, or hydrate grains like risotto rice.</li>
  <li><strong>Aromatics</strong> that can taste fruity, floral, or lightly sweet.</li>
  <li><strong>Deglazing power</strong> to dissolve caramelized browned bits (fond) in the pan.</li>
</ul>

<p>So the best approach is to replace the wine with a <em>liquid + gentle acidity</em>, then adjust aromatics based on the dish.</p>

<h2>Best white wine substitutes</h2>

<div class="substitutes-table">
<table>
  <thead>
    <tr>
      <th>Substitute</th>
      <th>Best for</th>
      <th>Ratio</th>
      <th>Flavor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Broth + lemon</strong></td>
      <td>Sauces, risottos, poultry</td>
      <td>1:1 + 1 tsp lemon/250ml</td>
      <td>Neutral, fresh</td>
    </tr>
    <tr>
      <td><strong>Verjus</strong></td>
      <td>Fish, delicate sauces</td>
      <td>1:1</td>
      <td>Wine-like</td>
    </tr>
    <tr>
      <td><strong>Non-alcoholic white wine</strong></td>
      <td>All recipes</td>
      <td>1:1</td>
      <td>Identical</td>
    </tr>
    <tr>
      <td><strong>Grape juice + broth</strong></td>
      <td>Fruity dishes</td>
      <td>50/50</td>
      <td>Fruity, mild</td>
    </tr>
    <tr>
      <td><strong>Diluted vinegar</strong></td>
      <td>Quick deglazing</td>
      <td>1 tbsp/250ml broth</td>
      <td>Acidic, clean</td>
    </tr>
  </tbody>
</table>
</div>

<h3>1. Broth + acidity (most versatile)</h3>

<p>This is the most dependable option for sauces, sautéed dishes, poultry, fish, and risotto. Replace wine 1:1 with stock (chicken, vegetable, fish), then add a small amount of acid.</p>

<p><strong>Easy ratio</strong>: for every 1 cup (250 ml) of stock, start with 1 teaspoon of lemon juice or a mild vinegar, taste, and adjust.</p>

<p><strong>Good acids</strong>: lemon juice, verjus, a mild vinegar, or even a tiny splash of pickle brine if it matches the flavor profile.</p>

<div class="tip-box">
<p><strong>💡 Tip</strong>: Always start with a small dose of acid. This works especially well in creamy sauces, where acidity prevents a flat, heavy finish.</p>
</div>

<h3>2. Verjus (closest wine-like flavor, no alcohol)</h3>

<p>Verjus (pressed unripe grape juice) offers gentle acidity and grape aromatics that mimic wine more naturally than most options. It's excellent in seafood, poultry, pan sauces, and risotto, and it's great for deglazing.</p>

<h3>3. Non-alcoholic white wine</h3>

<p>If you want the closest match to wine aroma, non-alcoholic white wine is a practical substitute. Note that some brands run sweeter, so you may want a slightly longer reduction.</p>

<h3>4. White grape juice or apple juice + stock</h3>

<p>For a subtle fruity roundness, mix 50% stock + 50% white grape or apple juice. If it tastes too sweet, add a small squeeze of lemon.</p>

<h3>5. Vinegar (always diluted)</h3>

<p>Pure vinegar can be harsh. Use it in small amounts and dilute it with stock or water. Example: 1 cup stock + 1 tablespoon mild vinegar, then reduce. This is best when wine was used mostly for acidity and deglazing.</p>

<h2>How to deglaze without wine</h2>

<p>Deglazing doesn't require wine. The core technique is <strong>heat + liquid + a touch of acidity</strong>.</p>

<ol>
  <li>Add warm stock to the hot pan</li>
  <li>Scrape the bottom with a spatula to lift the fond</li>
  <li>Add lemon/verjus/mild vinegar once the browned bits release</li>
  <li>Reduce to concentrate flavor</li>
</ol>

<p>You'll get a pan sauce that tastes clean and well-balanced—without alcohol.</p>

<h2>What about red wine?</h2>

<p>When a recipe calls for red wine, you're usually aiming for deeper fruit notes and more intensity. Two reliable approaches:</p>

<ul>
  <li><strong>Stock + red juice</strong> (red grape, cranberry, pomegranate): great for stews, braises, and brown sauces.</li>
  <li><strong>Stock + red wine vinegar</strong> (highly diluted): best when the red wine was used mainly to balance and deglaze.</li>
</ul>

<h2>Vinegar substitution chart</h2>

<p>Replacing vinegar is different from replacing wine: vinegar is already strongly acidic, so you're mostly matching sweetness and aroma.</p>

<div class="substitutes-table">
<table>
  <thead>
    <tr>
      <th>Original vinegar</th>
      <th>Possible substitutes</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>White wine vinegar</td>
      <td>Rice vinegar, cider vinegar, lemon</td>
      <td>Rice is milder, cider is fruitier</td>
    </tr>
    <tr>
      <td>Cider vinegar</td>
      <td>White wine vinegar, rice vinegar</td>
      <td>White wine is more neutral, rice is milder</td>
    </tr>
    <tr>
      <td>Rice vinegar</td>
      <td>Diluted white wine vinegar, diluted cider</td>
      <td>Reduce amount and taste</td>
    </tr>
    <tr>
      <td>Red wine vinegar</td>
      <td>Neutral vinegar + sugar, balsamic</td>
      <td>Balsamic is sweeter</td>
    </tr>
    <tr>
      <td>Balsamic vinegar</td>
      <td>Red wine vinegar + honey</td>
      <td>Or reduce a mild vinegar</td>
    </tr>
  </tbody>
</table>
</div>

<h2>A note on "cooking wine"</h2>

<p>Cooking wine is often salty and lower quality. In most cases, you'll get a better result by using stock + gentle acidity (or verjus) so you can control salt and keep flavors cleaner.</p>

<h2>Summary</h2>

<p>Whether you're making risotto, a sauce for poultry, mussels, or a quick deglaze, the logic remains the same:</p>

<ul>
  <li><strong>Stock</strong> for volume</li>
  <li><strong>Acidity</strong> (lemon, verjus, diluted vinegar) for balance</li>
  <li><strong>Aromatics</strong> (onion, garlic, herbs, reduction) to rebuild complexity</li>
</ul>

<p>With these substitutes, you can cook without wine while keeping your dishes flavorful and well-balanced!</p>
`
};

// ============================================
// IMAGE GENERATION
// ============================================

async function generateImages() {
  console.log('🖼️  Generating article images...');

  const imagesDir = path.join(process.cwd(), 'public', 'images', 'blog');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Featured image (1200x630)
  const featuredSvg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a"/>
          <stop offset="100%" style="stop-color:#2d2d2d"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>

      <!-- Wine glass icon -->
      <g transform="translate(100, 180)">
        <ellipse cx="80" cy="50" rx="60" ry="45" fill="none" stroke="#F7D794" stroke-width="4"/>
        <path d="M80 95 L80 200" stroke="#F7D794" stroke-width="4"/>
        <ellipse cx="80" cy="200" rx="50" ry="15" fill="none" stroke="#F7D794" stroke-width="4"/>
        <ellipse cx="80" cy="50" rx="45" ry="30" fill="#F7D794" opacity="0.3"/>
      </g>

      <!-- Arrow -->
      <g transform="translate(280, 280)">
        <path d="M0 20 L80 20 M60 0 L80 20 L60 40" stroke="#F77313" stroke-width="6" fill="none"/>
      </g>

      <!-- Substitutes icons -->
      <g transform="translate(400, 150)">
        <!-- Lemon -->
        <circle cx="60" cy="60" r="40" fill="#F4D03F"/>
        <ellipse cx="60" cy="60" rx="25" ry="30" fill="#F7DC6F"/>
        <text x="60" y="70" text-anchor="middle" fill="#1a1a1a" font-size="24">🍋</text>

        <!-- Broth -->
        <circle cx="180" cy="60" r="40" fill="#D4AC0D"/>
        <text x="180" y="70" text-anchor="middle" fill="#1a1a1a" font-size="24">🍲</text>

        <!-- Vinegar -->
        <circle cx="300" cy="60" r="40" fill="#85929E"/>
        <text x="300" y="70" text-anchor="middle" fill="#1a1a1a" font-size="24">🫙</text>
      </g>

      <!-- Title -->
      <text x="600" y="380" text-anchor="middle" fill="white" font-size="52" font-weight="bold" font-family="Arial, sans-serif">Remplacer le vin blanc</text>
      <text x="600" y="440" text-anchor="middle" fill="#cccccc" font-size="32" font-family="Arial, sans-serif">Guide complet des substituts</text>

      <!-- Brand -->
      <text x="600" y="580" text-anchor="middle" fill="#F77313" font-size="24" font-weight="bold" font-family="Arial, sans-serif">MENUCOCHON</text>
    </svg>
  `;

  await sharp(Buffer.from(featuredSvg))
    .png()
    .toFile(path.join(imagesDir, 'remplacer-vin-blanc-featured.png'));
  console.log('  ✅ Featured image');

  // Substitutes comparison infographic
  const infographicSvg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#fafafa"/>

      <!-- Title -->
      <rect x="0" y="0" width="800" height="70" fill="#F77313"/>
      <text x="400" y="45" text-anchor="middle" fill="white" font-size="28" font-weight="bold" font-family="Arial, sans-serif">Les 5 meilleurs substituts au vin blanc</text>

      <!-- Items -->
      <g transform="translate(50, 100)">
        <!-- Item 1 -->
        <rect x="0" y="0" width="700" height="80" rx="10" fill="white" stroke="#e0e0e0" stroke-width="2"/>
        <circle cx="45" cy="40" r="30" fill="#4CAF50"/>
        <text x="45" y="48" text-anchor="middle" fill="white" font-size="24" font-weight="bold">1</text>
        <text x="100" y="35" fill="#333" font-size="20" font-weight="bold" font-family="Arial, sans-serif">Bouillon + citron</text>
        <text x="100" y="58" fill="#666" font-size="16" font-family="Arial, sans-serif">Le plus polyvalent - Idéal pour sauces et risottos</text>
        <rect x="550" y="25" width="120" height="30" rx="15" fill="#E8F5E9"/>
        <text x="610" y="45" text-anchor="middle" fill="#4CAF50" font-size="14" font-weight="bold">RECOMMANDÉ</text>
      </g>

      <g transform="translate(50, 195)">
        <rect x="0" y="0" width="700" height="80" rx="10" fill="white" stroke="#e0e0e0" stroke-width="2"/>
        <circle cx="45" cy="40" r="30" fill="#9C27B0"/>
        <text x="45" y="48" text-anchor="middle" fill="white" font-size="24" font-weight="bold">2</text>
        <text x="100" y="35" fill="#333" font-size="20" font-weight="bold" font-family="Arial, sans-serif">Verjus</text>
        <text x="100" y="58" fill="#666" font-size="16" font-family="Arial, sans-serif">Goût le plus proche du vin - Sans alcool</text>
        <rect x="550" y="25" width="120" height="30" rx="15" fill="#F3E5F5"/>
        <text x="610" y="45" text-anchor="middle" fill="#9C27B0" font-size="14" font-weight="bold">PREMIUM</text>
      </g>

      <g transform="translate(50, 290)">
        <rect x="0" y="0" width="700" height="80" rx="10" fill="white" stroke="#e0e0e0" stroke-width="2"/>
        <circle cx="45" cy="40" r="30" fill="#2196F3"/>
        <text x="45" y="48" text-anchor="middle" fill="white" font-size="24" font-weight="bold">3</text>
        <text x="100" y="35" fill="#333" font-size="20" font-weight="bold" font-family="Arial, sans-serif">Vin blanc sans alcool</text>
        <text x="100" y="58" fill="#666" font-size="16" font-family="Arial, sans-serif">Profil aromatique identique</text>
      </g>

      <g transform="translate(50, 385)">
        <rect x="0" y="0" width="700" height="80" rx="10" fill="white" stroke="#e0e0e0" stroke-width="2"/>
        <circle cx="45" cy="40" r="30" fill="#FF9800"/>
        <text x="45" y="48" text-anchor="middle" fill="white" font-size="24" font-weight="bold">4</text>
        <text x="100" y="35" fill="#333" font-size="20" font-weight="bold" font-family="Arial, sans-serif">Jus de raisin + bouillon</text>
        <text x="100" y="58" fill="#666" font-size="16" font-family="Arial, sans-serif">Touche fruitée - Mélange 50/50</text>
      </g>

      <g transform="translate(50, 480)">
        <rect x="0" y="0" width="700" height="80" rx="10" fill="white" stroke="#e0e0e0" stroke-width="2"/>
        <circle cx="45" cy="40" r="30" fill="#607D8B"/>
        <text x="45" y="48" text-anchor="middle" fill="white" font-size="24" font-weight="bold">5</text>
        <text x="100" y="35" fill="#333" font-size="20" font-weight="bold" font-family="Arial, sans-serif">Vinaigre dilué</text>
        <text x="100" y="58" fill="#666" font-size="16" font-family="Arial, sans-serif">Pour déglaçage rapide - Toujours diluer!</text>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(infographicSvg))
    .png()
    .toFile(path.join(imagesDir, 'remplacer-vin-blanc-infographic.png'));
  console.log('  ✅ Infographic');

  // Deglazing steps
  const deglazingSvg = `
    <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="400" fill="#1a1a1a"/>

      <text x="400" y="40" text-anchor="middle" fill="#F77313" font-size="24" font-weight="bold" font-family="Arial, sans-serif">DÉGLACER SANS VIN - 4 ÉTAPES</text>

      <!-- Step 1 -->
      <g transform="translate(50, 80)">
        <rect width="150" height="250" rx="10" fill="#2d2d2d"/>
        <circle cx="75" cy="40" r="25" fill="#F77313"/>
        <text x="75" y="48" text-anchor="middle" fill="white" font-size="20" font-weight="bold">1</text>
        <text x="75" y="100" text-anchor="middle" fill="white" font-size="14" font-family="Arial, sans-serif">Verser le</text>
        <text x="75" y="120" text-anchor="middle" fill="white" font-size="14" font-family="Arial, sans-serif">bouillon</text>
        <text x="75" y="140" text-anchor="middle" fill="white" font-size="14" font-family="Arial, sans-serif">chaud</text>
        <text x="75" y="200" text-anchor="middle" fill="#F77313" font-size="40">🍲</text>
      </g>

      <!-- Arrow -->
      <path d="M210 200 L230 200" stroke="#F77313" stroke-width="3"/>
      <polygon points="230,195 240,200 230,205" fill="#F77313"/>

      <!-- Step 2 -->
      <g transform="translate(250, 80)">
        <rect width="150" height="250" rx="10" fill="#2d2d2d"/>
        <circle cx="75" cy="40" r="25" fill="#F77313"/>
        <text x="75" y="48" text-anchor="middle" fill="white" font-size="20" font-weight="bold">2</text>
        <text x="75" y="100" text-anchor="middle" fill="white" font-size="14" font-family="Arial, sans-serif">Gratter</text>
        <text x="75" y="120" text-anchor="middle" fill="white" font-size="14" font-family="Arial, sans-serif">le fond</text>
        <text x="75" y="200" text-anchor="middle" fill="#F77313" font-size="40">🥄</text>
      </g>

      <!-- Arrow -->
      <path d="M410 200 L430 200" stroke="#F77313" stroke-width="3"/>
      <polygon points="430,195 440,200 430,205" fill="#F77313"/>

      <!-- Step 3 -->
      <g transform="translate(450, 80)">
        <rect width="150" height="250" rx="10" fill="#2d2d2d"/>
        <circle cx="75" cy="40" r="25" fill="#F77313"/>
        <text x="75" y="48" text-anchor="middle" fill="white" font-size="20" font-weight="bold">3</text>
        <text x="75" y="100" text-anchor="middle" fill="white" font-size="14" font-family="Arial, sans-serif">Ajouter</text>
        <text x="75" y="120" text-anchor="middle" fill="white" font-size="14" font-family="Arial, sans-serif">l'acidité</text>
        <text x="75" y="200" text-anchor="middle" fill="#F77313" font-size="40">🍋</text>
      </g>

      <!-- Arrow -->
      <path d="M610 200 L630 200" stroke="#F77313" stroke-width="3"/>
      <polygon points="630,195 640,200 630,205" fill="#F77313"/>

      <!-- Step 4 -->
      <g transform="translate(650, 80)">
        <rect width="150" height="250" rx="10" fill="#2d2d2d"/>
        <circle cx="75" cy="40" r="25" fill="#4CAF50"/>
        <text x="75" y="48" text-anchor="middle" fill="white" font-size="20" font-weight="bold">4</text>
        <text x="75" y="100" text-anchor="middle" fill="white" font-size="14" font-family="Arial, sans-serif">Réduire</text>
        <text x="75" y="120" text-anchor="middle" fill="white" font-size="14" font-family="Arial, sans-serif">la sauce</text>
        <text x="75" y="200" text-anchor="middle" fill="#4CAF50" font-size="40">✓</text>
      </g>

      <text x="400" y="380" text-anchor="middle" fill="#888" font-size="14" font-family="Arial, sans-serif">menucochon.com</text>
    </svg>
  `;

  await sharp(Buffer.from(deglazingSvg))
    .png()
    .toFile(path.join(imagesDir, 'remplacer-vin-blanc-deglacage.png'));
  console.log('  ✅ Deglazing steps');

  return {
    featured: '/images/blog/remplacer-vin-blanc-featured.png',
    infographic: '/images/blog/remplacer-vin-blanc-infographic.png',
    deglazing: '/images/blog/remplacer-vin-blanc-deglacage.png',
  };
}

// ============================================
// DATABASE OPERATIONS
// ============================================

async function createArticle() {
  console.log('\n📝 Creating article in database...');

  // Generate images first
  const images = await generateImages();

  // Add images to content
  const contentWithImages = articleFR.content
    .replace(
      '<h2>Les meilleurs substituts du vin blanc</h2>',
      `<h2>Les meilleurs substituts du vin blanc</h2>\n\n<img src="${images.infographic}" alt="Les 5 meilleurs substituts au vin blanc" class="w-full rounded-lg my-6" />`
    )
    .replace(
      '<h2>Comment déglacer sans vin</h2>',
      `<h2>Comment déglacer sans vin</h2>\n\n<img src="${images.deglazing}" alt="Comment déglacer sans vin en 4 étapes" class="w-full rounded-lg my-6" />`
    );

  const contentENWithImages = articleEN.content
    .replace(
      '<h2>Best white wine substitutes</h2>',
      `<h2>Best white wine substitutes</h2>\n\n<img src="${images.infographic}" alt="Top 5 white wine substitutes" class="w-full rounded-lg my-6" />`
    )
    .replace(
      '<h2>How to deglaze without wine</h2>',
      `<h2>How to deglaze without wine</h2>\n\n<img src="${images.deglazing}" alt="How to deglaze without wine in 4 steps" class="w-full rounded-lg my-6" />`
    );

  // Check if article already exists
  const { data: existing } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', articleFR.slug)
    .single();

  let postId: number;

  if (existing) {
    console.log('  ⚠️  Article already exists, updating...');
    const { error } = await supabase
      .from('posts')
      .update({
        title: articleFR.title,
        excerpt: articleFR.excerpt,
        content: contentWithImages,
        featured_image: images.featured,
        seo_title: articleFR.seoTitle,
        seo_description: articleFR.seoDescription,
        reading_time: articleFR.readingTime,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', articleFR.slug);

    if (error) {
      console.error('Error updating post:', error);
      throw error;
    }
    postId = (existing as { id: number }).id;
  } else {
    // Insert new post
    const { data: newPost, error } = await supabase
      .from('posts')
      .insert({
        slug: articleFR.slug,
        title: articleFR.title,
        excerpt: articleFR.excerpt,
        content: contentWithImages,
        featured_image: images.featured,
        author_id: 1, // Default author
        status: 'published',
        seo_title: articleFR.seoTitle,
        seo_description: articleFR.seoDescription,
        reading_time: articleFR.readingTime,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }
    postId = (newPost as { id: number }).id;
    console.log('  ✅ French article created with ID:', postId);
  }

  // Create/update English translation
  const { data: existingTranslation } = await supabase
    .from('post_translations')
    .select('id')
    .eq('post_id', postId)
    .eq('locale', 'en')
    .single();

  if (existingTranslation) {
    await supabase
      .from('post_translations')
      .update({
        slug_en: articleEN.slugEn,
        title: articleEN.title,
        excerpt: articleEN.excerpt,
        content: contentENWithImages,
        seo_title: articleEN.seoTitle,
        seo_description: articleEN.seoDescription,
      })
      .eq('post_id', postId)
      .eq('locale', 'en');
    console.log('  ✅ English translation updated');
  } else {
    await supabase
      .from('post_translations')
      .insert({
        post_id: postId,
        locale: 'en',
        slug_en: articleEN.slugEn,
        title: articleEN.title,
        excerpt: articleEN.excerpt,
        content: contentENWithImages,
        seo_title: articleEN.seoTitle,
        seo_description: articleEN.seoDescription,
      });
    console.log('  ✅ English translation created');
  }

  return postId;
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('🚀 Creating wine substitute article...\n');

  try {
    const postId = await createArticle();
    console.log('\n✨ Article created successfully!');
    console.log(`   French: https://menucochon.com/blog/${articleFR.slug}`);
    console.log(`   English: https://menucochon.com/en/blog/${articleEN.slugEn}`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
