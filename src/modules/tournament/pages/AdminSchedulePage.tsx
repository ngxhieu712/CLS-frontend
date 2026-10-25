import { useMemo, useState } from 'react';
import { AlertTriangle, CalendarClock, Check, Film, History, Plus, RotateCcw, Search, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { PageHeader } from '@/shared/components/page-header';
import { MatchStatusBadge, RecordingStatusBadge } from '@/shared/components/status-badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { MOCK_MATCHES, MOCK_TEAMS } from '@/shared/lib/mock-data';
import type { Match, MatchStatus } from '@/shared/types/esports.types';

type ScheduleTab = 'schedule' | 'results' | 'recordings' | 'audit';
type AuditEntry = { id: string; match: string; actor: string; action: string; detail: string; oldValue?: string; newValue?: string; reason?: string; at: string };
type Assignment = { main: string; assistants: string[] };

const REFEREES = [
  { id: 'ref-1', name: 'Nguyễn Hoàng Long' },
  { id: 'ref-2', name: 'Trần Quốc Việt' },
  { id: 'ref-3', name: 'Lê Minh Tuấn' },
  { id: 'ref-4', name: 'Phạm Hữu Phúc' },
  { id: 'ref-5', name: 'Vũ Thành Đạt' },
  { id: 'ref-6', name: 'Đặng Bảo Khang' },
];

const INITIAL_ASSIGNMENTS: Record<string, Assignment> = {
  m1: { main: 'ref-1', assistants: ['ref-2', 'ref-3'] },
  m2: { main: 'ref-2', assistants: ['ref-4'] },
  m4: { main: 'ref-3', assistants: ['ref-1'] },
};

const TABS: { key: ScheduleTab; label: string; icon: typeof CalendarClock }[] = [
  { key: 'schedule', label: 'Lịch & phân công', icon: CalendarClock },
  { key: 'results', label: 'Duyệt kết quả', icon: ShieldCheck },
  { key: 'recordings', label: 'Bản ghi', icon: Film },
  { key: 'audit', label: 'Nhật ký', icon: History },
];
const STATUS_LABEL: Record<MatchStatus, string> = {
  scheduled: 'Sắp diễn ra',
  ongoing: 'Đang đấu',
  pending_confirm: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
};

const matchValue = (match: Match) =>
  `${STATUS_LABEL[match.status]}${match.scoreA === undefined ? '' : ` · ${match.scoreA} : ${match.scoreB}`}`;

const toLocalDateTime = (iso: string) => {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export const AdminSchedulePage = () => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<ScheduleTab>(searchParams.has('review') || searchParams.has('edit') ? 'results' : 'schedule');
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [expanded, setExpanded] = useState<string | null>(searchParams.get('review') ?? searchParams.get('edit'));
  const [reason, setReason] = useState('');
  const [scoreA, setScoreA] = useState(() => String(MOCK_MATCHES.find(({ _id }) => _id === (searchParams.get('review') ?? searchParams.get('edit')))?.scoreA ?? ''));
  const [scoreB, setScoreB] = useState(() => String(MOCK_MATCHES.find(({ _id }) => _id === (searchParams.get('review') ?? searchParams.get('edit')))?.scoreB ?? ''));
  const [query, setQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamA, setNewTeamA] = useState(MOCK_TEAMS[0]._id);
  const [newTeamB, setNewTeamB] = useState(MOCK_TEAMS[1]._id);
  const [newRound, setNewRound] = useState('Vòng bảng — Bảng A');
  const [newTime, setNewTime] = useState(toLocalDateTime(MOCK_MATCHES[1].scheduledAt));
  const [newMainRef, setNewMainRef] = useState(REFEREES[0].id);
  const [newAssistants, setNewAssistants] = useState<string[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([
    { id: 'log-1', match: 'Vòng 2 — Bảng D', actor: 'Trọng tài Nguyễn Hoàng Long', action: 'Gửi kết quả', detail: 'Kết quả trọng tài gửi', oldValue: 'Đang đấu · chưa có kết quả', newValue: 'Chờ xác nhận · 2 : 1', at: MOCK_MATCHES[3].scheduledAt },
    { id: 'log-2', match: 'Vòng 1 — Bảng A', actor: 'Admin', action: 'Xác nhận', detail: 'Cập nhật BXH và nhánh đấu', oldValue: 'Chờ xác nhận · 1 : 0', newValue: 'Đã xác nhận · 1 : 0', at: MOCK_MATCHES[4].scheduledAt },
  ]);

  const pendingCount = matches.filter(({ status }) => status === 'pending_confirm').length;
  const filteredMatches = useMemo(() => matches.filter((match) => {
    const searchText = `${match.round} ${match.teamA?.name ?? ''} ${match.teamB?.name ?? ''}`.toLowerCase();
    if (!searchText.includes(query.trim().toLowerCase())) return false;
    return tab !== 'results' || match.status === 'pending_confirm' || match.status === 'confirmed';
  }), [matches, query, tab]);

  const updateStatus = (id: string, status: MatchStatus, action: string, detail: string, why?: string) => {
    const match = matches.find((item) => item._id === id);
    if (!match) return;
    setMatches((current) => current.map((item) => item._id === id ? { ...item, status } : item));
    setAudit((current) => [{
      id: `log-${Date.now()}`,
      match: match.round,
      actor: 'Admin',
      action,
      detail,
      oldValue: matchValue(match),
      newValue: `${STATUS_LABEL[status]} · ${detail}`,
      reason: why,
      at: new Date().toISOString(),
    }, ...current]);
    setExpanded(null);
    setReason('');
    toast.success(`${action} thành công trong bản demo.`);
  };

  const confirm = (match: Match) => {
    if (match.scoreA === undefined || match.scoreB === undefined) {
      toast.error('Trận đấu chưa có tỉ số để xác nhận.');
      return;
    }
    updateStatus(match._id, 'confirmed', 'Xác nhận kết quả', `${match.teamA?.name} ${match.scoreA} : ${match.scoreB} ${match.teamB?.name}`);
  };

  const startMatch = (match: Match) => {
    if (!assignments[match._id]?.main) {
      toast.error('Phân công trọng tài chính trước khi bắt đầu trận.');
      setShowCreateForm(true);
      return;
    }
    updateStatus(match._id, 'ongoing', 'Bắt đầu trận', `${match.teamA?.name} vs ${match.teamB?.name}`);
  };

  const submitResult = (match: Match) => {
    const nextScoreA = Number(scoreA);
    const nextScoreB = Number(scoreB);
    if (!Number.isInteger(nextScoreA) || !Number.isInteger(nextScoreB) || nextScoreA < 0 || nextScoreB < 0 || nextScoreA === nextScoreB) {
      toast.error('Nhập tỉ số hợp lệ, hai đội không thể hòa.');
      return;
    }
    const detail = `${match.teamA?.name} ${nextScoreA} : ${nextScoreB} ${match.teamB?.name}`;
    setMatches((current) => current.map((item) => item._id === match._id ? { ...item, scoreA: nextScoreA, scoreB: nextScoreB, status: 'pending_confirm' } : item));
    setAudit((current) => [{ id: `log-${Date.now()}`, match: match.round, actor: 'Trọng tài', action: 'Gửi kết quả', detail, oldValue: matchValue(match), newValue: `Chờ xác nhận · ${nextScoreA} : ${nextScoreB}`, at: new Date().toISOString() }, ...current]);
    setExpanded(null);
    setReason('');
    toast.success('Đã gửi kết quả lên hàng đợi xác nhận trong bản demo.');
  };

  const reopen = (match: Match) => {
    if (!reason.trim()) {
      toast.error('Nhập lý do trước khi mở lại kết quả.');
      return;
    }
    updateStatus(match._id, 'ongoing', 'Mở lại kết quả', `${match.teamA?.name} ${match.scoreA ?? 0} : ${match.scoreB ?? 0} ${match.teamB?.name}`, reason.trim());
  };

  const editResult = (match: Match) => {
    if (!reason.trim()) {
      toast.error('Nhập lý do chỉnh sửa để lưu vào nhật ký.');
      return;
    }
    const nextScoreA = Number(scoreA);
    const nextScoreB = Number(scoreB);
    if (!Number.isInteger(nextScoreA) || !Number.isInteger(nextScoreB) || nextScoreA < 0 || nextScoreB < 0 || nextScoreA === nextScoreB) {
      toast.error('Tỉ số phải là số nguyên không âm và hai đội không thể hòa.');
      return;
    }
    const detail = `${match.teamA?.name} ${nextScoreA} : ${nextScoreB} ${match.teamB?.name}`;
    setMatches((current) => current.map((item) => item._id === match._id ? { ...item, scoreA: nextScoreA, scoreB: nextScoreB } : item));
    setAudit((current) => [{ id: `log-${Date.now()}`, match: match.round, actor: 'Admin', action: 'Sửa kết quả', detail, oldValue: matchValue(match), newValue: `${STATUS_LABEL[match.status]} · ${nextScoreA} : ${nextScoreB}`, reason: reason.trim(), at: new Date().toISOString() }, ...current]);
    setExpanded(null);
    setReason('');
    setScoreA('');
    setScoreB('');
    toast.success('Đã cập nhật kết quả và ghi nhật ký trong bản demo.');
  };

  const toggleAssistant = (id: string) => {
    setNewAssistants((current) => current.includes(id) ? current.filter((refereeId) => refereeId !== id) : current.length < 5 ? [...current, id] : current);
    if (!newAssistants.includes(id) && newAssistants.length >= 5) toast.error('Mỗi trận tối đa 5 trợ lý trọng tài.');
  };

  const createMatch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTeamA === newTeamB) {
      toast.error('Chọn hai đội khác nhau.');
      return;
    }
    if (!newTime || new Date(newTime).getTime() <= Date.now()) {
      toast.error('Chọn thời gian trong tương lai.');
      return;
    }
    const proposedTime = new Date(newTime).getTime();
    const assignedIds = new Set([newMainRef, ...newAssistants]);
    const conflict = matches.find((match) => {
      const sameTime = Math.abs(new Date(match.scheduledAt).getTime() - proposedTime) < 2 * 60 * 60_000;
      const sameTeam = [match.teamA?._id, match.teamB?._id].some((id) => id === newTeamA || id === newTeamB);
      const currentRefs = assignments[match._id];
      const sameReferee = currentRefs && [currentRefs.main, ...currentRefs.assistants].some((id) => assignedIds.has(id));
      return sameTime && (sameTeam || sameReferee);
    });
    if (conflict) {
      toast.error(`Lịch bị trùng với ${conflict.round}. Đổi giờ, đội hoặc trọng tài.`);
      return;
    }

    const teamA = MOCK_TEAMS.find(({ _id }) => _id === newTeamA);
    const teamB = MOCK_TEAMS.find(({ _id }) => _id === newTeamB);
    if (!teamA || !teamB) return toast.error('Không tìm thấy đội đã chọn.');

    const matchId = `new-${Date.now()}`;
    const scheduledAt = new Date(newTime).toISOString();
    setMatches((current) => [...current, {
      _id: matchId,
      round: newRound,
      format: 'BO3',
      status: 'scheduled',
      scheduledAt,
      teamA,
      teamB,
      games: [],
      phase: 'group',
    }]);
    setAssignments((current) => ({ ...current, [matchId]: { main: newMainRef, assistants: newAssistants } }));
    setAudit((current) => [{ id: `log-${Date.now()}`, match: newRound, actor: 'Admin', action: 'Tạo lịch', detail: `${teamA.name} vs ${teamB.name} · ${new Date(scheduledAt).toLocaleString('vi-VN')}`, oldValue: 'Chưa có lịch', newValue: 'Sắp diễn ra', at: new Date().toISOString() }, ...current]);
    setShowCreateForm(false);
    toast.success('Đã tạo lịch đấu và phân công trọng tài trong bản demo.');
  };

  const recordingMatches = matches.filter((match) => match.highlightUrl || match.youtubeUrl || match.recordingStatus);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lịch đấu & trọng tài"
        description="Sắp lịch, phân công trọng tài và rà soát kết quả trước khi cập nhật bảng xếp hạng."
        actions={tab === 'schedule' ? <Button onClick={() => setShowCreateForm((open) => !open)}><Plus className="size-4" /> Tạo trận</Button> : undefined}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Summary label="Tổng số trận" value={matches.length} />
        <Summary label="Đang diễn ra" value={matches.filter(({ status }) => status === 'ongoing').length} />
        <Summary label="Chờ xác nhận" value={pendingCount} alert={pendingCount > 0} />
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1" role="tablist" aria-label="Lịch đấu và kết quả">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${tab === key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <Icon className="size-4" />{label}{key === 'results' && pendingCount > 0 && <span className="rounded-full bg-amber-500/15 px-1.5 text-xs tabular-nums text-amber-700 dark:text-amber-300">{pendingCount}</span>}
          </button>
        ))}
      </div>

      {tab === 'schedule' && showCreateForm && (
        <form onSubmit={createMatch} className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div>
            <h2 className="text-sm font-semibold">Tạo trận đấu</h2>
            <p className="mt-1 text-xs text-muted-foreground">Hệ thống kiểm tra xung đột đội và trọng tài trong khung giờ 2 tiếng.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SelectField label="Đội A" value={newTeamA} onChange={setNewTeamA} options={MOCK_TEAMS.map((team) => ({ value: team._id, label: team.name }))} />
            <SelectField label="Đội B" value={newTeamB} onChange={setNewTeamB} options={MOCK_TEAMS.map((team) => ({ value: team._id, label: team.name }))} />
            <label className="space-y-1.5 text-sm font-medium"><span>Vòng / bảng</span><Input value={newRound} onChange={(event) => setNewRound(event.target.value)} required /></label>
            <label className="space-y-1.5 text-sm font-medium"><span>Thời gian</span><Input type="datetime-local" value={newTime} onChange={(event) => setNewTime(event.target.value)} required /></label>
            <SelectField label="Trọng tài chính" value={newMainRef} onChange={setNewMainRef} options={REFEREES.map((referee) => ({ value: referee.id, label: referee.name }))} />
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Trợ lý trọng tài <span className="text-xs font-normal text-muted-foreground">(tối đa 5)</span></legend>
            <div className="flex flex-wrap gap-2">
              {REFEREES.filter(({ id }) => id !== newMainRef).map((referee) => (
                <label key={referee.id} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3 text-xs">
                  <input type="checkbox" checked={newAssistants.includes(referee.id)} onChange={() => toggleAssistant(referee.id)} />
                  {referee.name}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>Hủy</Button><Button type="submit"><Plus className="size-4" /> Tạo lịch</Button></div>
        </form>
      )}

      {(tab === 'schedule' || tab === 'results') && (
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-sm font-semibold">{tab === 'results' ? 'Duyệt kết quả trận đấu' : 'Lịch thi đấu'}</h2><p className="mt-1 text-xs text-muted-foreground">{filteredMatches.length} trận · Dữ liệu mẫu frontend</p></div>
            <div className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Tìm trận đấu" className="pl-9" placeholder="Tìm đội hoặc vòng đấu..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr><th className="px-4 py-3 text-left font-medium">Trận đấu</th><th className="px-4 py-3 text-left font-medium">Thời gian</th><th className="px-4 py-3 text-left font-medium">Trọng tài</th><th className="px-4 py-3 text-left font-medium">Trạng thái</th><th className="px-4 py-3 text-right font-medium">Thao tác</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMatches.map((match) => {
                  const assignment = assignments[match._id];
                  const mainName = REFEREES.find(({ id }) => id === assignment?.main)?.name ?? match.refereeName ?? 'Chưa phân công';
                  return (
                    <tr key={match._id} className="align-top hover:bg-muted/20">
                      <td className="px-4 py-3.5"><p className="font-medium">{match.teamA?.name ?? 'Chờ xác định'} <span className="mx-1.5 text-primary">{match.scoreA !== undefined ? `${match.scoreA} : ${match.scoreB}` : 'vs'}</span> {match.teamB?.name ?? 'Chờ xác định'}</p><p className="mt-1 text-xs text-muted-foreground">{match.round} · {match.format}</p></td>
                      <td className="px-4 py-3.5 text-xs tabular-nums text-muted-foreground">{new Date(match.scheduledAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-4 py-3.5"><p className="text-xs">{mainName}</p><p className="mt-1 text-[11px] text-muted-foreground">{assignment?.assistants.length ?? 0} trợ lý</p></td>
                      <td className="px-4 py-3.5"><MatchStatusBadge status={match.status} /></td>
                      <td className="px-4 py-3.5 text-right"><Button type="button" size="sm" variant={match.status === 'pending_confirm' ? 'default' : 'outline'} onClick={() => {
                        if (match.status === 'scheduled') startMatch(match);
                        else {
                          setExpanded(expanded === match._id ? null : match._id);
                          setScoreA(String(match.scoreA ?? ''));
                          setScoreB(String(match.scoreB ?? ''));
                        }
                      }} disabled={match.status === 'cancelled'}>{match.status === 'scheduled' ? 'Bắt đầu' : match.status === 'ongoing' ? 'Gửi kết quả' : match.status === 'pending_confirm' ? 'Rà soát' : 'Chi tiết'}</Button></td>
                    </tr>
                  );
                })}
                {filteredMatches.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">Không có trận phù hợp.</td></tr>}
              </tbody>
            </table>
          </div>
          {expanded && matches.find(({ _id }) => _id === expanded)?.status === 'ongoing' && (
            <SubmitResultPanel match={matches.find(({ _id }) => _id === expanded)} scoreA={scoreA} scoreB={scoreB} onScoreAChange={setScoreA} onScoreBChange={setScoreB} onSubmit={submitResult} />
          )}
          {expanded && (tab === 'results' || matches.find(({ _id }) => _id === expanded)?.status === 'pending_confirm' || matches.find(({ _id }) => _id === expanded)?.status === 'confirmed') && (
            <ResultReview match={matches.find(({ _id }) => _id === expanded)} reason={reason} scoreA={scoreA} scoreB={scoreB} onReasonChange={setReason} onScoreAChange={setScoreA} onScoreBChange={setScoreB} onConfirm={confirm} onReopen={reopen} onEdit={editResult} />
          )}
        </section>
      )}

      {tab === 'recordings' && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3"><h2 className="text-sm font-semibold">Bản ghi trận đấu</h2><p className="mt-1 text-xs text-muted-foreground">Video highlight và link trận đầy đủ.</p></div>
          <div className="divide-y divide-border">
            {recordingMatches.map((match) => <RecordingRow key={match._id} match={match} />)}
            {recordingMatches.length === 0 && <p className="px-4 py-10 text-center text-sm text-muted-foreground">Chưa có bản ghi.</p>}
          </div>
        </div>
      )}

      {tab === 'audit' && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3"><h2 className="text-sm font-semibold">Nhật ký thay đổi</h2><p className="mt-1 text-xs text-muted-foreground">Lịch sử xác nhận, chỉnh sửa và phân công trong phiên demo.</p></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead className="bg-muted/40 text-xs text-muted-foreground"><tr><th className="px-4 py-3 text-left font-medium">Thời gian</th><th className="px-4 py-3 text-left font-medium">Trận</th><th className="px-4 py-3 text-left font-medium">Người thực hiện</th><th className="px-4 py-3 text-left font-medium">Thao tác</th><th className="px-4 py-3 text-left font-medium">Giá trị cũ</th><th className="px-4 py-3 text-left font-medium">Giá trị mới</th><th className="px-4 py-3 text-left font-medium">Lý do</th></tr></thead><tbody className="divide-y divide-border">{audit.map((entry) => <tr key={entry.id}><td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{new Date(entry.at).toLocaleString('vi-VN')}</td><td className="px-4 py-3">{entry.match}</td><td className="px-4 py-3">{entry.actor}</td><td className="px-4 py-3"><span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-1 text-xs">{entry.action}</span></td><td className="max-w-48 px-4 py-3 text-xs text-muted-foreground">{entry.oldValue ?? '—'}</td><td className="max-w-56 px-4 py-3 text-xs text-muted-foreground">{entry.newValue ?? entry.detail}</td><td className="max-w-56 px-4 py-3 text-xs text-muted-foreground">{entry.reason ?? '—'}</td></tr>)}</tbody></table></div>
        </div>
      )}
    </div>
  );
};

