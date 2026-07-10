'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Users,
  BookOpen,
  TrendingUp,
  Mail,
  Download,
  UserCheck,
  Clock,
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  joined_at: string;
  enrollment_count: string;
  completed_lessons: string;
  progress_pct: string;
}

const GRAD_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-pink-500 to-rose-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-blue-500 to-cyan-600',
  'from-violet-500 to-purple-600',
  'from-red-500 to-orange-600',
  'from-teal-500 to-emerald-600',
];

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

// Safe date formatter — no new Date() in render
function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—';
  const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const d = iso.substring(0, 10); // "YYYY-MM-DD"
  const [y, m, day] = d.split('-');
  return `${parseInt(day)} ${MONTHS[parseInt(m) - 1]} ${y}`;
}

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'joined' | 'name' | 'courses' | 'progress'>('joined');

  const { data, isLoading, isError } = useQuery<{ data: Student[] }>({
    queryKey: ['admin-students'],
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/admin/students');
      if (!res.ok) throw new Error('Failed to fetch students');
      return res.json();
    },
  });

  const students = data?.data ?? [];

  const filtered = students
    .filter(
      (s) =>
        !search ||
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'courses') return Number(b.enrollment_count) - Number(a.enrollment_count);
      if (sort === 'progress') return Number(b.progress_pct) - Number(a.progress_pct);
      // sort by joined_at — ISO strings are lexicographically sortable
      return (b.joined_at ?? '').localeCompare(a.joined_at ?? '');
    });

  const totalEnrollments = students.reduce((acc, s) => acc + Number(s.enrollment_count), 0);
  const avgProgress =
    students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + Number(s.progress_pct), 0) / students.length)
      : 0;
  const activeStudents = students.filter((s) => Number(s.enrollment_count) > 0).length;

  const exportCSV = () => {
    const rows = [
      ['Name', 'Email', 'Joined', 'Enrollments', 'Progress %'],
      ...filtered.map((s) => [
        s.name,
        s.email,
        fmtDate(s.joined_at),
        s.enrollment_count,
        s.progress_pct,
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-page space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">User Management</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Students</h1>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Students',
            value: isLoading ? '—' : students.length.toLocaleString(),
            icon: <Users className="w-5 h-5 text-indigo-600" />,
            bg: 'bg-indigo-50',
          },
          {
            label: 'Active (Enrolled)',
            value: isLoading ? '—' : activeStudents.toLocaleString(),
            icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
            bg: 'bg-emerald-50',
          },
          {
            label: 'Total Enrollments',
            value: isLoading ? '—' : totalEnrollments.toLocaleString(),
            icon: <BookOpen className="w-5 h-5 text-violet-600" />,
            bg: 'bg-violet-50',
          },
          {
            label: 'Avg. Progress',
            value: isLoading ? '—' : `${avgProgress}%`,
            icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
            bg: 'bg-amber-50',
          },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {s.label}
            </p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Sort:</span>
            {(['joined', 'name', 'courses', 'progress'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${sort === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-500">{filtered.length}</p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-sm">Loading students…</div>
        ) : isError ? (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-700 font-bold">Student data is not connected yet</p>
            <p className="text-slate-400 text-sm mt-1">
              Connect the database and sign in as an admin to review learners.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No students found</p>
            <p className="text-slate-400 text-sm mt-1">Students appear here once they sign up.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Student', 'Email', 'Courses', 'Progress', 'Joined', ''].map((h, i) => (
                  <th
                    key={i}
                    className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((s, i) => {
                const progress = Number(s.progress_pct);
                const progressColor =
                  progress >= 80
                    ? 'bg-emerald-500'
                    : progress >= 50
                      ? 'bg-indigo-500'
                      : 'bg-amber-500';
                return (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRAD_COLORS[i % GRAD_COLORS.length]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                        >
                          {initials(s.name || 'U')}
                        </div>
                        <p className="text-sm font-bold text-slate-900">{s.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {s.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">{s.enrollment_count}</span>
                      <span className="text-xs text-slate-400 ml-1">enrolled</span>
                    </td>
                    <td className="px-6 py-4 w-44">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${progressColor} rounded-full`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 w-8">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        {fmtDate(s.joined_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`mailto:${s.email}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Mail className="w-3 h-3" /> Email
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
