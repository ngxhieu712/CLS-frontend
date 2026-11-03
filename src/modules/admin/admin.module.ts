import { lazy } from 'react';
import { Menu, Shield, UserCog } from 'lucide-react';
import type { AppModule } from '@/app/module.types';

const AdminNavbarPage = lazy(() => import('./pages/AdminNavbarPage').then(({ AdminNavbarPage: Component }) => ({ default: Component })));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage').then(({ AdminUsersPage: Component }) => ({ default: Component })));
const AdminAccountsPage = lazy(() => import('./pages/AdminAccountsPage').then(({ AdminAccountsPage: Component }) => ({ default: Component })));

export const adminModule: AppModule = {
  routes: [],
  // Link from the main app to the admin area. Add `roles: ['admin']` to show it to admins only.
  navItems: [{ to: '/admin', label: 'Admin', icon: Shield }],
  adminRoutes: [
    { path: '/admin/accounts', Component: AdminAccountsPage },
    { path: '/admin/users', Component: AdminUsersPage },
    { path: '/admin/navbar', Component: AdminNavbarPage },
  ],
  // `/admin/users` is a placeholder page (its hooks are not implemented yet), so it has no sidebar link.
  adminNavItems: [
    { to: '/admin/accounts', label: 'Tài khoản nội bộ', icon: UserCog, group: 'Hệ thống' },
    { to: '/admin/navbar', label: 'Thanh điều hướng', icon: Menu, group: 'Hệ thống' },
  ],
};
