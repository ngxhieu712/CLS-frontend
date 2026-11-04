import { lazy } from 'react';
import { Menu, Shield, UserCog, UsersRound } from 'lucide-react';
import type { AppModule } from '@/app/module.types';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminUsersPage } from './pages/AdminUsersPage';

const AdminTeamsPage = lazy(() =>
  import('./pages/AdminTeamsPage').then(({ AdminTeamsPage: Component }) => ({ default: Component }))
);

export const adminModule: AppModule = {
  routes: [],
  // Link from the main app to the admin area. Add `roles: ['admin']` to show it to admins only.
  navItems: [{ to: '/admin', label: 'Admin', icon: Shield }],
  adminRoutes: [
    { path: '/admin', Component: AdminDashboardPage },
    { path: '/admin/teams', Component: AdminTeamsPage },
    { path: '/admin/users', Component: AdminUsersPage },
  ],
  // `/admin/users` is a placeholder page (its hooks are not implemented yet), so it has no sidebar link.
  adminNavItems: [
    { to: '/admin/accounts', label: 'Tài khoản nội bộ', icon: UserCog, group: 'Hệ thống' },
    { to: '/admin/teams', label: 'Quản lý đội', icon: UsersRound, group: 'Giải đấu' },
    { to: '/admin/navbar', label: 'Thanh điều hướng', icon: Menu, group: 'Hệ thống' },
  ],
};