function Summary({ label, value, alert }: { label: string; value: number; alert?: boolean }) {
  return <div className={`flex items-center justify-between rounded-lg border px-4 py-3 ${alert ? 'border-amber-500/30 bg-amber-500/5' : 'border-border bg-card'}`}><span className="text-sm text-muted-foreground">{label}</span><span className={`text-xl font-bold tabular-nums ${alert ? 'text-amber-700 dark:text-amber-300' : ''}`}>{value}</span></div>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return <label className="space-y-1.5 text-sm font-medium"><span>{label}</span><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={value} onChange={(event) => onChange(event.target.value)}>{options.map(({ value: optionValue, label: optionLabel }) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}

function ResultReview({ match, reason, scoreA, scoreB, onReasonChange, onScoreAChange, onScoreBChange, onConfirm, onReopen, onEdit }: {
  match?: Match; reason: string; scoreA: string; scoreB: string; onReasonChange: (value: string) => void; onScoreAChange: (value: string) => void; onScoreBChange: (value: string) => void; onConfirm: (match: Match) => void; onReopen: (match: Match) => void; onEdit: (match: Match) => void;
}) {
  if (!match) return null;
  const submitted = match.status === 'pending_confirm';
  const confirmed = match.status === 'confirmed';
  if (!submitted && !confirmed) return null;

  return (
    <div className="space-y-4 border-t border-border bg-muted/20 p-4">
      <div className="flex items-start gap-2 text-sm"><AlertTriangle className={`mt-0.5 size-4 ${submitted ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`} /><div><p className="font-semibold">{submitted ? 'Kết quả do trọng tài gửi' : 'Kết quả đã xác nhận'}</p><p className="mt-1 text-xs text-muted-foreground">{match.round} · {match.teamA?.name} {match.scoreA} : {match.scoreB} {match.teamB?.name}</p></div></div>
      {match.games.length > 0 && <div className="flex flex-wrap gap-2">{match.games.map((game) => <span key={game._id} className="rounded-md border border-border bg-card px-3 py-1.5 text-xs">Ván {game.gameNumber}: {game.winnerId === match.teamA?._id ? match.teamA?.name : match.teamB?.name} thắng</span>)}</div>}
      {submitted ? (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Kiểm tra tỉ số đã gửi. Nếu cần sửa hoặc yêu cầu trọng tài nhập lại, hãy ghi lý do để lưu nhật ký.</p>
          <div className="grid gap-3 sm:grid-cols-[100px_100px_minmax(0,1fr)]">
            <label className="space-y-1 text-xs text-muted-foreground"><span>Tỉ số đội A</span><Input type="number" min={0} value={scoreA} onChange={(event) => onScoreAChange(event.target.value)} /></label>
            <label className="space-y-1 text-xs text-muted-foreground"><span>Tỉ số đội B</span><Input type="number" min={0} value={scoreB} onChange={(event) => onScoreBChange(event.target.value)} /></label>
            <label className="space-y-1 text-xs text-muted-foreground"><span>Lý do sửa / mở lại</span><Input value={reason} maxLength={240} placeholder="Bắt buộc khi sửa hoặc mở lại..." onChange={(event) => onReasonChange(event.target.value)} /></label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => onConfirm(match)}><Check className="size-4" /> Xác nhận kết quả</Button>
            <Button type="button" variant="outline" onClick={() => onEdit(match)}>Lưu kết quả sửa</Button>
            <Button type="button" variant="outline" onClick={() => onReopen(match)}><RotateCcw className="size-4" /> Mở lại cho trọng tài</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground">Mọi thay đổi phải có lý do và sẽ được ghi vào nhật ký.</p>
          <div className="grid gap-3 sm:grid-cols-[100px_100px_minmax(0,1fr)]">
            <label className="space-y-1 text-xs text-muted-foreground"><span>Tỉ số đội A</span><Input type="number" min={0} value={scoreA} onChange={(event) => onScoreAChange(event.target.value)} /></label>
            <label className="space-y-1 text-xs text-muted-foreground"><span>Tỉ số đội B</span><Input type="number" min={0} value={scoreB} onChange={(event) => onScoreBChange(event.target.value)} /></label>
            <label className="space-y-1 text-xs text-muted-foreground"><span>Lý do bắt buộc</span><Input value={reason} maxLength={240} placeholder="Nhập lý do chỉnh sửa hoặc mở lại..." onChange={(event) => onReasonChange(event.target.value)} /></label>
          </div>
          <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => onEdit(match)}>Lưu kết quả sửa</Button><Button type="button" variant="outline" onClick={() => onReopen(match)}><RotateCcw className="size-4" /> Mở lại cho trọng tài</Button></div>
        </div>
      )}
    </div>
  );
}

