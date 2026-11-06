import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, CalendarDays, ClipboardList, Clock3, Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePendingTeams } from '@/modules/admin/hooks/use-admin';
import { TeamAvatar } from '@/shared/components/team-avatar';
import { MOCK_GROUPS, MOCK_MATCHES, MOCK_TEAMS, MOCK_TOURNAMENT } from '@/shared/lib/mock-data';
import { cn } from '@/shared/lib/utils';
import type { Match } from '@/shared/types/esports.types';

// Trận đấu, bảng xếp hạng vẫn là dữ liệu mẫu cho tới khi có API lịch đấu; hồ sơ đội lấy từ API thật.
const groupMatches = MOCK_MATCHES.filter(({ phase }) => phase === 'group');
const playedGroupMatches = groupMatches.filter(({ status }) => status === 'confirmed' || status === 'pending_confirm').length;
const groupProgress = groupMatches.length ? Math.round((playedGroupMatches / groupMatches.length) * 100) : 0;
const confirmedMatches = MOCK_MATCHES.filter(({ status }) => status === 'confirmed').length;
const pendingConfirm = MOCK_MATCHES.filter(({ status }) => status === 'pending_confirm');
const liveMatch = MOCK_MATCHES.find(({ status }) => status === 'ongoing');
const totalSlots = MOCK_TOURNAMENT.groupCount * MOCK_TOURNAMENT.teamsPerGroup;

const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();
const todayMatches = MOCK_MATCHES.filter(({ scheduledAt, status }) => isToday(scheduledAt) && status !== 'cancelled')
  .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

const STEPS = ['Mở đăng ký', 'Duyệt hồ sơ', 'Chia bảng', 'Vòng bảng', 'Playoff', 'Chung kết'];
// Index of the step in progress for each tournament status.
const CURRENT_STEP: Record<typeof MOCK_TOURNAMENT.status, number> = { setup: 1, group: 3, playoff: 4, finished: 6 };

const time = (iso: string) => new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

