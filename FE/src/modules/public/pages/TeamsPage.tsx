import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Search } from 'lucide-react';
import { MOCK_TEAMS, MOCK_MATCHES, MOCK_GROUPS } from '@/shared/lib/mock-data';
import { TeamAvatar } from '@/shared/components/team-avatar';
import { MatchCard } from '@/shared/components/match-card';

// ─── Team list ─────────────────────────────────────────────────────────────
export const TeamsPage = () => {
  const [search, setSearch] = useState('');
  const filtered = MOCK_TEAMS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Các đội tham dự</h1>
        <p className="mt-1 text-sm text-slate-500">{MOCK_TEAMS.length} đội — {MOCK_GROUPS.length} bảng</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          placeholder="Tìm đội..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 public-card py-2.5 pl-9 pr-4 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none"
        />
      </div>

      {/* Group by group */}
      {MOCK_GROUPS.map(g => {
        const teams = filtered.filter(t => t.groupId === g._id);
        if (!teams.length) return null;
        return (
          <div key={g._id}>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-400">{g.name}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {teams.map(team => (
                <Link
                  key={team._id}
                  to={`/teams/${team._id}`}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 public-card p-4 transition-all hover:border-amber-500/30 hover:shadow-[0_0_12px_rgba(245,158,11,0.08)]"
                >
                  <TeamAvatar name={team.name} tag={team.tag} logoUrl={team.logoUrl} size="md" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white group-hover:text-amber-400 transition-colors">{team.name}</p>
                    <p className="text-xs text-slate-500">[{team.tag}]</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="py-16 text-center text-slate-600">
          <Users className="mx-auto mb-3 size-10 opacity-30" />
          <p>Không tìm thấy đội nào</p>
        </div>
      )}
    </div>
  );
};

// ─── Team detail ───────────────────────────────────────────────────────────
export const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const team = MOCK_TEAMS.find(t => t._id === id);
  const group = MOCK_GROUPS.find(g => g._id === team?.groupId);
  const standing = group?.standings.find(s => s.teamId === id);
  const teamMatches = MOCK_MATCHES.filter(m => m.teamA?._id === id || m.teamB?._id === id);

  if (!team) {
    return (
      <div className="py-24 text-center text-slate-600">
        <p>Không tìm thấy đội</p>
        <Link to="/teams" className="mt-2 text-sm text-amber-400 hover:underline">← Danh sách đội</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/teams" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-400 transition-colors">
        <ArrowLeft className="size-4" /> Danh sách đội
      </Link>

      {/* Team hero */}
      <div className="flex items-center gap-5 rounded-2xl border border-white/10 public-card p-6">
        <TeamAvatar name={team.name} tag={team.tag} logoUrl={team.logoUrl} size="lg" />
        <div>
          <h1 className="text-2xl font-extrabold text-white">{team.name}</h1>
          <p className="text-sm text-slate-500">[{team.tag}]  ·  {group?.name ?? 'Chưa có bảng'}</p>
          {standing && (
            <div className="mt-2 flex flex-wrap gap-3 text-xs">
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-400">{standing.wins} Thắng</span>
              <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-red-400">{standing.losses} Thua</span>
              <span className={`rounded-full px-2 py-0.5 font-bold ${standing.advance ? 'bg-amber-500/20 text-amber-400' : 'bg-muted/80 text-slate-300'}`}>
                {standing.points} điểm {standing.advance ? '· Đi tiếp ✓' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Players placeholder */}
      <div className="rounded-xl border border-white/10 public-card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
          <Users className="size-4 text-amber-400" /> Danh sách tuyển thủ
        </h2>
        <p className="text-sm text-slate-600 italic">Dữ liệu tuyển thủ sẽ hiển thị sau khi quản lý đội hoàn thiện hồ sơ.</p>
      </div>

      {/* Match history */}
      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-white">
          <Trophy className="size-4 text-amber-400" /> Lịch sử trận ({teamMatches.length})
        </h2>
        {teamMatches.map(m => <MatchCard key={m._id} match={m} />)}
        {teamMatches.length === 0 && <p className="py-6 text-center text-sm text-slate-600">Chưa có trận đấu</p>}
      </div>
    </div>
  );
};
