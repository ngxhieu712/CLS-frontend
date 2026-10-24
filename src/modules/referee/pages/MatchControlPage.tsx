import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_MATCHES } from '@/shared/lib/mock-data';
import { MatchStatusBadge } from '@/shared/components/status-badge';
import { TeamAvatar } from '@/shared/components/team-avatar';

type GameEntry = { gameNumber: number; winnerId: string; note: string };

export const MatchControlPage = () => {
  const { id } = useParams<{ id: string }>();
  const match = MOCK_MATCHES.find(m => m._id === id) ?? MOCK_MATCHES[0];

  const [started, setStarted] = useState(match.status === 'ongoing');
  const [games, setGames] = useState<GameEntry[]>([]);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(match.status === 'pending_confirm' || match.status === 'confirmed');

  const maxGames = match.format === 'BO1' ? 1 : match.format === 'BO3' ? 3 : 5;
  const winsNeeded = Math.ceil(maxGames / 2);
  const scoreA = games.filter(g => g.winnerId === match.teamA?._id).length;
  const scoreB = games.filter(g => g.winnerId === match.teamB?._id).length;
  const matchOver = scoreA >= winsNeeded || scoreB >= winsNeeded;

  const addGame = (winnerId: string) => {
    if (matchOver) return;
    const gameNumber = games.length + 1;
    setGames(prev => [...prev, { gameNumber, winnerId, note: '' }]);
    toast.success(`Ván ${gameNumber}: ${winnerId === match.teamA?._id ? match.teamA?.name : match.teamB?.name} thắng`);
  };

  const removeLastGame = () => {
    setGames(prev => prev.slice(0, -1));
  };

  const submitResult = () => {
    if (!matchOver) return toast.error('Chưa có đội nào thắng đủ ván');
    setSubmitted(true);
    toast.success('Đã gửi kết quả lên admin. Chờ xác nhận.');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/referee/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-amber-400 transition-colors">
        <ArrowLeft className="size-4" /> Dashboard trọng tài
      </Link>

      {/* Match header */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold text-zinc-500">{match.round} · {match.format}</p>
          <MatchStatusBadge status={submitted ? 'pending_confirm' : started ? 'ongoing' : 'scheduled'} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 flex-col items-center gap-2 text-center">
            <TeamAvatar name={match.teamA?.name ?? 'TBD'} tag={match.teamA?.tag ?? '?'} size="lg" />
            <p className="font-bold text-white">{match.teamA?.name ?? 'TBD'}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-amber-400 tabular-nums">{scoreA}</span>
              <span className="text-2xl text-zinc-700">:</span>
              <span className="text-4xl font-black text-amber-400 tabular-nums">{scoreB}</span>
            </div>
            <p className="text-xs text-zinc-600">{maxGames} ván tối đa · thắng {winsNeeded}</p>
          </div>
          <div className="flex flex-1 flex-col items-center gap-2 text-center">
            <TeamAvatar name={match.teamB?.name ?? 'TBD'} tag={match.teamB?.tag ?? '?'} size="lg" />
            <p className="font-bold text-white">{match.teamB?.name ?? 'TBD'}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {!submitted && (
        <>
          {!started ? (
            <button
              onClick={() => setStarted(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:opacity-90 cursor-pointer"
            >
              <Play className="size-4" /> Bắt đầu trận
            </button>
          ) : (
            <div className="space-y-4">
              {/* Record game */}
              {!matchOver ? (
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="mb-4 text-sm font-semibold text-white">Ván {games.length + 1} — Đội nào thắng?</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => addGame(match.teamA?._id ?? '')}
                      className="rounded-xl border border-amber-500/30 bg-amber-500/10 py-3 text-sm font-bold text-amber-400 hover:bg-amber-500/20 cursor-pointer transition-colors"
                    >
                      {match.teamA?.name ?? 'Team A'}
                    </button>
                    <button
                      onClick={() => addGame(match.teamB?._id ?? '')}
                      className="rounded-xl border border-blue-500/30 bg-blue-500/10 py-3 text-sm font-bold text-blue-400 hover:bg-blue-500/20 cursor-pointer transition-colors"
                    >
                      {match.teamB?.name ?? 'Team B'}
                    </button>
                  </div>
                  {games.length > 0 && (
                    <button onClick={removeLastGame} className="mt-2 text-xs text-zinc-600 hover:text-red-400 cursor-pointer transition-colors">
                      ← Huỷ ván vừa nhập
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-4 py-3">
                  <CheckCircle className="size-4 text-emerald-400" />
                  <p className="text-sm font-semibold text-emerald-400">
                    {scoreA >= winsNeeded ? match.teamA?.name : match.teamB?.name} thắng trận!
                  </p>
                </div>
              )}

              {/* Game log */}
              {games.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Kết quả từng ván</p>
                  <div className="space-y-2">
                    {games.map(g => {
                      const winnerName = g.winnerId === match.teamA?._id ? match.teamA?.name : match.teamB?.name;
                      return (
                        <div key={g.gameNumber} className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                          <span className="text-xs text-zinc-600">Ván {g.gameNumber}</span>
                          <span className="text-sm font-medium text-white">{winnerName} thắng</span>
                          <span className="ml-auto text-xs text-amber-500">Tạm thời</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="mb-1.5 block text-xs text-zinc-500">Ghi chú (xử thua, bỏ cuộc, sự cố...)</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={2}
                  placeholder="Không bắt buộc..."
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-white placeholder-zinc-600 resize-none focus:border-amber-500/50 focus:outline-none"
                />
              </div>

              {/* Submit */}
              <button
                onClick={submitResult}
                disabled={!matchOver}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="size-4" /> Gửi kết quả lên admin
              </button>
            </div>
          )}
        </>
      )}

      {/* Submitted */}
      {submitted && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-4">
          <AlertCircle className="size-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-400">Đã gửi kết quả</p>
            <p className="text-xs text-zinc-500">Đang chờ admin xác nhận. Bạn không thể chỉnh sửa thêm.</p>
          </div>
        </div>
      )}
    </div>
  );
};
