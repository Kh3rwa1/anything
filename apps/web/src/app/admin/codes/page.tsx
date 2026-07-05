'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Tag,
  Trash2,
  Pencil,
  X,
  Check,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Copy,
  CheckCheck,
} from 'lucide-react';

type Code = {
  id: number;
  code: string;
  course_id: number | null;
  course_title: string | null;
  discount_pct: number;
  is_active: boolean;
  max_uses: number | null;
  used_count: number;
  created_at: string;
};

type Course = { id: number; title: string };

const EMPTY_FORM = {
  code: '',
  course_id: '' as string | number,
  discount_pct: 0,
  max_uses: '' as string | number,
  is_active: true,
};

export default function CodesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Code | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [copied, setCopied] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formError, setFormError] = useState('');

  const { data: codes = [], isLoading, isError } = useQuery<Code[]>({
    queryKey: ['admin-codes'],
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/admin/codes');
      if (!res.ok) throw new Error('Failed to fetch codes');
      return res.json();
    },
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['admin-courses-list'],
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (body: typeof form) => {
      const res = await fetch('/api/admin/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          course_id: body.course_id === '' ? null : Number(body.course_id),
          max_uses: body.max_uses === '' ? null : Number(body.max_uses),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-codes'] });
      resetForm();
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (body: typeof form & { id: number }) => {
      const res = await fetch('/api/admin/codes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          course_id: body.course_id === '' ? null : Number(body.course_id),
          max_uses: body.max_uses === '' ? null : Number(body.max_uses),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-codes'] });
      resetForm();
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch('/api/admin/codes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-codes'] });
      setDeleteConfirm(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (c: Code) => {
      const res = await fetch('/api/admin/codes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: c.id,
          code: c.code,
          course_id: c.course_id,
          discount_pct: c.discount_pct,
          max_uses: c.max_uses,
          is_active: !c.is_active,
        }),
      });
      if (!res.ok) throw new Error('Failed');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-codes'] }),
  });

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setEditing(null);
    setShowForm(false);
    setFormError('');
  };

  const openEdit = (c: Code) => {
    setEditing(c);
    setForm({
      code: c.code,
      course_id: c.course_id ?? '',
      discount_pct: c.discount_pct,
      max_uses: c.max_uses ?? '',
      is_active: c.is_active,
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = () => {
    setFormError('');
    if (!form.code.trim()) {
      setFormError('Code name is required.');
      return;
    }
    if (editing) {
      updateMutation.mutate({ ...form, id: editing.id });
    } else {
      createMutation.mutate(form);
    }
  };

  const copyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const activeCodes = codes.filter((c) => c.is_active).length;
  const totalUses = codes.reduce((acc, c) => acc + c.used_count, 0);

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enrollment Codes</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create and manage access codes students use to enroll in courses.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          New Code
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: 'Total Codes', value: codes.length, color: 'bg-slate-100 text-slate-700' },
          { label: 'Active', value: activeCodes, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Inactive', value: codes.length - activeCodes, color: 'bg-red-50 text-red-600' },
          { label: 'Total Uses', value: totalUses, color: 'bg-indigo-50 text-indigo-700' },
        ].map((s) => (
          <div key={s.label} className={`px-4 py-2 rounded-xl text-sm font-semibold ${s.color}`}>
            {s.value} {s.label}
          </div>
        ))}
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">
              {editing ? 'Edit Code' : 'Create New Code'}
            </h2>
            <button
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Code Name *
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. WELCOME50"
                className="w-full px-4 py-2.5 text-sm font-mono font-bold tracking-widest border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 uppercase"
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Discount (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.discount_pct}
                onChange={(e) => setForm({ ...form, discount_pct: Number(e.target.value) })}
                placeholder="0"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Set 0 for no discount (access-only code)
              </p>
            </div>

            {/* Course */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Restrict to Course
              </label>
              <select
                value={form.course_id}
                onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              >
                <option value="">All courses (universal)</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Max uses */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Max Uses
              </label>
              <input
                type="number"
                min={1}
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                placeholder="Unlimited"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
              <p className="text-[11px] text-slate-400 mt-1">Leave blank for unlimited</p>
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 focus:outline-none"
            >
              {form.is_active ? (
                <ToggleRight className="w-6 h-6 text-emerald-500" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-400" />
              )}
              {form.is_active
                ? 'Active — students can use this code'
                : 'Inactive — code is disabled'}
            </button>
          </div>

          {formError && <p className="mt-3 text-sm text-red-600 font-medium">⚠ {formError}</p>}

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {isPending ? (
                <RefreshCw className="w-4 h-4" style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {editing ? 'Save Changes' : 'Create Code'}
            </button>
            <button
              onClick={resetForm}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Tag className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-900">All Codes</h2>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-slate-400 text-sm">Loading codes…</div>
        ) : isError ? (
          <div className="py-16 text-center">
            <Tag className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-700 font-bold">Enrollment codes are not connected yet</p>
            <p className="text-slate-400 text-sm mt-1">
              Connect the database and sign in as an admin to create access codes.
            </p>
          </div>
        ) : codes.length === 0 ? (
          <div className="py-16 text-center">
            <Tag className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No codes yet</p>
            <p className="text-slate-400 text-sm mt-1">Click "New Code" to create one</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Uses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {codes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Code */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 tracking-widest text-sm">
                          {c.code}
                        </span>
                        <button
                          onClick={() => copyCode(c.id, c.code)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-indigo-500"
                          title="Copy code"
                        >
                          {copied === c.id ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    {/* Discount */}
                    <td className="px-6 py-4">
                      {c.discount_pct > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold">
                          {c.discount_pct}% off
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Access only</span>
                      )}
                    </td>
                    {/* Course */}
                    <td className="px-6 py-4">
                      <span className="text-slate-600 text-xs truncate max-w-[160px] block">
                        {c.course_title ?? (
                          <span className="text-slate-400 italic">All courses</span>
                        )}
                      </span>
                    </td>
                    {/* Uses */}
                    <td className="px-6 py-4">
                      <span className="text-slate-700 font-semibold">{c.used_count}</span>
                      {c.max_uses && (
                        <span className="text-slate-400 text-xs"> / {c.max_uses}</span>
                      )}
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleMutation.mutate(c)}
                        className="flex items-center gap-1.5 focus:outline-none"
                        title="Toggle active/inactive"
                      >
                        {(() => {
                          if (c.is_active) {
                            return (
                              <>
                                <ToggleRight className="w-5 h-5 text-emerald-500" />
                                <span className="text-xs font-semibold text-emerald-600">
                                  Active
                                </span>
                              </>
                            );
                          }
                          return (
                            <>
                              <ToggleLeft className="w-5 h-5 text-slate-400" />
                              <span className="text-xs font-semibold text-slate-400">Inactive</span>
                            </>
                          );
                        })()}
                      </button>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {deleteConfirm === c.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => deleteMutation.mutate(c.id)}
                              className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(c.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* spin keyframe for loading icon */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
