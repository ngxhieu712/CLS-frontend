import { useMemo, useState } from 'react';
import { LockKeyhole, Plus, Search, Shield, UnlockKeyhole, UserRoundCog, Users } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/shared/components/page-header';
import { TeamAvatar } from '@/shared/components/team-avatar';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { MOCK_TEAMS } from '@/shared/lib/mock-data';
import type { UserRole } from '@/modules/auth/types/auth.types';

type StaffAccount = { id: string; email: string; role: Extract<UserRole, 'referee' | 'editor'>; status: 'active' | 'locked' };
type ManagementTab = 'teams' | 'staff';

const INITIAL_STAFF: StaffAccount[] = [
  { id: 'staff-1', email: 'referee1@champion.vn', role: 'referee', status: 'active' },
  { id: 'staff-2', email: 'referee2@champion.vn', role: 'referee', status: 'active' },
  { id: 'staff-3', email: 'media@champion.vn', role: 'editor', status: 'locked' },
];

const STAFF_ROLE_LABEL: Record<StaffAccount['role'], string> = { referee: 'Trọng tài', editor: 'Biên tập viên' };
const DEMO_ROSTER = ['Nguyễn Minh Anh', 'Trần Quốc Bảo', 'Lê Hoàng Nam', 'Phạm Đức Huy', 'Vũ Gia Khang'];

export const TeamManagementPage = () => {
  const [tab, setTab] = useState<ManagementTab>('teams');
  const [search, setSearch] = useState('');
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [lockedTeams, setLockedTeams] = useState<string[]>([]);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<StaffAccount['role']>('referee');

  const filteredTeams = useMemo(
    () => MOCK_TEAMS.filter((team) => `${team.name} ${team.tag} ${team.contactEmail ?? ''}`.toLowerCase().includes(search.trim().toLowerCase())),
    [search],
  );
  const filteredStaff = useMemo(
    () => staff.filter((account) => account.email.toLowerCase().includes(search.trim().toLowerCase())),
    [search, staff],
  );

  const createAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = newEmail.trim().toLowerCase();
    if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
      toast.error('Nhập địa chỉ Gmail hợp lệ để tạo tài khoản nhân sự.');
      return;
    }
    if (staff.some((account) => account.email === email)) {
      toast.error('Gmail này đã có trong danh sách nhân sự.');
      return;
    }
    setStaff((current) => [...current, { id: `staff-${Date.now()}`, email, role: newRole, status: 'active' }]);
    setNewEmail('');
    setShowStaffForm(false);
    toast.success(`Đã thêm ${STAFF_ROLE_LABEL[newRole].toLowerCase()} vào bản demo.`);
  };

  const toggleStaffStatus = (account: StaffAccount) => {
    const next = account.status === 'active' ? 'locked' : 'active';
    setStaff((current) => current.map((row) => row.id === account.id ? { ...row, status: next } : row));
    toast.success(next === 'locked' ? 'Đã khóa tài khoản trong bản demo.' : 'Đã mở khóa tài khoản trong bản demo.');
  };

  const toggleTeamLock = (teamId: string) => {
    const isLocked = lockedTeams.includes(teamId);
    setLockedTeams((current) => isLocked ? current.filter((id) => id !== teamId) : [...current, teamId]);
    toast.success(isLocked ? 'Đã mở khóa đội trong bản demo.' : 'Đã khóa đội trong bản demo.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Đội & tài khoản"
        description="Theo dõi các đội đã duyệt và quản lý tài khoản trọng tài, biên tập viên."
        actions={tab === 'staff' ? (
          <Button onClick={() => setShowStaffForm((visible) => !visible)}><Plus className="size-4" /> Thêm nhân sự</Button>
        ) : undefined}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-fit gap-1 rounded-lg border border-border bg-card p-1" role="tablist" aria-label="Loại dữ liệu">
          <TabButton active={tab === 'teams'} onClick={() => { setTab('teams'); setSearch(''); }} label={`Đội (${MOCK_TEAMS.length})`} icon={Users} />
          <TabButton active={tab === 'staff'} onClick={() => { setTab('staff'); setSearch(''); }} label={`Nhân sự (${staff.length})`} icon={UserRoundCog} />
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label={tab === 'teams' ? 'Tìm đội' : 'Tìm nhân sự'} className="pl-9" placeholder={tab === 'teams' ? 'Tìm tên đội, tag...' : 'Tìm theo Gmail...'} value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
      </div>

      {showStaffForm && tab === 'staff' && (
        <form onSubmit={createAccount} className="grid gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:grid-cols-[minmax(0,1fr)_200px_auto] sm:items-end">
          <label className="space-y-1.5 text-sm font-medium">
            <span>Gmail nhân sự</span>
            <Input type="email" required placeholder="ten@gmail.com" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} />
          </label>
          <label className="space-y-1.5 text-sm font-medium">
            <span>Vai trò hệ thống</span>
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={newRole} onChange={(event) => setNewRole(event.target.value as StaffAccount['role'])}>
              <option value="referee">Trọng tài</option>
              <option value="editor">Biên tập viên</option>
            </select>
          </label>
          <Button type="submit"><Plus className="size-4" /> Tạo tài khoản</Button>
        </form>
      )}

      {tab === 'teams' ? (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[660px] text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Đội</th>
                  <th className="px-4 py-3 text-left font-medium">Bảng</th>
                  <th className="px-4 py-3 text-left font-medium">Quản lý đội</th>
                  <th className="px-4 py-3 text-left font-medium">Thành viên</th>
                  <th className="px-4 py-3 text-right font-medium">Trạng thái / thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTeams.map((team) => {
                  const isLocked = lockedTeams.includes(team._id);
                  const managerEmail = team.contactEmail ?? `${team.tag.toLowerCase()}@champion.vn`;
                  return (
                    <TeamRows
                      key={team._id}
                      team={team}
                      managerEmail={managerEmail}
                      isLocked={isLocked}
                      expanded={expandedTeam === team._id}
                      onToggleDetails={() => setExpandedTeam((current) => current === team._id ? null : team._id)}
                      onToggleLock={() => toggleTeamLock(team._id)}
                    />
                  );
                })}
                {filteredTeams.length === 0 && <EmptyRow colSpan={5} />}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">{filteredTeams.length} / {MOCK_TEAMS.length} đội · Dữ liệu mẫu frontend</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Tài khoản Gmail</th>
                  <th className="px-4 py-3 text-left font-medium">Vai trò</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStaff.map((account) => (
                  <tr key={account.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3.5 font-medium">{account.email}</td>
                    <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-700 dark:text-blue-300"><Shield className="size-3.5" />{STAFF_ROLE_LABEL[account.role]}</span></td>
                    <td className="px-4 py-3.5"><StatusBadge status={account.status} /></td>
                    <td className="px-4 py-3.5 text-right">
                      <Button type="button" size="sm" variant="outline" onClick={() => toggleStaffStatus(account)}>
                        {account.status === 'active' ? <LockKeyhole className="size-4" /> : <UnlockKeyhole className="size-4" />}
                        {account.status === 'active' ? 'Khóa' : 'Mở khóa'}
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredStaff.length === 0 && <EmptyRow colSpan={4} />}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">{filteredStaff.length} / {staff.length} tài khoản · Bản demo chưa gửi email mời</p>
        </div>
      )}
    </div>
  );
};

