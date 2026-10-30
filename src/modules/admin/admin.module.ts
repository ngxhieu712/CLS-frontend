import { lazy } from 'react';
import { Menu, Shield, UserCog, Users } from 'lucide-react';
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
  adminNavItems: [
    { to: '/admin/accounts', label: 'Tài khoản', icon: UserCog },
    { to: '/admin/users', label: 'Người dùng (Ref)', icon: Users },
    { to: '/admin/navbar', label: 'Thanh điều hướng', icon: Menu },
  ],
};
