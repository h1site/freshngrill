-- ============================================================
-- Mise à jour des définitions des épices
-- Définitions originales inspirées de sources culinaires
-- ============================================================

-- Poivres et piments
UPDATE spices SET
  definition_fr = 'Fruit séché du Piper nigrum, le poivre noir est l''épice la plus utilisée au monde. Son arôme pénétrant et son goût piquant proviennent de la pipérine. Originaire de l''Inde, il rehausse pratiquement tous les plats salés.',
  definition_en = 'Dried fruit of Piper nigrum, black pepper is the world''s most used spice. Its pungent aroma and spicy taste come from piperine. Native to India, it enhances virtually all savory dishes.'
WHERE slug = 'poivre-noir';

UPDATE spices SET
  definition_fr = 'Issu du même plant que le poivre noir mais débarrassé de son enveloppe externe, le poivre blanc offre une saveur plus douce et raffinée. Idéal pour les sauces blanches où les points noirs seraient inesthétiques.',
  definition_en = 'From the same plant as black pepper but with its outer skin removed, white pepper offers a milder, more refined flavor. Ideal for white sauces where black specks would be unsightly.'
WHERE slug = 'poivre-blanc';

UPDATE spices SET
  definition_fr = 'Fruit immature du Piper nigrum, le poivre vert conserve une couleur vive et un goût moins piquant que son cousin noir, avec des notes fraîches et légèrement sucrées. Souvent conservé en saumure.',
  definition_en = 'Immature fruit of Piper nigrum, green peppercorn retains a vivid color and less pungent taste than its black cousin, with fresh and slightly sweet notes. Often preserved in brine.'
WHERE slug = 'poivre-vert';

UPDATE spices SET
  definition_fr = 'Originaire des Amériques, le piment tire son piquant de la capsaïcine. Des milliers de variétés existent, du doux au brûlant. Incontournable dans les cuisines mexicaine, indienne et asiatique.',
  definition_en = 'Native to the Americas, chili gets its heat from capsaicin. Thousands of varieties exist, from mild to blazing hot. Essential in Mexican, Indian and Asian cuisines.'
WHERE slug = 'chili';

UPDATE spices SET
  definition_fr = 'Poudre de piments rouges séchés intensément épicée. Le piment de Cayenne apporte une chaleur vive et directe aux plats. À utiliser avec parcimonie pour ne pas masquer les autres saveurs.',
  definition_en = 'Intensely spicy powder from dried red peppers. Cayenne pepper brings a sharp, direct heat to dishes. Use sparingly to avoid masking other flavors.'
WHERE slug = 'piment-cayenne';

UPDATE spices SET
  definition_fr = 'Gousses du Zanthoxylum, le poivre de Sichuan n''est pas un vrai poivre. Son parfum intense d''agrumes s''accompagne d''une sensation unique de picotement engourdissant sur la langue.',
  definition_en = 'Pods from Zanthoxylum, Sichuan pepper isn''t a true pepper. Its intense citrus fragrance comes with a unique tingling, numbing sensation on the tongue.'
WHERE slug = 'poivre-sichuan';

UPDATE spices SET
  definition_fr = 'Cousin népalais du poivre de Sichuan, le poivre Timut se distingue par ses notes prononcées de pamplemousse et de fruit de la passion. Sensation électrisante en bouche.',
  definition_en = 'Nepalese cousin of Sichuan pepper, Timut pepper stands out with pronounced grapefruit and passion fruit notes. Electrifying sensation on the palate.'
WHERE slug = 'poivre-timut';

UPDATE spices SET
  definition_fr = 'Baies roses séchées au goût délicat et légèrement poivré avec des notes fruitées. Malgré son nom, ce n''est pas un vrai poivre mais le fruit du Schinus molle, arbre sud-américain.',
  definition_en = 'Dried pink berries with a delicate, slightly peppery taste and fruity notes. Despite its name, it''s not a true pepper but the fruit of Schinus molle, a South American tree.'
