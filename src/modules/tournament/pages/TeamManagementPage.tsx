import { useState } from 'react';
import { Search, Plus, Key, Trash2, Users, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_TEAMS } from '@/shared/lib/mock-data';
import { TeamAvatar } from '@/shared/components/team-avatar';
import type { UserRole } from '@/modules/auth/types/auth.types';

type AccountRow = { id: string; email: string; role: UserRole; teamName?: string };

const MOCK_ACCOUNTS: AccountRow[] = [
  { id: 'a1', email: 'alpha@cls.vn',   role: 'teamManager', teamName: 'Team Alpha' },
  { id: 'a2', email: 'dragon@cls.vn',  role: 'teamManager', teamName: 'Dragon Force' },
  { id: 'a3', email: 'ref1@cls.vn',    role: 'referee' },
  { id: 'a4', email: 'ref2@cls.vn',    role: 'referee' },
  { id: 'a5', email: 'media@cls.vn',   role: 'editor' },
];

const ROLE_LABELS: Record<UserRole, string> = {
  admin:       'Admin',
  referee:     'Trọng tài',
  teamManager: 'Quản lý đội',
  editor:      'Biên tập viên',
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin:       'bg-amber-500/20 text-amber-400',
  referee:     'bg-blue-500/15 text-blue-400',
  teamManager: 'bg-emerald-500/15 text-emerald-400',
  editor:      'bg-purple-500/15 text-purple-400',
};

export const TeamManagementPage = () => {
  const [tab, setTab] = useState<'teams' | 'accounts'>('teams');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Quản lý đội &amp; Tài khoản</h1>
          <p className="mt-1 text-sm text-zinc-500">{MOCK_TEAMS.length} đội · {MOCK_ACCOUNTS.length} tài khoản</p>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:opacity-90 cursor-pointer"
          onClick={() => toast.info('Tính năng thêm sẽ mở dialog')}
        >
          <Plus className="size-4" /> Thêm mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-card p-1 w-fit">
        <button onClick={() => setTab('teams')} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${tab === 'teams' ? 'bg-amber-500/15 text-amber-400' : 'text-zinc-400 hover:text-white'}`}>
          <Users className="size-4" /> Đội ({MOCK_TEAMS.length})
        </button>
        <button onClick={() => setTab('accounts')} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${tab === 'accounts' ? 'bg-amber-500/15 text-amber-400' : 'text-zinc-400 hover:text-white'}`}>
          <UserCheck className="size-4" /> Tài khoản ({MOCK_ACCOUNTS.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          placeholder={tab === 'teams' ? 'Tìm đội...' : 'Tìm email...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none"
        />
      </div>

      {/* Teams table */}
      {tab === 'teams' && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-zinc-500">
                <th className="px-4 py-3 text-left">Đội</th>
                <th className="px-4 py-3 text-left">Bảng</th>
                <th className="px-4 py-3 text-left">Quản lý</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {MOCK_TEAMS
                .filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
                .map(t => (
                  <tr key={t._id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <TeamAvatar name={t.name} tag={t.tag} size="sm" />
                        <div>
                          <p className="font-medium text-white">{t.name}</p>
                          <p className="text-xs text-zinc-500">[{t.tag}]</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {t.groupId ? `Bảng ${t.groupId.slice(-1).toUpperCase()}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">
                      {MOCK_ACCOUNTS.find(a => a.teamName === t.name)?.email ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => toast.info('Đặt lại mật khẩu')} className="text-zinc-600 hover:text-amber-400 cursor-pointer mr-2 transition-colors" aria-label="Đặt lại mật khẩu">
                        <Key className="size-4" />
                      </button>
                      <button onClick={() => toast.error('Xác nhận xoá?')} className="text-zinc-600 hover:text-red-400 cursor-pointer transition-colors" aria-label="Xoá đội">
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Accounts table */}
      {tab === 'accounts' && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-zinc-500">
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Vai trò</th>
                <th className="px-4 py-3 text-left">Đội</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {MOCK_ACCOUNTS
                .filter(a => a.email.includes(search))
                .map(a => (
                  <tr key={a.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-white">{a.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[a.role]}`}>
                        {ROLE_LABELS[a.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{a.teamName ?? '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => toast.info('Đặt lại mật khẩu')} className="text-zinc-600 hover:text-amber-400 cursor-pointer transition-colors" aria-label="Đặt lại mật khẩu">
                        <Key className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
