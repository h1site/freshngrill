'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle, RefreshCw, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  current?: string | number;
  recommended?: string;
}

interface RecipeAudit {
  id: number;
  slug: string;
  title: string;
  locale: 'fr' | 'en';
  issues: SEOIssue[];
  score: number;
}

interface AuditSummary {
  totalRecipes: number;
  totalTranslations: number;
  avgScore: number;
  issuesByType: {
    error: number;
    warning: number;
    info: number;
  };
  commonIssues: { issue: string; count: number }[];
}

interface AuditData {
  summary: AuditSummary;
  audits: {
    fr: RecipeAudit[];
    en: RecipeAudit[];
  };
}

const IssueIcon = ({ type }: { type: 'error' | 'warning' | 'info' }) => {
  switch (type) {
    case 'error':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'info':
      return <Info className="w-4 h-4 text-blue-500" />;
  }
};

const ScoreBadge = ({ score }: { score: number }) => {
  let bgColor = 'bg-red-100 text-red-800';
  if (score >= 90) bgColor = 'bg-green-100 text-green-800';
  else if (score >= 70) bgColor = 'bg-yellow-100 text-yellow-800';
  else if (score >= 50) bgColor = 'bg-orange-100 text-orange-800';

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${bgColor}`}>
      {score}%
    </span>
  );
};

function RecipeAuditCard({ audit }: { audit: RecipeAudit }) {
  const [expanded, setExpanded] = useState(false);
  const hasIssues = audit.issues.length > 0;

  return (
    <div className={`border rounded-lg ${audit.score < 70 ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <ScoreBadge score={audit.score} />
          <div>
            <h3 className="font-medium text-gray-900">{audit.title}</h3>
            <p className="text-sm text-gray-500">/{audit.locale === 'fr' ? 'recette' : 'en/recipe'}/{audit.slug}/</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasIssues && (
            <div className="flex items-center gap-2 text-sm">
              {audit.issues.filter(i => i.type === 'error').length > 0 && (
                <span className="text-red-600">{audit.issues.filter(i => i.type === 'error').length} erreurs</span>
              )}
              {audit.issues.filter(i => i.type === 'warning').length > 0 && (
                <span className="text-yellow-600">{audit.issues.filter(i => i.type === 'warning').length} avert.</span>
              )}
            </div>
          )}
          <Link
            href={`/admin/recettes/${audit.id}`}
            className="text-orange-600 hover:text-orange-700"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {expanded && hasIssues && (
        <div className="border-t px-4 py-3 space-y-3">
          {audit.issues.map((issue, idx) => (
            <div key={idx} className="flex gap-3">
              <IssueIcon type={issue.type} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  <span className="text-gray-500">[{issue.field}]</span> {issue.message}
                </p>
                {issue.current && (
                  <p className="text-xs text-gray-500 mt-1 break-all">
                    Actuel: <span className="font-mono bg-gray-100 px-1">{String(issue.current).substring(0, 100)}{String(issue.current).length > 100 ? '...' : ''}</span>
                  </p>
                )}
                {issue.recommended && (
                  <p className="text-xs text-green-600 mt-1 break-all">
                    Suggéré: <span className="font-mono bg-green-50 px-1">{issue.recommended.substring(0, 100)}{issue.recommended.length > 100 ? '...' : ''}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SEOAuditPage() {
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
  const [filterScore, setFilterScore] = useState<number | null>(null);

  const fetchAudit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/seo-audit');
      if (!response.ok) throw new Error('Erreur lors du chargement');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  const filteredAudits = data?.audits[activeTab].filter(
    a => filterScore === null || a.score < filterScore
  ) || [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit SEO</h1>
          <p className="text-gray-600">Analysez et optimisez le SEO de vos recettes</p>
        </div>
        <button
          onClick={fetchAudit}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-orange-600 animate-spin" />
        </div>
      )}

      {data && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500">Score moyen</p>
              <p className="text-3xl font-bold mt-1">
                <span className={data.summary.avgScore >= 70 ? 'text-green-600' : data.summary.avgScore >= 50 ? 'text-yellow-600' : 'text-red-600'}>
                  {data.summary.avgScore}%
                </span>
              </p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500">Recettes analysées</p>
              <p className="text-3xl font-bold mt-1 text-gray-900">
                {data.summary.totalRecipes} <span className="text-sm font-normal text-gray-500">FR</span>
                {' + '}
                {data.summary.totalTranslations} <span className="text-sm font-normal text-gray-500">EN</span>
              </p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500">Erreurs critiques</p>
              <p className="text-3xl font-bold mt-1 text-red-600">{data.summary.issuesByType.error}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500">Avertissements</p>
              <p className="text-3xl font-bold mt-1 text-yellow-600">{data.summary.issuesByType.warning}</p>
            </div>
          </div>

          {/* Common Issues */}
          {data.summary.commonIssues.length > 0 && (
            <div className="bg-white rounded-lg border p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Problèmes les plus fréquents</h2>
              <div className="space-y-2">
                {data.summary.commonIssues.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700">{item.issue}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">{item.count} recettes</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs and Filter */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('fr')}
                className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'fr' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Français ({data.audits.fr.length})
              </button>
              <button
                onClick={() => setActiveTab('en')}
                className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'en' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Anglais ({data.audits.en.length})
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Filtrer:</span>
              <select
                value={filterScore ?? ''}
                onChange={(e) => setFilterScore(e.target.value ? Number(e.target.value) : null)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Toutes</option>
                <option value="50">Score &lt; 50%</option>
                <option value="70">Score &lt; 70%</option>
                <option value="90">Score &lt; 90%</option>
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3">
            {filteredAudits.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p>Toutes les recettes ont un bon score SEO!</p>
              </div>
            ) : (
              filteredAudits.map((audit) => (
                <RecipeAuditCard key={`${audit.locale}-${audit.id}`} audit={audit} />
              ))
            )}
          </div>

          {/* Legend */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Légende des scores</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-green-500"></span>
                <span>90-100% : Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-yellow-500"></span>
                <span>70-89% : Bon</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-orange-500"></span>
                <span>50-69% : À améliorer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-red-500"></span>
                <span>&lt;50% : Critique</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Règles SEO:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Titre SEO (seo_title): 30-60 caractères (idéal: 55)</li>
                <li>Meta description (seo_description): 120-160 caractères (idéal: 155)</li>
                <li>H1/Titre principal: 10-70 caractères</li>
                <li>Inclure: introduction, FAQ, nutrition, tags pour un score optimal</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
