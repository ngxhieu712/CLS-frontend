import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { MOCK_BRACKET } from '@/shared/lib/mock-data';
import { MatchStatusBadge } from '@/shared/components/status-badge';
import { TeamAvatar } from '@/shared/components/team-avatar';
import { PublicSidebar } from '@/shared/components/public-sidebar';
import type { BracketSlot } from '@/shared/types/esports.types';

const ROUND_LABELS: Record<number, string> = {
  1: 'Tứ kết',
  2: 'Bán kết',
  3: 'Chung kết',
};

export const BracketPage = () => {
  const rounds = [1, 2, 3];

  return (
    <div className="flex gap-5 items-start">
      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Sơ đồ nhánh đấu</h1>
          <p className="mt-1 text-xs text-slate-500">Playoff nhánh đơn — Top 2 mỗi bảng đi tiếp</p>
        </div>

        {/* Bracket */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--es-bg-card)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-[640px] items-start gap-2 p-5">
              {rounds.map((round, roundIdx) => {
                const slots = MOCK_BRACKET.filter(s => s.round === round);
                // Vertical centering multiplier to visually align rounds
                const minH = round === 1 ? 'auto' : round === 2 ? '280px' : '520px';
                return (
                  <div key={round} className="flex flex-1 flex-col gap-3">
                    {/* Round label */}
                    <div
                      className="rounded-lg px-3 py-2 text-center text-[11px] font-extrabold uppercase tracking-widest"
                      style={{
                        background: roundIdx === 2
                          ? 'linear-gradient(135deg, rgba(155,92,246,0.2), rgba(34,211,238,0.12))'
                          : 'rgba(155,92,246,0.08)',
                        border: `1px solid ${roundIdx === 2 ? 'rgba(155,92,246,0.4)' : 'rgba(155,92,246,0.2)'}`,
                        color: roundIdx === 2 ? 'white' : 'var(--es-purple)',
                      }}
                    >
                      {ROUND_LABELS[round]}
                    </div>

                    {/* Connector line column */}
                    <div
                      className="flex flex-col justify-around gap-3"
                      style={{ minHeight: minH }}
                    >
                      {slots.map(slot => (
                        <BracketMatchCard
                          key={slot.matchId ?? `empty-${slot.position}`}
                          slot={slot}
                          isGrandFinal={round === 3}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div
          className="flex flex-wrap gap-4 rounded-xl px-4 py-3 text-[11px] text-slate-500"
          style={{ background: 'var(--es-bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full" style={{ background: 'var(--es-purple)' }} />
            Vòng bảng kết thúc → đội sẽ được điền tự động
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full" style={{ background: 'var(--es-cyan)' }} />
            Đội thắng
          </span>
        </div>
      </div>

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <PublicSidebar />
    </div>
  );
};

function BracketMatchCard({ slot, isGrandFinal }: { slot: BracketSlot; isGrandFinal?: boolean }) {
  const m = slot.match;
  const isEmpty = !m?.teamA && !m?.teamB;

  return (
    <Link
      to={m ? `/matches/${m._id}` : '#'}
      className="block rounded-xl p-3 transition-all duration-200"
      style={
        isGrandFinal
          ? {
              background: 'linear-gradient(135deg, rgba(155,92,246,0.12), rgba(34,211,238,0.06))',
              border: '1px solid rgba(155,92,246,0.35)',
              boxShadow: m?.status === 'ongoing' ? '0 0 20px rgba(155,92,246,0.2)' : 'none',
              pointerEvents: !m ? 'none' : 'auto',
            }
          : {
              background: 'rgba(255,255,255,0.03)',
              border: m?.status === 'ongoing'
                ? '1px solid rgba(155,92,246,0.4)'
                : '1px solid rgba(255,255,255,0.07)',
              boxShadow: m?.status === 'ongoing' ? '0 0 14px rgba(155,92,246,0.15)' : 'none',
              pointerEvents: !m ? 'none' : 'auto',
            }
      }
    >
      {isEmpty ? (
        <div className="space-y-2 py-1">
          <EmptyTeamRow />
          <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <EmptyTeamRow />
        </div>
      ) : (
        <div className="space-y-1.5">
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
          <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <BracketTeamRow
            name={m?.teamB?.name}
            tag={m?.teamB?.tag}
            logoUrl={m?.teamB?.logoUrl}
            score={m?.scoreB}
            isWinner={m?.winnerId === m?.teamB?._id}
          />
          {m?.isProvisional && (
            <div className="mt-1.5 text-center">
              <span
                className="rounded px-1.5 py-0.5 text-[9px] font-bold"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b' }}
              >
                TẠM THỜI
              </span>
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
      <span
        className="flex-1 truncate text-xs font-medium"
        style={{ color: isWinner ? 'var(--es-cyan)' : '#e2e8f0' }}
      >
        {name ?? 'TBD'}
      </span>
      {score !== undefined && (
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: isWinner ? 'var(--es-cyan)' : '#64748b' }}
        >
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
      <div
        className="size-7 rounded-lg border-dashed"
        style={{ border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
      />
      <span className="text-xs text-slate-700">Chờ xác định</span>
    </div>
  );
}
