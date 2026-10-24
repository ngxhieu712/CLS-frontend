import { LayoutDashboard, Swords } from 'lucide-react';
import type { AppModule } from '@/app/module.types';
import { RefereeDashboardPage } from './pages/RefereeDashboardPage';
import { MatchControlPage }     from './pages/MatchControlPage';

export const refereeModule: AppModule = {
  routes: [
    { path: '/referee/dashboard',    Component: RefereeDashboardPage, roles: ['referee'] },
    { path: '/referee/match/:id',    Component: MatchControlPage,     roles: ['referee'] },
  ],
  navItems: [
    { to: '/referee/dashboard', label: 'Dashboard TT', icon: LayoutDashboard, roles: ['referee'] },
    { to: '/referee/match',     label: 'Trận đấu',     icon: Swords,          roles: ['referee'] },
  ],
};
