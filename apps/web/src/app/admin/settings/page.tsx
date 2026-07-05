'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Save,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Mail,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';

type Settings = Record<string, string>;

const DEFAULTS: Settings = {
  platform_name: 'IAs Academy',
  tagline: "India's #1 Job Prep Platform",
  support_email: 'support@ias-academy.in',
  timezone: 'Asia/Kolkata',
  description:
    "IAs Academy is India's leading job preparation platform, helping 50,000+ students crack their dream interviews at top companies.",
  primary_color: '#4F46E5',
  accent_color: '#F59E0B',
  success_color: '#10B981',
  gst_rate: '18',
  refund_policy: '7-day refund',
  currency: 'INR',
  session_timeout: '1 hour',
  max_login_tries: '5 attempts',
  notif_email: 'true',
  notif_sms: 'false',
  notif_push: 'true',
  '2fa_enabled': 'true',
};

export default function SettingsPage() {
  const qc = useQueryClient();
  const [local, setLocal] = useState<Settings>(DEFAULTS);
  const [saveOk, setSaveOk] = useState(false);

  const { data: remote, isLoading, isError } = useQuery<Settings>({
    queryKey: ['admin-settings'],
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  // Sync remote → local once loaded
  useEffect(() => {
    if (remote) setLocal({ ...DEFAULTS, ...remote });
  }, [remote]);

  const saveMutation = useMutation({
    mutationFn: async (updates: Settings) => {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to save');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 2500);
    },
  });

  const set = (key: string, value: string) => setLocal((prev) => ({ ...prev, [key]: value }));
  const toggle = (key: string) => set(key, local[key] === 'true' ? 'false' : 'true');
  const bool = (key: string) => local[key] === 'true';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw
          className="w-6 h-6 text-indigo-400"
          style={{ animation: 'spin 1s linear infinite' }}
        />
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

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Configuration</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        </div>
        <button
          onClick={() => saveMutation.mutate(local)}
          disabled={saveMutation.isPending}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all shadow-sm ${saveOk ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 disabled:opacity-60'}`}
        >
          {saveOk ? (
            <>
              <CheckCircle className="w-4 h-4" /> Saved!
            </>
          ) : saveMutation.isPending ? (
            <>
              <RefreshCw className="w-4 h-4" style={{ animation: 'spin 1s linear infinite' }} />{' '}
              Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      {isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <p className="font-bold">Settings are using safe defaults.</p>
          <p className="mt-1">
            Connect the database and sign in as an admin to persist configuration changes.
          </p>
        </div>
      )}

      {/* Platform */}
      <Section
        icon={<Globe className="w-4 h-4" />}
        title="Platform"
        subtitle="General platform configuration"
      >
        <div className="grid grid-cols-2 gap-4">
          <FieldInput
            label="Platform Name"
            value={local.platform_name}
            onChange={(v) => set('platform_name', v)}
          />
          <FieldInput label="Tagline" value={local.tagline} onChange={(v) => set('tagline', v)} />
          <FieldInput
            label="Support Email"
            value={local.support_email}
            onChange={(v) => set('support_email', v)}
            type="email"
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Timezone</label>
            <select
              value={local.timezone}
              onChange={(e) => set('timezone', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Platform Description
          </label>
          <textarea
            value={local.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
          />
        </div>
      </Section>

      {/* Branding */}
      <Section
        icon={<Palette className="w-4 h-4" />}
        title="Branding"
        subtitle="Customize colors and appearance"
      >
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Primary Color', key: 'primary_color' },
            { label: 'Accent Color', key: 'accent_color' },
            { label: 'Success Color', key: 'success_color' },
          ].map((c) => (
            <div key={c.key}>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">{c.label}</label>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg border border-slate-200 flex-shrink-0 overflow-hidden">
                  <input
                    type="color"
                    value={local[c.key]}
                    onChange={(e) => set(c.key, e.target.value)}
                    className="w-full h-full cursor-pointer border-0 p-0"
                  />
                </div>
                <input
                  type="text"
                  value={local[c.key]}
                  onChange={(e) => set(c.key, e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-mono"
                />
              </div>
            </div>
          ))}
        </div>
        {/* Live preview */}
        <div className="mt-2 p-4 rounded-xl border border-slate-200 bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 mb-3">Live Preview</p>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black"
              style={{ backgroundColor: local.primary_color }}
            >
              IA
            </div>
            <button
              className="px-4 py-1.5 rounded-lg text-white text-xs font-bold"
              style={{ backgroundColor: local.primary_color }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-1.5 rounded-lg text-white text-xs font-bold"
              style={{ backgroundColor: local.accent_color }}
            >
              Accent Button
            </button>
            <span
              className="px-3 py-1 rounded-full text-white text-xs font-bold"
              style={{ backgroundColor: local.success_color }}
            >
              Success
            </span>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section
        icon={<Bell className="w-4 h-4" />}
        title="Notifications"
        subtitle="Configure how the platform sends alerts"
      >
        <div className="space-y-3">
          <Toggle
            label="Email Notifications"
            sub="Send enrollment confirmations, receipts and lesson reminders via email"
            value={bool('notif_email')}
            onChange={() => toggle('notif_email')}
          />
          <Toggle
            label="SMS Notifications"
            sub="Send OTPs and important alerts via SMS (requires Twilio setup)"
            value={bool('notif_sms')}
            onChange={() => toggle('notif_sms')}
          />
          <Toggle
            label="Push Notifications"
            sub="Send mobile push notifications for new content and milestones"
            value={bool('notif_push')}
            onChange={() => toggle('notif_push')}
          />
        </div>
      </Section>

      {/* Security */}
      <Section
        icon={<Shield className="w-4 h-4" />}
        title="Security"
        subtitle="Authentication and access control"
      >
        <div className="space-y-3">
          <Toggle
            label="Two-Factor Authentication"
            sub="Require 2FA for all admin accounts"
            value={bool('2fa_enabled')}
            onChange={() => toggle('2fa_enabled')}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Session Timeout
            </label>
            <select
              value={local.session_timeout}
              onChange={(e) => set('session_timeout', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            >
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>8 hours</option>
              <option>24 hours</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Max Login Attempts
            </label>
            <select
              value={local.max_login_tries}
              onChange={(e) => set('max_login_tries', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            >
              <option>3 attempts</option>
              <option>5 attempts</option>
              <option>10 attempts</option>
            </select>
          </div>
        </div>
      </Section>

      {/* Payments */}
      <Section
        icon={<CreditCard className="w-4 h-4" />}
        title="Payments"
        subtitle="Configure payment gateways and policies"
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Currency</label>
            <select
              value={local.currency}
              onChange={(e) => set('currency', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            >
              <option value="INR">INR — Indian Rupee</option>
              <option value="USD">USD — US Dollar</option>
            </select>
          </div>
          <FieldInput
            label="GST Rate (%)"
            value={local.gst_rate}
            onChange={(v) => set('gst_rate', v)}
            type="number"
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Refund Policy
            </label>
            <select
              value={local.refund_policy}
              onChange={(e) => set('refund_policy', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            >
              <option>7-day refund</option>
              <option>14-day refund</option>
              <option>No refund</option>
            </select>
          </div>
        </div>
        <div className="mt-2 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">💳 Payment Gateway</p>
          <p className="text-xs text-amber-600">
            To configure Razorpay or Stripe keys, add them as environment variables
            (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) in your project secrets panel.
          </p>
        </div>
      </Section>

      {/* Email Templates */}
      <Section
        icon={<Mail className="w-4 h-4" />}
        title="Email Templates"
        subtitle="Customize automated email messages"
      >
        <div className="space-y-3">
          {[
            'Welcome Email',
            'Enrollment Confirmation',
            'Course Completion',
            'Password Reset',
            'Weekly Progress Report',
          ].map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl border border-slate-200"
            >
              <span className="text-sm font-medium text-slate-700">{t}</span>
              <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-indigo-200 transition-colors">
                Edit Template
              </button>
            </div>
          ))}
        </div>
      </Section>

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

function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
      />
    </div>
  );
}

function Toggle({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 px-4 bg-slate-50 rounded-xl border border-slate-200">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-indigo-600' : 'bg-slate-300'}`}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform"
          style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );
}
