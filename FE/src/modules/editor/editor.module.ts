import { Film } from 'lucide-react';
import type { AppModule } from '@/app/module.types';
import { RecordingManagerPage } from './pages/RecordingManagerPage';

export const editorModule: AppModule = {
  routes: [
    { path: '/editor/recordings', Component: RecordingManagerPage, roles: ['editor'] },
  ],
  navItems: [
    { to: '/editor/recordings', label: 'Bản ghi', icon: Film, roles: ['editor'] },
  ],
};
