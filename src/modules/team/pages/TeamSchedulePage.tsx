import { MOCK_MATCHES } from '@/shared/lib/mock-data';
import { MatchCard } from '@/shared/components/match-card';
import { Calendar } from 'lucide-react';

const MY_TEAM_ID = 't1';
const myMatches = MOCK_MATCHES.filter(m => m.teamA?._id === MY_TEAM_ID || m.teamB?._id === MY_TEAM_ID);

export const TeamSchedulePage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-extrabold text-white">Lịch &amp; Kết quả của đội</h1>
      <p className="mt-1 text-sm text-zinc-500">{myMatches.length} trận — chỉ các trận của Team Alpha</p>
    </div>

    {/* Group by status */}
    {(['ongoing', 'scheduled', 'pending_confirm', 'confirmed'] as const).map(status => {
      const matches = myMatches.filter(m => m.status === status);
      if (!matches.length) return null;
      const labels: Record<string, string> = {
        ongoing: 'Đang đấu', scheduled: 'Sắp tới', pending_confirm: 'Chờ xác nhận', confirmed: 'Đã hoàn thành',
      };
      return (
        <div key={status}>
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <Calendar className="size-3.5" /> {labels[status]}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map(m => <MatchCard key={m._id} match={m} />)}
          </div>
        </div>
      );
    })}

    {myMatches.length === 0 && (
      <div className="py-16 text-center text-zinc-600">
        <Calendar className="mx-auto mb-3 size-10 opacity-30" />
        <p>Chưa có trận đấu nào</p>
      </div>
    )}
  </div>
);
