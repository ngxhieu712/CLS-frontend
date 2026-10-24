import { Clock, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_MATCHES } from '@/shared/lib/mock-data';
import { MatchStatusBadge } from '@/shared/components/status-badge';
import { StatCard } from '@/shared/components/stat-card';

// Giả sử trọng tài được phân công các trận có trạng thái đặc biệt
const assignedMatches = MOCK_MATCHES.slice(0, 5);
const pendingMatches  = assignedMatches.filter(m => m.status === 'scheduled' || m.status === 'ongoing');
const doneMatches     = assignedMatches.filter(m => m.status === 'pending_confirm' || m.status === 'confirmed');

export const RefereeDashboardPage = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl font-extrabold text-white">Dashboard Trọng tài</h1>
      <p className="mt-1 text-sm text-zinc-500">Trọng tài chính • Các trận được phân công</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Trận được giao" value={assignedMatches.length} icon={Shield} />
      <StatCard label="Sắp diễn ra" value={pendingMatches.length} icon={Clock} hint="cần chuẩn bị" />
      <StatCard label="Đã gửi kết quả" value={doneMatches.length} icon={CheckCircle} />
    </div>

    {/* Pending matches */}
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex items-center gap-2">
        <AlertTriangle className="size-4 text-amber-400" />
        <p className="text-sm font-bold text-white">Trận cần xử lý</p>
      </div>
      <div className="divide-y divide-white/5">
        {pendingMatches.map(m => (
          <div key={m._id} className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-zinc-500">{m.round}</span>
                <MatchStatusBadge status={m.status} />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-300">{m.teamA?.name ?? 'TBD'}</span>
                <span className="text-zinc-600">vs</span>
                <span className="text-sm text-zinc-300">{m.teamB?.name ?? 'TBD'}</span>
              </div>
              <p className="text-xs text-zinc-600">
                {new Date(m.scheduledAt).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}
              </p>
            </div>
            <Link
              to={`/referee/match/${m._id}`}
              className="shrink-0 rounded-lg bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/25 transition-colors"
            >
              {m.status === 'ongoing' ? 'Tiếp tục' : 'Bắt đầu'}
            </Link>
          </div>
        ))}
        {pendingMatches.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-zinc-600">Không có trận nào cần xử lý</p>
        )}
      </div>
    </div>

    {/* Done matches */}
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex items-center gap-2">
        <CheckCircle className="size-4 text-emerald-400" />
        <p className="text-sm font-bold text-white">Đã gửi kết quả</p>
      </div>
      <div className="divide-y divide-white/5">
        {doneMatches.map(m => (
          <div key={m._id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="text-sm text-zinc-300">{m.teamA?.name ?? 'TBD'} vs {m.teamB?.name ?? 'TBD'}</p>
              <p className="text-xs text-zinc-600">{m.round}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tabular-nums">{m.scoreA ?? 0} : {m.scoreB ?? 0}</span>
              <MatchStatusBadge status={m.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