function SubmitResultPanel({ match, scoreA, scoreB, onScoreAChange, onScoreBChange, onSubmit }: {
  match?: Match; scoreA: string; scoreB: string; onScoreAChange: (value: string) => void; onScoreBChange: (value: string) => void; onSubmit: (match: Match) => void;
}) {
  if (!match) return null;
  return (
    <div className="flex flex-col gap-3 border-t border-border bg-muted/20 p-4 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold">Nhập kết quả trận</p><p className="mt-1 text-xs text-muted-foreground">Tỉ số ván thắng theo thể thức {match.format}.</p></div>
      <label className="space-y-1 text-xs text-muted-foreground"><span>{match.teamA?.name ?? 'Đội A'}</span><Input aria-label={`Tỉ số ${match.teamA?.name ?? 'đội A'}`} type="number" min={0} value={scoreA} onChange={(event) => onScoreAChange(event.target.value)} /></label>
      <label className="space-y-1 text-xs text-muted-foreground"><span>{match.teamB?.name ?? 'Đội B'}</span><Input aria-label={`Tỉ số ${match.teamB?.name ?? 'đội B'}`} type="number" min={0} value={scoreB} onChange={(event) => onScoreBChange(event.target.value)} /></label>
      <Button type="button" onClick={() => onSubmit(match)}><Check className="size-4" /> Gửi xác nhận</Button>
    </div>
  );
}

function RecordingRow({ match }: { match: Match }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"><div><p className="text-sm font-medium">{match.teamA?.name ?? 'TBD'} vs {match.teamB?.name ?? 'TBD'}</p><p className="mt-1 text-xs text-muted-foreground">{match.round}</p></div><div className="flex items-center gap-2"><RecordingStatusBadge status={match.recordingStatus ?? 'none'} />{match.highlightUrl && <a className="inline-flex h-9 items-center gap-1.5 rounded-md border border-input px-3 text-xs hover:bg-muted" href={match.highlightUrl} target="_blank" rel="noreferrer"><Film className="size-3.5" /> Highlight</a>}{match.youtubeUrl && <a className="inline-flex h-9 items-center gap-1.5 rounded-md border border-input px-3 text-xs hover:bg-muted" href={match.youtubeUrl} target="_blank" rel="noreferrer">YouTube</a>}</div></div>;
}
