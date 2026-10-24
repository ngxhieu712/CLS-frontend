import type { MatchStatus, RecordingStatus } from '@/shared/types/esports.types';
import { cn } from '@/shared/lib/utils';

const MATCH_STATUS_MAP: Record<MatchStatus, { label: string; class: string }> = {
  scheduled:       { label: 'Sắp diễn ra', class: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  ongoing:         { label: 'Đang đấu',    class: 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse' },
  pending_confirm: { label: 'Chờ xác nhận', class: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  confirmed:       { label: 'Đã xác nhận', class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  cancelled:       { label: 'Huỷ',         class: 'bg-red-500/15 text-red-400 border-red-500/30' },
};

const RECORDING_STATUS_MAP: Record<RecordingStatus, { label: string; class: string }> = {
  none:     { label: 'Chưa có',     class: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' },
  editing:  { label: 'Đang biên tập', class: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  published:{ label: 'Đã đăng',    class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
};

interface MatchStatusBadgeProps {
  status: MatchStatus;
  className?: string;
}
export const MatchStatusBadge = ({ status, className }: MatchStatusBadgeProps) => {
  const cfg = MATCH_STATUS_MAP[status];
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', cfg.class, className)}>
      {cfg.label}
    </span>
  );
};

interface RecordingStatusBadgeProps {
  status: RecordingStatus;
  className?: string;
}
export const RecordingStatusBadge = ({ status, className }: RecordingStatusBadgeProps) => {
  const cfg = RECORDING_STATUS_MAP[status];
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', cfg.class, className)}>
      {cfg.label}
    </span>
  );
};
