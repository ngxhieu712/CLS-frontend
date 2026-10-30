import { Calendar, Bell, Users, Trophy, ChevronRight, Clock, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_MATCHES, MOCK_GROUPS } from '@/shared/lib/mock-data';
import { MatchCard } from '@/shared/components/match-card';
import { StatCard } from '@/shared/components/stat-card';
import { useCurrentUser } from '@/modules/auth/hooks/use-current-user';
import type { AccountStatus } from '@/modules/auth/types/auth.types';

const MY_TEAM_ID = 't1';
const myGroup    = MOCK_GROUPS.find(g => g.teams.some(t => t._id === MY_TEAM_ID));
const myStanding = myGroup?.standings.find(s => s.teamId === MY_TEAM_ID);
const myNextMatches = MOCK_MATCHES
  .filter(m => (m.teamA?._id === MY_TEAM_ID || m.teamB?._id === MY_TEAM_ID) && m.status === 'scheduled')
  .slice(0, 3);

// ─── Status banner ───────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<AccountStatus, {
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
  active: {
    icon: CheckCircle,
    color: 'text-emerald-400', borderColor: 'border-emerald-500/20', bgColor: 'bg-emerald-500/5',
    title: 'Hồ sơ đã được duyệt',
    desc: 'Logo, thông tin liên hệ và đội hình đã được đăng ký.',
  },
  locked: {
    icon: AlertTriangle,
    color: 'text-red-400', borderColor: 'border-red-500/30', bgColor: 'bg-red-500/8',
    title: 'Tài khoản bị khoá',
    desc: 'Liên hệ admin để được hỗ trợ.',
  },
};

export const TeamDashboardPage = () => {
  const { data: user } = useCurrentUser();
  const status = user?.status ?? 'pending';
  const cfg    = STATUS_CONFIG[status];
  const StatusIcon = cfg.icon;
  const isActive = status === 'active';

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
              {status === 'rejected' && user?.rejectReason && (
                <div className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  <span className="font-semibold">Lý do: </span>{user.rejectReason}
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
          {isActive && (
            <Link to="/team/roster" className={`shrink-0 flex items-center gap-1 text-xs ${cfg.color} hover:underline`}>
              Xem đội hình <ChevronRight className="size-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Stats — chỉ hiện khi active */}
      {isActive && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Vị trí bảng" value={myStanding ? `#${myStanding.rank}` : '—'} icon={Trophy} hint={myGroup?.name} />
          <StatCard label="Điểm số" value={myStanding?.points ?? 0} icon={Trophy} hint={`${myStanding?.wins ?? 0}T — ${myStanding?.losses ?? 0}B`} />
          <StatCard label="Trận sắp tới" value={myNextMatches.length} icon={Calendar} hint="trong lịch" />
          <StatCard label="Tuyển thủ" value={5} icon={Users} hint="đã đăng ký" />
        </div>
      )}

      {/* Notifications */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
          <Bell className="size-4 text-amber-400" /> Thông báo từ BTC
        </h2>
        {isActive ? (
          <div className="space-y-2">
            {[
              { text: 'Deadline đăng ký đội hình: 15/10/2025 23:59', time: '2 giờ trước', type: 'warn' },
              { text: 'Lịch thi đấu vòng 3 đã được công bố', time: '1 ngày trước', type: 'info' },
              { text: 'Kết quả trận m5 đã được xác nhận', time: '2 ngày trước', type: 'success' },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
                <span className={`mt-0.5 size-2 shrink-0 rounded-full ${n.type === 'warn' ? 'bg-amber-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                <div className="min-w-0">
                  <p className="text-sm text-white">{n.text}</p>
                  <p className="text-xs text-slate-600">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-slate-600">
            Thông báo sẽ hiển thị sau khi hồ sơ được duyệt.
          </p>
        )}
      </div>

      {/* Upcoming matches — chỉ khi active */}
      {isActive && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white">
              <Calendar className="size-4 text-blue-400" /> Trận sắp tới
            </h2>
            <Link to="/team/schedule" className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-400 transition-colors">
              Tất cả <ChevronRight className="size-3" />
            </Link>
          </div>
          {myNextMatches.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {myNextMatches.map(m => <MatchCard key={m._id} match={m} />)}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-slate-600">Không có trận nào sắp tới</p>
          )}
        </div>
      )}
    </div>
  );
};
