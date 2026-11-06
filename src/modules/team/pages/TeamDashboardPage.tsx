import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Bell, CalendarDays, CheckCircle2, Clock3, PencilLine, Trophy, Users, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '@/modules/auth/hooks/use-current-user';
import { useMyPlayers, useMyTeam } from '@/modules/team/hooks/use-team';
import type { ManagedTeam, TeamPlayer, TeamProfileStatus } from '@/modules/team/types/team.types';
import { ErrorState } from '@/shared/components/error-state';
import { LoadingState } from '@/shared/components/loading-state';
import { TeamAvatar } from '@/shared/components/team-avatar';
import { cn } from '@/shared/lib/utils';

const STARTERS_NEEDED = 5;

const STATUS: Record<TeamProfileStatus, { icon: LucideIcon; label: string; pill: string; banner?: { title: string; desc: string } }> = {
  pending: {
    icon: Clock3,
    label: 'Chờ admin duyệt',
    pill: 'bg-amber-500/14 text-amber-700 dark:text-amber-400',
    banner: {
      title: 'Hồ sơ đang chờ admin duyệt',
      desc: 'Bạn sẽ nhận email khi hồ sơ được duyệt. Trong lúc chờ, hãy hoàn thiện đội hình.',
    },
  },
  rejected: {
    icon: XCircle,
    label: 'Bị từ chối',
    pill: 'bg-red-500/14 text-red-700 dark:text-red-300',
    banner: { title: 'Hồ sơ bị từ chối', desc: 'Sửa hồ sơ theo lý do bên dưới rồi nộp lại.' },
  },
  approved: { icon: CheckCircle2, label: 'Hồ sơ đã duyệt', pill: 'bg-emerald-500/14 text-emerald-700 dark:text-emerald-400' },
};

const panel = 'overflow-hidden rounded-2xl border bg-card shadow-sm';
const panelHead = 'flex items-center justify-between gap-3 border-b px-[22px] py-4';

/** The steps a team goes through before it can play, ticked off from its real profile. */
const checklist = (team: ManagedTeam, players: TeamPlayer[]) => [
  { label: 'Tên, tag và logo đội', done: Boolean(team.name && team.tag && team.logo), to: '/team/profile' },
  { label: 'Email và số điện thoại liên hệ', done: Boolean(team.contactEmail && team.contactPhone), to: '/team/profile' },
  {
    label: `${STARTERS_NEEDED} tuyển thủ chính thức`,
    done: players.filter(({ status }) => status === 'starter').length >= STARTERS_NEEDED,
    to: '/team/roster',
  },
  { label: 'Được ban tổ chức duyệt', done: team.profileStatus === 'approved' },
];

