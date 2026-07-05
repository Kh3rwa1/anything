'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CircleAlert,
  IndianRupee,
  Layers3,
  MoreHorizontal,
  Plus,
  Sparkles,
  Tag,
  Users,
} from 'lucide-react';

type Analytics = {
  totals: {
    total_students: number;
    total_enrollments: number;
    total_revenue: number;
    completions: number;
  };
  monthly: Array<{ month: string; students: number; revenue: number }>;
  topCourses: Array<{
    id: number;
    title: string;
    category: string;
    enrollment_count: number;
    revenue: number;
    pct: number;
  }>;
};

const EMPTY: Analytics = {
  totals: { total_students: 0, total_enrollments: 0, total_revenue: 0, completions: 0 },
  monthly: [],
  topCourses: [],
};

export default function AdminDashboard() {
  const {
    data = EMPTY,
    isLoading,
    isError,
  } = useQuery<Analytics>({
    queryKey: ['admin-analytics'],
    retry: false,
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) throw new Error('Failed to load analytics');
      return response.json();
    },
  });

  const { totals, monthly, topCourses } = data;
  const completionRate = totals.total_enrollments
    ? Math.round((totals.completions / totals.total_enrollments) * 100)
    : 0;
  const revenue = formatCurrency(totals.total_revenue);
  const maxRevenue = Math.max(...monthly.map((item) => item.revenue), 1);

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            <span className="h-px w-5 bg-violet-500" />
            Executive overview
          </div>
          <h1 className="text-[32px] font-semibold tracking-[-0.045em] text-[#17191d] sm:text-[40px]">
            Command center
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            The signal behind your content, learners, and revenue—without the dashboard theatre.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/analytics"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <BarChart3 className="h-3.5 w-3.5" /> Full analytics
          </Link>
          <Link
            href="/admin/courses"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.25)] transition hover:-translate-y-0.5 hover:bg-violet-700"
          >
            <Plus className="h-3.5 w-3.5" /> Create course
          </Link>
        </div>
      </section>

      {isError && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200/70 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <CircleAlert className="h-4 w-4" />
          Live analytics are unavailable. Sign in with an administrator account and verify the
          database connection.
        </div>
      )}

      <section className="relative overflow-hidden rounded-[28px] bg-[#15171c] px-5 py-6 text-white shadow-[0_30px_80px_rgba(15,17,22,0.16)] sm:px-7 sm:py-8 lg:px-9">
        <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-violet-500/25 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-orange-400/10 blur-[100px]" />

        <div className="relative grid gap-8 xl:grid-cols-[1.05fr_1.6fr] xl:items-end">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-medium text-white/55">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              Live business pulse
            </div>
            <p className="text-xs font-medium text-white/40">Gross course value</p>
            <div className="mt-2 flex items-end gap-3">
              <p className="text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
                {isLoading ? '—' : revenue}
              </p>
              <span className="mb-2 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/55">
                All time
              </span>
            </div>
            <p className="mt-4 max-w-sm text-xs leading-5 text-white/35">
              Value of enrolled courses. Connect payment events to report realized revenue and
              refunds.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.09] sm:grid-cols-4">
            <DarkMetric
              label="Students"
              value={totals.total_students}
              icon={<Users className="h-4 w-4" />}
              loading={isLoading}
            />
            <DarkMetric
              label="Enrollments"
              value={totals.total_enrollments}
              icon={<BookOpen className="h-4 w-4" />}
              loading={isLoading}
            />
            <DarkMetric
              label="Active courses"
              value={topCourses.length}
              icon={<Layers3 className="h-4 w-4" />}
              loading={isLoading}
            />
            <DarkMetric
              label="Completion signal"
              value={`${completionRate}%`}
              icon={<Sparkles className="h-4 w-4" />}
              loading={isLoading}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <div className="overflow-hidden rounded-[24px] border border-black/[0.07] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
          <div className="flex items-start justify-between border-b border-black/[0.055] px-5 py-5 sm:px-6">
            <div>
              <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
                Revenue trajectory
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Course value generated over the last six months
              </p>
            </div>
            <button
              aria-label="Revenue chart options"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="p-5 sm:p-6">
            {monthly.length > 0 ? (
              <div className="flex h-[260px] items-end gap-3 sm:gap-5">
                {monthly.map((item) => (
                  <div key={item.month} className="group flex h-full flex-1 flex-col justify-end">
                    <div className="mb-2 opacity-0 transition group-hover:opacity-100">
                      <p className="text-center text-[9px] font-semibold text-slate-600">
                        {formatCurrency(item.revenue)}
                      </p>
                    </div>
                    <div
                      className="relative w-full overflow-hidden rounded-t-xl bg-slate-100"
                      style={{ height: `${Math.max(12, (item.revenue / maxRevenue) * 82)}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-violet-600 via-violet-500 to-fuchsia-400 transition duration-300 group-hover:brightness-110" />
                      <div className="absolute inset-x-0 top-0 h-px bg-white/50" />
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-[10px] font-semibold text-slate-500">{item.month}</p>
                      <p className="mt-0.5 text-[9px] text-slate-300">{item.students} learners</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyChart />
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-black/[0.07] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900">Top courses</p>
              <p className="mt-1 text-xs text-slate-400">Ranked by active enrollment</p>
            </div>
            <Link
              href="/admin/courses"
              className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {topCourses.length > 0 ? (
            <div className="space-y-5">
              {topCourses.map((course, index) => (
                <div key={course.id}>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {course.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {course.category} · {course.enrollment_count} enrolled
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700">
                      {formatCurrency(course.revenue)}
                    </span>
                  </div>
                  <div className="ml-10 h-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-400"
                      style={{ width: `${course.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid min-h-[240px] place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <div>
                <BookOpen className="mx-auto h-6 w-6 text-slate-300" />
                <p className="mt-3 text-xs font-semibold text-slate-600">No course signal yet</p>
                <p className="mx-auto mt-1 max-w-[220px] text-[10px] leading-4 text-slate-400">
                  Publish a course and enroll learners to see performance rankings.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <QuickAction
          href="/admin/courses"
          icon={<BookOpen className="h-4 w-4" />}
          eyebrow="Catalog"
          title="Build a course"
        />
        <QuickAction
          href="/admin/codes"
          icon={<Tag className="h-4 w-4" />}
          eyebrow="Growth"
          title="Create an access code"
        />
        <QuickAction
          href="/admin/students"
          icon={<Users className="h-4 w-4" />}
          eyebrow="Audience"
          title="Review your learners"
        />
        <QuickAction
          href="/admin/analytics"
          icon={<IndianRupee className="h-4 w-4" />}
          eyebrow="Intelligence"
          title="Explore performance"
        />
      </section>
    </div>
  );
}

function DarkMetric({
  label,
  value,
  icon,
  loading,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <div className="bg-[#1b1d23]/95 p-4 sm:p-5">
      <div className="mb-7 flex items-center justify-between text-white/25">
        {icon}
        <ArrowUpRight className="h-3 w-3" />
      </div>
      <p className="text-2xl font-semibold tracking-[-0.04em] text-white">
        {loading ? '—' : value}
      </p>
      <p className="mt-1 text-[10px] font-medium text-white/35">{label}</p>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="relative grid h-[260px] place-items-center overflow-hidden rounded-2xl bg-slate-50">
      <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="relative text-center">
        <BarChart3 className="mx-auto h-6 w-6 text-slate-300" />
        <p className="mt-3 text-xs font-semibold text-slate-600">Your growth curve starts here</p>
        <p className="mt-1 text-[10px] text-slate-400">
          Monthly enrollment activity will appear automatically.
        </p>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  eyebrow,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-black/[0.065] bg-white p-4 shadow-[0_5px_20px_rgba(15,23,42,0.025)] transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_16px_35px_rgba(124,58,237,0.08)]"
    >
      <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-violet-600 group-hover:text-white">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {eyebrow}
        </p>
        <p className="mt-1 truncate text-xs font-semibold text-slate-800">{title}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-500" />
    </Link>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    notation: value >= 100000 ? 'compact' : 'standard',
  }).format(value || 0);
}