function TabButton({ active, onClick, label, icon: Icon }: { active: boolean; onClick: () => void; label: string; icon: typeof Users }) {
  return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}><Icon className="size-4" />{label}</button>;
}

function TeamRows({ team, managerEmail, isLocked, expanded, onToggleDetails, onToggleLock }: {
  team: (typeof MOCK_TEAMS)[number]; managerEmail: string; isLocked: boolean; expanded: boolean; onToggleDetails: () => void; onToggleLock: () => void;
}) {
  return (
    <>
      <tr className="hover:bg-muted/30">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3"><TeamAvatar name={team.name} tag={team.tag} logoUrl={team.logoUrl} size="sm" /><div><p className="font-semibold">{team.name}</p><p className="text-xs text-muted-foreground">[{team.tag}]</p></div></div>
        </td>
        <td className="px-4 py-3 text-muted-foreground">{team.groupId ? `Bảng ${team.groupId.slice(-1).toUpperCase()}` : 'Chưa chia bảng'}</td>
        <td className="px-4 py-3 text-muted-foreground">{managerEmail}</td>
        <td className="px-4 py-3"><button type="button" className="text-xs font-medium text-primary hover:underline" aria-expanded={expanded} onClick={onToggleDetails}>Xem đội hình</button></td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2"><StatusBadge status={isLocked ? 'locked' : 'active'} /><Button type="button" size="sm" variant="ghost" aria-label={isLocked ? `Mở khóa ${team.name}` : `Khóa ${team.name}`} onClick={onToggleLock}>{isLocked ? <UnlockKeyhole className="size-4" /> : <LockKeyhole className="size-4" />}</Button></div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-muted/20">
          <td colSpan={5} className="px-5 py-4">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">ĐỘI HÌNH MẪU · {DEMO_ROSTER.length} THÀNH VIÊN</p>
            <div className="flex flex-wrap gap-2">{DEMO_ROSTER.map((name, index) => <span key={name} className="rounded-md border border-border bg-card px-3 py-2 text-xs">{name}<span className="ml-2 text-muted-foreground">{index === 0 ? 'Đội trưởng' : 'Tuyển thủ'}</span></span>)}</div>
          </td>
        </tr>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: 'active' | 'locked' }) {
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${status === 'active' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'}`}>{status === 'active' ? 'Hoạt động' : 'Đã khóa'}</span>;
}

function EmptyRow({ colSpan }: { colSpan: number }) {
  return <tr><td colSpan={colSpan} className="px-4 py-12 text-center text-sm text-muted-foreground">Không có dữ liệu phù hợp.</td></tr>;
}
