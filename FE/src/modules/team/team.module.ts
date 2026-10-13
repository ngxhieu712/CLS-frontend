import { LayoutDashboard, UserCircle, Users, Calendar } from 'lucide-react';
import type { AppModule } from '@/app/module.types';
import { TeamDashboardPage } from './pages/TeamDashboardPage';
import { TeamProfilePage }   from './pages/TeamProfilePage';
import { RosterPage }        from './pages/RosterPage';
import { TeamSchedulePage }  from './pages/TeamSchedulePage';

export const teamModule: AppModule = {
  routes: [
    { path: '/team/dashboard', Component: TeamDashboardPage, roles: ['team_manager'] },
    { path: '/team/profile',   Component: TeamProfilePage,   roles: ['team_manager'] },
    { path: '/team/roster',    Component: RosterPage,        roles: ['team_manager'] },
    { path: '/team/schedule',  Component: TeamSchedulePage,  roles: ['team_manager'] },
  ],
  navItems: [
    { to: '/team/dashboard', label: 'Dashboard đội', icon: LayoutDashboard, roles: ['team_manager'] },
    { to: '/team/profile',   label: 'Hồ sơ đội',    icon: UserCircle,      roles: ['team_manager'] },
    { to: '/team/roster',    label: 'Tuyển thủ',    icon: Users,           roles: ['team_manager'] },
    { to: '/team/schedule',  label: 'Lịch đội',     icon: Calendar,        roles: ['team_manager'] },
  ],
};
