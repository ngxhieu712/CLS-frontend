import { Trophy } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';

const navItems = [
  { to: '/login', label: 'Đăng nhập' },
  { to: '/register', label: 'Đăng ký' },
];

export const AuthLayout = () => {
  const location = useLocation();

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-4 md:p-8">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <section className="grid w-full gap-6 md:grid-cols-2">
        <div className="hidden rounded-2xl border bg-card p-8 md:flex md:flex-col md:justify-between">
          <div>
            <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Trophy className="size-6" />
            </div>
            <h1 className="text-3xl font-bold">Champion League System</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Hệ thống quản lý giải đấu esports — vòng bảng, bracket, kết quả trận đấu theo thời gian thực.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                Quản lý vòng bảng và playoff
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                Trọng tài nhập kết quả, admin xác nhận
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                5 vai trò: Admin, Trọng tài, Quản lý đội, Biên tập viên, Khán giả
              </li>
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">TypeScript • React • shadcn/ui • TailwindCSS</p>
        </div>

        <div className="space-y-4">
          <nav className="inline-flex rounded-lg border bg-muted/40 p-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm text-muted-foreground transition',
                  location.pathname === item.to && 'bg-background text-foreground shadow-sm'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Outlet />
        </div>
      </section>
    </main>
  );
};
