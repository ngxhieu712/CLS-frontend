import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, GitBranch, RefreshCw, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/shared/components/page-header';
import { TeamAvatar } from '@/shared/components/team-avatar';
import { Button } from '@/shared/components/ui/button';
import { MOCK_GROUPS } from '@/shared/lib/mock-data';

const ROUND_LABELS = ['Tứ kết', 'Bán kết', 'Chung kết'];

type Seed = { teamId: string; teamName: string; teamTag: string; logoUrl?: string; groupName: string; rank: number };

export const PlayoffSetupPage = () => {
  const [manualAdvancers, setManualAdvancers] = useState<Record<string, string>>({ g3: 't10' });
  const [generated, setGenerated] = useState(false);

  const bracketTeams = useMemo(() => {
    const seeds: Seed[] = [];
    for (const group of MOCK_GROUPS) {
      const standings = [...group.standings].sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.wins - a.wins);
      const cutoff = standings[1];
      const tiedAtCutoff = standings.filter((row) => row.points === cutoff.points && row.goalDiff === cutoff.goalDiff);
      const manualChoice = manualAdvancers[group._id];
      const chosenSecond = tiedAtCutoff.length > 1
        ? standings.find((row) => row.teamId === manualChoice) ?? cutoff
        : cutoff;
      const first = standings.find((row) => row.teamId !== chosenSecond.teamId) ?? standings[0];

      [first, chosenSecond].forEach((row, index) => seeds.push({
        teamId: row.teamId,
        teamName: row.teamName,
        teamTag: row.teamTag,
        logoUrl: row.logoUrl,
        groupName: group.name,
        rank: index + 1,
      }));
    }
    return seeds;
  }, [manualAdvancers]);

  const quarterFinals = [
    [bracketTeams[0], bracketTeams[3]],
    [bracketTeams[2], bracketTeams[1]],
    [bracketTeams[4], bracketTeams[7]],
    [bracketTeams[6], bracketTeams[5]],
  ];

  const tieGroups = MOCK_GROUPS.filter((group) => {
    const ranked = [...group.standings].sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.wins - a.wins);
    const cutoff = ranked[1];
    return ranked.filter((row) => row.points === cutoff.points && row.goalDiff === cutoff.goalDiff).length > 1;
  });

  const generate = () => {
    if (bracketTeams.length !== MOCK_GROUPS.length * 2) {
      toast.error('Mỗi bảng phải có đủ đội trước khi tạo nhánh playoff.');
      return;
    }
    setGenerated(true);
    toast.success('Đã tạo nhánh playoff bản xem trước từ kết quả vòng bảng.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thiết lập playoff"
        description="Xác định đội đi tiếp, xử lý đồng điểm và kiểm tra các cặp đấu loại trực tiếp."
        actions={<Button variant="outline" onClick={generate}><RefreshCw className="size-4" /> Tạo lại nhánh</Button>}
      />

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5">
          <div><h2 className="text-sm font-semibold">Suất playoff theo bảng</h2><p className="mt-1 text-xs text-muted-foreground">Hai đội đầu bảng đi tiếp · Xếp theo điểm, hiệu số và số trận thắng.</p></div>
          <span className="rounded-full border border-emerald-500/25 bg-emerald-500/5 px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-300">{bracketTeams.length} đội đủ điều kiện</span>
        </div>
        <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {MOCK_GROUPS.map((group) => {
            const rows = bracketTeams.filter(({ groupName }) => groupName === group.name);
            const hasTie = tieGroups.some(({ _id }) => _id === group._id);
            const tiedTeams = [...group.standings]
              .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.wins - a.wins)
              .slice(1)
              .filter((row) => {
                const cutoff = [...group.standings].sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.wins - a.wins)[1];
                return row.points === cutoff.points && row.goalDiff === cutoff.goalDiff;
              });

            return (
              <div key={group._id} className="p-4">
                <h3 className="mb-3 text-xs font-semibold text-muted-foreground">{group.name}</h3>
                <div className="space-y-2">
                  {rows.map((seed) => (
                    <div key={seed.teamId} className="flex items-center gap-2 rounded-lg border border-border bg-background/70 px-2.5 py-2">
                      <span className="w-6 text-xs font-semibold tabular-nums text-primary">#{seed.rank}</span>
                      <TeamAvatar name={seed.teamName} tag={seed.teamTag} size="sm" />
                      <span className="min-w-0 flex-1 truncate text-xs font-medium">{seed.teamName}</span>
                      <CheckCircle2 className="size-4 text-emerald-500" />
                    </div>
                  ))}
                </div>
                {hasTie && (
                  <label className="mt-3 block space-y-1.5 text-xs">
                    <span className="font-medium text-amber-700 dark:text-amber-300">Đồng điểm tại suất cuối — chọn đội đi tiếp</span>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={manualAdvancers[group._id] ?? tiedTeams[0]?.teamId}
                      onChange={(event) => setManualAdvancers((current) => ({ ...current, [group._id]: event.target.value }))}
                    >
                      {tiedTeams.map((team) => <option key={team.teamId} value={team.teamId}>{team.teamName} · {team.points} điểm · HS {team.goalDiff > 0 ? '+' : ''}{team.goalDiff}</option>)}
                    </select>
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><GitBranch className="size-4" /></div>
            <div><h2 className="text-sm font-semibold">Sơ đồ playoff · Nhánh đơn</h2><p className="mt-1 text-xs text-muted-foreground">Nhất bảng gặp nhì bảng khác theo cặp A–B và C–D.</p></div>
          </div>
          {generated && <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Bản xem trước đã tạo</span>}
        </div>

        <div className="overflow-x-auto p-4">
          <div className="grid min-w-[760px] grid-cols-[1.2fr_1fr_0.85fr] gap-6">
            <RoundColumn title={ROUND_LABELS[0]}>
              {quarterFinals.map((pair, index) => <MatchSlot key={index} label={`Tứ kết ${index + 1}`} teams={pair} />)}
            </RoundColumn>
            <RoundColumn title={ROUND_LABELS[1]}>
              <MatchSlot label="Bán kết 1" teams={[]} />
              <MatchSlot label="Bán kết 2" teams={[]} />
            </RoundColumn>
            <RoundColumn title={ROUND_LABELS[2]}>
              <MatchSlot label="Chung kết" teams={[]} champion />
            </RoundColumn>
          </div>
        </div>

        <div className="flex items-start gap-2.5 border-t border-border bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <Trophy className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>Các vòng tiếp theo sẽ được điền bằng đội thắng ở vòng trước. Đây là dữ liệu mẫu frontend; cần xác nhận toàn bộ kết quả vòng bảng trước khi khóa nhánh.</p>
        </div>
      </section>
    </div>
  );
};

function RoundColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="space-y-3"><h3 className="rounded-md bg-muted/70 px-3 py-2 text-center text-xs font-semibold">{title}</h3><div className="flex min-h-[440px] flex-col justify-around gap-3">{children}</div></div>;
}

function MatchSlot({ label, teams, champion = false }: { label: string; teams: (Seed | undefined)[]; champion?: boolean }) {
  return (
    <div className={`rounded-lg border bg-background p-3 ${champion ? 'border-amber-500/30' : 'border-border'}`}>
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">{champion && <Trophy className="size-3.5 text-amber-500" />}{label}</p>
      {[0, 1].map((index) => {
        const team = teams[index];
        return <div key={index} className={`flex items-center gap-2 border-t border-border py-2 ${index === 0 ? '' : ''}`}>
          {team ? <><TeamAvatar name={team.teamName} tag={team.teamTag} size="sm" /><span className="min-w-0 flex-1 truncate text-xs font-medium">{team.teamName}</span><span className="text-[10px] text-muted-foreground">{team.groupName} #{team.rank}</span></> : <><span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">?</span><span className="flex-1 text-xs text-muted-foreground">{index === 0 ? 'Thắng trận trước' : 'Chờ đối thủ'}</span><ArrowRight className="size-3.5 text-muted-foreground" /></>}
        </div>;
      })}
    </div>
  );
}
