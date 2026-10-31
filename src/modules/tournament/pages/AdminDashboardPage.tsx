import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Swords,
  Trophy,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MatchStatusBadge } from '@/shared/components/status-badge';
import { StatCard } from '@/shared/components/stat-card';
import { TeamAvatar } from '@/shared/components/team-avatar';
import { MOCK_APPLICATIONS, MOCK_MATCHES, MOCK_TEAMS, MOCK_TOURNAMENT } from '@/shared/lib/mock-data';

const pendingConfirm = MOCK_MATCHES.filter(({ status }) => status === 'pending_confirm');
const liveMatches = MOCK_MATCHES.filter(({ status }) => status === 'ongoing');
const pendingTeams = MOCK_APPLICATIONS.filter(({ status }) => status === 'pending');
const approvedTeams = MOCK_TEAMS.length;
const completedMatches = MOCK_MATCHES.filter(({ status }) => status === 'confirmed').length;

export const AdminDashboardPage = () => (
  <div className="space-y-7">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tổng quan giải đấu</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {MOCK_TOURNAMENT.name} <span className="mx-1.5 text-border">/</span> Vận hành giải trong một nơi.
        </p>
      </div>
      <Link
        to="/admin/tournament"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Trophy className="size-4" />
        Cài đặt giải
      </Link>
    </header>

    <section aria-label="Chỉ số giải đấu" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Đội đã duyệt" value={approvedTeams} icon={Users} hint="Đang tham gia vòng bảng" />
      <StatCard label="Trận đang diễn ra" value={liveMatches.length} icon={Swords} hint={`${completedMatches} trận đã xác nhận`} />
      <StatCard label="Hồ sơ chờ duyệt" value={pendingTeams.length} icon={ClipboardList} hint="Cần kiểm tra thông tin đội" />
      <StatCard label="Kết quả cần xác nhận" value={pendingConfirm.length} icon={ClipboardCheck} hint="Trọng tài đã gửi kết quả" />
    </section>

    <section className="grid gap-5 xl:grid-cols-2" aria-label="Hàng đợi xử lý nhanh">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Kết quả chờ xác nhận</h2>
              <p className="text-xs text-muted-foreground">{pendingConfirm.length} trận trong hàng đợi</p>
            </div>
          </div>
          <Link className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline" to="/admin/schedule">
            Tất cả <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {pendingConfirm.slice(0, 3).map((match) => (
            <div key={match._id} className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <TeamAvatar name={match.teamA?.name ?? 'Chưa xác định'} tag={match.teamA?.tag ?? '?'} logoUrl={match.teamA?.logoUrl} size="sm" />
                  <span className="min-w-0 truncate text-sm font-medium">{match.teamA?.name ?? 'TBD'}</span>
                </div>
                <span className="shrink-0 text-sm font-bold tabular-nums text-primary">{match.scoreA} : {match.scoreB}</span>
                <div className="flex min-w-0 items-center justify-end gap-2">
                  <span className="min-w-0 truncate text-right text-sm font-medium">{match.teamB?.name ?? 'TBD'}</span>
                  <TeamAvatar name={match.teamB?.name ?? 'Chưa xác định'} tag={match.teamB?.tag ?? '?'} logoUrl={match.teamB?.logoUrl} size="sm" />
                </div>
              </div>
                <p className="mt-1 text-xs text-muted-foreground">{match.round} · {match.format}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <MatchStatusBadge status={match.status} />
                <Link
                  to={`/admin/schedule?review=${match._id}`}
                  className="inline-flex h-8 items-center rounded-md bg-emerald-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Xác nhận
                </Link>
                <Link
                  to={`/admin/schedule?edit=${match._id}`}
                  className="inline-flex h-8 items-center rounded-md border border-input px-3 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Sửa / Mở lại
                </Link>
              </div>
            </div>
          ))}
          {pendingConfirm.length === 0 && (
            <p className="flex items-center gap-2 px-4 py-7 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 text-emerald-500" /> Không có kết quả cần xử lý.
            </p>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ClipboardList className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Hồ sơ đội chờ duyệt</h2>
              <p className="text-xs text-muted-foreground">{pendingTeams.length} hồ sơ cần xem</p>
            </div>
          </div>
          <Link className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline" to="/admin/approval">
            Tất cả <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {pendingTeams.slice(0, 3).map((application) => (
            <div key={application._id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <TeamAvatar name={application.teamName} tag={application.teamTag} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                  {application.teamName} <span className="ml-1 text-xs text-muted-foreground">[{application.teamTag}]</span>
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{application.managerName} · {application.managerEmail}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/admin/approval?review=${application._id}`}
                  className="inline-flex h-8 items-center rounded-md bg-emerald-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Duyệt
                </Link>
                <Link
                  to={`/admin/approval?review=${application._id}`}
                  className="inline-flex h-8 items-center rounded-md border border-input px-3 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Từ chối
                </Link>
              </div>
            </div>
          ))}
          {pendingTeams.length === 0 && (
            <p className="flex items-center gap-2 px-4 py-7 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 text-emerald-500" /> Không có hồ sơ cần xử lý.
            </p>
          )}
        </div>
      </div>
    </section>

    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <div>
            <h2 className="text-sm font-semibold">Diễn biến trận đấu</h2>
            <p className="mt-1 text-xs text-muted-foreground">Trạng thái trực tiếp và lịch sắp tới</p>
          </div>
          <Link className="text-xs font-medium text-primary hover:underline" to="/admin/schedule">Mở lịch đấu</Link>
        </div>
        <div className="divide-y divide-border">
          {MOCK_MATCHES.filter(({ status }) => status === 'ongoing' || status === 'scheduled').slice(0, 5).map((match) => (
            <div key={match._id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <TeamAvatar name={match.teamA?.name ?? 'Chưa xác định'} tag={match.teamA?.tag ?? '?'} logoUrl={match.teamA?.logoUrl} size="xs" />
                  <span className="max-w-28 truncate text-sm font-medium">{match.teamA?.name ?? 'TBD'}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span className="max-w-28 truncate text-sm font-medium">{match.teamB?.name ?? 'TBD'}</span>
                  <TeamAvatar name={match.teamB?.name ?? 'Chưa xác định'} tag={match.teamB?.tag ?? '?'} logoUrl={match.teamB?.logoUrl} size="xs" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{match.round} · {match.format}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {match.status === 'ongoing' && <span className="size-2 animate-pulse rounded-full bg-red-500" aria-label="Đang trực tiếp" />}
                <MatchStatusBadge status={match.status} />
                <span className="hidden text-xs tabular-nums text-muted-foreground sm:inline">
                  {new Date(match.scheduledAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-4">
          <h2 className="text-sm font-semibold">Lối tắt vận hành</h2>
          <p className="mt-1 text-xs text-muted-foreground">Đi thẳng đến công việc thường dùng</p>
        </div>
        <div className="space-y-2">
          {[
            { to: '/admin/teams', label: 'Đội & tài khoản', detail: `${MOCK_TEAMS.length} đội`, icon: Users },
            { to: '/admin/draw', label: 'Chia bảng & bốc thăm', detail: '4 bảng đấu', icon: Trophy },
            { to: '/admin/schedule', label: 'Lịch đấu & trọng tài', detail: `${MOCK_MATCHES.length} trận`, icon: CalendarDays },
            { to: '/admin/playoff', label: 'Thiết lập playoff', detail: 'Nhánh đơn', icon: Clock3 },
          ].map(({ to, label, detail, icon: Icon }) => (
            <Link key={to} to={to} className="group flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-muted/50">
              <Icon className="size-4 text-muted-foreground group-hover:text-primary" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">{detail}</span>
              <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  </div>
);
