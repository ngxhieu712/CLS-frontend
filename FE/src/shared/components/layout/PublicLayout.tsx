import { Link, NavLink, Outlet } from 'react-router-dom';
import { Shield, Calendar, Users, Trophy, LayoutGrid, Bell } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const NAV = [
  { to: '/',         label: 'Trang chủ', icon: LayoutGrid, end: true },
  { to: '/groups',   label: 'Vòng bảng', icon: Trophy },
  { to: '/bracket',  label: 'Bracket',   icon: Shield },
  { to: '/schedule', label: 'Lịch đấu',  icon: Calendar },
  { to: '/teams',    label: 'Các đội',   icon: Users },
];

export const PublicLayout = () => (
  <div className="dark">
    <div className="relative min-h-screen overflow-x-hidden text-slate-100" style={{ background: 'var(--es-bg-deep)' }}>

      {/* ── Ambient background ──────────────────────────────────── */}
      <div className="pointer-events-none fixed left-0 top-0 -z-10 h-full w-full" aria-hidden="true">
        <div className="absolute inset-0" style={{
          background:
            'radial-gradient(ellipse at 15% 30%, rgba(245,158,11,0.06) 0, transparent 50%),' +
            'radial-gradient(ellipse at 85% 70%, rgba(34,211,238,0.04) 0, transparent 50%),' +
            'linear-gradient(180deg, #0a0d1a 0%, #070a13 100%)',
        }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage:
            'linear-gradient(rgba(245,158,11,0.5) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(245,158,11,0.5) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom,transparent,black 10%,black 90%,transparent)',
        }} />
      </div>

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b" style={{
        background: 'rgba(7,10,19,0.92)',
        borderColor: 'rgba(245,158,11,0.15)',
        backdropFilter: 'blur(14px)',
      }}>
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4">

          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5 mr-4">
            <div className="flex size-8 items-center justify-center rounded-lg" style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.15))',
              border: '1px solid rgba(245,158,11,0.4)',
              boxShadow: '0 0 12px rgba(245,158,11,0.2)',
            }}>
              <Trophy className="size-4 text-amber-400" />
            </div>
            <span className="hidden text-sm font-extrabold tracking-widest text-white sm:inline">
              CHAMPION <span className="text-amber-400">LEAGUE</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex flex-1 items-center gap-0.5 overflow-x-auto" aria-label="Điều hướng chính">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => cn(
                  'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150',
                  isActive ? 'text-amber-400' : 'text-slate-500 hover:text-slate-200',
                )}
                style={({ isActive }) => isActive ? {
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  boxShadow: '0 0 10px rgba(245,158,11,0.1)',
                } : {}}
              >
                <Icon className="size-4 shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="relative flex size-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-200 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              aria-label="Thông báo"
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-amber-400" />
            </button>

            <Link
              to="/login"
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-amber-400 transition-all hover:text-amber-300"
              style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.35)',
                boxShadow: '0 0 12px rgba(245,158,11,0.1)',
              }}
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="relative mx-auto max-w-[1400px] px-4 py-6">
        <Outlet />
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="relative mt-16 py-5 text-center text-xs" style={{
        borderTop: '1px solid rgba(245,158,11,0.1)',
        color: '#334155',
      }}>
        © 2025 Champion League System
        <span className="mx-2 text-amber-500">•</span>
        Nền tảng quản lý giải đấu chuyên nghiệp
      </footer>
    </div>
  </div>
);
