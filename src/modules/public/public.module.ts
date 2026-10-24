import type { AppModule } from '@/app/module.types';
import { HomePage }        from './pages/HomePage';
import { GroupsPage }      from './pages/GroupsPage';
import { BracketPage }     from './pages/BracketPage';
import { SchedulePage }    from './pages/SchedulePage';
import { MatchDetailPage } from './pages/MatchDetailPage';
import { TeamsPage, TeamDetailPage } from './pages/TeamsPage';

/** Public module — khán giả, không cần đăng nhập. */
export const publicModule: AppModule = {
  routes: [], // không có protected routes
  publicRoutes: [
    { path: '/',            Component: HomePage },
    { path: '/groups',      Component: GroupsPage },
    { path: '/bracket',     Component: BracketPage },
    { path: '/schedule',    Component: SchedulePage },
    { path: '/matches/:id', Component: MatchDetailPage },
    { path: '/teams',       Component: TeamsPage },
    { path: '/teams/:id',   Component: TeamDetailPage },
  ],
};
