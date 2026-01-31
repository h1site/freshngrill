import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

interface PageViewBasic {
  page_path: string;
  page_title: string | null;
  session_id: string | null;
}

interface PageViewTime {
  page_path: string;
  time_on_page: number;
}

interface PageViewBounce {
  page_path: string;
  exited: boolean;
  next_page: string | null;
}

interface PageViewReferrer {
  referrer: string;
}

interface PageViewDate {
  created_at: string;
}

interface PageViewFlow {
  page_path: string;
  next_page: string;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '7', 10);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    // 1. Pages les plus populaires
    const { data: popularPages } = await supabase
      .from('page_views')
      .select('page_path, page_title, session_id')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false }) as { data: PageViewBasic[] | null };

    // Compter les vues par page
    const pageCount: Record<string, { count: number; title: string }> = {};
    popularPages?.forEach(view => {
      if (!pageCount[view.page_path]) {
        pageCount[view.page_path] = { count: 0, title: view.page_title || view.page_path };
      }
      pageCount[view.page_path].count++;
    });

    const topPages = Object.entries(pageCount)
      .map(([path, data]) => ({ path, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // 2. Temps moyen sur page
    const { data: timeData } = await supabase
      .from('page_views')
      .select('page_path, time_on_page')
      .gte('created_at', startDate.toISOString())
      .gt('time_on_page', 0) as { data: PageViewTime[] | null };

    const avgTimeByPage: Record<string, { total: number; count: number }> = {};
    timeData?.forEach(view => {
      if (!avgTimeByPage[view.page_path]) {
        avgTimeByPage[view.page_path] = { total: 0, count: 0 };
      }
      avgTimeByPage[view.page_path].total += view.time_on_page;
      avgTimeByPage[view.page_path].count++;
    });

    const avgTimePages = Object.entries(avgTimeByPage)
      .map(([path, data]) => ({
        path,
        avgTime: Math.round(data.total / data.count),
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 20);

    // 3. Taux de rebond (pages où exited = true et next_page = null)
    const { data: bounceData } = await supabase
      .from('page_views')
      .select('page_path, exited, next_page')
      .gte('created_at', startDate.toISOString()) as { data: PageViewBounce[] | null };

    const bounceByPage: Record<string, { bounced: number; total: number }> = {};
    bounceData?.forEach(view => {
      if (!bounceByPage[view.page_path]) {
        bounceByPage[view.page_path] = { bounced: 0, total: 0 };
      }
      bounceByPage[view.page_path].total++;
      if (view.exited && !view.next_page) {
        bounceByPage[view.page_path].bounced++;
      }
    });

    const bounceRates = Object.entries(bounceByPage)
      .filter(([, data]) => data.total >= 5) // Au moins 5 visites
      .map(([path, data]) => ({
        path,
        bounceRate: Math.round((data.bounced / data.total) * 100),
        total: data.total,
      }))
      .sort((a, b) => b.bounceRate - a.bounceRate)
      .slice(0, 20);

    // 4. Sources de trafic (referrers)
    const { data: referrerData } = await supabase
      .from('page_views')
      .select('referrer')
      .gte('created_at', startDate.toISOString())
      .not('referrer', 'is', null) as { data: PageViewReferrer[] | null };

    const referrerCount: Record<string, number> = {};
    referrerData?.forEach(view => {
      try {
        const url = new URL(view.referrer);
        const domain = url.hostname;
        referrerCount[domain] = (referrerCount[domain] || 0) + 1;
      } catch {
        referrerCount['direct'] = (referrerCount['direct'] || 0) + 1;
      }
    });

    const topReferrers = Object.entries(referrerCount)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 5. Vues par jour
    const { data: dailyData } = await supabase
      .from('page_views')
      .select('created_at')
      .gte('created_at', startDate.toISOString()) as { data: PageViewDate[] | null };

    const viewsByDay: Record<string, number> = {};
    dailyData?.forEach(view => {
      const date = new Date(view.created_at).toISOString().split('T')[0];
      viewsByDay[date] = (viewsByDay[date] || 0) + 1;
    });

    const dailyViews = Object.entries(viewsByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 6. Parcours utilisateur (pages suivantes les plus communes)
    const { data: flowData } = await supabase
      .from('page_views')
      .select('page_path, next_page')
      .gte('created_at', startDate.toISOString())
      .not('next_page', 'is', null) as { data: PageViewFlow[] | null };

    const flowCount: Record<string, Record<string, number>> = {};
    flowData?.forEach(view => {
      if (!flowCount[view.page_path]) {
        flowCount[view.page_path] = {};
      }
      flowCount[view.page_path][view.next_page] =
        (flowCount[view.page_path][view.next_page] || 0) + 1;
    });

    // Top flows
    const topFlows: Array<{ from: string; to: string; count: number }> = [];
    Object.entries(flowCount).forEach(([from, toPages]) => {
      Object.entries(toPages).forEach(([to, count]) => {
        topFlows.push({ from, to, count });
      });
    });
    topFlows.sort((a, b) => b.count - a.count);

    // 7. Stats globales
    const totalViews = popularPages?.length || 0;
    const uniqueSessions = new Set(popularPages?.map(v => v.session_id)).size;
    const avgTimeOnSite = timeData?.length
      ? Math.round(timeData.reduce((sum, v) => sum + v.time_on_page, 0) / timeData.length)
      : 0;
    const overallBounceRate = bounceData?.length
      ? Math.round((bounceData.filter(v => v.exited && !v.next_page).length / bounceData.length) * 100)
      : 0;

    return NextResponse.json({
      summary: {
        totalViews,
        uniqueSessions,
        avgTimeOnSite,
        bounceRate: overallBounceRate,
        period: `${days} jours`,
      },
      topPages,
      avgTimePages,
      bounceRates,
      topReferrers,
      dailyViews,
      topFlows: topFlows.slice(0, 20),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