WHERE slug = 'baie-rose';

-- Épices chaudes et douces
UPDATE spices SET
  definition_fr = 'Écorce interne du Cinnamomum, la cannelle de Ceylan est considérée comme la vraie cannelle. Son arôme est doux, sa saveur chaude et enveloppante. Plus subtile que la cassia.',
  definition_en = 'Inner bark of Cinnamomum, Ceylon cinnamon is considered true cinnamon. Its aroma is sweet, its flavor warm and enveloping. More subtle than cassia.'
WHERE slug = 'cannelle-ceylan';

UPDATE spices SET
  definition_fr = 'Plus courante et moins chère que la cannelle de Ceylan, la cassia possède un goût plus prononcé et légèrement plus épicé. Elle domine dans la cuisine asiatique et les pâtisseries américaines.',
  definition_en = 'More common and less expensive than Ceylon cinnamon, cassia has a stronger, slightly spicier taste. It dominates in Asian cuisine and American pastries.'
WHERE slug = 'cannelle-cassia';

UPDATE spices SET
  definition_fr = 'Bourgeons séchés du Syzygium aromaticum, les clous de girofle possèdent un arôme puissant et un goût intense. Originaires des îles Moluques, ils parfument aussi bien les plats sucrés que salés.',
  definition_en = 'Dried buds of Syzygium aromaticum, cloves have a powerful aroma and intense flavor. Native to the Moluccas Islands, they flavor both sweet and savory dishes.'
WHERE slug = 'clou-girofle';

UPDATE spices SET
  definition_fr = 'Graine du Myristica fragrans, la noix de muscade offre un parfum chaud et doux avec des notes rappelant le poivre et la cannelle. Râpée fraîche, elle parfume béchamels, purées et desserts.',
  definition_en = 'Seed of Myristica fragrans, nutmeg offers a warm, sweet fragrance with notes reminiscent of pepper and cinnamon. Freshly grated, it flavors béchamels, purées and desserts.'
WHERE slug = 'muscade';

UPDATE spices SET
  definition_fr = 'Enveloppe rouge-orangée qui recouvre la noix de muscade, le macis offre un arôme plus délicat et subtil. Parfait pour les plats délicats où la muscade serait trop prononcée.',
  definition_en = 'Red-orange membrane covering the nutmeg, mace offers a more delicate and subtle aroma. Perfect for delicate dishes where nutmeg would be too pronounced.'
WHERE slug = 'macis';

UPDATE spices SET
  definition_fr = 'Rhizome du Curcuma longa, le curcuma produit une poudre jaune-orangée au parfum terreux et au goût chaud légèrement amer. Colorant naturel puissant, base du curry.',
  definition_en = 'Rhizome of Curcuma longa, turmeric produces a yellow-orange powder with an earthy fragrance and warm, slightly bitter taste. Powerful natural colorant, curry base.'
WHERE slug = 'curcuma';

UPDATE spices SET
  definition_fr = 'Racine du Zingiber officinale, le gingembre possède un arôme piquant et un goût épicé intensément réchauffant. Frais ou séché, il est essentiel dans les cuisines asiatiques.',
  definition_en = 'Root of Zingiber officinale, ginger has a pungent aroma and intensely warming spicy taste. Fresh or dried, it''s essential in Asian cuisines.'
WHERE slug = 'gingembre';

UPDATE spices SET
  definition_fr = 'Gousses vertes de l''Elettaria cardamomum, la cardamome verte offre un arôme riche et complexe avec des notes de citron et d''eucalyptus. Troisième épice la plus chère au monde.',
  definition_en = 'Green pods of Elettaria cardamomum, green cardamom offers a rich, complex aroma with notes of lemon and eucalyptus. Third most expensive spice in the world.'
WHERE slug = 'cardamome-verte';

