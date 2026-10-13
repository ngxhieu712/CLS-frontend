import { adminModule }      from '@/modules/admin/admin.module';
import { chatModule }       from '@/modules/chat/chat.module';
import { homeModule }       from '@/modules/home/home.module';
import { notesModule }      from '@/modules/notes/notes.module';
import { profileModule }    from '@/modules/profile/profile.module';
import { publicModule }     from '@/modules/public/public.module';
import { teamModule }       from '@/modules/team/team.module';
import { refereeModule }    from '@/modules/referee/referee.module';
import { editorModule }     from '@/modules/editor/editor.module';
import { tournamentModule } from '@/modules/tournament/tournament.module';
import type { AppModule } from './module.types';

/**
 * Every feature module shown after login. Adding a module = one import + one
 * entry here; its routes, nav links, admin pages and widgets are picked up automatically.
 * Order decides the order of the navigation links.
 */
export const appModules: AppModule[] = [
  publicModule,   // public routes — khán giả
  homeModule,
  notesModule,
  chatModule,
  profileModule,
  // Esports modules
  teamModule,
  refereeModule,
  editorModule,
  tournamentModule,
  // Base admin module
  adminModule,
];

export const publicRoutes    = appModules.flatMap((module) => module.publicRoutes ?? []);
export const protectedRoutes = appModules.flatMap((module) => module.routes);
export const navItems        = appModules.flatMap((module) => module.navItems ?? []);
export const adminRoutes     = appModules.flatMap((module) => module.adminRoutes ?? []);
export const adminNavItems   = appModules.flatMap((module) => module.adminNavItems ?? []);
export const appWidgets      = appModules.flatMap((module) => module.widgets ?? []);
