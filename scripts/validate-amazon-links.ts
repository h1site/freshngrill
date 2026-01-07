#!/usr/bin/env tsx
/**
 * Script de validation statique des liens Amazon
 *
 * Ce script scanne le code source pour détecter:
 * 1. Utilisation de <Link> avec des URLs Amazon (devrait être <a>)
 * 2. Iframes pointant vers Amazon
 * 3. window.location redirigeant vers Amazon
 * 4. Liens Amazon sans rel="nofollow sponsored"
 *
 * Usage:
 *   npm run validate:amazon-links
 *   npx tsx scripts/validate-amazon-links.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SRC_DIR = path.join(process.cwd(), 'src');
const FILE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

// Patterns à détecter
const VIOLATION_PATTERNS = [
  {
    name: '<Link> avec URL Amazon',
    description: 'Utilise <a> direct au lieu de <Link> pour les liens affiliés Amazon',
    pattern: /<Link[^>]*href\s*=\s*["'`][^"'`]*amazon\.[a-z.]+[^"'`]*["'`]/gi,
    severity: 'error' as const,
  },
  {
    name: 'iframe Amazon',
    description: 'Les iframes Amazon sont interdites par le programme affilié',
    pattern: /<iframe[^>]*src\s*=\s*["'`][^"'`]*amazon\.[a-z.]+[^"'`]*["'`]/gi,
    severity: 'error' as const,
  },
  {
    name: 'window.location vers Amazon',
    description: 'Utilise un lien <a> direct au lieu de redirection JS',
    pattern: /window\.location\s*[=.]\s*["'`][^"'`]*amazon\.[a-z.]+/gi,
    severity: 'error' as const,
  },
  {
    name: 'location.href vers Amazon',
    description: 'Utilise un lien <a> direct au lieu de redirection JS',
    pattern: /location\.href\s*=\s*["'`][^"'`]*amazon\.[a-z.]+/gi,
    severity: 'error' as const,
  },
  {
    name: 'window.open Amazon',
    description: 'Considérer <a target="_blank"> au lieu de window.open',
    pattern: /window\.open\s*\(\s*["'`][^"'`]*amazon\.[a-z.]+/gi,
    severity: 'warning' as const,
  },
  {
    name: 'Lien Amazon sans rel approprié',
    description: 'Les liens Amazon doivent avoir rel="nofollow noopener sponsored"',
    // Cherche <a href="...amazon..." sans rel ou avec rel incomplet
    pattern: /<a[^>]*href\s*=\s*["'`][^"'`]*amazon\.[a-z.]+[^"'`]*["'`][^>]*(?!rel\s*=\s*["'`][^"'`]*nofollow[^"'`]*sponsored)/gi,
    severity: 'warning' as const,
  },
];

// Patterns exemptés (fichiers à ignorer)
const EXEMPT_PATTERNS = [
  /node_modules/,
  /\.next/,
  /dist/,
  /build/,
  /\.test\.(ts|tsx|js|jsx)$/,
  /\.spec\.(ts|tsx|js|jsx)$/,
  /validate-amazon-links\.ts$/,
  /__tests__/,
];

interface Violation {
  file: string;
  line: number;
  column: number;
  pattern: string;
  match: string;
  severity: 'error' | 'warning';
  description: string;
}

/**
 * Récupère tous les fichiers à analyser
 */
async function getFilesToScan(): Promise<string[]> {
  const files: string[] = [];

  function walkDir(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Vérifier si le fichier/dossier est exempté
      if (EXEMPT_PATTERNS.some((pattern) => pattern.test(fullPath))) {
        continue;
      }

      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && FILE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  if (fs.existsSync(SRC_DIR)) {
    walkDir(SRC_DIR);
  }

  return files;
}

/**
 * Trouve la position (ligne, colonne) d'un index dans le contenu
 */
function getLineColumn(content: string, index: number): { line: number; column: number } {
  const lines = content.substring(0, index).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

/**
 * Scanne un fichier pour les violations
 */
function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(process.cwd(), filePath);

  for (const { name, pattern, severity, description } of VIOLATION_PATTERNS) {
    // Reset le regex (car il est global)
    pattern.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      const { line, column } = getLineColumn(content, match.index);

      violations.push({
        file: relativePath,
        line,
        column,
        pattern: name,
        match: match[0].substring(0, 80) + (match[0].length > 80 ? '...' : ''),
        severity,
        description,
      });
    }
  }

  return violations;
}

/**
 * Affiche le rapport de violations
 */
function printReport(violations: Violation[]): void {
  const errors = violations.filter((v) => v.severity === 'error');
  const warnings = violations.filter((v) => v.severity === 'warning');

  console.log('\n📋 Rapport de validation des liens Amazon\n');
  console.log('─'.repeat(60));

  if (violations.length === 0) {
    console.log('\n✅ Aucune violation détectée!\n');
    return;
  }

  // Grouper par fichier
  const byFile = violations.reduce(
    (acc, v) => {
      if (!acc[v.file]) acc[v.file] = [];
      acc[v.file].push(v);
      return acc;
    },
    {} as Record<string, Violation[]>
  );

  for (const [file, fileViolations] of Object.entries(byFile)) {
    console.log(`\n📄 ${file}`);

    for (const v of fileViolations) {
      const icon = v.severity === 'error' ? '❌' : '⚠️';
      console.log(`  ${icon} Ligne ${v.line}:${v.column} - ${v.pattern}`);
      console.log(`     ${v.description}`);
      console.log(`     Match: ${v.match}`);
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`\n📊 Résumé:`);
  console.log(`   Erreurs:     ${errors.length}`);
  console.log(`   Avertissements: ${warnings.length}`);
  console.log(`   Total:       ${violations.length}\n`);

  if (errors.length > 0) {
    console.log('❌ La validation a échoué. Corrigez les erreurs ci-dessus.\n');
  } else if (warnings.length > 0) {
    console.log('⚠️  Validation réussie avec avertissements.\n');
  }
}

/**
 * Point d'entrée principal
 */
async function main(): Promise<void> {
  console.log('🔍 Analyse des liens Amazon dans le code source...\n');

  const files = await getFilesToScan();
  console.log(`📁 ${files.length} fichiers à analyser`);

  const allViolations: Violation[] = [];

  for (const file of files) {
    const violations = scanFile(file);
    allViolations.push(...violations);
  }

  printReport(allViolations);

  // Exit code non-zero si erreurs
  const hasErrors = allViolations.some((v) => v.severity === 'error');
  process.exit(hasErrors ? 1 : 0);
}

main().catch((error) => {
  console.error('Erreur:', error);
  process.exit(1);
});
