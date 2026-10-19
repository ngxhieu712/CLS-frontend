import { useState } from 'react';
import { MOCK_GROUPS, MOCK_MATCHES } from '@/shared/lib/mock-data';
import { PublicSidebar } from '@/shared/components/public-sidebar';
import type { Group } from '@/shared/types/esports.types';

// ─── Small logo ──────────────────────────────────────────────────────────────
function SmallLogo({ name, tag, logoUrl }: { name: string; tag: string; logoUrl?: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className="flex items-center justify-center rounded-full overflow-hidden shrink-0"
      style={{ width: 28, height: 28, background: '#1a2035', border: '2px solid rgba(255,255,255,0.18)', borderRadius: '50%', overflow: 'hidden' }}>
      {logoUrl && !err
        ? <img src={logoUrl} alt={name} className="w-full h-full object-cover" onError={() => setErr(true)} />
        : <span className="text-[9px] font-bold text-slate-600">{tag.slice(0,3)}</span>
      }
    </div>
  );
}

// ─── Standings table ─────────────────────────────────────────────────────────
function StandingsTable({ group }: { group: Group }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#0d1424', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(245,158,11,0.12)', borderLeft: '3px solid #f59e0b' }}>
        <p className="text-sm font-bold text-white">{group.name}</p>
        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">
          {group.standings.filter(r => r.advance).length} đội đi tiếp
        </span>
      </div>

      {/* Column headers */}
      <div className="grid gap-1 px-4 py-2"
        style={{ gridTemplateColumns: '1.5rem 1fr 4rem 3rem 3rem 3rem 3.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#334155', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        <span>#</span><span>ĐỘI</span>
        <span className="text-center">Win rate</span>
        <span className="text-center">Win</span>
        <span className="text-center">Thua</span>
        <span className="text-center">HS</span>
        <span className="text-right">ĐIỂM</span>
      </div>

      {/* Rows */}
      {group.standings.map(row => {
        const total = row.wins + row.losses;
        const wr    = total > 0 ? Math.round((row.wins / total) * 100) : 0;
        return (
          <div key={row.teamId}
            className="grid gap-1 items-center px-4 py-2.5 transition-colors hover:bg-white/[0.02]"
            style={{
              gridTemplateColumns: '1.5rem 1fr 4rem 3rem 3rem 3rem 3.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              background: row.advance ? 'rgba(245,158,11,0.02)' : 'transparent',
            }}
          >
            <span className="text-xs font-bold" style={{ color: row.advance ? '#f59e0b' : '#334155' }}>{row.rank}</span>

            {/* Team with logo */}
            <div className="flex items-center gap-2 min-w-0">
              <SmallLogo name={row.teamName} tag={row.teamTag} logoUrl={row.logoUrl} />
              <span className="truncate text-xs font-medium" style={{ color: row.advance ? '#e2e8f0' : '#64748b' }}>
                {row.teamName}
              </span>
            </div>

            {/* Win rate bar */}
            <div className="flex items-center gap-1">
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{
                  width: `${wr}%`,
                  background: row.advance ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'rgba(100,116,139,0.4)',
                  boxShadow: row.advance ? '0 0 4px rgba(245,158,11,0.4)' : 'none',
                }} />
              </div>
              <span className="text-[9px] tabular-nums" style={{ color: '#475569' }}>{wr}%</span>
            </div>

            <span className="text-center text-xs text-emerald-400 tabular-nums">{row.wins}</span>
            <span className="text-center text-xs text-red-400/60 tabular-nums">{row.losses}</span>
            <span className="text-center text-xs text-slate-500 tabular-nums">{row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}</span>
            <span className="text-right">
              <span className="inline-block rounded-full px-2 py-0.5 text-xs font-bold tabular-nums"
                style={row.advance
                  ? { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', boxShadow: '0 0 6px rgba(245,158,11,0.2)' }
                  : { color: '#334155' }}>
                {row.points}
              </span>
            </span>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex items-center gap-2 px-4 py-2 text-[9px] text-slate-600"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="size-2 rounded-full bg-amber-500 shrink-0" />
        Đi tiếp vào vòng playoff · T = Thắng · B = Thua
      </div>
    </div>
  );
}

// ─── Upcoming match row (compact) ────────────────────────────────────────────
function UpcomingRow({ match }: { match: ReturnType<typeof MOCK_MATCHES.filter>[0] }) {
  const [errA, setErrA] = useState(false);
  const [errB, setErrB] = useState(false);
  const timeStr = new Date(match.scheduledAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date(match.scheduledAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

  return (
    <div className="flex items-center gap-3 py-2 text-xs"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span className="text-[10px] text-slate-600 w-20 shrink-0">{timeStr} · Bảng B</span>

      <div className="flex items-center gap-1.5 flex-1 justify-end">
        <span className="text-slate-300 truncate">{match.teamA?.name ?? 'TBD'}</span>
        <div className="size-6 rounded overflow-hidden shrink-0" style={{ background: '#1a2035', border: '2px solid rgba(255,255,255,0.18)', borderRadius: '50%', overflow: 'hidden' }}>
          {match.teamA?.logoUrl && !errA
            ? <img src={match.teamA.logoUrl} alt="" className="w-full h-full object-cover" onError={() => setErrA(true)} />
            : <span className="text-[7px] font-bold text-amber-400 flex items-center justify-center h-full">{match.teamA?.tag?.slice(0,2)}</span>
          }
        </div>
      </div>

      <span className="text-[10px] font-bold text-slate-600 shrink-0">vs</span>

      <div className="flex items-center gap-1.5 flex-1 justify-start">
        <div className="size-6 rounded overflow-hidden shrink-0" style={{ background: '#1a2035', border: '2px solid rgba(255,255,255,0.18)', borderRadius: '50%', overflow: 'hidden' }}>
          {match.teamB?.logoUrl && !errB
            ? <img src={match.teamB.logoUrl} alt="" className="w-full h-full object-cover" onError={() => setErrB(true)} />
            : <span className="text-[7px] font-bold text-amber-400 flex items-center justify-center h-full">{match.teamB?.tag?.slice(0,2)}</span>
          }
        </div>
        <span className="text-slate-300 truncate">{match.teamB?.name ?? 'TBD'}</span>
      </div>

      <span className="text-[10px] text-slate-600 w-20 text-right shrink-0">{dateStr} · Bảng A</span>
    </div>
  );
}

// ─── GroupsPage ──────────────────────────────────────────────────────────────
export const GroupsPage = () => {
  const [activeGroup, setActiveGroup] = useState(MOCK_GROUPS[0]._id);
  const group = MOCK_GROUPS.find(g => g._id === activeGroup)!;
  const groupMatches = MOCK_MATCHES.filter(m => m.phase === 'group').slice(0, 6);

  return (
    <div className="flex gap-5 items-start">
      <div className="flex-1 min-w-0 space-y-4">
        {/* Header + tabs */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-white tracking-tight">CHI TIẾT VÒNG BẢNG</h1>
          <div className="flex gap-1 text-xs text-slate-500">
            <span className="cursor-pointer hover:text-amber-400">Progress timeline</span>
            <span className="mx-1">·</span>
            <span className="cursor-pointer hover:text-amber-400">Progliss</span>
          </div>
        </div>

        {/* Group tabs */}
        <div className="flex gap-1 rounded-lg overflow-hidden p-1"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {MOCK_GROUPS.map(g => (
            <button key={g._id}
              onClick={() => setActiveGroup(g._id)}
              className="flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer"
              style={g._id === activeGroup
                ? { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }
                : { color: '#64748b' }
              }
            >{g.name}</button>
          ))}
        </div>

        {/* Standings */}
        <StandingsTable group={group} />

        {/* Upcoming matches section */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#0d1424', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="px-4 py-2.5" style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid rgba(34,211,238,0.7)' }}>
            <p className="text-xs font-bold text-white">TRẬN ĐẤU SẮP TỚI &amp; LỊCH THI ĐẤU VÒNG BẢNG</p>
          </div>
          <div className="px-4 py-1">
            {groupMatches.map(m => <UpcomingRow key={m._id} match={m} />)}
          </div>
        </div>
      </div>

      <PublicSidebar />
    </div>
  );
};
