# Menu Cochon - Site de Recettes Next.js

Site de recettes moderne construit avec Next.js 14, TypeScript et Tailwind CSS.

## Migration depuis WordPress

### Étape 1: Exporter les données de WordPress

1. Copiez `scripts/wp-export-recipes.php` à la racine de votre WordPress
2. Accédez à: `https://votre-site.com/wp-export-recipes.php?secret=menucochon2024&download=1`
3. Téléchargez le fichier JSON généré
4. Placez-le dans `src/data/recipes.json`

### Étape 2: Télécharger les images (optionnel)

```bash
# Installer ts-node si nécessaire
npm install -D ts-node

# Exécuter le script de téléchargement
npx ts-node scripts/download-images.ts
```

Les images seront téléchargées dans `public/images/recipes/` et un nouveau fichier `recipes-local.json` sera créé avec les chemins locaux.

### Étape 3: Mettre à jour la source de données

Dans `src/lib/recipes.ts`, modifiez l'import pour utiliser le fichier local:
```typescript
import recipesJson from '@/data/recipes-local.json';
```

## Développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Build et Déploiement

```bash
# Build pour production
npm run build

# Démarrer en production
npm start
```

### Export statique

Pour générer un site statique (idéal pour hébergement sur CDN):

1. Dans `next.config.ts`, décommentez `output: 'export'`
2. Exécutez `npm run build`
3. Le site sera généré dans le dossier `out/`

## Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── recettes/          # Liste et détail des recettes
│   └── layout.tsx         # Layout principal
├── components/
│   ├── layout/            # Header, Footer
│   └── recipe/            # Composants de recettes
├── data/                   # Fichiers JSON des recettes
├── lib/                    # Utilitaires et fonctions
└── types/                  # Types TypeScript

scripts/
├── wp-export-recipes.php   # Script d'export WordPress
└── download-images.ts      # Script de téléchargement d'images
```

## Fonctionnalités

- Pages de recettes avec Schema.org pour SEO
- Grille de recettes responsive
- Filtres par catégorie, difficulté, temps
- Ajustement des portions dynamique
- Progression des étapes
- Design moderne avec Tailwind CSS
- Support des images optimisées
- Mode impression

## Configuration

Les options principales sont dans `next.config.ts`:

- `images.remotePatterns`: Domaines autorisés pour les images
- `output`: Mode de build (par défaut: server, 'export' pour statique)
- `trailingSlash`: URLs avec slash final

## Technologies

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide Icons
