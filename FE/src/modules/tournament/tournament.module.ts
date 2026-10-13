import { LayoutDashboard, Settings, Users, Shuffle, Calendar, Trophy } from 'lucide-react';
import type { AppModule } from '@/app/module.types';
import { AdminDashboardPage }    from './pages/AdminDashboardPage';
import { TournamentSetupPage }   from './pages/TournamentSetupPage';
import { TeamManagementPage }    from './pages/TeamManagementPage';
import { DrawPage }              from './pages/DrawPage';
import { AdminSchedulePage }     from './pages/AdminSchedulePage';
import { PlayoffSetupPage }      from './pages/PlayoffSetupPage';

export const tournamentModule: AppModule = {
  routes: [],
  adminRoutes: [
    { path: '/admin',             Component: AdminDashboardPage,  },
    { path: '/admin/tournament',  Component: TournamentSetupPage, },
    { path: '/admin/teams',       Component: TeamManagementPage,  },
    { path: '/admin/draw',        Component: DrawPage,            },
    { path: '/admin/schedule',    Component: AdminSchedulePage,   },
    { path: '/admin/playoff',     Component: PlayoffSetupPage,    },
  ],
  adminNavItems: [
    { to: '/admin',            label: 'Dashboard',          icon: LayoutDashboard },
    { to: '/admin/tournament', label: 'Thiết lập giải',     icon: Settings },
    { to: '/admin/teams',      label: 'Đội & Tài khoản',   icon: Users },
    { to: '/admin/draw',       label: 'Chia bảng',          icon: Shuffle },
    { to: '/admin/schedule',   label: 'Lịch đấu',           icon: Calendar },
    { to: '/admin/playoff',    label: 'Playoff',             icon: Trophy },
  ],
};