UPDATE spices SET
  definition_fr = 'Plus grandes que les vertes, les gousses de cardamome noire ont un parfum distinctement fumé avec des notes de résine et de pin. Incontournable dans les currys indiens du nord.',
  definition_en = 'Larger than green pods, black cardamom has a distinctly smoky fragrance with resin and pine notes. Essential in northern Indian curries.'
WHERE slug = 'cardamome-noire';

UPDATE spices SET
  definition_fr = 'Stigmates du Crocus sativus, le safran est l''épice la plus précieuse au monde. Son goût unique, herbacé et légèrement amer, colore les plats d''un jaune doré incomparable.',
  definition_en = 'Stigmas of Crocus sativus, saffron is the world''s most precious spice. Its unique, herbaceous and slightly bitter taste colors dishes an incomparable golden yellow.'
WHERE slug = 'safran';

UPDATE spices SET
  definition_fr = 'Gousses du Vanilla planifolia, la vanille offre un arôme doux et enveloppant avec des notes boisées et florales. Son goût riche et complexe en fait la reine des desserts.',
  definition_en = 'Pods of Vanilla planifolia, vanilla offers a sweet, enveloping aroma with woody and floral notes. Its rich, complex taste makes it the queen of desserts.'
WHERE slug = 'vanille';

-- Graines aromatiques
UPDATE spices SET
  definition_fr = 'Graines du Cuminum cyminum, le cumin possède un parfum chaud et terreux avec un goût légèrement amer et une note sucrée. Pilier des cuisines indienne, mexicaine et moyen-orientale.',
  definition_en = 'Seeds of Cuminum cyminum, cumin has a warm, earthy fragrance with a slightly bitter taste and sweet note. Pillar of Indian, Mexican and Middle Eastern cuisines.'
WHERE slug = 'cumin';

UPDATE spices SET
  definition_fr = 'Graines rondes du Coriandrum sativum, la coriandre en graines offre un parfum doux et épicé avec des notes d''agrumes. Goût très différent des feuilles fraîches de la même plante.',
  definition_en = 'Round seeds of Coriandrum sativum, coriander seeds offer a sweet, spicy fragrance with citrus notes. Very different taste from the fresh leaves of the same plant.'
WHERE slug = 'coriandre-graines';

UPDATE spices SET
  definition_fr = 'Fruits en forme d''étoile de l''Illicium verum, l''anis étoilé ou badiane possède un parfum doux et pénétrant avec un goût intense rappelant la réglisse.',
  definition_en = 'Star-shaped fruits of Illicium verum, star anise or badiane has a sweet, penetrating fragrance with an intense licorice-like taste.'
WHERE slug = 'anis-etoile';

UPDATE spices SET
  definition_fr = 'Graines du Pimpinella anisum, l''anis vert offre un arôme doux et une saveur rappelant la réglisse. Plus délicat que l''anis étoilé, il parfume pains, gâteaux et liqueurs.',
  definition_en = 'Seeds of Pimpinella anisum, green anise offers a sweet aroma and licorice-like flavor. More delicate than star anise, it flavors breads, cakes and liqueurs.'
WHERE slug = 'anis-vert';

UPDATE spices SET
  definition_fr = 'Graines du Carum carvi, le carvi possède un parfum intense et un goût rappelant l''anis. Indispensable dans la cuisine germanique pour la choucroute et les pains de seigle.',
  definition_en = 'Seeds of Carum carvi, caraway has an intense fragrance and anise-like taste. Essential in Germanic cuisine for sauerkraut and rye breads.'
WHERE slug = 'carvi';

UPDATE spices SET
  definition_fr = 'Graines ovales du Foeniculum vulgare, le fenouil offre un parfum doux rappelant l''anis avec un goût légèrement sucré. Excellent avec le poisson et dans les desserts.',
  definition_en = 'Oval seeds of Foeniculum vulgare, fennel offers a sweet anise-like fragrance with a slightly sweet taste. Excellent with fish and in desserts.'
WHERE slug = 'fenouil-graines';

