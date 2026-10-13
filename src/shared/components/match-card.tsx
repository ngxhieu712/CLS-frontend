import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import type { Match } from '@/shared/types/esports.types';
import { MatchStatusBadge } from './status-badge';
import { TeamAvatar } from './team-avatar';
import { cn } from '@/shared/lib/utils';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
  className?: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export const MatchCard = ({ match, compact = false, className }: MatchCardProps) => {
  const isLive = match.status === 'ongoing';

  return (
    <Link
      to={`/matches/${match._id}`}
      className={cn(
        'group block rounded-xl border public-card transition-all duration-200',
        isLive
          ? 'border-amber-500/50 shadow-[0_0_16px_rgba(245,158,11,0.15)]'
          : 'border-border hover:border-amber-500/30 hover:shadow-[0_0_12px_rgba(245,158,11,0.08)]',
        compact ? 'p-3' : 'p-4',
        className
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="truncate text-xs text-zinc-500">{match.round} · {match.format}</span>
        <MatchStatusBadge status={match.status} />
      </div>

      {/* Teams vs score */}
      <div className="flex items-center gap-3">
        {/* Team A */}
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          <TeamAvatar name={match.teamA?.name ?? '?'} tag={match.teamA?.tag ?? '?'} logoUrl={match.teamA?.logoUrl} size="sm" />
          <span className="truncate text-sm font-semibold text-white">{match.teamA?.name ?? 'TBD'}</span>
        </div>

        {/* Score */}
        <div className="flex shrink-0 items-center gap-1.5 text-center">
          {match.status === 'scheduled' ? (
            <span className="text-xs font-medium text-zinc-500">VS</span>
          ) : (
            <>
              <span className={cn('w-5 text-center text-lg font-bold tabular-nums', match.winnerId === match.teamA?._id ? 'text-amber-400' : 'text-white')}>
                {match.scoreA ?? 0}
              </span>
              <span className="text-zinc-600">:</span>
              <span className={cn('w-5 text-center text-lg font-bold tabular-nums', match.winnerId === match.teamB?._id ? 'text-amber-400' : 'text-white')}>
                {match.scoreB ?? 0}
              </span>
              {match.isProvisional && (
                <span className="ml-1 rounded border border-amber-500/40 bg-amber-500/10 px-1 py-0.5 text-[9px] text-amber-400">TẠM THỜI</span>
              )}
            </>
          )}
        </div>

        {/* Team B */}
        <div className="flex flex-1 items-center justify-end gap-2 overflow-hidden">
          <span className="truncate text-right text-sm font-semibold text-white">{match.teamB?.name ?? 'TBD'}</span>
          <TeamAvatar name={match.teamB?.name ?? '?'} tag={match.teamB?.tag ?? '?'} logoUrl={match.teamB?.logoUrl} size="sm" />
        </div>
      </div>

      {/* Footer */}
      {!compact && (
        <div className="mt-3 flex items-center gap-3 border-t border-border/60 pt-2.5 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {fmtDate(match.scheduledAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
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
