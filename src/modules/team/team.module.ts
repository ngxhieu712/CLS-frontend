import { LayoutDashboard, UserCircle, Users, Calendar } from 'lucide-react';
import type { AppModule } from '@/app/module.types';
import { TeamDashboardPage } from './pages/TeamDashboardPage';
import { TeamProfilePage }   from './pages/TeamProfilePage';
import { RosterPage }        from './pages/RosterPage';
import { TeamSchedulePage }  from './pages/TeamSchedulePage';

export const teamModule: AppModule = {
  routes: [
    { path: '/team/dashboard', Component: TeamDashboardPage, roles: ['teamManager'] },
    { path: '/team/profile',   Component: TeamProfilePage,   roles: ['teamManager'] },
    { path: '/team/roster',    Component: RosterPage,        roles: ['teamManager'] },
    { path: '/team/schedule',  Component: TeamSchedulePage,  roles: ['teamManager'] },
  ],
  navItems: [
    { to: '/team/dashboard', label: 'Dashboard đội', icon: LayoutDashboard, roles: ['teamManager'] },
    { to: '/team/profile',   label: 'Hồ sơ đội',    icon: UserCircle,      roles: ['teamManager'] },
    { to: '/team/roster',    label: 'Tuyển thủ',    icon: Users,           roles: ['teamManager'] },
    { to: '/team/schedule',  label: 'Lịch đội',     icon: Calendar,        roles: ['teamManager'] },
  ],
};
