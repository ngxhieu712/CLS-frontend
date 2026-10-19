import { ChevronUp, Trophy } from 'lucide-react';
import { useState } from 'react';
import { MOCK_GROUPS, MOCK_MATCHES } from '@/shared/lib/mock-data';
import { MatchCard } from '@/shared/components/match-card';
import { TeamChip } from '@/shared/components/team-avatar';
import { PublicSidebar } from '@/shared/components/public-sidebar';
import type { Group } from '@/shared/types/esports.types';

export const GroupsPage = () => {
  const [activeGroup, setActiveGroup] = useState<string>(MOCK_GROUPS[0]._id);
  const group = MOCK_GROUPS.find(g => g._id === activeGroup)!;

  return (
    <div className="flex gap-5 items-start">
      <div className="flex-1 min-w-0 space-y-5">

        {/* Title */}
        <div>
          <h1
            className="text-xl font-extrabold tracking-tight"
            style={{
              background: 'linear-gradient(90deg, #fff 40%, var(--es-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Vòng bảng
          </h1>
          <p className="mt-1 text-xs text-slate-600">Bảng xếp hạng và kết quả thi đấu</p>
        </div>

        {/* Group tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
          {MOCK_GROUPS.map(g => (
            <button
              key={g._id}
              role="tab"
              aria-selected={g._id === activeGroup}
              onClick={() => setActiveGroup(g._id)}
              className="whitespace-nowrap rounded-lg px-5 py-2 text-sm font-extrabold uppercase tracking-widest transition-all cursor-pointer"
              style={
                g._id === activeGroup
                  ? {
                      background: 'linear-gradient(135deg, rgba(155,92,246,0.2), rgba(34,211,238,0.1))',
                      border: '1px solid rgba(155,92,246,0.5)',
                      color: 'white',
                      boxShadow: '0 0 16px rgba(155,92,246,0.2)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: '#475569',
                    }
              }
            >
              {g.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
          <StandingsTable group={group} />

          <div className="space-y-3">
            <p
              className="text-[9px] font-extrabold uppercase tracking-widest"
              style={{ color: 'var(--es-purple)' }}
            >
              Trận đấu — {group.name}
            </p>
            {MOCK_MATCHES.filter(m => m.groupId === group._id).map(m => (
              <MatchCard key={m._id} match={m} compact />
            ))}
            {MOCK_MATCHES.filter(m => m.groupId === group._id).length === 0 && (
              <p className="py-8 text-center text-xs text-slate-700">Chưa có trận đấu</p>
            )}
          </div>
        </div>

      </div>
      <PublicSidebar />
    </div>
  );
};

function StandingsTable({ group }: { group: Group }) {
  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{
        background: 'var(--es-bg-card)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: 'rgba(0,0,0,0.2)',
          borderBottom: '1px solid rgba(155,92,246,0.15)',
          borderLeft: '3px solid var(--es-purple)',
        }}
      >
        <div className="flex items-center gap-2">
          <Trophy className="size-3.5" style={{ color: 'var(--es-purple)' }} />
          <p className="text-sm font-bold text-white">{group.name}</p>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{ background: 'rgba(155,92,246,0.12)', color: 'var(--es-purple)', border: '1px solid rgba(155,92,246,0.2)' }}
        >
          {group.standings.filter(r => r.advance).length} đội đi tiếp
        </span>
      </div>

      <table className="w-full">
        <thead>
          <tr
            className="text-[9px] font-extrabold uppercase tracking-widest"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#334155' }}
          >
            <th className="px-4 py-2.5 text-left w-8">#</th>
            <th className="px-4 py-2.5 text-left">Đội</th>
            <th className="px-4 py-2.5 text-left">Win rate</th>
            <th className="px-4 py-2.5 text-center">T/B</th>
            <th className="px-4 py-2.5 text-center">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {group.standings.map(row => {
            const total = row.wins + row.losses;
            const wr    = total > 0 ? Math.round((row.wins / total) * 100) : 0;
            return (
              <tr
                key={row.teamId}
                className="transition-colors hover:bg-white/[0.02]"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: row.advance ? 'rgba(155,92,246,0.025)' : 'transparent',
                }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {row.advance && <ChevronUp className="size-3" style={{ color: 'var(--es-purple)' }} />}
                    <span
                      className="text-xs font-bold tabular-nums"
                      style={{ color: row.advance ? 'var(--es-purple)' : '#334155' }}
                    >
                      {row.rank}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <TeamChip name={row.teamName} tag={row.teamTag} logoUrl={row.logoUrl} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden min-w-[48px]"
                      style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${wr}%`,
                          background: row.advance
                            ? 'linear-gradient(90deg, var(--es-purple), var(--es-cyan))'
                            : 'rgba(100,116,139,0.4)',
                          boxShadow: row.advance ? '0 0 6px rgba(155,92,246,0.4)' : 'none',
                        }}
                      />
                    </div>
                    <span className="text-[10px] tabular-nums text-slate-500 w-8 shrink-0">{wr}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-emerald-400 font-semibold tabular-nums text-xs">{row.wins}</span>
                  <span className="text-slate-700 mx-0.5">/</span>
                  <span className="text-red-400/60 tabular-nums text-xs">{row.losses}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums"
                    style={
                      row.advance
                        ? { background: 'rgba(155,92,246,0.15)', color: 'var(--es-purple)', border: '1px solid rgba(155,92,246,0.3)', boxShadow: '0 0 8px rgba(155,92,246,0.2)' }
                        : { color: '#334155' }
                    }
                  >
                    {row.points}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        className="flex items-center gap-2 px-4 py-2.5 text-[9px] text-slate-700"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <ChevronUp className="size-3" style={{ color: 'var(--es-purple)' }} />
        Đi tiếp vào vòng playoff · T = Thắng · B = Thua
      </div>
    </div>
  );
}
