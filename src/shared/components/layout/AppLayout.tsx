import type { ComponentType } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut, Trophy } from 'lucide-react';
import type { NavItem } from '@/app/module.types';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';
import { useCurrentUser, useLogout } from '@/modules/auth/hooks/use-current-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

interface AppLayoutProps {
  navItems: NavItem[];
  /** Floating components from the module registry (e.g. the chat button). */
  widgets?: ComponentType[];
}

export const AppLayout = ({ navItems: allNavItems, widgets = [] }: AppLayoutProps) => {
  // An expired or rejected token answers 401, which the http interceptor turns
  // into a redirect to /logout. Other failures (server down) keep the user signed in.
  const { data: user } = useCurrentUser();
  const handleLogout = useLogout();

  const navItems = allNavItems.filter((item) => !item.roles || (user && item.roles.includes(user.role)));

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '??';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex min-h-[68px] max-w-[1240px] flex-wrap items-center gap-x-5 px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex size-[34px] items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
              <Trophy className="size-[18px]" />
            </span>
            <span className="hidden text-[13px] font-black tracking-[0.06em] md:inline">CHAMPION LEAGUE</span>
          </Link>

          <nav aria-label="Điều hướng" className="order-last -mb-px flex w-full gap-0.5 overflow-x-auto [scrollbar-width:none] lg:order-none lg:w-auto lg:flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-[22px] text-sm transition-colors',
                    isActive
                      ? 'border-primary font-semibold text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 py-3 lg:ml-0">
            <ThemeToggle iconOnly className="rounded-[10px] border bg-muted/50" />
            <div className="flex items-center gap-2.5 rounded-full border py-1 pl-1 pr-1 sm:pr-3">
              <Avatar className="size-[34px]">
                <AvatarImage src={undefined} alt={user?.email} /> {/* TODO: avatarUrl not in BE */}
                <AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden max-w-40 truncate text-[13px] font-semibold sm:inline">{user?.fullName ?? user?.email}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              aria-label="Đăng xuất"
              title="Đăng xuất"
              className="size-10 p-0 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-[18px]" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      {widgets.map((Widget, index) => (
        <Widget key={index} />
      ))}
    </div>
  );
};