UPDATE spices SET
  definition_fr = 'Graines du Trigonella foenum-graecum, le fenugrec possède un arôme fort avec des notes sucrées rappelant le céleri et la muscade. Base de nombreux mélanges d''épices indiens.',
  definition_en = 'Seeds of Trigonella foenum-graecum, fenugreek has a strong aroma with sweet notes reminiscent of celery and nutmeg. Base of many Indian spice blends.'
WHERE slug = 'fenugrec';

UPDATE spices SET
  definition_fr = 'Petites graines noires de la Nigella sativa au goût légèrement amer et poivré avec des notes d''oignon. Traditionnellement parsemées sur les pains naan et pita.',
  definition_en = 'Small black seeds of Nigella sativa with a slightly bitter, peppery taste and onion notes. Traditionally sprinkled on naan and pita breads.'
WHERE slug = 'graines-nigelle';

UPDATE spices SET
  definition_fr = 'Petites graines du moutardier au goût piquant qui se libère quand elles sont broyées ou chauffées dans l''huile. Jaunes pour la douceur, noires pour l''intensité.',
  definition_en = 'Small mustard plant seeds with a pungent taste released when crushed or heated in oil. Yellow for mildness, black for intensity.'
WHERE slug = 'graines-moutarde-jaune';

UPDATE spices SET
  definition_fr = 'Plus piquantes que les jaunes, les graines de moutarde noire éclatent dans l''huile chaude en libérant un arôme de noisette. Essentielles dans les currys du sud de l''Inde.',
  definition_en = 'More pungent than yellow, black mustard seeds pop in hot oil releasing a nutty aroma. Essential in South Indian curries.'
WHERE slug = 'graines-moutarde-noire';

UPDATE spices SET
  definition_fr = 'Graines du Sesamum indicum au goût rappelant la noisette, surtout une fois grillées. Base du tahini et de l''huile de sésame, essentielles en cuisine asiatique et moyen-orientale.',
  definition_en = 'Seeds of Sesamum indicum with a nutty taste, especially when toasted. Base of tahini and sesame oil, essential in Asian and Middle Eastern cuisine.'
WHERE slug = 'graines-sesame-blanc';

UPDATE spices SET
  definition_fr = 'Version non décortiquée du sésame, les graines noires ont un goût plus prononcé et terreux. Populaires dans la cuisine japonaise pour leur aspect décoratif.',
  definition_en = 'Unhulled version of sesame, black seeds have a more pronounced, earthy taste. Popular in Japanese cuisine for their decorative aspect.'
WHERE slug = 'graines-sesame-noir';

UPDATE spices SET
  definition_fr = 'Petites graines huileuses du Papaver somniferum au goût légèrement noisette. Parfaites en pâtisserie, sur les bagels et dans les currys indiens.',
  definition_en = 'Small oily seeds of Papaver somniferum with a slightly nutty taste. Perfect in pastries, on bagels and in Indian curries.'
WHERE slug = 'graines-pavot';

-- Herbes aromatiques séchées
UPDATE spices SET
  definition_fr = 'Feuilles persistantes du Laurus nobilis, le laurier possède un arôme frais et balsamique avec un goût piquant légèrement sucré. Indispensable dans les bouquets garnis et les mijotés.',
  definition_en = 'Evergreen leaves of Laurus nobilis, bay leaf has a fresh, balsamic aroma with a piquant, slightly sweet taste. Essential in bouquet garni and stews.'
WHERE slug = 'laurier';

UPDATE spices SET
  definition_fr = 'Feuilles du Thymus vulgaris, le thym possède un arôme pénétrant et un goût piquant avec des notes de citron et de menthe. Pilier des herbes de Provence.',
  definition_en = 'Leaves of Thymus vulgaris, thyme has a penetrating aroma and piquant taste with lemon and mint notes. Pillar of Provençal herbs.'
WHERE slug = 'thym';

