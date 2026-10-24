import { CheckCircle, ArrowRight, Trophy } from 'lucide-react';
import { MOCK_GROUPS, MOCK_BRACKET } from '@/shared/lib/mock-data';
import { TeamAvatar } from '@/shared/components/team-avatar';

const advancingTeams = MOCK_GROUPS.flatMap(g =>
  g.standings.filter(s => s.advance).map(s => ({ ...s, groupName: g.name }))
);

const ROUND_LABELS: Record<number, string> = { 1: 'Tứ kết', 2: 'Bán kết', 3: 'Chung kết' };

export const PlayoffSetupPage = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl font-extrabold text-white">Thiết lập Playoff</h1>
      <p className="mt-1 text-sm text-zinc-500">Xác nhận đội đi tiếp và cấu hình sơ đồ nhánh đấu</p>
    </div>

    {/* Advancing teams */}
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-bold text-white">Đội đi tiếp ({advancingTeams.length})</p>
        <span className="text-xs text-zinc-500">Top 2 mỗi bảng</span>
      </div>
      <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-white/5">
        {MOCK_GROUPS.map(g => (
          <div key={g._id} className="p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-400">{g.name}</p>
            {g.standings.filter(s => s.advance).map((s, i) => (
              <div key={s.teamId} className="mb-2 flex items-center gap-2">
                <span className={`text-xs font-bold ${i === 0 ? 'text-amber-400' : 'text-zinc-400'}`}>#{s.rank}</span>
                <span className="text-sm font-medium text-white truncate">{s.teamName}</span>
                <CheckCircle className="size-3 text-emerald-400 shrink-0 ml-auto" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

    {/* Bracket preview */}
    <div>
      <p className="mb-4 text-sm font-bold text-white">Sơ đồ playoff (nhánh đơn)</p>
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-[600px] items-start gap-6">
          {[1, 2, 3].map(round => {
            const slots = MOCK_BRACKET.filter(s => s.round === round);
            return (
              <div key={round} className="flex flex-1 flex-col gap-4">
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-1.5 text-center text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {ROUND_LABELS[round]}
                </div>
                <div className="flex flex-col justify-around" style={{ minHeight: round === 1 ? 'auto' : round === 2 ? '200px' : '380px' }}>
                  {slots.map((slot, i) => (
                    <div key={i} className="mb-3 rounded-xl border border-border bg-card p-3">
                      <PlayoffTeamRow name={slot.match?.teamA?.name} tag={slot.match?.teamA?.tag} />
                      <div className="my-1.5 flex items-center gap-2">
                        <div className="h-px flex-1 bg-muted/80" />
                        <ArrowRight className="size-3 text-zinc-700" />
                        <div className="h-px flex-1 bg-muted/80" />
                      </div>
                      <PlayoffTeamRow name={slot.match?.teamB?.name} tag={slot.match?.teamB?.tag} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* Notice */}
    <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm text-blue-300">
      <Trophy className="size-4 shrink-0 mt-0.5 text-blue-400" />
      <p>
        Cặp đấu playoff được tự động tạo khi admin xác nhận tất cả kết quả vòng bảng.
        Đội thắng tứ kết sẽ tự động được điền vào bán kết.
      </p>
    </div>
  </div>
);

function PlayoffTeamRow({ name, tag }: { name?: string; tag?: string }) {
  return (
    <div className="flex items-center gap-2">
      {name ? (
        <>
          <TeamAvatar name={name} tag={tag ?? '?'} size="sm" />
          <span className="text-sm font-medium text-white truncate">{name}</span>
        </>
      ) : (
        <>
          <div className="size-8 rounded-lg border border-dashed border-border bg-muted/30 shrink-0" />
          <span className="text-sm text-zinc-600">Chờ xác định</span>
        </>
      )}
    </div>
  );
}
