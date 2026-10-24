import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Play, ExternalLink, Trophy, AlertCircle } from 'lucide-react';
import { MOCK_MATCHES } from '@/shared/lib/mock-data';
import { MatchStatusBadge } from '@/shared/components/status-badge';

// Logo lớn không viền — dùng cho VS panel
function MatchTeamLogo({ name, tag, logoUrl }: { name: string; tag: string; logoUrl?: string }) {
  const [err, setErr] = useState(false);
  return (
    <div
      className="flex items-center justify-center rounded-2xl overflow-hidden"
      style={{ width: 96, height: 96, borderRadius: '50%', background: '#1a2035', border: '2px solid rgba(255,255,255,0.18)', boxShadow: '0 4px 16px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      {logoUrl && !err
        ? <img src={logoUrl} alt={name} className="w-full h-full object-cover" onError={() => setErr(true)} />
        : <span className="text-2xl font-extrabold text-slate-600">{tag.slice(0, 3)}</span>
      }
    </div>
  );
}

export const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const match = MOCK_MATCHES.find(m => m._id === id);

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-600">
        <AlertCircle className="mb-3 size-12 opacity-40" />
        <p className="font-medium text-slate-400">Không tìm thấy trận đấu</p>
        <Link to="/schedule" className="mt-4 text-sm text-amber-400 hover:underline">← Quay lại lịch đấu</Link>
      </div>
    );
  }

  const isLive = match.status === 'ongoing';
  const isDone = match.status === 'confirmed';

  function fmtDateTime(iso: string) {
    return new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back */}
      <Link to="/schedule" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-400 transition-colors">
        <ArrowLeft className="size-4" /> Lịch thi đấu
      </Link>

      {/* Hero card */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 ${
        isLive ? 'border-amber-500/50 bg-gradient-to-br from-amber-950 to-card shadow-[0_0_32px_rgba(245,158,11,0.12)]'
               : 'border-white/10 public-card'
      }`}>
        {isLive && <div className="pointer-events-none absolute inset-0 bg-amber-500/3" />}

        {/* Status + round */}
        <div className="mb-6 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{match.round}</p>
            <p className="mt-0.5 text-xs text-slate-600">{match.format}</p>
          </div>
          <MatchStatusBadge status={match.status} />
        </div>

        {/* VS panel */}
        <div className="flex items-center justify-between gap-4">
          {/* Team A */}
          <div className="flex flex-1 flex-col items-center gap-3 text-center">
            <MatchTeamLogo name={match.teamA?.name ?? 'TBD'} tag={match.teamA?.tag ?? '?'} logoUrl={match.teamA?.logoUrl} />
            <div>
              <p className={`text-lg font-extrabold ${match.winnerId === match.teamA?._id ? 'text-amber-400' : 'text-white'}`}>
                {match.teamA?.name ?? 'TBD'}
              </p>
              <p className="text-xs text-slate-600">{match.teamA?.tag}</p>
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-2">
            {match.status === 'scheduled' ? (
              <span className="text-2xl font-bold text-slate-600">VS</span>
            ) : (
              <div className="flex items-center gap-3">
                <span className={`text-4xl font-black tabular-nums ${match.winnerId === match.teamA?._id ? 'text-amber-400' : 'text-white'}`}>
                  {match.scoreA ?? 0}
                </span>
                <span className="text-2xl text-zinc-700">:</span>
                <span className={`text-4xl font-black tabular-nums ${match.winnerId === match.teamB?._id ? 'text-amber-400' : 'text-white'}`}>
                  {match.scoreB ?? 0}
                </span>
              </div>
            )}
            {match.isProvisional && (
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                TẠM THỜI
              </span>
            )}
            {match.winnerId && (
              <span className="flex items-center gap-1 text-xs text-amber-400">
                <Trophy className="size-3" /> Kết quả chính thức
              </span>
            )}
          </div>

          {/* Team B */}
          <div className="flex flex-1 flex-col items-center gap-3 text-center">
            <MatchTeamLogo name={match.teamB?.name ?? 'TBD'} tag={match.teamB?.tag ?? '?'} logoUrl={match.teamB?.logoUrl} />
            <div>
              <p className={`text-lg font-extrabold ${match.winnerId === match.teamB?._id ? 'text-amber-400' : 'text-white'}`}>
                {match.teamB?.name ?? 'TBD'}
              </p>
              <p className="text-xs text-slate-600">{match.teamB?.tag}</p>
            </div>
          </div>
        </div>

        {/* Info row */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10/60 pt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Calendar className="size-3" /> {fmtDateTime(match.scheduledAt)}</span>
          {match.refereeName && <span className="flex items-center gap-1"><Clock className="size-3" /> Trọng tài: {match.refereeName}</span>}
        </div>
      </div>

      {/* Per-game results */}
      {match.games.length > 0 && (
        <div className="rounded-xl border border-white/10 public-card p-5">
          <h2 className="mb-4 text-sm font-bold text-white">Kết quả từng ván</h2>
          <div className="space-y-2">
            {match.games.map(g => {
              const winner = g.winnerId === match.teamA?._id ? match.teamA : match.teamB;
              return (
                <div key={g._id} className="flex items-center justify-between rounded-lg border border-white/10/60 bg-muted/30 px-4 py-2.5">
                  <span className="text-xs text-slate-500">Ván {g.gameNumber}</span>
                  <span className="text-sm font-semibold text-white">
                    {winner?.name ?? 'TBD'} <span className="text-amber-400">thắng</span>
                  </span>
                  {g.isProvisional && <span className="text-xs text-amber-500">Tạm thời</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recordings */}
      {(match.highlightUrl || match.youtubeUrl) && isDone && (
        <div className="rounded-xl border border-white/10 public-card p-5">
          <h2 className="mb-4 text-sm font-bold text-white">Bản ghi trận đấu</h2>
          <div className="flex flex-wrap gap-3">
            {match.highlightUrl && (
              <a
                href={match.highlightUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
              >
                <Play className="size-4" /> Xem highlight (~2 phút)
              </a>
            )}
            {match.youtubeUrl && (
              <a
                href={match.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
              >
                <ExternalLink className="size-4" /> Xem full trận (YouTube)
              </a>
            )}
          </div>
        </div>
      )}

      {/* Live notice */}
      {isLive && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3 text-sm text-amber-400">
          <span className="size-2 animate-pulse rounded-full bg-amber-500" />
          Trận đang diễn ra — tỉ số được cập nhật sau mỗi ván. Bảng xếp hạng chỉ đổi sau khi admin xác nhận kết quả.
        </div>
      )}
    </div>
  );
};
