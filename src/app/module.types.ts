import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import type { UserRole } from '@/modules/auth/types/auth.types';

/** A page reachable after login. Set `roles` to hide it from other users. */
export interface ModuleRoute {
  path: string;
  Component: ComponentType;
  roles?: UserRole[];
}

/** A link in the top navigation bar. */
export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

/** A route in the public (unauthenticated) area. */
export interface PublicRoute {
  path: string;
  Component: ComponentType;
}

/** What a feature module contributes to the app. Register it in `src/app/modules.ts`. */
export interface AppModule {
  /** Pages in the public layout (no login required). */
  publicRoutes?: PublicRoute[];
  /** Pages inside the main app layout (top navigation). */
  routes: ModuleRoute[];
  navItems?: NavItem[];
  /** Pages inside the admin area (`/admin/...`, sidebar layout). */
  adminRoutes?: ModuleRoute[];
  /** Links in the admin sidebar. */
  adminNavItems?: NavItem[];
  /** Components shown on every page of the main app, e.g. the floating chat button. */
  widgets?: ComponentType[];
}
