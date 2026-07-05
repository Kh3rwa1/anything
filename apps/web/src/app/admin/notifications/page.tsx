'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Send, Users, Plus, Trash2, Clock, CheckCircle, RefreshCw } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  body: string;
  audience: string;
  type: string;
  reach: number;
  opened: number;
  sent_at: string;
}

const TYPE_COLORS: Record<string, string> = {
  promo: 'bg-amber-50 text-amber-700',
  course: 'bg-indigo-50 text-indigo-700',
  update: 'bg-emerald-50 text-emerald-700',
  reminder: 'bg-rose-50 text-rose-700',
};

const AUDIENCE_LABELS: Record<string, string> = {
  all: 'All Students (2,786)',
  pro: 'Pro Members (1,240)',
  basic: 'Basic Members (1,546)',
  streak: 'Active Streak Users (980)',
  inactive: 'Inactive Users (340)',
};

// Safe date formatter
function fmtSent(iso: string) {
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
  const d = iso.substring(0, 10);
  const t = iso.substring(11, 16);
  const [y, m, day] = d.split('-');
  const [hh, mm] = t.split(':');
  const h = parseInt(hh);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${parseInt(day)} ${MONTHS[parseInt(m) - 1]} ${y}, ${h12}:${mm} ${ampm}`;
}

export default function NotificationsPage() {
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('all');
  const [type, setType] = useState('update');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const { data: notifications = [], isLoading, isError } = useQuery<Notification[]>({
    queryKey: ['admin-notifications'],
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/admin/notifications');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, audience, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-notifications'] });
      setSendSuccess(true);
      setTitle('');
      setBody('');
      setFormError('');
      setTimeout(() => setSendSuccess(false), 2500);
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch('/api/admin/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-notifications'] });
      setDeleteConfirm(null);
    },
  });

  const handleSend = () => {
    setFormError('');
    if (!title.trim() || !body.trim()) {
      setFormError('Title and message are required.');
      return;
    }
    sendMutation.mutate();
  };

  const totalReach = notifications.reduce((a, n) => a + n.reach, 0);
  const totalOpened = notifications.reduce((a, n) => a + n.opened, 0);
  const avgOpenRate = totalReach > 0 ? Math.round((totalOpened / totalReach) * 100) : 0;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">Communication</p>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Sent',
            value: notifications.length.toString(),
            icon: <Send className="w-4 h-4 text-indigo-600" />,
            bg: 'bg-indigo-50',
          },
          {
            label: 'Avg. Open Rate',
            value: `${avgOpenRate}%`,
            icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
            bg: 'bg-emerald-50',
          },
          {
            label: 'Total Reach',
            value: totalReach.toLocaleString(),
            icon: <Users className="w-4 h-4 text-violet-600" />,
            bg: 'bg-violet-50',
          },
          {
            label: 'Total Opened',
            value: totalOpened.toLocaleString(),
            icon: <Bell className="w-4 h-4 text-amber-600" />,
            bg: 'bg-amber-50',
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">{s.label}</p>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Compose */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-base font-bold text-slate-900">New Notification</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. New course available!"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your notification message…"
                rows={4}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Audience</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              >
                {Object.entries(AUDIENCE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: 'update', label: '📢 Update' },
                  { val: 'promo', label: '⚡ Promo' },
                  { val: 'course', label: '📚 Course' },
                  { val: 'reminder', label: '🔔 Reminder' },
                ].map((t) => (
                  <button
                    key={t.val}
                    onClick={() => setType(t.val)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${type === t.val ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {formError && <p className="text-sm text-red-500 font-medium">⚠ {formError}</p>}

            <button
              onClick={handleSend}
              disabled={sendMutation.isPending || sendSuccess}
              className={`w-full py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${sendSuccess ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
            >
              {sendSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Sent Successfully!
                </>
              ) : sendMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4" style={{ animation: 'spin 1s linear infinite' }} />{' '}
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Notification
                </>
              )}
            </button>
          </div>
        </div>

        {/* History */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100">
            <Clock className="w-4 h-4 text-slate-400" />
            <h2 className="text-base font-bold text-slate-900">Sent History</h2>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
          ) : isError ? (
            <div className="py-16 text-center">
              <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-700 font-bold">Notification history is not connected yet</p>
              <p className="text-slate-400 text-sm mt-1">
                Connect the database and sign in as an admin to review sent campaigns.
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No notifications sent yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.map((n) => {
                const openRate = n.reach > 0 ? Math.round((n.opened / n.reach) * 100) : 0;
                const typeColor = TYPE_COLORS[n.type] ?? 'bg-slate-100 text-slate-600';
                return (
                  <div
                    key={n.id}
                    className="px-6 py-5 hover:bg-slate-50/60 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${typeColor}`}
                          >
                            {n.type}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {fmtSent(n.sent_at)}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.body}</p>
                      </div>
                      {deleteConfirm === n.id ? (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => deleteMutation.mutate(n.id)}
                            className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(n.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-medium text-slate-500">
                          {AUDIENCE_LABELS[n.audience] ?? n.audience}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <span className="text-xs text-slate-400">
                          {n.opened.toLocaleString()} / {n.reach.toLocaleString()}
                        </span>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${openRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-indigo-600 w-8">{openRate}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

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
