import { Link, NavLink, Outlet } from 'react-router-dom';
import { Shield, Calendar, Users, Trophy, LayoutGrid } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const NAV = [
  { to: '/',         label: 'Trang chủ', icon: LayoutGrid, end: true },
  { to: '/groups',   label: 'Vòng bảng', icon: Trophy },
  { to: '/bracket',  label: 'Bracket',   icon: Shield },
  { to: '/schedule', label: 'Lịch đấu',  icon: Calendar },
  { to: '/teams',    label: 'Các đội',   icon: Users },
];

export const PublicLayout = () => (
  /* force dark — toàn bộ public area dùng nền tối esports */
  <div className="dark">
    <div
      className="relative min-h-screen overflow-x-hidden text-slate-100"
      style={{ background: '#071426' }}
    >
      {/* Ambient background blobs — giống login */}
      <div
        className="pointer-events-none fixed left-0 top-0 -z-10 h-full w-full"
        aria-hidden="true"
      >
        {/* Radial gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 40%, #19304c 0, #0b1b30 40%, #071426 80%)' }} />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(117,153,201,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(117,153,201,0.5) 1px,transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'linear-gradient(to bottom,transparent,black 15%,black 85%,transparent)',
          }}
        />
        {/* Ambient blobs */}
        <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ background: '#1a2f50' }} />
        <div className="absolute -right-40 bottom-1/4 h-80 w-80 rounded-full opacity-15 blur-3xl" style={{ background: '#0f2340' }} />
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full opacity-10 blur-3xl" style={{ background: '#d97706' }} />
      </div>

      {/* Topbar */}
      <header
        className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md"
        style={{ background: 'rgba(7,20,38,0.85)' }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/30">
              <Trophy className="size-4 text-amber-400" />
            </div>
            <span className="hidden text-sm font-bold tracking-wide text-white sm:inline">
              CHAMPION <span className="text-amber-400">LEAGUE</span>
            </span>
          </Link>

          <nav className="flex items-center gap-0.5 overflow-x-auto" aria-label="Điều hướng chính">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors duration-150',
                    isActive
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                <Icon className="size-4 shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>

          <Link
            to="/login"
            className="shrink-0 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="relative mt-16 border-t border-white/8 py-6 text-center text-xs text-slate-600">
        © 2025 Champion League System
        <span className="mx-2 text-amber-500">•</span>
        Nền tảng quản lý giải đấu chuyên nghiệp
      </footer>
    </div>
  </div>
);
