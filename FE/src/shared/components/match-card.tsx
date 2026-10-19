import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { Match } from '@/shared/types/esports.types';
import { TeamAvatar } from './team-avatar';
import { cn } from '@/shared/lib/utils';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
  className?: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string; border: string; glow?: string }> = {
  ongoing:         { label: 'LIVE',         color: '#f87171', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.35)',  glow: 'rgba(239,68,68,0.12)' },
  scheduled:       { label: 'Sắp diễn ra', color: '#22d3ee', bg: 'rgba(34,211,238,0.1)',   border: 'rgba(34,211,238,0.3)',  glow: undefined },
  pending_confirm: { label: 'Chờ xác nhận',color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.3)',  glow: undefined },
  confirmed:       { label: 'Hoàn thành',  color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.25)', glow: undefined },
  cancelled:       { label: 'Đã huỷ',      color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)', glow: undefined },
};

export const MatchCard = ({ match, compact = false, className }: MatchCardProps) => {
  const isLive = match.status === 'ongoing';
  const s = STATUS_STYLE[match.status] ?? STATUS_STYLE.scheduled;

  return (
    <Link
      to={`/matches/${match._id}`}
      className={cn('group block rounded-xl transition-all duration-200', compact ? 'p-3' : 'p-4', className)}
      style={{
        background: isLive
          ? 'linear-gradient(135deg, rgba(239,68,68,0.06), var(--es-bg-card))'
          : 'var(--es-bg-card)',
        border: `1px solid ${isLive ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: isLive ? `0 0 20px ${s.glow}` : 'none',
      }}
      onMouseEnter={e => {
        if (!isLive) {
          (e.currentTarget as HTMLElement).style.border = '1px solid rgba(155,92,246,0.3)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 0 14px rgba(155,92,246,0.08)';
        }
      }}
      onMouseLeave={e => {
        if (!isLive) {
          (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.07)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }
      }}
    >
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="truncate text-[10px] text-slate-600">{match.round} · {match.format}</span>
        {/* Status badge */}
        <span
          className="shrink-0 flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
        >
          {isLive && (
            <span
              className="inline-block size-1.5 rounded-full"
              style={{ background: s.color, animation: 'pulse 1.5s ease-in-out infinite' }}
            />
          )}
          {s.label}
        </span>
      </div>

      {/* Teams vs score */}
      <div className="flex items-center gap-2">
        {/* Team A */}
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          <TeamAvatar name={match.teamA?.name ?? '?'} tag={match.teamA?.tag ?? '?'} logoUrl={match.teamA?.logoUrl} size="sm" />
          <span className={cn('truncate text-sm font-semibold', match.winnerId === match.teamA?._id ? 'text-white' : 'text-slate-300')}>
            {match.teamA?.name ?? 'TBD'}
          </span>
        </div>

        {/* Score */}
        <div className="flex shrink-0 items-center gap-1 text-center px-2">
          {match.status === 'scheduled' ? (
            <span
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ background: 'rgba(34,211,238,0.08)', color: 'var(--es-cyan)', border: '1px solid rgba(34,211,238,0.2)' }}
            >
              VS
            </span>
          ) : (
            <>
              <span
                className="text-xl font-extrabold tabular-nums w-6 text-center"
                style={{ color: match.winnerId === match.teamA?._id ? 'var(--es-cyan)' : '#e2e8f0' }}
              >
                {match.scoreA ?? 0}
              </span>
              <span className="text-slate-700 text-sm mx-0.5">:</span>
              <span
                className="text-xl font-extrabold tabular-nums w-6 text-center"
                style={{ color: match.winnerId === match.teamB?._id ? 'var(--es-cyan)' : '#e2e8f0' }}
              >
                {match.scoreB ?? 0}
              </span>
            </>
          )}
        </div>

        {/* Team B */}
        <div className="flex flex-1 items-center justify-end gap-2 overflow-hidden">
          <span className={cn('truncate text-right text-sm font-semibold', match.winnerId === match.teamB?._id ? 'text-white' : 'text-slate-300')}>
            {match.teamB?.name ?? 'TBD'}
          </span>
          <TeamAvatar name={match.teamB?.name ?? '?'} tag={match.teamB?.tag ?? '?'} logoUrl={match.teamB?.logoUrl} size="sm" />
        </div>
      </div>

      {/* Provisional tag */}
      {match.isProvisional && match.status !== 'scheduled' && (
        <div className="mt-2 flex justify-center">
          <span
            className="rounded px-1.5 py-0.5 text-[9px] font-bold"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b' }}
          >
            KẾT QUẢ TẠM THỜI
          </span>
        </div>
      )}

      {/* Footer */}
      {!compact && (
        <div
          className="mt-3 flex items-center gap-3 pt-2.5 text-[10px] text-slate-600"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span className="flex items-center gap-1">
            <Clock className="size-3" style={{ color: 'var(--es-purple)' }} />
            {fmtDate(match.scheduledAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3 opacity-0" />
            {fmtTime(match.scheduledAt)}
          </span>
          {match.refereeName && (
            <span className="ml-auto truncate">Trọng tài: {match.refereeName}</span>
          )}
        </div>
      )}
    </Link>
  );
};
