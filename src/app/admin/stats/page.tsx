'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Clock,
  MousePointerClick,
  Users,
  TrendingUp,
  ExternalLink,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface Stats {
  summary: {
    totalViews: number;
    uniqueSessions: number;
    avgTimeOnSite: number;
    bounceRate: number;
    period: string;
  };
  topPages: Array<{ path: string; title: string; count: number }>;
  avgTimePages: Array<{ path: string; avgTime: number }>;
  bounceRates: Array<{ path: string; bounceRate: number; total: number }>;
  topReferrers: Array<{ domain: string; count: number }>;
  dailyViews: Array<{ date: string; count: number }>;
  topFlows: Array<{ from: string; to: string; count: number }>;
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function formatPath(path: string): string {
  if (path.length > 40) {
    return path.substring(0, 37) + '...';
  }
  return path;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/stats?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const maxDailyViews = Math.max(...stats.dailyViews.map(d => d.count), 1);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-500 mt-1">Analyse du trafic sur les {days} derniers jours</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value={7}>7 jours</option>
            <option value={14}>14 jours</option>
            <option value={30}>30 jours</option>
            <option value={90}>90 jours</option>
          </select>
          <button
            onClick={fetchStats}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pages vues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.summary.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sessions uniques</p>
              <p className="text-2xl font-bold text-gray-900">{stats.summary.uniqueSessions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Temps moyen</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(stats.summary.avgTimeOnSite)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MousePointerClick className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Taux de rebond</p>
              <p className="text-2xl font-bold text-gray-900">{stats.summary.bounceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Views Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-500" />
          Vues par jour
        </h2>
        <div className="h-40 flex items-end gap-1">
          {stats.dailyViews.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-orange-500 rounded-t hover:bg-orange-600 transition-colors"
                style={{ height: `${(day.count / maxDailyViews) * 100}%`, minHeight: '4px' }}
                title={`${day.date}: ${day.count} vues`}
              />
              <span className="text-xs text-gray-400 mt-1 rotate-45 origin-left">
                {new Date(day.date).toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Pages */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pages les plus populaires</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {stats.topPages.map((page, i) => (
              <div key={page.path} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-400 w-6">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate" title={page.path}>
                    {page.title || formatPath(page.path)}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{page.path}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">{page.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avg Time on Page */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Temps moyen par page</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {stats.avgTimePages.map((page) => (
              <div key={page.path} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate" title={page.path}>
                    {formatPath(page.path)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-purple-600">{formatTime(page.avgTime)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bounce Rates */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Taux de rebond par page</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {stats.bounceRates.map((page) => (
              <div key={page.path} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate" title={page.path}>
                    {formatPath(page.path)}
                  </p>
                  <p className="text-xs text-gray-400">{page.total} visites</p>
                </div>
                <span className={`text-sm font-semibold ${page.bounceRate > 70 ? 'text-red-600' : page.bounceRate > 50 ? 'text-orange-600' : 'text-green-600'}`}>
                  {page.bounceRate}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-gray-500" />
            Sources de trafic
          </h2>
          <div className="space-y-3">
            {stats.topReferrers.length > 0 ? (
              stats.topReferrers.map((ref) => (
                <div key={ref.domain} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{ref.domain}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{ref.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">Aucune donnée de référent</p>
            )}
          </div>
        </div>
      </div>

      {/* User Flow */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-gray-500" />
          Parcours utilisateur (pages suivantes)
        </h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {stats.topFlows.length > 0 ? (
            stats.topFlows.map((flow, i) => (
              <div key={`${flow.from}-${flow.to}-${i}`} className="flex items-center gap-2 text-sm">
                <span className="text-gray-600 truncate max-w-[40%]" title={flow.from}>
                  {formatPath(flow.from)}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-900 font-medium truncate max-w-[40%]" title={flow.to}>
                  {formatPath(flow.to)}
                </span>
                <span className="text-gray-400 flex-shrink-0 ml-auto">{flow.count}x</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">Aucune donnée de navigation</p>
          )}
        </div>
      </div>
    </div>
  );
}
