import { ArrowLeft, Bell, ChevronRight, LogOut, Menu, Trophy, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import type { NavItem } from '@/app/module.types';
import { usePendingTeams } from '@/modules/admin/hooks/use-admin';
import { useCurrentUser, useLogout } from '@/modules/auth/hooks/use-current-user';
import { MOCK_MATCHES, MOCK_TOURNAMENT } from '@/shared/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';
import { cn } from '@/shared/lib/utils';

const ADMIN_HOME = '/admin';

interface AdminLayoutProps {
  navItems: NavItem[];
}

/** Splits the links into sidebar sections, keeping the order they were registered in. */
const groupNavItems = (items: NavItem[]) => {
  const groups: { title?: string; items: NavItem[] }[] = [];
  for (const item of items) {
    const group = groups.find(({ title }) => title === item.group);
    if (group) group.items.push(item);
    else groups.push({ title: item.group, items: [item] });
  }
  return groups;
};

/**
 * Shell of the admin area: grouped sidebar navigation (a drawer on small screens),
 * top bar with breadcrumb and quick actions, and the page in the middle.
 */
export const AdminLayout = ({ navItems }: AdminLayoutProps) => {
  const { data: user } = useCurrentUser();
  const handleLogout = useLogout();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '??';
  const displayName = user?.fullName ?? user?.email ?? 'Admin';
  const activePage = navItems.find((item) => item.to === location.pathname)
    ?? navItems.find((item) => item.to !== ADMIN_HOME && location.pathname.startsWith(`${item.to}/`));

  const pendingApplications = usePendingTeams().data?.length ?? 0;
  const pendingResults = MOCK_MATCHES.filter(({ status }) => status === 'pending_confirm').length;
  const pendingCount = pendingApplications + pendingResults;
  // Work waiting in a section, shown as a badge next to its link. Team applications are the urgent one.
  const badges: Record<string, { count: number; urgent?: boolean }> = {
    '/admin/approval': { count: pendingApplications, urgent: true },
    '/admin/schedule': { count: pendingResults },
  };

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col">
      <Link to={ADMIN_HOME} className="flex h-[68px] shrink-0 items-center gap-3 border-b px-5">
        <div className="flex size-9 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
          <Trophy className="size-5" />
        </div>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-extrabold tracking-[0.06em]">CHAMPION LEAGUE</span>
          <span className="block truncate text-[11px] text-muted-foreground">{MOCK_TOURNAMENT.name.replace('Champion League ', '')} · Quản trị</span>
        </span>
      </Link>

      <div className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {groupNavItems(navItems).map((group) => (
          <div key={group.title ?? '_'}>
            {group.title && (
              <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground/80">{group.title}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const badge = badges[item.to];
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    // The admin home would otherwise stay highlighted on every admin page.
                    end={item.to === ADMIN_HOME}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition-colors duration-150',
                        isActive
                          ? 'bg-primary/12 font-semibold text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )
                    }
                  >
                    <item.icon className="size-[18px] shrink-0 transition-transform duration-150 group-hover:scale-110" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {badge && badge.count > 0 && (
                      <span
                        className={cn(
                          'min-w-[22px] rounded-full px-1.5 text-center text-[11px] font-bold leading-5 tabular-nums',
                          badge.urgent ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                        )}
                      >
                        {badge.count}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="shrink-0 space-y-1 border-t p-3.5">
        <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-2.5">
          <Avatar className="size-9">
            <AvatarImage src={undefined} alt={user?.email} /> {/* TODO: avatarUrl not in BE */}
            <AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold">{displayName}</p>
            <p className="truncate text-[11px] text-muted-foreground">Quản trị viên</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Đăng xuất"
            title="Đăng xuất"
            onClick={handleLogout}
            className="size-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
          Về trang chính
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar: fixed column on large screens */}
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:block">
        <div className="sticky top-0 h-screen">{sidebar}</div>
      </aside>

      {/* Sidebar: drawer on small screens */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Đóng menu" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r bg-sidebar shadow-xl">
            <button
              type="button"
              aria-label="Đóng menu"
              className="absolute right-3 top-6 text-muted-foreground hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              <X className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-[68px] items-center gap-3 border-b bg-card/85 px-4 backdrop-blur sm:px-8">
          <Button variant="ghost" size="sm" className="size-10 p-0 lg:hidden" aria-label="Mở menu" onClick={() => setMenuOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span>Quản trị</span>
              {activePage?.group && (
                <>
                  <ChevronRight className="size-3" />
                  <span>{activePage.group}</span>
                </>
              )}
            </p>
            <p className="truncate text-[15px] font-bold">{activePage?.label ?? 'Quản trị hệ thống'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={ADMIN_HOME}
              aria-label={`${pendingCount} việc cần xử lý`}
              title={`${pendingCount} việc cần xử lý`}
              className="relative flex size-10 items-center justify-center rounded-[10px] border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Bell className="size-[18px]" />
              {pendingCount > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-card" />}
            </Link>
            <ThemeToggle iconOnly className="rounded-[10px] border bg-muted/50" />
            <Avatar className="size-9 lg:hidden">
              <AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="w-full max-w-[1240px] flex-1 px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
