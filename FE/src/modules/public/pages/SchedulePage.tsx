import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { MOCK_MATCHES, MOCK_GROUPS } from '@/shared/lib/mock-data';
import { MatchCard } from '@/shared/components/match-card';
import { PublicSidebar } from '@/shared/components/public-sidebar';
import type { MatchStatus } from '@/shared/types/esports.types';

const STATUS_FILTERS: { value: MatchStatus | 'all'; label: string; color?: string }[] = [
  { value: 'all',              label: 'Tất cả' },
  { value: 'ongoing',          label: '🔴 LIVE',       color: 'red' },
  { value: 'scheduled',        label: 'Sắp diễn ra',  color: 'cyan' },
  { value: 'pending_confirm',  label: 'Chờ xác nhận', color: 'amber' },
  { value: 'confirmed',        label: 'Hoàn thành',   color: 'green' },
];

export const SchedulePage = () => {
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'all'>('all');
  const [groupFilter,  setGroupFilter]  = useState<string>('all');
  const [phaseFilter,  setPhaseFilter]  = useState<'all' | 'group' | 'playoff'>('all');

  const filtered = MOCK_MATCHES.filter(m => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (groupFilter  !== 'all' && m.groupId !== groupFilter)  return false;
    if (phaseFilter  !== 'all' && m.phase   !== phaseFilter)  return false;
    return true;
  });

  // Group by date
  const byDate: Record<string, typeof filtered> = {};
  filtered.forEach(m => {
    const d = new Date(m.scheduledAt).toLocaleDateString('vi-VN', {
      weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
    });
    byDate[d] = [...(byDate[d] ?? []), m];
  });

  // Date pills from actual data
  const datePills = [...new Set(
    MOCK_MATCHES.map(m =>
      new Date(m.scheduledAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    )
  )].slice(0, 6);

  return (
    <div className="flex gap-5 items-start">
      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Lịch thi đấu &amp; Kết quả</h1>
          <p className="mt-1 text-xs text-slate-500">Lọc theo ngày, trạng thái hoặc bảng đấu</p>
        </div>

        {/* Date pills */}
        <div className="flex flex-wrap gap-2">
          {datePills.map(d => (
            <button
              key={d}
              className="rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: '#94a3b8',
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Status pills */}
          {STATUS_FILTERS.map(f => {
            const isActive = statusFilter === f.value;
            const styleActive = (() => {
              switch (f.color) {
                case 'red':   return { background: 'rgba(239,68,68,0.15)',  border: '1px solid rgba(239,68,68,0.4)',   color: '#f87171' };
                case 'cyan':  return { background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.35)', color: 'var(--es-cyan)' };
                case 'amber': return { background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', color: '#f59e0b' };
                case 'green': return { background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.35)', color: '#34d399' };
                default:      return { background: 'rgba(155,92,246,0.15)', border: '1px solid rgba(155,92,246,0.4)',  color: 'var(--es-purple)' };
              }
            })();
            return (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
                style={
                  isActive
                    ? styleActive
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }
                }
              >
                {f.label}
              </button>
            );
          })}

          {/* Phase buttons */}
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
          >
            {(['all', 'group', 'playoff'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPhaseFilter(p)}
                className="px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                style={{
                  color: phaseFilter === p ? 'var(--es-cyan)' : '#64748b',
                  background: phaseFilter === p ? 'rgba(34,211,238,0.1)' : 'transparent',
                }}
              >
                {p === 'all' ? 'Tất cả' : p === 'group' ? 'Vòng bảng' : 'Playoff'}
              </button>
            ))}
          </div>

          {/* Group select */}
          <select
            value={groupFilter}
            onChange={e => setGroupFilter(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer focus:outline-none"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
            }}
          >
            <option value="all">Tất cả bảng</option>
            {MOCK_GROUPS.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
        </div>

        {/* Result count */}
        <p className="text-xs text-slate-600">{filtered.length} trận</p>

        {/* Matches grouped by date */}
        <div className="space-y-8">
          {Object.entries(byDate).map(([date, matches]) => (
            <div key={date}>
              <div
                className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-400 pb-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <Calendar className="size-3.5" style={{ color: 'var(--es-purple)' }} />
                {date}
                <span
                  className="ml-auto rounded-full px-2 py-0.5 text-[10px]"
                  style={{ background: 'rgba(155,92,246,0.1)', color: 'var(--es-purple)' }}
                >
                  {matches.length} trận
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map(m => <MatchCard key={m._id} match={m} />)}
              </div>
            </div>
          ))}

          {Object.keys(byDate).length === 0 && (
            <div className="py-16 text-center">
              <Calendar className="mx-auto mb-3 size-10 opacity-20" style={{ color: 'var(--es-purple)' }} />
              <p className="text-sm text-slate-600">Không có trận nào phù hợp bộ lọc</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <PublicSidebar />
    </div>
  );
};
