'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  Command,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Sparkles,
  Tag,
  Users,
  X,
} from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/codes', label: 'Enrollment codes', icon: Tag },
];

const SYSTEM_NAV = [
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const name = session?.user?.name || 'Workspace admin';
  const email = session?.user?.email || 'admin@ias-academy.in';

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#15171a] selection:bg-violet-200">
      {menuOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-white/[0.07] bg-[#111318] text-white transition-transform duration-300 lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-[76px] items-center justify-between px-5">
          <Link href="/admin" className="group flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-[13px] bg-white text-[11px] font-black tracking-[-0.04em] text-[#111318] shadow-[0_10px_35px_rgba(255,255,255,0.12)]">
              IA
              <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-orange-300" />
            </div>
            <div>
              <p className="text-[15px] font-semibold tracking-[-0.02em]">IAs Academy</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">Control center</p>
            </div>
          </Link>
          <button className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setMenuOpen(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-4 mb-5 rounded-2xl border border-white/[0.08] bg-white/[0.045] p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/20 text-violet-300">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-white/90">Production</p>
                <p className="text-[10px] text-white/35">Main workspace</p>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-white/25" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3">
          <NavSection label="Workspace" items={NAV} closeMenu={() => setMenuOpen(false)} />
          <NavSection label="System" items={SYSTEM_NAV} closeMenu={() => setMenuOpen(false)} />
        </nav>

        <div className="m-3 border-t border-white/[0.07] pt-3">
          <div className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-white/[0.05]">
            <div className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-indigo-600 text-xs font-bold shadow-lg shadow-violet-950/40">
              {name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white/90">{name}</p>
              <p className="truncate text-[10px] text-white/35">{email}</p>
            </div>
            <Link href="/account/logout" aria-label="Log out" className="rounded-lg p-2 text-white/25 transition-colors hover:bg-red-500/10 hover:text-red-300">
              <LogOut className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[272px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center gap-4 border-b border-black/[0.06] bg-[#f5f6f8]/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button aria-label="Open navigation" className="rounded-xl border border-black/[0.08] bg-white p-2.5 text-slate-600 shadow-sm lg:hidden" onClick={() => setMenuOpen(true)}>
            <Menu className="h-4 w-4" />
          </button>
          <div className="relative hidden max-w-[420px] flex-1 md:block">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Search workspace"
              placeholder="Search courses, students, or actions…"
              className="h-10 w-full rounded-xl border border-black/[0.07] bg-white/80 pl-10 pr-16 text-xs text-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10"
            />
            <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-black/[0.07] bg-slate-50 px-1.5 py-1 text-[9px] font-medium text-slate-400">
              <Command className="h-2.5 w-2.5" /> K
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/admin/notifications" aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border border-black/[0.07] bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-900">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-violet-500 ring-2 ring-white" />
            </Link>
            <Link href="/admin/courses" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#17191d] px-3.5 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(15,17,21,0.18)] transition hover:-translate-y-0.5 hover:bg-black sm:px-4">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New course</span>
            </Link>
          </div>
        </header>
        <main className="admin-surface mx-auto max-w-[1540px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

function NavSection({ label, items, closeMenu }: { label: string; items: typeof NAV; closeMenu: () => void }) {
  const pathname = usePathname();
  return (
    <div className="mb-7">
      <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">{label}</p>
      <div className="space-y-1">
        {items.map(({ href, label: itemLabel, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className={`group flex h-10 items-center gap-3 rounded-xl px-3 text-xs font-medium transition-all ${
                active ? 'bg-white text-[#15171a] shadow-[0_8px_24px_rgba(0,0,0,0.25)]' : 'text-white/45 hover:bg-white/[0.055] hover:text-white/85'
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? 'text-violet-600' : 'text-white/30 group-hover:text-white/70'}`} />
              <span className="flex-1">{itemLabel}</span>
              {active && <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
