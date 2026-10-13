import { ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { MOCK_GROUPS, MOCK_MATCHES } from '@/shared/lib/mock-data';
import { MatchCard } from '@/shared/components/match-card';
import { TeamChip } from '@/shared/components/team-avatar';
import type { Group } from '@/shared/types/esports.types';

export const GroupsPage = () => {
  const [activeGroup, setActiveGroup] = useState<string>(MOCK_GROUPS[0]._id);
  const group = MOCK_GROUPS.find(g => g._id === activeGroup)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Vòng bảng</h1>
        <p className="mt-1 text-sm text-slate-500">Bảng xếp hạng và kết quả thi đấu theo từng bảng</p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
        {MOCK_GROUPS.map(g => (
          <button
            key={g._id}
            role="tab"
            aria-selected={g._id === activeGroup}
            onClick={() => setActiveGroup(g._id)}
            className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
              g._id === activeGroup
                ? 'border-amber-500/50 bg-amber-500/15 text-amber-400'
                : 'border-white/10 bg-muted/30 text-slate-400 hover:border-white/10 hover:text-white'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Standings table */}
        <div className="lg:col-span-3">
          <StandingsTable group={group} />
        </div>

        {/* Group matches */}
        <div className="space-y-3 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Trận đấu</p>
          {MOCK_MATCHES
            .filter(m => m.groupId === group._id)
            .map(m => <MatchCard key={m._id} match={m} compact />)
          }
          {MOCK_MATCHES.filter(m => m.groupId === group._id).length === 0 && (
            <p className="py-8 text-center text-sm text-slate-600">Chưa có trận đấu</p>
          )}
        </div>
      </div>
    </div>
  );
};

function StandingsTable({ group }: { group: Group }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 public-card">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="text-sm font-bold text-white">{group.name}</p>
        <span className="text-xs text-slate-500">{group.standings.filter(r => r.advance).length} đội đi tiếp</span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10/60 text-xs text-slate-500">
            <th className="px-4 py-2.5 text-left font-medium">#</th>
            <th className="px-4 py-2.5 text-left font-medium">Đội</th>
            <th className="px-4 py-2.5 text-center font-medium">T</th>
            <th className="px-4 py-2.5 text-center font-medium">B</th>
            <th className="px-4 py-2.5 text-center font-medium">HS</th>
            <th className="px-4 py-2.5 text-center font-medium">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {group.standings.map((row) => (
            <tr
              key={row.teamId}
              className={`border-b border-white/10/60 last:border-0 transition-colors hover:bg-muted/30 ${row.advance ? 'bg-amber-500/4' : ''}`}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {row.advance && <ChevronUp className="size-3 text-amber-400" />}
                  <span className={`font-bold ${row.advance ? 'text-amber-400' : 'text-slate-600'}`}>{row.rank}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <TeamChip name={row.teamName} tag={row.teamTag} logoUrl={row.logoUrl} />
              </td>
              <td className="px-4 py-3 text-center font-medium text-emerald-400">{row.wins}</td>
              <td className="px-4 py-3 text-center text-slate-400">{row.losses}</td>
              <td className="px-4 py-3 text-center text-slate-400">{row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}</td>
              <td className="px-4 py-3 text-center">
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${row.advance ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300'}`}>
                  {row.points}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-2 border-t border-white/10/60 px-4 py-2.5 text-xs text-slate-600">
        <ChevronUp className="size-3 text-amber-400" />
        <span>Đi tiếp vào vòng playoff</span>
        <span className="mx-1">·</span>
        <span>T = Thắng, B = Thua, HS = Hiệu số</span>
      </div>
    </div>
  );
}