const ago = (iso: string) => {
  const hours = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 3600_000));
  if (hours < 1) return 'vừa xong';
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.round(hours / 24)} ngày trước`;
};

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) return 'Chào buổi sáng';
  if (hour < 14) return 'Chào buổi trưa';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
};

const panel = 'overflow-hidden rounded-2xl border bg-card shadow-sm';
const panelHead = 'flex items-center justify-between gap-3 border-b px-5 py-4';
const ghostButton = 'inline-flex h-9 shrink-0 items-center rounded-lg border px-3.5 text-[13px] font-semibold transition-colors hover:border-primary/40 hover:bg-muted';
const primaryButton = 'inline-flex h-9 shrink-0 items-center rounded-lg bg-primary px-3.5 text-[13px] font-bold text-primary-foreground transition-opacity hover:opacity-90';

export const AdminDashboardPage = () => {
  const { data: pendingTeams = [] } = usePendingTeams();
  const [groupId, setGroupId] = useState(MOCK_GROUPS[0]?._id);
  const group = MOCK_GROUPS.find(({ _id }) => _id === groupId) ?? MOCK_GROUPS[0];
  const taskCount = pendingConfirm.length + pendingTeams.length;
  const oldestPending = pendingTeams.reduce<string | undefined>(
    (oldest, team) => (!oldest || team.registeredAt < oldest ? team.registeredAt : oldest), undefined);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/12 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="size-[7px] rounded-full bg-emerald-500" />
            {STEPS[CURRENT_STEP[MOCK_TOURNAMENT.status]] ?? 'Đã kết thúc'} đang diễn ra
          </span>
          <h1 className="mt-3 text-[28px] font-extrabold tracking-tight">{greeting()}, Admin</h1>
          <p className="mt-1 text-muted-foreground">
            {MOCK_TOURNAMENT.name} — {taskCount > 0 ? `có ${taskCount} việc cần bạn xử lý.` : 'không có việc nào đang chờ.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link to="/admin/schedule" className="inline-flex h-11 items-center gap-2 rounded-[10px] border px-4 font-semibold transition-colors hover:bg-muted">
            <CalendarDays className="size-4" /> Lịch đấu
          </Link>
          <Link to="/admin/schedule" className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-[18px] font-bold text-primary-foreground transition-opacity hover:opacity-90">
            <Plus className="size-4" /> Tạo trận đấu
          </Link>
        </div>
      </header>

      <section aria-labelledby="season-progress" className="rounded-2xl border bg-card px-6 py-5 shadow-sm">
        <h2 id="season-progress" className="mb-4 text-[15px] font-bold">Tiến độ mùa giải</h2>
        <ol className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {STEPS.map((label, index) => {
            const current = CURRENT_STEP[MOCK_TOURNAMENT.status];
            const done = index < current;
            const active = index === current;
            return (
              <li key={label} aria-current={active ? 'step' : undefined} className="space-y-2">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: done ? '100%' : active ? `${groupProgress}%` : '0%' }} />
                </div>
                <p className={cn('text-xs', active ? 'font-semibold text-primary' : 'text-muted-foreground')}>
                  {active ? `Đang diễn ra · ${groupProgress}%` : `Bước ${index + 1}`}
                </p>
                <p className={cn('font-semibold', !done && !active && 'text-muted-foreground')}>{label}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-label="Chỉ số giải đấu" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Đội tham gia" icon={Users} tone="emerald" value={MOCK_TEAMS.length} unit={`/ ${totalSlots} suất`} progress={MOCK_TEAMS.length / totalSlots} />
        <Kpi label="Trận đã xác nhận" icon={CalendarDays} tone="blue" value={confirmedMatches} unit={`/ ${MOCK_MATCHES.length} trận`} progress={confirmedMatches / MOCK_MATCHES.length} />
        <Kpi label="Hồ sơ chờ duyệt" icon={ClipboardList} tone="amber" value={pendingTeams.length}
          unit={oldestPending ? `cũ nhất ${ago(oldestPending)}` : 'đã xử lý hết'} link={{ to: '/admin/approval', label: 'Duyệt ngay' }} />
        <Kpi label="Kết quả chờ xác nhận" icon={Clock3} tone="rose" value={pendingConfirm.length} unit="trọng tài đã gửi"
          link={{ to: '/admin/schedule', label: 'Xác nhận' }} />
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <section aria-labelledby="tasks-title" className={panel}>
          <div className={panelHead}>
            <div>
              <h2 id="tasks-title" className="text-[15px] font-bold">Việc cần xử lý</h2>
              <p className="text-xs text-muted-foreground">Kết quả trận và hồ sơ đội đang chờ</p>
            </div>
          </div>
          <div className="divide-y">
            {pendingConfirm.map((match) => (
              <TaskRow key={match._id} icon={Clock3} tone="rose"
                title={`${match.teamA?.name ?? 'TBD'} ${match.scoreA ?? 0} : ${match.scoreB ?? 0} ${match.teamB?.name ?? 'TBD'}`}
                detail={`Kết quả chờ xác nhận · ${match.round}`}
                action={<Link to={`/admin/schedule?review=${match._id}`} className={primaryButton}>Xác nhận</Link>} />
            ))}
            {pendingTeams.slice(0, 4).map((team) => (
              <TaskRow key={team._id}
                avatar={<TeamAvatar name={team.name} tag={team.tag} logoUrl={team.logo} size="md" />}
                title={<>{team.name} <span className="font-normal text-muted-foreground">[{team.tag}]</span></>}
                detail={`Hồ sơ đội mới · ${team.manager.fullName} · ${ago(team.registeredAt)}`}
                action={<Link to={`/admin/approval?review=${team._id}`} className={ghostButton}>Xem hồ sơ</Link>} />
            ))}
            {taskCount === 0 && <p className="px-5 py-10 text-center text-sm text-muted-foreground">Không còn việc nào cần xử lý.</p>}
          </div>
        </section>

        <section aria-labelledby="live-title" className={cn(panel, 'flex flex-col')}>
          <div className={panelHead}>
            <h2 id="live-title" className="text-[15px] font-bold">Trận đang diễn ra</h2>
            {liveMatch && <LiveBadge />}
          </div>
          {liveMatch ? (
            <>
              <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-5 py-7 text-center">
                <TeamBlock match={liveMatch} side="A" />
                <div>
                  <p className="text-[40px] font-extrabold tabular-nums tracking-wide">
                    {liveMatch.scoreA ?? 0} <span className="text-muted-foreground/50">:</span> {liveMatch.scoreB ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Ván {liveMatch.games.length + 1} · {liveMatch.format}</p>
                </div>
                <TeamBlock match={liveMatch} side="B" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/40 px-5 py-3.5">
                <span className="text-xs text-muted-foreground">
                  {liveMatch.round}{liveMatch.refereeName && ` · Trọng tài: ${liveMatch.refereeName}`}
                </span>
                <Link to={`/matches/${liveMatch._id}`} className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline">
                  Theo dõi trận <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </>
          ) : (
            <p className="flex flex-1 items-center justify-center px-5 py-12 text-sm text-muted-foreground">Hiện không có trận nào đang đấu.</p>
          )}
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section aria-labelledby="today-title" className={panel}>
          <div className={panelHead}>
            <h2 id="today-title" className="text-[15px] font-bold">Lịch hôm nay</h2>
            <Link to="/admin/schedule" className="text-[13px] font-semibold text-primary hover:underline">Mở lịch đấu</Link>
          </div>
          <div className="divide-y">
            {todayMatches.map((match) => (
              <div key={match._id} className="flex items-center gap-3.5 px-5 py-3.5">
                <span className="w-12 font-bold tabular-nums">{time(match.scheduledAt)}</span>
                <span className="min-w-0 flex-1 truncate font-semibold">
                  {match.teamA?.name ?? 'TBD'} <span className="font-normal text-muted-foreground">vs</span> {match.teamB?.name ?? 'TBD'}
                </span>
                <ScheduleStatus match={match} />
              </div>
            ))}
            {todayMatches.length === 0 && <p className="px-5 py-10 text-center text-sm text-muted-foreground">Hôm nay không có trận nào.</p>}
          </div>
        </section>

        <section aria-labelledby="standings-title" className={panel}>
          <div className={cn(panelHead, 'flex-wrap')}>
            <h2 id="standings-title" className="text-[15px] font-bold">Bảng xếp hạng</h2>
            <div className="flex gap-1 rounded-[10px] bg-muted/60 p-[3px]" role="group" aria-label="Chọn bảng">
              {MOCK_GROUPS.map(({ _id, name }) => (
                <button
                  key={_id}
                  type="button"
                  aria-pressed={_id === group?._id}
                  onClick={() => setGroupId(_id)}
                  className={cn(
                    'h-[30px] rounded-[7px] px-3 text-xs transition-colors',
                    _id === group?._id ? 'bg-card font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-5 py-2.5 font-medium">#</th>
                  <th className="px-2 py-2.5 font-medium">Đội</th>
                  <th className="px-2 py-2.5 text-center font-medium">T-B</th>
                  <th className="px-2 py-2.5 text-center font-medium">Hiệu số</th>
                  <th className="px-5 py-2.5 text-right font-medium">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {group?.standings.map((row) => (
                  <tr key={row.teamId} className="border-t">
                    <td className={cn('px-5 py-3 font-bold', row.advance ? 'text-primary' : 'text-muted-foreground')}>{row.rank}</td>
                    <td className="px-2 py-3">
                      <span className="flex items-center gap-2.5 font-semibold">
                        <TeamAvatar name={row.teamName} tag={row.teamTag} logoUrl={row.logoUrl} size="xs" />
                        {row.teamName}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center">{row.wins}-{row.losses}</td>
                    <td className={cn('px-2 py-3 text-center', row.goalDiff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-300')}>
                      {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                    </td>
                    <td className="px-5 py-3 text-right font-extrabold">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

const TONES = {
  emerald: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400',
  blue: 'bg-blue-500/12 text-blue-600 dark:text-blue-400',
  amber: 'bg-amber-500/14 text-amber-600 dark:text-amber-400',
  rose: 'bg-rose-500/12 text-rose-600 dark:text-rose-400',
} as const;
const BAR = { emerald: 'bg-emerald-500', blue: 'bg-blue-500', amber: 'bg-amber-500', rose: 'bg-rose-500' } as const;

function Kpi({ label, icon: Icon, tone, value, unit, progress, link }: {
  label: string;
  icon: LucideIcon;
  tone: keyof typeof TONES;
  value: number;
  unit: string;
  progress?: number;
  link?: { to: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn('flex size-9 items-center justify-center rounded-[10px]', TONES[tone])}><Icon className="size-[18px]" /></span>
      </div>
      <p className="flex items-baseline gap-2">
        <span className="text-[32px] font-extrabold leading-none tabular-nums">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </p>
      {progress !== undefined && (
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div className={cn('h-full rounded-full', BAR[tone])} style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }} />
        </div>
      )}
      {link && (
        <Link to={link.to} className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline">
          {link.label} <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}

function TaskRow({ icon: Icon, tone, avatar, title, detail, action }: {
  icon?: LucideIcon;
  tone?: keyof typeof TONES;
  avatar?: React.ReactNode;
  title: React.ReactNode;
  detail: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5 px-5 py-4">
      {avatar ?? (Icon && tone && (
        <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-[10px]', TONES[tone])}><Icon className="size-[18px]" /></span>
      ))}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{detail}</p>
      </div>
      {action}
    </div>
  );
}

function TeamBlock({ match, side }: { match: Match; side: 'A' | 'B' }) {
  const team = side === 'A' ? match.teamA : match.teamB;
  return (
    <div className="flex min-w-0 flex-col items-center gap-2.5">
      <TeamAvatar name={team?.name ?? 'TBD'} tag={team?.tag ?? '?'} logoUrl={team?.logoUrl} size="lg" />
      <p className="max-w-full truncate font-bold">{team?.name ?? 'TBD'}</p>
    </div>
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/12 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:text-red-300">
      <span className="size-[7px] animate-pulse rounded-full bg-red-500" /> LIVE
    </span>
  );
}

function ScheduleStatus({ match }: { match: Match }) {
  const pill = 'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold';
  if (match.status === 'ongoing') return <span className={cn(pill, 'bg-red-500/12 text-red-600 dark:text-red-300')}>Đang đấu</span>;
  if (match.status === 'pending_confirm') return <span className={cn(pill, 'bg-amber-500/14 text-amber-700 dark:text-amber-400')}>Chờ xác nhận</span>;
  if (match.status === 'confirmed') return <span className={cn(pill, 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400')}>Đã xong</span>;
  return <span className={cn(pill, 'bg-blue-500/12 text-blue-700 dark:text-blue-300')}>Sắp diễn ra</span>;
}
