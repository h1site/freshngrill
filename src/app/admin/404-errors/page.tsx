import { createClient } from '@/lib/supabase-server';
import { AlertTriangle, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Error404Log {
  id: number;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
}

async function get404Errors(): Promise<{ logs: Error404Log[]; stats: { path: string; count: number }[] }> {
  const supabase = await createClient();

  // Get recent 404 errors
  const { data: logs } = await supabase
    .from('error_404_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  // Get top 404 paths grouped by count
  const { data: statsData } = await supabase
    .from('error_404_logs')
    .select('path');

  // Group and count manually since Supabase doesn't support GROUP BY easily
  const pathCounts: Record<string, number> = {};
  (statsData || []).forEach((item: { path: string }) => {
    pathCounts[item.path] = (pathCounts[item.path] || 0) + 1;
  });

  const stats = Object.entries(pathCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    logs: (logs as Error404Log[]) || [],
    stats,
  };
}

export default async function Admin404ErrorsPage() {
  const { logs, stats } = await get404Errors();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBrowserFromUA = (ua: string | null) => {
    if (!ua) return 'Inconnu';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('bot') || ua.includes('Bot')) return 'Bot';
    return 'Autre';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Erreurs 404</h1>
          <p className="text-gray-500 mt-1">Suivi des pages introuvables</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          {logs.length} erreurs recentes
        </div>
      </div>

      {/* Stats Cards */}
      {stats.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top 10 des URLs en erreur</h2>
          </div>
          <div className="p-6">
            <div className="grid gap-3">
              {stats.map((stat, index) => (
                <div
                  key={stat.path}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-6">#{index + 1}</span>
                    <code className="text-sm text-gray-700 bg-gray-200 px-2 py-1 rounded">
                      {stat.path}
                    </code>
                  </div>
                  <span className="text-sm font-semibold text-orange-600">
                    {stat.count} fois
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Errors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Erreurs recentes</h2>
        </div>
        {logs.length === 0 ? (
          <div className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune erreur 404 enregistree</p>
            <p className="text-sm text-gray-400 mt-1">
              Les erreurs apparaitront ici lorsque des utilisateurs visiteront des pages inexistantes
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referrer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Navigateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                        {log.path}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.referrer ? (
                        <a
                          href={log.referrer}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          {new URL(log.referrer).hostname}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400">Direct</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getBrowserFromUA(log.user_agent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Comment corriger ces erreurs?</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>
            <strong>Liens internes brises:</strong> Verifiez les liens dans votre contenu et corrigez-les
          </li>
          <li>
            <strong>Anciennes URLs:</strong> Creez des redirections 301 dans next.config.js
          </li>
          <li>
            <strong>Bots malveillants:</strong> Les URLs etranges avec .php ou /wp-admin peuvent etre ignorees
          </li>
        </ul>
      </div>
    </div>
  );
}