UPDATE spices SET
  definition_fr = 'Feuilles du Rosmarinus officinalis, le romarin offre un arôme intense et camphré avec des notes balsamiques et boisées. Parfait avec l''agneau et les pommes de terre.',
  definition_en = 'Leaves of Rosmarinus officinalis, rosemary offers an intense, camphor-like aroma with balsamic and woody notes. Perfect with lamb and potatoes.'
WHERE slug = 'romarin';

UPDATE spices SET
  definition_fr = 'Feuilles du Salvia officinalis, la sauge possède un parfum pénétrant avec des nuances de citron et d''eucalyptus. Son goût légèrement amer accompagne parfaitement le porc et le veau.',
  definition_en = 'Leaves of Salvia officinalis, sage has a penetrating fragrance with lemon and eucalyptus nuances. Its slightly bitter taste perfectly accompanies pork and veal.'
WHERE slug = 'sarriette';

UPDATE spices SET
  definition_fr = 'Feuilles du Origanum vulgare, l''origan possède un parfum piquant et une saveur chaude légèrement amère. Incontournable sur les pizzas et dans la cuisine méditerranéenne.',
  definition_en = 'Leaves of Origanum vulgare, oregano has a piquant fragrance and warm, slightly bitter flavor. Essential on pizzas and in Mediterranean cuisine.'
WHERE slug = 'origan';

UPDATE spices SET
  definition_fr = 'Feuilles du Origanum majorana, la marjolaine offre un arôme plus délicat que l''origan avec des notes douces et florales. Parfaite dans les farces et les plats de viande.',
  definition_en = 'Leaves of Origanum majorana, marjoram offers a more delicate aroma than oregano with sweet, floral notes. Perfect in stuffings and meat dishes.'
WHERE slug = 'marjolaine';

UPDATE spices SET
  definition_fr = 'Feuilles du Ocimum basilicum séchées, le basilic conserve une partie de son parfum inimitable, doux et légèrement piquant. Moins parfumé que frais mais pratique hors saison.',
  definition_en = 'Dried leaves of Ocimum basilicum, basil retains part of its unmistakable sweet, slightly piquant fragrance. Less aromatic than fresh but convenient off-season.'
WHERE slug = 'basilic-seche';

UPDATE spices SET
  definition_fr = 'Feuilles de Mentha séchées, la menthe conserve son arôme frais et piquant dû au menthol. Parfaite pour les thés, les sauces et les plats moyen-orientaux.',
  definition_en = 'Dried Mentha leaves, mint retains its fresh, piquant aroma due to menthol. Perfect for teas, sauces and Middle Eastern dishes.'
WHERE slug = 'menthe-sechee';

UPDATE spices SET
  definition_fr = 'Feuilles du Petroselinum crispum séchées, le persil garde un parfum frais et poivré. Moins parfumé que frais, il reste un assaisonnement de base polyvalent.',
  definition_en = 'Dried leaves of Petroselinum crispum, parsley keeps a fresh, peppery fragrance. Less aromatic than fresh, it remains a versatile basic seasoning.'
WHERE slug = 'persil-seche';

-- Épices exotiques
UPDATE spices SET
  definition_fr = 'Rhizome de l''Alpinia galanga, le galanga possède un arôme piquant et épicé avec des notes de pin et de citron. Plus fort que le gingembre, essentiel dans la cuisine thaïe.',
  definition_en = 'Rhizome of Alpinia galanga, galangal has a pungent, spicy aroma with pine and citrus notes. Stronger than ginger, essential in Thai cuisine.'
WHERE slug = 'galanga';

UPDATE spices SET
  definition_fr = 'Résine séchée du Ferula assa-foetida, l''asafoetida possède une odeur très forte et désagréable crue, qui se transforme en saveur subtile d''ail et d''oignon à la cuisson.',
  definition_en = 'Dried resin of Ferula assa-foetida, asafoetida has a very strong, unpleasant raw odor that transforms into subtle garlic and onion flavor when cooked.'
WHERE slug = 'asafoetida';

