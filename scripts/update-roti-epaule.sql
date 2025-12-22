-- Script pour améliorer la recette "Rôti d'Épaule de Porc" (FR/EN)
-- 1. Ajouter colonne content à recipe_translations (si pas déjà présente)
-- 2. Mettre à jour FAQ + nutrition FR
-- 3. Mettre à jour FAQ + content EN

-- Étape 1: Ajouter colonne content à recipe_translations
ALTER TABLE recipe_translations ADD COLUMN IF NOT EXISTS content TEXT;

-- Étape 2: Mettre à jour la recette FR avec FAQ et nutrition
UPDATE recipes
SET
  faq = '<div itemscope itemtype="https://schema.org/FAQPage">
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Comment savoir si le rôti d''épaule de porc est cuit?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">La température interne doit atteindre 85°C (185°F) pour une viande effilochée parfaite. Utilisez un thermomètre à viande pour vérifier. La viande doit se défaire facilement à la fourchette.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Peut-on congeler le rôti d''épaule de porc?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Oui! Le rôti se congèle très bien jusqu''à 3 mois. Emballez-le hermétiquement dans un contenant ou sac de congélation et décongelez au réfrigérateur pendant 24 heures avant de réchauffer.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Quels accompagnements servir avec le rôti d''épaule de porc?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Purée de pommes de terre, légumes rôtis (carottes, navets, panais), salade de chou crémeuse ou pain croûté pour absorber le délicieux jus de cuisson.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Comment réchauffer les restes de rôti d''épaule?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Au four à 150°C (300°F) pendant 20-30 minutes recouvert de papier d''aluminium, ou à la poêle avec un peu de bouillon pour garder la viande juteuse. Évitez le micro-ondes qui assèche la viande.</p>
</div></div>
</div>',
  nutrition = '{"calories": 450, "protein": 35, "fat": 28, "carbs": 8, "fiber": 1}'::jsonb
WHERE slug = 'roti-epaule-de-porc';

-- Étape 3: Mettre à jour la traduction EN avec FAQ et content (astuces)
UPDATE recipe_translations
SET
  content = '<p><strong>Why pork shoulder for slow roasting:</strong> Pork shoulder is ideal for slow cooking because its fat melts gradually, making the meat extremely tender and flavorful. The connective tissue breaks down over the long cooking time, resulting in meat that practically falls apart.</p>
<p><strong>Pro tip:</strong> Let the roast rest at room temperature for 30 minutes before cooking for more even results. After cooking, tent with foil and rest for at least 15 minutes before slicing or pulling.</p>
<p><strong>For crispy skin:</strong> If you want crispy crackling, uncover the roast for the last 30-45 minutes and increase oven temperature to 425°F (220°C).</p>',
  faq = '<div itemscope itemtype="https://schema.org/FAQPage">
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">How do I know when the pork shoulder roast is done?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">The internal temperature should reach 185°F (85°C) for perfect pulled pork. Use a meat thermometer to check. The meat should easily shred with a fork when done.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Can I freeze pork shoulder roast?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Yes! The roast freezes very well for up to 3 months. Wrap it tightly in a freezer-safe container or bag and thaw in the refrigerator for 24 hours before reheating.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">What sides go well with pork shoulder roast?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Mashed potatoes, roasted root vegetables (carrots, turnips, parsnips), creamy coleslaw, or crusty bread to soak up the delicious cooking juices.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">How to reheat leftover pork shoulder?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">In the oven at 300°F (150°C) for 20-30 minutes covered with foil, or in a skillet with a splash of broth to keep the meat juicy. Avoid the microwave as it tends to dry out the meat.</p>
</div></div>
</div>'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'roti-epaule-de-porc')
AND locale = 'en';

-- Vérification
SELECT r.slug, r.faq IS NOT NULL as has_faq_fr, r.nutrition IS NOT NULL as has_nutrition,
       t.content IS NOT NULL as has_content_en, t.faq IS NOT NULL as has_faq_en
FROM recipes r
LEFT JOIN recipe_translations t ON r.id = t.recipe_id AND t.locale = 'en'
WHERE r.slug = 'roti-epaule-de-porc';
