import { useState } from 'react';
import { CheckCircle, RotateCcw, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_MATCHES } from '@/shared/lib/mock-data';
import { MatchStatusBadge } from '@/shared/components/status-badge';
import type { Match } from '@/shared/types/esports.types';

export const AdminSchedulePage = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editReason, setEditReason] = useState('');
  const [statuses, setStatuses] = useState<Record<string, Match['status']>>(
    Object.fromEntries(MOCK_MATCHES.map(m => [m._id, m.status]))
  );

  const pending = MOCK_MATCHES.filter(m => statuses[m._id] === 'pending_confirm');
  const others  = MOCK_MATCHES.filter(m => statuses[m._id] !== 'pending_confirm');

  const confirm = (id: string) => {
    setStatuses(prev => ({ ...prev, [id]: 'confirmed' }));
    setExpanded(null);
    toast.success('Kết quả đã được xác nhận. Bảng xếp hạng và bracket đã cập nhật.');
  };

  const reopen = (id: string) => {
    if (!editReason.trim()) return toast.error('Vui lòng nhập lý do mở lại');
    setStatuses(prev => ({ ...prev, [id]: 'pending_confirm' }));
    setEditReason('');
    setExpanded(null);
    toast.info('Đã mở lại kết quả — trọng tài cần nhập lại');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Lịch đấu &amp; Quản lý kết quả</h1>
        <p className="mt-1 text-sm text-zinc-500">Xem, xác nhận hoặc mở lại kết quả · Phân công trọng tài</p>
      </div>

      {/* Pending */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-orange-400">
          <AlertTriangle className="size-4" /> Chờ xác nhận ({pending.length})
        </div>
        <div className="space-y-3">
          {pending.map(m => (
            <MatchResultRow
              key={m._id}
              match={m}
              status={statuses[m._id]}
              expanded={expanded === m._id}
              onToggle={() => setExpanded(expanded === m._id ? null : m._id)}
              onConfirm={() => confirm(m._id)}
              onReopen={() => reopen(m._id)}
              reason={editReason}
              onReasonChange={setEditReason}
            />
          ))}
          {pending.length === 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-6 text-sm text-zinc-600">
              <CheckCircle className="size-4 text-emerald-500" /> Không có kết quả nào chờ xác nhận
            </div>
          )}
        </div>
      </div>

      {/* All matches */}
      <div>
        <p className="mb-3 text-sm font-bold text-zinc-400">Tất cả trận ({others.length})</p>
        <div className="space-y-2">
          {others.map(m => (
            <MatchResultRow
              key={m._id}
              match={m}
              status={statuses[m._id]}
              expanded={expanded === m._id}
              onToggle={() => setExpanded(expanded === m._id ? null : m._id)}
              onConfirm={() => confirm(m._id)}
              onReopen={() => reopen(m._id)}
              reason={editReason}
              onReasonChange={setEditReason}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

function MatchResultRow({ match, status, expanded, onToggle, onConfirm, onReopen, reason, onReasonChange }: {
  match: Match; status: Match['status']; expanded: boolean;
  onToggle: () => void; onConfirm: () => void; onReopen: () => void;
  reason: string; onReasonChange: (v: string) => void;
}) {
  const isPending  = status === 'pending_confirm';
  const isConfirmed = status === 'confirmed';

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${isPending ? 'border-orange-500/30 bg-card' : 'border-border bg-card'}`}>
      <div
        className="flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs text-zinc-500 mb-1">{match.round} · {match.format}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white">{match.teamA?.name ?? 'TBD'}</span>
            {(match.scoreA !== undefined) && (
              <span className="text-sm font-black text-amber-400 tabular-nums">{match.scoreA} : {match.scoreB}</span>
            )}
            <span className="text-sm font-semibold text-white">{match.teamB?.name ?? 'TBD'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <MatchStatusBadge status={status} />
          {expanded ? <ChevronUp className="size-4 text-zinc-500" /> : <ChevronDown className="size-4 text-zinc-500" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border bg-background px-4 py-4 space-y-3">
          {/* Game results */}
          {match.games.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-zinc-500">Kết quả từng ván</p>
              {match.games.map(g => {
                const winner = g.winnerId === match.teamA?._id ? match.teamA?.name : match.teamB?.name;
                return (
                  <div key={g._id} className="flex gap-2 text-xs text-zinc-400">
                    <span className="text-zinc-600">Ván {g.gameNumber}:</span>
                    <span>{winner} thắng</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            {isPending && (
              <button
                onClick={onConfirm}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-black cursor-pointer hover:opacity-90"
              >
                <CheckCircle className="size-4" /> Xác nhận kết quả
              </button>
            )}
            {isConfirmed && (
              <div className="w-full space-y-2">
                <p className="text-xs text-zinc-500">Lý do mở lại (bắt buộc):</p>
                <input
                  value={reason}
                  onChange={e => onReasonChange(e.target.value)}
                  placeholder="Nhập lý do chỉnh sửa..."
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none"
                />
                <button
                  onClick={onReopen}
                  className="flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400 cursor-pointer hover:bg-orange-500/20 transition-colors"
                >
                  <RotateCcw className="size-4" /> Mở lại để chỉnh sửa
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
