import { CheckCircle, AlertTriangle, Trophy, Users, Calendar, Swords, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_MATCHES, MOCK_TOURNAMENT, MOCK_TEAMS, MOCK_APPLICATIONS } from '@/shared/lib/mock-data';
import { StatCard } from '@/shared/components/stat-card';
import { MatchStatusBadge } from '@/shared/components/status-badge';

const pendingConfirm = MOCK_MATCHES.filter(m => m.status === 'pending_confirm');
const liveMatches    = MOCK_MATCHES.filter(m => m.status === 'ongoing');
const doneCount      = MOCK_MATCHES.filter(m => m.status === 'confirmed').length;
const pendingTeams   = MOCK_APPLICATIONS.filter(a => a.status === 'pending');

export const AdminDashboardPage = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Dashboard Admin</h1>
        <p className="mt-1 text-sm text-zinc-500">{MOCK_TOURNAMENT.name}</p>
      </div>
      <Link to="/admin/tournament" className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 hover:bg-amber-500/20 transition-colors">
        Thiết lập giải
      </Link>
    </div>

    {/* Stats */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Tổng số đội" value={MOCK_TEAMS.length} icon={Users} hint="4 bảng đấu" />
      <StatCard label="Tổng số trận" value={MOCK_MATCHES.length} icon={Swords} hint={`${doneCount} đã hoàn thành`} />
      <StatCard label="Đang diễn ra" value={liveMatches.length} icon={Trophy} />
      <StatCard label="Chờ xác nhận" value={pendingConfirm.length} icon={AlertTriangle} hint="cần xử lý" />
    </div>

    {/* Hồ sơ đội chờ duyệt */}
    <div className="rounded-xl border border-blue-500/20 bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-blue-500/20 bg-blue-500/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-4 text-blue-400" />
          <p className="text-sm font-bold text-blue-400">Hồ sơ đội chờ duyệt ({pendingTeams.length})</p>
        </div>
        <Link to="/admin/approval" className="text-xs text-zinc-500 hover:text-amber-400 transition-colors">Xem tất cả →</Link>
      </div>
      <div className="divide-y divide-white/5">
        {pendingTeams.slice(0, 3).map(app => (
          <div key={app._id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">
                {app.teamName} <span className="text-xs text-amber-400">[{app.teamTag}]</span>
              </p>
              <p className="text-xs text-zinc-500">Quản lý: {app.managerName} · {app.managerEmail}</p>
            </div>
            <Link to="/admin/approval" className="shrink-0 rounded-lg bg-blue-500/15 border border-blue-500/30 px-3 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/25 transition-colors">
              Xem & duyệt
            </Link>
          </div>
        ))}
        {pendingTeams.length === 0 && (
          <div className="flex items-center gap-2 px-4 py-6 text-sm text-zinc-600">
            <CheckCircle className="size-4 text-emerald-500" />
            Không có hồ sơ nào chờ duyệt
          </div>
        )}
        {pendingTeams.length > 3 && (
          <div className="px-4 py-2 text-center">
            <Link to="/admin/approval" className="text-xs text-amber-400 hover:underline">
              Xem thêm {pendingTeams.length - 3} hồ sơ →
            </Link>
          </div>
        )}
      </div>
    </div>

    {/* Pending confirm — hàng đợi quan trọng nhất */}
    <div className="rounded-xl border border-orange-500/20 bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-orange-500/20 bg-orange-500/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-orange-400" />
          <p className="text-sm font-bold text-orange-400">Kết quả chờ xác nhận ({pendingConfirm.length})</p>
        </div>
        <Link to="/admin/schedule" className="text-xs text-zinc-500 hover:text-amber-400 transition-colors">Xem tất cả →</Link>
      </div>
      <div className="divide-y divide-white/5">
        {pendingConfirm.map(m => (
          <div key={m._id} className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-zinc-500 mb-1">{m.round}</p>
              <p className="text-sm font-semibold text-white">
                {m.teamA?.name ?? 'TBD'}
                <span className="mx-2 font-black text-amber-400">{m.scoreA} : {m.scoreB}</span>
                {m.teamB?.name ?? 'TBD'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <MatchStatusBadge status={m.status} />
              <Link
                to={`/admin/schedule`}
                className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-black hover:opacity-90 transition-opacity"
              >
                Xác nhận
              </Link>
            </div>
          </div>
        ))}
        {pendingConfirm.length === 0 && (
          <div className="flex items-center gap-2 px-4 py-6 text-sm text-zinc-600">
            <CheckCircle className="size-4 text-emerald-500" />
            Không có kết quả nào chờ xác nhận
          </div>
        )}
      </div>
    </div>

    {/* Live matches */}
    {liveMatches.length > 0 && (
      <div className="rounded-xl border border-amber-500/20 bg-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-amber-500/20 px-4 py-3">
          <span className="size-2 animate-pulse rounded-full bg-amber-500" />
          <p className="text-sm font-bold text-amber-400">Đang diễn ra ({liveMatches.length})</p>
        </div>
        <div className="divide-y divide-white/5">
          {liveMatches.map(m => (
            <div key={m._id} className="flex items-center justify-between gap-4 px-4 py-3">
              <p className="text-sm text-zinc-300">
                {m.teamA?.name ?? 'TBD'} <span className="font-black text-amber-400">{m.scoreA}:{m.scoreB}</span> {m.teamB?.name ?? 'TBD'}
                {m.isProvisional && <span className="ml-2 text-xs text-amber-500">Tạm thời</span>}
              </p>
              <span className="text-xs text-zinc-600">{m.round}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Quick links */}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[
        { to: '/admin/teams',    label: 'Quản lý đội & tài khoản', icon: Users,          desc: `${MOCK_TEAMS.length} đội tham dự` },
        { to: '/admin/approval', label: 'Duyệt hồ sơ đội',         icon: ClipboardList,  desc: `${pendingTeams.length} chờ duyệt` },
        { to: '/admin/draw',     label: 'Chia bảng & Bốc thăm',    icon: Trophy,         desc: '4 bảng × 4 đội' },
        { to: '/admin/schedule', label: 'Lịch đấu & Phân công',     icon: Calendar,       desc: `${MOCK_MATCHES.length} trận` },
        { to: '/admin/playoff',  label: 'Thiết lập Playoff',        icon: Swords,         desc: 'Nhánh đơn' },
      ].map(item => (
        <Link
          key={item.to}
          to={item.to}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-amber-500/30 transition-all group"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <item.icon className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">{item.label}</p>
            <p className="text-xs text-zinc-600">{item.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);