UPDATE spices SET
  definition_fr = 'Baies moulues du Rhus coriaria, le sumac offre un goût agrumes acidulé et léger. Alternative au citron dans la cuisine moyen-orientale, notamment dans le fattoush.',
  definition_en = 'Ground berries of Rhus coriaria, sumac offers a light, tangy citrus taste. Lemon alternative in Middle Eastern cuisine, notably in fattoush.'
WHERE slug = 'sumac';

UPDATE spices SET
  definition_fr = 'Cônes femelles du Juniperus communis, les baies de genièvre ont une saveur piquante et résineuse avec des notes boisées et sucrées. Essentielles pour le gin et la choucroute.',
  definition_en = 'Female cones of Juniperus communis, juniper berries have a pungent, resinous flavor with woody, sweet notes. Essential for gin and sauerkraut.'
WHERE slug = 'baie-genievre';

UPDATE spices SET
  definition_fr = 'Fruits séchés du Pimenta dioica, le piment de la Jamaïque possède un parfum complexe rappelant le clou de girofle, la cannelle et la muscade réunis.',
  definition_en = 'Dried fruits of Pimenta dioica, allspice has a complex fragrance reminiscent of clove, cinnamon and nutmeg combined.'
WHERE slug = 'bois-inde';

UPDATE spices SET
  definition_fr = 'Graines du Aframomum melegueta, les grains de paradis ou maniguette ont un arôme intense rappelant le poivre, la cardamome et le gingembre. Épice africaine redécouverte.',
  definition_en = 'Seeds of Aframomum melegueta, grains of paradise have an intense aroma reminiscent of pepper, cardamom and ginger. Rediscovered African spice.'
WHERE slug = 'maniguette';

UPDATE spices SET
  definition_fr = 'Tiges du Cymbopogon citratus, la citronnelle possède un arôme frais et citronné intense. Pilier de la cuisine thaïe et vietnamienne, elle parfume soupes et currys.',
  definition_en = 'Stalks of Cymbopogon citratus, lemongrass has an intense, fresh citrus aroma. Pillar of Thai and Vietnamese cuisine, it flavors soups and curries.'
WHERE slug = 'citronnelle';

UPDATE spices SET
  definition_fr = 'Graines du Prunus mahaleb, le mahlep possède un parfum doux rappelant un croisement entre la cerise et l''amande. Utilisé dans les pâtisseries grecques et moyen-orientales.',
  definition_en = 'Seeds of Prunus mahaleb, mahleb has a sweet fragrance reminiscent of a cherry-almond cross. Used in Greek and Middle Eastern pastries.'
WHERE slug = 'mahlep';

UPDATE spices SET
  definition_fr = 'Racine du Glycyrrhiza glabra, la réglisse offre un arôme doux et légèrement amer. Utilisée aussi bien dans les préparations sucrées que dans certains plats salés.',
  definition_en = 'Root of Glycyrrhiza glabra, licorice offers a sweet, slightly bitter aroma. Used in both sweet preparations and some savory dishes.'
WHERE slug = 'reglisse-moulue';

-- Mélanges d'épices
UPDATE spices SET
  definition_fr = 'Mélange d''épices nord-indien signifiant "épices chaudes". Composition variable incluant généralement cardamome, cannelle, clou de girofle, cumin et poivre noir.',
  definition_en = 'North Indian spice blend meaning "warm spices". Variable composition generally including cardamom, cinnamon, cloves, cumin and black pepper.'
WHERE slug = 'garam-masala';

UPDATE spices SET
  definition_fr = 'Mélange marocain pouvant contenir jusqu''à 30 épices. Son nom signifie "tête de la boutique" - le meilleur du marchand. Parfume tajines et couscous.',
  definition_en = 'Moroccan blend that can contain up to 30 spices. Its name means "head of the shop" - the merchant''s best. Flavors tagines and couscous.'
WHERE slug = 'ras-el-hanout';

