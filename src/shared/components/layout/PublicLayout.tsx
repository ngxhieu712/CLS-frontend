import { Link, NavLink, Outlet } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import {
  getPublicNavbarSettings,
  PUBLIC_NAVBAR_CHANGE_EVENT,
  PUBLIC_NAV_ITEMS,
} from '@/modules/public/navbar-settings';

/** Khu vực khán giả: luôn dùng giao diện tối, thanh điều hướng cố định ở trên. */
export const PublicLayout = () => {
  const [navbarSettings, setNavbarSettings] = useState(getPublicNavbarSettings);

  useEffect(() => {
    const refreshSettings = () => setNavbarSettings(getPublicNavbarSettings());
    window.addEventListener(PUBLIC_NAVBAR_CHANGE_EVENT, refreshSettings);
    window.addEventListener('storage', refreshSettings);
    return () => {
      window.removeEventListener(PUBLIC_NAVBAR_CHANGE_EVENT, refreshSettings);
      window.removeEventListener('storage', refreshSettings);
    };
  }, []);

  return (
    <div className="dark">
      <div className="relative flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
        {/* Soft amber glow behind the header */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[520px]"
          style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(245,165,36,0.07), transparent 70%)' }}
        />

        <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex min-h-[68px] max-w-[1240px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 sm:px-6">
            <Link to="/" className="flex shrink-0 items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
                <Trophy className="size-5" />
              </span>
              <span className="hidden text-sm font-black tracking-[0.06em] sm:inline">CHAMPION LEAGUE</span>
            </Link>

            <nav className="order-last flex w-full items-center gap-1 overflow-x-auto md:order-none md:w-auto md:flex-1" aria-label="Điều hướng chính">
              {navbarSettings.filter(({ visible }) => visible).map(({ id, label }) => {
                const item = PUBLIC_NAV_ITEMS.find((navItem) => navItem.id === id);
                if (!item) return null;
                const { to, icon: Icon, end } = item;

                return (
                  <NavLink
                    key={id}
                    to={to}
                    end={end}
                    className={({ isActive }) => cn(
                      'flex items-center gap-2 whitespace-nowrap rounded-[10px] px-3.5 py-2.5 text-sm transition-colors',
                      isActive ? 'bg-primary/10 font-semibold text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-2.5 md:ml-0">
              <Link
                to="/login"
                className="inline-flex h-11 items-center rounded-[10px] border px-4 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="hidden h-11 items-center rounded-[10px] bg-primary px-[18px] text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
              >
                Đăng ký đội
              </Link>
            </div>
          </div>
        </header>

        <main className="relative mx-auto w-full max-w-[1240px] flex-1 px-4 py-8 sm:px-6">
          <Outlet />
        </main>

        <footer className="relative border-t">
          <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-4 px-4 py-7 text-[13px] text-muted-foreground sm:px-6">
            <span>© {new Date().getFullYear()} Champion League System</span>
            <span>Nền tảng quản lý giải đấu esports</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