export const TeamDashboardPage = () => {
  const { data: user } = useCurrentUser();
  const teamQuery = useMyTeam();
  const playersQuery = useMyPlayers();

  if (teamQuery.isPending) return <LoadingState />;
  if (teamQuery.isError) return <ErrorState error={teamQuery.error} onRetry={() => void teamQuery.refetch()} />;

  const team = teamQuery.data;
  const players = playersQuery.data ?? [];
  const starters = players.filter(({ status }) => status === 'starter').length;
  const status = STATUS[team.profileStatus];
  const steps = checklist(team, players);
  const doneSteps = steps.filter(({ done }) => done).length;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Chào mừng{user?.fullName ? `, ${user.fullName}` : ' quản lý đội'}.</p>

      {status.banner && (
        <div
          role="status"
          className={cn(
            'flex flex-wrap items-start gap-3 rounded-2xl border px-5 py-4',
            team.profileStatus === 'rejected' ? 'border-red-500/30 bg-red-500/8' : 'border-amber-500/30 bg-amber-500/8',
          )}
        >
          <status.icon className={cn('mt-0.5 size-5 shrink-0', team.profileStatus === 'rejected' ? 'text-red-500' : 'text-amber-500')} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{status.banner.title}</p>
            <p className="text-sm text-muted-foreground">{status.banner.desc}</p>
            {team.profileStatus === 'rejected' && team.rejectReason && (
              <p className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                <span className="font-semibold">Lý do: </span>{team.rejectReason}
              </p>
            )}
          </div>
          {team.profileStatus === 'rejected' && (
            <Link to="/team/profile" className="inline-flex h-10 items-center rounded-[10px] bg-red-500 px-4 text-sm font-bold text-white hover:bg-red-600">
              Sửa &amp; nộp lại
            </Link>
          )}
        </div>
      )}

      <section aria-label="Thông tin đội" className="flex flex-wrap items-center gap-6 rounded-[20px] border bg-card p-7 shadow-sm">
        <TeamAvatar name={team.name} tag={team.tag} logoUrl={team.logo} size="xl" />
        <div className="min-w-0 flex-[1_1_280px]">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[28px] font-black leading-tight">{team.name}</h1>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">[{team.tag}]</span>
            <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold', status.pill)}>
              <status.icon className="size-3.5" /> {status.label}
            </span>
          </div>
          <p className="mt-2 text-muted-foreground">
            {[team.organization, team.contactEmail].filter(Boolean).join(' · ') || 'Chưa có thông tin tổ chức'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link to="/team/profile" className="inline-flex h-11 items-center gap-2 rounded-[10px] border px-4 font-semibold transition-colors hover:bg-muted">
            <PencilLine className="size-4" /> Sửa hồ sơ
          </Link>
          <Link to="/team/roster" className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-[18px] font-bold text-primary-foreground transition-opacity hover:opacity-90">
            <Users className="size-4" /> Quản lý đội hình
          </Link>
        </div>
      </section>

      <section aria-label="Thành tích" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Vị trí trong bảng" value="—" hint="Cập nhật sau khi chia bảng" icon={Trophy} />
        <Stat label="Điểm" value="—" hint="Chưa có trận đã xác nhận" icon={Trophy} />
        <Stat label="Hoàn thiện hồ sơ" value={`${doneSteps}/${steps.length}`} hint={doneSteps === steps.length ? 'Đã sẵn sàng thi đấu' : 'Xem các bước còn thiếu'} icon={CheckCircle2} />
        <Stat
          label="Tuyển thủ"
          value={String(players.length)}
          hint={`${starters} chính thức · ${players.length - starters} dự bị`}
          icon={Users}
        />
      </section>

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-4">
          <section aria-labelledby="next-match" className={panel}>
            <div className={panelHead}>
              <h2 id="next-match" className="text-[15px] font-bold">Trận tiếp theo</h2>
              <Link to="/team/schedule" className="text-[13px] font-semibold text-primary hover:underline">Lịch của đội</Link>
            </div>
            <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><CalendarDays className="size-5" /></span>
              <p className="font-semibold">Chưa có trận đấu</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {team.profileStatus === 'approved'
                  ? 'Ban tổ chức sẽ công bố lịch sau khi chia bảng.'
                  : 'Lịch thi đấu hiển thị sau khi hồ sơ được duyệt.'}
              </p>
            </div>
          </section>

          <section aria-labelledby="roster-title" className={panel}>
            <div className={panelHead}>
              <h2 id="roster-title" className="text-[15px] font-bold">Đội hình</h2>
              <Link to="/team/roster" className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline">
                Quản lý <ArrowRight className="size-3.5" />
              </Link>
            </div>
            {players.length > 0 ? (
              <ul className="grid gap-3 p-[22px] sm:grid-cols-2 lg:grid-cols-3">
                {players.map((player) => (
                  <li
                    key={player._id}
                    className={cn(
                      'flex min-w-0 items-center gap-2.5 rounded-xl p-2.5',
                      player.status === 'starter' ? 'bg-muted/60' : 'border border-dashed',
                    )}
                  >
                    <TeamAvatar name={player.nickname} tag={player.nickname.slice(0, 2).toUpperCase()} logoUrl={player.avatar || undefined} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-bold">{player.nickname}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {player.status === 'starter' ? 'Chính thức' : 'Dự bị'}{player.position && ` · ${player.position}`}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-10 text-center">
                <p className="font-semibold">Chưa có tuyển thủ</p>
                <p className="mt-1 text-sm text-muted-foreground">Cần ít nhất {STARTERS_NEEDED} tuyển thủ chính thức để thi đấu.</p>
                <Link to="/team/roster" className="mt-4 inline-flex h-10 items-center rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground hover:opacity-90">
                  Thêm tuyển thủ
                </Link>
              </div>
            )}
          </section>
        </div>

        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
          <section aria-labelledby="notice-title" className={panel}>
            <div className={panelHead}><h2 id="notice-title" className="text-[15px] font-bold">Thông báo từ BTC</h2></div>
            <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
              <Bell className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Chưa có thông báo mới.</p>
            </div>
          </section>

          <section aria-labelledby="checklist-title" className="rounded-2xl border bg-card px-[22px] py-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="checklist-title" className="text-[15px] font-bold">Hoàn thiện hồ sơ</h2>
              <span className="font-bold tabular-nums text-primary">{doneSteps}/{steps.length}</span>
            </div>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(doneSteps / steps.length) * 100}%` }} />
            </div>
            <ul className="space-y-2.5">
              {steps.map((step) => (
                <li key={step.label} className="flex items-center gap-2.5 text-sm">
                  {step.done
                    ? <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                    : <span className="size-4 shrink-0 rounded-full border-2 border-muted-foreground/50" />}
                  {step.done || !step.to
                    ? <span className={cn(step.done && 'text-muted-foreground')}>{step.label}</span>
                    : <Link to={step.to} className="font-medium text-primary hover:underline">{step.label}</Link>}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

function Stat({ label, value, hint, icon: Icon }: { label: string; value: string; hint: string; icon: LucideIcon }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between text-muted-foreground">
        <span>{label}</span>
        <Icon className="size-4" />
      </div>
      <p className="mt-2 text-[32px] font-black leading-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
