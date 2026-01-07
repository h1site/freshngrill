import { NextRequest, NextResponse } from 'next/server';
import { writeFile, appendFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

/**
 * API Route: POST /api/affiliate-click
 *
 * Endpoint de tracking pour les clics sur liens affiliés Amazon
 * - Log console pour monitoring
 * - Écriture fichier optionnelle pour analyse
 * - Support Supabase si configuré (TODO)
 */

// Chemin du fichier de log (en développement)
const LOG_FILE = process.env.AFFILIATE_LOG_FILE || '/tmp/affiliate-clicks.log';

// Flag pour activer/désactiver le logging fichier
const ENABLE_FILE_LOG = process.env.NODE_ENV === 'development' || process.env.AFFILIATE_FILE_LOG === 'true';

interface AffiliateClickPayload {
  ts: string;
  query: string;
  href: string;
  pagePath: string;
  domain: string;
  tag: string;
  extra?: Record<string, unknown>;
}

interface LogEntry extends AffiliateClickPayload {
  ip?: string;
  userAgent?: string;
  referer?: string;
  receivedAt: string;
}

/**
 * Valide le payload reçu
 */
function isValidPayload(data: unknown): data is AffiliateClickPayload {
  if (!data || typeof data !== 'object') return false;

  const payload = data as Record<string, unknown>;

  return (
    typeof payload.ts === 'string' &&
    typeof payload.query === 'string' &&
    typeof payload.href === 'string' &&
    typeof payload.pagePath === 'string' &&
    typeof payload.domain === 'string' &&
    typeof payload.tag === 'string'
  );
}

/**
 * Écrit l'entrée dans le fichier de log
 */
async function writeToLogFile(entry: LogEntry): Promise<void> {
  if (!ENABLE_FILE_LOG) return;

  try {
    const logLine = JSON.stringify(entry) + '\n';

    if (!existsSync(LOG_FILE)) {
      await writeFile(LOG_FILE, logLine, 'utf-8');
    } else {
      await appendFile(LOG_FILE, logLine, 'utf-8');
    }
  } catch (error) {
    console.error('[Affiliate Tracking] Erreur écriture fichier:', error);
  }
}

/**
 * POST /api/affiliate-click
 *
 * Body attendu (JSON):
 * {
 *   ts: string,        // Timestamp ISO du clic
 *   query: string,     // Mots-clés de recherche
 *   href: string,      // URL complète du lien
 *   pagePath: string,  // Page d'origine
 *   domain: string,    // Domaine Amazon
 *   tag: string,       // Tag affilié
 *   extra?: object     // Données supplémentaires
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parser le body JSON
    const data = await request.json();

    // Valider le payload
    if (!isValidPayload(data)) {
      return NextResponse.json(
        { error: 'Invalid payload', received: typeof data },
        { status: 400 }
      );
    }

    // Extraire les headers utiles
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referer = request.headers.get('referer') || '';

    // Construire l'entrée de log
    const logEntry: LogEntry = {
      ...data,
      ip,
      userAgent,
      referer,
      receivedAt: new Date().toISOString(),
    };

    // Log console (toujours actif)
    console.log('[Affiliate Click]', {
      ts: logEntry.ts,
      query: logEntry.query,
      tag: logEntry.tag,
      domain: logEntry.domain,
      pagePath: logEntry.pagePath,
      ip: logEntry.ip,
    });

    // Log fichier (si activé)
    await writeToLogFile(logEntry);

    // TODO: Optionnel - Écrire dans Supabase si configuré
    // if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    //   await supabase.from('affiliate_clicks').insert(logEntry);
    // }

    // Réponse succès (minimale pour performance)
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[Affiliate Tracking] Erreur:', error);

    // Réponse erreur (ne pas exposer les détails en production)
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS pour CORS (si nécessaire)
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * GET - Retourne les statistiques basiques (dev only)
 */
export async function GET(request: NextRequest) {
  // Seulement en développement
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  try {
    const { readFile } = await import('fs/promises');

    if (!existsSync(LOG_FILE)) {
      return NextResponse.json({
        message: 'No clicks logged yet',
        logFile: LOG_FILE,
        clicks: [],
      });
    }

    const content = await readFile(LOG_FILE, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);
    const clicks = lines.map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter(Boolean);

    // Statistiques basiques
    const stats = {
      totalClicks: clicks.length,
      uniqueQueries: new Set(clicks.map((c: LogEntry) => c.query)).size,
      byDomain: clicks.reduce((acc: Record<string, number>, c: LogEntry) => {
        acc[c.domain] = (acc[c.domain] || 0) + 1;
        return acc;
      }, {}),
      recentClicks: clicks.slice(-10).reverse(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Could not read logs' }, { status: 500 });
  }
}
