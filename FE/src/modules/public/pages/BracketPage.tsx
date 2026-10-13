import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { MOCK_BRACKET } from '@/shared/lib/mock-data';
import { MatchStatusBadge } from '@/shared/components/status-badge';
import { TeamAvatar } from '@/shared/components/team-avatar';
import type { BracketSlot } from '@/shared/types/esports.types';

const ROUND_LABELS: Record<number, string> = {
  1: 'Tứ kết',
  2: 'Bán kết',
  3: 'Chung kết',
};

export const BracketPage = () => {
  const rounds = [1, 2, 3];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Sơ đồ nhánh đấu</h1>
        <p className="mt-1 text-sm text-slate-500">Playoff nhánh đơn — Top 2 mỗi bảng đi tiếp</p>
      </div>

      {/* Bracket grid */}
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-[700px] items-start gap-6">
          {rounds.map(round => {
            const slots = MOCK_BRACKET.filter(s => s.round === round);
            return (
              <div key={round} className="flex flex-1 flex-col gap-4">
                {/* Round label */}
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wider text-amber-400">
                  {ROUND_LABELS[round]}
                </div>

                {/* Spacer to vertically center slots */}
                <div
                  className="flex flex-col justify-around"
                  style={{ minHeight: round === 1 ? 'auto' : round === 2 ? '220px' : '400px' }}
                >
                  {slots.map(slot => (
                    <BracketMatchCard key={slot.matchId ?? `empty-${slot.position}`} slot={slot} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 rounded-xl border border-white/10 public-card px-4 py-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-full bg-amber-500" /> Vòng bảng kết thúc → đội sẽ được điền tự động</span>
        <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-full bg-emerald-500" /> Đội thắng</span>
      </div>
    </div>
  );
};

function BracketMatchCard({ slot }: { slot: BracketSlot }) {
  const m = slot.match;
  const isEmpty = !m?.teamA && !m?.teamB;

  return (
    <Link
      to={m ? `/matches/${m._id}` : '#'}
      className={`block rounded-xl border p-3 transition-all duration-200 ${
        m?.status === 'ongoing'
          ? 'border-amber-500/50 public-card shadow-[0_0_16px_rgba(245,158,11,0.15)]'
          : 'border-white/10 public-card hover:border-amber-500/30'
      } ${!m ? 'pointer-events-none' : ''}`}
    >
      {isEmpty ? (
        <div className="space-y-2 py-1">
          <EmptyTeamRow />
          <div className="h-px bg-muted/50" />
          <EmptyTeamRow />
        </div>
      ) : (
        <div className="space-y-1.5">
          {/* Status */}
          {m && (
            <div className="mb-2 flex justify-end">
              <MatchStatusBadge status={m.status} />
            </div>
          )}
          <BracketTeamRow
            name={m?.teamA?.name}
            tag={m?.teamA?.tag}
            logoUrl={m?.teamA?.logoUrl}
            score={m?.scoreA}
            isWinner={m?.winnerId === m?.teamA?._id}
          />
          <div className="h-px bg-muted/50" />
          <BracketTeamRow
            name={m?.teamB?.name}
            tag={m?.teamB?.tag}
            logoUrl={m?.teamB?.logoUrl}
            score={m?.scoreB}
            isWinner={m?.winnerId === m?.teamB?._id}
          />
          {m?.isProvisional && (
            <div className="mt-1.5 text-center">
              <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-400">TẠM THỜI</span>
            </div>
          )}
        </div>
      )}
    </Link>
  );
}

function BracketTeamRow({ name, tag, logoUrl, score, isWinner }: {
  name?: string; tag?: string; logoUrl?: string; score?: number; isWinner?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <TeamAvatar name={name ?? '?'} tag={tag ?? '?'} logoUrl={logoUrl} size="sm" />
      <span className={`flex-1 truncate text-sm font-medium ${isWinner ? 'text-amber-400' : 'text-white'}`}>
        {name ?? 'TBD'}
      </span>
      {score !== undefined && (
        <span className={`text-sm font-bold tabular-nums ${isWinner ? 'text-amber-400' : 'text-slate-400'}`}>
          {score}
          {isWinner && <Trophy className="ml-1 inline size-3" />}
        </span>
      )}
    </div>
  );
}

function EmptyTeamRow() {
  return (
    <div className="flex items-center gap-2">
      <div className="size-8 rounded-lg border border-dashed border-white/10 bg-muted/30" />
      <span className="text-sm text-slate-600">Chờ xác định</span>
    </div>
  );
}
