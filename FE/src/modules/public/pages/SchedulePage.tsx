import { useState } from 'react';
import { MOCK_MATCHES, MOCK_GROUPS } from '@/shared/lib/mock-data';
import { PublicSidebar } from '@/shared/components/public-sidebar';
import type { Match, MatchStatus } from '@/shared/types/esports.types';

// ─── Team logo circle — viền trắng mỏng, background tối ────────────────────
function TeamLogo({ name, tag, logoUrl, size = 40 }: { name: string; tag: string; logoUrl?: string; size?: number }) {
  const [err, setErr] = useState(false);
  return (
    <div className="shrink-0 overflow-hidden"
      style={{ width: size, height: size, borderRadius: '50%', background: '#1a2035', border: '2px solid rgba(255,255,255,0.18)', boxShadow: '0 2px 6px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {logoUrl && !err
        ? <img src={logoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setErr(true)} />
        : <span style={{ fontSize: size * 0.27, fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>{tag.slice(0,3)}</span>
      }
    </div>
  );
}

// ─── Status badge ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  ongoing:         { label: 'Live',                color: '#f87171', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.4)'   },
  scheduled:       { label: 'Upcoming',            color: '#22d3ee', bg: 'rgba(34,211,238,0.1)',   border: 'rgba(34,211,238,0.3)'  },
  pending_confirm: { label: 'Pending Confirmation',color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.35)' },
  confirmed:       { label: 'Completed',           color: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.3)'  },
  cancelled:       { label: 'Cancelled',           color: '#64748b', bg: 'rgba(100,116,139,0.1)',  border: 'rgba(100,116,139,0.2)' },
};

// ─── Single match row ────────────────────────────────────────────────────────
function MatchRow({ match }: { match: Match }) {
  const isLive  = match.status === 'ongoing';
  const s       = STATUS_CONFIG[match.status] ?? STATUS_CONFIG.scheduled;
  const date    = new Date(match.scheduledAt);
  const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="flex items-center gap-4 rounded-xl px-4 py-3 transition-all"
      style={{
        background: isLive ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isLive ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: isLive ? '0 0 20px rgba(239,68,68,0.08)' : 'none',
      }}
    >
      {/* Date + time */}
      <div className="w-16 shrink-0 text-center">
        <p className="text-xs font-bold text-white">{dateStr}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">{timeStr}</p>
      </div>

      <div className="h-8 w-px shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }} />

      {/* Team A */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <span className="text-sm font-semibold text-white text-right truncate">{match.teamA?.name ?? 'TBD'}</span>
        <TeamLogo name={match.teamA?.name ?? ''} tag={match.teamA?.tag ?? '?'} logoUrl={match.teamA?.logoUrl} size={36} />
      </div>

      {/* Score / VS */}
      <div className="flex items-center gap-2 shrink-0 w-24 justify-center">
        {isLive && (
          <span className="absolute text-[9px] font-bold text-red-400 -mt-7"
            style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>LIVE</span>
        )}
        {match.status === 'scheduled' ? (
          <span className="text-sm font-bold px-3 py-1 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>VS</span>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold tabular-nums" style={{ color: match.winnerId === match.teamA?._id ? '#f59e0b' : '#e2e8f0' }}>{match.scoreA ?? 0}</span>
            <span className="text-slate-600">:</span>
            <span className="text-xl font-extrabold tabular-nums" style={{ color: match.winnerId === match.teamB?._id ? '#f59e0b' : '#e2e8f0' }}>{match.scoreB ?? 0}</span>
          </div>
        )}
        <div className="text-[9px] text-slate-600 mt-1">{match.format}</div>
      </div>

      {/* Team B */}
      <div className="flex items-center gap-2 flex-1 justify-start">
        <TeamLogo name={match.teamB?.name ?? ''} tag={match.teamB?.tag ?? '?'} logoUrl={match.teamB?.logoUrl} size={36} />
        <span className="text-sm font-semibold text-white truncate">{match.teamB?.name ?? 'TBD'}</span>
      </div>

      {/* Status badge */}
      <div className="shrink-0 w-36 text-right">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold"
          style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
        >
          {isLive && <span className="size-1.5 rounded-full bg-red-400 animate-pulse" />}
          {s.label}
        </span>
      </div>
    </div>
  );
}

// ─── SchedulePage ────────────────────────────────────────────────────────────
const STATUS_FILTERS: { value: MatchStatus | 'all'; label: string }[] = [
  { value: 'all',              label: 'Tất cả' },
  { value: 'ongoing',          label: '🔴 Live' },
  { value: 'scheduled',        label: 'Upcoming' },
  { value: 'pending_confirm',  label: 'Pending' },
  { value: 'confirmed',        label: 'Completed' },
];

const ROUND_FILTERS = ['Vòng Thua', 'Vòng Quarter', 'Vòng Semi', 'Vòng Marter', 'Vòng Waith'];

export const SchedulePage = () => {
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'all'>('all');
  const [groupFilter,  setGroupFilter]  = useState('all');

  // Date pills từ dữ liệu thật
  const datePills = [...new Set(
    MOCK_MATCHES.map(m => new Date(m.scheduledAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }))
  )].slice(0, 8);

  const filtered = MOCK_MATCHES.filter(m => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (groupFilter  !== 'all' && m.groupId !== groupFilter)  return false;
    return true;
  });

  // Group by date
  const byDate: Record<string, Match[]> = {};
  filtered.forEach(m => {
    const d = new Date(m.scheduledAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    byDate[d] = [...(byDate[d] ?? []), m];
  });

  return (
    <div className="flex gap-5 items-start">
      <div className="flex-1 min-w-0 space-y-4">
        {/* Header */}
        <h1 className="text-lg font-extrabold text-white tracking-tight">LỊCH THI ĐẤU GIẢI ĐẤU</h1>

        {/* Date pills */}
        <div className="flex flex-wrap gap-2">
          {datePills.map((d, i) => (
            <button key={d}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
              style={i === 0
                ? { background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: '#f59e0b' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }
              }
            >{d}</button>
          ))}
          <button className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>...</button>
          {ROUND_FILTERS.slice(0,2).map(r => (
            <button key={r} className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>{r}</button>
          ))}
        </div>

        {/* Round filter row 2 */}
        <div className="flex flex-wrap gap-2">
          {ROUND_FILTERS.slice(2).map(r => (
            <button key={r} className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>{r}</button>
          ))}
          {/* Status filter pills */}
          {STATUS_FILTERS.map(f => (
            <button key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
              style={statusFilter === f.value
                ? { background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: '#f59e0b' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }
              }>{f.label}</button>
          ))}
        </div>

        {/* Match rows grouped by date */}
        <div className="space-y-6">
          {Object.entries(byDate).map(([date, matches]) => (
            <div key={date} className="space-y-2">
              {matches.map(m => <MatchRow key={m._id} match={m} />)}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-600">
              <p>Không có trận nào</p>
            </div>
          )}
        </div>
      </div>

      <PublicSidebar />
    </div>
  );
};
