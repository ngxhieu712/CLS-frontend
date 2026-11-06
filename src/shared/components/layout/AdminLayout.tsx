import { ArrowLeft, Bell, ChevronRight, LogOut, Menu, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import type { NavItem } from '@/app/module.types';
import { usePendingTeams } from '@/modules/admin/hooks/use-admin';
import { useCurrentUser, useLogout } from '@/modules/auth/hooks/use-current-user';
import { MOCK_MATCHES } from '@/shared/lib/mock-data';
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
  // Work waiting in a section, shown as a badge next to its link.
  const badges: Record<string, number> = {
    '/admin/approval': pendingApplications,
    '/admin/schedule': pendingResults,
  };

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col">
      <Link to={ADMIN_HOME} className="flex h-16 shrink-0 items-center gap-3 border-b px-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-md shadow-orange-500/20">
          <ShieldCheck className="size-5" />
        </div>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold tracking-wide">CHAMPION LEAGUE</span>
          <span className="block truncate text-[11px] text-muted-foreground">Cổng quản trị giải đấu</span>
        </span>
      </Link>

      <div className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groupNavItems(navItems).map((group) => (
          <div key={group.title ?? '_'}>
            {group.title && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{group.title}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  // The admin home would otherwise stay highlighted on every admin page.
                  end={item.to === ADMIN_HOME}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150',
                      isActive
                        ? 'bg-primary/12 font-medium text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Left accent bar */}
                      <span className={cn(
                        'absolute left-0 top-1/2 w-1 -translate-y-1/2 rounded-r-full transition-all duration-150',
                        isActive ? 'h-5 bg-primary' : 'h-0 bg-primary/50 group-hover:h-3',
                      )} />
                      <item.icon className={cn('size-4 shrink-0 transition-transform duration-150', !isActive && 'group-hover:scale-110')} />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {badges[item.to] > 0 && (
                        <span className="rounded-full bg-primary/15 px-1.5 text-[11px] font-semibold leading-5 tabular-nums text-primary">
                          {badges[item.to]}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="shrink-0 space-y-1 border-t p-3">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <Avatar className="size-8">
            <AvatarImage src={undefined} alt={user?.email} /> {/* TODO: avatarUrl not in BE */}
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-[11px] text-muted-foreground">Quản trị viên</p>
          </div>
        </div>
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
          Về trang chính
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-muted/30 dark:bg-background">
      {/* Sidebar: fixed column on large screens */}
      <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
        <div className="sticky top-0 h-screen">{sidebar}</div>
      </aside>

      {/* Sidebar: drawer on small screens */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Đóng menu" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r bg-card shadow-xl">
            <button
              type="button"
              aria-label="Đóng menu"
              className="absolute right-3 top-5 text-muted-foreground hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              <X className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b bg-card/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/70 sm:px-6">
          <Button variant="ghost" size="sm" className="lg:hidden" aria-label="Mở menu" onClick={() => setMenuOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:flex">
              <span>Quản trị</span>
              {activePage?.group && (
                <>
                  <ChevronRight className="size-3" />
                  <span>{activePage.group}</span>
                </>
              )}
            </p>
            <p className="truncate text-sm font-semibold">{activePage?.label ?? 'Quản trị hệ thống'}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              to={ADMIN_HOME}
              aria-label={`${pendingCount} thông báo cần xử lý`}
              className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Bell className="size-4" />
              {pendingCount > 0 && (
                <span className="absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-4 text-white ring-2 ring-card">
                  {pendingCount}
                </span>
              )}
            </Link>
            <ThemeToggle />
            <Avatar className="size-8 lg:hidden">
              <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">{initials}</AvatarFallback>
            </Avatar>
            <span className="mx-1 hidden h-6 w-px bg-border sm:block" />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground hover:text-foreground">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
