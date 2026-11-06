import { lazy } from 'react';
import { LayoutDashboard, Settings, Users, Shuffle, Calendar, Trophy, ClipboardList } from 'lucide-react';
import type { AppModule } from '@/app/module.types';

const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(({ AdminDashboardPage: Component }) => ({ default: Component })));
const TournamentSetupPage = lazy(() => import('./pages/TournamentSetupPage').then(({ TournamentSetupPage: Component }) => ({ default: Component })));
const TeamManagementPage = lazy(() => import('./pages/TeamManagementPage').then(({ TeamManagementPage: Component }) => ({ default: Component })));
const DrawPage = lazy(() => import('./pages/DrawPage').then(({ DrawPage: Component }) => ({ default: Component })));
const AdminSchedulePage = lazy(() => import('./pages/AdminSchedulePage').then(({ AdminSchedulePage: Component }) => ({ default: Component })));
const PlayoffSetupPage = lazy(() => import('./pages/PlayoffSetupPage').then(({ PlayoffSetupPage: Component }) => ({ default: Component })));

export const tournamentModule: AppModule = {
  routes: [],
  adminRoutes: [
    { path: '/admin',             Component: AdminDashboardPage  },
    { path: '/admin/tournament',  Component: TournamentSetupPage },
    { path: '/admin/teams',       Component: TeamManagementPage  },
    { path: '/admin/draw',        Component: DrawPage            },
    { path: '/admin/schedule',    Component: AdminSchedulePage   },
    { path: '/admin/playoff',     Component: PlayoffSetupPage    },
  ],
  adminNavItems: [
    { to: '/admin',            label: 'Tổng quan',          icon: LayoutDashboard },
    { to: '/admin/tournament', label: 'Thiết lập giải',     icon: Settings,      group: 'Vận hành giải' },
    { to: '/admin/approval',   label: 'Duyệt hồ sơ',        icon: ClipboardList, group: 'Vận hành giải' },
    { to: '/admin/teams',      label: 'Đội & Tài khoản',    icon: Users,         group: 'Vận hành giải' },
    { to: '/admin/draw',       label: 'Chia bảng',          icon: Shuffle,       group: 'Vận hành giải' },
    { to: '/admin/schedule',   label: 'Lịch đấu',           icon: Calendar,      group: 'Vận hành giải' },
    { to: '/admin/playoff',    label: 'Playoff',            icon: Trophy,        group: 'Vận hành giải' },
  ],
};
