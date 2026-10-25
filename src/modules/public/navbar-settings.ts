import { CalendarDays, LayoutGrid, Shield, Trophy, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const PUBLIC_NAV_ITEMS = [
  { id: 'home', to: '/', label: 'Trang chủ', icon: LayoutGrid, end: true },
  { id: 'groups', to: '/groups', label: 'Vòng bảng', icon: Trophy },
  { id: 'bracket', to: '/bracket', label: 'Bracket', icon: Shield },
  { id: 'schedule', to: '/schedule', label: 'Lịch đấu', icon: CalendarDays },
  { id: 'teams', to: '/teams', label: 'Các đội', icon: Users },
] satisfies ReadonlyArray<{ id: string; to: string; label: string; icon: LucideIcon; end?: boolean }>;

export type PublicNavbarItemId = (typeof PUBLIC_NAV_ITEMS)[number]['id'];

export interface PublicNavbarSetting {
  id: PublicNavbarItemId;
  label: string;
  visible: boolean;
}

const STORAGE_KEY = 'champion-league:public-navbar';
export const PUBLIC_NAVBAR_CHANGE_EVENT = 'champion-league:public-navbar-change';

export const getDefaultPublicNavbarSettings = (): PublicNavbarSetting[] =>
  PUBLIC_NAV_ITEMS.map(({ id, label }) => ({ id, label, visible: true }));

const normalizeSettings = (value: unknown): PublicNavbarSetting[] => {
  if (!Array.isArray(value)) return getDefaultPublicNavbarSettings();

  const knownIds = new Set<string>(PUBLIC_NAV_ITEMS.map(({ id }) => id));
  const seenIds = new Set<string>();
  const settings: PublicNavbarSetting[] = [];

  for (const entry of value) {
    if (typeof entry !== 'object' || entry === null) continue;

    const candidate = entry as Record<string, unknown>;
    if (typeof candidate.id !== 'string' || !knownIds.has(candidate.id) || seenIds.has(candidate.id)) continue;

    const item = PUBLIC_NAV_ITEMS.find(({ id }) => id === candidate.id);
    if (!item) continue;

    const label = typeof candidate.label === 'string' ? candidate.label.trim().slice(0, 32) : '';
    settings.push({
      id: item.id,
      label: label || item.label,
      visible: typeof candidate.visible === 'boolean' ? candidate.visible : true,
    });
    seenIds.add(item.id);
  }

  for (const item of PUBLIC_NAV_ITEMS) {
    if (!seenIds.has(item.id)) settings.push({ id: item.id, label: item.label, visible: true });
  }

  return settings;
};

export const getPublicNavbarSettings = (): PublicNavbarSetting[] => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeSettings(JSON.parse(saved)) : getDefaultPublicNavbarSettings();
  } catch (error) {
    console.error('Unable to read public navbar settings.', error);
    return getDefaultPublicNavbarSettings();
  }
};

export const savePublicNavbarSettings = (settings: PublicNavbarSetting[]) => {
  const normalized = normalizeSettings(settings);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event(PUBLIC_NAVBAR_CHANGE_EVENT));
};
