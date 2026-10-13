import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { MOCK_MATCHES, MOCK_GROUPS } from '@/shared/lib/mock-data';
import { MatchCard } from '@/shared/components/match-card';
import type { MatchStatus } from '@/shared/types/esports.types';

const STATUS_FILTERS: { value: MatchStatus | 'all'; label: string }[] = [
  { value: 'all',             label: 'Tất cả' },
  { value: 'ongoing',        label: 'Đang đấu' },
  { value: 'scheduled',      label: 'Sắp diễn ra' },
  { value: 'pending_confirm',label: 'Chờ xác nhận' },
  { value: 'confirmed',      label: 'Đã hoàn thành' },
];

export const SchedulePage = () => {
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'all'>('all');
  const [groupFilter, setGroupFilter]   = useState<string>('all');
  const [phaseFilter, setPhaseFilter]   = useState<'all' | 'group' | 'playoff'>('all');

  const filtered = MOCK_MATCHES.filter(m => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (groupFilter  !== 'all' && m.groupId !== groupFilter)  return false;
    if (phaseFilter  !== 'all' && m.phase   !== phaseFilter)  return false;
    return true;
  });

  // Group by date
  const byDate: Record<string, typeof filtered> = {};
  filtered.forEach(m => {
    const d = new Date(m.scheduledAt).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    byDate[d] = [...(byDate[d] ?? []), m];
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Lịch thi đấu &amp; Kết quả</h1>
        <p className="mt-1 text-sm text-slate-500">Lọc theo trạng thái, bảng đấu hoặc giai đoạn</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="size-4 shrink-0 text-slate-500" />
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === f.value
                  ? 'border-amber-500/50 bg-amber-500/15 text-amber-400'
                  : 'border-white/10 bg-muted/30 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Phase */}
        <div className="flex items-center gap-1.5">
          {(['all', 'group', 'playoff'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPhaseFilter(p)}
              className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                phaseFilter === p
                  ? 'border-blue-500/50 bg-blue-500/15 text-blue-400'
                  : 'border-white/10 bg-muted/30 text-slate-400 hover:text-white'
              }`}
            >
              {p === 'all' ? 'Mọi giai đoạn' : p === 'group' ? 'Vòng bảng' : 'Playoff'}
            </button>
          ))}
        </div>

        {/* Group */}
        <select
          value={groupFilter}
          onChange={e => setGroupFilter(e.target.value)}
          className="rounded-lg border border-white/10 public-card px-3 py-1.5 text-xs text-slate-300 focus:border-amber-500/50 focus:outline-none cursor-pointer"
        >
          <option value="all">Tất cả bảng</option>
          {MOCK_GROUPS.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-600">{filtered.length} trận</p>

      {/* Matches grouped by date */}
      <div className="space-y-8">
        {Object.entries(byDate).map(([date, matches]) => (
          <div key={date}>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-400">
              <Calendar className="size-4" />
              {date}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map(m => <MatchCard key={m._id} match={m} />)}
            </div>
          </div>
        ))}
        {Object.keys(byDate).length === 0 && (
          <div className="py-16 text-center text-slate-600">
            <Calendar className="mx-auto mb-3 size-10 opacity-30" />
            <p>Không có trận nào phù hợp bộ lọc</p>
          </div>
        )}
      </div>
    </div>
  );
};
