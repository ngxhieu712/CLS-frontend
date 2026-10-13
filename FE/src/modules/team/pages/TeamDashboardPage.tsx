import { Calendar, Bell, Users, Trophy, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_MATCHES, MOCK_GROUPS } from '@/shared/lib/mock-data';
import { MatchCard } from '@/shared/components/match-card';
import { StatCard } from '@/shared/components/stat-card';

// Demo: giả sử đội đang đăng nhập là t1 (Team Alpha, Bảng A)
const MY_TEAM_ID = 't1';
const myGroup = MOCK_GROUPS.find(g => g.teams.some(t => t._id === MY_TEAM_ID));
const myStanding = myGroup?.standings.find(s => s.teamId === MY_TEAM_ID);
const myNextMatches = MOCK_MATCHES
  .filter(m => (m.teamA?._id === MY_TEAM_ID || m.teamB?._id === MY_TEAM_ID) && m.status === 'scheduled')
  .slice(0, 3);

export const TeamDashboardPage = () => (
  <div className="space-y-8">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Dashboard đội</h1>
        <p className="mt-1 text-sm text-zinc-500">Chào mừng, Quản lý đội</p>
      </div>
      <Link
        to="/team/profile"
        className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
      >
        Hồ sơ đội
      </Link>
    </div>

    {/* Stats */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Vị trí bảng" value={myStanding ? `#${myStanding.rank}` : '—'} icon={Trophy} hint={myGroup?.name} />
      <StatCard label="Điểm số" value={myStanding?.points ?? 0} icon={Trophy} hint={`${myStanding?.wins ?? 0}T — ${myStanding?.losses ?? 0}B`} />
      <StatCard label="Trận sắp tới" value={myNextMatches.length} icon={Calendar} hint="trong lịch" />
      <StatCard label="Tuyển thủ" value={5} icon={Users} hint="đã đăng ký" />
    </div>

    {/* Notifications */}
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
        <Bell className="size-4 text-amber-400" /> Thông báo từ BTC
      </h2>
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
              <p className="text-xs text-zinc-600">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Upcoming matches */}
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold text-white">
          <Calendar className="size-4 text-blue-400" /> Trận sắp tới
        </h2>
        <Link to="/team/schedule" className="flex items-center gap-1 text-xs text-zinc-500 hover:text-amber-400 transition-colors">
          Tất cả <ChevronRight className="size-3" />
        </Link>
      </div>
      {myNextMatches.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {myNextMatches.map(m => <MatchCard key={m._id} match={m} />)}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-zinc-600">Không có trận nào sắp tới</p>
      )}
    </div>

    {/* Profile status */}
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-400">Hồ sơ đội đã hoàn thiện</p>
          <p className="text-xs text-zinc-500 mt-0.5">Logo, thông tin liên hệ và đội hình đã được đăng ký</p>
        </div>
        <Link to="/team/roster" className="flex items-center gap-1 text-xs text-emerald-400 hover:underline">
          Xem đội hình <ChevronRight className="size-3" />
        </Link>
      </div>
    </div>
  </div>
);
