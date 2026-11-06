import { Calendar, Bell, Users, Trophy, ChevronRight, Clock, XCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/shared/components/stat-card';
import { LoadingState } from '@/shared/components/loading-state';
import { ErrorState } from '@/shared/components/error-state';
import { useCurrentUser } from '@/modules/auth/hooks/use-current-user';
import { useMyTeam, useMyPlayers } from '@/modules/team/hooks/use-team';
import type { TeamProfileStatus } from '@/modules/team/types/team.types';

// ─── Status banner ───────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<TeamProfileStatus, {
  icon: React.ElementType; color: string; borderColor: string; bgColor: string;
  title: string; desc: string; showResubmit?: boolean;
}> = {
  pending: {
    icon: Clock,
    color: 'text-amber-400', borderColor: 'border-amber-500/30', bgColor: 'bg-amber-500/8',
    title: 'Hồ sơ đang chờ admin duyệt',
    desc: 'Bạn sẽ nhận email khi hồ sơ được duyệt. Trong thời gian chờ, bạn chỉ xem được trang này.',
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-400', borderColor: 'border-red-500/30', bgColor: 'bg-red-500/8',
    title: 'Hồ sơ bị từ chối',
    desc: 'Xem lý do bên dưới, sửa hồ sơ và nộp lại.',
    showResubmit: true,
  },
  approved: {
    icon: CheckCircle,
    color: 'text-emerald-400', borderColor: 'border-emerald-500/20', bgColor: 'bg-emerald-500/5',
    title: 'Hồ sơ đã được duyệt',
    desc: 'Logo, thông tin liên hệ và đội hình đã được đăng ký.',
  },
};

export const TeamDashboardPage = () => {
  const { data: user } = useCurrentUser();
  const teamQuery = useMyTeam();
  const playersQuery = useMyPlayers();

  // Loading state
  if (teamQuery.isPending) return <LoadingState />;

  // Error state
  if (teamQuery.isError) {
    return <ErrorState error={teamQuery.error} onRetry={() => void teamQuery.refetch()} />;
  }

  const team = teamQuery.data;
  const players = playersQuery.data ?? [];
  const status = team.profileStatus;
  const cfg = STATUS_CONFIG[status];
  const StatusIcon = cfg.icon;
  const isApproved = status === 'approved';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Dashboard đội</h1>
          <p className="mt-1 text-sm text-slate-500">
            {user?.fullName ? `Chào mừng, ${user.fullName}` : 'Chào mừng, Quản lý đội'}
          </p>
        </div>
        <Link
          to="/team/profile"
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
        >
          Hồ sơ đội
        </Link>
      </div>

      {/* ── Trạng thái hồ sơ ─────────────────────────────────────────── */}
      <div className={`rounded-xl border ${cfg.borderColor} ${cfg.bgColor} p-4`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <StatusIcon className={`size-5 shrink-0 mt-0.5 ${cfg.color}`} />
            <div>
              <p className={`text-sm font-semibold ${cfg.color}`}>{cfg.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{cfg.desc}</p>
              {/* Lý do từ chối */}
              {status === 'rejected' && team.rejectReason && (
                <div className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  <span className="font-semibold">Lý do: </span>{team.rejectReason}
                </div>
              )}
            </div>
          </div>
          {cfg.showResubmit && (
            <Link
              to="/team/profile"
              className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-black hover:opacity-90 transition-opacity"
            >
              Sửa & Nộp lại
            </Link>
          )}
          {isApproved && (
            <Link to="/team/roster" className={`shrink-0 flex items-center gap-1 text-xs ${cfg.color} hover:underline`}>
              Xem đội hình <ChevronRight className="size-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Stats — chỉ hiện khi approved */}
      {isApproved && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Vị trí bảng" value="—" icon={Trophy} hint="Chưa có dữ liệu" />
          <StatCard label="Điểm số" value={0} icon={Trophy} hint="0T — 0B" />
          <StatCard label="Trận sắp tới" value={0} icon={Calendar} hint="trong lịch" />
          <StatCard label="Tuyển thủ" value={players.length} icon={Users} hint="đã đăng ký" />
        </div>
      )}

      {/* Notifications */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
          <Bell className="size-4 text-amber-400" /> Thông báo từ BTC
        </h2>
        <p className="py-4 text-center text-sm text-slate-600">
          {isApproved
            ? 'Chưa có thông báo mới từ ban tổ chức.'
            : 'Thông báo sẽ hiển thị sau khi hồ sơ được duyệt.'}
        </p>
      </div>

      {/* Upcoming matches — chỉ khi approved */}
      {isApproved && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white">
              <Calendar className="size-4 text-blue-400" /> Trận sắp tới
            </h2>
            <Link to="/team/schedule" className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-400 transition-colors">
              Tất cả <ChevronRight className="size-3" />
            </Link>
          </div>
          <p className="py-8 text-center text-sm text-slate-600">
            Lịch thi đấu sẽ được cập nhật sau khi giải đấu bắt đầu.
          </p>
        </div>
      )}
    </div>
  );
};
