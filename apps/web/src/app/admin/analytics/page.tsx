'use client';

import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  TrendingDown,
  Users,
  IndianRupee,
  Award,
  BarChart2,
  PieChart,
} from 'lucide-react';



function fmtInr(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-analytics'],
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const totals = data?.totals ?? {};
  const monthly: { month: string; students: number; revenue: number }[] = data?.monthly ?? [];
  const topCourses: {
    id: number;
    title: string;
    category: string;
    enrollment_count: number;
    revenue: number;
    pct: number;
  }[] = data?.topCourses ?? [];

  const maxRev = Math.max(...monthly.map((m) => m.revenue), 1);

  const kpis = [
    {
      label: 'Total Revenue',
      value: isLoading ? '—' : fmtInr(totals.total_revenue ?? 0),
      sub: 'all time',
      icon: <IndianRupee className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
    },
    {
      label: 'Total Students',
      value: isLoading ? '—' : (totals.total_students ?? 0).toLocaleString(),
      sub: 'registered',
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
    },
    {
      label: 'Courses Completed',
      value: isLoading ? '—' : (totals.completions ?? 0).toLocaleString(),
      sub: 'tracking coming soon',
      icon: <Award className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      label: 'Active Enrollments',
      value: isLoading ? '—' : (totals.total_enrollments ?? 0).toLocaleString(),
      sub: 'all courses',
      icon: <BarChart2 className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-50',
    },
  ];

  return (
    <div className="admin-page space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600"><span className="h-px w-5 bg-violet-500" />Data & Insights</p>
        <h1 className="text-3xl font-semibold text-slate-950 tracking-[-0.045em]">Analytics</h1>
        <p className="mt-2 text-sm text-slate-500">A concise view of the metrics that move your academy.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div
            key={i}
            className="premium-lift bg-white rounded-2xl border border-slate-200 p-5 transition-all"
            style={{ transitionDelay: `${i * 45}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${k.bg} rounded-xl flex items-center justify-center`}>
                {k.icon}
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {k.label}
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">{k.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart + Traffic */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Bar Chart */}
        <div className="admin-glass-card xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Monthly Revenue</h2>
              <p className="text-sm text-slate-500 mt-0.5">Revenue from enrollments by month</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
              Last 6 months
            </span>
          </div>

          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              Loading chart…
            </div>
          ) : isError ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400">
              <BarChart2 className="w-8 h-8 mb-2 text-slate-200" />
              <p className="text-sm font-medium text-slate-600">Analytics are not connected yet</p>
              <p className="text-xs mt-1">Connect the database to unlock live reporting.</p>
            </div>
          ) : monthly.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400">
              <BarChart2 className="w-8 h-8 mb-2 text-slate-200" />
              <p className="text-sm">No enrollment data yet</p>
            </div>
          ) : (
            <div className="flex items-end gap-3 h-48">
              {monthly.map((m, i) => {
                const h = maxRev > 0 ? Math.round((m.revenue / maxRev) * 100) : 0;
                return (
                  <div key={i} className="group flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-600">
                      {fmtInr(m.revenue)}
                    </span>
                    <div
                      className="w-full relative rounded-t-lg overflow-hidden"
                      style={{ height: `${Math.max(h, 5)}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 via-violet-500 to-fuchsia-400 rounded-t-lg transition duration-300 group-hover:brightness-110" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-xs font-medium text-slate-500">New Enrollments</span>
              <span className="text-xs font-bold text-slate-900">
                {monthly.length > 0 ? monthly[monthly.length - 1].students : 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-500">Total All-Time</span>
              <span className="text-xs font-bold text-slate-900">
                {totals.total_enrollments ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Traffic Sources — placeholder */}
        <div className="admin-glass-card bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <PieChart className="w-4 h-4 text-slate-400" />
            <h2 className="text-base font-bold text-slate-900">Traffic Sources</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-600">Connect analytics</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Integrate Google Analytics or Plausible to see real traffic source data here.</p>
          </div>
        </div>
      </div>

      {/* Top Courses Table */}
      <div className="admin-glass-card bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Top Performing Courses</h2>
          <p className="text-sm text-slate-500 mt-0.5">By enrollment count</p>
        </div>
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading…</div>
        ) : isError ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Connect the database to load course performance.
          </div>
        ) : topCourses.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">No course data yet.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Course', 'Category', 'Students', 'Revenue', 'Enrollment Share'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topCourses.map((c, i) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-300 w-5">#{i + 1}</span>
                      <p className="text-sm font-bold text-slate-900 max-w-xs">{c.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700">
                      {c.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    {c.enrollment_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-700">
                    {fmtInr(c.revenue)}
                  </td>
                  <td className="px-6 py-4 w-44">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${c.pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-500 w-8">{c.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