UPDATE spices SET
  definition_fr = 'Mélange moyen-oriental à base de thym, sumac et graines de sésame. Son nom signifie "thym" en arabe. Parfait avec le pain, l''huile d''olive et le labneh.',
  definition_en = 'Middle Eastern blend based on thyme, sumac and sesame seeds. Its name means "thyme" in Arabic. Perfect with bread, olive oil and labneh.'
WHERE slug = 'zaatar';

UPDATE spices SET
  definition_fr = 'Mélange provençal traditionnel incluant thym, romarin, origan, sarriette et souvent lavande. Évoque les collines parfumées du sud de la France.',
  definition_en = 'Traditional Provençal blend including thyme, rosemary, oregano, savory and often lavender. Evokes the fragrant hills of southern France.'
WHERE slug = 'herbes-provence';

UPDATE spices SET
  definition_fr = 'Mélange chinois traditionnel de cinq saveurs: anis étoilé, clou de girofle, cannelle, poivre de Sichuan et graines de fenouil. Base des marinades cantonaises.',
  definition_en = 'Traditional Chinese blend of five flavors: star anise, cloves, cinnamon, Sichuan pepper and fennel seeds. Base for Cantonese marinades.'
WHERE slug = 'melange-cinq-epices';

UPDATE spices SET
  definition_fr = 'Mélange éthiopien épicé et complexe incluant piment, gingembre, coriandre, cardamome et fenugrec. Base des ragoûts éthiopiens traditionnels.',
  definition_en = 'Spicy, complex Ethiopian blend including chili, ginger, coriander, cardamom and fenugreek. Base for traditional Ethiopian stews.'
WHERE slug = 'berbere';

UPDATE spices SET
  definition_fr = 'Mélange japonais de sept épices incluant piment, poivre de Sichuan, zeste d''agrume et graines de sésame. Parfait sur les nouilles et les soupes.',
  definition_en = 'Japanese seven-spice blend including chili, Sichuan pepper, citrus zest and sesame seeds. Perfect on noodles and soups.'
WHERE slug = 'shichimi-togarashi';

UPDATE spices SET
  definition_fr = 'Mélange égyptien croquant de noix, graines et épices grillées. Traditionnellement servi avec du pain trempé dans l''huile d''olive.',
  definition_en = 'Crunchy Egyptian blend of roasted nuts, seeds and spices. Traditionally served with bread dipped in olive oil.'
WHERE slug = 'dukkah';

UPDATE spices SET
  definition_fr = 'Mélange indien pour marinades au tandoor, coloré de paprika et de piment. Parfait pour le poulet, l''agneau et les légumes grillés.',
  definition_en = 'Indian blend for tandoor marinades, colored with paprika and chili. Perfect for chicken, lamb and grilled vegetables.'
WHERE slug = 'tandoori-masala';

UPDATE spices SET
  definition_fr = 'Mélange cajun de Louisiane alliant paprika, ail, oignon, poivre et herbes. Saveur relevée typique de la cuisine créole et cajun.',
  definition_en = 'Louisiana Cajun blend combining paprika, garlic, onion, pepper and herbs. The zesty flavor typical of Creole and Cajun cuisine.'
WHERE slug = 'melange-cajun';

UPDATE spices SET
  definition_fr = 'Mélange caribéen épicé pour marinades jamaïcaines. Combine piment de la Jamaïque, thym, piment Scotch bonnet et épices chaudes.',
  definition_en = 'Spicy Caribbean blend for Jamaican marinades. Combines allspice, thyme, Scotch bonnet pepper and warm spices.'
WHERE slug = 'melange-jerk';

-- Paprikas
UPDATE spices SET
  definition_fr = 'Poudre de piments doux séchés au goût fruité et légèrement sucré. Apporte couleur et saveur sans piquant. Essentiel dans la cuisine hongroise et espagnole.',
  definition_en = 'Powder from dried sweet peppers with a fruity, slightly sweet taste. Adds color and flavor without heat. Essential in Hungarian and Spanish cuisine.'
WHERE slug = 'paprika-doux';

UPDATE spices SET
  definition_fr = 'Paprika fumé au bois de chêne, spécialité espagnole d''Estrémadure. Son parfum de fumée profond transforme les plats de viande et les légumineuses.',
  definition_en = 'Oak-smoked paprika, a specialty from Extremadura, Spain. Its deep smoky aroma transforms meat dishes and legumes.'
WHERE slug = 'paprika-fume';

UPDATE spices SET
  definition_fr = 'Paprika avec une bonne dose de piquant, pour ceux qui aiment la chaleur en plus de la couleur. Populaire dans les goulashs et les plats relevés.',
  definition_en = 'Paprika with a good dose of heat, for those who like warmth along with color. Popular in goulash and spicy dishes.'
WHERE slug = 'paprika-fort';

-- Piments mexicains
UPDATE spices SET
  definition_fr = 'Piment jalapeño fumé et séché, le chipotle possède une saveur fumée profonde avec une chaleur moyenne. Incontournable dans la cuisine tex-mex et les sauces barbecue.',
  definition_en = 'Smoked and dried jalapeño, chipotle has a deep smoky flavor with medium heat. Essential in Tex-Mex cuisine and barbecue sauces.'
WHERE slug = 'chipotle';

UPDATE spices SET
  definition_fr = 'Version séchée du piment poblano, l''ancho offre un goût fruité avec des notes de raisin sec et une chaleur douce. Base des sauces mole mexicaines.',
  definition_en = 'Dried version of poblano pepper, ancho offers a fruity taste with raisin notes and mild heat. Base for Mexican mole sauces.'
WHERE slug = 'piment-ancho';

UPDATE spices SET
  definition_fr = 'Piment séché mexicain à la peau lisse et brillante, le guajillo offre une saveur fruitée légèrement acidulée avec une chaleur modérée. Excellent dans les salsas.',
  definition_en = 'Dried Mexican chili with smooth, shiny skin, guajillo offers a fruity, slightly tangy flavor with moderate heat. Excellent in salsas.'
WHERE slug = 'piment-guajillo';

-- Ails et oignons
UPDATE spices SET
  definition_fr = 'Bulbe de l''Allium sativum, l''ail est l''aromate le plus utilisé au monde après le sel et le poivre. Son parfum puissant et sa saveur piquante parfument toutes les cuisines.',
  definition_en = 'Bulb of Allium sativum, garlic is the most used aromatic in the world after salt and pepper. Its powerful aroma and pungent flavor enhance all cuisines.'
WHERE slug = 'ail';

UPDATE spices SET
  definition_fr = 'Ail fermenté à basse température pendant plusieurs semaines. Les gousses noires et moelleuses développent un goût sucré et umami, sans l''âcreté de l''ail cru.',
  definition_en = 'Garlic fermented at low temperature for several weeks. The soft black cloves develop a sweet, umami taste without raw garlic''s sharpness.'
WHERE slug = 'ail-noir';

UPDATE spices SET
  definition_fr = 'Ail déshydraté et réduit en poudre, pratique pour assaisonner quand l''ail frais n''est pas disponible. Saveur plus douce et moins piquante que l''ail frais.',
  definition_en = 'Dehydrated garlic ground to powder, convenient for seasoning when fresh garlic isn''t available. Milder, less pungent flavor than fresh garlic.'
WHERE slug = 'ail-en-poudre';

UPDATE spices SET
  definition_fr = 'Oignon déshydraté et réduit en poudre fine. Pratique pour les marinades sèches et les assaisonnements. Saveur d''oignon concentrée sans l''humidité.',
  definition_en = 'Dehydrated onion ground to fine powder. Convenient for dry rubs and seasonings. Concentrated onion flavor without moisture.'
WHERE slug = 'oignon-en-poudre';

-- Afficher le nombre de définitions mises à jour
SELECT COUNT(*) as updated_spices FROM spices WHERE definition_fr IS NOT NULL;
